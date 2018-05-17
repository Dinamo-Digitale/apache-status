import { CliOption } from '../../cli-option.class';
import { ApacheStatusData } from '../../../apache-status-parser/apache-status-data.class';

import { CliMethods, CliMethodsList } from '../../../enums/cli-methods.enum';
import { CliActions, CliActionsList } from '../../../enums/cli-actions.enum';
import { CliOptionParams } from '../../../apache-status-parser/cli-option-params.interface';

export class MethodCliOption extends CliOption {

    constructor() {
        
        super();

        this.cliArgumentDescriptor = [ '-m', '--method' ];
        //this.choices = CliMethodsList;
        this.help = `Filter results by the request method (${CliMethodsList.join(', ')}). `;
        this.action = CliActions.store;

    }

    mapOption(incomingPromiseWithData: Promise<Array<ApacheStatusData>>, params?: CliOptionParams): Promise<Array<ApacheStatusData>> {
        
        this.log("mapping option %s with params %o", this.cliArgumentDescriptorIdentifier, params);
        
        if(!params || !params.value) {
            return Promise.reject('Missing method value');
        }

        if (CliMethodsList.indexOf(params.value) < 0) {
            return Promise.reject(`Unknow method, use (${CliMethodsList.join(', ')})`);
        }

        return new Promise((resolve, reject) => {
            incomingPromiseWithData.then(newData => {
                this.log("before filter: %i row%s", newData.length, newData.length === 1 ? '' : 's');
                newData = newData.filter(row => {
                    return this.strMatch(row.REQUEST.value.split(' ')[0], params.value);
                })
                this.log("after filter: %i row%s", newData.length, newData.length === 1 ? '' : 's');
                resolve(newData);
            }, reject);
        });
    
    }

}