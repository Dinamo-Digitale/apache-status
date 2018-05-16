import { CliOption } from '../../cli-option.class';
import { ApacheStatusData } from '../../../apache-status-parser/apache-status-data.class';

import { CliActions, CliActionsList } from '../../../enums/cli-actions.enum';
import { CliOptionParams } from '../../../apache-status-parser/cli-option-params.interface';

export class ClientCliOption extends CliOption {

    constructor() {
        
        super();

        this.cliArgumentDescriptor = [ '-c', '--client' ];
        this.help = `Filter results by client IP address network (Example: 172.5.100.6, 172.5.100.0/32, 172.1.1.0-254). Can be specified multiple times.`;
        this.action = CliActions.append;

    }

    async mapOption(incomingPromiseWithData: Promise<Array<ApacheStatusData>>, params?: CliOptionParams): Promise<Array<ApacheStatusData>> {
        
        this.log("mapping option %s with params %o", this.cliArgumentDescriptorIdentifier, params);

        let newData = await incomingPromiseWithData;
        if(!params) {
            return newData;
        }
        this.log("before filter: %i row%s", newData.length, newData.length === 1 ? '' : 's');        
        let data = newData.filter(row => {
            return this.strMatch(row.CLIENT.value, params.value);
        });

        this.log("after filter: %i row%s", data.length, data.length === 1 ? '' : 's');

        return data;

    }

}