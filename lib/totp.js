/**
 * Timed One-Time Passwords, RFC6328
 * This Javascript class can generate and validate codes
 * No additional external dependencies
 * 
 * Works in node.js and in a modern browser
 * No QR code generation
 * 
 * Inspired by https://github.com/wuyanxin/totp.js
 */

/**
 * Constructor
 * 
 * key is a base32 encoded string
 * digits is the number of output digits
 */
function TOTP(key, digits = 6) {
    this.key = key;
    this.digits = digits;
}

TOTP.prototype = {

    /**
     * TOTP code generation
     */
    gen: async function(timeStep = 30, bias = 0) {

        // decode base32 encoded master key to byte array
        const _hex        = this._base32tohex(this.key);
        const _hexi       = BigInt( '0x'+_hex);        
        const _keybytes   = this._bigIntToByteArray(_hexi);

        // compute time shift to byte array
        const _time       = Math.floor((Date.now() / 1000 - bias) / timeStep);
        const _timeFactor = this._int32ToByteArray(_time);

        // compute HMACSHA1(key, shift)
        if ( typeof window !== 'undefined' ) {
            
            // browser. use crypto.subtle
            const key = await window.crypto.subtle.importKey(
                "raw",       // key format 
                _keybytes, { // algorithm details
                    name: "HMAC",
                    hash: {
                        name: "SHA-1"
                    }
                },
                false,   // no export 
                ["sign"] // what this key can do
            );
            
            const signature = await window.crypto.subtle.sign(
                "HMAC",
                key,
                _timeFactor
            );
            
            return this._truncate( new Uint8Array( signature ) );
        } else {

            // node.js. use crypto module
            const signature = 
                require('crypto')
                    .createHmac('sha1', _keybytes)
                    .update( new Uint8Array( _timeFactor ) )
                    .digest();

            return this._truncate(signature);
        }
    },

    /** This is supposed to convert 32-bit value to 8 byte array, padded left */
    _int32ToByteArray: function (time) {
        const _buf  = new ArrayBuffer(8);
        const _view = new DataView(_buf);
        _view.setUint32(4, time, false); 
        return _buf;
    },

    /** This is supposed to convert bitint to 16 byte array in correct endianness */
    _bigIntToByteArray: function(bigNumber) {
        let result = new Uint8Array(16);
        let i = 0;
        while (bigNumber > 0) {
            result[i++] = Number(bigNumber % BigInt(256));
            bigNumber   = bigNumber / BigInt(256);
        }
        return result.reverse();
    },

    /** This is supposed to shorten the hash to k (6) digits */
    _truncate: function (hmac) {
        const offset = hmac[hmac.length - 1] & 0xf;
        const bin_code = 
            (hmac[offset + 0] & 0x7f) << 24 |
            (hmac[offset + 1] & 0xff) << 16 |
            (hmac[offset + 2] & 0xff) << 8 |
            (hmac[offset + 3] & 0xff);
        let code = (bin_code % Math.pow(10, this.digits)).toString().padStart(6, '0');
        return code;
    },

    verify: async function (code, timeStep = 30) {
        return code === await this.gen(timeStep);
    },

    /**
     * https://stackoverflow.com/questions/6154361/how-to-write-a-base32-decode-in-javascript
     */
    _base32tohex: function(base32) {
        for (var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", bits = "", hex = "", i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += val.toString(2).padStart(5, '0');
        }
        for (i = 0; i + 4 <= bits.length; i += 4) {
            var chunk = bits.substr(i, 4);
            hex += parseInt(chunk, 2).toString(16)
        }
        return hex;
    }
}

module.exports = TOTP;
