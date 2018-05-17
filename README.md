# apache-status (Alpha)

A command line tool to parse apache mod_status output. Tested with Apache/2.2.22 (Debian) and may works with other versions.
This tool provides the possibility to apply filters in user typing order.


```
Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -u URL, --url URL     URL for apache server - status module page. [Default: 
                        http://locahost/server-status]
  -m METHOD, --method METHOD
                        Filter results by the request method (GET, HEAD, POST,
                         PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH).
  -c CLIENT, --client CLIENT
                        Filter by client IP address network (Example: 
                        172.5.100.6, 172.5.100.0/32, 172.1.1.0-254). Can be 
                        specified multiple times.
  -N, --no-null         Exclude NULL requests
  -r REQUEST, --request REQUEST
                        Filter by the request path (Example: *.php, 
                        /en/*/test). The Apache server-status truncates the 
                        path, so please be carful when using the options. Can 
                        be specified multiple times.
  -l, --reverse-dns-lookup
                        Query the DNS server to find a hostname mapped to the 
                        client IP address
  -V VHOST, --vhost VHOST
                        Filter results by the target vhost (Example: example.
                        com, *.example.com, example.*). Can be specified 
                        multiple times.
  -o OUTPUT, --output OUTPUT
                        Output format: (table, raw) [default: table]
```


## How to install as a command line tool
```
$ npm install
$ npm run build:production
$ npm link
$ apache-status --help
````

