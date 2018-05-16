import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class PID extends ApacheStatusDataType {
    label: string = "PID";
    value: string = "";
    
    constructor(value: any) {
        super();
        this.value = value;
    }
}