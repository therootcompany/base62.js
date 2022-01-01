(function (exports) {
  "use strict";

  var Base62Token = exports.Base62Token || require("./rnd.js").Base62Token;

  //console.info(JSON.stringify(encode(345678, Base62, 6)));
  console.info(Base62Token.generate("b62_", 30));
})("undefined" === typeof module ? window : module.exports);
