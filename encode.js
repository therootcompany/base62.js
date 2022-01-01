"use strict";

var Base62 =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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

console.info(JSON.stringify(encode(345678, Base62, 6)));
