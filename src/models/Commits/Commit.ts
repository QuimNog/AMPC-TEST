import { CommitDetails } from "./CommitDetails";
import { User } from "./User";
import { ParentCommit } from "./ParentCommit";

export interface Commit {
    sha: string;
    node_id: string;
    commit: CommitDetails;
    url: string;
    html_url: string;
    comments_url: string;
    author: User;
    committer: User;
    parents: ParentCommit[];
}
