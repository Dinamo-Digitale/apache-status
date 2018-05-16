import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class REQUEST extends ApacheStatusDataType {
    
    label: string = "REQUEST";
    value: string = "";

    constructor(value: string) {
        super();
        this.value = value;
    }
    
}