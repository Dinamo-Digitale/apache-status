import { CliOption } from '../../cli-option.class';
import { ApacheStatusData } from '../../../apache-status-parser/apache-status-data.class';

import { CliMethods, CliMethodsList } from '../../../enums/cli-methods.enum';
import { CliActions, CliActionsList } from '../../../enums/cli-actions.enum';
import { CliOptionParams } from '../../../apache-status-parser/cli-option-params.interface';

import debug = require('debug');
const log: debug.IDebugger = debug("RENAME-ME");

export class VhostCliOption extends CliOption {

    constructor() {
        
        super();
        this.setNamespace('VhostCliOption');
        this.cliArgumentDescriptor = [ '-V', '--vhost'];
        this.help = `Filter results by the target vhost (Example: example.com,
            *.example.com, example.*). Can be specified multiple times.`;
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
                    return this.strMatch(row.VHOST.value, params.value);
                });
                this.log("after filter: %i row%s", newData.length, newData.length === 1 ? '' : 's');
                resolve(newData);
            });
        });

        
    }

}