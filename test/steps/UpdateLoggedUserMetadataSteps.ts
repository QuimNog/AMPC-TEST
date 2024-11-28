import { DataTable, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../src/support/CustomWorld";

When('updating the following logged user information', async function (dataTable: DataTable) {
    await CustomWorld.user.updateLoggedUserInformation(dataTable);
})

When('updating the following information using previous response header {string} value as header {string}', async function (previousheaderName: string, nextHeaderName: string, dataTable: DataTable) {
    await CustomWorld.user.updateLoggedProfileUsingPreviousHeader(previousheaderName, nextHeaderName, dataTable);
})
