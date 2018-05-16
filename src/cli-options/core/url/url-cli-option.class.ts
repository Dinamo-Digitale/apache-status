import { CliOption } from '../../cli-option.class';
import { ApacheStatusData } from '../../../apache-status-parser/apache-status-data.class';
import { HtmlParser } from '../../../html-parser/html-parser.class';

import * as http from 'http';
import { CliOptionParams } from '../../../apache-status-parser/cli-option-params.interface';

export class UrlCliOption extends CliOption {

    defaultValue: string;

    constructor() {
        
        super();

        this.cliArgumentDescriptor = [ '-u', '--url' ];
        this.defaultValue = 'http://locahost/server-status';
        this.help = 'URL for apache server-status module page';

    }

    mapOption(incomingPromiseWithData: Promise<Array<ApacheStatusData>>, params?: CliOptionParams): Promise<Array<ApacheStatusData>> {

        this.log("mapping option %s with params %o", this.cliArgumentDescriptorIdentifier, params);
        
        const url = params && params.value ? params.value : (<string>this.defaultValue).toString();
        
        return new Promise((resolve, reject) => {
            
            incomingPromiseWithData.then(data => {
                this.log("http request started to %s", url);
                let req = http.get(url, (res: any) => {
                    let error = (res.statusCode !== 200) ? true : false;
                    
                    if (error) {
                        this.log("Bad http response, code %i", res.statusCode);
                        res.destroy();
                        return reject(new Error(`${res.statusCode} Bad http response`));
                    }
                    
                    let rawData = '';
                    res.setEncoding('utf8');
                    res.on('data', (chunk: any) => rawData += chunk);
                    res.on('end', () => {
                       
                        this.log("http request end");
                        this.log("html parser started");
                        const $ = (new HtmlParser(rawData)).$; 
                        if ($("title").text() !== 'Apache Status') {
                            this.log("title verification faild, got %s", $("title").text());
                            return reject('Bad response, the html does not look like server-status output');
                        }
                        let headings: Array<any> = [];
                        let data: Array<ApacheStatusData> = [];

                        let table = $('table[border=0]').first(); 
                        
                        this.log("parsing request table");
                        table.each((i, table) => {
                            $(table).find('tr').first().find('th').each((j, cell) => {
                                headings[j] = $(cell).text().trim().toUpperCase();
                            });
                            $(table).find('tr').each(function (i, row) {
                                // skip the headings, not(':first-child') does not work
                                if (i === 0) { return; }
                                let currentRow = {};
                                $(row).find('td').each(function (j, cell) {
                                    currentRow[headings[j]] = $(cell).text().trim();
                                });
                                data.push(new ApacheStatusData(currentRow, headings));
                            });
                        });
                        this.log("html parser done");
                        this.log('option url is resolving with %i row%s', data.length, data.length === 1 ? '' : 's');
                        return resolve(data);
                    });
                });
                
                req.on('error', (e: any) => {
                    this.log("http request error");
                    reject(e);
                });
            
            }).catch(err => {
                this.log("http error");
                reject(err);
            });
        });
    }

}
