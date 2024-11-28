import { CommitAuthor } from "./CommitAuthor";
import { CommitTree } from "./CommitTree";
import { CommitVerification } from "./CommitVerification"

export interface CommitDetails {
    author: CommitAuthor;
    committer: CommitAuthor;
    message: string;
    tree: CommitTree;
    url: string;
    comment_count: number;
    verification: CommitVerification;
}
