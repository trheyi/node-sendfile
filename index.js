// 
// Send a big file to the remote server
// 

class Sendfile {

    constructor() {
    }

    send( file, url, callback, payload={}, headers={} ) {
        console.log( file, url );
    }

    async sendSync(file,  url, callback, payload={}, headers={} ) {
    }
}

module.exports = Sendfile;