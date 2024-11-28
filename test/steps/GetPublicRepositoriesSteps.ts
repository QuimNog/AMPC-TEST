import { When } from "@cucumber/cucumber";
import { CustomWorld } from "../../src/support/CustomWorld";

When('retrieving public repositories from user {string}', async function (usernName: string) {
    await CustomWorld.repositories.getReposFromPublicUser(usernName);
})
