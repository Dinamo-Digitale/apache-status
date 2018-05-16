import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class CONN extends ApacheStatusDataType {
    label: string = "CONN";
    value: string = "";
    
    constructor(value: any) {
        super();
        this.value = value;
    }
}