import { ApacheStatusParser } from './apache-status-parser/apache-status-parser.class';
import debug from 'debug';

const log: debug.IDebugger = debug("apache-status");


log("Starting apache status parser");

const apacheStatus = new ApacheStatusParser({
    version: `1.0.0`,
    description: `A command line tool to parse apache mod_status output. Tested with
        Apache/2.2.22 (Debian) and may works with other versions. This tool provides
        the possibility to apply filters in user typing order.`,
    epilog: `SEE GITHUB PAGE (https://github.com/dinamo-digitale/apache-status) FOR 
    MORE OPTIONS AND EXAMPLES`
});

apacheStatus.parse().then(res => {
    if(res) {
        log('graceful exit');
        process.exit(0);
    } 
}, err => {
    throw err;
}).catch(err => {
    log('exit code 1 %O', err);
    console.log(err.message || err || 'unknown error');
    process.exit(1);

});
