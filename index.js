// 
// Send a large file to the remote server in synchronous mode and chunked transfer.
// 

const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const nanoid = require('nanoid')
const mime = require('mime');

// Default option of send 
const defaultSendOption = { name:"file", chunksize:1024*512, progress:( sent, total )=>{}, payload:{}, params:{}, headers:{} };

class Sendfile {

    constructor() {
    }

    /**
     * Send local file to the remote server (using multipart/form-data format data)
     * @param {string} file The file path
     * @param {string} url The remote server url
     * @param {object} option  
     *                  :name {string} The file field name
     *                  :chunksize {int} Chunk size, default is 512kb
     *                  :progress {function} Callback function for handle progress. Default is (sent, total)=>{} 
     *                  :payload  {object} Request body Key-Value struct. Default is {}
     *                  :params   {object} Request query string. Key-Value struct. Default is {}
     *                  :headers  {object} Request header. Key-Value struct. Default is {}
     */
    async send( file, url, option = defaultSendOption ) {

        return new Promise( (resolve, reject) => {

            if ( !fs.existsSync( file) ) {
                throw Error(`File not found (${file})`);
            }
            
            option = Object.assign( defaultSendOption, option );
            const reader = fs.createReadStream(file, { highWaterMark:option.chunksize });
            const stats = fs.statSync(file)
            const basename = path.posix.basename(file);
            const ext = path.extname( file );
            const mimetype = mime.getType(ext);
            const uniqueName = nanoid() + ext;
            
            let sent = 0;

            // Read a part of data
            reader.on('data', async (chunk) => {
                reader.pause();
                let start = sent;
                let end = sent + chunk.length;
                
                // Content-Range: <unit> <range-start>-<range-end>/<size>
                option.headers["Content-Range"] = `bytes ${start}-${end}/${stats.size}`;

                // Content-Disposition: form-data; name="fieldName"; filename="filename.jpg"
                option.headers["Content-Disposition"] = `form-data; name="${option.name}"; filename="${basename}"`;

                // Content-Type
                option.headers["Content-Type"] = 'multipart/form-data';

                // Content-Name
                option.headers["Content-Name"] = uniqueName;

                // Send File
                option.payload[option.name] = {
                    value: chunk,
                    options: {
                        filename: basename,
                        contentType: mimetype
                    }
                };
                let response = {};
                try {
                        response = await this.request({
                        method: "POST",
                        uri: url,
                        qs: option.params,
                        headers:option.headers,
                        formData: option.payload
                    });
                } catch ( err ) {
                    reader.destroy();
                    reject( err );
                    return;
                }

                // Set sent value and callback progress
                sent = end;
                option.progress( sent, stats.size );

                // all data sent
                if ( sent == stats.size ) {
                    reader.destroy();
                    resolve( response );
                }
                reader.resume();
            });
        });
    }

    /**
     * Send request to the remote server 
     * @see {url} https://github.com/request/request-promise-native
     * @param {object} option 
     * @return {object} server response data. ( Server must return JSON format text )
     */
    async request( option = {} ) {
        
        option["json"] = true;
        return new Promise( (resolve, reject) => {
            request( option )

                .then(( data )=>{
                    resolve(data);
                })
                .catch(( err )=>{
                    let error = {
                        message: "Request error",
                        code: err.statusCode
                    };
                    if ( err.response.body ) {
                        let data = err.response.body;
                        error["code"] = data["code"] ? data["code"]:  error["code"];
                        error["message"] = data["message"] ? data["message"]:  error["message"];
                    }
                    reject( error );
                })
        });
    }
}

module.exports = Sendfile;