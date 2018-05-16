import { CliOption } from '../../cli-option.class';
import { ApacheStatusData } from '../../../apache-status-parser/apache-status-data.class';

import { CliMethods, CliMethodsList } from '../../../enums/cli-methods.enum';
import { CliActions, CliActionsList } from '../../../enums/cli-actions.enum';
import { CliOptionParams } from '../../../apache-status-parser/cli-option-params.interface';

export class NoNullCliOption extends CliOption {

    constructor() {
        
        super();

        this.cliArgumentDescriptor = [ '-N', '--no-null' ];
        this.help = 'Execlude NULL requests';
        this.action = CliActions.storeTrue;

    }

    mapOption(incomingPromiseWithData: Promise<Array<ApacheStatusData>>, params?: CliOptionParams): Promise<Array<ApacheStatusData>> {
        
        this.log("mapping option %s")

        if(!params) {
            return Promise.reject('Something is missing in null!');
        }

        return new Promise((resolve, reject) => {
            incomingPromiseWithData.then(newData => {
                this.log("before filter: %i row%s", newData.length, newData.length === 1 ? '' : 's');
                newData = newData.filter(row => {
                    return row.REQUEST ?
                        row.REQUEST.value !== 'NULL' :
                        false;
                });
                this.log("after filter: %i row%s", newData.length, newData.length === 1 ? '' : 's');                
                resolve(newData);
            });
        });

    }

}