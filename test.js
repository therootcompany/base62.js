"use strict";

var Base62 = require("./base62.js").Base62;
var dict = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var b62 = Base62.createEncoder(dict);

function helloWorldChinese() {
  var encoded = b62.encode(new TextEncoder().encode("Hello, 世界"));
  console.log(encoded);

  var decoded = b62.decode(encoded);
  console.log(new TextDecoder().decode(decoded));
}

function binary2() {
  var encoded = b62.encode(Uint8Array.from([0, 0, 0, 16, 16, 255, 255, 255]));
  console.log(encoded);

  var decoded = b62.decode(encoded);
  console.log(decoded);
}

function binary1() {
  var encoded = b62.encode(Uint8Array.from([0, 0, 0, 0, 255, 255, 255, 255]));
  console.log(encoded);

  var decoded = b62.decode(encoded);
  console.log(decoded);
}

helloWorldChinese();
binary1();
binary2();
