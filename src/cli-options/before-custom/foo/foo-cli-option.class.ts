import { CliOption } from '../../cli-option.class';
import { ApacheStatusData } from '../../../apache-status-parser/apache-status-data.class';

import { CliActions, CliActionsList } from '../../../enums/cli-actions.enum';
import { CliOptionParams } from '../../../apache-status-parser/cli-option-params.interface';

import debug = require('debug');
const log: debug.IDebugger = debug("RENAME-ME");

export class FooCliOption extends CliOption {

    constructor() {
        
        super();

        this.cliArgumentDescriptor = [ '-F', '--foo' ];
        this.help = `the foo test`;
        this.action = CliActions.append;

    }

    mapOption(incomingPromiseWithData: Promise<Array<ApacheStatusData>>, params?: CliOptionParams): Promise<Array<ApacheStatusData>> {
        
        log("mapping %o", this.cliArgumentDescriptorIdentifier);
        return incomingPromiseWithData;

    }

}