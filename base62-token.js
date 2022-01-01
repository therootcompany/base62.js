(function (exports) {
  "use strict";

  var CRC32 = exports.CRC32 || require("crc-32");

  // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function rnd(alphabet, charlen) {
    // TODO leave this up to the user?
    if ("string" === typeof alphabet) {
      alphabet = alphabet.split("");
    }
    var chars = alphabet.slice();
    var result = [];
    while (result.length < charlen) {
      chars = shuffle(chars);
      result.push(chars[0]);
    }
    return result.join("");
  }

  // will work only and exclusively for integers up to 6-bytes / 48-bits wide
  // (realistically 32-bits / 4-bytes wide)
  function encode(alphabet, n, pad = 0) {
    var base = alphabet.length;
    // the ratio of how many extra characters to expect vs bytes
    var ratio = Math.log(256) / Math.log(2) / (Math.log(base) / Math.log(2));
    pad = pad ?? Math.ceil(4 * ratio);

    var register = [];
    var index;
    var exp = Math.floor(Math.log(n) / Math.log(base));
    // denomination
    var d;

    while (exp >= 0) {
      d = Math.pow(base, exp);
      index = Math.floor(n / d);
      register.push(alphabet[index]);
      n = n % d;
      exp -= 1;
    }

    return register.join("").padStart(pad, alphabet[0]);
  }

  function generate(alphabet, pre, charlen) {
    var entropy = pre + rnd(alphabet, charlen);
    // Under the hood: new TextEncoder().encode(entropy)
    var token = entropy + checksum(alphabet, entropy);
    return token;
  }

  function checksum(alphabet, str) {
    var n = CRC32.str(str);
    // 'n >>> 0' guarantees that in remains an unsigned 32-bit int, rather than signed
    n = n >>> 0;
    return encode(alphabet, n, 6);
  }

  function verify(alphabet, entropy, crc) {
    return crc === checksum(alphabet, entropy);
  }

  var _digits = "0123456789";
  var _upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var _lower = "abcdefghijklmnopqrstuvwxyz";
  exports.Base62Token = {
    create: function (dict) {
      return {
        generate: function (pre, charlen) {
          return generate(dict, pre, charlen);
        },
        checksum: function (str) {
          return checksum(dict, str);
        },
        verify: function (entropy, crc) {
          return verify(dict, entropy, crc);
        },
        _base: dict,
      };
    },
    generate: generate,
    checksum: checksum,
    verify: verify,
    _shuffle: shuffle,
    _rnd: rnd,
    Base62: (_digits + _upper + _lower).split(""),
    BaseX62: (_digits + _lower + _upper).split(""),
    Base6462: (_upper + _lower + _digits).split(""),
  };
})("undefined" === typeof module ? window : module.exports);
