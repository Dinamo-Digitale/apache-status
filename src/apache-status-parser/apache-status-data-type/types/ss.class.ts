import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class SS extends ApacheStatusDataType {
    label: string = "SS";
    value: string = "";
    
    constructor(value: any) {
        super();
        this.value = value;
    }
}