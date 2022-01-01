(function () {
  "use strict";

  function $(sel, el) {
    return (el || document).querySelector(sel);
  }

  function $$(sel, el) {
    return (el || document).querySelectorAll(sel);
  }

  var Base62 = window.Base62;
  var Base62Token = window.Base62Token;

  function parseInput(src, format) {
    if ("base64" === format) {
      try {
        // TODO handle '=' padding
        atob(src.replace(/-/g, "+").replace(/_/g, "/"));
      } catch (e) {
        window.alert("could not decode base64");
      }
    } else if ("[" === src[0]) {
      try {
        src = Uint8Array.from(JSON.parse(src));
      } catch (e) {
        // ignore
      }
    } else {
      src = new TextEncoder().encode(src);
    }
    return src;
  }

  // hacky-do because prettier...
  $('[name="dictionary"]').value = $('[name="dictionary"]').value.trim();

  $('form[data-id="convert"]').addEventListener("submit", function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    var dict = $('[name="dictionary"]').value.trim();
    var b62 = Base62.createEncoder(dict);
    var src = $('[name="source"]', ev.target).value;
    var format = $('[name="format"]:checked').value;

    if ("encode" === ev.submitter.name) {
      src = parseInput(src, format);
      $('[name="source"]', ev.target).value = b62.encode(src);
    } else if ("decode" === ev.submitter.name) {
      var dst = b62.decode(src);
      try {
        dst = new TextDecoder().decode(dst);
      } catch (e) {
        dst = JSON.stringify(Array.from(dst));
      }
      $('[name="source"]', ev.target).value = dst;
    } else {
      var msg = "something went wrong - bad button name";
      window.alert(msg);
      throw new Error(msg);
    }
  });

  $('form[data-id="generate"]').addEventListener("submit", function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    var prefix = $('[name="prefix"]').value;
    var dict = $('[name="dict"]').value.trim();
    var len = parseInt($('[name="length"]').value, 10);
    var token = Base62Token.generate(dict, prefix, len);

    $('[name="token"]').value = token;
  });
})();
