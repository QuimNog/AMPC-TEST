import { Given, When, Then, DataTable, BeforeAll, Before } from '@cucumber/cucumber';
import { CustomWorld } from '../../src/support/CustomWorld';

Given('an {string} API user with role {string}', async function (userAuth: string, userRole: string) {
    if ("authenticated" == userAuth.toLocaleLowerCase()) {
        await CustomWorld.apiClient.setAuthenticatedUser(userRole);
    }
    else {
        await CustomWorld.apiClient.setUnauthenticatedUser();
    }
});

Given('query parameters are', async function (dataTable: DataTable) {
    await CustomWorld.apiClient.setQueryParameters(dataTable);
});



