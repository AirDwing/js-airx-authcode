# @airx/authcode

[![npm](https://img.shields.io/npm/v/@airx/authcode.svg?style=plastic)](https://npmjs.org/package/@airx/authcode) [![npm](https://img.shields.io/npm/dm/@airx/authcode.svg?style=plastic)](https://npmjs.org/package/@airx/authcode)
[![npm](https://img.shields.io/npm/dt/@airx/authcode.svg?style=plastic)](https://npmjs.org/package/@airx/authcode)

## Examples

### ENCODE

```js
const {encode} = require('@airx/authcode');

encode('test','key')
// 1df4l6f9CFjMtkqRCi8IHj4hB/0c/HjyEWs0ZweV6jrB
encode('test','key',300)
// 33db1iVqMQUWBO7Tp44qKK+Dtl6cbBG9hNwYP1BKF5U6
```

### DECODE

```js
const {decode} = require('@airx/authcode');

decode('1df4l6f9CFjMtkqRCi8IHj4hB/0c/HjyEWs0ZweV6jrB','key')
// test
```

## License

MIT

通过支付宝捐赠：

![qr](https://cloud.githubusercontent.com/assets/1890238/15489630/fccbb9cc-2193-11e6-9fed-b93c59d6ef37.png)
