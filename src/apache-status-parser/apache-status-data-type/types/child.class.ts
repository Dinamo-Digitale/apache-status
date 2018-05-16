import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class CHILD extends ApacheStatusDataType {
    label: string = "CHILD";
    value: string = "";
    constructor(value: any) {
        super();
        this.value = value;
    }
}