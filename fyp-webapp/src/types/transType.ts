import {TFunction} from "i18next";

export type TransType = {
    t: ((key : string) => string) & TFunction < "translation", undefined >;
};