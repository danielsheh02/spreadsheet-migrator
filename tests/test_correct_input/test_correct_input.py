import json
import pytest
from tests_description.models import TestCase, TestSuite
from tests_representation.models import Parameter, TestPlan, Test
from plugins.spreadsheet_migrator.tests.test_correct_input import utils


@pytest.mark.django_db
class TestCorrectInput:
    def test_creation_suites(self, login_client, project):
        spreadsheet_file, config = utils.read_data("suites.json")
        columns_config = json.dumps(config["columns_config"])
        response = login_client.post('/plugins/spreadsheet-migrator/migrate/', {
            "file": spreadsheet_file,
            "uuid": "username-test",
            "projectId": str(project.id),
            "config": columns_config,
        })
        assert response.status_code == 200
        test_suites = TestSuite.objects.all()
        expected_test_suites = config["expected_data"]["suites"]["data"]
        assert len(test_suites) == config["expected_data"]["suites"]["size"]
        for i, test_suite in enumerate(test_suites):
            assert test_suite.name == expected_test_suites[i]["name"]
            assert test_suite.description == expected_test_suites[i]["description"]

    def test_creation_suites_cases(self, login_client, project):
        spreadsheet_file, config = utils.read_data("suites_cases.json")
        columns_config = json.dumps(config["columns_config"])
        response = login_client.post('/plugins/spreadsheet-migrator/migrate/', {
            "file": spreadsheet_file,
            "uuid": "username-test",
            "projectId": str(project.id),
            "config": columns_config,
        })
        assert response.status_code == 200
        test_suites = TestSuite.objects.all()
        expected_test_suites = config["expected_data"]["suites"]["data"]
        assert len(test_suites) == config["expected_data"]["suites"]["size"]
        for i, test_suite in enumerate(test_suites):
            assert test_suite.name == expected_test_suites[i]["name"]
            assert test_suite.description == expected_test_suites[i]["description"]

        test_cases = TestCase.objects.all()
        expected_test_cases = config["expected_data"]["cases"]["data"]
        assert len(test_cases) == config["expected_data"]["cases"]["size"]
        for i, test_case in enumerate(test_cases):
            assert test_case.name == expected_test_cases[i]["name"]
            assert test_case.scenario == expected_test_cases[i]["scenario"]
            assert test_case.description == expected_test_cases[i]["description"]
            assert test_case.setup == expected_test_cases[i]["setup"]
            assert test_case.teardown == expected_test_cases[i]["teardown"]
            assert test_case.estimate == expected_test_cases[i]["estimate"]

    def test_creation_suites_cases_parameters(self, login_client, project):
        spreadsheet_file, config = utils.read_data("suites_cases_parameters.json")
        columns_config = json.dumps(config["columns_config"])
        response = login_client.post('/plugins/spreadsheet-migrator/migrate/', {
            "file": spreadsheet_file,
            "uuid": "username-test",
            "projectId": str(project.id),
            "config": columns_config,
        })
        assert response.status_code == 200
        test_suites = TestSuite.objects.all()
        expected_test_suites = config["expected_data"]["suites"]["data"]
        assert len(test_suites) == config["expected_data"]["suites"]["size"]
        for i, test_suite in enumerate(test_suites):
            assert test_suite.name == expected_test_suites[i]["name"]
            assert test_suite.description == expected_test_suites[i]["description"]

        test_cases = TestCase.objects.all()
        expected_test_cases = config["expected_data"]["cases"]["data"]
        assert len(test_cases) == config["expected_data"]["cases"]["size"]
        for i, test_case in enumerate(test_cases):
            assert test_case.name == expected_test_cases[i]["name"]
            assert test_case.scenario == expected_test_cases[i]["scenario"]
            assert test_case.description == expected_test_cases[i]["description"]
            assert test_case.setup == expected_test_cases[i]["setup"]
            assert test_case.teardown == expected_test_cases[i]["teardown"]
            assert test_case.estimate == expected_test_cases[i]["estimate"]

        parameters = Parameter.objects.all()
        expected_parameters = config["expected_data"]["parameters"]["data"]
        assert len(parameters) == config["expected_data"]["parameters"]["size"]
        for i, parameter in enumerate(parameters):
            assert parameter.data == expected_parameters[i]["data"]
            assert parameter.group_name == expected_parameters[i]["group_name"]

    def test_creation_parameters(self, login_client, project):
        spreadsheet_file, config = utils.read_data("parameters.json")
        columns_config = json.dumps(config["columns_config"])
        response = login_client.post('/plugins/spreadsheet-migrator/migrate/', {
            "file": spreadsheet_file,
            "uuid": "username-test",
            "projectId": str(project.id),
            "config": columns_config,
        })
        assert response.status_code == 200

        parameters = Parameter.objects.all()
        expected_parameters = config["expected_data"]["parameters"]["data"]
        assert len(parameters) == config["expected_data"]["parameters"]["size"]
        for i, parameter in enumerate(parameters):
            assert parameter.data == expected_parameters[i]["data"]
            assert parameter.group_name == expected_parameters[i]["group_name"]

    def test_creation_plans(self, login_client, project):
        spreadsheet_file, config = utils.read_data("plans.json")
        columns_config = json.dumps(config["columns_config"])
        response = login_client.post('/plugins/spreadsheet-migrator/migrate/', {
            "file": spreadsheet_file,
            "uuid": "username-test",
            "projectId": str(project.id),
            "config": columns_config,
        })
        assert response.status_code == 200

        plans = TestPlan.objects.all()
        expected_plans = config["expected_data"]["plans"]["data"]
        assert len(plans) == config["expected_data"]["plans"]["size"]
        for i, plan in enumerate(plans):
            assert plan.name == expected_plans[i]["name"]
            assert plan.description == expected_plans[i]["description"]
            assert plan.started_at.strftime("%d.%m.%Y %H:%M:%S") == expected_plans[i]["started_at"]
            assert plan.due_date.strftime("%d.%m.%Y %H:%M:%S") == expected_plans[i]["due_date"]

    def test_creation_suites_cases_parameters_plans_tests(self, login_client, project):
        spreadsheet_file, config = utils.read_data("suites_cases_parameters_plans_tests.json")
        columns_config = json.dumps(config["columns_config"])
        response = login_client.post('/plugins/spreadsheet-migrator/migrate/', {
            "file": spreadsheet_file,
            "uuid": "username-test",
            "projectId": str(project.id),
            "config": columns_config,
        })
        assert response.status_code == 200

        test_suites = TestSuite.objects.all()
        expected_test_suites = config["expected_data"]["suites"]["data"]
        assert len(test_suites) == config["expected_data"]["suites"]["size"]
        for i, test_suite in enumerate(test_suites):
            assert test_suite.name == expected_test_suites[i]["name"]
            assert test_suite.description == expected_test_suites[i]["description"]

        test_cases = TestCase.objects.all()
        expected_test_cases = config["expected_data"]["cases"]["data"]
        assert len(test_cases) == config["expected_data"]["cases"]["size"]
        for i, test_case in enumerate(test_cases):
            assert test_case.name == expected_test_cases[i]["name"]
            assert test_case.scenario == expected_test_cases[i]["scenario"]
            assert test_case.description == expected_test_cases[i]["description"]
            assert test_case.setup == expected_test_cases[i]["setup"]
            assert test_case.teardown == expected_test_cases[i]["teardown"]
            assert test_case.estimate == expected_test_cases[i]["estimate"]

        parameters = Parameter.objects.all()
        expected_parameters = config["expected_data"]["parameters"]["data"]
        assert len(parameters) == config["expected_data"]["parameters"]["size"]
        for i, parameter in enumerate(parameters):
            assert parameter.data == expected_parameters[i]["data"]
            assert parameter.group_name == expected_parameters[i]["group_name"]

        plans = TestPlan.objects.all()
        expected_plans = config["expected_data"]["plans"]["data"]
        assert len(plans) == config["expected_data"]["plans"]["size"]
        for i, plan in enumerate(plans):
            assert plan.name == expected_plans[i]["name"]
            assert plan.description == expected_plans[i]["description"]
            assert plan.started_at.strftime("%d.%m.%Y %H:%M:%S") == expected_plans[i]["started_at"]
            assert plan.due_date.strftime("%d.%m.%Y %H:%M:%S") == expected_plans[i]["due_date"]
            assert '{0} [{1}]'.format(plan.name, ', '.join([p.data for p in plan.parameters.all()])) == \
                   expected_plans[i]["title"]

        tests = Test.objects.all()
        expected_tests = config["expected_data"]["tests"]["data"]
        assert len(tests) == config["expected_data"]["tests"]["size"]
        for i, test in enumerate(tests):
            assert test.case.name == expected_tests[i]["case"]["name"]
            assert test.case.scenario == expected_tests[i]["case"]["scenario"]
            assert test.case.description == expected_tests[i]["case"]["description"]
            assert test.case.setup == expected_tests[i]["case"]["setup"]
            assert test.case.teardown == expected_tests[i]["case"]["teardown"]
            assert test.case.estimate == expected_tests[i]["case"]["estimate"]

            assert test.plan.name == expected_tests[i]["plan"]["name"]
            assert test.plan.description == expected_tests[i]["plan"]["description"]
            assert test.plan.started_at.strftime("%d.%m.%Y %H:%M:%S") == expected_tests[i]["plan"]["started_at"]
            assert test.plan.due_date.strftime("%d.%m.%Y %H:%M:%S") == expected_tests[i]["plan"]["due_date"]
            assert '{0} [{1}]'.format(test.plan.name, ', '.join([p.data for p in test.plan.parameters.all()])) == \
                   expected_tests[i]["plan"]["title"]

    def test_creation_parameters_plans(self, login_client, project):
        spreadsheet_file, config = utils.read_data("parameters_plans.json")
        columns_config = json.dumps(config["columns_config"])
        response = login_client.post('/plugins/spreadsheet-migrator/migrate/', {
            "file": spreadsheet_file,
            "uuid": "username-test",
            "projectId": str(project.id),
            "config": columns_config,
        })
        assert response.status_code == 200

        plans = TestPlan.objects.all()
        expected_plans = config["expected_data"]["plans"]["data"]
        assert len(plans) == config["expected_data"]["plans"]["size"]
        for i, plan in enumerate(plans):
            assert plan.name == expected_plans[i]["name"]
            assert plan.description == expected_plans[i]["description"]
            assert plan.started_at.strftime("%d.%m.%Y %H:%M:%S") == expected_plans[i]["started_at"]
            assert plan.due_date.strftime("%d.%m.%Y %H:%M:%S") == expected_plans[i]["due_date"]
            assert '{0} [{1}]'.format(plan.name, ', '.join([p.data for p in plan.parameters.all()])) == \
                   expected_plans[i]["title"]

        parameters = Parameter.objects.all()
        expected_parameters = config["expected_data"]["parameters"]["data"]
        assert len(parameters) == config["expected_data"]["parameters"]["size"]
        for i, parameter in enumerate(parameters):
            assert parameter.data == expected_parameters[i]["data"]
            assert parameter.group_name == expected_parameters[i]["group_name"]
