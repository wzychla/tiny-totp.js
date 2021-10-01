// const TOTP = require('./totp');

var _interval;
window.addEventListener('load', function() {
    var button1 = document.getElementById('button1');
    button1.addEventListener( 'click', async function() {
        var input1 = document.getElementById('input1');
        if ( input1.value ) {
            if ( _interval ) {
                clearInterval( _interval );
            }
            const _loop = async function() {
                
                const key  = input1.value;
                const totp = new TOTP(key);

                const code   = await totp.gen();
                const label1 = document.getElementById("label1");
                label1.innerHTML = `code: ${code}`;
            };

            await _loop();
            _interval = setInterval(_loop, 3000);
        }
    });
});