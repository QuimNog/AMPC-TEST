import { DataTable, Then } from "@cucumber/cucumber"
import { expect } from "@playwright/test";
import { throwError } from "typescript-json-serializer";
import { CustomWorld } from "../../src/support/CustomWorld";

Then('status response is {int}', async function (statusCode: number) {
    expect(CustomWorld.apiValidationManager.apiResponse.status()).toEqual(statusCode);
})

Then('response fields {string} values match {string}', async function (fieldName: string, fieldValue: string) {
    await CustomWorld.apiValidationManager.validateFieldValue(fieldName, fieldValue)
})

Then('response fields {string} visible', async function (visbility: string, dataTable: DataTable) {
    const apiResponse = await CustomWorld.apiValidationManager.apiResponse.json();
    const validationFields = dataTable.transpose().raw().flat();
    if ("are" === visbility.toLocaleLowerCase()) {
        await CustomWorld.apiValidationManager.fieldsArePresent(apiResponse, validationFields, true);
    }
    else if ("are not" === visbility.toLocaleLowerCase()) {
        await CustomWorld.apiValidationManager.fieldsArePresent(apiResponse, validationFields, false);
    }
    else {
        throwError(`Visibility '${visbility}' is not supported please use are/are not`);
    }
})
