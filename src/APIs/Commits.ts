import { expect } from "@playwright/test";
import { APIClient } from "./APIClient";
import { Utils } from "../support/Utils";
import { Commit } from "../models/Commits/Commit";
import { Repositories } from "../APIs/Repositories";
import { APIValidationsManager } from "../validations/APIValidationsManager";
import { LoggedUser } from "../models/User/LoggedUser";
import { SCHEMA_PATHS } from "../constants/SCHEMA_PATHS";

export class Commits {

    private MINIMUM_COMMITS_PER_PAGE = 1
    private MAX_COMMITS_PER_PAGE = 100;

    private utils: Utils = new Utils();
    private validationManager: APIValidationsManager = new APIValidationsManager();
    private apiClient: APIClient;
    private repositories: Repositories;

    constructor(apiclient: APIClient) {
        this.apiClient = apiclient;
        this.repositories = new Repositories(this.apiClient)
    }

    async getListOfCommitsFromPublicRepo(repoName: string, userName: string) {
        let response = await this.apiClient.get(`/repos/${userName}/${repoName}/commits`);
        if (response.status() == 200) {
            expect(await this.validationManager.validateResponseToSchema(await response.json(), SCHEMA_PATHS.COMMIT)).toBeTruthy();
        }
    }

    async retrieveAllCommitsFromPublicRepo(repoName: string, userName: string) {
        const initialResponse = await this.apiClient.get(`/repos/${userName}/${repoName}/commits?per_page=${this.MINIMUM_COMMITS_PER_PAGE}`);
        let expectedNumberOfCommits = await this.getTotalNumberOfCommits(initialResponse);
        let commits = await this.getAllCommits(`/repos/${userName}/${repoName}/commits?per_page=${this.MAX_COMMITS_PER_PAGE}`);
        expect(commits.length).toEqual(expectedNumberOfCommits)
        await this.printCommits(commits)
    }

    async retrieveAllCommitsFromRepoForLoggedUser(repositoryToGet: string) {
        let loggedUser: LoggedUser = await this.apiClient.getLoggedUser();
        let userName = loggedUser.login;

        if (await this.apiClient.isUserAuth()) {
            let repoName = await this.repositories.getFirstOrLastRepositoryName(repositoryToGet);
            let commits: Commit[] = await this.getAllCommits(`/repos/${userName}/${repoName}/commits`);

            if (commits.length > 0) {
                console.log(`Total number of commits for ${repoName} from user ${userName} is ${commits.length}`);
                await this.printCommits(commits)
            }
            else {
                console.log(`No commits found for ${repositoryToGet} of ${userName} in repository ${repoName}`)
            }
        }
        else {
            throw new Error('User is not authenticated');
        }
    }

    private async printCommits(commits: Commit[]) {
        if ("TRUE" == `${process.env.PRINT_COMMITS}`) {
            commits.forEach(commit => {
                console.log(commit.sha)
                console.log(commit.author.login)
                console.log(commit.commit.message)
                console.log(``)
            });
        }
    }

    async getAllCommits(url: string): Promise<Commit[]> {
        const allCommits = [];

        while (url) {
            try {
                const response = await this.apiClient.get(url);

                if (response.status() === 403) {
                    throw new Error('Rate limit exceeded. Please try again later');
                    return;
                }
                if (!response.ok()) {
                    throw new Error(`Failed to get commits fom: ${url} due to ${response.status()} - ${response.statusText()}`);
                }
                const commits = await response.json();
                allCommits.push(...commits);

                url = await this.utils.calculateNextUrl(response);
            } catch (error: any) {
                console.error(`Error during get: ${error.message}`);
                break;
            }
        }

        return allCommits;
    }

    async getTotalNumberOfCommits(response): Promise<number> {
        const linkHeader = await response.headers()['link'];
        if (!linkHeader) {
            throw new Error('Missing link header. Not able to determine total number of commits.');
        }

        const match = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);

        return parseInt(match[1], 10);
    }
}