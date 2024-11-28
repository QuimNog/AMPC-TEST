import { When } from "@cucumber/cucumber";
import { CustomWorld } from "../../src/support/CustomWorld";

When('retrieving public information from user {string}', async function (userName: string) {
    await CustomWorld.user.getPublicInfomation(userName);
})