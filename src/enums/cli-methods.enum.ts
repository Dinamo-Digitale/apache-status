export enum CliMethods {
    GET = 'GET',
    HEAD = 'HEAD',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    CONNECT = 'CONNECT',
    OPTIONS = 'OPTIONS',
    TRACE = 'TRACE',
    PATCH = 'PATCH'
}

const methodsArray: Array<string> = [];

for (const method in CliMethods) {
    if (typeof method === 'string') {
        methodsArray.push(method);
    }
}

export const CliMethodsList = methodsArray;
export const HttpMethodsList = methodsArray;