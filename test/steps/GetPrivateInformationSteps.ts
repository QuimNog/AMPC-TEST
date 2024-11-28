import { DataTable, Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../src/support/CustomWorld";

When('retrieving private information from user logged user', async function () {
    await CustomWorld.user.getLoggedUserInformation();
})

When('retrieving private profile using previous response header {string} value as header {string}', async function (previousheaderName: string, nextHeaderName: string) {
    await CustomWorld.user.retrieveLoggedProfileUsingPreviousHeade(previousheaderName, nextHeaderName);
})

Then('response contains previously updated fields', async function (dataTable: DataTable) {
    await CustomWorld.user.fieldsHaveBeenUpdated(dataTable)
})
