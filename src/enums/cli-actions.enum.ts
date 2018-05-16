export enum CliActions {
    store = 'store',
    storeConst = 'storeConst', 
    storeTrue = 'storeTrue',
    storeFalse = 'storeFalse',
    append = 'append',
    appendConst = 'appendConst',
    count = 'count',
    help = 'help',
    version = 'version'
}

const a: Array<any> = [];
for (const action in CliActions) {
    if (typeof action === 'string') {
        a.push(action);
    }
}

export const CliActionsList = a;