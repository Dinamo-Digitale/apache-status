import * as ApacheStatusDataTypes from './apache-status-data-type';

export class ApacheStatusData {

    SRV: ApacheStatusDataTypes.SRV;
    PID: ApacheStatusDataTypes.PID;
    ACC: ApacheStatusDataTypes.ACC;
    M: ApacheStatusDataTypes.M;
    CPU: ApacheStatusDataTypes.CPU;
    SS: ApacheStatusDataTypes.SS;
    REQ: ApacheStatusDataTypes.REQ;
    CONN: ApacheStatusDataTypes.CONN;
    CHILD: ApacheStatusDataTypes.CHILD;
    SLOT: ApacheStatusDataTypes.SLOT;
    CLIENT: ApacheStatusDataTypes.CLIENT;
    VHOST: ApacheStatusDataTypes.VHOST;
    REQUEST: ApacheStatusDataTypes.REQUEST;

    orderedData: Array<any> = [];

    constructor(data, headings?: Array<string>) {

        const result: Array<any> = [];
        
        if(headings) {
            headings.forEach(type => {
                if(ApacheStatusDataTypes[type]) {
                    this[type] = new ApacheStatusDataTypes[type](data[type]);
                }
                this.orderedData.push(this[type]);
            });
        }
    
    }

}