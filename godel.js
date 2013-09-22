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
  // Base constructs
  /////////////////////

  // return is assumed to be a base keyword
  // All constructs handle first class functions

  var
      incr = function (f) {
        var r = result(f);
        return ++r;
      },

      // Decrease the value of f by 1
      // If it's zero, then return 0 (so that less than can be built)
      decr = function (f) {
        var r = result(f);
        return r === 0 ? 0 : --r;
      },

      cond = function (f, c1, c2) {
        return result(toFunc(f)) ? toFunc(c1)() : toFunc(c2)();
      },

      eq = function (c1, c2) {
        return result(c1) === result(c2);
      },

      neq = function (c1, c2) {
        return result(c1) !== result(c2);
      };

  /////////////////////
  // Composed functions
  /////////////////////

  var

      and = function (c1, c2) {
        return cond(c1, function () {
          return cond(c2, 1);
        });
      },

      or = function (c1, c2) {
        return cond(c1,
          1,
          function () {
            return cond(c2, 1);
          });
      },

      not = function (c1) {
        return cond(c1, 0, 1);
      },

      lt = function (x, y) {
        // TODO: Doesn't handle negative inputs

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

      gt = function () {

      },

      // Addition is x incremented y times
      // 2 + -2
      add = function (x, y) {
        // cond(lt(y, 0), function () {
        //   add(decr(x), incr(y));
        // });

        // cond(eq(y, 0), x);

        // add(incr(x), decr(y));
      },

      sub = function () {

      },

      mult = function () {

      },

      div = function () {

      };

  // Public API

  var base = {
    incr: incr,
    decr: decr,
    cond: cond,
    eq: eq,
    neq: neq
  };

  extend(g, base);

  var composed = {
    or: or,
    and: and,
    not: not,
    lt: lt,
    add: add,
    sub: sub,
    mult: mult,
    div: div
  };

  extend(g, composed);

})(window);