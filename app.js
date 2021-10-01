const TOTP = require('./lib/totp');

function delay(ms) {
    return new Promise(res => {
        setTimeout(res, ms);
    })
}

(async function() {
 
    const key = '2JLXFRTKDX7EVJ2ZRETEW655JA';
    console.log( key );
    
    const totp = new TOTP(key);

    while( true ) {
        // generate code
        const code = await totp.gen();
        console.log( code );
        
        await delay(3000);
    }
})();

