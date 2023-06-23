from pathlib import Path
from typing import Dict, List, Tuple, Set
import pytz
from django.db import transaction

from spreadsheet_migrator.spreadsheet_migrator_lib import Parser
from spreadsheet_migrator.spreadsheet_migrator_lib import TestyCreator
from spreadsheet_migrator.spreadsheet_migrator_lib.logs.cases_logs import CasesLogs
from spreadsheet_migrator.spreadsheet_migrator_lib.logs.parameters_logs import ParametersLogs
from spreadsheet_migrator.spreadsheet_migrator_lib.logs.plans_logs import PlansLogs
from spreadsheet_migrator.spreadsheet_migrator_lib.logs.step_logs import StepLogs
from spreadsheet_migrator.spreadsheet_migrator_lib.logs.suites_logs import SuitesLogs
from django.forms.models import model_to_dict
import json
from django.core.serializers.json import DjangoJSONEncoder
from datetime import datetime
from django.http import FileResponse
from rest_framework.response import Response
from rest_framework import status

import tempfile
import glob
import os

suite_case_parameters_plan_alias = Dict[Tuple[str, str], List[Tuple[Dict, List[Dict], Dict]]]
dict_idcase_plan_idparameters_alias = Dict[int, Dict[Tuple[str, str, str, str], Set[int]]]


class Service:
    reports_dir = Path(tempfile.gettempdir()) / "testy_spreadsheet_reports"

    def get_reports(self, request):
        file_name = request.query_params.get("file_name", "")
        uuid = request.query_params.get("uuid", "")
        if file_name:
            path = self.reports_dir / file_name
            if not os.path.exists(path):
                return Response("File does not exist", status=status.HTTP_404_NOT_FOUND)
            return FileResponse(
                open(path, 'rb'),
                status=status.HTTP_200_OK
            )
        elif uuid:
            path = self.reports_dir / f"{uuid}_*_testy_logs.json"
            file_paths = glob.glob(str(path))
            reports_metadata: List[Dict] = []
            for file_path in file_paths:
                with open(file_path, "rb") as file:
                    report_dict = json.load(file)
                    reports_metadata.append(
                        {"report_file_name": os.path.basename(file.name), "report_name": report_dict["report_name"],
                         "creation_time": report_dict["creation_time"], "project": report_dict["project"]})
            return Response(reports_metadata, status=status.HTTP_200_OK)

    @staticmethod
    def fill_report(obj_logs, config):
        report = {}
        for key_info, type_info in [("config", config),
                                    ("created", obj_logs.created),
                                    ("found", obj_logs.found),
                                    ("lack_data", obj_logs.lack_data)]:
            if type_info:
                report[key_info] = type_info
        return report

    def create_report_file(self, uuid, parser: Parser, testy_creator: TestyCreator):
        report = {"project": model_to_dict(parser.project), "report_name": parser.request_data["file"].name,
                  "creation_time": datetime.now(pytz.UTC).isoformat().replace("+00:00", "Z")}
        for key, obj_logs, config in [
            ("suites", testy_creator.suites_logs, parser.config.get("suite")),
            ("cases", testy_creator.cases_logs, parser.config.get("case")),
            ("parameters", testy_creator.parameters_logs, parser.config.get("parameter")),
            ("plans", testy_creator.plans_logs, parser.config.get("plan")),
            ("steps", testy_creator.step_logs, parser.config.get("step"))
        ]:
            if config is not None:
                report_info = Service.fill_report(obj_logs, config)
                if report_info:
                    report[key] = report_info
        with tempfile.NamedTemporaryFile(prefix=uuid + "_", suffix="_testy_logs.json", delete=False, mode="w", dir=self.reports_dir) as file:
            json.dump(report, file, cls=DjangoJSONEncoder)
        return os.path.basename(file.name)

    @staticmethod
    def delete_empty_rows(parser):
        finished = False
        for i in range(parser.excel_data_ws.max_row, 0, -1):
            for cell in parser.excel_data_ws[i]:
                if cell.value is not None:
                    finished = True
                    break
            if finished:
                break
            else:
                parser.excel_data_ws.delete_rows(idx=i)

    @transaction.atomic
    def start_process(self, request) -> str:
        self.reports_dir.mkdir(parents=True, exist_ok=True)
        testy_creator = TestyCreator(
            SuitesLogs(),
            CasesLogs(),
            ParametersLogs(),
            PlansLogs(),
            StepLogs(),
            request
        )
        parser = Parser(request.data, testy_creator, json.loads(request.data["config"]))
        Service.delete_empty_rows(parser)
        if parser.config.get('suite') and (parser.config.get('step') or parser.config.get('case', {}).get('labels')):
            parser.validate_numeration()
            parser.get_or_create_suites_and_cases()
        elif parser.config.get("suite") is not None and parser.config.get("suite").get("name") is not None:
            suite_case_parameters_plan = parser.parse_datas_with_suites()
            dict_idcase_plan_idparameters = testy_creator.create_suites_cases_parameters(
                suite_case_parameters_plan,
                parser.project)
            if len(dict_idcase_plan_idparameters) > 0:
                plan_idcases_idparameters = Parser.union_cases_by_equal_parameters(dict_idcase_plan_idparameters)
                testy_creator.create_plans(plan_idcases_idparameters, parser.project)
        else:
            parameters_plan: List[Tuple[List[Dict], Dict]] = parser.parse_datas_without_suites()
            testy_creator.create_datas_without_suite(parameters_plan, parser.project)
        return Service().create_report_file(parser.uuid, parser, testy_creator)
