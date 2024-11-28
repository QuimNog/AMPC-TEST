module.exports = {
    default: {
        tags: process.env.npm_config_tags || "not @skip",
        formatOptions: {
            snippetInterface: "async-await"
        },
        paths: [
            "test/features/**/*.feature"
        ],
        dryRun: false,
        require: [
            "test/steps/**/*.ts",
            "src/hooks/hooks.ts",
            "src/support/CustomWorld.ts",
        ],
        requireModule: [
            "ts-node/register",
            "@cucumber/cucumber"
        ],
        format: [
            "progress-bar",
            "html:test-results/cucumber-report.html",
            "json:test-results/cucumber-report.json",
            "rerun:failedTests/@rerun.txt"
        ],
        parallel: parseInt(process.env.npm_config_parallel, 10) || 1
    },
    rerun: {
        tags: process.env.npm_config_tags || "not @skip",
        formatOptions: {
            snippetInterface: "async-await"
        },
        dryRun: false,
        require: [
            "test/steps/*.ts",
            "src/hooks/hooks.ts"
        ],
        requireModule: [
            "ts-node/register",
            "@cucumber/cucumber"
        ],
        format: [
            "progress-bar",
            "html:test-results/cucumber-report.html",
            "json:test-results/cucumber-report.json",
            "rerun:failedTests/@rerun.txt"
        ],
        parallel: parseInt(process.env.npm_config_parallel, 10) || 1
    }
}