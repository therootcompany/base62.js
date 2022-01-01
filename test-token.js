(function (exports) {
  "use strict";

  var Base62Token = exports.Base62Token || require("./base62-token.js").Base62Token;

  //console.info(JSON.stringify(encode(345678, Base62, 6)));
  var token = Base62Token.generate(Base62Token.Base62, "b62_", 30);
  var verified = Base62Token.verify(
    Base62Token.Base62,
    token.slice(0, -6),
    token.slice(-6)
  );
  console.info(token, verified);
})("undefined" === typeof module ? window : module.exports);
