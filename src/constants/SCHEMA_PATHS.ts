import path from "path";

const SCHEMAS_FOLDER = "src/responseSchemas/"

export const SCHEMA_PATHS = {
    USER: path.join(SCHEMAS_FOLDER, "UsersSchema.json"),
    COMMIT: path.join(SCHEMAS_FOLDER, "CommitSchema.json"),
    AUTHENTICATED_USER: path.join(SCHEMAS_FOLDER, "AuthenticatedUserReposSchema.json"),
    UNATHENTICATED_USER: path.join(SCHEMAS_FOLDER, "UnauthenticatedUserReposSchema.json"),
    GIST: path.join(SCHEMAS_FOLDER, "Gist.json")
};