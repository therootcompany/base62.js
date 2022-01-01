(function (exports) {
  "use strict";

  // GMP
  // var Base62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  // BaseX
  //var BaseX62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
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

  function rnd(alphabet) {
    var chars = alphabet.slice();
    var result = [];
    while (result.length < chars.length) {
      chars = shuffle(chars);
      result.push(chars[0]);
    }
    return result.join("");
  }

  // will work only and exclusively for integers up to 6-bytes / 48-bits wide
  // (realistically 32-bits / 4-bytes wide)
  function encode(n, alphabet, pad = 0) {
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
      console.log("n", n);
      exp -= 1;
    }

    return register.join("").padStart(pad, alphabet[0]);
  }

  function create(pre, alphabet) {
    var entropy = pre + rnd(alphabet);
    // Under the hood: new TextEncoder().encode(entropy)
    return entropy + checksum(entropy, alphabet);
  }

  function checksum(str, alphabet) {
    var n = CRC32.str(str);
    // 'n >>> 0' guarantees that in remains an unsigned 32-bit int, rather than signed
    n = n >>> 0;
    return encode(n, alphabet, 6);
  }

  function verify(str, alphabet, crc) {
    return crc === checksum(str, alphabet);
  }

  exports.Base62Token = {
    generate: create,
    checksum: checksum,
    verify: verify,
  };
})("undefined" === typeof module ? window : module.exports);
