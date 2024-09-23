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

// Get prev, present and future codes
await totp.gen(timeStep=30, bias= +30); // 30s back
await totp.gen(timeStep=30, bias=   0); // current
await totp.gen(timeStep=30, bias= -30); // 30s forward
```

## Q&A

##### Q: Does this implementation work with Google/Microsoft Authenticator applications?

A: Yes, this implementation works correctly as a code generator for Google/Microsoft Authenticators. 

##### Q: Should I use it server side or client side?

A: Both, depending on what you want to do. If you implement a server-side node.js app, you generate codes
server side and validate codes sent by users (which are generated at client-side with compliant applications
like Google/Microsoft Authenticator). If you implement a client-side replacement for Google/Microsoft
Authenticator, codes generated with this library will be exactly the same as codes generated with
Google/Microsoft Authenticators.

## Repository content

* `totp.js` - actual TOTP implementation
* `test.html` + `client.js` - browser demo
* `app.js` - node.js demo

## Version history and TODOs

### 1.1 2024-09-11

* fixed the `_bigIntToByteArray`. It no longer assumes there are 16 bytes (128 bits), instead, it reads the whole key. Thus, longer keys (e.g. 160 bits) are correctly handled

### 1.0

* initial release

### Todos

* validation should consider a time window to catch codes that are ±5 minutes from the current code
