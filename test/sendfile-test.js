// 
// Test Sendfile
// 

const assert = require('assert');
const path = require('path');
const Sendfile = require('../index.js');
const filename = path.join(__dirname, "assets", "somefile.tar")
const url = "https://playground.yaojs.org/yao/upload";

describe('Sendfile', () => {
    describe('#send()', () => {
        let i =1;
        it('should return the storage object of the remote server', async ()=>{
            let sendfile = new Sendfile();
            let response = await sendfile.send( filename, url, { 
                params: { version:1.0 },
                payload:{ name:"hello" },
                progress: ( sent, total ) =>{
                    let percent = (sent / total * 100).toFixed(2);
                    let shouldSent = i * 1024*512;
                    if ( sent == total ) {
                        shouldSent = total;
                    }
                    i++;
                    // console.log(`#${i} progress ${shouldSent} ${sent}/${total} ${percent}%`);
                    assert.equal(sent, shouldSent);
                }
            })

            let path = response["path"];
            assert.equal( typeof path, "string" );
        });
    });
})