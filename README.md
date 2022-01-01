# base62.js

Like base64, but base62. Converts back and forth between base62 strings and
(byte) arrays.

# Demo

Base62 Data Encoding & Decoding:

- <https://base62.js.org/>

GitHub-style Base62 Token Generator & Verifier:

- <https://therootcompany.github.io/base62-token.js/>

# Base62 Dictionaries

There are 3 widely-used, generic Base62 dictionaries, all of which are based on
the alphanumeric character set (i.e. 0-9, A-Z, a-z).

- Legographic (digits, upper, lower)
  ```txt
  0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
  ```
- BaseX (digits, lower, upper)
  ```txt
  0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
  ```
- Truncated Base64 (upper, lower, digits)
  ```txt
  ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
  ```

For general encoding and decoding you should use one of these.

However, for secure tokens for which you don't want an attacker to have the
advantage of being able to verify a token offline (i.e. you want them to hit
your API rate limiting), you should use a randomized dictionary.

## Randomized (a.k.a. Secure)

Each call to `Base62.secureDictionary()` will produce a different alphanumeric
Base62

## Lexographic Sort (a.k.a. GMP Base62)

```js
console.log(Base62Token.Base62);
// "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
```

## BaseX (a.k.a. WikiPedia Base62)

```js
console.log(Base62Token.BaseX62);
// "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
```

## Truncated Base64

```js
console.log(Base62Token.Base6462);
// "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
```
