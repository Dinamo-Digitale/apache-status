import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class M extends ApacheStatusDataType {
    label: string = "M";
    value: string = "";
    
    constructor(value: any) {
        super();
        this.value = value;
    }
}