import { When } from "@cucumber/cucumber";
import { CustomWorld } from "../../src/support/CustomWorld";

When('retrieving list of commits from public repository {string} from user {string}', async function (repoName: string, userName: string) {
    await CustomWorld.commits.getListOfCommitsFromPublicRepo(repoName, userName);
})

When('retrieving all commits from public repository {string} from user {string}', { timeout: 180000 }, async function (repoName: string, userName: string) {
    await CustomWorld.commits.retrieveAllCommitsFromPublicRepo(repoName, userName);
})

When('retrieving list of commits from {string} repository for logged user', async function (repositoryToGet: string) {
    await CustomWorld.commits.retrieveAllCommitsFromRepoForLoggedUser(repositoryToGet)
})