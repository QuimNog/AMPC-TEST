# GitHub API Automation Testing Assignment #

by Quim Noguer

coded in November 2024 

### Contents Overview ###

* #### Assignment Overview
* #### Prerequisites
* #### Getting started
* #### Project structure
* ### Setting up envrionment variables
* #### Building the project
* #### Running  tests on local
* #### Test execution (in detail)
* #### CI/CD approach
* #### Other Considerations
* #### Future work


### Assignment Overview ###

In this assignment, you will write automated tests to validate key GitHub API endpoints, focusing
on both authenticated and unauthenticated scenarios. This will help you explore various API
flows and demonstrate the testing techniques you are familiar with.
The exercise objective is to play and showcase your automation knowledge interacting with:
- users API endpoints, to interact with Github registered users.
- repos API endpoints, to interact with the repository information present on the API.
- commits API endpoints, to obtain the commits information.
Feel free to extend this exercise by integrating the outcome of this exercise into automation
flows that you consider useful or would like to showcase for this assignment.


## Prerequisites
Here are some must-have prerequisites in order to run the project:

* git installed 
* npm installed
* node installed
* cucumber installed (npm i @cucumber/cucumber)


## Getting Started

To clone the project, go to your directory of choice via terminal and execute the following command: 

> git clone https://github.com/QuimNog/AMPC-TEST.git


## Project Structure

The project stack is Typescript, Playwright to interact with the APIs, and Cucumber to write the tests. 

The whole project revolves around the idea of the Custom World from Cucumber framework. This allows us to have a clean separation between the test itself and the setup, but also between each of the scenarios, allowing us to run the tests in parallel since each scenario is it's own instance of the Custom World. Using this approach also allows us to share information between test steps of the same Custom World, allowing us to use more modular classes and reuse code. 

The CustomWorld class is where our setup is happening and where we initialize all the needed classes for the test. We then initialize an APIClient who is in charge of permofing the calls to the different APIs, handling of authorization, headers, and logged user state. The 3 classes in _src/APIs_ provide an abstraction layer that allows us to interact with the APIClient, and reuse methods across different tests without compromising the agnosticism of the APIClient class.

I also created an APIValidtionManager class to encapsulate all the validation logic for API responses that are happening multiple times, so we make sure we avoid code duplicity. Linked to the validation we can also find the JSON response schemas for each API in the folder _src/responseSchemas_

Last but not least, All the test are defined in the _test/features_ folder. Each .feature file represents a task in the assignment. They are separate by _acceptance_ folder task 1-6 and _endtoend_ for task 7

The step definition is our bridge between the .feature file and the typescript classes. All the steps definition are currently stored in _test/steps_ folder. All the steps can be re-used accross all the project as seen in several ocasions through the repo.

## Setting up envrionment variables

For some of the tests, we need to be authenticated using a Personal Access Token (PAT), otherwise some of the tests will fail. To setup a PAT you can visit the following [link] (https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic). We will need to create 2 PATs.
 
 - AUTH_TOKEN : with full permissions and it will be linked to the role "admin" in the tests
    - admin:enterprise, admin:gpg_key, admin:org, admin:org_hook, admin:public_key, admin:repo_hook, admin:ssh_signing_key, audit_log, codespace, copilot, delete:packages, gist, notifications, project, repo, user, workflow, write:discussion, write:packages

 - AUTH_TOKEN_RESTRICTED_PERMISSIONS : with few permissions and it will be linked to the role "viewe" in the tests
    -  read:project

You will then need to setup this variables as enviroment variables [here](https://www3.ntu.edu.sg/home/ehchua/programming/howto/Environment_Variables.html#:~:text=To%20set%20an%20environment%20variable,set%20varname%20%3Dvalue%20%22) is a link on how to do it for Windows/Linux/macOs. 

Alternatively you can use the .env file and set the value of your PAT there.

## Building the project
Once you have cloned the project, open VS Code or your IDE of choice and open the project. 

First you will have to install all needed dependencies for the project using: 

> npm ci

You will see that all the project dependencies are being downloaded. Once the process finish, you will be able to build the project. 

To **compile** the project **without running tests** use the following command:

> npm run build

**Note:** this will compile the .ts files changes but won't execute the tests. This way we
can detect any compilation error in the classes used by tests easily.

## Running tests in local

To **run** all the tests:

> npm run test

**Note:** this will execute all the tests in the _/test/features_ folder sequentially

At the moment we can pass 2 parameters (optionally). The first one _--parallel_ will allow us
to execute tests in parallel. Find an example below:

> npm run test --parallel=X

Where X is an integer number, and is the number of instances used to run tests in parallel. 
i.e imagine we execute the command passing a 3: 

> npm run test --parallel=3

This will use 3 instances that will execute tests until we finish launching them all. 

But what if we only want to execute some tests? Then we can use the second parameter _--tags_

> npm run test --tags=@yourTag

Where **"@yourTag"** could take whatever value you want. This will execute all the tests that 
have **"@yourTag"**. 

We can also combine both of them: 

> npm run test --tags=@smokeRegression --parallel=3

This would run all the tagged tests as _@smokeRegression_ using 3 parallel instances until we are done runnning them all. 

or

> npm run test --tags=@task1 --parallel=3

This would run all the tagged tests as _@task1_ using 3 parallel instances until we are done runnning them all. 

**Disclaimer**: there's always a sweet spot between the number of test VS the number of threads. For instance running 100 test in parallel using 100 instances might not be the most performat solution, as having 100 instance running will slow down the running process if there are not enough system resources.

We can also skip tests from running by just tagging them with the @skip tag as defined in _src/config.js_ folder.

When any test is failing (in local or in the pipeline) test are stored in the @rerun.txt _FailedTest_ folder, this will allow us in the future to run the failing tests in that file using the second profile defined in the config.js

Additionally we are also displaying both the failed and the passed scenario in the cucumber-repor.html in the _test-results_ folder. Just open it with your browser and you will have all the details of the last run. 

* ## Test execution (in detail)

**_Assumption: previous material has been read_**

About **_npm run test_**: this command is used to launch all the tests. As we can see in the _package.json_ file, the **_npm run test_** command executes another command below: 

> cucumber-js test --config=src/config/config.js

This is using the cucumber.js runner to exectute the tests with a certain configuration that can be found in **src/config/config.js** file.

About **_npm run test:failed_**: this command is used to executed the failed tests in the previous execution (assuming that a _@rerun.txt_ file has been created). If we check the command in the  _package.json_ file, we can see it also executes the following command: 

> cucumber-js -p rerun one-backoffice/@rerun.txt --config=src/config/config.js

This is using the cucumber.js runner to run all the tests especified in the _one-backoffice/@rerun.txt_ file with the **_rerun_** profile found in the _config.js_ file (you can check [this](https://github.com/cucumber/cucumber-js/blob/main/docs/profiles.md) for more information about profiles). Again we are specifing the configuration with the _--config=src/config/config.js_ part.

* ## CI/CD approach

I implemented a very simple workflow. This workflow, first setup the environment using the action in _.gitlab/actions/setup-environment_ folder. Since we need some dependencies at run time, i created a separate action to handle the install of this dependencies. 

We then run individually and in parallel the test for task 1 to 6. Once the execution finished, if all of them were sucessful, we then run th e2e tests job which runs all the test in the suite together. 

Please consider that in order to sucessfully run all tests you will need to configure environment variables, if you are running it outside of the provided repo. You can have a look on how to set it up [here](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables) 

**Note:** probably in this case it doesn't at any value the workflow itself. But wanted to demostrate the possibilities of combining github actions and tagging tests

* #### Other Considerations

 - In the .env file there's a variable called PRINT_COMMITS. If the value is set to TRUE, commits will be printed for tasks 5 and 7. 
 - The step : _"retrieving all commits from public repository"_ has set a timeout of 180 seconds. This should be enough to get around 15000 commits from any repo from the tests I runned. In any case, timeout can also be changed from the step in this case. 

* #### Future work
Had some fun doing this tests over the weekend, and while time constrains is of course to be considered. However im quite satisfied with results, here's some things I think could be improved: 
   - Better loggin when running the tests (When several test are running at the same time, we could use the state of our Custom World to show which test case is producing those logs)
   - Improve reporting on failure. Although the existing ones do the job, we could apply some improvements to identify trends on test failures. 
   - Improve the pipeline so it could be triggered in several environments (doesn't apply here, but would be a nice to have for real projects)
