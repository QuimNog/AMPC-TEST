export interface CommitVerification {
    verified: boolean;
    reason: string;
    signature: string;
    payload: string;
    verified_at?: string;
}
