import { expect } from "@playwright/test";
import { APIValidationsManager } from "../validations/APIValidationsManager";
import { Utils } from "../support/Utils";
import { DataTable } from "@cucumber/cucumber";
import { APIClient } from "./APIClient";
import { API_URLS } from "../constants/API_URL";
import { SCHEMA_PATHS } from "../constants/SCHEMA_PATHS";

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
        let response = await this.apiClient.get(`${this.BASE_URL_PUBLIC_USER}${username}`);
        if (response.status() == 200) {
            await this.validateUserSchema(response);
        }
    }

    public async getLoggedUserInformation() {
        let response = await this.apiClient.get(this.BASE_URL_LOGGED_USER);
        if (response.status() == 200) {
            await this.validateUserSchema(response);
            this.apiClient.setLoggedUserName(response.json());
        }
    }

    public async retrieveLoggedProfileUsingPreviousHeade(previousheaderName: string, nextHeaderName: string) {
        await this.apiClient.usePreviousHeaderInNextRequest(previousheaderName, nextHeaderName);
        let response = await this.apiClient.get(this.BASE_URL_LOGGED_USER);
        if (response.status() == 200) {
            await this.validateUserSchema(response);
            this.apiClient.setLoggedUserName(response.json());
        }
    }

    public async updateLoggedUserInformation(dataTable: DataTable) {
        const currentDate = new Date();
        const payload = await this.utils.dataTableToPayload(dataTable, currentDate);
        let response = await this.apiClient.patch(this.BASE_URL_LOGGED_USER, payload);
        if (response.status() == 200) {
            await this.validateUserSchema(response);
            this.apiClient.setLoggedUserName(response.json());
            this.lastUpdate = currentDate;
        }
    }

    public async updateLoggedProfileUsingPreviousHeader(previousheaderName: string, nextHeaderName: string, dataTable: DataTable) {
        await this.apiClient.usePreviousHeaderInNextRequest(previousheaderName, nextHeaderName);
        const payload = await this.utils.dataTableToPayload(dataTable, this.lastUpdate);
        await this.apiClient.patch(this.BASE_URL_LOGGED_USER, payload);
    }

    public async fieldsHaveBeenUpdated(dataTable: DataTable) {
        const currentlyLoggedUser = await this.apiClient.getLoggedUser()
        dataTable.rows().forEach(([field, value]) => {
            expect(`${value} updated on ${this.lastUpdate.toISOString()}`).toEqual(`${currentlyLoggedUser[field]}`)
        });
    }

    private async validateUserSchema(response) {
        expect(await this.validationManager.validateResponseToSchema(await response.json(), SCHEMA_PATHS.USER)).toBeTruthy();
    }
}


