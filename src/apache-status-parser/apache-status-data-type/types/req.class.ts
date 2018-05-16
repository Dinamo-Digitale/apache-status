import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class REQ extends ApacheStatusDataType {
    label: string = "REQ";
    value: string = "";
    
    constructor(value: any) {
        super();
        this.value = value;
    }
}