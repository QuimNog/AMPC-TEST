import { When } from "@cucumber/cucumber";
import { CustomWorld } from "../../src/support/CustomWorld";

When('retrieving repositories from logged user', async function () {
    await CustomWorld.repositories.getRepositoriesForLoggedUser();
})

When('retrieving private repositories using previous response header {string} value as header {string}', async function (previousheaderName: string, nextHeaderName: string) {
    await CustomWorld.repositories.getRepositoriesLoggedUserWithPreviousHeader(previousheaderName, nextHeaderName)
})