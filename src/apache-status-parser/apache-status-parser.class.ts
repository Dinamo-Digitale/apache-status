import { ArgumentParser } from 'argparse';
import { CliOptionParams } from './cli-option-params.interface';
import { CliOption } from '../cli-options/cli-option.class';
import { UrlCliOption } from '../cli-options/core/url/url-cli-option.class';

import * as ArgParseCoreCliOptions from '../cli-options/core';
import * as ArgParseBeforeCustomCliOptions from '../cli-options/before-custom';
import * as ArgParseCustomCliOptions from '../cli-options/custom';
import * as ArgParseAfterCustomCliOptions from '../cli-options/after-custom';

import { ApacheStatusData } from './apache-status-data.class';
import { ApacheStatusParserParams } from './apache-status-parser-params.interface';
import debug = require("debug");

/**
 * the main class that it's responsible to instance cliOption and
 * execute all the passed filters if exists
 */
export class ApacheStatusParser {

    /**
     * the cli program version
     */
    version: string = '0.0.0';

    /**
     * the cli program description
     */
    description: string = '';
    
    /**
     * the cli program epilog
     */
    epilog: string = '';
    
    /**
     * the ArgumentParser instance
     * in this case we are using argparse https://www.npmjs.com/package/argparse
     */
    parser: ArgumentParser;

    /**
     * the parsed options with thei values
     */
    parsedOptions: any;

    /**
     * this Map it's used to store the CliOptions that the user has called
     * for example if we use the command COMMAND --foo 1 --bar
     * the usableArgParseCliOptions will be populated with the keys that represents
     * --foo and --bar (like foo, f, --foo, bar, b, --bar)
     */
    usableArgParseCliOptions: Map<string, CliOption> = new Map();

    /**
     * it will store the user-ordered cli inserted parameters
     */
    coreArgParseParameters: Array<string> = [];
    customArgParseParameters: Array<string> = [];
    beforeCustomArgParseParameters: Array<string> = [];
    afterCustomArgParseParameters: Array<string> = [];

    /**
     * it will store the user-ordered CliOptions function ready to be run
     * by layer of execution [core / beforeCustom / custom / afterCustom]
     */
    coreActionsToPerform: Array<any> = [];
    beforeCustomActionsToPerform: Array<any> = [];
    customActionsToPerform: Array<any> = [];
    afterCustomActionsToPerform: Array<any> = [];

    log: debug.IDebugger = debug("apache-status")

    /**
     * initialize all CliOptions and prepare data to be parsed
     * @param params 
     */
    constructor(params?: ApacheStatusParserParams) {
        
        this.parser = new ArgumentParser(params);

        this.shuntArgParseCliOptions();

        this.loadCliOptions(ArgParseCoreCliOptions);
        this.loadCliOptions(ArgParseCustomCliOptions);
        this.loadCliOptions(ArgParseBeforeCustomCliOptions);
        this.loadCliOptions(ArgParseAfterCustomCliOptions);

        this.parsedOptions = this.getParsedOptions();

    }

    /**
     * it will push into a given array the cliOptions descriptors
     * @param collection the collection where cli argument descriptors are pushed in
     * @param cliOptions the cliOptions to choose from for argument descriptors
     */
    private shuntArgParseCliOption(collection: Array<string>, cliOptions: any): void {
        for(let i in cliOptions) {
            let cliOption: CliOption = new cliOptions[i]();  
            collection.push.apply(
                collection, 
                cliOption.cliArgumentDescriptor.concat(
                    cliOption.cliArgumentDescriptorIdentifier
                )
            );
        }
    }

    /**
     * it will shunt all the imported cliOptions
     */
    private shuntArgParseCliOptions(): void {

        this.shuntArgParseCliOption(
            this.coreArgParseParameters,
            ArgParseCoreCliOptions
        );
        this.shuntArgParseCliOption(
            this.customArgParseParameters,
            ArgParseCustomCliOptions
        );
        this.shuntArgParseCliOption(
            this.beforeCustomArgParseParameters,
            ArgParseBeforeCustomCliOptions
        );
        this.shuntArgParseCliOption(
            this.afterCustomArgParseParameters,
            ArgParseAfterCustomCliOptions
        );        

    }

    /**
     * it instace as argParseArgument the passed cliOptions if they are instace of CliOption
     * @param argParseCliOptions the extenders class of CliOption that contains the data parse logic 
     * TODO check if it's possible to specify argParseCliOptions as CliOption (check the use of type <T>)
     */
    private loadCliOptions(argParseCliOptions: any): void {
        Object.keys(argParseCliOptions).forEach( i => {
            let argParseCliOption = new argParseCliOptions[i]();
            if(argParseCliOption instanceof CliOption) {
                this.instanceArgParseArgument(argParseCliOption as CliOption);
            } else {
                throw new Error("ApacheStatusParser setCliOptions: cant use argParseCliOption if not instanceof CliOption");
            }
        });
    }

    /**
     * it will return the user-ordered array of argv that has to be execute.
     * it will check if client has inserted an argv that has a defaultValue,
     * if not, it will be added to the array that has to be returned. 
     * @param collection the collection of ordered params to pick from
     * @param cliOptions the cliOptions to pick from
     */
    private cliOrderParams(collection: Array<string>, cliOptions): Array<string> {
        
        /**
         * check if a cliOption of cliOptions has defaultValue,
         * if not, push to defaultArgvs
         */
        let defaultArgvs: Array<string> = [];
        Object.keys(cliOptions).forEach( i => {
            let cliOption = new cliOptions[i]();
            if(typeof cliOption.defaultValue !== typeof undefined) {
                defaultArgvs.push.apply(
                    defaultArgvs,
                    [cliOption.cliArgumentDescriptor]
                );        
            }
        });

        /**
         * sanitize the inserted params, by checking if is an argv
         * and by splitting on = (like --client=1 will be sanitized in --client)
         */
        let argvs = process.argv
            .filter(el => el.indexOf("-") === 0)
            .map(el => el.indexOf("=") >= 0 ? el.split("=")[0] : el)
            .filter(el => collection.indexOf(el) >= 0);
        
        /**
         * check if a defaultArgvs has been declared from user
         * if so, remove it from defaultArgvs
         */
        defaultArgvs = defaultArgvs.filter(argvDefaultCollection => {
            let allreadyExists = !!argvs.length && !!argvs.some(r => {
                return argvDefaultCollection.indexOf(r) >= 0
            });
            return !allreadyExists; 
        }).map(argvDefaultCollection => argvDefaultCollection[0]);

        /**
         * we return the user-ordered inserted argvs concat defaultArgvs(if they exists)
         */
        return argvs.concat(defaultArgvs);

    }

    /**
     * it returns the user parsed argvs with relative values 
     */
    private getParsedOptions(): Array<any> {
        return this.parser.parseArgs();
    }

    /**
     * it instance a CliOption to be available as argparse on cli
     * it also set into usableArgParseCliOptions the CliOption to be retrieved
     * for example if CliOption has cliArgumentDescriptor = ['--foo', '-f']
     * then usableArgParseCliOptions will be set with keys foo, --foo, -f
     * @param argParseCliOption the CliOption to initialize as argparse
     */
    private instanceArgParseArgument(argParseCliOption: CliOption): void {
       
        this.parser.addArgument(
            argParseCliOption.cliArgumentDescriptor,
            argParseCliOption.options
        );
        
        this.usableArgParseCliOptions.set(argParseCliOption.cliArgumentDescriptorIdentifier, argParseCliOption);
        
        argParseCliOption.cliArgumentDescriptor.forEach(el => {
            this.usableArgParseCliOptions.set(el, argParseCliOption);
        });

    }
    
    /**
     * it prepare the actionsToPerform with an ordered array of functions
     * @param collection the array where to push the functions to execute 
     */
    private prepareActionsToPerform(collection: Array<string>): Array<Function> {

        const actionsToPerform: Array<Function> = [];

        for(let argIndex of collection) {

            const cliOption = <CliOption>this.usableArgParseCliOptions.get(argIndex);
            let params: CliOptionParams = {
                value: cliOption.defaultValue || null
            };

            const paramIndex = cliOption.cliArgumentDescriptorIdentifier;

            if(this.parsedOptions[paramIndex] !== null) {
                if(Array.isArray(this.parsedOptions[paramIndex])) {
                    params.value = this.parsedOptions[paramIndex][0];
                    this.parsedOptions[paramIndex].shift();                                        
                } else {
                    params.value = this.parsedOptions[paramIndex];                    
                }
            }

            actionsToPerform.push(data => {
                return cliOption.mapOption.call(cliOption, data, params);
            });

        }
        
        return actionsToPerform;

    }

    private parseCoreCliOptions(data: any = null): Promise<Array<ApacheStatusData>>  { 
        if(data === null) {
            data = Promise.resolve(null);
        }
        if(this.coreActionsToPerform && this.coreActionsToPerform.length) {
            return this.coreActionsToPerform[0](data).then((newData: any) => {
                this.coreActionsToPerform.shift();
                return this.parseCoreCliOptions(Promise.resolve(newData));
            });
        } else {
            return Promise.resolve(data as Array<ApacheStatusData>);
        }
    }
    private parseBeforeCustomCliOptions(data: any = null): Promise<Array<ApacheStatusData>>  {
        if(this.beforeCustomActionsToPerform && this.beforeCustomActionsToPerform.length) {
            return this.beforeCustomActionsToPerform[0](data).then((newData: any) => {
                this.beforeCustomActionsToPerform.shift();
                return this.parseBeforeCustomCliOptions(Promise.resolve(newData));
            });
        } else {
            return Promise.resolve(data as Array<ApacheStatusData>);
        }
    }
    private parseCustomCliOptions(data: any = null): Promise<Array<ApacheStatusData>>  {
        if(this.customActionsToPerform && this.customActionsToPerform.length) {
            return this.customActionsToPerform[0](data).then((newData: any) => {
                this.customActionsToPerform.shift();
                return this.parseCustomCliOptions(Promise.resolve(newData));
            });
        } else {
            return Promise.resolve(data as Array<ApacheStatusData>);
        }
    }
    private parseAfterCustomCliOptions(data: any = null): Promise<Array<ApacheStatusData>>  {
        if(this.afterCustomActionsToPerform && this.afterCustomActionsToPerform.length) {
            return this.afterCustomActionsToPerform[0](data).then((newData: any) => {
                this.afterCustomActionsToPerform.shift();
                return this.parseAfterCustomCliOptions(Promise.resolve(newData));
            });
        } else {
            return Promise.resolve(data as Array<ApacheStatusData>);
        }
    }

    /**
     * it retrieves the actionsToPerform and execute
     * the parsers in order [core / beforeCustom / cusom / afterCustom]
     */
    async parse(): Promise<Array<ApacheStatusData>> {
        
        this.coreActionsToPerform = this.prepareActionsToPerform(
            this.cliOrderParams(
                this.coreArgParseParameters,
                ArgParseCoreCliOptions                
            )
        );
        this.beforeCustomActionsToPerform = this.prepareActionsToPerform(
            this.cliOrderParams(
                this.beforeCustomArgParseParameters,
                ArgParseBeforeCustomCliOptions
            )
        );
        this.customActionsToPerform = this.prepareActionsToPerform(
            this.cliOrderParams(
                this.customArgParseParameters,
                ArgParseCustomCliOptions
            )
        );
        this.afterCustomActionsToPerform = this.prepareActionsToPerform(
            this.cliOrderParams(
                this.afterCustomArgParseParameters,
                ArgParseAfterCustomCliOptions
            )
        );
        
        this.log("core options started");
        const coreData = await this.parseCoreCliOptions();
        this.log("core options done");
        this.log("before custom options started");
        const beforeCustomData = await this.parseBeforeCustomCliOptions(Promise.resolve(coreData));
        this.log("before custom options done");
        this.log("custom options started");
        const customData = await this.parseCustomCliOptions(Promise.resolve(beforeCustomData));
        this.log("custom options done");
        this.log("after custom options started");
        const afterCustomData = await this.parseAfterCustomCliOptions(Promise.resolve(customData));
        this.log("after custom options done");
        return afterCustomData;
        
    }

}