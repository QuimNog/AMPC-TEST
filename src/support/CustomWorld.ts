import { setWorldConstructor, World } from '@cucumber/cucumber';
import { APIClient } from '../APIs/APIClient';
import { APIValidationsManager } from '../validations/APIValidationsManager';
import { Utils } from './Utils';
import * as dotenv from 'dotenv';
import { Commits } from '../APIs/Commits';
import { Repositories } from '../APIs/Repositories';
import { User } from '../APIs/Users';
import { APIRequestContext } from 'playwright';

export class CustomWorld extends World {

    public static apiClient: APIClient;
    public static utils: Utils = new Utils();
    public static apiValidationManager: APIValidationsManager
    public static commits: Commits;
    public static repositories: Repositories;
    public static user: User;

    public static initializeApiClient(reuqestContext: APIRequestContext) {
        dotenv.config();
        this.apiValidationManager = new APIValidationsManager();
        this.apiClient = new APIClient(this.apiValidationManager, reuqestContext);
        this.commits = new Commits(this.apiClient);
        this.repositories = new Repositories(this.apiClient)
        this.user = new User(this.apiClient)
    }


}

setWorldConstructor(CustomWorld);
