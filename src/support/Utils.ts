import { DataTable } from "@cucumber/cucumber";
import fs from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export class Utils {

    async dataTableToPayload(dataTable: DataTable, updateDate?: Date): Promise<string> {

        const dataJSON: Record<string, any> = {};
        if (updateDate != undefined) {
            dataTable.rows().forEach(([field, value]) => {
                dataJSON[field] = `${value} updated on ${updateDate.toISOString()}`;
            });
        }
        else {
            dataTable.rows().forEach(([field, value]) => {
                dataJSON[field] = `${value}`;
            });
        }


        return JSON.stringify(dataJSON);
    }

    async calculateNextUrl(response): Promise<string> {
        const linkHeader = response.headers()['link'];
        if (linkHeader) {
            const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
            return match ? match[1] : null;
        }
        return null;
    }

    validateJson(schemaPath: string, data: any) {
        const ajv = new Ajv();
        addFormats(ajv);

        const jsonSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

        const schemaValidator = ajv.compile(jsonSchema);

        schemaValidator(data);

        if (schemaValidator.errors) {
            const errors: string[] = schemaValidator.errors.map(
                e => e.message ?? 'No message attached to this error'
            );
            throw new Error(errors.join(', '));
        }
    }
}