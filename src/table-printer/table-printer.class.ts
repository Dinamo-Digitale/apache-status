import debug = require('debug');
const log: debug.IDebugger = debug("RENAME-ME");

const CliTable = require('cli-table2');

export class TablePrinter {

  data: Array<Array<string>>;
  headers: Array<string>;

  constructor(data: Array<Array<string>>, headers: Array<string>) {
    this.data = data;
    this.headers = headers;
  }

  print(chars?: Object, style?: Object) {

    var table = new CliTable({
      head: this.headers,
      chars: chars || {
        'top': '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        'bottom': '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        'left': '',
        'left-mid': '',
        'mid': '',
        'mid-mid': '',
        'right': '',
        'right-mid': '',
        'middle': '\t'
      },
      style: style || {
        'padding-left': 0,
        'padding-right': 0,
        head: ['bold'],
        compact: true
      }
    });

    table.push.apply(table, this.data);
    console.log(table.toString());
    
  }

}
