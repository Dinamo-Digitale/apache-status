export enum CliMethods {
    GET = 'GET',
    HEAD = 'HEAD',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    CONNECT = 'CONNECT',
    OPTIONS = 'OPTIONS',
    TRACE = 'TRACE',
    PATCH = 'PATCH',
    EXCLUDE_GET = '!GET',
    EXCLUDE_HEAD = '!HEAD',
    EXCLUDE_POST = '!POST',
    EXCLUDE_PUT = '!PUT',
    EXCLUDE_DELETE = '!DELETE',
    EXCLUDE_CONNECT = '!CONNECT',
    EXCLUDE_OPTIONS = '!OPTIONS',
    EXCLUDE_TRACE = '!TRACE',
    EXCLUDE_PATCH = '!PATCH'
}

const c: Array<any> = [];
let mergedc: Array<any> = [];

for (const method in CliMethods) {
    if (typeof method === 'string') {
        c.push(method);
    }
}

mergedc = c;
mergedc = mergedc.map(el => el.replace("!", "")).filter((elem, pos) => mergedc.indexOf(elem) == pos);

export const CliMethodsList = c;
export const HttpMethodsList = c;