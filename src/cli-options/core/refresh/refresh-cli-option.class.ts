import { CliOption } from '../../cli-option.class';
import { ApacheStatusData } from '../../../apache-status-parser/apache-status-data.class';
import { CliOptionParams } from '../../../apache-status-parser/cli-option-params.interface';

export class RefreshCliOption extends CliOption {

    constructor() {
        
        super();

        this.cliArgumentDescriptor = [ '-r', '--refresh' ];
        this.defaultValue = 0;
        this.help = 'If refresh then recalculate page';
        
    }

    mapOption(incomingPromiseWithData: Promise<Array<ApacheStatusData>>, params?: CliOptionParams): Promise<Array<ApacheStatusData>> {
        
        return new Promise((resolve, reject) => {
            incomingPromiseWithData.then(data => {
                resolve(data);
            });
        })
        
    }

}