// 
// Test Sendfile
// 


const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Sendfile = require('../index.js');
const filename = path.join(__dirname, "assets", "somefile.tar")
const url = "https://playground.yaojs.org/yao/upload";

describe('Sendfile', () => {
    describe('#send()', () => {
        it('should return the progress', async ()=>{
            let sendfile = new Sendfile();
            sendfile.send( filename, url)
        });
    });
})