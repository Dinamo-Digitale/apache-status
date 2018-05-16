import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class CPU extends ApacheStatusDataType {
    label: string = "CPU";
    value: string = "";
    
    constructor(value: any) {
        super();
        this.value = value;
    }
}