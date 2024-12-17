import { DataTable, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../src/support/CustomWorld";

When('creating a gist with following information', async function () {
    const payload = {
        "description": "Hello World",
        "public": false,
        "files": {
            "FileName": {
                "content": "Content file gist"
            }
        }
    }
    await CustomWorld.gists.createGist(payload);
})

When('commenting {string} to gist with id {string}', async function (comment: string, gistId: string) {
    const payload = {
        "body": comment
    }

    await CustomWorld.gists.commentGist(payload, gistId)
})
