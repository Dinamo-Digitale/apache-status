import { ArgumentOptions } from 'argparse';
import { ApacheStatusData } from '../apache-status-parser/apache-status-data.class';
import { CliActions } from '../enums/cli-actions.enum';
import { CliOptionParams } from '../apache-status-parser/cli-option-params.interface';

import debug = require('debug');
import matcher = require('matcher');

export abstract class CliOption  {
    
    /**
     * parameters to pass into cli, example [ '-u', '--url' ]
     */
    cliArgumentDescriptor: Array<string> = [];
    /**
     * The help description
     */
    help?: string;
    /**
     * A default value to be passed for cliArgumentDescriptor
     */
    defaultValue?: string | number;
    /**
     * pick from a pull of specific choiche the value to pass to the cliArgumentDescriptor
     */
    choices?: Array<any>;
    /**
     * The basic type of action to be taken when this argument is encountered at the command line
     */
    action?: CliActions;

    log: debug.IDebugger;


    get options() {
        return {
            help: this.help,
            defaultValue: this.defaultValue,
            choices: this.choices,
            action: this.action
        } as ArgumentOptions;
    }

    abstract mapOption(incomingData: Promise<Array<ApacheStatusData>>, params?: CliOptionParams): Promise<Array<ApacheStatusData>>;
    
    get cliArgumentDescriptorIdentifier() {
        
        const mainArgument = this.cliArgumentDescriptor.filter(el => el.indexOf("--") === 0);
        if(!mainArgument.length) {
            throw new Error("A CliOption has to be described with at least one long term like --somenthing");
        }
        return mainArgument[0].replace("--", "");
    
    }

    constructor(namespace?: string) {
        if (!!namespace) {
            this.setNamespace(namespace);
        }
    }
    /**
     * Standard string matching, return true if the string matches,
     * @param row string
     * @param value any
     */
    strMatch(row: string, value: any) {
        // we are using matcher instead of isMatch because it is buggy 
        // @see https://github.com/sindresorhus/matcher/issues/13
        
        return matcher([row], [value]).length > 0;
    }

    /**
     * Set the logger namespace
     * @param ns Namespace
     */
    setNamespace(ns: string) {
        let parts = ns.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
        if (parts[parts.length-1] === 'Option') {
           parts.pop();
        }
        if (parts[parts.length-1] === 'Cli') {
           parts.pop();
        }
        this.log = debug(`cli-options:${parts.join('-').toLowerCase()}`);    
    }


}