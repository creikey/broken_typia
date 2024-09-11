
import { AuthenticatedUser } from "types";
export class AsyncFlag {
    promise: Promise<void>;
    resolve!: (value: void) => void;
    resolved: boolean = false;

    constructor() {
        const obj = this;
        this.promise = new Promise((resolve) => {
            obj.resolve = () => {
                resolve();
                obj.resolved = true;
            };
        });
    }

    async waitForResolve(): Promise<void> {
        if(this.resolved) {
            return;
        } else {
            return await this.promise;
        }
    }
}
import { Ref } from 'react';
export type UserState = {
    state: "indeterminate",
    determinateFlagRef: Ref<AsyncFlag>,
} | { state: "logged_in", user: AuthenticatedUser } | { state: "no_account" };
