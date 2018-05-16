import { ApacheStatusDataType } from "../apache-status-data-type.class";

export class VHOST extends ApacheStatusDataType {
    label: string = "VHOST";
    value: string = "";
    
    constructor(value: any) {
        super();
        this.value = value;
    }
}