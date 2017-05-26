const { md5, getTimestamp } = require('@dwing/common');

const microtime = function microtime() {
  const unixtimeMs = new Date().getTime();
  const sec = parseInt(unixtimeMs / 1000, 10);
  return `${(unixtimeMs - sec * 1000) / 1000} ${sec}`;
};
/* eslint prefer-rest-params:0 */
const authcode = function (str, key, operation = 'ENCODE', expiry = 0) {
  // const operation = arguments.length <= 1 || arguments[1] === undefined ? 'ENCODE' : arguments[1];
  // let key = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
  // let expiry = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
  let tmpstr;
  let tmp;
  const ckeyLength = 4;
  key = (0, md5)(key);

  // 密匙a会参与加解密
  const keya = (0, md5)(key.substr(0, 16));
  // 密匙b会用来做数据完整性验证
  const keyb = (0, md5)(key.substr(16, 16));
  // 密匙c用于变化生成的密文
  const keyc = operation === 'DECODE' ? str.substr(0, ckeyLength) : (0, md5)(microtime()).substr(-ckeyLength);
  // 参与运算的密匙
  const cryptkey = keya + (0, md5)(keya + keyc);

  let strbuf;
  if (operation === 'DECODE') {
    str = str.substr(ckeyLength);
    strbuf = new Buffer(str, 'base64');
    // string = b.toString();
  } else {
    expiry = expiry ? expiry + (0, getTimestamp)() : 0;
    tmpstr = expiry.toString();
    if (tmpstr.length >= 10) {
      str = tmpstr.substr(0, 10) + (0, md5)(str + keyb).substr(0, 16) + str;
    } else {
      const count = 10 - tmpstr.length;
      for (let i = 0; i < count; i += 1) {
        tmpstr = `0${tmpstr}`;
      }
      str = tmpstr + (0, md5)(str + keyb).substr(0, 16) + str;
    }
    strbuf = new Buffer(str);
  }

  const box = new Array(256);
  const rndkey = [];
  for (let i = 0; i < 256; i += 1) {
    box[i] = i;
    // 产生密匙簿
    rndkey[i] = cryptkey.charCodeAt(i % cryptkey.length);
  }
  // 用固定的算法，打乱密匙簿，增加随机性，好像很复杂，实际上对并不会增加密文的强度
  for (let j = 0, i2 = 0; i2 < 256; i2 += 1) {
    j = (j + box[i2] + rndkey[i2]) % 256;
    tmp = box[i2];
    box[i2] = box[j];
    box[j] = tmp;
  }

  // 核心加解密部分
  let s = '';
  for (let a = 0, j = 0, i3 = 0; i3 < strbuf.length; i3 += 1) {
    a = (a + 1) % 256;
    j = (j + box[a]) % 256;
    tmp = box[a];
    box[a] = box[j];
    box[j] = tmp;
    // 从密匙簿得出密匙进行异或，再转成字符
    // s += String.fromCharCode(string[i] ^ (box[(box[a] + box[j]) % 256]));
    /* eslint no-bitwise:0 */
    /* eslint operator-assignment:0 */
    strbuf[i3] = strbuf[i3] ^ box[(box[a] + box[j]) % 256];
  }

  if (operation === 'DECODE') {
    s = strbuf.toString();
    if ((s.substr(0, 10) === '0'.repeat(10) || s.substr(0, 10) - (0, getTimestamp)() > 0) && s.substr(10, 16) === (0, md5)(s.substr(26) + keyb).substr(0, 16)) {
      s = s.substr(26);
    } else {
      s = '';
    }
  } else {
    s = strbuf.toString('base64');
    const regex = new RegExp('=', 'g');
    s = s.replace(regex, '');
    s = keyc + s;
  }

  return s;
};

exports.encode = (str, key, expiry = 0) => authcode(str, key, 'ENCODE', expiry);
exports.decode = (str, key) => authcode(str, key, 'DECODE');
