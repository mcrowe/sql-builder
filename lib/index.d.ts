export interface UpsertOptions {
    constraint?: string[];
}
declare var _default: {
    formatValue: (value: any) => any;
    insert: (table: string, fields: any) => string;
    bulkInsert: (table: string, rows: any) => string;
    update: (table: string, conditions: any, fields: any) => string;
    upsert: (table: string, fields: any, options?: UpsertOptions) => string;
    mergeInsertTimestamps: (params: any) => any;
    find: (table: string, id: number) => string;
    all: (table: string, conditions?: any) => string;
    NOW: string;
};
export default _default;
