// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"cKRW":[function(require,module,exports) {
/**
 * Create reactive observable object
 *
 * @param {any} options.initial initial value
 * @param {function} options.onChange a function called after setting a new value
 * @returns {object}
 *
 * @example
 *
 * @name createObservable
 * @function
 */
module.exports = function(options) {
  var initial = options && options.hasOwnProperty('initial') ? options.initial : undefined;
  var onChange = options && options.hasOwnProperty('onChange') ? options.onChange : undefined;

  return {
    internal: initial,
    callbacks: typeof onChange === 'function' ? [onChange] : [],

    get onChange() {
      return this.callbacks;
    },

    set onChange(callback) {
      if (typeof callback === 'function') {
        this.callbacks.push(callback);
      } else {
        throw new Error('[createObservable] callback must be a function.');
      }
    },

    get value() {
      return this.internal;
    },

    set value(next) {
      if (next !== this.internal) {
        var prev = this.internal;
        this.internal = next;
        for (var i = 0; i < this.callbacks.length; i++) {
          this.callbacks[i](this.internal, prev);
        }
      }
    },
  };
};

},{}],"E0Ji":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createObservable = _interopRequireDefault(require("create-observable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function animate(_ref) {
  var duration = _ref.duration,
      delay = _ref.delay,
      easing = _ref.easing,
      draw = _ref.draw,
      onComplete = _ref.onComplete,
      onCancel = _ref.onCancel;

  if (typeof duration !== 'number' || duration <= 0) {
    throw new TypeError("animate: duration is required positive number in ms, got ".concat(_typeof(duration), " ").concat(duration));
  }

  if (delay && (typeof delay !== 'number' || delay < 0)) {
    throw new TypeError("animate: delay should non negative number in ms, got ".concat(_typeof(delay), " ").concat(delay));
  }

  if (typeof easing !== 'function') {
    throw new TypeError("animate: easing is required function, got ".concat(_typeof(easing), " ").concat(easing));
  }

  if (typeof draw !== 'function') {
    throw new TypeError("animate: draw is required function, got ".concat(_typeof(draw), " ").concat(draw));
  }

  var lastTimestamp = performance.now();
  var progress = 0;
  var fraction = 0;
  var delayBuffer = 0;
  var requestId = null;
  var isRunning = (0, _createObservable.default)({
    initial: false,
    onChange: onIsRunningChange
  });
  isRunning.value = true;

  function tick(timestamp) {
    var timedelta = timestamp - lastTimestamp;
    var frametick = timedelta / duration;

    if (delayBuffer < delay) {
      delayBuffer += timedelta;
    } else {
      fraction = Math.min(1, Math.max(0, fraction + frametick));
      progress = easing(fraction);
      draw(progress);
    }

    if (fraction === 1) {
      isRunning.value = false;

      if (typeof onComplete === 'function') {
        onComplete();
      }
    } else {
      lastTimestamp = timestamp;
      requestId = window.requestAnimationFrame(tick);
    }
  }

  function onIsRunningChange(nextState) {
    if (nextState) {
      lastTimestamp = performance.now();
      requestId = window.requestAnimationFrame(tick);
    } else {
      if (typeof onCancel === 'function' && progress !== 1 && progress !== 0) {
        onCancel({
          progress: progress,
          fraction: fraction
        });
      }

      window.cancelAnimationFrame(requestId);
    }
  }

  function togglePause(force) {
    isRunning.value = force === undefined ? !isRunning.value : force;
  }

  return {
    togglePause: togglePause
  };
}

var _default = animate;
exports.default = _default;
},{"create-observable":"cKRW"}],"jkQA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.easingBackInOut = exports.easingBackOut = exports.easingBackIn = exports.easingExpInOut = exports.easingExpOut = exports.easingExpIn = exports.easingCircInOut = exports.easingCircOut = exports.easingCircIn = exports.easeInOutSin = exports.easeOutSin = exports.easeInSin = exports.easeInOutElastic = exports.easeOutElastic = exports.easeInElastic = exports.easeInOutQuint = exports.easeOutQuint = exports.easeInQuint = exports.easeInOutQuart = exports.easeOutQuart = exports.easeInQuart = exports.easeInOutCubic = exports.easeOutCubic = exports.easeInCubic = exports.easeInOutQuad = exports.easeOutQuad = exports.easeInQuad = exports.linear = void 0;

var linear = function linear(t) {
  return t;
};

exports.linear = linear;

var easeInQuad = function easeInQuad(t) {
  return t * t;
};

exports.easeInQuad = easeInQuad;

var easeOutQuad = function easeOutQuad(t) {
  return t * (2 - t);
};

exports.easeOutQuad = easeOutQuad;

var easeInOutQuad = function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

exports.easeInOutQuad = easeInOutQuad;

var easeInCubic = function easeInCubic(t) {
  return t * t * t;
};

exports.easeInCubic = easeInCubic;

var easeOutCubic = function easeOutCubic(t) {
  return --t * t * t + 1;
};

exports.easeOutCubic = easeOutCubic;

var easeInOutCubic = function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

exports.easeInOutCubic = easeInOutCubic;

var easeInQuart = function easeInQuart(t) {
  return t * t * t * t;
};

exports.easeInQuart = easeInQuart;

var easeOutQuart = function easeOutQuart(t) {
  return 1 - --t * t * t * t;
};

exports.easeOutQuart = easeOutQuart;

var easeInOutQuart = function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
};

exports.easeInOutQuart = easeInOutQuart;

var easeInQuint = function easeInQuint(t) {
  return t * t * t * t * t;
};

exports.easeInQuint = easeInQuint;

var easeOutQuint = function easeOutQuint(t) {
  return 1 + --t * t * t * t * t;
};

exports.easeOutQuint = easeOutQuint;

var easeInOutQuint = function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
};

exports.easeInOutQuint = easeInOutQuint;

var easeInElastic = function easeInElastic(t) {
  return (0.04 - 0.04 / t) * Math.sin(25 * t) + 1;
};

exports.easeInElastic = easeInElastic;

var easeOutElastic = function easeOutElastic(t) {
  return 0.04 * t / --t * Math.sin(25 * t);
};

exports.easeOutElastic = easeOutElastic;

var easeInOutElastic = function easeInOutElastic(t) {
  return (t -= 0.5) < 0 ? (0.02 + 0.01 / t) * Math.sin(50 * t) : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1;
};

exports.easeInOutElastic = easeInOutElastic;

var easeInSin = function easeInSin(t) {
  return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2);
};

exports.easeInSin = easeInSin;

var easeOutSin = function easeOutSin(t) {
  return Math.sin(Math.PI / 2 * t);
};

exports.easeOutSin = easeOutSin;

var easeInOutSin = function easeInOutSin(t) {
  return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
};

exports.easeInOutSin = easeInOutSin;

var easingCircIn = function easingCircIn(t) {
  return -(Math.sqrt(1 - t * t) - 1);
};

exports.easingCircIn = easingCircIn;

var easingCircOut = function easingCircOut(t) {
  return Math.sqrt(1 - (t = t - 1) * t);
};

exports.easingCircOut = easingCircOut;

var easingCircInOut = function easingCircInOut(t) {
  return (t *= 2) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
};

exports.easingCircInOut = easingCircInOut;

var easingExpIn = function easingExpIn(t) {
  return Math.pow(2, 10 * (t - 1)) - 0.001;
};

exports.easingExpIn = easingExpIn;

var easingExpOut = function easingExpOut(t) {
  return 1 - Math.pow(2, -10 * t);
};

exports.easingExpOut = easingExpOut;

var easingExpInOut = function easingExpInOut(t) {
  return (t *= 2) < 1 ? 0.5 * Math.pow(2, 10 * (t - 1)) : 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
};

exports.easingExpInOut = easingExpInOut;

var easingBackIn = function easingBackIn(t) {
  var p = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.70158;
  return t * t * ((p + 1) * t - p);
};

exports.easingBackIn = easingBackIn;

var easingBackOut = function easingBackOut(t) {
  var p = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.70158;
  return --t * t * ((p + 1) * t + p) + 1;
};

exports.easingBackOut = easingBackOut;

var easingBackInOut = function easingBackInOut(t) {
  var p = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.70158;
  var s = p * 1.525;

  if ((t *= 2) < 1) {
    return 0.5 * (t * t * ((s + 1) * t - s));
  }

  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
};

exports.easingBackInOut = easingBackInOut;
},{}],"o3YJ":[function(require,module,exports) {
"use strict";

var _animate = _interopRequireDefault(require("./animate.js"));

var _easings = require("./easings.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shift = 7;
var rotorWidth = 44;
var stropeWidth = 211;
var radius = 132;
var pumpjackNodeList = document.querySelectorAll('[data-pumpjack]');

for (var i = 0; i < pumpjackNodeList.length; i++) {
  var pumpjackNode = pumpjackNodeList[i];
  var startRad = parseFloat(pumpjackNode.dataset.pumpjackStart);
  var wheelNode = pumpjackNode.querySelector('[data-pumpjack-wheel]');
  var rotorNode = pumpjackNode.querySelector('[data-pumpjack-rotor]');
  var jackNode = pumpjackNode.querySelector('[data-pumpjack-jack]');
  var stropeNode = pumpjackNode.querySelector('[data-pumpjack-strope]');
  var pumpNode = pumpjackNode.querySelector('[data-pumpjack-pump]');
  var wheelAnimation = spin(wheelNode, 1250);
  var pumpAnimation = pump(startRad, rotorNode, jackNode, stropeNode, pumpNode, 5000);
}

function spin(node, duration) {
  return (0, _animate.default)({
    duration: duration,
    easing: function easing(t) {
      return t;
    },
    draw: function draw(p) {
      node.style.transform = "rotate(".concat(p * -360, "deg)");
    },
    onComplete: function onComplete() {
      spin(node, duration);
    }
  });
}

function pump(startRad, rotorNode, jackNode, stropeNode, pumpNode, duration) {
  return (0, _animate.default)({
    duration: duration,
    easing: function easing(t) {
      return t;
    },
    draw: function draw(progress) {
      var k = rotorWidth / stropeWidth;
      var alpha = progress * -Math.PI * 2 + startRad;
      var beta = Math.asin(Math.sin(alpha) * k);
      var gamma = beta - alpha;
      rotorNode.style.transform = "rotate(".concat(alpha, "rad)");
      var translateYprogress = Math.sin(alpha);
      var translateY = translateYprogress * shift;
      stropeNode.style.transform = "translateY(".concat(translateY, "px) rotate(").concat(gamma, "rad)");
      var rw = (rotorWidth - translateY) * Math.sin(alpha);
      var rh = (rotorWidth + translateY) * Math.cos(alpha);
      var sw = stropeWidth * Math.sin(beta);
      var sh = stropeWidth * Math.cos(beta);
      var px = -radius + shift + rw - sw - 1;
      var py = stropeWidth - sh + rh;
      var delta = Math.atan(py / px);
      jackNode.style.transform = "rotate(".concat(delta, "rad)");
      pumpNode.style.transform = "translate(0, ".concat(delta * 200, "%)");
    },
    onComplete: function onComplete() {
      pump(startRad, rotorNode, jackNode, stropeNode, pumpNode, duration);
    }
  });
}
},{"./animate.js":"E0Ji","./easings.js":"jkQA"}],"R8uP":[function(require,module,exports) {
"use strict";function r(r){return null!==r&&"object"==typeof r&&!1===Array.isArray(r)}module.exports=function(t){var e=t.defaults,o=t.userOptions;void 0===o&&(o={});var i=t.warnPreffix;void 0===i&&(i="");var a=t.warnSuffix;if(void 0===a&&(a=""),!r(e))throw new TypeError("Expected defaults is required not null, not array object, got "+typeof e+" "+e);if(Object.keys(e).map(function(r){return{key:r,option:e[r]}}).forEach(function(t){var e=t.key,o=t.option;if(!r(o))throw new TypeError("Expected each default option is an object, got "+e+" is "+typeof o+" "+o);if(!Object.prototype.hasOwnProperty.call(o,"initial"))throw new TypeError("Expected "+e+" have initial property");if(!Object.prototype.hasOwnProperty.call(o,"description"))throw new TypeError("Expected "+e+" have description property");var i=o.description;if("string"!=typeof i)throw new TypeError("Expected "+e+" description is a string, got "+typeof i+" "+i);if(!Object.prototype.hasOwnProperty.call(o,"validator"))throw new TypeError("Expected "+e+" have validator property");var a=o.validator;if("function"!=typeof a)throw new TypeError("Expected "+e+" validator is a function, got "+typeof a+" "+a);for(var n=[!0,!1,0,1,Math.PI,-Infinity,NaN,void 0,null,"","a cabbage","печенюха",[42,1e3],{foo:"bar"}],p=0;p<n.length;p++){var f=n[p],y=o.validator(f);if("boolean"!=typeof y)throw new TypeError("Expected "+e+" validator returning boolean, got "+typeof y+" "+y+" on "+f+" passed")}}),!r(o))throw new TypeError("Expected userOptions is required not null, not array object, got "+typeof o+" "+o);if(void 0!==i&&"string"!=typeof i)throw new TypeError("Expected warnPreffix is optional string, got "+typeof i+" "+i);if(void 0!==a&&"string"!=typeof a)throw new TypeError("Expected warnSuffix is optional string, got "+typeof a+" "+a);var n={};for(var p in e){var f=e[p],y=f.initial,c=f.description,l=f.validator;if(n[p]=y,Object.prototype.hasOwnProperty.call(o,p)){var d=o[p];l(d)?n[p]=d:console.warn(i,"Expected "+p+" is "+c+", got "+typeof d+" "+d+".","Fallback to default value "+y+".",a)}}return n};


},{}],"WHwW":[function(require,module,exports) {
"use strict";var e,t=(e=require("@dubaua/merge-options"))&&"object"==typeof e&&"default"in e?e.default:e,i=/^[a-z_-][a-z\d_-]*$/i;function o(e){return"string"==typeof e&&""!==e&&i.test(e)}var r={selectorImmerser:"[data-immerser]",selectorLayer:"[data-immerser-layer]",selectorSolid:"[data-immerser-solid]",selectorPager:"[data-immerser-pager]",selectorPagerLink:"[data-immerser-state-index]",selectorMask:"[data-immerser-mask]",selectorMaskInner:"[data-immerser-mask-inner]",selectorSynchroHover:"[data-immerser-synchro-hover]"},n={solidClassnameArray:{initial:[],description:"non empty array of objects",validator:function(e){return Array.isArray(e)&&0!==e.length}},fromViewportWidth:{initial:1024,description:"a natural number",validator:function(e){return"number"==typeof e&&0<=e&&e%1==0}},pagerThreshold:{initial:.5,description:"a number between 0 and 1",validator:function(e){return"number"==typeof e&&0<=e&&e<=1}},hasToUpdateHash:{initial:!1,description:"boolean",validator:function(e){return"boolean"==typeof e}},scrollAdjustThreshold:{initial:0,description:"a number greater than or equal to 0",validator:function(e){return"number"==typeof e&&e>=0}},scrollAdjustDelay:{initial:600,description:"a number greater than or equal to 300",validator:function(e){return"number"==typeof e&&e>=300}},classnamePager:{initial:"pager",description:"valid non empty classname string",validator:o},classnamePagerLink:{initial:"pager__link",description:"valid non empty classname string",validator:o},classnamePagerLinkActive:{initial:"pager__link--active",description:"valid non empty classname string",validator:o},onInit:{initial:null,description:"function",validator:function(e){return"function"==typeof e}},onBind:{initial:null,description:"function",validator:function(e){return"function"==typeof e}},onUnbind:{initial:null,description:"function",validator:function(e){return"function"==typeof e}},onDestroy:{initial:null,description:"function",validator:function(e){return"function"==typeof e}},onActiveLayerChange:{initial:null,description:"function",validator:function(e){return"function"==typeof e}}},s=function(e){var t=e&&e.hasOwnProperty("initial")?e.initial:void 0,i=e&&e.hasOwnProperty("onChange")?e.onChange:void 0;return{internal:t,callbacks:"function"==typeof i?[i]:[],get onChange(){return this.callbacks},set onChange(e){if("function"!=typeof e)throw new Error("[createObservable] callback must be a function.");this.callbacks.push(e)},get value(){return this.internal},set value(e){if(e!==this.internal){var t=this.internal;this.internal=e;for(let e=0;e<this.callbacks.length;e++)this.callbacks[e](this.internal,t)}}}};function a(e,t){for(var i in t)e.style[i]=t[i]}function l(e,t){for(var i=0;i<e.length;i++)t(e[i],i,e)}function d(e,t,i){return Math.max(Math.min(e,i),t)}function c(){var e=window.scrollX||document.documentElement.scrollLeft,t=window.scrollY||document.documentElement.scrollTop;return{x:d(e,0,document.documentElement.offsetWidth),y:d(t,0,document.documentElement.offsetHeight)}}var h=function(e){this.initState(),this.init(e)};h.prototype.initState=function(){this.options=Object.assign({},r),this.statemap=[],this.isBound=!1,this.isCustomMarkup=!1,this.immerserNode=null,this.pagerNode=null,this.originalChildrenNodeList=null,this.immerserMaskNodeArray=[],this.synchroHoverNodeArray=[],this.documentHeight=0,this.windowHeight=0,this.immerserTop=0,this.immerserHeight=0,this.resizeTimerId=null,this.scrollTimerId=null,this.reactiveSynchroHoverId=s(),this.reactiveActiveLayer=s(),this.reactiveWindowWidth=s(),this.onResize=null,this.onScroll=null},h.prototype.init=function(e){this.options=Object.assign({},this.options,t({userOptions:e,defaults:n,warnPreffix:"immerser:",warnSuffix:"Check out documentation https://github.com/dubaua/immerser#options"})),this.immerserNode=document.querySelector(this.options.selectorImmerser),this.immerserNode?(this.initStatemap(),this.setSizes(),this.onScroll=this.handleScroll.bind(this),this.onResize=this.handleResize.bind(this),window.addEventListener("scroll",this.onScroll,!1),window.addEventListener("resize",this.onResize,!1),"function"==typeof this.options.onInit&&this.options.onInit(this)):console.warn("immerser: immerser element not found. Check out documentation https://github.com/dubaua/immerser#how-to-use")},h.prototype.initStatemap=function(){var e=this;l(document.querySelectorAll(this.options.selectorLayer),function(t,i){var o=e.options.solidClassnameArray[i];if(t.dataset.immerserLayerConfig)try{o=JSON.parse(t.dataset.immerserLayerConfig)}catch(e){console.error("Failed to parse JSON class configuration.",e)}var r=t.id;r||(t.id=r="immerser-section-"+i,t.__immerserCustomId=!0),e.statemap.push({node:t,id:r,solidClassnames:o,top:0,bottom:0})})},h.prototype.setSizes=function(){var e=this;this.documentHeight=document.documentElement.offsetHeight,this.windowHeight=window.innerHeight,this.immerserTop=this.immerserNode.offsetTop,this.immerserHeight=this.immerserNode.offsetHeight,this.statemap=this.statemap.map(function(e){var t=e.node.offsetTop;return Object.assign({},e,{top:t,bottom:t+e.node.offsetHeight})}),this.statemap=this.statemap.map(function(t,i){var o=0===i,r=i===e.statemap.length-1,n=o?0:e.statemap[i-1].bottom-e.immerserTop,s=r?e.documentHeight:e.statemap[i].bottom-e.immerserTop;return Object.assign({},t,{startEnter:o?0:n-e.immerserHeight,enter:n,startLeave:r?e.documentHeight:s-e.immerserHeight,leave:s})}),this.reactiveWindowWidth.onChange=function(t){t>=e.options.fromViewportWidth?e.isBound||e.bind():e.isBound&&e.unbind()},this.reactiveWindowWidth.value=window.innerWidth},h.prototype.initPager=function(){var e=this;this.reactiveActiveLayer.onChange=function(t){e.isBound&&(e.drawPagerLinks(t),e.options.hasToUpdateHash&&e.updateHash(t),"function"==typeof e.options.onActiveLayerChange&&e.options.onActiveLayerChange(t,e))}},h.prototype.createPagerLinks=function(){var e=this,t=this.options,i=t.classnamePagerLink;this.pagerNode.classList.add(t.classnamePager),this.statemap.forEach(function(t,o){var r=document.createElement("a");r.classList.add(i),r.href="#"+t.id,r.dataset.immerserStateIndex=o,r.dataset.immerserSynchroHover="pager-link-"+o,e.pagerNode.appendChild(r),t.pagerLinkNodeArray=[]})},h.prototype.initPagerLinks=function(){var e=this;l(this.immerserNode.querySelectorAll(this.options.selectorPagerLink),function(t){e.statemap[t.dataset.immerserStateIndex].pagerLinkNodeArray.push(t)})},h.prototype.initHoverSynchro=function(e){var t=this;this.reactiveSynchroHoverId.onChange=function(e){t.drawSynchroHover(e)},l(e,function(e){var i=function(e){t.reactiveSynchroHoverId.value=e.target.dataset.immerserSynchroHover};e.addEventListener("mouseover",i),e.__immerserHandleMouseOver=i;var o=function(){t.reactiveSynchroHoverId.value=void 0};e.addEventListener("mouseout",o),e.__immerserHandleMouseOut=o,t.synchroHoverNodeArray.push(e)})},h.prototype.createMasks=function(){var e=this,t={position:"absolute",top:0,right:0,bottom:0,left:0,overflow:"hidden"};this.originalChildrenNodeList=this.immerserNode.querySelectorAll(this.options.selectorSolid),a(this.immerserNode,{pointerEvents:"none",touchAction:"none"});var i=this.immerserNode.querySelectorAll(this.options.selectorMask);this.isCustomMarkup=i.length===this.statemap.length,i.length>0&&i.length!==this.statemap.length&&console.warn("immerser: You're trying use custom markup, but count of your immerser masks doesn't equal layers count. Check out documentation https://github.com/dubaua/immerser#custom-markup"),l(i,function(t){for(var i=t.querySelector(e.options.selectorMaskInner).children,o=0;o<i.length;o++)a(i[o],{pointerEvents:"all",touchAction:"auto"})}),this.statemap=this.statemap.map(function(o,r){var n=e.isCustomMarkup?i[r]:document.createElement("div");a(n,t);var s=e.isCustomMarkup?n.querySelector(e.options.selectorMaskInner):document.createElement("div");return a(s,t),l(e.originalChildrenNodeList,function(e){var t=e.cloneNode(!0);a(t,{pointerEvents:"all",touchAction:"auto"}),t.immerserClonned=!0,s.appendChild(t)}),l(s.querySelectorAll(e.options.selectorSolid),function(e){var t=e.dataset.immerserSolid;o.solidClassnames&&o.solidClassnames.hasOwnProperty(t)&&e.classList.add(o.solidClassnames[t])}),0!==r&&n.setAttribute("aria-hidden","true"),n.appendChild(s),e.immerserNode.appendChild(n),e.immerserMaskNodeArray.push(n),Object.assign({},o,{maskNode:n,maskInnerNode:s})}),l(this.originalChildrenNodeList,function(t){e.immerserNode.removeChild(t)})},h.prototype.bind=function(){this.pagerNode=document.querySelector(this.options.selectorPager),this.pagerNode&&(this.initPager(),this.createPagerLinks()),this.createMasks(),this.pagerNode&&this.initPagerLinks();var e=document.querySelectorAll(this.options.selectorSynchroHover);e.length&&this.initHoverSynchro(e),"function"==typeof this.options.onBind&&this.options.onBind(this),this.isBound=!0,this.draw(),this.drawPagerLinks(this.reactiveActiveLayer.value)},h.prototype.unbind=function(){var e=this;this.synchroHoverNodeArray.forEach(function(e){e.removeEventListener("mouseover",e.__immerserHandleMouseOver),e.removeEventListener("mouseout",e.__immerserHandleMouseOut)}),this.statemap.forEach(function(e){e.pagerLinkNodeArray=[],e.node.__immerserCustomId&&e.node.removeAttribute("id")}),l(this.originalChildrenNodeList,function(t){e.immerserNode.appendChild(t)}),this.immerserMaskNodeArray.forEach(function(t){if(e.isCustomMarkup){t.removeAttribute("style"),t.removeAttribute("aria-hidden");var i=t.querySelector(e.options.selectorMaskInner);i.removeAttribute("style"),l(i.querySelectorAll(e.options.selectorSolid),function(e){e.immerserClonned&&i.removeChild(e)})}else e.immerserNode.removeChild(t)}),this.pagerNode.innerHTML="","function"==typeof this.options.onUnbind&&this.options.onUnbind(this),this.isBound=!1,this.reactiveActiveLayer.value=void 0},h.prototype.destroy=function(){this.unbind(),window.removeEventListener("scroll",this.onScroll,!1),window.removeEventListener("resize",this.onResize,!1),"function"==typeof this.options.onDestroy&&this.options.onDestroy(this),this.initState()},h.prototype.draw=function(){var e=this,t=c().y;this.statemap.forEach(function(i,o){var r,n=i.startEnter,s=i.enter,a=i.startLeave,l=i.leave,d=i.maskInnerNode,c=i.top,h=i.bottom;if(n>t?r=e.immerserHeight:n<=t&&t<s?r=s-t:s<=t&&t<a?r=0:a<=t&&t<l?r=a-t:t>=l&&(r=-e.immerserHeight),i.maskNode.style.transform="translateY("+r+"px)",d.style.transform="translateY("+-r+"px)",e.pagerNode){var m=t+e.windowHeight*(1-e.options.pagerThreshold);c<=m&&m<h&&(e.reactiveActiveLayer.value=o)}})},h.prototype.drawPagerLinks=function(){var e=this;this.statemap.forEach(function(t){t.pagerLinkNodeArray.forEach(function(t){parseInt(t.dataset.immerserStateIndex,10)===e.reactiveActiveLayer.value?t.classList.add(e.options.classnamePagerLinkActive):t.classList.remove(e.options.classnamePagerLinkActive)})})},h.prototype.drawSynchroHover=function(e){this.synchroHoverNodeArray.forEach(function(t){t.dataset.immerserSynchroHover===e?t.classList.add("_hover"):t.classList.remove("_hover")})},h.prototype.updateHash=function(e){var t=this.statemap[e],i=t.id;t.node.removeAttribute("id"),window.location.hash=i,t.node.setAttribute("id",i)},h.prototype.adjustScroll=function(){var e=this.statemap[this.reactiveActiveLayer.value],t=e.top,i=e.bottom,o=c(),r=o.x,n=o.y,s=Math.abs(n-t),a=Math.abs(n+this.windowHeight-i);0!==s&&0!==a&&(s<=a&&s<=this.options.scrollAdjustThreshold?window.scrollTo(r,t):a<=s&&a<=this.options.scrollAdjustThreshold&&window.scrollTo(r,i-this.windowHeight))},h.prototype.handleScroll=function(){var e=this;this.isBound&&(this.draw(),this.options.hasToUpdateHash&&this.options.scrollAdjustThreshold>0&&(this.scrollTimerId&&clearTimeout(this.scrollTimerId),this.scrollTimerId=setTimeout(function(){e.adjustScroll()},this.options.scrollAdjustDelay)))},h.prototype.handleResize=function(){var e=this;this.resizeTimerId&&window.cancelAnimationFrame(this.resizeTimerId),this.resizeTimerId=window.requestAnimationFrame(function(){e.setSizes(),e.draw()})},module.exports=h;


},{"@dubaua/merge-options":"R8uP"}],"i0CD":[function(require,module,exports) {
"use strict";

var _immerser = _interopRequireDefault(require("immerser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var immerserInstance = new _immerser.default({
  solidClassnameArray: [{
    'left-top': 'color-text',
    'right-bottom': 'color-text--contrast',
    'left-bottom': 'color-text--contrast'
  }, {
    'left-top': 'color-text--contrast',
    pager: 'pager--contrast',
    'left-bottom': 'color-text--contrast',
    'right-bottom': 'color-text'
  }, {
    'left-top': 'color-text',
    'right-bottom': 'color-text',
    'left-bottom': 'color-text'
  }, {
    'left-top': 'color-text--contrast',
    pager: 'pager--contrast',
    'left-bottom': 'color-text--contrast',
    'right-bottom': 'color-text'
  }, {
    'left-top': 'color-text',
    'right-bottom': 'color-text',
    'left-bottom': 'color-text'
  }, {
    'left-top': 'color-text',
    'right-bottom': 'color-text',
    'left-bottom': 'color-text'
  }, {
    'left-top': 'color-text',
    'right-bottom': 'color-text',
    'left-bottom': 'color-text'
  }],
  hasToUpdateHash: true,
  fromViewportWidth: 1024,
  onInit: function onInit(immerser) {// callback on init
  },
  onBind: function onBind(immerser) {// callback on bind
  },
  onUnbind: function onUnbind(immerser) {// callback on unbind
  },
  onDestroy: function onDestroy(immerser) {// callback on destroy
  },
  onActiveLayerChange: function onActiveLayerChange(activeIndex, immerser) {// callback on active layer change
  }
}); // установка иммерсера неправильная
// hasToAdjust false не помогает
},{"immerser":"WHwW"}],"hRTX":[function(require,module,exports) {
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],"Feqj":[function(require,module,exports) {
'use strict';

var bind = require('./helpers/bind');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":"hRTX"}],"phSU":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":"Feqj"}],"xpeW":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":"Feqj"}],"IAOH":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":"Feqj"}],"mXc0":[function(require,module,exports) {
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],"njyv":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":"Feqj"}],"Lpyz":[function(require,module,exports) {
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],"NZT3":[function(require,module,exports) {
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":"Lpyz"}],"Ztkp":[function(require,module,exports) {
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":"NZT3"}],"R56a":[function(require,module,exports) {
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],"uRyQ":[function(require,module,exports) {
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],"dm4E":[function(require,module,exports) {
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/isAbsoluteURL":"R56a","../helpers/combineURLs":"uRyQ"}],"Zn5P":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":"Feqj"}],"Rpqp":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":"Feqj"}],"MLCl":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":"Feqj"}],"akUF":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"./../utils":"Feqj","./../core/settle":"Ztkp","./../helpers/buildURL":"phSU","../core/buildFullPath":"dm4E","./../helpers/parseHeaders":"Zn5P","./../helpers/isURLSameOrigin":"Rpqp","../core/createError":"NZT3","./../helpers/cookies":"MLCl"}],"g5IB":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"A14q":[function(require,module,exports) {
var process = require("process");
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

},{"./utils":"Feqj","./helpers/normalizeHeaderName":"njyv","./adapters/xhr":"akUF","./adapters/http":"akUF","process":"g5IB"}],"HALK":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"./../utils":"Feqj","./transformData":"IAOH","../cancel/isCancel":"mXc0","../defaults":"A14q"}],"fBI1":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};

},{"../utils":"Feqj"}],"trUU":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../utils":"Feqj","../helpers/buildURL":"phSU","./InterceptorManager":"xpeW","./dispatchRequest":"HALK","./mergeConfig":"fBI1"}],"qFUg":[function(require,module,exports) {
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],"VgQU":[function(require,module,exports) {
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":"qFUg"}],"yisB":[function(require,module,exports) {
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],"Wzmt":[function(require,module,exports) {
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./utils":"Feqj","./helpers/bind":"hRTX","./core/Axios":"trUU","./core/mergeConfig":"fBI1","./defaults":"A14q","./cancel/Cancel":"qFUg","./cancel/CancelToken":"VgQU","./cancel/isCancel":"mXc0","./helpers/spread":"yisB"}],"O4Aa":[function(require,module,exports) {
module.exports = require('./lib/axios');
},{"./lib/axios":"Wzmt"}],"oVPx":[function(require,module,exports) {
"use strict";

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formNode = document.getElementById('contact-form');
var nameNode = document.getElementById('name');
var phoneNode = document.getElementById('phone');
var emailNode = document.getElementById('email');
var commentNode = document.getElementById('comment');
var messageNode = document.getElementById('message');
formNode.addEventListener('submit', function (e) {
  e.preventDefault();
  var formData = {
    name: nameNode.value,
    phone: phoneNode.value,
    email: emailNode.value,
    comment: commentNode.value
  };
  var positiveClassName = 'message--positive';
  var negativeClassName = 'message--negative';

  _axios.default.post('/order.php', formData).then(function (result) {
    var success = result.data.success;
    var message = success ? 'Успешно отправили!' : 'Ой, ошибка! Напишите нам на почту или позвоните';
    var messageClassName = success ? positiveClassName : negativeClassName;
    messageNode.textContent = message;
    messageNode.classList.add(messageClassName);
    setTimeout(function () {
      nameNode.value = '';
      phoneNode.value = '';
      emailNode.value = '';
      commentNode.value = '';
      messageNode.textContent = '';
      messageNode.classList.remove(positiveClassName);
      messageNode.classList.remove(negativeClassName);
    }, 3000);
  });
});
},{"axios":"O4Aa"}],"d6sW":[function(require,module,exports) {
"use strict";

require("./pumpjack.js");

require("./menu.js");

require("./form.js");
},{"./pumpjack.js":"o3YJ","./menu.js":"i0CD","./form.js":"oVPx"}]},{},["d6sW"], null)
//# sourceMappingURL=/main.3e12e014.js.map