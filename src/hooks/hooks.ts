import { BeforeAll } from "@cucumber/cucumber";
import { CustomWorld } from "../support/CustomWorld";
import { request } from "playwright";
import { API_URLS } from "../constants/API_URL";

BeforeAll(async function () {
    let req = await request.newContext({ baseURL: API_URLS.BASE_URL })
    CustomWorld.initializeApiClient(req);
});