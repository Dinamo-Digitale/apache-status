import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class SLOT extends ApacheStatusDataType {
    label: string = "SLOT";
    value: string = "";
    
    constructor(value: any) {
        super();
        this.value = value;
    }
}