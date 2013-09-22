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
    return typeof s !== 'function' ? new Function(s) : s;
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

  var base = {

    incr: function (f) {
      // TODO: inc of array does a map of inc
      var r = result(f);
      return ++r;
    },

    decr: function (f) {
      // TODO: Does this have to be a base construct?
      var r = result(f);
      return --r;
    },

    'if': function (f, c1, c2) {
      return result(f) ? toFunc(c1)() : toFunc(c2)();
    }

  };

  extend(g, base);

  /////////////////////
  // Composed functions
  /////////////////////

  var composed = {

    // Addition is op1 incremented op2 times
    // 2 + -2
    add: function (op1, op2) {
      if (op2 < 0)    return this.add(this.decr(op1), this.incr(op2));

      if (op2 === 0)  return op1;

      return this.add(this.incr(op1), this.decr(op2));
    },

    sub: function () {

    },

    mult: function () {

    },

    div: function () {

    }

  };

  extend(g, composed);

})(window);