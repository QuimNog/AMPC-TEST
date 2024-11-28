import { expect } from "@playwright/test";
import { APIValidationsManager } from "../validations/APIValidationsManager";
import { Utils } from "../support/Utils";
import { DataTable } from "@cucumber/cucumber";
import { APIClient } from "./APIClient";
import { API_URLS } from "../constants/API_URL";
import { SCHEMA_PATHS } from "../constants/SCHEMA_PATHS";
import { LoggedUser } from "../models/User/LoggedUser";

export class User {

    private BASE_URL_PUBLIC_USER = API_URLS.PUBLIC_USER;
    private BASE_URL_LOGGED_USER = API_URLS.LOGGED_USER;

    private apiClient: APIClient
    private validationManager: APIValidationsManager;
    private utils: Utils;
    private lastUpdate: Date;

    constructor(apiClient: APIClient) {
        this.apiClient = apiClient;
        this.utils = new Utils();
        this.validationManager = new APIValidationsManager();
    }

    public async getPublicInfomation(username: string) {
        let url = `${this.BASE_URL_PUBLIC_USER}${username}`
        let response = await this.apiClient.get(`${this.BASE_URL_PUBLIC_USER}${username}`);
        if (response.status() == 200) {
            expect(await this.validationManager.validateResponseToSchema(await response.json(), SCHEMA_PATHS.USER)).toBeTruthy();
        }
    }

    public async getLoggedUserInformation() {
        let response = await this.apiClient.get(this.BASE_URL_LOGGED_USER);
        if (response.status() == 200) {
            expect(await this.validationManager.validateResponseToSchema(await response.json(), SCHEMA_PATHS.USER)).toBeTruthy();
            this.apiClient.setLoggedUserName(response.json());
        }
    }

    public async retrieveLoggedProfileUsingPreviousHeade(previousheaderName: string, nextHeaderName: string) {
        const headerValue = await this.apiClient.getResponseHeader(previousheaderName.toLocaleLowerCase());
        this.apiClient.setHeaders({ [nextHeaderName]: headerValue });
        let response = await this.apiClient.get(this.BASE_URL_LOGGED_USER);
        if (response.status() == 200) {
            expect(await this.validationManager.validateResponseToSchema(await response.json(), SCHEMA_PATHS.USER)).toBeTruthy();
            this.apiClient.setLoggedUserName(response.json());
        }
    }

    public async updateLoggedUserInformation(dataTable: DataTable) {
        const currentDate = new Date();
        const payload = await this.utils.dataTableToPayload(dataTable, currentDate);

        let response = await this.apiClient.patch(this.BASE_URL_LOGGED_USER, payload);
        if (response.status() == 200) {
            expect(await this.validationManager.validateResponseToSchema(await response.json(), SCHEMA_PATHS.USER)).toBeTruthy();
            this.apiClient.setLoggedUserName(response.json());
            this.lastUpdate = currentDate;
        }
    }

    public async updateLoggedProfileUsingPreviousHeader(previousheaderName: string, nextHeaderName: string, dataTable: DataTable) {
        const headerValue = await this.apiClient.getResponseHeader(previousheaderName.toLocaleLowerCase());
        this.apiClient.setHeaders({ [nextHeaderName]: headerValue });
        const payload = await this.utils.dataTableToPayload(dataTable, this.lastUpdate);
        await this.apiClient.patch(this.BASE_URL_LOGGED_USER, payload);
    }

    public async fieldsHaveBeenUpdated(dataTable: DataTable) {
        const currentlyLoggedUser = await this.apiClient.getLoggedUser()
        dataTable.rows().forEach(([field, value]) => {
            expect(`${value} updated on ${this.lastUpdate.toISOString()}`).toEqual(`${currentlyLoggedUser[field]}`)
        });
    }

}
