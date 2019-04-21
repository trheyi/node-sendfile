# Node-Sendfile
Send a large file to the remote server in synchronous mode and chunked transfer.

## Installation

```bash
npm install node-sendfile --save
```

## Usage

```javascript
const Sendfile = require("node-sendfile") 
let sendfile = new Sendfile();
let response = await sendfile.send( "/path/large-file.gz", "https://playground.yaojs.org/yao/upload", { 
        params: { version:1.0 },
        payload:{ name:"hello" },
        progress: ( sent, total ) =>{
            let percent = (sent / total * 100).toFixed(2);
            console.log(`#${i} progress ${shouldSent} ${sent}/${total} ${percent}%`);
        }
    });
    console.log( response );

```

## Parameters

| Name  | Type | Required | Description |
| ------------- | ------------- |
| file   |  string |  true | the local file |
| url    |  string |  true | the remote server url |
| options |  object |  false |  See [Options](#Options) |


## Options

| Name  | Type | Default | Description |
| ------------- | ------------- |
| name      |  string | "file" | The file field name |
| chunksize |  int | 524288 | Chunk size, default is 512kb |
| progress  |  function | (sent, total)=>{} |  Callback function for handle progress. Default is (sent, total)=>{}  |
| payload   |  object | {} | The request body Key-Value struct. Default is {} |
| params    |  object | {} | The request query string. Key-Value struct. Default is {} |
| headers   |  object | {} | The request header. Key-Value struct. Default is {} |


## Backend

**HTTP Request headers**

| Name  | Format/Value | Description |
| ------------- | ------------- |
| Content-Type:   | multipart/form-data  |  |
| Content-Range   | &lt;unit&gt; &lt;range-start&gt;-&lt;range-end&gt;/&lt;size&gt;  |  See [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range)  |
| Content-Disposition | form-data; name="&lt;field name&gt;"; filename="&lt;file basename&gt;"  | See [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) |


**HTTP Response definition**

| Status  | Body | Description |
| ------------- | ------------- |
| 200     | {"path":"/storage/path/large-file.gz", "url":"https://playground.yaojs.org/static-file/path/large-file.gz"}   |  The response body must be JSON format text |
| 300~400 | {"code":400,"message":"user sex required", "extra":{"fields":{"sex"}, "messages":{"sex":"sex required"}} }  | The response body must be JSON format text  |
| 500~600 | {"code":500,"message":"not enough disk space"} } | The response body must be JSON format text |
