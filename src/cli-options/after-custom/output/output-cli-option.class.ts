import { CliOption } from '../../cli-option.class';
import { ApacheStatusData } from '../../../apache-status-parser/apache-status-data.class';
import { CliOptionParams } from '../../../apache-status-parser/cli-option-params.interface';
import { TablePrinter } from '../../../table-printer/table-printer.class';

export class OutputCliOption extends CliOption {

    constructor() {
        
        super();
        this.setNamespace('OutputCliOption');
        this.cliArgumentDescriptor = ['-o','--output'];
        this.defaultValue = 'table';
        this.help = `Output format: (table, raw) [default: table]`;

    }

    table(data: Array<any>, head: Array<any>) {
        const table = new TablePrinter(data, head);
        table.print();
    }
    
    raw(data: Array<any>, head: Array<any>) {
        console.log(data);
    }

    mapOption(incomingPromiseWithData: Promise<Array<ApacheStatusData>>, params: CliOptionParams): Promise<Array<ApacheStatusData>> {
        
        this.log("mapping option %s with params %o", this.cliArgumentDescriptorIdentifier, params);
        
        incomingPromiseWithData.then(res => {
            
            this.log("formating started");
            let data = res.map(row => row.orderedData.map(r => r.value));
            let head = res[0].orderedData.map(el => el.label);
            let mode = params.value.toLowerCase();
            this.log("printing started, format: %s", mode);

            switch(mode) {
                case 'raw' : { this.raw(data, head); break; }
                case 'table' : { this.table(data, head); break; }
            }

            this.log("printing done, %i row%s", res.length, res.length === 1 ? '' : 's');
            
        });

        return Promise.resolve(incomingPromiseWithData);
    }

}