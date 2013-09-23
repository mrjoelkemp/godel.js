;(function (window) {
  'use strict';

  window.g = window.g || {};
  var g = window.g;

  /////////////////////
  // Helpers
  /////////////////////

  function result (f) {
    return typeof f === 'function' ? f() : f;
  }

  function toFunc(s) {
    if (typeof s !== 'function') {
      return function () {
        return s;
      };
    }

    return s;
  }

  // Inline modification of object
  function extend (obj, base) {
    Object.keys(base).forEach(function (key) {
      var attr = base[key];

      if (! obj[key]) {
        if (typeof attr === 'function')     obj[key] = attr.bind(obj);
        else if (typeof attr === 'object')  obj[key] = Object.create(attr);
        else                                obj[key] = attr;
      }

    });
  }

  /////////////////////
  // Basic functions
  /////////////////////

  // return is assumed to be a base keyword
  // All constructs handle first class functions that return elements in the supported domain
  // The algebra's domain is only the set of natural numbers
  // All base constructs of the language are implemented in the host (javascript) language
  // Derived functions should only be implemented using the basic functions
  //    and applications of composition and recursion

  var
      // Returns the result of f incremented by 1
      incr = function (f) {
        var r = result(f);
        return ++r;
      },

      // Returns the result of f decremented by 1
      // Note: The decr(0) is zero – not a negative number
      // You can't tell if a number is negative unless you can
      // compare it to zero (i.e., can use less than – which is defined with decr)
      decr = function (f) {
        var r = result(f);
        return r === 0 ? 0 : --r;
      },

      // Conditional jump/xecution
      // If the result of f is true, then return the result of x, else return the result of y
      cond = function (f, x, y) {
        return result(toFunc(f)) ? toFunc(x)() : toFunc(y)();
      },

      // It can be said that x and y are equal if both hit zero at the same time.
      // However, you'd have to be able to check whether x or y is *equal* to zero.
      // Hence, we can't define equality without the existence of equality.
      eq = function (x, y) {
        return result(x) === result(y);
      };

  /////////////////////
  // Computable functions
  /////////////////////

  var
      // Boolean and
      and = function (x, y) {
        return cond(x, function () {
          return cond(y, 1);
        });
      },

      // Boolean or
      or = function (x, y) {
        return cond(x,
          1,
          function () {
            return cond(y, 1);
          });
      },

      // Boolean not
      not = function (x) {
        return cond(x, 0, 1);
      },

      // Not equal to
      neq = function (x, y) {
        return not(eq(x, y));
      },

      // Helper macro
      isZero = function (x) {
        return eq(x, 0);
      },

      // Less than
      lt = function (x, y) {
        return cond(or(isZero(x), isZero(y)),
          function () {
            // If x is not zero, then you must have reached here when y was 0
            // and in that case, x > y, so return false
            return and(isZero(x), not(isZero(y)));
          },
          function () {
            return lt(decr(x), decr(y));
          });
      },

      // Greater than
      gt = function (x, y) {
        return not(lt(x, y));
      },

      // Less than or equal to
      lte = function (x, y) {
        return or(lt(x, y), eq(x, y));
      },

      // Greater than or equal to
      gte = function (x, y) {
        return or(gt(x, y), eq(x, y));
      },

      // Addition is x incremented y times
      add = function (x, y) {
        return cond(isZero(y),
          x,
          function () {
            return add(incr(x), decr(y));
          });
      },

      // Subtraction is x decremented y times
      sub = function (x, y) {
        return cond(isZero(y),
          x,
          function () {
            return sub(decr(x), decr(y));
          });
      },

      // Mult is x incremented by x, y - 1 times
      // If x or y is zero, then the product is zero
      mult = function (x, y) {
        return cond(or(isZero(x), isZero(y)), 0,
          function () {
            return cond(eq(y, 1),
              x,
              function () {
                return add(x, mult(x, decr(y)));
              }
            );
          });
      },

      // Raise x to the power of y
      exp = function (x, y) {
        return cond(or(isZero(x), isZero(y)), 1,
          function () {
           return cond(eq(y, 1),
              x,
              function () {
                return exp(mult(x, x), decr(y));
            });
          });
      },

      // How the fiyuck do we handle rational numbers?
      div = function (x, y) {
        return cond(gt(y, 0), function () {

        });
      };

  // Public API

  var base = {
    incr: incr,
    decr: decr,
    cond: cond,
    eq: eq
  };

  extend(g, base);

  var composed = {
    or: or,
    and: and,
    not: not,
    neq: neq,
    isZero: isZero,
    lt: lt,
    gt: gt,
    lte: lte,
    gte: gte,
    add: add,
    sub: sub,
    mult: mult,
    exp: exp,
    div: div
  };

  extend(g, composed);

})(window);