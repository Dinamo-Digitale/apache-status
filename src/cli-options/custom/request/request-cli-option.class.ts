import { CliOption } from '../../cli-option.class';
import { ApacheStatusData } from '../../../apache-status-parser/apache-status-data.class';

import { HttpMethodsList } from '../../../enums/cli-methods.enum';
import { CliActions } from '../../../enums/cli-actions.enum';
import { CliOptionParams } from '../../../apache-status-parser/cli-option-params.interface';

export class RequestCliOption extends CliOption {

    constructor() {
        
        super();
        this.setNamespace('RequestCliOption');
        this.cliArgumentDescriptor = [ '-r', '--request' ];
        this.help = `Filter results by the request path (Example: *.php, /en/*/test).
        The Apache server-status truncates the path, so please be carful when
        using the options. Can be specified multiple times.`;
        this.action = CliActions.append;

    }

    mapOption(incomingPromiseWithData: Promise<Array<ApacheStatusData>>, params?: CliOptionParams): Promise<Array<ApacheStatusData>> {
        
        this.log("mapping option %s with params %o", this.cliArgumentDescriptorIdentifier, params);
        
        if(!params) {
            return incomingPromiseWithData;
        }

        return new Promise((resolve, reject) => {
            incomingPromiseWithData.then(newData => {
                this.log("before filter: %i row%s", newData.length, newData.length === 1 ? '' : 's');            
                newData = newData.filter(row => {
                    // possible requests: 
                    //  - METHOD /something
                    //  - METHOD /something PROTOCOL/VERSION
                    //  - NULL
                    //  - ?
                    //  - OPTIONS * HTTP/1.0
                    //  - ..reading..

                    let parts = row.REQUEST.value.split(' ');
                    // Do we have parts?
                    if (parts.length > 1) {
                        
                        let method = parts[0];
                        let request = parts[1];
                        // Is it an http method?
                        if (HttpMethodsList.indexOf(method) >= 0) {
                            return this.strMatch(parts[1], params.value);    
                        }
                        else {
                            // Does we ever get in here?
                            return false;
                        }
                    }
                    else {
                        // We are in a NULL, reading or unknown request, lets drop them
                        return parts[0] ? this.strMatch(parts[0], params.value) : false;    
                    }
                });    
                this.log("after filter: %i row%s", newData.length, newData.length === 1 ? '' : 's');
                        
                resolve(newData);

            });
        });

    }

}