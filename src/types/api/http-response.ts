export type HttpErrorResponseOptions = {
    type: string;
    title: string;
    status: number;
    detail: string;
    errors: unknown;
    instance: string;
};

export interface HttpSuccessResponseOptions<T> {
    status?: number;
    action?: ApiAction;
    data: T;
    instance: string;
}

export type ApiAction = "created" | "updated" | "deleted" | "fetched";
