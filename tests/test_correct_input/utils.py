import inspect
import pathlib
import json


def read_data(config_name):
    with pathlib.Path(inspect.stack()[1].filename) as f:
        parent = f.parent
    with open(parent / "datas" / "configs" / config_name, "r") as config_file:
        config_dict = json.load(config_file)
        spreadsheet_file = open(parent / "datas" / "spreadsheets" / config_dict["file_name"], "rb")
    return spreadsheet_file, config_dict
