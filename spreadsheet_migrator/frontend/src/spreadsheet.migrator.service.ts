import axios from "axios";
import getUuidByString from "uuid-by-string";

export default class SpreadsheetMigratorService {

    static csrftoken = SpreadsheetMigratorService.getCookie("csrftoken")
    static baseUrl = "/"

    static getCookie(name: string) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    static generateFromAttachmentExcel(file: File, configJson: string, username: string, selectedProjectId: number) {
        const formData = new FormData();
        const uuid = getUuidByString(username)
        if (selectedProjectId) {
            formData.append("config", configJson)
            formData.append("projectId", selectedProjectId.toString());
            formData.append("uuid", uuid);
            formData.append("file", file);
        }

        return axios({
            method: "post",
            baseURL: SpreadsheetMigratorService.baseUrl,
            url: "plugins/spreadsheet-migrator/migrate/",
            data: formData,
            headers: {"Content-Type": "multipart/form-data", 'X-CSRFToken': SpreadsheetMigratorService.csrftoken},
        })
    }

    static get_report(fileName: string) {
        return axios({
            method: "get",
            baseURL: SpreadsheetMigratorService.baseUrl,
            url: "plugins/spreadsheet-migrator/migrate/?file_name=" + fileName,
            headers: {"Content-Type": "multipart/form-data", 'X-CSRFToken': SpreadsheetMigratorService.csrftoken}
        })
    }

    static get_reports(username: string) {
        const uuid = getUuidByString(username)
        return axios({
            method: "get",
            baseURL: SpreadsheetMigratorService.baseUrl,
            url: "plugins/spreadsheet-migrator/migrate/?uuid=" + uuid,
            headers: {'X-CSRFToken': SpreadsheetMigratorService.csrftoken}
        })
    }

    static getMe() {
        return axios({
            method: "get",
            baseURL: SpreadsheetMigratorService.baseUrl,
            url: "api/v1/users/me",
            headers: {'X-CSRFToken': SpreadsheetMigratorService.csrftoken}
        })
    }

    static getProjects() {
        return axios({
            method: "get",
            baseURL: SpreadsheetMigratorService.baseUrl,
            url: "api/v1/projects/",
            headers: {'X-CSRFToken': SpreadsheetMigratorService.csrftoken}
        })
    }

    static deleteProjects() {
        for (let i = 43; i < 79; i++) {
            axios({
                method: "delete",
                baseURL: SpreadsheetMigratorService.baseUrl,
                url: "api/v1/projects/" + i,
                headers: {'X-CSRFToken': SpreadsheetMigratorService.csrftoken}
            })
        }

    }
}