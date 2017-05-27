(function ($) {
    /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safeAdd(x, y) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bitRotateLeft(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binlMD5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    let i;
    let olda;
    let oldb;
    let oldc;
    let oldd;
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;

    for (i = 0; i < x.length; i += 16) {
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;

      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr(input) {
    let i;
    let output = '';
    const length32 = input.length * 32;
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    }
    return output;
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl(input) {
    let i;
    const output = [];
    output[(input.length >> 2) - 1] = undefined;
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0;
    }
    const length8 = input.length * 8;
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    return output;
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstrMD5(s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstrHMACMD5(key, data) {
    let i;
    let bkey = rstr2binl(key);
    const ipad = [];
    const opad = [];
    ipad[15] = opad[15] = undefined;
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8);
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    const hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex(input) {
    const hexTab = '0123456789abcdef';
    let output = '';
    let x;
    let i;
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i);
      output += hexTab.charAt((x >>> 4) & 0x0F) +
      hexTab.charAt(x & 0x0F);
    }
    return output;
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstrUTF8(input) {
    return unescape(encodeURIComponent(input));
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function rawMD5(s) {
    return rstrMD5(str2rstrUTF8(s));
  }
  function hexMD5(s) {
    return rstr2hex(rawMD5(s));
  }
  function rawHMACMD5(k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
  }
  function hexHMACMD5(k, d) {
    return rstr2hex(rawHMACMD5(k, d));
  }

  function md5(string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string);
      }
      return rawMD5(string);
    }
    if (!raw) {
      return hexHMACMD5(key, string);
    }
    return rawHMACMD5(key, string);
  }
  $.md5 = md5;
  const microtime = function microtime() {
    const unixtimeMs = new Date().getTime();
    const sec = parseInt(unixtimeMs / 1000, 10);
    return `${(unixtimeMs - sec * 1000) / 1000} ${sec}`;
  };
  const getTimestamp = function getTimestamp() {
    return parseInt(new Date() / 1000, 10);
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

  $.encode = (str, key, expiry = 0) => authcode(str, key, 'ENCODE', expiry);
  $.decode = (str, key) => authcode(str, key, 'DECODE');
  if (typeof window === 'object') {
    window.authcode = {
      encode: $.encode,
      decode: $.decode
    };
  }
}(this));
