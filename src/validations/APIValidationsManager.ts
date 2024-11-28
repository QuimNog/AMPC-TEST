import { APIResponse, expect } from "@playwright/test";
import { Utils } from "../support/Utils";


export class APIValidationsManager {

    public apiResponse: APIResponse;
    private utils: Utils = new Utils();

    setAPIResponse(response: APIResponse) {
        this.apiResponse = response;
    }

    async validateFieldValue(fieldName: string, expectedValue: string | number | boolean) {
        const response = await this.apiResponse.json()
        const responseFields = await this.extractResponseFields(response);

        if (!responseFields.includes(fieldName)) {
            throw Error(`Field ${fieldName} is not in the response`)
        }

        const fieldValues = await this.getFieldValuesFromResponse(response, fieldName);

        fieldValues.forEach(field => {
            expect(String(field)).toEqual(expectedValue)
        })
    }

    private validateFieldIsInJSON(JSONobject, field: string, visibility: boolean) {
        const fieldPath = field.split('.');

        let fieldIs = fieldPath.reduce((acc, key) => {
            if (acc && key in acc) {
                return acc[key];
            } else {
                return undefined;
            }
        }, JSONobject);

        if (visibility) {

            expect(fieldIs, `Field "${field}" is missing in the response`).toBeDefined();
        }
        else {
            expect(fieldIs, `Field "${field}" is missing in the response`).not.toBeDefined();
        }

    }

    async fieldsArePresent(response, fields: string[], visibility: boolean) {
        if (Array.isArray(response)) {
            for (let i = 0; i < response.length; i++) {
                for (let j = 0; j < fields.length; j++) {
                    this.validateFieldIsInJSON(response[i], fields[j], visibility)
                }
            }
        }
        else {
            for (let j = 0; j < fields.length; j++) {
                this.validateFieldIsInJSON(response, fields[j], visibility)
            }
        }
    }

    async validateResponseToSchema(testPayload: any, schemaPath: string): Promise<boolean> {
        if (schemaPath != undefined) {
            try {
                this.utils.validateJson(schemaPath, testPayload);
            } catch (err) {
                console.error(err);
                return false;
            }
            return true;
        }
    }

    private async extractResponseFields(responseData: any): Promise<string[]> {
        if (Array.isArray(responseData)) {
            return Array.from(new Set(responseData.flatMap(item =>
                item && typeof item === 'object' ? Object.keys(item) : []
            )));
        } else {
            return Object.keys(responseData);
        }
    }

    private async getFieldValuesFromResponse(response, fieldName: string): Promise<any[]> {
        if (Array.isArray(response)) {
            return response.map(item => item[fieldName])
        }
        else {
            return [response[fieldName]];
        }

    }
}