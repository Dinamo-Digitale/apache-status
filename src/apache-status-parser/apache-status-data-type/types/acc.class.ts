import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class ACC extends ApacheStatusDataType {
    label: string = "ACC";
    value: string = "";
    constructor(value: any) {
        super();
        this.value = value;
    }
}