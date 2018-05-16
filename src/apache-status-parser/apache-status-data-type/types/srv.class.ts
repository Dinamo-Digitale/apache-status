import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class SRV extends ApacheStatusDataType {
    label: string = "SRV";
    value: string = "";
    
    constructor(value: any) {
        super();
        this.value = value;
    }
}