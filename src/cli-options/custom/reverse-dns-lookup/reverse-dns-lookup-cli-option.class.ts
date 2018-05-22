import { CliOption } from '../../cli-option.class';
import { ApacheStatusData } from '../../../apache-status-parser/apache-status-data.class';

import { CliMethods, CliMethodsList } from '../../../enums/cli-methods.enum';
import { CliActions, CliActionsList } from '../../../enums/cli-actions.enum';
import { CliOptionParams } from '../../../apache-status-parser/cli-option-params.interface';

import * as dns from 'dns';

export class ReverseDnsLookupCliOption extends CliOption {
    
    startTime: number;

    constructor() {
        
        super();
        this.setNamespace('ReverseDnsLookupCliOption');
        this.cliArgumentDescriptor = [ '-l', '--reverse-dns-lookup' ];
        this.help = `Query the DNS server to find a hostname mapped to the client IP
        address`;
        this.action = CliActions.storeTrue;

    }

    private reverseLookup(ipAddress: string, cb: Function) {
        
        try {
            dns.reverse(ipAddress, (err, hostnames) => {
                if (err) {
                    this.log("DNS lookup failed for", ipAddress);
                    cb([ipAddress]);
                }
                cb(!!hostnames && hostnames.length ? hostnames : [ipAddress]);
            });
        } catch (e) {
            cb([ipAddress]);
        }
    }

    private resolveAllDnsLookup(
        ApacheStatusDataCollection: Array<ApacheStatusData>,
        dnsLookupCollection: Array<Promise<any>>
    ): Promise<Array<ApacheStatusData>> {
        
        this.log("reverse DNS started");
        return new Promise((resolve, reject) => {
            Promise.all(dnsLookupCollection).then((data) => {
                ApacheStatusDataCollection.map((row, index) => {
                    row.CLIENT.value = data[index];
                });
                let endTime = +new Date() - this.startTime;
                this.log("reverse DNS done in", endTime > 1000 ? (endTime/1000).toString() + ' sec' : endTime.toString() + ' ms');
                resolve(ApacheStatusDataCollection);
            }, reject);
        });

    }

    async mapOption(incomingPromiseWithData: Promise<Array<ApacheStatusData>>, params?: CliOptionParams): Promise<Array<ApacheStatusData>> {
        
        this.log("mapping option %s", this.cliArgumentDescriptorIdentifier);

        const newData = await incomingPromiseWithData;
        this.startTime = +new Date();

        let dnsLookupPromises = new Array(0);
        this.log("before filter: %i row%s", newData.length, newData.length === 1 ? '' : 's');
        
        newData.forEach((row) => {
            dnsLookupPromises.push(
                new Promise((resolve, reject) => {
                    this.reverseLookup(row.CLIENT.value, (hostnames) => {
                        resolve(hostnames[0] || row.CLIENT.value);
                    });
                })
            );
        });
        
        let data = await this.resolveAllDnsLookup(newData, dnsLookupPromises);
        this.log("after filter: %i row%s", newData.length, newData.length === 1 ? '' : 's');        
        return data;

    }

}