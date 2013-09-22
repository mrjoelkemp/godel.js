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
  // All constructs handle first class functions

  var
      incr = function (f) {
        var r = result(f);
        return ++r;
      },

      // Decrease the value of f by 1
      // Note: If it's zero, then return 0 – not a negative number
      // You can't tell if a number is negative unless you can
      // compare it to zero (i.e., can use less than)
      decr = function (f) {
        var r = result(f);
        return r === 0 ? 0 : --r;
      },

      cond = function (f, x, y) {
        return result(toFunc(f)) ? toFunc(x)() : toFunc(y)();
      },

      eq = function (x, y) {
        return result(x) === result(y);
      };

  /////////////////////
  // Computable functions
  /////////////////////

  var
      and = function (x, y) {
        return cond(x, function () {
          return cond(y, 1);
        });
      },

      or = function (x, y) {
        return cond(x,
          1,
          function () {
            return cond(y, 1);
          });
      },

      not = function (x) {
        return cond(x, 0, 1);
      },

      neq = function (x, y) {
        return not(eq(x, y));
      },

      lt = function (x, y) {
        return cond( or(eq(x, 0), eq(y, 0)) ,
          function () {
            // If x is not zero, then you must have reached here when y was 0
            // and in that case, x > y, so return false
            return and(eq(x, 0), neq(y, 0));
          },
          function () {
            return lt(decr(x), decr(y));
          });
      },

      gt = function (x, y) {
        return not(lt(x, y));
      },

      // Addition is x incremented y times
      add = function (x, y) {
        return cond(eq(y, 0),
          x,
          function () {
            return add(incr(x), decr(y));
          });
      },

      // Subtraction is x decremented y times
      sub = function (x, y) {
        return cond(eq(y, 0),
          x,
          function () {
            return sub(decr(x), decr(y));
          });
      },

      // Mult is x incremented by x, y times
      mult = function () {

      },

      // How the fiyuck do we handle rational numbers?
      div = function () {

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
    lt: lt,
    gt: gt,
    add: add,
    sub: sub,
    mult: mult,
    div: div
  };

  extend(g, composed);

})(window);