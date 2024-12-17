import { expect } from "@playwright/test";
import { API_URLS } from "../constants/API_URL";
import { APIClient } from "./APIClient";
import { APIValidationsManager } from "../validations/APIValidationsManager";
import { SCHEMA_PATHS } from "../constants/SCHEMA_PATHS";

export class Gists {


    constructor(private apiClient: APIClient, private validationManager: APIValidationsManager) {

    }

    async createGist(payload) {
        let response = await this.apiClient.post(API_URLS.GISTS, payload);

        if (response.status() == 201) {
            expect(await this.validationManager.validateResponseToSchema(await response.json(), SCHEMA_PATHS.GIST)).toBeTruthy();
        }
    }

    async commentGist(payload, id: string) {
        let response = await this.apiClient.post(API_URLS.GISTS + "/" + id + "/comments", payload);

        if (response.status() == 201) {
            //expect(await this.validationManager.validateResponseToSchema(await response.json(), SCHEMA_PATHS.GIST)).toBeTruthy();
        }
    }


}