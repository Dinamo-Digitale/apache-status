import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class CLIENT extends ApacheStatusDataType {
    label: string = "CLIENT";
    value: string = "";
    constructor(value: any) {
        super();
        this.value = value;
    }
}