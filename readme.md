# tiny-totp.js

An RFC 6328 compliant Two Factor authentication code generator. Implemented purely in Javascript.
There are existing generators, e.g. the [totp.js](https://github.com/wuyanxin/totp.js) however, usually
they depend on external libraries that support at least
* base32 encoding and decoding
* hmacsha1 signatures

The **totp_light** has *no additional external dependencies*, all you need is the `totp.js`.

## Features

* works in node.js (uses `crypto` module)
* works in a browser (uses `subtle.crypto`)
* TOTP code generation based on known *master key* (these are usually base32 encoded)
* no QR codes or any extra stuff

## Examples

```javascript
const key  = '2JLXFRTKDX7EVJ2ZRETEW655JA';
const totp = new TOTP(key);

// generate code
const code = await totp.gen();
console.log( code );
```

## Repository content

* `totp.js` - actual TOTP implementation
* `test.html` + `client.js` - browser demo
* `app.js` - node.js demo

## Version history and TODOs

### 1.0

Initial release

### Todos

* validation should consider a time window to catch codes that are ±5 minutes from the current code