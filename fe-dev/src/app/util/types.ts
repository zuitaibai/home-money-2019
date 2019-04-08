export interface ObjTpye {
    [propName: string]: any;
}

export interface ThObjType {
    text?: string;
    isSelectAll?: boolean;
    styles?: {};
    classes?: {};
    attrs?: {};
    key?: number;
}
export interface TdObjType {
    id?: number;
    text?: string;
    eles?: string[];
    checked?: boolean;
    styles?: {};
    classes?: {};
    attrs?: {};
    [key: string]: any;
}
export interface PageNumsType {
    totalRecord: number;
    pageCount: number;
    currentPage: number;
    pageSize?: number;
}
