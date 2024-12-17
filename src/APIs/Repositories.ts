import { expect } from "@playwright/test";
import { APIClient } from "./APIClient";
import { Repository } from "../models/Repositories/Repository";
import { Utils } from "../support/Utils";
import { APIValidationsManager } from "../validations/APIValidationsManager";
import { SCHEMA_PATHS } from "../constants/SCHEMA_PATHS";
import { API_URLS } from "../constants/API_URL";

export class Repositories {

    private REPOS_LOGGED_USER = API_URLS.REPOS_LOGGED_USER

    private utils: Utils = new Utils();
    private apiClient: APIClient;
    private validationManager: APIValidationsManager = new APIValidationsManager();

    constructor(apiClient: APIClient) {
        this.apiClient = apiClient;
    }

    async getReposFromPublicUser(userName: string) {
        let response = await this.apiClient.get(`/users/${userName}/repos`);
        if (response.status() == 200) {
            expect(await this.validationManager.validateResponseToSchema(await response.json(), SCHEMA_PATHS.UNATHENTICATED_USER)).toBeTruthy();
        }
    }

    async getRepositoriesForLoggedUser() {
        let response = await this.apiClient.get(this.REPOS_LOGGED_USER);
        if (response.status() == 200) {
            expect(await this.validationManager.validateResponseToSchema(await response.json(), SCHEMA_PATHS.AUTHENTICATED_USER)).toBeTruthy();
        }
    }

    async getRepositoriesLoggedUserWithPreviousHeader(previousheaderName: string, nextHeaderName: string) {
        await this.apiClient.usePreviousHeaderInNextRequest(previousheaderName, nextHeaderName)
        await this.apiClient.get(this.REPOS_LOGGED_USER);
    }

    async getAllRepositoriesForLoggedUser(): Promise<any> {
        const allRepos = [];

        let nextUrl = this.REPOS_LOGGED_USER;
        while (nextUrl) {
            try {
                const response = await this.apiClient.get(nextUrl);

                if (response.status() === 403) {
                    throw new Error('Rate limit exceeded. Please try again later');
                }
                if (!response.ok()) {
                    throw new Error(`Failed to get commits: ${response.status()} - ${response.statusText()}`);
                }
                const commits = await response.json();
                allRepos.push(...commits);

                nextUrl = await this.utils.calculateNextUrl(response);
            } catch (error: any) {
                console.error(`Error during get: ${error.message}`);
            }
        }

        return allRepos;
    }

    public async getFirstOrLastRepositoryName(repositoryToGet: string) {
        let repositories: Repository[] = await this.getAllRepositoriesForLoggedUser();
        if ("last" == repositoryToGet.toLocaleLowerCase()) {
            return repositories[repositories.length - 1].name;
        }
        else if ("first" == repositoryToGet.toLocaleLowerCase()) {
            return repositories[0].name;
        }
        else {
            throw new Error(`Parameter '${repositoryToGet}' not supported, please use only 'first' or 'last' keywords`);
        }
    }
}