import { DataTable } from "@cucumber/cucumber";
import { APIRequestContext, APIResponse, expect, request } from "@playwright/test";
import { APIValidationsManager } from "../validations/APIValidationsManager";
import { LoggedUser } from "../models/User/LoggedUser";

export class APIClient {

    private headers: { [key: string]: string };
    private queryParams;
    private apiRequestContext: APIRequestContext;
    private apiResponse: APIResponse;
    private loggedUser: LoggedUser;
    private validationsManager: APIValidationsManager;

    constructor(validationsManager: APIValidationsManager, apiRequestContext: APIRequestContext) {
        this.apiRequestContext = apiRequestContext;
        this.validationsManager = validationsManager;
    }

    async setAuthenticatedUser(role: string) {
        if ("admin" == role.toLocaleLowerCase()) {
            this.headers = { 'authorization': `Bearer ${process.env.AUTH_TOKEN}` }
        }
        else if ("viewer" == role.toLocaleLowerCase()) {
            this.headers = { 'authorization': `Bearer ${process.env.AUTH_TOKEN_RESTRICTED_PERMISSIONS}` }
        }
    }

    async setLoggedUserName(response) {
        this.loggedUser = response;
    }

    async setUnauthenticatedUser() {
        await this.setHeaders({ 'authorization': undefined });
    }

    async get(endpoint?: string): Promise<APIResponse> {
        this.apiResponse = await this.apiRequestContext.get(endpoint, { headers: this.headers, params: this.queryParams })
        this.validationsManager.setAPIResponse(this.apiResponse);
        this.resetQueryParameters();
        return this.apiResponse;
    }

    async patch(endpoint?: string, payload?: string): Promise<APIResponse> {
        this.apiResponse = await this.apiRequestContext.patch(endpoint, { data: payload, headers: this.headers, params: this.queryParams })
        this.validationsManager.setAPIResponse(this.apiResponse)
        this.resetQueryParameters();
        return this.apiResponse;
    }

    async getResponseHeader(headerName: string): Promise<string> {
        const headers = this.apiResponse.headers();
        return headers[headerName];
    }

    async getLoggedUser(): Promise<LoggedUser> {
        return this.loggedUser;
    }

    async setHeaders(header: { [key: string]: string }) {
        this.headers = { ...this.headers, ...header }
    }

    async setQueryParameters(dataTable: DataTable) {
        if (!this.queryParams) {
            this.queryParams = new URLSearchParams();
        }
        dataTable.rows().forEach(([key, value]: [string, string]) => {
            this.queryParams.append(key, value);
        });
    }

    async isUserAuth(): Promise<boolean> {
        if (this.headers['authorization'] != undefined) {
            return true;
        }
        return false;
    }

    private resetQueryParameters() {
        this.queryParams = null;
    }

    async usePreviousHeaderInNextRequest(previousheaderName: string, nextHeaderName: string) {
        const headerValue = await this.getResponseHeader(previousheaderName.toLocaleLowerCase());
        await this.setHeaders({ [nextHeaderName]: headerValue });
    }
}

