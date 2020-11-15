/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const _CSGDEBUG = false

/** Number of polygons per 360 degree revolution for 2D objects.
 * @default
 */
const defaultResolution2D = 32 // FIXME this seems excessive
/** Number of polygons per 360 degree revolution for 3D objects.
 * @default
 */
const defaultResolution3D = 12

/** Epsilon used during determination of near zero distances.
 * @default
 */
const EPS = 1e-5

/** Epsilon used during determination of near zero areas.
 * @default
 */
const angleEPS = 0.10

/** Epsilon used during determination of near zero areas.
 *  This is the minimal area of a minimal polygon.
 * @default
 */
const areaEPS = 0.50 * EPS * EPS * Math.sin(angleEPS)

const all = 0
const top = 1
const bottom = 2
const left = 3
const right = 4
const front = 5
const back = 6
// Tag factory: we can request a unique tag through CSG.getTag()
let staticTag = 1
const getTag = () => staticTag++

module.exports = {
  _CSGDEBUG,
  defaultResolution2D,
  defaultResolution3D,
  EPS,
  angleEPS,
  areaEPS,
  all,
  top,
  bottom,
  left,
  right,
  front,
  back,
  staticTag,
  getTag
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const {IsFloat} = __webpack_require__(9)
const Vector2D = __webpack_require__(3)

/** Class Vector3D
 * Represents a 3D vector with X, Y, Z coordinates.
 * @constructor
 *
 * @example
 * new CSG.Vector3D(1, 2, 3);
 * new CSG.Vector3D([1, 2, 3]);
 * new CSG.Vector3D({ x: 1, y: 2, z: 3 });
 * new CSG.Vector3D(1, 2); // assumes z=0
 * new CSG.Vector3D([1, 2]); // assumes z=0
 */
const Vector3D = function (x, y, z) {
  if (arguments.length === 3) {
    this._x = parseFloat(x)
    this._y = parseFloat(y)
    this._z = parseFloat(z)
  } else if (arguments.length === 2) {
    this._x = parseFloat(x)
    this._y = parseFloat(y)
    this._z = 0
  } else {
    var ok = true
    if (arguments.length === 1) {
      if (typeof (x) === 'object') {
        if (x instanceof Vector3D) {
          this._x = x._x
          this._y = x._y
          this._z = x._z
        } else if (x instanceof Vector2D) {
          this._x = x._x
          this._y = x._y
          this._z = 0
        } else if (x instanceof Array) {
          if ((x.length < 2) || (x.length > 3)) {
            ok = false
          } else {
            this._x = parseFloat(x[0])
            this._y = parseFloat(x[1])
            if (x.length === 3) {
              this._z = parseFloat(x[2])
            } else {
              this._z = 0
            }
          }
        } else if (('x' in x) && ('y' in x)) {
          this._x = parseFloat(x.x)
          this._y = parseFloat(x.y)
          if ('z' in x) {
            this._z = parseFloat(x.z)
          } else {
            this._z = 0
          }
        } else if (('_x' in x) && ('_y' in x)) {
          this._x = parseFloat(x._x)
          this._y = parseFloat(x._y)
          if ('_z' in x) {
            this._z = parseFloat(x._z)
          } else {
            this._z = 0
          }
        } else ok = false
      } else {
        var v = parseFloat(x)
        this._x = v
        this._y = v
        this._z = v
      }
    } else ok = false
    if (ok) {
      if ((!IsFloat(this._x)) || (!IsFloat(this._y)) || (!IsFloat(this._z))) ok = false
    } else {
      throw new Error('wrong arguments')
    }
  }
}

// This does the same as new Vector3D(x,y,z) but it doesn't go through the constructor
// and the parameters are not validated. Is much faster.
Vector3D.Create = function (x, y, z) {
  var result = Object.create(Vector3D.prototype)
  result._x = x
  result._y = y
  result._z = z
  return result
}

Vector3D.prototype = {
  get x () {
    return this._x
  },
  get y () {
    return this._y
  },
  get z () {
    return this._z
  },

  set x (v) {
    throw new Error('Vector3D is immutable')
  },
  set y (v) {
    throw new Error('Vector3D is immutable')
  },
  set z (v) {
    throw new Error('Vector3D is immutable')
  },

  clone: function () {
    return Vector3D.Create(this._x, this._y, this._z)
  },

  negated: function () {
    return Vector3D.Create(-this._x, -this._y, -this._z)
  },

  abs: function () {
    return Vector3D.Create(Math.abs(this._x), Math.abs(this._y), Math.abs(this._z))
  },

  plus: function (a) {
    return Vector3D.Create(this._x + a._x, this._y + a._y, this._z + a._z)
  },

  minus: function (a) {
    return Vector3D.Create(this._x - a._x, this._y - a._y, this._z - a._z)
  },

  times: function (a) {
    return Vector3D.Create(this._x * a, this._y * a, this._z * a)
  },

  dividedBy: function (a) {
    return Vector3D.Create(this._x / a, this._y / a, this._z / a)
  },

  dot: function (a) {
    return this._x * a._x + this._y * a._y + this._z * a._z
  },

  lerp: function (a, t) {
    return this.plus(a.minus(this).times(t))
  },

  lengthSquared: function () {
    return this.dot(this)
  },

  length: function () {
    return Math.sqrt(this.lengthSquared())
  },

  unit: function () {
    return this.dividedBy(this.length())
  },

  cross: function (a) {
    return Vector3D.Create(
            this._y * a._z - this._z * a._y, this._z * a._x - this._x * a._z, this._x * a._y - this._y * a._x)
  },

  distanceTo: function (a) {
    return this.minus(a).length()
  },

  distanceToSquared: function (a) {
    return this.minus(a).lengthSquared()
  },

  equals: function (a) {
    return (this._x === a._x) && (this._y === a._y) && (this._z === a._z)
  },

    // Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
    // Returns a new Vector3D
  multiply4x4: function (matrix4x4) {
    return matrix4x4.leftMultiply1x3Vector(this)
  },

  transform: function (matrix4x4) {
    return matrix4x4.leftMultiply1x3Vector(this)
  },

  toString: function () {
    return '(' + this._x.toFixed(5) + ', ' + this._y.toFixed(5) + ', ' + this._z.toFixed(5) + ')'
  },

    // find a vector that is somewhat perpendicular to this one
  randomNonParallelVector: function () {
    var abs = this.abs()
    if ((abs._x <= abs._y) && (abs._x <= abs._z)) {
      return Vector3D.Create(1, 0, 0)
    } else if ((abs._y <= abs._x) && (abs._y <= abs._z)) {
      return Vector3D.Create(0, 1, 0)
    } else {
      return Vector3D.Create(0, 0, 1)
    }
  },

  min: function (p) {
    return Vector3D.Create(
            Math.min(this._x, p._x), Math.min(this._y, p._y), Math.min(this._z, p._z))
  },

  max: function (p) {
    return Vector3D.Create(
            Math.max(this._x, p._x), Math.max(this._y, p._y), Math.max(this._z, p._z))
  }
}

module.exports = Vector3D


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.props = props;
  }

  /**
   Create a CSG object by applying CSG operations.
    In a primitive this should create the primitive.
   In a modifier it should build the child objects and apply the CSG modifier that yields a new CSG object.
   In a generic component this should use the default implementation which first executes render(), which returns as a top-level component either a primitive or modifier, on which applyCsg() is then called.
  */


  _createClass(Component, [{
    key: 'applyCsg',
    value: function applyCsg(renderedChildren) {
      if (renderedChildren.length > 1) {
        throw new Error('Returning more than 1 Element from render() is not supported.');
      }
      return renderedChildren[0];
    }

    /**
     Returns the composed structure of the Component with its child components.
    */

  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return Component;
}();

module.exports = Component;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const {IsFloat} = __webpack_require__(9)

/** Class Vector2D
 * Represents a 2D vector with X, Y coordinates
 * @constructor
 *
 * @example
 * new CSG.Vector2D(1, 2);
 * new CSG.Vector3D([1, 2]);
 * new CSG.Vector3D({ x: 1, y: 2});
 */
const Vector2D = function (x, y) {
  if (arguments.length === 2) {
    this._x = parseFloat(x)
    this._y = parseFloat(y)
  } else {
    var ok = true
    if (arguments.length === 1) {
      if (typeof (x) === 'object') {
        if (x instanceof Vector2D) {
          this._x = x._x
          this._y = x._y
        } else if (x instanceof Array) {
          this._x = parseFloat(x[0])
          this._y = parseFloat(x[1])
        } else if (('x' in x) && ('y' in x)) {
          this._x = parseFloat(x.x)
          this._y = parseFloat(x.y)
        } else ok = false
      } else {
        var v = parseFloat(x)
        this._x = v
        this._y = v
      }
    } else ok = false
    if (ok) {
      if ((!IsFloat(this._x)) || (!IsFloat(this._y))) ok = false
    }
    if (!ok) {
      throw new Error('wrong arguments')
    }
  }
}

Vector2D.fromAngle = function (radians) {
  return Vector2D.fromAngleRadians(radians)
}

Vector2D.fromAngleDegrees = function (degrees) {
  var radians = Math.PI * degrees / 180
  return Vector2D.fromAngleRadians(radians)
}

Vector2D.fromAngleRadians = function (radians) {
  return Vector2D.Create(Math.cos(radians), Math.sin(radians))
}

// This does the same as new Vector2D(x,y) but it doesn't go through the constructor
// and the parameters are not validated. Is much faster.
Vector2D.Create = function (x, y) {
  var result = Object.create(Vector2D.prototype)
  result._x = x
  result._y = y
  return result
}

Vector2D.prototype = {
  get x () {
    return this._x
  },
  get y () {
    return this._y
  },

  set x (v) {
    throw new Error('Vector2D is immutable')
  },
  set y (v) {
    throw new Error('Vector2D is immutable')
  },

  // extend to a 3D vector by adding a z coordinate:
  toVector3D: function (z) {
    const Vector3D = __webpack_require__(1) // FIXME: circular dependencies Vector2 => Vector3 => Vector2
    return new Vector3D(this._x, this._y, z)
  },

  equals: function (a) {
    return (this._x === a._x) && (this._y === a._y)
  },

  clone: function () {
    return Vector2D.Create(this._x, this._y)
  },

  negated: function () {
    return Vector2D.Create(-this._x, -this._y)
  },

  plus: function (a) {
    return Vector2D.Create(this._x + a._x, this._y + a._y)
  },

  minus: function (a) {
    return Vector2D.Create(this._x - a._x, this._y - a._y)
  },

  times: function (a) {
    return Vector2D.Create(this._x * a, this._y * a)
  },

  dividedBy: function (a) {
    return Vector2D.Create(this._x / a, this._y / a)
  },

  dot: function (a) {
    return this._x * a._x + this._y * a._y
  },

  lerp: function (a, t) {
    return this.plus(a.minus(this).times(t))
  },

  length: function () {
    return Math.sqrt(this.dot(this))
  },

  distanceTo: function (a) {
    return this.minus(a).length()
  },

  distanceToSquared: function (a) {
    return this.minus(a).lengthSquared()
  },

  lengthSquared: function () {
    return this.dot(this)
  },

  unit: function () {
    return this.dividedBy(this.length())
  },

  cross: function (a) {
    return this._x * a._y - this._y * a._x
  },

    // returns the vector rotated by 90 degrees clockwise
  normal: function () {
    return Vector2D.Create(this._y, -this._x)
  },

    // Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
    // Returns a new Vector2D
  multiply4x4: function (matrix4x4) {
    return matrix4x4.leftMultiply1x2Vector(this)
  },

  transform: function (matrix4x4) {
    return matrix4x4.leftMultiply1x2Vector(this)
  },

  angle: function () {
    return this.angleRadians()
  },

  angleDegrees: function () {
    var radians = this.angleRadians()
    return 180 * radians / Math.PI
  },

  angleRadians: function () {
        // y=sin, x=cos
    return Math.atan2(this._y, this._x)
  },

  min: function (p) {
    return Vector2D.Create(
            Math.min(this._x, p._x), Math.min(this._y, p._y))
  },

  max: function (p) {
    return Vector2D.Create(
            Math.max(this._x, p._x), Math.max(this._y, p._y))
  },

  toString: function () {
    return '(' + this._x.toFixed(5) + ', ' + this._y.toFixed(5) + ')'
  },

  abs: function () {
    return Vector2D.Create(Math.abs(this._x), Math.abs(this._y))
  }
}

module.exports = Vector2D


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {


const primitives3d = __webpack_require__(35)
const primitives2d = __webpack_require__(27)
const booleanOps = __webpack_require__(29)
const transformations = __webpack_require__(46)
const extrusions = __webpack_require__(28)
const color = __webpack_require__(47)
const maths = __webpack_require__(48)
const text = __webpack_require__(49)
const { echo } = __webpack_require__(50)

// these are 'external' to this api and we basically just re-export for old api compatibility
// ...needs to be reviewed
const { CAG, CSG } = __webpack_require__(12)
const { log } = __webpack_require__(51) // FIXME: this is a duplicate of the one in openjscad itself,*/

// mostly likely needs to be removed since it is in the OpenJsCad namespace anyway, leaving here
// for now

const exportedApi = {
  csg: {CAG, CSG},
  primitives2d,
  primitives3d,
  booleanOps,
  transformations,
  extrusions,
  color,
  maths,
  text,
  OpenJsCad: {OpenJsCad: {log}},
  debug: {echo}
}

module.exports = exportedApi


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const {fnNumberSort} = __webpack_require__(9)
const FuzzyCSGFactory = __webpack_require__(37)
const Tree = __webpack_require__(40)
const {EPS} = __webpack_require__(0)
const {reTesselateCoplanarPolygons} = __webpack_require__(41)
const Polygon = __webpack_require__(7)
const Plane = __webpack_require__(6)
const Vertex = __webpack_require__(8)
const Vector2D = __webpack_require__(3)
const Vector3D = __webpack_require__(1)
const Matrix4x4 = __webpack_require__(11)
const OrthoNormalBasis = __webpack_require__(13)

const CAG = __webpack_require__(10) // FIXME: circular dependency !

const Properties = __webpack_require__(23)
const {Connector} = __webpack_require__(15)
const fixTJunctions = __webpack_require__(42)
// let {fromPolygons} = require('./CSGMakers') // FIXME: circular dependency !

/** Class CSG
 * Holds a binary space partition tree representing a 3D solid. Two solids can
 * be combined using the `union()`, `subtract()`, and `intersect()` methods.
 * @constructor
 */
let CSG = function () {
  this.polygons = []
  this.properties = new Properties()
  this.isCanonicalized = true
  this.isRetesselated = true
}

CSG.prototype = {
  /** @return {Polygon[]} The list of polygons. */
  toPolygons: function () {
    return this.polygons
  },

  /**
   * Return a new CSG solid representing the space in either this solid or
   * in the given solids. Neither this solid nor the given solids are modified.
   * @param {CSG[]} csg - list of CSG objects
   * @returns {CSG} new CSG object
   * @example
   * let C = A.union(B)
   * @example
   * +-------+            +-------+
   * |       |            |       |
   * |   A   |            |       |
   * |    +--+----+   =   |       +----+
   * +----+--+    |       +----+       |
   *      |   B   |            |       |
   *      |       |            |       |
   *      +-------+            +-------+
   */
  union: function (csg) {
    let csgs
    if (csg instanceof Array) {
      csgs = csg.slice(0)
      csgs.push(this)
    } else {
      csgs = [this, csg]
    }

    let i
    // combine csg pairs in a way that forms a balanced binary tree pattern
    for (i = 1; i < csgs.length; i += 2) {
      csgs.push(csgs[i - 1].unionSub(csgs[i]))
    }
    return csgs[i - 1].reTesselated().canonicalized()
  },

  unionSub: function (csg, retesselate, canonicalize) {
    if (!this.mayOverlap(csg)) {
      return this.unionForNonIntersecting(csg)
    } else {
      let a = new Tree(this.polygons)
      let b = new Tree(csg.polygons)
      a.clipTo(b, false)

            // b.clipTo(a, true); // ERROR: this doesn't work
      b.clipTo(a)
      b.invert()
      b.clipTo(a)
      b.invert()

      let newpolygons = a.allPolygons().concat(b.allPolygons())
      let result = CSG.fromPolygons(newpolygons)
      result.properties = this.properties._merge(csg.properties)
      if (retesselate) result = result.reTesselated()
      if (canonicalize) result = result.canonicalized()
      return result
    }
  },

    // Like union, but when we know that the two solids are not intersecting
    // Do not use if you are not completely sure that the solids do not intersect!
  unionForNonIntersecting: function (csg) {
    let newpolygons = this.polygons.concat(csg.polygons)
    let result = CSG.fromPolygons(newpolygons)
    result.properties = this.properties._merge(csg.properties)
    result.isCanonicalized = this.isCanonicalized && csg.isCanonicalized
    result.isRetesselated = this.isRetesselated && csg.isRetesselated
    return result
  },

  /**
   * Return a new CSG solid representing space in this solid but
   * not in the given solids. Neither this solid nor the given solids are modified.
   * @param {CSG[]} csg - list of CSG objects
   * @returns {CSG} new CSG object
   * @example
   * let C = A.subtract(B)
   * @example
   * +-------+            +-------+
   * |       |            |       |
   * |   A   |            |       |
   * |    +--+----+   =   |    +--+
   * +----+--+    |       +----+
   *      |   B   |
   *      |       |
   *      +-------+
   */
  subtract: function (csg) {
    let csgs
    if (csg instanceof Array) {
      csgs = csg
    } else {
      csgs = [csg]
    }
    let result = this
    for (let i = 0; i < csgs.length; i++) {
      let islast = (i === (csgs.length - 1))
      result = result.subtractSub(csgs[i], islast, islast)
    }
    return result
  },

  subtractSub: function (csg, retesselate, canonicalize) {
    let a = new Tree(this.polygons)
    let b = new Tree(csg.polygons)
    a.invert()
    a.clipTo(b)
    b.clipTo(a, true)
    a.addPolygons(b.allPolygons())
    a.invert()
    let result = CSG.fromPolygons(a.allPolygons())
    result.properties = this.properties._merge(csg.properties)
    if (retesselate) result = result.reTesselated()
    if (canonicalize) result = result.canonicalized()
    return result
  },

  /**
   * Return a new CSG solid representing space in both this solid and
   * in the given solids. Neither this solid nor the given solids are modified.
   * @param {CSG[]} csg - list of CSG objects
   * @returns {CSG} new CSG object
   * @example
   * let C = A.intersect(B)
   * @example
   * +-------+
   * |       |
   * |   A   |
   * |    +--+----+   =   +--+
   * +----+--+    |       +--+
   *      |   B   |
   *      |       |
   *      +-------+
   */
  intersect: function (csg) {
    let csgs
    if (csg instanceof Array) {
      csgs = csg
    } else {
      csgs = [csg]
    }
    let result = this
    for (let i = 0; i < csgs.length; i++) {
      let islast = (i === (csgs.length - 1))
      result = result.intersectSub(csgs[i], islast, islast)
    }
    return result
  },

  intersectSub: function (csg, retesselate, canonicalize) {
    let a = new Tree(this.polygons)
    let b = new Tree(csg.polygons)
    a.invert()
    b.clipTo(a)
    b.invert()
    a.clipTo(b)
    b.clipTo(a)
    a.addPolygons(b.allPolygons())
    a.invert()
    let result = CSG.fromPolygons(a.allPolygons())
    result.properties = this.properties._merge(csg.properties)
    if (retesselate) result = result.reTesselated()
    if (canonicalize) result = result.canonicalized()
    return result
  },

  /**
   * Return a new CSG solid with solid and empty space switched.
   * This solid is not modified.
   * @returns {CSG} new CSG object
   * @example
   * let B = A.invert()
   */
  invert: function () {
    let flippedpolygons = this.polygons.map(function (p) {
      return p.flipped()
    })
    return CSG.fromPolygons(flippedpolygons)
        // TODO: flip properties?
  },

    // Affine transformation of CSG object. Returns a new CSG object
  transform1: function (matrix4x4) {
    let newpolygons = this.polygons.map(function (p) {
      return p.transform(matrix4x4)
    })
    let result = CSG.fromPolygons(newpolygons)
    result.properties = this.properties._transform(matrix4x4)
    result.isRetesselated = this.isRetesselated
    return result
  },

  /**
   * Return a new CSG solid that is transformed using the given Matrix.
   * Several matrix transformations can be combined before transforming this solid.
   * @param {CSG.Matrix4x4} matrix4x4 - matrix to be applied
   * @returns {CSG} new CSG object
   * @example
   * var m = new CSG.Matrix4x4()
   * m = m.multiply(CSG.Matrix4x4.rotationX(40))
   * m = m.multiply(CSG.Matrix4x4.translation([-.5, 0, 0]))
   * let B = A.transform(m)
   */
  transform: function (matrix4x4) {
    let ismirror = matrix4x4.isMirroring()
    let transformedvertices = {}
    let transformedplanes = {}
    let newpolygons = this.polygons.map(function (p) {
      let newplane
      let plane = p.plane
      let planetag = plane.getTag()
      if (planetag in transformedplanes) {
        newplane = transformedplanes[planetag]
      } else {
        newplane = plane.transform(matrix4x4)
        transformedplanes[planetag] = newplane
      }
      let newvertices = p.vertices.map(function (v) {
        let newvertex
        let vertextag = v.getTag()
        if (vertextag in transformedvertices) {
          newvertex = transformedvertices[vertextag]
        } else {
          newvertex = v.transform(matrix4x4)
          transformedvertices[vertextag] = newvertex
        }
        return newvertex
      })
      if (ismirror) newvertices.reverse()
      return new Polygon(newvertices, p.shared, newplane)
    })
    let result = CSG.fromPolygons(newpolygons)
    result.properties = this.properties._transform(matrix4x4)
    result.isRetesselated = this.isRetesselated
    result.isCanonicalized = this.isCanonicalized
    return result
  },

  toString: function () {
    let result = 'CSG solid:\n'
    this.polygons.map(function (p) {
      result += p.toString()
    })
    return result
  },

    // Expand the solid
    // resolution: number of points per 360 degree for the rounded corners
  expand: function (radius, resolution) {
    let result = this.expandedShell(radius, resolution, true)
    result = result.reTesselated()
    result.properties = this.properties // keep original properties
    return result
  },

    // Contract the solid
    // resolution: number of points per 360 degree for the rounded corners
  contract: function (radius, resolution) {
    let expandedshell = this.expandedShell(radius, resolution, false)
    let result = this.subtract(expandedshell)
    result = result.reTesselated()
    result.properties = this.properties // keep original properties
    return result
  },

    // cut the solid at a plane, and stretch the cross-section found along plane normal
  stretchAtPlane: function (normal, point, length) {
    let plane = Plane.fromNormalAndPoint(normal, point)
    let onb = new OrthoNormalBasis(plane)
    let crosssect = this.sectionCut(onb)
    let midpiece = crosssect.extrudeInOrthonormalBasis(onb, length)
    let piece1 = this.cutByPlane(plane)
    let piece2 = this.cutByPlane(plane.flipped())
    let result = piece1.union([midpiece, piece2.translate(plane.normal.times(length))])
    return result
  },

    // Create the expanded shell of the solid:
    // All faces are extruded to get a thickness of 2*radius
    // Cylinders are constructed around every side
    // Spheres are placed on every vertex
    // unionWithThis: if true, the resulting solid will be united with 'this' solid;
    //   the result is a true expansion of the solid
    //   If false, returns only the shell
  expandedShell: function (radius, resolution, unionWithThis) {
    // const {sphere} = require('./primitives3d') // FIXME: circular dependency !
    let csg = this.reTesselated()
    let result
    if (unionWithThis) {
      result = csg
    } else {
      result = new CSG()
    }

        // first extrude all polygons:
    csg.polygons.map(function (polygon) {
      let extrudevector = polygon.plane.normal.unit().times(2 * radius)
      let translatedpolygon = polygon.translate(extrudevector.times(-0.5))
      let extrudedface = translatedpolygon.extrude(extrudevector)
      result = result.unionSub(extrudedface, false, false)
    })

    // Make a list of all unique vertex pairs (i.e. all sides of the solid)
    // For each vertex pair we collect the following:
    //   v1: first coordinate
    //   v2: second coordinate
    //   planenormals: array of normal vectors of all planes touching this side
    let vertexpairs = {} // map of 'vertex pair tag' to {v1, v2, planenormals}
    csg.polygons.map(function (polygon) {
      let numvertices = polygon.vertices.length
      let prevvertex = polygon.vertices[numvertices - 1]
      let prevvertextag = prevvertex.getTag()
      for (let i = 0; i < numvertices; i++) {
        let vertex = polygon.vertices[i]
        let vertextag = vertex.getTag()
        let vertextagpair
        if (vertextag < prevvertextag) {
          vertextagpair = vertextag + '-' + prevvertextag
        } else {
          vertextagpair = prevvertextag + '-' + vertextag
        }
        let obj
        if (vertextagpair in vertexpairs) {
          obj = vertexpairs[vertextagpair]
        } else {
          obj = {
            v1: prevvertex,
            v2: vertex,
            planenormals: []
          }
          vertexpairs[vertextagpair] = obj
        }
        obj.planenormals.push(polygon.plane.normal)

        prevvertextag = vertextag
        prevvertex = vertex
      }
    })

        // now construct a cylinder on every side
        // The cylinder is always an approximation of a true cylinder: it will have <resolution> polygons
        // around the sides. We will make sure though that the cylinder will have an edge at every
        // face that touches this side. This ensures that we will get a smooth fill even
        // if two edges are at, say, 10 degrees and the resolution is low.
        // Note: the result is not retesselated yet but it really should be!
    for (let vertextagpair in vertexpairs) {
      let vertexpair = vertexpairs[vertextagpair]
      let startpoint = vertexpair.v1.pos
      let endpoint = vertexpair.v2.pos
                // our x,y and z vectors:
      let zbase = endpoint.minus(startpoint).unit()
      let xbase = vertexpair.planenormals[0].unit()
      let ybase = xbase.cross(zbase)

      // make a list of angles that the cylinder should traverse:
      let angles = []

            // first of all equally spaced around the cylinder:
      for (let i = 0; i < resolution; i++) {
        angles.push(i * Math.PI * 2 / resolution)
      }

            // and also at every normal of all touching planes:
      for (let i = 0, iMax = vertexpair.planenormals.length; i < iMax; i++) {
        let planenormal = vertexpair.planenormals[i]
        let si = ybase.dot(planenormal)
        let co = xbase.dot(planenormal)
        let angle = Math.atan2(si, co)

        if (angle < 0) angle += Math.PI * 2
        angles.push(angle)
        angle = Math.atan2(-si, -co)
        if (angle < 0) angle += Math.PI * 2
        angles.push(angle)
      }

            // this will result in some duplicate angles but we will get rid of those later.
            // Sort:
      angles = angles.sort(fnNumberSort)

            // Now construct the cylinder by traversing all angles:
      let numangles = angles.length
      let prevp1
      let prevp2
      let startfacevertices = []
      let endfacevertices = []
      let polygons = []
      for (let i = -1; i < numangles; i++) {
        let angle = angles[(i < 0) ? (i + numangles) : i]
        let si = Math.sin(angle)
        let co = Math.cos(angle)
        let p = xbase.times(co * radius).plus(ybase.times(si * radius))
        let p1 = startpoint.plus(p)
        let p2 = endpoint.plus(p)
        let skip = false
        if (i >= 0) {
          if (p1.distanceTo(prevp1) < EPS) {
            skip = true
          }
        }
        if (!skip) {
          if (i >= 0) {
            startfacevertices.push(new Vertex(p1))
            endfacevertices.push(new Vertex(p2))
            let polygonvertices = [
              new Vertex(prevp2),
              new Vertex(p2),
              new Vertex(p1),
              new Vertex(prevp1)
            ]
            let polygon = new Polygon(polygonvertices)
            polygons.push(polygon)
          }
          prevp1 = p1
          prevp2 = p2
        }
      }
      endfacevertices.reverse()
      polygons.push(new Polygon(startfacevertices))
      polygons.push(new Polygon(endfacevertices))
      let cylinder = CSG.fromPolygons(polygons)
      result = result.unionSub(cylinder, false, false)
    }

        // make a list of all unique vertices
        // For each vertex we also collect the list of normals of the planes touching the vertices
    let vertexmap = {}
    csg.polygons.map(function (polygon) {
      polygon.vertices.map(function (vertex) {
        let vertextag = vertex.getTag()
        let obj
        if (vertextag in vertexmap) {
          obj = vertexmap[vertextag]
        } else {
          obj = {
            pos: vertex.pos,
            normals: []
          }
          vertexmap[vertextag] = obj
        }
        obj.normals.push(polygon.plane.normal)
      })
    })

        // and build spheres at each vertex
        // We will try to set the x and z axis to the normals of 2 planes
        // This will ensure that our sphere tesselation somewhat matches 2 planes
    for (let vertextag in vertexmap) {
      let vertexobj = vertexmap[vertextag]
            // use the first normal to be the x axis of our sphere:
      let xaxis = vertexobj.normals[0].unit()
            // and find a suitable z axis. We will use the normal which is most perpendicular to the x axis:
      let bestzaxis = null
      let bestzaxisorthogonality = 0
      for (let i = 1; i < vertexobj.normals.length; i++) {
        let normal = vertexobj.normals[i].unit()
        let cross = xaxis.cross(normal)
        let crosslength = cross.length()
        if (crosslength > 0.05) {
          if (crosslength > bestzaxisorthogonality) {
            bestzaxisorthogonality = crosslength
            bestzaxis = normal
          }
        }
      }
      if (!bestzaxis) {
        bestzaxis = xaxis.randomNonParallelVector()
      }
      let yaxis = xaxis.cross(bestzaxis).unit()
      let zaxis = yaxis.cross(xaxis)
      let _sphere = CSG.sphere({
        center: vertexobj.pos,
        radius: radius,
        resolution: resolution,
        axes: [xaxis, yaxis, zaxis]
      })
      result = result.unionSub(_sphere, false, false)
    }

    return result
  },

  canonicalized: function () {
    if (this.isCanonicalized) {
      return this
    } else {
      let factory = new FuzzyCSGFactory()
      let result = CSGFromCSGFuzzyFactory(factory, this)
      result.isCanonicalized = true
      result.isRetesselated = this.isRetesselated
      result.properties = this.properties // keep original properties
      return result
    }
  },

  reTesselated: function () {
    if (this.isRetesselated) {
      return this
    } else {
      let csg = this
      let polygonsPerPlane = {}
      let isCanonicalized = csg.isCanonicalized
      let fuzzyfactory = new FuzzyCSGFactory()
      csg.polygons.map(function (polygon) {
        let plane = polygon.plane
        let shared = polygon.shared
        if (!isCanonicalized) {
          // in order to identify to polygons having the same plane, we need to canonicalize the planes
          // We don't have to do a full canonizalization (including vertices), to save time only do the planes and the shared data:
          plane = fuzzyfactory.getPlane(plane)
          shared = fuzzyfactory.getPolygonShared(shared)
        }
        let tag = plane.getTag() + '/' + shared.getTag()
        if (!(tag in polygonsPerPlane)) {
          polygonsPerPlane[tag] = [polygon]
        } else {
          polygonsPerPlane[tag].push(polygon)
        }
      })
      let destpolygons = []
      for (let planetag in polygonsPerPlane) {
        let sourcepolygons = polygonsPerPlane[planetag]
        if (sourcepolygons.length < 2) {
          destpolygons = destpolygons.concat(sourcepolygons)
        } else {
          let retesselayedpolygons = []
          reTesselateCoplanarPolygons(sourcepolygons, retesselayedpolygons)
          destpolygons = destpolygons.concat(retesselayedpolygons)
        }
      }
      let result = CSG.fromPolygons(destpolygons)
      result.isRetesselated = true
            // result = result.canonicalized();
      result.properties = this.properties // keep original properties
      return result
    }
  },

  /**
   * Returns an array of Vector3D, providing minimum coordinates and maximum coordinates
   * of this solid.
   * @returns {Vector3D[]}
   * @example
   * let bounds = A.getBounds()
   * let minX = bounds[0].x
   */
  getBounds: function () {
    if (!this.cachedBoundingBox) {
      let minpoint = new Vector3D(0, 0, 0)
      let maxpoint = new Vector3D(0, 0, 0)
      let polygons = this.polygons
      let numpolygons = polygons.length
      for (let i = 0; i < numpolygons; i++) {
        let polygon = polygons[i]
        let bounds = polygon.boundingBox()
        if (i === 0) {
          minpoint = bounds[0]
          maxpoint = bounds[1]
        } else {
          minpoint = minpoint.min(bounds[0])
          maxpoint = maxpoint.max(bounds[1])
        }
      }
      this.cachedBoundingBox = [minpoint, maxpoint]
    }
    return this.cachedBoundingBox
  },

    // returns true if there is a possibility that the two solids overlap
    // returns false if we can be sure that they do not overlap
  mayOverlap: function (csg) {
    if ((this.polygons.length === 0) || (csg.polygons.length === 0)) {
      return false
    } else {
      let mybounds = this.getBounds()
      let otherbounds = csg.getBounds()
      if (mybounds[1].x < otherbounds[0].x) return false
      if (mybounds[0].x > otherbounds[1].x) return false
      if (mybounds[1].y < otherbounds[0].y) return false
      if (mybounds[0].y > otherbounds[1].y) return false
      if (mybounds[1].z < otherbounds[0].z) return false
      if (mybounds[0].z > otherbounds[1].z) return false
      return true
    }
  },

    // Cut the solid by a plane. Returns the solid on the back side of the plane
  cutByPlane: function (plane) {
    if (this.polygons.length === 0) {
      return new CSG()
    }
        // Ideally we would like to do an intersection with a polygon of inifinite size
        // but this is not supported by our implementation. As a workaround, we will create
        // a cube, with one face on the plane, and a size larger enough so that the entire
        // solid fits in the cube.
        // find the max distance of any vertex to the center of the plane:
    let planecenter = plane.normal.times(plane.w)
    let maxdistance = 0
    this.polygons.map(function (polygon) {
      polygon.vertices.map(function (vertex) {
        let distance = vertex.pos.distanceToSquared(planecenter)
        if (distance > maxdistance) maxdistance = distance
      })
    })
    maxdistance = Math.sqrt(maxdistance)
    maxdistance *= 1.01 // make sure it's really larger
        // Now build a polygon on the plane, at any point farther than maxdistance from the plane center:
    let vertices = []
    let orthobasis = new OrthoNormalBasis(plane)
    vertices.push(new Vertex(orthobasis.to3D(new Vector2D(maxdistance, -maxdistance))))
    vertices.push(new Vertex(orthobasis.to3D(new Vector2D(-maxdistance, -maxdistance))))
    vertices.push(new Vertex(orthobasis.to3D(new Vector2D(-maxdistance, maxdistance))))
    vertices.push(new Vertex(orthobasis.to3D(new Vector2D(maxdistance, maxdistance))))
    let polygon = new Polygon(vertices, null, plane.flipped())

        // and extrude the polygon into a cube, backwards of the plane:
    let cube = polygon.extrude(plane.normal.times(-maxdistance))

        // Now we can do the intersection:
    let result = this.intersect(cube)
    result.properties = this.properties // keep original properties
    return result
  },

    // Connect a solid to another solid, such that two Connectors become connected
    //   myConnector: a Connector of this solid
    //   otherConnector: a Connector to which myConnector should be connected
    //   mirror: false: the 'axis' vectors of the connectors should point in the same direction
    //           true: the 'axis' vectors of the connectors should point in opposite direction
    //   normalrotation: degrees of rotation between the 'normal' vectors of the two
    //                   connectors
  connectTo: function (myConnector, otherConnector, mirror, normalrotation) {
    let matrix = myConnector.getTransformationTo(otherConnector, mirror, normalrotation)
    return this.transform(matrix)
  },

    // set the .shared property of all polygons
    // Returns a new CSG solid, the original is unmodified!
  setShared: function (shared) {
    let polygons = this.polygons.map(function (p) {
      return new Polygon(p.vertices, shared, p.plane)
    })
    let result = CSG.fromPolygons(polygons)
    result.properties = this.properties // keep original properties
    result.isRetesselated = this.isRetesselated
    result.isCanonicalized = this.isCanonicalized
    return result
  },

  setColor: function (args) {
    let newshared = Polygon.Shared.fromColor.apply(this, arguments)
    return this.setShared(newshared)
  },

  toCompactBinary: function () {
    let csg = this.canonicalized(),
      numpolygons = csg.polygons.length,
      numpolygonvertices = 0,
      numvertices = 0,
      vertexmap = {},
      vertices = [],
      numplanes = 0,
      planemap = {},
      polygonindex = 0,
      planes = [],
      shareds = [],
      sharedmap = {},
      numshared = 0
        // for (let i = 0, iMax = csg.polygons.length; i < iMax; i++) {
        //  let p = csg.polygons[i];
        //  for (let j = 0, jMax = p.length; j < jMax; j++) {
        //      ++numpolygonvertices;
        //      let vertextag = p[j].getTag();
        //      if(!(vertextag in vertexmap)) {
        //          vertexmap[vertextag] = numvertices++;
        //          vertices.push(p[j]);
        //      }
        //  }
    csg.polygons.map(function (p) {
      p.vertices.map(function (v) {
        ++numpolygonvertices
        let vertextag = v.getTag()
        if (!(vertextag in vertexmap)) {
          vertexmap[vertextag] = numvertices++
          vertices.push(v)
        }
      })

      let planetag = p.plane.getTag()
      if (!(planetag in planemap)) {
        planemap[planetag] = numplanes++
        planes.push(p.plane)
      }
      let sharedtag = p.shared.getTag()
      if (!(sharedtag in sharedmap)) {
        sharedmap[sharedtag] = numshared++
        shareds.push(p.shared)
      }
    })
    let numVerticesPerPolygon = new Uint32Array(numpolygons)
    let polygonSharedIndexes = new Uint32Array(numpolygons)
    let polygonVertices = new Uint32Array(numpolygonvertices)
    let polygonPlaneIndexes = new Uint32Array(numpolygons)
    let vertexData = new Float64Array(numvertices * 3)
    let planeData = new Float64Array(numplanes * 4)
    let polygonVerticesIndex = 0
    for (let polygonindex = 0; polygonindex < numpolygons; ++polygonindex) {
      let p = csg.polygons[polygonindex]
      numVerticesPerPolygon[polygonindex] = p.vertices.length
      p.vertices.map(function (v) {
        let vertextag = v.getTag()
        let vertexindex = vertexmap[vertextag]
        polygonVertices[polygonVerticesIndex++] = vertexindex
      })
      let planetag = p.plane.getTag()
      let planeindex = planemap[planetag]
      polygonPlaneIndexes[polygonindex] = planeindex
      let sharedtag = p.shared.getTag()
      let sharedindex = sharedmap[sharedtag]
      polygonSharedIndexes[polygonindex] = sharedindex
    }
    let verticesArrayIndex = 0
    vertices.map(function (v) {
      let pos = v.pos
      vertexData[verticesArrayIndex++] = pos._x
      vertexData[verticesArrayIndex++] = pos._y
      vertexData[verticesArrayIndex++] = pos._z
    })
    let planesArrayIndex = 0
    planes.map(function (p) {
      let normal = p.normal
      planeData[planesArrayIndex++] = normal._x
      planeData[planesArrayIndex++] = normal._y
      planeData[planesArrayIndex++] = normal._z
      planeData[planesArrayIndex++] = p.w
    })
    let result = {
      'class': 'CSG',
      numPolygons: numpolygons,
      numVerticesPerPolygon: numVerticesPerPolygon,
      polygonPlaneIndexes: polygonPlaneIndexes,
      polygonSharedIndexes: polygonSharedIndexes,
      polygonVertices: polygonVertices,
      vertexData: vertexData,
      planeData: planeData,
      shared: shareds
    }
    return result
  },

    // Get the transformation that transforms this CSG such that it is lying on the z=0 plane,
    // as flat as possible (i.e. the least z-height).
    // So that it is in an orientation suitable for CNC milling
  getTransformationAndInverseTransformationToFlatLying: function () {
    if (this.polygons.length === 0) {
      let m = new Matrix4x4() // unity
      return [m, m]
    } else {
            // get a list of unique planes in the CSG:
      let csg = this.canonicalized()
      let planemap = {}
      csg.polygons.map(function (polygon) {
        planemap[polygon.plane.getTag()] = polygon.plane
      })
            // try each plane in the CSG and find the plane that, when we align it flat onto z=0,
            // gives the least height in z-direction.
            // If two planes give the same height, pick the plane that originally had a normal closest
            // to [0,0,-1].
      let xvector = new Vector3D(1, 0, 0)
      let yvector = new Vector3D(0, 1, 0)
      let zvector = new Vector3D(0, 0, 1)
      let z0connectorx = new Connector([0, 0, 0], [0, 0, -1], xvector)
      let z0connectory = new Connector([0, 0, 0], [0, 0, -1], yvector)
      let isfirst = true
      let minheight = 0
      let maxdotz = 0
      let besttransformation, bestinversetransformation
      for (let planetag in planemap) {
        let plane = planemap[planetag]
        let pointonplane = plane.normal.times(plane.w)
        let transformation, inversetransformation
                // We need a normal vecrtor for the transformation
                // determine which is more perpendicular to the plane normal: x or y?
                // we will align this as much as possible to the x or y axis vector
        let xorthogonality = plane.normal.cross(xvector).length()
        let yorthogonality = plane.normal.cross(yvector).length()
        if (xorthogonality > yorthogonality) {
                    // x is better:
          let planeconnector = new Connector(pointonplane, plane.normal, xvector)
          transformation = planeconnector.getTransformationTo(z0connectorx, false, 0)
          inversetransformation = z0connectorx.getTransformationTo(planeconnector, false, 0)
        } else {
                    // y is better:
          let planeconnector = new Connector(pointonplane, plane.normal, yvector)
          transformation = planeconnector.getTransformationTo(z0connectory, false, 0)
          inversetransformation = z0connectory.getTransformationTo(planeconnector, false, 0)
        }
        let transformedcsg = csg.transform(transformation)
        let dotz = -plane.normal.dot(zvector)
        let bounds = transformedcsg.getBounds()
        let zheight = bounds[1].z - bounds[0].z
        let isbetter = isfirst
        if (!isbetter) {
          if (zheight < minheight) {
            isbetter = true
          } else if (zheight === minheight) {
            if (dotz > maxdotz) isbetter = true
          }
        }
        if (isbetter) {
                    // translate the transformation around the z-axis and onto the z plane:
          let translation = new Vector3D([-0.5 * (bounds[1].x + bounds[0].x), -0.5 * (bounds[1].y + bounds[0].y), -bounds[0].z])
          transformation = transformation.multiply(Matrix4x4.translation(translation))
          inversetransformation = Matrix4x4.translation(translation.negated()).multiply(inversetransformation)
          minheight = zheight
          maxdotz = dotz
          besttransformation = transformation
          bestinversetransformation = inversetransformation
        }
        isfirst = false
      }
      return [besttransformation, bestinversetransformation]
    }
  },

  getTransformationToFlatLying: function () {
    let result = this.getTransformationAndInverseTransformationToFlatLying()
    return result[0]
  },

  lieFlat: function () {
    let transformation = this.getTransformationToFlatLying()
    return this.transform(transformation)
  },

    // project the 3D CSG onto a plane
    // This returns a 2D CAG with the 'shadow' shape of the 3D solid when projected onto the
    // plane represented by the orthonormal basis
  projectToOrthoNormalBasis: function (orthobasis) {
    let cags = []
    this.polygons.filter(function (p) {
                // only return polys in plane, others may disturb result
      return p.plane.normal.minus(orthobasis.plane.normal).lengthSquared() < (EPS * EPS)
    })
            .map(function (polygon) {
              let cag = polygon.projectToOrthoNormalBasis(orthobasis)
              if (cag.sides.length > 0) {
                cags.push(cag)
              }
            })
    let result = new CAG().union(cags)
    return result
  },

  sectionCut: function (orthobasis) {
    let plane1 = orthobasis.plane
    let plane2 = orthobasis.plane.flipped()
    plane1 = new Plane(plane1.normal, plane1.w)
    plane2 = new Plane(plane2.normal, plane2.w + (5 * EPS))
    let cut3d = this.cutByPlane(plane1)
    cut3d = cut3d.cutByPlane(plane2)
    return cut3d.projectToOrthoNormalBasis(orthobasis)
  },

  fixTJunctions: function () {
    return fixTJunctions(CSG.fromPolygons, this)
  },

  toTriangles: function () {
    let polygons = []
    this.polygons.forEach(function (poly) {
      let firstVertex = poly.vertices[0]
      for (let i = poly.vertices.length - 3; i >= 0; i--) {
        polygons.push(new Polygon([
          firstVertex, poly.vertices[i + 1], poly.vertices[i + 2]
        ],
                    poly.shared, poly.plane))
      }
    })
    return polygons
  },

  /**
   * Returns an array of values for the requested features of this solid.
   * Supported Features: 'volume', 'area'
   * @param {String[]} features - list of features to calculate
   * @returns {Float[]} values
   * @example
   * let volume = A.getFeatures('volume')
   * let values = A.getFeatures('area','volume')
   */
  getFeatures: function (features) {
    if (!(features instanceof Array)) {
      features = [features]
    }
    let result = this.toTriangles().map(function (triPoly) {
      return triPoly.getTetraFeatures(features)
    })
            .reduce(function (pv, v) {
              return v.map(function (feat, i) {
                return feat + (pv === 0 ? 0 : pv[i])
              })
            }, 0)
    return (result.length === 1) ? result[0] : result
  }
}

/** Construct a CSG solid from a list of `Polygon` instances.
 * @param {Polygon[]} polygons - list of polygons
 * @returns {CSG} new CSG object
 */
CSG.fromPolygons = function fromPolygons (polygons) {
  let csg = new CSG()
  csg.polygons = polygons
  csg.isCanonicalized = false
  csg.isRetesselated = false
  return csg
}

const CSGFromCSGFuzzyFactory = function (factory, sourcecsg) {
  let _this = factory
  let newpolygons = []
  sourcecsg.polygons.forEach(function (polygon) {
    let newpolygon = _this.getPolygon(polygon)
          // see getPolygon above: we may get a polygon with no vertices, discard it:
    if (newpolygon.vertices.length >= 3) {
      newpolygons.push(newpolygon)
    }
  })
  return CSG.fromPolygons(newpolygons)
}

module.exports = CSG


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Vector3D = __webpack_require__(1)
const Line3D = __webpack_require__(18)
const {EPS, getTag} = __webpack_require__(0)

// # class Plane
// Represents a plane in 3D space.
const Plane = function (normal, w) {
  this.normal = normal
  this.w = w
}

// create from an untyped object with identical property names:
Plane.fromObject = function (obj) {
  let normal = new Vector3D(obj.normal)
  let w = parseFloat(obj.w)
  return new Plane(normal, w)
}

Plane.fromVector3Ds = function (a, b, c) {
  let n = b.minus(a).cross(c.minus(a)).unit()
  return new Plane(n, n.dot(a))
}

// like fromVector3Ds, but allow the vectors to be on one point or one line
// in such a case a random plane through the given points is constructed
Plane.anyPlaneFromVector3Ds = function (a, b, c) {
  let v1 = b.minus(a)
  let v2 = c.minus(a)
  if (v1.length() < EPS) {
    v1 = v2.randomNonParallelVector()
  }
  if (v2.length() < EPS) {
    v2 = v1.randomNonParallelVector()
  }
  let normal = v1.cross(v2)
  if (normal.length() < EPS) {
        // this would mean that v1 == v2.negated()
    v2 = v1.randomNonParallelVector()
    normal = v1.cross(v2)
  }
  normal = normal.unit()
  return new Plane(normal, normal.dot(a))
}

Plane.fromPoints = function (a, b, c) {
  a = new Vector3D(a)
  b = new Vector3D(b)
  c = new Vector3D(c)
  return Plane.fromVector3Ds(a, b, c)
}

Plane.fromNormalAndPoint = function (normal, point) {
  normal = new Vector3D(normal)
  point = new Vector3D(point)
  normal = normal.unit()
  let w = point.dot(normal)
  return new Plane(normal, w)
}

Plane.prototype = {
  flipped: function () {
    return new Plane(this.normal.negated(), -this.w)
  },

  getTag: function () {
    let result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  },

  equals: function (n) {
    return this.normal.equals(n.normal) && this.w === n.w
  },

  transform: function (matrix4x4) {
    let ismirror = matrix4x4.isMirroring()
        // get two vectors in the plane:
    let r = this.normal.randomNonParallelVector()
    let u = this.normal.cross(r)
    let v = this.normal.cross(u)
        // get 3 points in the plane:
    let point1 = this.normal.times(this.w)
    let point2 = point1.plus(u)
    let point3 = point1.plus(v)
        // transform the points:
    point1 = point1.multiply4x4(matrix4x4)
    point2 = point2.multiply4x4(matrix4x4)
    point3 = point3.multiply4x4(matrix4x4)
        // and create a new plane from the transformed points:
    let newplane = Plane.fromVector3Ds(point1, point2, point3)
    if (ismirror) {
            // the transform is mirroring
            // We should mirror the plane:
      newplane = newplane.flipped()
    }
    return newplane
  },

    // robust splitting of a line by a plane
    // will work even if the line is parallel to the plane
  splitLineBetweenPoints: function (p1, p2) {
    let direction = p2.minus(p1)
    let labda = (this.w - this.normal.dot(p1)) / this.normal.dot(direction)
    if (isNaN(labda)) labda = 0
    if (labda > 1) labda = 1
    if (labda < 0) labda = 0
    let result = p1.plus(direction.times(labda))
    return result
  },

    // returns Vector3D
  intersectWithLine: function (line3d) {
    return line3d.intersectWithPlane(this)
  },

    // intersection of two planes
  intersectWithPlane: function (plane) {
    return Line3D.fromPlanes(this, plane)
  },

  signedDistanceToPoint: function (point) {
    let t = this.normal.dot(point) - this.w
    return t
  },

  toString: function () {
    return '[normal: ' + this.normal.toString() + ', w: ' + this.w + ']'
  },

  mirrorPoint: function (point3d) {
    let distance = this.signedDistanceToPoint(point3d)
    let mirrored = point3d.minus(this.normal.times(distance * 2.0))
    return mirrored
  }
}

module.exports = Plane


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Vector3D = __webpack_require__(1)
const Vertex = __webpack_require__(8)
const Matrix4x4 = __webpack_require__(11)
const {_CSGDEBUG, EPS, getTag, areaEPS} = __webpack_require__(0)
const {fnSortByIndex} = __webpack_require__(9)

/** Class Polygon
 * Represents a convex polygon. The vertices used to initialize a polygon must
 *   be coplanar and form a convex loop. They do not have to be `Vertex`
 *   instances but they must behave similarly (duck typing can be used for
 *   customization).
 * <br>
 * Each convex polygon has a `shared` property, which is shared between all
 *   polygons that are clones of each other or were split from the same polygon.
 *   This can be used to define per-polygon properties (such as surface color).
 * <br>
 * The plane of the polygon is calculated from the vertex coordinates if not provided.
 *   The plane can alternatively be passed as the third argument to avoid calculations.
 *
 * @constructor
 * @param {Vertex[]} vertices - list of vertices
 * @param {Polygon.Shared} [shared=defaultShared] - shared property to apply
 * @param {Plane} [plane] - plane of the polygon
 *
 * @example
 * const vertices = [
 *   new CSG.Vertex(new CSG.Vector3D([0, 0, 0])),
 *   new CSG.Vertex(new CSG.Vector3D([0, 10, 0])),
 *   new CSG.Vertex(new CSG.Vector3D([0, 10, 10]))
 * ]
 * let observed = new Polygon(vertices)
 */
let Polygon = function (vertices, shared, plane) {
  this.vertices = vertices
  if (!shared) shared = Polygon.defaultShared
  this.shared = shared
    // let numvertices = vertices.length;

  if (arguments.length >= 3) {
    this.plane = plane
  } else {
    const Plane = __webpack_require__(6) // FIXME: circular dependencies
    this.plane = Plane.fromVector3Ds(vertices[0].pos, vertices[1].pos, vertices[2].pos)
  }

  if (_CSGDEBUG) {
    if (!this.checkIfConvex()) {
      throw new Error('Not convex!')
    }
  }
}

// create from an untyped object with identical property names:
Polygon.fromObject = function (obj) {
  const Plane = __webpack_require__(6) // FIXME: circular dependencies
  let vertices = obj.vertices.map(function (v) {
    return Vertex.fromObject(v)
  })
  let shared = Polygon.Shared.fromObject(obj.shared)
  let plane = Plane.fromObject(obj.plane)
  return new Polygon(vertices, shared, plane)
}

Polygon.prototype = {
  /** Check whether the polygon is convex. (it should be, otherwise we will get unexpected results)
   * @returns {boolean}
   */
  checkIfConvex: function () {
    return Polygon.verticesConvex(this.vertices, this.plane.normal)
  },

  // FIXME what? why does this return this, and not a new polygon?
  // FIXME is this used?
  setColor: function (args) {
    let newshared = Polygon.Shared.fromColor.apply(this, arguments)
    this.shared = newshared
    return this
  },

  getSignedVolume: function () {
    let signedVolume = 0
    for (let i = 0; i < this.vertices.length - 2; i++) {
      signedVolume += this.vertices[0].pos.dot(this.vertices[i + 1].pos
                .cross(this.vertices[i + 2].pos))
    }
    signedVolume /= 6
    return signedVolume
  },

    // Note: could calculate vectors only once to speed up
  getArea: function () {
    let polygonArea = 0
    for (let i = 0; i < this.vertices.length - 2; i++) {
      polygonArea += this.vertices[i + 1].pos.minus(this.vertices[0].pos)
                .cross(this.vertices[i + 2].pos.minus(this.vertices[i + 1].pos)).length()
    }
    polygonArea /= 2
    return polygonArea
  },

    // accepts array of features to calculate
    // returns array of results
  getTetraFeatures: function (features) {
    let result = []
    features.forEach(function (feature) {
      if (feature === 'volume') {
        result.push(this.getSignedVolume())
      } else if (feature === 'area') {
        result.push(this.getArea())
      }
    }, this)
    return result
  },

    // Extrude a polygon into the direction offsetvector
    // Returns a CSG object
  extrude: function (offsetvector) {
    const CSG = __webpack_require__(5) // because of circular dependencies

    let newpolygons = []

    let polygon1 = this
    let direction = polygon1.plane.normal.dot(offsetvector)
    if (direction > 0) {
      polygon1 = polygon1.flipped()
    }
    newpolygons.push(polygon1)
    let polygon2 = polygon1.translate(offsetvector)
    let numvertices = this.vertices.length
    for (let i = 0; i < numvertices; i++) {
      let sidefacepoints = []
      let nexti = (i < (numvertices - 1)) ? i + 1 : 0
      sidefacepoints.push(polygon1.vertices[i].pos)
      sidefacepoints.push(polygon2.vertices[i].pos)
      sidefacepoints.push(polygon2.vertices[nexti].pos)
      sidefacepoints.push(polygon1.vertices[nexti].pos)
      let sidefacepolygon = Polygon.createFromPoints(sidefacepoints, this.shared)
      newpolygons.push(sidefacepolygon)
    }
    polygon2 = polygon2.flipped()
    newpolygons.push(polygon2)
    return CSG.fromPolygons(newpolygons)
  },

  translate: function (offset) {
    return this.transform(Matrix4x4.translation(offset))
  },

    // returns an array with a Vector3D (center point) and a radius
  boundingSphere: function () {
    if (!this.cachedBoundingSphere) {
      let box = this.boundingBox()
      let middle = box[0].plus(box[1]).times(0.5)
      let radius3 = box[1].minus(middle)
      let radius = radius3.length()
      this.cachedBoundingSphere = [middle, radius]
    }
    return this.cachedBoundingSphere
  },

    // returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
  boundingBox: function () {
    if (!this.cachedBoundingBox) {
      let minpoint, maxpoint
      let vertices = this.vertices
      let numvertices = vertices.length
      if (numvertices === 0) {
        minpoint = new Vector3D(0, 0, 0)
      } else {
        minpoint = vertices[0].pos
      }
      maxpoint = minpoint
      for (let i = 1; i < numvertices; i++) {
        let point = vertices[i].pos
        minpoint = minpoint.min(point)
        maxpoint = maxpoint.max(point)
      }
      this.cachedBoundingBox = [minpoint, maxpoint]
    }
    return this.cachedBoundingBox
  },

  flipped: function () {
    let newvertices = this.vertices.map(function (v) {
      return v.flipped()
    })
    newvertices.reverse()
    let newplane = this.plane.flipped()
    return new Polygon(newvertices, this.shared, newplane)
  },

    // Affine transformation of polygon. Returns a new Polygon
  transform: function (matrix4x4) {
    let newvertices = this.vertices.map(function (v) {
      return v.transform(matrix4x4)
    })
    let newplane = this.plane.transform(matrix4x4)
    if (matrix4x4.isMirroring()) {
            // need to reverse the vertex order
            // in order to preserve the inside/outside orientation:
      newvertices.reverse()
    }
    return new Polygon(newvertices, this.shared, newplane)
  },

  toString: function () {
    let result = 'Polygon plane: ' + this.plane.toString() + '\n'
    this.vertices.map(function (vertex) {
      result += '  ' + vertex.toString() + '\n'
    })
    return result
  },

    // project the 3D polygon onto a plane
  projectToOrthoNormalBasis: function (orthobasis) {
    const CAG = __webpack_require__(10)
    const {fromPointsNoCheck} = __webpack_require__(22) // circular dependencies
    let points2d = this.vertices.map(function (vertex) {
      return orthobasis.to2D(vertex.pos)
    })

    let result = fromPointsNoCheck(points2d)
    let area = result.area()
    if (Math.abs(area) < areaEPS) {
            // the polygon was perpendicular to the orthnormal plane. The resulting 2D polygon would be degenerate
            // return an empty area instead:
      result = new CAG()
    } else if (area < 0) {
      result = result.flipped()
    }
    return result
  },

  //FIXME: WHY is this for 3D polygons and not for 2D shapes ?
    /**
     * Creates solid from slices (Polygon) by generating walls
     * @param {Object} options Solid generating options
     *  - numslices {Number} Number of slices to be generated
     *  - callback(t, slice) {Function} Callback function generating slices.
     *          arguments: t = [0..1], slice = [0..numslices - 1]
     *          return: Polygon or null to skip
     *  - loop {Boolean} no flats, only walls, it's used to generate solids like a tor
     */
  solidFromSlices: function (options) {
    const CSG = __webpack_require__(5)

    let polygons = [],
      csg = null,
      prev = null,
      bottom = null,
      top = null,
      numSlices = 2,
      bLoop = false,
      fnCallback,
      flipped = null

    if (options) {
      bLoop = Boolean(options['loop'])

      if (options.numslices) { numSlices = options.numslices }

      if (options.callback) {
        fnCallback = options.callback
      }
    }
    if (!fnCallback) {
      let square = new Polygon.createFromPoints([
                [0, 0, 0],
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
      ])
      fnCallback = function (t, slice) {
        return t === 0 || t === 1 ? square.translate([0, 0, t]) : null
      }
    }
    for (let i = 0, iMax = numSlices - 1; i <= iMax; i++) {
      csg = fnCallback.call(this, i / iMax, i)
      if (csg) {
        if (!(csg instanceof Polygon)) {
          throw new Error('Polygon.solidFromSlices callback error: Polygon expected')
        }
        csg.checkIfConvex()

        if (prev) { // generate walls
          if (flipped === null) { // not generated yet
            flipped = prev.plane.signedDistanceToPoint(csg.vertices[0].pos) < 0
          }
          this._addWalls(polygons, prev, csg, flipped)
        } else { // the first - will be a bottom
          bottom = csg
        }
        prev = csg
      } // callback can return null to skip that slice
    }
    top = csg

    if (bLoop) {
      let bSameTopBottom = bottom.vertices.length === top.vertices.length &&
                bottom.vertices.every(function (v, index) {
                  return v.pos.equals(top.vertices[index].pos)
                })
            // if top and bottom are not the same -
            // generate walls between them
      if (!bSameTopBottom) {
        this._addWalls(polygons, top, bottom, flipped)
      } // else - already generated
    } else {
            // save top and bottom
            // TODO: flip if necessary
      polygons.unshift(flipped ? bottom : bottom.flipped())
      polygons.push(flipped ? top.flipped() : top)
    }
    return CSG.fromPolygons(polygons)
  },
    /**
     *
     * @param walls Array of wall polygons
     * @param bottom Bottom polygon
     * @param top Top polygon
     */
  _addWalls: function (walls, bottom, top, bFlipped) {
    let bottomPoints = bottom.vertices.slice(0) // make a copy
    let topPoints = top.vertices.slice(0) // make a copy
    let color = top.shared || null

        // check if bottom perimeter is closed
    if (!bottomPoints[0].pos.equals(bottomPoints[bottomPoints.length - 1].pos)) {
      bottomPoints.push(bottomPoints[0])
    }

        // check if top perimeter is closed
    if (!topPoints[0].pos.equals(topPoints[topPoints.length - 1].pos)) {
      topPoints.push(topPoints[0])
    }
    if (bFlipped) {
      bottomPoints = bottomPoints.reverse()
      topPoints = topPoints.reverse()
    }

    let iTopLen = topPoints.length - 1
    let iBotLen = bottomPoints.length - 1
    let iExtra = iTopLen - iBotLen// how many extra triangles we need
    let bMoreTops = iExtra > 0
    let bMoreBottoms = iExtra < 0

    let aMin = [] // indexes to start extra triangles (polygon with minimal square)
        // init - we need exactly /iExtra/ small triangles
    for (let i = Math.abs(iExtra); i > 0; i--) {
      aMin.push({
        len: Infinity,
        index: -1
      })
    }

    let len
    if (bMoreBottoms) {
      for (let i = 0; i < iBotLen; i++) {
        len = bottomPoints[i].pos.distanceToSquared(bottomPoints[i + 1].pos)
                // find the element to replace
        for (let j = aMin.length - 1; j >= 0; j--) {
          if (aMin[j].len > len) {
            aMin[j].len = len
            aMin.index = j
            break
          }
        } // for
      }
    } else if (bMoreTops) {
      for (let i = 0; i < iTopLen; i++) {
        len = topPoints[i].pos.distanceToSquared(topPoints[i + 1].pos)
                // find the element to replace
        for (let j = aMin.length - 1; j >= 0; j--) {
          if (aMin[j].len > len) {
            aMin[j].len = len
            aMin.index = j
            break
          }
        } // for
      }
    } // if
        // sort by index
    aMin.sort(fnSortByIndex)
    let getTriangle = function addWallsPutTriangle (pointA, pointB, pointC, color) {
      return new Polygon([pointA, pointB, pointC], color)
            // return bFlipped ? triangle.flipped() : triangle;
    }

    let bpoint = bottomPoints[0]
    let tpoint = topPoints[0]
    let secondPoint
    let nBotFacet
    let nTopFacet // length of triangle facet side
    for (let iB = 0, iT = 0, iMax = iTopLen + iBotLen; iB + iT < iMax;) {
      if (aMin.length) {
        if (bMoreTops && iT === aMin[0].index) { // one vertex is on the bottom, 2 - on the top
          secondPoint = topPoints[++iT]
                    // console.log('<<< extra top: ' + secondPoint + ', ' + tpoint + ', bottom: ' + bpoint);
          walls.push(getTriangle(
                        secondPoint, tpoint, bpoint, color
                    ))
          tpoint = secondPoint
          aMin.shift()
          continue
        } else if (bMoreBottoms && iB === aMin[0].index) {
          secondPoint = bottomPoints[++iB]
          walls.push(getTriangle(
                        tpoint, bpoint, secondPoint, color
                    ))
          bpoint = secondPoint
          aMin.shift()
          continue
        }
      }
            // choose the shortest path
      if (iB < iBotLen) { // one vertex is on the top, 2 - on the bottom
        nBotFacet = tpoint.pos.distanceToSquared(bottomPoints[iB + 1].pos)
      } else {
        nBotFacet = Infinity
      }
      if (iT < iTopLen) { // one vertex is on the bottom, 2 - on the top
        nTopFacet = bpoint.pos.distanceToSquared(topPoints[iT + 1].pos)
      } else {
        nTopFacet = Infinity
      }
      if (nBotFacet <= nTopFacet) {
        secondPoint = bottomPoints[++iB]
        walls.push(getTriangle(
                    tpoint, bpoint, secondPoint, color
                ))
        bpoint = secondPoint
      } else if (iT < iTopLen) { // nTopFacet < Infinity
        secondPoint = topPoints[++iT]
                // console.log('<<< top: ' + secondPoint + ', ' + tpoint + ', bottom: ' + bpoint);
        walls.push(getTriangle(
                    secondPoint, tpoint, bpoint, color
                ))
        tpoint = secondPoint
      };
    }
    return walls
  }
}

Polygon.verticesConvex = function (vertices, planenormal) {
  let numvertices = vertices.length
  if (numvertices > 2) {
    let prevprevpos = vertices[numvertices - 2].pos
    let prevpos = vertices[numvertices - 1].pos
    for (let i = 0; i < numvertices; i++) {
      let pos = vertices[i].pos
      if (!Polygon.isConvexPoint(prevprevpos, prevpos, pos, planenormal)) {
        return false
      }
      prevprevpos = prevpos
      prevpos = pos
    }
  }
  return true
}

/** Create a polygon from the given points.
 *
 * @param {Array[]} points - list of points
 * @param {Polygon.Shared} [shared=defaultShared] - shared property to apply
 * @param {Plane} [plane] - plane of the polygon
 *
 * @example
 * const points = [
 *   [0,  0, 0],
 *   [0, 10, 0],
 *   [0, 10, 10]
 * ]
 * let observed = CSG.Polygon.createFromPoints(points)
 */
Polygon.createFromPoints = function (points, shared, plane) {
  let vertices = []
  points.map(function (p) {
    let vec = new Vector3D(p)
    let vertex = new Vertex(vec)
    vertices.push(vertex)
  })
  let polygon
  if (arguments.length < 3) {
    polygon = new Polygon(vertices, shared)
  } else {
    polygon = new Polygon(vertices, shared, plane)
  }
  return polygon
}

// calculate whether three points form a convex corner
//  prevpoint, point, nextpoint: the 3 coordinates (Vector3D instances)
//  normal: the normal vector of the plane
Polygon.isConvexPoint = function (prevpoint, point, nextpoint, normal) {
  let crossproduct = point.minus(prevpoint).cross(nextpoint.minus(point))
  let crossdotnormal = crossproduct.dot(normal)
  return (crossdotnormal >= 0)
}

Polygon.isStrictlyConvexPoint = function (prevpoint, point, nextpoint, normal) {
  let crossproduct = point.minus(prevpoint).cross(nextpoint.minus(point))
  let crossdotnormal = crossproduct.dot(normal)
  return (crossdotnormal >= EPS)
}

/** Class Polygon.Shared
 * Holds the shared properties for each polygon (Currently only color).
 * @constructor
 * @param {Array[]} color - array containing RGBA values, or null
 *
 * @example
 *   let shared = new CSG.Polygon.Shared([0, 0, 0, 1])
 */
Polygon.Shared = function (color) {
  if (color !== null) {
    if (color.length !== 4) {
      throw new Error('Expecting 4 element array')
    }
  }
  this.color = color
}

Polygon.Shared.fromObject = function (obj) {
  return new Polygon.Shared(obj.color)
}

/** Create Polygon.Shared from color values.
 * @param {number} r - value of RED component
 * @param {number} g - value of GREEN component
 * @param {number} b - value of BLUE component
 * @param {number} [a] - value of ALPHA component
 * @param {Array[]} [color] - OR array containing RGB values (optional Alpha)
 *
 * @example
 * let s1 = Polygon.Shared.fromColor(0,0,0)
 * let s2 = Polygon.Shared.fromColor([0,0,0,1])
 */
Polygon.Shared.fromColor = function (args) {
  let color
  if (arguments.length === 1) {
    color = arguments[0].slice() // make deep copy
  } else {
    color = []
    for (let i = 0; i < arguments.length; i++) {
      color.push(arguments[i])
    }
  }
  if (color.length === 3) {
    color.push(1)
  } else if (color.length !== 4) {
    throw new Error('setColor expects either an array with 3 or 4 elements, or 3 or 4 parameters.')
  }
  return new Polygon.Shared(color)
}

Polygon.Shared.prototype = {
  getTag: function () {
    let result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  },
    // get a string uniquely identifying this object
  getHash: function () {
    if (!this.color) return 'null'
    return this.color.join('/')
  }
}

Polygon.defaultShared = new Polygon.Shared(null)

module.exports = Polygon


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Vector3D = __webpack_require__(1)
const {getTag} = __webpack_require__(0)

// # class Vertex
// Represents a vertex of a polygon. Use your own vertex class instead of this
// one to provide additional features like texture coordinates and vertex
// colors. Custom vertex classes need to provide a `pos` property
// `flipped()`, and `interpolate()` methods that behave analogous to the ones
// FIXME: And a lot MORE (see plane.fromVector3Ds for ex) ! This is fragile code
// defined by `Vertex`.
const Vertex = function (pos) {
  this.pos = pos
}

// create from an untyped object with identical property names:
Vertex.fromObject = function (obj) {
  var pos = new Vector3D(obj.pos)
  return new Vertex(pos)
}

Vertex.prototype = {
    // Return a vertex with all orientation-specific data (e.g. vertex normal) flipped. Called when the
    // orientation of a polygon is flipped.
  flipped: function () {
    return this
  },

  getTag: function () {
    var result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  },

    // Create a new vertex between this vertex and `other` by linearly
    // interpolating all properties using a parameter of `t`. Subclasses should
    // override this to interpolate additional properties.
  interpolate: function (other, t) {
    var newpos = this.pos.lerp(other.pos, t)
    return new Vertex(newpos)
  },

    // Affine transformation of vertex. Returns a new Vertex
  transform: function (matrix4x4) {
    var newpos = this.pos.multiply4x4(matrix4x4)
    return new Vertex(newpos)
  },

  toString: function () {
    return this.pos.toString()
  }
}

module.exports = Vertex


/***/ }),
/* 9 */
/***/ (function(module, exports) {

function fnNumberSort (a, b) {
  return a - b
}

function fnSortByIndex (a, b) {
  return a.index - b.index
}

const IsFloat = function (n) {
  return (!isNaN(n)) || (n === Infinity) || (n === -Infinity)
}

const solve2Linear = function (a, b, c, d, u, v) {
  let det = a * d - b * c
  let invdet = 1.0 / det
  let x = u * d - b * v
  let y = -u * c + a * v
  x *= invdet
  y *= invdet
  return [x, y]
}

function insertSorted (array, element, comparefunc) {
  let leftbound = 0
  let rightbound = array.length
  while (rightbound > leftbound) {
    let testindex = Math.floor((leftbound + rightbound) / 2)
    let testelement = array[testindex]
    let compareresult = comparefunc(element, testelement)
    if (compareresult > 0) // element > testelement
    {
      leftbound = testindex + 1
    } else {
      rightbound = testindex
    }
  }
  array.splice(leftbound, 0, element)
}

// Get the x coordinate of a point with a certain y coordinate, interpolated between two
// points (CSG.Vector2D).
// Interpolation is robust even if the points have the same y coordinate
const interpolateBetween2DPointsForY = function (point1, point2, y) {
  let f1 = y - point1.y
  let f2 = point2.y - point1.y
  if (f2 < 0) {
    f1 = -f1
    f2 = -f2
  }
  let t
  if (f1 <= 0) {
    t = 0.0
  } else if (f1 >= f2) {
    t = 1.0
  } else if (f2 < 1e-10) { // FIXME Should this be CSG.EPS?
    t = 0.5
  } else {
    t = f1 / f2
  }
  let result = point1.x + t * (point2.x - point1.x)
  return result
}

module.exports = {
  fnNumberSort,
  fnSortByIndex,
  IsFloat,
  solve2Linear,
  insertSorted,
  interpolateBetween2DPointsForY
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const {EPS, angleEPS, areaEPS, defaultResolution3D} = __webpack_require__(0)
const {Connector} = __webpack_require__(15)
const OrthoNormalBasis = __webpack_require__(13)
const Vertex2D = __webpack_require__(16)
const Vertex3D = __webpack_require__(8)
const Vector2D = __webpack_require__(3)
const Vector3D = __webpack_require__(1)
const Polygon = __webpack_require__(7)
const Path2D = __webpack_require__(19)
const Side = __webpack_require__(17)
const {linesIntersect} = __webpack_require__(38)
const {parseOptionAs3DVector, parseOptionAsBool, parseOptionAsFloat, parseOptionAsInt} = __webpack_require__(20)
const FuzzyCAGFactory = __webpack_require__(39)
/**
 * Class CAG
 * Holds a solid area geometry like CSG but 2D.
 * Each area consists of a number of sides.
 * Each side is a line between 2 points.
 * @constructor
 */
let CAG = function () {
  this.sides = []
  this.isCanonicalized = false
}

/** Construct a CAG from a list of `Side` instances.
 * @param {Side[]} sides - list of sides
 * @returns {CAG} new CAG object
 */
CAG.fromSides = function (sides) {
  let cag = new CAG()
  cag.sides = sides
  return cag
}


// Converts a CSG to a  The CSG must consist of polygons with only z coordinates +1 and -1
// as constructed by _toCSGWall(-1, 1). This is so we can use the 3D union(), intersect() etc
CAG.fromFakeCSG = function (csg) {
  let sides = csg.polygons.map(function (p) {
    return Side._fromFakePolygon(p)
  })
        .filter(function (s) {
          return s !== null
        })
  return CAG.fromSides(sides)
}

/** Construct a CAG from a list of points (a polygon).
 * The rotation direction of the points is not relevant.
 * The points can define a convex or a concave polygon.
 * The polygon must not self intersect.
 * @param {points[]} points - list of points in 2D space
 * @returns {CAG} new CAG object
 */
CAG.fromPoints = function (points) {
  let numpoints = points.length
  if (numpoints < 3) throw new Error('CAG shape needs at least 3 points')
  let sides = []
  let prevpoint = new Vector2D(points[numpoints - 1])
  let prevvertex = new Vertex2D(prevpoint)
  points.map(function (p) {
    let point = new Vector2D(p)
    let vertex = new Vertex2D(point)
    let side = new Side(prevvertex, vertex)
    sides.push(side)
    prevvertex = vertex
  })
  let result = CAG.fromSides(sides)
  if (result.isSelfIntersecting()) {
    throw new Error('Polygon is self intersecting!')
  }
  let area = result.area()
  if (Math.abs(area) < areaEPS) {
    throw new Error('Degenerate polygon!')
  }
  if (area < 0) {
    result = result.flipped()
  }
  result = result.canonicalized()
  return result
}

const CAGFromCAGFuzzyFactory = function (factory, sourcecag) {
  let _this = factory
  let newsides = sourcecag.sides.map(function (side) {
    return _this.getSide(side)
  })
      // remove bad sides (mostly a user input issue)
      .filter(function (side) {
        return side.length() > EPS
      })
  return CAG.fromSides(newsides)
}

CAG.prototype = {
  toString: function () {
    let result = 'CAG (' + this.sides.length + ' sides):\n'
    this.sides.map(function (side) {
      result += '  ' + side.toString() + '\n'
    })
    return result
  },

  _toCSGWall: function (z0, z1) {
    const CSG = __webpack_require__(5) // FIXME: circular dependencies CAG=>CSG=>CAG
    let polygons = this.sides.map(function (side) {
      return side.toPolygon3D(z0, z1)
    })
    return CSG.fromPolygons(polygons)
  },

  _toVector3DPairs: function (m) {
        // transform m
    let pairs = this.sides.map(function (side) {
      let p0 = side.vertex0.pos
      let p1 = side.vertex1.pos
      return [Vector3D.Create(p0.x, p0.y, 0),
        Vector3D.Create(p1.x, p1.y, 0)]
    })
    if (typeof m !== 'undefined') {
      pairs = pairs.map(function (pair) {
        return pair.map(function (v) {
          return v.transform(m)
        })
      })
    }
    return pairs
  },

    /*
     * transform a cag into the polygons of a corresponding 3d plane, positioned per options
     * Accepts a connector for plane positioning, or optionally
     * single translation, axisVector, normalVector arguments
     * (toConnector has precedence over single arguments if provided)
     */
  _toPlanePolygons: function (options) {
    const CSG = __webpack_require__(5) // FIXME: circular dependencies CAG=>CSG=>CAG
    let flipped = options.flipped || false
    // reference connector for transformation
    let origin = [0, 0, 0]
    let defaultAxis = [0, 0, 1]
    let defaultNormal = [0, 1, 0]
    let thisConnector = new Connector(origin, defaultAxis, defaultNormal)
    // translated connector per options
    let translation = options.translation || origin
    let axisVector = options.axisVector || defaultAxis
    let normalVector = options.normalVector || defaultNormal
    // will override above if options has toConnector
    let toConnector = options.toConnector ||
            new Connector(translation, axisVector, normalVector)
    // resulting transform
    let m = thisConnector.getTransformationTo(toConnector, false, 0)
    // create plane as a (partial non-closed) CSG in XY plane
    let bounds = this.getBounds()
    bounds[0] = bounds[0].minus(new Vector2D(1, 1))
    bounds[1] = bounds[1].plus(new Vector2D(1, 1))
    let csgshell = this._toCSGWall(-1, 1)
    let csgplane = CSG.fromPolygons([new Polygon([
      new Vertex3D(new Vector3D(bounds[0].x, bounds[0].y, 0)),
      new Vertex3D(new Vector3D(bounds[1].x, bounds[0].y, 0)),
      new Vertex3D(new Vector3D(bounds[1].x, bounds[1].y, 0)),
      new Vertex3D(new Vector3D(bounds[0].x, bounds[1].y, 0))
    ])])
    if (flipped) {
      csgplane = csgplane.invert()
    }
    // intersectSub -> prevent premature retesselate/canonicalize
    csgplane = csgplane.intersectSub(csgshell)
    // only keep the polygons in the z plane:
    let polys = csgplane.polygons.filter(function (polygon) {
      return Math.abs(polygon.plane.normal.z) > 0.99
    })
    // finally, position the plane per passed transformations
    return polys.map(function (poly) {
      return poly.transform(m)
    })
  },

    /*
     * given 2 connectors, this returns all polygons of a "wall" between 2
     * copies of this cag, positioned in 3d space as "bottom" and
     * "top" plane per connectors toConnector1, and toConnector2, respectively
     */
  _toWallPolygons: function (options) {
        // normals are going to be correct as long as toConn2.point - toConn1.point
        // points into cag normal direction (check in caller)
        // arguments: options.toConnector1, options.toConnector2, options.cag
        //     walls go from toConnector1 to toConnector2
        //     optionally, target cag to point to - cag needs to have same number of sides as this!
    let origin = [0, 0, 0]
    let defaultAxis = [0, 0, 1]
    let defaultNormal = [0, 1, 0]
    let thisConnector = new Connector(origin, defaultAxis, defaultNormal)
        // arguments:
    let toConnector1 = options.toConnector1
        // let toConnector2 = new Connector([0, 0, -30], defaultAxis, defaultNormal);
    let toConnector2 = options.toConnector2
    if (!(toConnector1 instanceof Connector && toConnector2 instanceof Connector)) {
      throw new Error('could not parse Connector arguments toConnector1 or toConnector2')
    }
    if (options.cag) {
      if (options.cag.sides.length !== this.sides.length) {
        throw new Error('target cag needs same sides count as start cag')
      }
    }
        // target cag is same as this unless specified
    let toCag = options.cag || this
    let m1 = thisConnector.getTransformationTo(toConnector1, false, 0)
    let m2 = thisConnector.getTransformationTo(toConnector2, false, 0)
    let vps1 = this._toVector3DPairs(m1)
    let vps2 = toCag._toVector3DPairs(m2)

    let polygons = []
    vps1.forEach(function (vp1, i) {
      polygons.push(new Polygon([
        new Vertex3D(vps2[i][1]), new Vertex3D(vps2[i][0]), new Vertex3D(vp1[0])]))
      polygons.push(new Polygon([
        new Vertex3D(vps2[i][1]), new Vertex3D(vp1[0]), new Vertex3D(vp1[1])]))
    })
    return polygons
  },

    /**
     * Convert to a list of points.
     * @return {points[]} list of points in 2D space
     */
  toPoints: function () {
    let points = this.sides.map(function (side) {
      let v0 = side.vertex0
      // let v1 = side.vertex1
      return v0.pos
    })
    // due to the logic of CAG.fromPoints()
    // move the first point to the last
    if (points.length > 0) {
      points.push(points.shift())
    }
    return points
  },

  union: function (cag) {
    let cags
    if (cag instanceof Array) {
      cags = cag
    } else {
      cags = [cag]
    }
    let r = this._toCSGWall(-1, 1)
    r = r.union(
            cags.map(function (cag) {
              return cag._toCSGWall(-1, 1).reTesselated()
            }), false, false)
    return CAG.fromFakeCSG(r).canonicalized()
  },

  subtract: function (cag) {
    let cags
    if (cag instanceof Array) {
      cags = cag
    } else {
      cags = [cag]
    }
    let r = this._toCSGWall(-1, 1)
    cags.map(function (cag) {
      r = r.subtractSub(cag._toCSGWall(-1, 1), false, false)
    })
    r = r.reTesselated()
    r = r.canonicalized()
    r = CAG.fromFakeCSG(r)
    r = r.canonicalized()
    return r
  },

  intersect: function (cag) {
    let cags
    if (cag instanceof Array) {
      cags = cag
    } else {
      cags = [cag]
    }
    let r = this._toCSGWall(-1, 1)
    cags.map(function (cag) {
      r = r.intersectSub(cag._toCSGWall(-1, 1), false, false)
    })
    r = r.reTesselated()
    r = r.canonicalized()
    r = CAG.fromFakeCSG(r)
    r = r.canonicalized()
    return r
  },

  transform: function (matrix4x4) {
    let ismirror = matrix4x4.isMirroring()
    let newsides = this.sides.map(function (side) {
      return side.transform(matrix4x4)
    })
    let result = CAG.fromSides(newsides)
    if (ismirror) {
      result = result.flipped()
    }
    return result
  },

    // see http://local.wasp.uwa.edu.au/~pbourke/geometry/polyarea/ :
    // Area of the polygon. For a counter clockwise rotating polygon the area is positive, otherwise negative
    // Note(bebbi): this looks wrong. See polygon getArea()
  area: function () {
    let polygonArea = 0
    this.sides.map(function (side) {
      polygonArea += side.vertex0.pos.cross(side.vertex1.pos)
    })
    polygonArea *= 0.5
    return polygonArea
  },

  flipped: function () {
    let newsides = this.sides.map(function (side) {
      return side.flipped()
    })
    newsides.reverse()
    return CAG.fromSides(newsides)
  },

  getBounds: function () {
    let minpoint
    if (this.sides.length === 0) {
      minpoint = new Vector2D(0, 0)
    } else {
      minpoint = this.sides[0].vertex0.pos
    }
    let maxpoint = minpoint
    this.sides.map(function (side) {
      minpoint = minpoint.min(side.vertex0.pos)
      minpoint = minpoint.min(side.vertex1.pos)
      maxpoint = maxpoint.max(side.vertex0.pos)
      maxpoint = maxpoint.max(side.vertex1.pos)
    })
    return [minpoint, maxpoint]
  },

  isSelfIntersecting: function (debug) {
    let numsides = this.sides.length
    for (let i = 0; i < numsides; i++) {
      let side0 = this.sides[i]
      for (let ii = i + 1; ii < numsides; ii++) {
        let side1 = this.sides[ii]
        if (linesIntersect(side0.vertex0.pos, side0.vertex1.pos, side1.vertex0.pos, side1.vertex1.pos)) {
          if (debug) { console.log('side ' + i + ': ' + side0); console.log('side ' + ii + ': ' + side1) }
          return true
        }
      }
    }
    return false
  },

  expandedShell: function (radius, resolution) {
    resolution = resolution || 8
    if (resolution < 4) resolution = 4
    let cags = []
    let pointmap = {}
    let cag = this.canonicalized()
    cag.sides.map(function (side) {
      let d = side.vertex1.pos.minus(side.vertex0.pos)
      let dl = d.length()
      if (dl > EPS) {
        d = d.times(1.0 / dl)
        let normal = d.normal().times(radius)
        let shellpoints = [
          side.vertex1.pos.plus(normal),
          side.vertex1.pos.minus(normal),
          side.vertex0.pos.minus(normal),
          side.vertex0.pos.plus(normal)
        ]
                //      let newcag = CAG.fromPointsNoCheck(shellpoints);
        let newcag = CAG.fromPoints(shellpoints)
        cags.push(newcag)
        for (let step = 0; step < 2; step++) {
          let p1 = (step === 0) ? side.vertex0.pos : side.vertex1.pos
          let p2 = (step === 0) ? side.vertex1.pos : side.vertex0.pos
          let tag = p1.x + ' ' + p1.y
          if (!(tag in pointmap)) {
            pointmap[tag] = []
          }
          pointmap[tag].push({
            'p1': p1,
            'p2': p2
          })
        }
      }
    })
    for (let tag in pointmap) {
      let m = pointmap[tag]
      let angle1, angle2
      let pcenter = m[0].p1
      if (m.length === 2) {
        let end1 = m[0].p2
        let end2 = m[1].p2
        angle1 = end1.minus(pcenter).angleDegrees()
        angle2 = end2.minus(pcenter).angleDegrees()
        if (angle2 < angle1) angle2 += 360
        if (angle2 >= (angle1 + 360)) angle2 -= 360
        if (angle2 < angle1 + 180) {
          let t = angle2
          angle2 = angle1 + 360
          angle1 = t
        }
        angle1 += 90
        angle2 -= 90
      } else {
        angle1 = 0
        angle2 = 360
      }
      let fullcircle = (angle2 > angle1 + 359.999)
      if (fullcircle) {
        angle1 = 0
        angle2 = 360
      }
      if (angle2 > (angle1 + angleEPS)) {
        let points = []
        if (!fullcircle) {
          points.push(pcenter)
        }
        let numsteps = Math.round(resolution * (angle2 - angle1) / 360)
        if (numsteps < 1) numsteps = 1
        for (let step = 0; step <= numsteps; step++) {
          let angle = angle1 + step / numsteps * (angle2 - angle1)
          if (step === numsteps) angle = angle2 // prevent rounding errors
          let point = pcenter.plus(Vector2D.fromAngleDegrees(angle).times(radius))
          if ((!fullcircle) || (step > 0)) {
            points.push(point)
          }
        }
        let newcag = CAG.fromPointsNoCheck(points)
        cags.push(newcag)
      }
    }
    let result = new CAG()
    result = result.union(cags)
    return result
  },

  expand: function (radius, resolution) {
    let result = this.union(this.expandedShell(radius, resolution))
    return result
  },

  contract: function (radius, resolution) {
    let result = this.subtract(this.expandedShell(radius, resolution))
    return result
  },

    // extrude the CAG in a certain plane.
    // Giving just a plane is not enough, multiple different extrusions in the same plane would be possible
    // by rotating around the plane's origin. An additional right-hand vector should be specified as well,
    // and this is exactly a OrthoNormalBasis.
    //
    // orthonormalbasis: characterizes the plane in which to extrude
    // depth: thickness of the extruded shape. Extrusion is done upwards from the plane
    //        (unless symmetrical option is set, see below)
    // options:
    //   {symmetrical: true}  // extrude symmetrically in two directions about the plane
  extrudeInOrthonormalBasis: function (orthonormalbasis, depth, options) {
        // first extrude in the regular Z plane:
    if (!(orthonormalbasis instanceof OrthoNormalBasis)) {
      throw new Error('extrudeInPlane: the first parameter should be a OrthoNormalBasis')
    }
    let extruded = this.extrude({
      offset: [0, 0, depth]
    })
    if (parseOptionAsBool(options, 'symmetrical', false)) {
      extruded = extruded.translate([0, 0, -depth / 2])
    }
    let matrix = orthonormalbasis.getInverseProjectionMatrix()
    extruded = extruded.transform(matrix)
    return extruded
  },

    // Extrude in a standard cartesian plane, specified by two axis identifiers. Each identifier can be
    // one of ["X","Y","Z","-X","-Y","-Z"]
    // The 2d x axis will map to the first given 3D axis, the 2d y axis will map to the second.
    // See OrthoNormalBasis.GetCartesian for details.
    // options:
    //   {symmetrical: true}  // extrude symmetrically in two directions about the plane
  extrudeInPlane: function (axis1, axis2, depth, options) {
    return this.extrudeInOrthonormalBasis(OrthoNormalBasis.GetCartesian(axis1, axis2), depth, options)
  },

    // extruded=cag.extrude({offset: [0,0,10], twistangle: 360, twiststeps: 100});
    // linear extrusion of 2D shape, with optional twist
    // The 2d shape is placed in in z=0 plane and extruded into direction <offset> (a Vector3D)
    // The final face is rotated <twistangle> degrees. Rotation is done around the origin of the 2d shape (i.e. x=0, y=0)
    // twiststeps determines the resolution of the twist (should be >= 1)
    // returns a CSG object
  extrude: function (options) {
    const CSG = __webpack_require__(5) // FIXME: circular dependencies CAG=>CSG=>CAG
    if (this.sides.length === 0) {
            // empty!
      return new CSG()
    }
    let offsetVector = parseOptionAs3DVector(options, 'offset', [0, 0, 1])
    let twistangle = parseOptionAsFloat(options, 'twistangle', 0)
    let twiststeps = parseOptionAsInt(options, 'twiststeps', defaultResolution3D)
    if (offsetVector.z === 0) {
      throw new Error('offset cannot be orthogonal to Z axis')
    }
    if (twistangle === 0 || twiststeps < 1) {
      twiststeps = 1
    }
    let normalVector = Vector3D.Create(0, 1, 0)

    let polygons = []
        // bottom and top
    polygons = polygons.concat(this._toPlanePolygons({
      translation: [0, 0, 0],
      normalVector: normalVector,
      flipped: !(offsetVector.z < 0)}
    ))
    polygons = polygons.concat(this._toPlanePolygons({
      translation: offsetVector,
      normalVector: normalVector.rotateZ(twistangle),
      flipped: offsetVector.z < 0}))
        // walls
    for (let i = 0; i < twiststeps; i++) {
      let c1 = new Connector(offsetVector.times(i / twiststeps), [0, 0, offsetVector.z],
                normalVector.rotateZ(i * twistangle / twiststeps))
      let c2 = new Connector(offsetVector.times((i + 1) / twiststeps), [0, 0, offsetVector.z],
                normalVector.rotateZ((i + 1) * twistangle / twiststeps))
      polygons = polygons.concat(this._toWallPolygons({toConnector1: c1, toConnector2: c2}))
    }

    return CSG.fromPolygons(polygons)
  },

    /** Extrude to into a 3D solid by rotating the origin around the Y axis.
     * (and turning everything into XY plane)
     * @param {Object} options - options for construction
     * @param {Number} [options.angle=360] - angle of rotation
     * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
     * @returns {CSG} new 3D solid
     */
  rotateExtrude: function (options) { // FIXME options should be optional
    const CSG = __webpack_require__(5) // FIXME: circular dependencies CAG=>CSG=>CAG
    let alpha = parseOptionAsFloat(options, 'angle', 360)
    let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)

    alpha = alpha > 360 ? alpha % 360 : alpha
    let origin = [0, 0, 0]
    let axisV = Vector3D.Create(0, 1, 0)
    let normalV = [0, 0, 1]
    let polygons = []
        // planes only needed if alpha > 0
    let connS = new Connector(origin, axisV, normalV)
    if (alpha > 0 && alpha < 360) {
            // we need to rotate negative to satisfy wall function condition of
            // building in the direction of axis vector
      let connE = new Connector(origin, axisV.rotateZ(-alpha), normalV)
      polygons = polygons.concat(
                this._toPlanePolygons({toConnector: connS, flipped: true}))
      polygons = polygons.concat(
                this._toPlanePolygons({toConnector: connE}))
    }
    let connT1 = connS
    let connT2
    let step = alpha / resolution
    for (let a = step; a <= alpha + EPS; a += step) { // FIXME Should this be angelEPS?
      connT2 = new Connector(origin, axisV.rotateZ(-a), normalV)
      polygons = polygons.concat(this._toWallPolygons(
                {toConnector1: connT1, toConnector2: connT2}))
      connT1 = connT2
    }
    return CSG.fromPolygons(polygons).reTesselated()
  },

    // check if we are a valid CAG (for debugging)
    // NOTE(bebbi) uneven side count doesn't work because rounding with EPS isn't taken into account
  check: function () {
    let errors = []
    if (this.isSelfIntersecting(true)) {
      errors.push('Self intersects')
    }
    let pointcount = {}
    this.sides.map(function (side) {
      function mappoint (p) {
        let tag = p.x + ' ' + p.y
        if (!(tag in pointcount)) pointcount[tag] = 0
        pointcount[tag] ++
      }
      mappoint(side.vertex0.pos)
      mappoint(side.vertex1.pos)
    })
    for (let tag in pointcount) {
      let count = pointcount[tag]
      if (count & 1) {
        errors.push('Uneven number of sides (' + count + ') for point ' + tag)
      }
    }
    let area = this.area()
    if (area < areaEPS) {
      errors.push('Area is ' + area)
    }
    if (errors.length > 0) {
      let ertxt = ''
      errors.map(function (err) {
        ertxt += err + '\n'
      })
      throw new Error(ertxt)
    }
  },

  canonicalized: function () {
    if (this.isCanonicalized) {
      return this
    } else {
      let factory = new FuzzyCAGFactory()
      let result = CAGFromCAGFuzzyFactory(factory, this)
      result.isCanonicalized = true
      return result
    }
  },

  /** Convert to compact binary form.
   * See CAG.fromCompactBinary.
   * @return {CompactBinary}
   */
  toCompactBinary: function () {
    let cag = this.canonicalized()
    let numsides = cag.sides.length
    let vertexmap = {}
    let vertices = []
    let numvertices = 0
    let sideVertexIndices = new Uint32Array(2 * numsides)
    let sidevertexindicesindex = 0
    cag.sides.map(function (side) {
      [side.vertex0, side.vertex1].map(function (v) {
        let vertextag = v.getTag()
        let vertexindex
        if (!(vertextag in vertexmap)) {
          vertexindex = numvertices++
          vertexmap[vertextag] = vertexindex
          vertices.push(v)
        } else {
          vertexindex = vertexmap[vertextag]
        }
        sideVertexIndices[sidevertexindicesindex++] = vertexindex
      })
    })
    let vertexData = new Float64Array(numvertices * 2)
    let verticesArrayIndex = 0
    vertices.map(function (v) {
      let pos = v.pos
      vertexData[verticesArrayIndex++] = pos._x
      vertexData[verticesArrayIndex++] = pos._y
    })
    let result = {
      'class': 'CAG',
      sideVertexIndices: sideVertexIndices,
      vertexData: vertexData
    }
    return result
  },

  getOutlinePaths: function () {
    let cag = this.canonicalized()
    let sideTagToSideMap = {}
    let startVertexTagToSideTagMap = {}
    cag.sides.map(function (side) {
      let sidetag = side.getTag()
      sideTagToSideMap[sidetag] = side
      let startvertextag = side.vertex0.getTag()
      if (!(startvertextag in startVertexTagToSideTagMap)) {
        startVertexTagToSideTagMap[startvertextag] = []
      }
      startVertexTagToSideTagMap[startvertextag].push(sidetag)
    })
    let paths = []
    while (true) {
      let startsidetag = null
      for (let aVertexTag in startVertexTagToSideTagMap) {
        let sidesForThisVertex = startVertexTagToSideTagMap[aVertexTag]
        startsidetag = sidesForThisVertex[0]
        sidesForThisVertex.splice(0, 1)
        if (sidesForThisVertex.length === 0) {
          delete startVertexTagToSideTagMap[aVertexTag]
        }
        break
      }
      if (startsidetag === null) break // we've had all sides
      let connectedVertexPoints = []
      let sidetag = startsidetag
      let thisside = sideTagToSideMap[sidetag]
      let startvertextag = thisside.vertex0.getTag()
      while (true) {
        connectedVertexPoints.push(thisside.vertex0.pos)
        let nextvertextag = thisside.vertex1.getTag()
        if (nextvertextag === startvertextag) break // we've closed the polygon
        if (!(nextvertextag in startVertexTagToSideTagMap)) {
          throw new Error('Area is not closed!')
        }
        let nextpossiblesidetags = startVertexTagToSideTagMap[nextvertextag]
        let nextsideindex = -1
        if (nextpossiblesidetags.length === 1) {
          nextsideindex = 0
        } else {
                    // more than one side starting at the same vertex. This means we have
                    // two shapes touching at the same corner
          let bestangle = null
          let thisangle = thisside.direction().angleDegrees()
          for (let sideindex = 0; sideindex < nextpossiblesidetags.length; sideindex++) {
            let nextpossiblesidetag = nextpossiblesidetags[sideindex]
            let possibleside = sideTagToSideMap[nextpossiblesidetag]
            let angle = possibleside.direction().angleDegrees()
            let angledif = angle - thisangle
            if (angledif < -180) angledif += 360
            if (angledif >= 180) angledif -= 360
            if ((nextsideindex < 0) || (angledif > bestangle)) {
              nextsideindex = sideindex
              bestangle = angledif
            }
          }
        }
        let nextsidetag = nextpossiblesidetags[nextsideindex]
        nextpossiblesidetags.splice(nextsideindex, 1)
        if (nextpossiblesidetags.length === 0) {
          delete startVertexTagToSideTagMap[nextvertextag]
        }
        thisside = sideTagToSideMap[nextsidetag]
      } // inner loop
            // due to the logic of CAG.fromPoints()
            // move the first point to the last
      if (connectedVertexPoints.length > 0) {
        connectedVertexPoints.push(connectedVertexPoints.shift())
      }
      let path = new Path2D(connectedVertexPoints, true)
      paths.push(path)
    } // outer loop
    return paths
  },

    /*
    cag = cag.overCutInsideCorners(cutterradius);

    Using a CNC router it's impossible to cut out a true sharp inside corner. The inside corner
    will be rounded due to the radius of the cutter. This function compensates for this by creating
    an extra cutout at each inner corner so that the actual cut out shape will be at least as large
    as needed.
    */
  overCutInsideCorners: function (cutterradius) {
    let cag = this.canonicalized()
        // for each vertex determine the 'incoming' side and 'outgoing' side:
    let pointmap = {} // tag => {pos: coord, from: [], to: []}
    cag.sides.map(function (side) {
      if (!(side.vertex0.getTag() in pointmap)) {
        pointmap[side.vertex0.getTag()] = {
          pos: side.vertex0.pos,
          from: [],
          to: []
        }
      }
      pointmap[side.vertex0.getTag()].to.push(side.vertex1.pos)
      if (!(side.vertex1.getTag() in pointmap)) {
        pointmap[side.vertex1.getTag()] = {
          pos: side.vertex1.pos,
          from: [],
          to: []
        }
      }
      pointmap[side.vertex1.getTag()].from.push(side.vertex0.pos)
    })
        // overcut all sharp corners:
    let cutouts = []
    for (let pointtag in pointmap) {
      let pointobj = pointmap[pointtag]
      if ((pointobj.from.length === 1) && (pointobj.to.length === 1)) {
                // ok, 1 incoming side and 1 outgoing side:
        let fromcoord = pointobj.from[0]
        let pointcoord = pointobj.pos
        let tocoord = pointobj.to[0]
        let v1 = pointcoord.minus(fromcoord).unit()
        let v2 = tocoord.minus(pointcoord).unit()
        let crossproduct = v1.cross(v2)
        let isInnerCorner = (crossproduct < 0.001)
        if (isInnerCorner) {
                    // yes it's a sharp corner:
          let alpha = v2.angleRadians() - v1.angleRadians() + Math.PI
          if (alpha < 0) {
            alpha += 2 * Math.PI
          } else if (alpha >= 2 * Math.PI) {
            alpha -= 2 * Math.PI
          }
          let midvector = v2.minus(v1).unit()
          let circlesegmentangle = 30 / 180 * Math.PI // resolution of the circle: segments of 30 degrees
                    // we need to increase the radius slightly so that our imperfect circle will contain a perfect circle of cutterradius
          let radiuscorrected = cutterradius / Math.cos(circlesegmentangle / 2)
          let circlecenter = pointcoord.plus(midvector.times(radiuscorrected))
                    // we don't need to create a full circle; a pie is enough. Find the angles for the pie:
          let startangle = alpha + midvector.angleRadians()
          let deltaangle = 2 * (Math.PI - alpha)
          let numsteps = 2 * Math.ceil(deltaangle / circlesegmentangle / 2) // should be even
                    // build the pie:
          let points = [circlecenter]
          for (let i = 0; i <= numsteps; i++) {
            let angle = startangle + i / numsteps * deltaangle
            let p = Vector2D.fromAngleRadians(angle).times(radiuscorrected).plus(circlecenter)
            points.push(p)
          }
          cutouts.push(CAG.fromPoints(points))
        }
      }
    }
    let result = cag.subtract(cutouts)
    return result
  }
}

module.exports = CAG


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const Vector3D = __webpack_require__(1)
const Vector2D = __webpack_require__(3)
const OrthoNormalBasis = __webpack_require__(13)
const Plane = __webpack_require__(6)

// # class Matrix4x4:
// Represents a 4x4 matrix. Elements are specified in row order
const Matrix4x4 = function (elements) {
  if (arguments.length >= 1) {
    this.elements = elements
  } else {
        // if no arguments passed: create unity matrix
    this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  }
}

Matrix4x4.prototype = {
  plus: function (m) {
    var r = []
    for (var i = 0; i < 16; i++) {
      r[i] = this.elements[i] + m.elements[i]
    }
    return new Matrix4x4(r)
  },

  minus: function (m) {
    var r = []
    for (var i = 0; i < 16; i++) {
      r[i] = this.elements[i] - m.elements[i]
    }
    return new Matrix4x4(r)
  },

    // right multiply by another 4x4 matrix:
  multiply: function (m) {
        // cache elements in local variables, for speedup:
    var this0 = this.elements[0]
    var this1 = this.elements[1]
    var this2 = this.elements[2]
    var this3 = this.elements[3]
    var this4 = this.elements[4]
    var this5 = this.elements[5]
    var this6 = this.elements[6]
    var this7 = this.elements[7]
    var this8 = this.elements[8]
    var this9 = this.elements[9]
    var this10 = this.elements[10]
    var this11 = this.elements[11]
    var this12 = this.elements[12]
    var this13 = this.elements[13]
    var this14 = this.elements[14]
    var this15 = this.elements[15]
    var m0 = m.elements[0]
    var m1 = m.elements[1]
    var m2 = m.elements[2]
    var m3 = m.elements[3]
    var m4 = m.elements[4]
    var m5 = m.elements[5]
    var m6 = m.elements[6]
    var m7 = m.elements[7]
    var m8 = m.elements[8]
    var m9 = m.elements[9]
    var m10 = m.elements[10]
    var m11 = m.elements[11]
    var m12 = m.elements[12]
    var m13 = m.elements[13]
    var m14 = m.elements[14]
    var m15 = m.elements[15]

    var result = []
    result[0] = this0 * m0 + this1 * m4 + this2 * m8 + this3 * m12
    result[1] = this0 * m1 + this1 * m5 + this2 * m9 + this3 * m13
    result[2] = this0 * m2 + this1 * m6 + this2 * m10 + this3 * m14
    result[3] = this0 * m3 + this1 * m7 + this2 * m11 + this3 * m15
    result[4] = this4 * m0 + this5 * m4 + this6 * m8 + this7 * m12
    result[5] = this4 * m1 + this5 * m5 + this6 * m9 + this7 * m13
    result[6] = this4 * m2 + this5 * m6 + this6 * m10 + this7 * m14
    result[7] = this4 * m3 + this5 * m7 + this6 * m11 + this7 * m15
    result[8] = this8 * m0 + this9 * m4 + this10 * m8 + this11 * m12
    result[9] = this8 * m1 + this9 * m5 + this10 * m9 + this11 * m13
    result[10] = this8 * m2 + this9 * m6 + this10 * m10 + this11 * m14
    result[11] = this8 * m3 + this9 * m7 + this10 * m11 + this11 * m15
    result[12] = this12 * m0 + this13 * m4 + this14 * m8 + this15 * m12
    result[13] = this12 * m1 + this13 * m5 + this14 * m9 + this15 * m13
    result[14] = this12 * m2 + this13 * m6 + this14 * m10 + this15 * m14
    result[15] = this12 * m3 + this13 * m7 + this14 * m11 + this15 * m15
    return new Matrix4x4(result)
  },

  clone: function () {
    var elements = this.elements.map(function (p) {
      return p
    })
    return new Matrix4x4(elements)
  },

    // Right multiply the matrix by a Vector3D (interpreted as 3 row, 1 column)
    // (result = M*v)
    // Fourth element is taken as 1
  rightMultiply1x3Vector: function (v) {
    var v0 = v._x
    var v1 = v._y
    var v2 = v._z
    var v3 = 1
    var x = v0 * this.elements[0] + v1 * this.elements[1] + v2 * this.elements[2] + v3 * this.elements[3]
    var y = v0 * this.elements[4] + v1 * this.elements[5] + v2 * this.elements[6] + v3 * this.elements[7]
    var z = v0 * this.elements[8] + v1 * this.elements[9] + v2 * this.elements[10] + v3 * this.elements[11]
    var w = v0 * this.elements[12] + v1 * this.elements[13] + v2 * this.elements[14] + v3 * this.elements[15]
        // scale such that fourth element becomes 1:
    if (w !== 1) {
      var invw = 1.0 / w
      x *= invw
      y *= invw
      z *= invw
    }
    return new Vector3D(x, y, z)
  },

    // Multiply a Vector3D (interpreted as 3 column, 1 row) by this matrix
    // (result = v*M)
    // Fourth element is taken as 1
  leftMultiply1x3Vector: function (v) {
    var v0 = v._x
    var v1 = v._y
    var v2 = v._z
    var v3 = 1
    var x = v0 * this.elements[0] + v1 * this.elements[4] + v2 * this.elements[8] + v3 * this.elements[12]
    var y = v0 * this.elements[1] + v1 * this.elements[5] + v2 * this.elements[9] + v3 * this.elements[13]
    var z = v0 * this.elements[2] + v1 * this.elements[6] + v2 * this.elements[10] + v3 * this.elements[14]
    var w = v0 * this.elements[3] + v1 * this.elements[7] + v2 * this.elements[11] + v3 * this.elements[15]
        // scale such that fourth element becomes 1:
    if (w !== 1) {
      var invw = 1.0 / w
      x *= invw
      y *= invw
      z *= invw
    }
    return new Vector3D(x, y, z)
  },

    // Right multiply the matrix by a Vector2D (interpreted as 2 row, 1 column)
    // (result = M*v)
    // Fourth element is taken as 1
  rightMultiply1x2Vector: function (v) {
    var v0 = v.x
    var v1 = v.y
    var v2 = 0
    var v3 = 1
    var x = v0 * this.elements[0] + v1 * this.elements[1] + v2 * this.elements[2] + v3 * this.elements[3]
    var y = v0 * this.elements[4] + v1 * this.elements[5] + v2 * this.elements[6] + v3 * this.elements[7]
    var z = v0 * this.elements[8] + v1 * this.elements[9] + v2 * this.elements[10] + v3 * this.elements[11]
    var w = v0 * this.elements[12] + v1 * this.elements[13] + v2 * this.elements[14] + v3 * this.elements[15]
        // scale such that fourth element becomes 1:
    if (w !== 1) {
      var invw = 1.0 / w
      x *= invw
      y *= invw
      z *= invw
    }
    return new Vector2D(x, y)
  },

    // Multiply a Vector2D (interpreted as 2 column, 1 row) by this matrix
    // (result = v*M)
    // Fourth element is taken as 1
  leftMultiply1x2Vector: function (v) {
    var v0 = v.x
    var v1 = v.y
    var v2 = 0
    var v3 = 1
    var x = v0 * this.elements[0] + v1 * this.elements[4] + v2 * this.elements[8] + v3 * this.elements[12]
    var y = v0 * this.elements[1] + v1 * this.elements[5] + v2 * this.elements[9] + v3 * this.elements[13]
    var z = v0 * this.elements[2] + v1 * this.elements[6] + v2 * this.elements[10] + v3 * this.elements[14]
    var w = v0 * this.elements[3] + v1 * this.elements[7] + v2 * this.elements[11] + v3 * this.elements[15]
        // scale such that fourth element becomes 1:
    if (w !== 1) {
      var invw = 1.0 / w
      x *= invw
      y *= invw
      z *= invw
    }
    return new Vector2D(x, y)
  },

    // determine whether this matrix is a mirroring transformation
  isMirroring: function () {
    var u = new Vector3D(this.elements[0], this.elements[4], this.elements[8])
    var v = new Vector3D(this.elements[1], this.elements[5], this.elements[9])
    var w = new Vector3D(this.elements[2], this.elements[6], this.elements[10])

        // for a true orthogonal, non-mirrored base, u.cross(v) == w
        // If they have an opposite direction then we are mirroring
    var mirrorvalue = u.cross(v).dot(w)
    var ismirror = (mirrorvalue < 0)
    return ismirror
  }
}

// return the unity matrix
Matrix4x4.unity = function () {
  return new Matrix4x4()
}

// Create a rotation matrix for rotating around the x axis
Matrix4x4.rotationX = function (degrees) {
  var radians = degrees * Math.PI * (1.0 / 180.0)
  var cos = Math.cos(radians)
  var sin = Math.sin(radians)
  var els = [
    1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1
  ]
  return new Matrix4x4(els)
}

// Create a rotation matrix for rotating around the y axis
Matrix4x4.rotationY = function (degrees) {
  var radians = degrees * Math.PI * (1.0 / 180.0)
  var cos = Math.cos(radians)
  var sin = Math.sin(radians)
  var els = [
    cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, 0, 0, 0, 1
  ]
  return new Matrix4x4(els)
}

// Create a rotation matrix for rotating around the z axis
Matrix4x4.rotationZ = function (degrees) {
  var radians = degrees * Math.PI * (1.0 / 180.0)
  var cos = Math.cos(radians)
  var sin = Math.sin(radians)
  var els = [
    cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
  ]
  return new Matrix4x4(els)
}

// Matrix for rotation about arbitrary point and axis
Matrix4x4.rotation = function (rotationCenter, rotationAxis, degrees) {
  rotationCenter = new Vector3D(rotationCenter)
  rotationAxis = new Vector3D(rotationAxis)
  var rotationPlane = Plane.fromNormalAndPoint(rotationAxis, rotationCenter)
  var orthobasis = new OrthoNormalBasis(rotationPlane)
  var transformation = Matrix4x4.translation(rotationCenter.negated())
  transformation = transformation.multiply(orthobasis.getProjectionMatrix())
  transformation = transformation.multiply(Matrix4x4.rotationZ(degrees))
  transformation = transformation.multiply(orthobasis.getInverseProjectionMatrix())
  transformation = transformation.multiply(Matrix4x4.translation(rotationCenter))
  return transformation
}

// Create an affine matrix for translation:
Matrix4x4.translation = function (v) {
    // parse as Vector3D, so we can pass an array or a Vector3D
  var vec = new Vector3D(v)
  var els = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, vec.x, vec.y, vec.z, 1]
  return new Matrix4x4(els)
}

// Create an affine matrix for mirroring into an arbitrary plane:
Matrix4x4.mirroring = function (plane) {
  var nx = plane.normal.x
  var ny = plane.normal.y
  var nz = plane.normal.z
  var w = plane.w
  var els = [
        (1.0 - 2.0 * nx * nx), (-2.0 * ny * nx), (-2.0 * nz * nx), 0,
        (-2.0 * nx * ny), (1.0 - 2.0 * ny * ny), (-2.0 * nz * ny), 0,
        (-2.0 * nx * nz), (-2.0 * ny * nz), (1.0 - 2.0 * nz * nz), 0,
        (2.0 * nx * w), (2.0 * ny * w), (2.0 * nz * w), 1
  ]
  return new Matrix4x4(els)
}

// Create an affine matrix for scaling:
Matrix4x4.scaling = function (v) {
    // parse as Vector3D, so we can pass an array or a Vector3D
  var vec = new Vector3D(v)
  var els = [
    vec.x, 0, 0, 0, 0, vec.y, 0, 0, 0, 0, vec.z, 0, 0, 0, 0, 1
  ]
  return new Matrix4x4(els)
}

module.exports = Matrix4x4


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
## License

Copyright (c) 2014 bebbi (elghatta@gmail.com)
Copyright (c) 2013 Eduard Bespalov (edwbes@gmail.com)
Copyright (c) 2012 Joost Nieuwenhuijse (joost@newhouse.nl)
Copyright (c) 2011 Evan Wallace (http://evanw.github.com/csg.js/)
Copyright (c) 2012 Alexandre Girard (https://github.com/alx)

All code released under MIT license

## Overview

For an overview of the CSG process see the original csg.js code:
http://evanw.github.com/csg.js/

CSG operations through BSP trees suffer from one problem: heavy fragmentation
of polygons. If two CSG solids of n polygons are unified, the resulting solid may have
in the order of n*n polygons, because each polygon is split by the planes of all other
polygons. After a few operations the number of polygons explodes.

This version of CSG.js solves the problem in 3 ways:

1. Every polygon split is recorded in a tree (CSG.PolygonTreeNode). This is a separate
tree, not to be confused with the CSG tree. If a polygon is split into two parts but in
the end both fragments have not been discarded by the CSG operation, we can retrieve
the original unsplit polygon from the tree, instead of the two fragments.

This does not completely solve the issue though: if a polygon is split multiple times
the number of fragments depends on the order of subsequent splits, and we might still
end up with unncessary splits:
Suppose a polygon is first split into A and B, and then into A1, B1, A2, B2. Suppose B2 is
discarded. We will end up with 2 polygons: A and B1. Depending on the actual split boundaries
we could still have joined A and B1 into one polygon. Therefore a second approach is used as well:

2. After CSG operations all coplanar polygon fragments are joined by a retesselating
operation. See CSG.reTesselated(). Retesselation is done through a
linear sweep over the polygon surface. The sweep line passes over the y coordinates
of all vertices in the polygon. Polygons are split at each sweep line, and the fragments
are joined horizontally and vertically into larger polygons (making sure that we
will end up with convex polygons).
This still doesn't solve the problem completely: due to floating point imprecisions
we may end up with small gaps between polygons, and polygons may not be exactly coplanar
anymore, and as a result the retesselation algorithm may fail to join those polygons.
Therefore:

3. A canonicalization algorithm is implemented: it looks for vertices that have
approximately the same coordinates (with a certain tolerance, say 1e-5) and replaces
them with the same vertex. If polygons share a vertex they will actually point to the
same CSG.Vertex instance. The same is done for polygon planes. See CSG.canonicalized().

Performance improvements to the original CSG.js:

Replaced the flip() and invert() methods by flipped() and inverted() which don't
modify the source object. This allows to get rid of all clone() calls, so that
multiple polygons can refer to the same CSG.Plane instance etc.

The original union() used an extra invert(), clipTo(), invert() sequence just to remove the
coplanar front faces from b; this is now combined in a single b.clipTo(a, true) call.

Detection whether a polygon is in front or in back of a plane: for each polygon
we are caching the coordinates of the bounding sphere. If the bounding sphere is
in front or in back of the plane we don't have to check the individual vertices
anymore.

Other additions to the original CSG.js:

CSG.Vector class has been renamed into CSG.Vector3D

Classes for 3D lines, 2D vectors, 2D lines, and methods to find the intersection of
a line and a plane etc.

Transformations: CSG.transform(), CSG.translate(), CSG.rotate(), CSG.scale()

Expanding or contracting a solid: CSG.expand() and CSG.contract(). Creates nice
smooth corners.

The vertex normal has been removed since it complicates retesselation. It's not needed
for solid CAD anyway.

*/

const {addTransformationMethodsToPrototype, addCenteringToPrototype} = __webpack_require__(36)
let CSG = __webpack_require__(5)
let CAG = __webpack_require__(10)

// FIXME: how many are actual usefull to be exposed as API ?? looks like a code smell
const { _CSGDEBUG,
  defaultResolution2D,
  defaultResolution3D,
  EPS,
  angleEPS,
  areaEPS,
  all,
  top,
  bottom,
  left,
  right,
  front,
  back,
  staticTag,
  getTag} = __webpack_require__(0)

CSG._CSGDEBUG = _CSGDEBUG
CSG.defaultResolution2D = defaultResolution2D
CSG.defaultResolution3D = defaultResolution3D
CSG.EPS = EPS
CSG.angleEPS = angleEPS
CSG.areaEPS = areaEPS
CSG.all = all
CSG.top = top
CSG.bottom = bottom
CSG.left = left
CSG.right = right
CSG.front = front
CSG.back = back
CSG.staticTag = staticTag
CSG.getTag = getTag

// eek ! all this is kept for backwards compatibility...for now
CSG.Vector2D = __webpack_require__(3)
CSG.Vector3D = __webpack_require__(1)
CSG.Vertex = __webpack_require__(8)
CAG.Vertex = __webpack_require__(16)
CSG.Plane = __webpack_require__(6)
CSG.Polygon = __webpack_require__(7)
CSG.Polygon2D = __webpack_require__(25)
CSG.Line2D = __webpack_require__(21)
CSG.Line3D = __webpack_require__(18)
CSG.Path2D = __webpack_require__(19)
CSG.OrthoNormalBasis = __webpack_require__(13)
CSG.Matrix4x4 = __webpack_require__(11)

CAG.Side = __webpack_require__(17)

CSG.Connector = __webpack_require__(15).Connector
CSG.ConnectorList = __webpack_require__(15).ConnectorList
CSG.Properties = __webpack_require__(23)

const {circle, ellipse, rectangle, roundedRectangle} = __webpack_require__(43)
const {sphere, cube, roundedCube, cylinder, roundedCylinder, cylinderElliptic, polyhedron} = __webpack_require__(26)

CSG.sphere = sphere
CSG.cube = cube
CSG.roundedCube = roundedCube
CSG.cylinder = cylinder
CSG.roundedCylinder = roundedCylinder
CSG.cylinderElliptic = cylinderElliptic
CSG.polyhedron = polyhedron

CAG.circle = circle
CAG.ellipse = ellipse
CAG.rectangle = rectangle
CAG.roundedRectangle = roundedRectangle

//
const {fromCompactBinary, fromObject, fromSlices} = __webpack_require__(44)
CSG.fromCompactBinary = fromCompactBinary
CSG.fromObject = fromObject
CSG.fromSlices = fromSlices

CSG.toPointCloud = __webpack_require__(45).toPointCloud

const CAGMakers = __webpack_require__(22)
CAG.fromObject = CAGMakers.fromObject
CAG.fromPointsNoCheck = CAGMakers.fromPointsNoCheck
CAG.fromPath2 = CAGMakers.fromPath2

// ////////////////////////////////////
addTransformationMethodsToPrototype(CSG.prototype)
addTransformationMethodsToPrototype(CSG.Vector2D.prototype)
addTransformationMethodsToPrototype(CSG.Vector3D.prototype)
addTransformationMethodsToPrototype(CSG.Vertex.prototype)
addTransformationMethodsToPrototype(CSG.Plane.prototype)
addTransformationMethodsToPrototype(CSG.Polygon.prototype)
addTransformationMethodsToPrototype(CSG.Line2D.prototype)
addTransformationMethodsToPrototype(CSG.Line3D.prototype)
addTransformationMethodsToPrototype(CSG.Path2D.prototype)
addTransformationMethodsToPrototype(CSG.OrthoNormalBasis.prototype)
addTransformationMethodsToPrototype(CSG.Connector.prototype)

addTransformationMethodsToPrototype(CAG.prototype)
addTransformationMethodsToPrototype(CAG.Side.prototype)
addTransformationMethodsToPrototype(CAG.Vertex.prototype)

addCenteringToPrototype(CSG.prototype, ['x', 'y', 'z'])
addCenteringToPrototype(CAG.prototype, ['x', 'y'])

module.exports = {CSG, CAG}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const Vector2D = __webpack_require__(3)
const Vector3D = __webpack_require__(1)
const Line2D = __webpack_require__(21)
const Line3D = __webpack_require__(18)
const Plane = __webpack_require__(6)

// # class OrthoNormalBasis
// Reprojects points on a 3D plane onto a 2D plane
// or from a 2D plane back onto the 3D plane
const OrthoNormalBasis = function (plane, rightvector) {
  if (arguments.length < 2) {
        // choose an arbitrary right hand vector, making sure it is somewhat orthogonal to the plane normal:
    rightvector = plane.normal.randomNonParallelVector()
  } else {
    rightvector = new Vector3D(rightvector)
  }
  this.v = plane.normal.cross(rightvector).unit()
  this.u = this.v.cross(plane.normal)
  this.plane = plane
  this.planeorigin = plane.normal.times(plane.w)
}

// Get an orthonormal basis for the standard XYZ planes.
// Parameters: the names of two 3D axes. The 2d x axis will map to the first given 3D axis, the 2d y
// axis will map to the second.
// Prepend the axis with a "-" to invert the direction of this axis.
// For example: OrthoNormalBasis.GetCartesian("-Y","Z")
//   will return an orthonormal basis where the 2d X axis maps to the 3D inverted Y axis, and
//   the 2d Y axis maps to the 3D Z axis.
OrthoNormalBasis.GetCartesian = function (xaxisid, yaxisid) {
  let axisid = xaxisid + '/' + yaxisid
  let planenormal, rightvector
  if (axisid === 'X/Y') {
    planenormal = [0, 0, 1]
    rightvector = [1, 0, 0]
  } else if (axisid === 'Y/-X') {
    planenormal = [0, 0, 1]
    rightvector = [0, 1, 0]
  } else if (axisid === '-X/-Y') {
    planenormal = [0, 0, 1]
    rightvector = [-1, 0, 0]
  } else if (axisid === '-Y/X') {
    planenormal = [0, 0, 1]
    rightvector = [0, -1, 0]
  } else if (axisid === '-X/Y') {
    planenormal = [0, 0, -1]
    rightvector = [-1, 0, 0]
  } else if (axisid === '-Y/-X') {
    planenormal = [0, 0, -1]
    rightvector = [0, -1, 0]
  } else if (axisid === 'X/-Y') {
    planenormal = [0, 0, -1]
    rightvector = [1, 0, 0]
  } else if (axisid === 'Y/X') {
    planenormal = [0, 0, -1]
    rightvector = [0, 1, 0]
  } else if (axisid === 'X/Z') {
    planenormal = [0, -1, 0]
    rightvector = [1, 0, 0]
  } else if (axisid === 'Z/-X') {
    planenormal = [0, -1, 0]
    rightvector = [0, 0, 1]
  } else if (axisid === '-X/-Z') {
    planenormal = [0, -1, 0]
    rightvector = [-1, 0, 0]
  } else if (axisid === '-Z/X') {
    planenormal = [0, -1, 0]
    rightvector = [0, 0, -1]
  } else if (axisid === '-X/Z') {
    planenormal = [0, 1, 0]
    rightvector = [-1, 0, 0]
  } else if (axisid === '-Z/-X') {
    planenormal = [0, 1, 0]
    rightvector = [0, 0, -1]
  } else if (axisid === 'X/-Z') {
    planenormal = [0, 1, 0]
    rightvector = [1, 0, 0]
  } else if (axisid === 'Z/X') {
    planenormal = [0, 1, 0]
    rightvector = [0, 0, 1]
  } else if (axisid === 'Y/Z') {
    planenormal = [1, 0, 0]
    rightvector = [0, 1, 0]
  } else if (axisid === 'Z/-Y') {
    planenormal = [1, 0, 0]
    rightvector = [0, 0, 1]
  } else if (axisid === '-Y/-Z') {
    planenormal = [1, 0, 0]
    rightvector = [0, -1, 0]
  } else if (axisid === '-Z/Y') {
    planenormal = [1, 0, 0]
    rightvector = [0, 0, -1]
  } else if (axisid === '-Y/Z') {
    planenormal = [-1, 0, 0]
    rightvector = [0, -1, 0]
  } else if (axisid === '-Z/-Y') {
    planenormal = [-1, 0, 0]
    rightvector = [0, 0, -1]
  } else if (axisid === 'Y/-Z') {
    planenormal = [-1, 0, 0]
    rightvector = [0, 1, 0]
  } else if (axisid === 'Z/Y') {
    planenormal = [-1, 0, 0]
    rightvector = [0, 0, 1]
  } else {
    throw new Error('OrthoNormalBasis.GetCartesian: invalid combination of axis identifiers. Should pass two string arguments from [X,Y,Z,-X,-Y,-Z], being two different axes.')
  }
  return new OrthoNormalBasis(new Plane(new Vector3D(planenormal), 0), new Vector3D(rightvector))
}

/*
// test code for OrthoNormalBasis.GetCartesian()
OrthoNormalBasis.GetCartesian_Test=function() {
  let axisnames=["X","Y","Z","-X","-Y","-Z"];
  let axisvectors=[[1,0,0], [0,1,0], [0,0,1], [-1,0,0], [0,-1,0], [0,0,-1]];
  for(let axis1=0; axis1 < 3; axis1++) {
    for(let axis1inverted=0; axis1inverted < 2; axis1inverted++) {
      let axis1name=axisnames[axis1+3*axis1inverted];
      let axis1vector=axisvectors[axis1+3*axis1inverted];
      for(let axis2=0; axis2 < 3; axis2++) {
        if(axis2 != axis1) {
          for(let axis2inverted=0; axis2inverted < 2; axis2inverted++) {
            let axis2name=axisnames[axis2+3*axis2inverted];
            let axis2vector=axisvectors[axis2+3*axis2inverted];
            let orthobasis=OrthoNormalBasis.GetCartesian(axis1name, axis2name);
            let test1=orthobasis.to3D(new Vector2D([1,0]));
            let test2=orthobasis.to3D(new Vector2D([0,1]));
            let expected1=new Vector3D(axis1vector);
            let expected2=new Vector3D(axis2vector);
            let d1=test1.distanceTo(expected1);
            let d2=test2.distanceTo(expected2);
            if( (d1 > 0.01) || (d2 > 0.01) ) {
              throw new Error("Wrong!");
  }}}}}}
  throw new Error("OK");
};
*/

// The z=0 plane, with the 3D x and y vectors mapped to the 2D x and y vector
OrthoNormalBasis.Z0Plane = function () {
  let plane = new Plane(new Vector3D([0, 0, 1]), 0)
  return new OrthoNormalBasis(plane, new Vector3D([1, 0, 0]))
}

OrthoNormalBasis.prototype = {
  getProjectionMatrix: function () {
    const Matrix4x4 = __webpack_require__(11) // FIXME: circular dependencies Matrix=>OrthoNormalBasis => Matrix
    return new Matrix4x4([
      this.u.x, this.v.x, this.plane.normal.x, 0,
      this.u.y, this.v.y, this.plane.normal.y, 0,
      this.u.z, this.v.z, this.plane.normal.z, 0,
      0, 0, -this.plane.w, 1
    ])
  },

  getInverseProjectionMatrix: function () {
    const Matrix4x4 = __webpack_require__(11) // FIXME: circular dependencies Matrix=>OrthoNormalBasis => Matrix
    let p = this.plane.normal.times(this.plane.w)
    return new Matrix4x4([
      this.u.x, this.u.y, this.u.z, 0,
      this.v.x, this.v.y, this.v.z, 0,
      this.plane.normal.x, this.plane.normal.y, this.plane.normal.z, 0,
      p.x, p.y, p.z, 1
    ])
  },

  to2D: function (vec3) {
    return new Vector2D(vec3.dot(this.u), vec3.dot(this.v))
  },

  to3D: function (vec2) {
    return this.planeorigin.plus(this.u.times(vec2.x)).plus(this.v.times(vec2.y))
  },

  line3Dto2D: function (line3d) {
    let a = line3d.point
    let b = line3d.direction.plus(a)
    let a2d = this.to2D(a)
    let b2d = this.to2D(b)
    return Line2D.fromPoints(a2d, b2d)
  },

  line2Dto3D: function (line2d) {
    let a = line2d.origin()
    let b = line2d.direction().plus(a)
    let a3d = this.to3D(a)
    let b3d = this.to3D(b)
    return Line3D.fromPoints(a3d, b3d)
  },

  transform: function (matrix4x4) {
        // todo: this may not work properly in case of mirroring
    let newplane = this.plane.transform(matrix4x4)
    let rightpointTransformed = this.u.transform(matrix4x4)
    let originTransformed = new Vector3D(0, 0, 0).transform(matrix4x4)
    let newrighthandvector = rightpointTransformed.minus(originTransformed)
    let newbasis = new OrthoNormalBasis(newplane, newrighthandvector)
    return newbasis
  }
}

module.exports = OrthoNormalBasis


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var renderer = __webpack_require__(32);

var Component = __webpack_require__(2);
var LandauElement = __webpack_require__(33);

var Cube = __webpack_require__(34);
var Cylinder = __webpack_require__(52);
var GeodesicSphere = __webpack_require__(53);
var Polyhedron = __webpack_require__(54);
var Sphere = __webpack_require__(55);
var Torus = __webpack_require__(56);

var Difference = __webpack_require__(57);
var Union = __webpack_require__(30);

var Center = __webpack_require__(58);
var Mirror = __webpack_require__(59);
var Rotate = __webpack_require__(60);
var Scale = __webpack_require__(61);
var Translate = __webpack_require__(62);

module.exports = {
  createElement: LandauElement.createElement,
  materializeTree: renderer.materializeTree,
  renderAsCsg: renderer.renderAsCsg,
  renderAsTree: renderer.renderAsTree,
  renderAsTreeString: renderer.renderAsTreeString,

  Component: Component,
  LandauElement: LandauElement,

  Cube: Cube,
  Cylinder: Cylinder,
  GeodesicSphere: GeodesicSphere,
  Polyhedron: Polyhedron,
  Sphere: Sphere,
  Torus: Torus,

  Difference: Difference,
  Union: Union,

  Center: Center,
  Mirror: Mirror,
  Rotate: Rotate,
  Scale: Scale,
  Translate: Translate
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const Vector3D = __webpack_require__(1)
const Line3D = __webpack_require__(18)
const Matrix4x4 = __webpack_require__(11)
const OrthoNormalBasis = __webpack_require__(13)
const Plane = __webpack_require__(6)

// # class Connector
// A connector allows to attach two objects at predefined positions
// For example a servo motor and a servo horn:
// Both can have a Connector called 'shaft'
// The horn can be moved and rotated such that the two connectors match
// and the horn is attached to the servo motor at the proper position.
// Connectors are stored in the properties of a CSG solid so they are
// ge the same transformations applied as the solid
const Connector = function (point, axisvector, normalvector) {
  this.point = new Vector3D(point)
  this.axisvector = new Vector3D(axisvector).unit()
  this.normalvector = new Vector3D(normalvector).unit()
}

Connector.prototype = {
  normalized: function () {
    let axisvector = this.axisvector.unit()
        // make the normal vector truly normal:
    let n = this.normalvector.cross(axisvector).unit()
    let normalvector = axisvector.cross(n)
    return new Connector(this.point, axisvector, normalvector)
  },

  transform: function (matrix4x4) {
    let point = this.point.multiply4x4(matrix4x4)
    let axisvector = this.point.plus(this.axisvector).multiply4x4(matrix4x4).minus(point)
    let normalvector = this.point.plus(this.normalvector).multiply4x4(matrix4x4).minus(point)
    return new Connector(point, axisvector, normalvector)
  },

    // Get the transformation matrix to connect this Connector to another connector
    //   other: a Connector to which this connector should be connected
    //   mirror: false: the 'axis' vectors of the connectors should point in the same direction
    //           true: the 'axis' vectors of the connectors should point in opposite direction
    //   normalrotation: degrees of rotation between the 'normal' vectors of the two
    //                   connectors
  getTransformationTo: function (other, mirror, normalrotation) {
    mirror = mirror ? true : false
    normalrotation = normalrotation ? Number(normalrotation) : 0
    let us = this.normalized()
    other = other.normalized()
        // shift to the origin:
    let transformation = Matrix4x4.translation(this.point.negated())
        // construct the plane crossing through the origin and the two axes:
    let axesplane = Plane.anyPlaneFromVector3Ds(
            new Vector3D(0, 0, 0), us.axisvector, other.axisvector)
    let axesbasis = new OrthoNormalBasis(axesplane)
    let angle1 = axesbasis.to2D(us.axisvector).angle()
    let angle2 = axesbasis.to2D(other.axisvector).angle()
    let rotation = 180.0 * (angle2 - angle1) / Math.PI
    if (mirror) rotation += 180.0
    transformation = transformation.multiply(axesbasis.getProjectionMatrix())
    transformation = transformation.multiply(Matrix4x4.rotationZ(rotation))
    transformation = transformation.multiply(axesbasis.getInverseProjectionMatrix())
    let usAxesAligned = us.transform(transformation)
        // Now we have done the transformation for aligning the axes.
        // We still need to align the normals:
    let normalsplane = Plane.fromNormalAndPoint(other.axisvector, new Vector3D(0, 0, 0))
    let normalsbasis = new OrthoNormalBasis(normalsplane)
    angle1 = normalsbasis.to2D(usAxesAligned.normalvector).angle()
    angle2 = normalsbasis.to2D(other.normalvector).angle()
    rotation = 180.0 * (angle2 - angle1) / Math.PI
    rotation += normalrotation
    transformation = transformation.multiply(normalsbasis.getProjectionMatrix())
    transformation = transformation.multiply(Matrix4x4.rotationZ(rotation))
    transformation = transformation.multiply(normalsbasis.getInverseProjectionMatrix())
        // and translate to the destination point:
    transformation = transformation.multiply(Matrix4x4.translation(other.point))
        // let usAligned = us.transform(transformation);
    return transformation
  },

  axisLine: function () {
    return new Line3D(this.point, this.axisvector)
  },

    // creates a new Connector, with the connection point moved in the direction of the axisvector
  extend: function (distance) {
    let newpoint = this.point.plus(this.axisvector.unit().times(distance))
    return new Connector(newpoint, this.axisvector, this.normalvector)
  }
}

const ConnectorList = function (connectors) {
  this.connectors_ = connectors ? connectors.slice() : []
}

ConnectorList.defaultNormal = [0, 0, 1]

ConnectorList.fromPath2D = function (path2D, arg1, arg2) {
  if (arguments.length === 3) {
    return ConnectorList._fromPath2DTangents(path2D, arg1, arg2)
  } else if (arguments.length === 2) {
    return ConnectorList._fromPath2DExplicit(path2D, arg1)
  } else {
    throw new Error('call with path2D and either 2 direction vectors, or a function returning direction vectors')
  }
}

/*
 * calculate the connector axisvectors by calculating the "tangent" for path2D.
 * This is undefined for start and end points, so axis for these have to be manually
 * provided.
 */
ConnectorList._fromPath2DTangents = function (path2D, start, end) {
    // path2D
  let axis
  let pathLen = path2D.points.length
  let result = new ConnectorList([new Connector(path2D.points[0],
        start, ConnectorList.defaultNormal)])
    // middle points
  path2D.points.slice(1, pathLen - 1).forEach(function (p2, i) {
    axis = path2D.points[i + 2].minus(path2D.points[i]).toVector3D(0)
    result.appendConnector(new Connector(p2.toVector3D(0), axis,
          ConnectorList.defaultNormal))
  }, this)
  result.appendConnector(new Connector(path2D.points[pathLen - 1], end,
      ConnectorList.defaultNormal))
  result.closed = path2D.closed
  return result
}

/*
 * angleIsh: either a static angle, or a function(point) returning an angle
 */
ConnectorList._fromPath2DExplicit = function (path2D, angleIsh) {
  function getAngle (angleIsh, pt, i) {
    if (typeof angleIsh === 'function') {
      angleIsh = angleIsh(pt, i)
    }
    return angleIsh
  }
  let result = new ConnectorList(
        path2D.points.map(function (p2, i) {
          return new Connector(p2.toVector3D(0),
                Vector3D.Create(1, 0, 0).rotateZ(getAngle(angleIsh, p2, i)),
                  ConnectorList.defaultNormal)
        }, this)
    )
  result.closed = path2D.closed
  return result
}

ConnectorList.prototype = {
  setClosed: function (closed) {
    this.closed = !!closed // FIXME: what the hell ?
  },
  appendConnector: function (conn) {
    this.connectors_.push(conn)
  },
    /*
     * arguments: cagish: a cag or a function(connector) returning a cag
     *            closed: whether the 3d path defined by connectors location
     *              should be closed or stay open
     *              Note: don't duplicate connectors in the path
     * TODO: consider an option "maySelfIntersect" to close & force union all single segments
     */
  followWith: function (cagish) {
    const CSG = __webpack_require__(5) // FIXME , circular dependency connectors => CSG => connectors

    this.verify()
    function getCag (cagish, connector) {
      if (typeof cagish === 'function') {
        cagish = cagish(connector.point, connector.axisvector, connector.normalvector)
      }
      return cagish
    }

    let polygons = []
    let currCag
    let prevConnector = this.connectors_[this.connectors_.length - 1]
    let prevCag = getCag(cagish, prevConnector)
        // add walls
    this.connectors_.forEach(function (connector, notFirst) {
      currCag = getCag(cagish, connector)
      if (notFirst || this.closed) {
        polygons.push.apply(polygons, prevCag._toWallPolygons({
          toConnector1: prevConnector, toConnector2: connector, cag: currCag}))
      } else {
                // it is the first, and shape not closed -> build start wall
        polygons.push.apply(polygons,
                    currCag._toPlanePolygons({toConnector: connector, flipped: true}))
      }
      if (notFirst === this.connectors_.length - 1 && !this.closed) {
                // build end wall
        polygons.push.apply(polygons,
                    currCag._toPlanePolygons({toConnector: connector}))
      }
      prevCag = currCag
      prevConnector = connector
    }, this)
    return CSG.fromPolygons(polygons).reTesselated().canonicalized()
  },
    /*
     * general idea behind these checks: connectors need to have smooth transition from one to another
     * TODO: add a check that 2 follow-on CAGs are not intersecting
     */
  verify: function () {
    let connI
    let connI1
    for (let i = 0; i < this.connectors_.length - 1; i++) {
      connI = this.connectors_[i]
      connI1 = this.connectors_[i + 1]
      if (connI1.point.minus(connI.point).dot(connI.axisvector) <= 0) {
        throw new Error('Invalid ConnectorList. Each connectors position needs to be within a <90deg range of previous connectors axisvector')
      }
      if (connI.axisvector.dot(connI1.axisvector) <= 0) {
        throw new Error('invalid ConnectorList. No neighboring connectors axisvectors may span a >=90deg angle')
      }
    }
  }
}

module.exports = {Connector, ConnectorList}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const Vector2D = __webpack_require__(3)
const {getTag} = __webpack_require__(0)

const Vertex = function (pos) {
  this.pos = pos
}

Vertex.fromObject = function (obj) {
  return new Vertex(new Vector2D(obj.pos._x, obj.pos._y))
}

Vertex.prototype = {
  toString: function () {
    return '(' + this.pos.x.toFixed(5) + ',' + this.pos.y.toFixed(5) + ')'
  },
  getTag: function () {
    var result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  }
}

module.exports = Vertex


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const Vector2D = __webpack_require__(3)
const Vertex = __webpack_require__(16)
const Vertex3 = __webpack_require__(8)
const Polygon = __webpack_require__(7)
const {getTag} = __webpack_require__(0)

const Side = function (vertex0, vertex1) {
  if (!(vertex0 instanceof Vertex)) throw new Error('Assertion failed')
  if (!(vertex1 instanceof Vertex)) throw new Error('Assertion failed')
  this.vertex0 = vertex0
  this.vertex1 = vertex1
}

Side.fromObject = function (obj) {
  var vertex0 = Vertex.fromObject(obj.vertex0)
  var vertex1 = Vertex.fromObject(obj.vertex1)
  return new Side(vertex0, vertex1)
}

Side._fromFakePolygon = function (polygon) {
    // this can happen based on union, seems to be residuals -
    // return null and handle in caller
  if (polygon.vertices.length < 4) {
    return null
  }
  var vert1Indices = []
  var pts2d = polygon.vertices.filter(function (v, i) {
    if (v.pos.z > 0) {
      vert1Indices.push(i)
      return true
    }
    return false
  })
    .map(function (v) {
      return new Vector2D(v.pos.x, v.pos.y)
    })
  if (pts2d.length !== 2) {
    throw new Error('Assertion failed: _fromFakePolygon: not enough points found')
  }
  var d = vert1Indices[1] - vert1Indices[0]
  if (d === 1 || d === 3) {
    if (d === 1) {
      pts2d.reverse()
    }
  } else {
    throw new Error('Assertion failed: _fromFakePolygon: unknown index ordering')
  }
  var result = new Side(new Vertex(pts2d[0]), new Vertex(pts2d[1]))
  return result
}

Side.prototype = {
  toString: function () {
    return this.vertex0 + ' -> ' + this.vertex1
  },

  toPolygon3D: function (z0, z1) {
    //console.log(this.vertex0.pos)
    const vertices = [
      new Vertex3(this.vertex0.pos.toVector3D(z0)),
      new Vertex3(this.vertex1.pos.toVector3D(z0)),
      new Vertex3(this.vertex1.pos.toVector3D(z1)),
      new Vertex3(this.vertex0.pos.toVector3D(z1))
    ]
    return new Polygon(vertices)
  },

  transform: function (matrix4x4) {
    var newp1 = this.vertex0.pos.transform(matrix4x4)
    var newp2 = this.vertex1.pos.transform(matrix4x4)
    return new Side(new Vertex(newp1), new Vertex(newp2))
  },

  flipped: function () {
    return new Side(this.vertex1, this.vertex0)
  },

  direction: function () {
    return this.vertex1.pos.minus(this.vertex0.pos)
  },

  getTag: function () {
    var result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  },

  lengthSquared: function () {
    let x = this.vertex1.pos.x - this.vertex0.pos.x
    let y = this.vertex1.pos.y - this.vertex0.pos.y
    return x * x + y * y
  },

  length: function () {
    return Math.sqrt(this.lengthSquared())
  }
}

module.exports = Side


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const Vector3D = __webpack_require__(1)
const {EPS} = __webpack_require__(0)
const {solve2Linear} = __webpack_require__(9)

// # class Line3D
// Represents a line in 3D space
// direction must be a unit vector
// point is a random point on the line
const Line3D = function (point, direction) {
  point = new Vector3D(point)
  direction = new Vector3D(direction)
  this.point = point
  this.direction = direction.unit()
}

Line3D.fromPoints = function (p1, p2) {
  p1 = new Vector3D(p1)
  p2 = new Vector3D(p2)
  let direction = p2.minus(p1)
  return new Line3D(p1, direction)
}

Line3D.fromPlanes = function (p1, p2) {
  let direction = p1.normal.cross(p2.normal)
  let l = direction.length()
  if (l < EPS) {
    throw new Error('Parallel planes')
  }
  direction = direction.times(1.0 / l)

  let mabsx = Math.abs(direction.x)
  let mabsy = Math.abs(direction.y)
  let mabsz = Math.abs(direction.z)
  let origin
  if ((mabsx >= mabsy) && (mabsx >= mabsz)) {
        // direction vector is mostly pointing towards x
        // find a point p for which x is zero:
    let r = solve2Linear(p1.normal.y, p1.normal.z, p2.normal.y, p2.normal.z, p1.w, p2.w)
    origin = new Vector3D(0, r[0], r[1])
  } else if ((mabsy >= mabsx) && (mabsy >= mabsz)) {
        // find a point p for which y is zero:
    let r = solve2Linear(p1.normal.x, p1.normal.z, p2.normal.x, p2.normal.z, p1.w, p2.w)
    origin = new Vector3D(r[0], 0, r[1])
  } else {
        // find a point p for which z is zero:
    let r = solve2Linear(p1.normal.x, p1.normal.y, p2.normal.x, p2.normal.y, p1.w, p2.w)
    origin = new Vector3D(r[0], r[1], 0)
  }
  return new Line3D(origin, direction)
}

Line3D.prototype = {
  intersectWithPlane: function (plane) {
        // plane: plane.normal * p = plane.w
        // line: p=line.point + labda * line.direction
    let labda = (plane.w - plane.normal.dot(this.point)) / plane.normal.dot(this.direction)
    let point = this.point.plus(this.direction.times(labda))
    return point
  },

  clone: function (line) {
    return new Line3D(this.point.clone(), this.direction.clone())
  },

  reverse: function () {
    return new Line3D(this.point.clone(), this.direction.negated())
  },

  transform: function (matrix4x4) {
    let newpoint = this.point.multiply4x4(matrix4x4)
    let pointPlusDirection = this.point.plus(this.direction)
    let newPointPlusDirection = pointPlusDirection.multiply4x4(matrix4x4)
    let newdirection = newPointPlusDirection.minus(newpoint)
    return new Line3D(newpoint, newdirection)
  },

  closestPointOnLine: function (point) {
    point = new Vector3D(point)
    let t = point.minus(this.point).dot(this.direction) / this.direction.dot(this.direction)
    let closestpoint = this.point.plus(this.direction.times(t))
    return closestpoint
  },

  distanceToPoint: function (point) {
    point = new Vector3D(point)
    let closestpoint = this.closestPointOnLine(point)
    let distancevector = point.minus(closestpoint)
    let distance = distancevector.length()
    return distance
  },

  equals: function (line3d) {
    if (!this.direction.equals(line3d.direction)) return false
    let distance = this.distanceToPoint(line3d.point)
    if (distance > EPS) return false
    return true
  }
}

module.exports = Line3D


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const Vector2D = __webpack_require__(3)
const {EPS, angleEPS} = __webpack_require__(0)
const {parseOptionAs2DVector, parseOptionAsFloat, parseOptionAsInt, parseOptionAsBool} = __webpack_require__(20)
const {defaultResolution2D} = __webpack_require__(0)
const Vertex = __webpack_require__(16)
const Side = __webpack_require__(17)

/** Class Path2D
 * Represents a series of points, connected by infinitely thin lines.
 * A path can be open or closed, i.e. additional line between first and last points. 
 * The difference between Path2D and CAG is that a path is a 'thin' line, whereas a CAG is an enclosed area. 
 * @constructor
 * @param {Vector2D[]} [points=[]] - list of points
 * @param {boolean} [closed=false] - closer of path
 *
 * @example
 * new CSG.Path2D()
 * new CSG.Path2D([[10,10], [-10,10], [-10,-10], [10,-10]], true) // closed
 */
const Path2D = function (points, closed) {
  closed = !!closed
  points = points || []
    // re-parse the points into Vector2D
    // and remove any duplicate points
  let prevpoint = null
  if (closed && (points.length > 0)) {
    prevpoint = new Vector2D(points[points.length - 1])
  }
  let newpoints = []
  points.map(function (point) {
    point = new Vector2D(point)
    let skip = false
    if (prevpoint !== null) {
      let distance = point.distanceTo(prevpoint)
      skip = distance < EPS
    }
    if (!skip) newpoints.push(point)
    prevpoint = point
  })
  this.points = newpoints
  this.closed = closed
}

/** Construct an arc.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of circle
 * @param {Number} [options.radius=1] - radius of circle
 * @param {Number} [options.startangle=0] - starting angle of the arc, in degrees
 * @param {Number} [options.endangle=360] - ending angle of the arc, in degrees
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @param {Boolean} [options.maketangent=false] - adds line segments at both ends of the arc to ensure that the gradients at the edges are tangent
 * @returns {Path2D} new Path2D object (not closed)
 *
 * @example
 * let path = CSG.Path2D.arc({
 *   center: [5, 5],
 *   radius: 10,
 *   startangle: 90,
 *   endangle: 180,
 *   resolution: 36,
 *   maketangent: true
 * });
 */
Path2D.arc = function (options) {
  let center = parseOptionAs2DVector(options, 'center', 0)
  let radius = parseOptionAsFloat(options, 'radius', 1)
  let startangle = parseOptionAsFloat(options, 'startangle', 0)
  let endangle = parseOptionAsFloat(options, 'endangle', 360)
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)
  let maketangent = parseOptionAsBool(options, 'maketangent', false)
    // no need to make multiple turns:
  while (endangle - startangle >= 720) {
    endangle -= 360
  }
  while (endangle - startangle <= -720) {
    endangle += 360
  }
  let points = []
  let point
  let absangledif = Math.abs(endangle - startangle)
  if (absangledif < angleEPS) {
    point = Vector2D.fromAngle(startangle / 180.0 * Math.PI).times(radius)
    points.push(point.plus(center))
  } else {
    let numsteps = Math.floor(resolution * absangledif / 360) + 1
    let edgestepsize = numsteps * 0.5 / absangledif // step size for half a degree
    if (edgestepsize > 0.25) edgestepsize = 0.25
    let numstepsMod = maketangent ? (numsteps + 2) : numsteps
    for (let i = 0; i <= numstepsMod; i++) {
      let step = i
      if (maketangent) {
        step = (i - 1) * (numsteps - 2 * edgestepsize) / numsteps + edgestepsize
        if (step < 0) step = 0
        if (step > numsteps) step = numsteps
      }
      let angle = startangle + step * (endangle - startangle) / numsteps
      point = Vector2D.fromAngle(angle / 180.0 * Math.PI).times(radius)
      points.push(point.plus(center))
    }
  }
  return new Path2D(points, false)
}

Path2D.prototype = {
  concat: function (otherpath) {
    if (this.closed || otherpath.closed) {
      throw new Error('Paths must not be closed')
    }
    let newpoints = this.points.concat(otherpath.points)
    return new Path2D(newpoints)
  },

  /**
   * Get the points that make up the path.
   * note that this is current internal list of points, not an immutable copy.
   * @returns {Vector2[]} array of points the make up the path
   */
  getPoints: function() {
    return this.points;
  },

  /**
   * Append an point to the end of the path.
   * @param {Vector2D} point - point to append
   * @returns {Path2D} new Path2D object (not closed)
   */
  appendPoint: function (point) {
    if (this.closed) {
      throw new Error('Path must not be closed')
    }
    point = new Vector2D(point) // cast to Vector2D
    let newpoints = this.points.concat([point])
    return new Path2D(newpoints)
  },

  /**
   * Append a list of points to the end of the path.
   * @param {Vector2D[]} points - points to append
   * @returns {Path2D} new Path2D object (not closed)
   */
  appendPoints: function (points) {
    if (this.closed) {
      throw new Error('Path must not be closed')
    }
    let newpoints = this.points
    points.forEach(function (point) {
      newpoints.push(new Vector2D(point)) // cast to Vector2D
    })
    return new Path2D(newpoints)
  },

  close: function () {
    return new Path2D(this.points, true)
  },

  /**
   * Determine if the path is a closed or not.
   * @returns {Boolean} true when the path is closed, otherwise false
   */
  isClosed: function() {
    return this.closed
  },

    // Extrude the path by following it with a rectangle (upright, perpendicular to the path direction)
    // Returns a CSG solid
    //   width: width of the extrusion, in the z=0 plane
    //   height: height of the extrusion in the z direction
    //   resolution: number of segments per 360 degrees for the curve in a corner
  rectangularExtrude: function (width, height, resolution) {
    let cag = this.expandToCAG(width / 2, resolution)
    let result = cag.extrude({
      offset: [0, 0, height]
    })
    return result
  },

    // Expand the path to a CAG
    // This traces the path with a circle with radius pathradius
  expandToCAG: function (pathradius, resolution) {
    const CAG = __webpack_require__(10) // FIXME: cyclic dependencies CAG => PATH2 => CAG
    let sides = []
    let numpoints = this.points.length
    let startindex = 0
    if (this.closed && (numpoints > 2)) startindex = -1
    let prevvertex
    for (let i = startindex; i < numpoints; i++) {
      let pointindex = i
      if (pointindex < 0) pointindex = numpoints - 1
      let point = this.points[pointindex]
      let vertex = new Vertex(point)
      if (i > startindex) {
        let side = new Side(prevvertex, vertex)
        sides.push(side)
      }
      prevvertex = vertex
    }
    let shellcag = CAG.fromSides(sides)
    let expanded = shellcag.expandedShell(pathradius, resolution)
    return expanded
  },

  innerToCAG: function() {
    const CAG = __webpack_require__(10) // FIXME: cyclic dependencies CAG => PATH2 => CAG
    if (!this.closed) throw new Error("The path should be closed!");
    return CAG.fromPoints(this.points);
  },

  transform: function (matrix4x4) {
    let newpoints = this.points.map(function (point) {
      return point.multiply4x4(matrix4x4)
    })
    return new Path2D(newpoints, this.closed)
  },

  /**
   * Append a Bezier curve to the end of the path, using the control points to transition the curve through start and end points.
   * <br>
   * The Bézier curve starts at the last point in the path,
   * and ends at the last given control point. Other control points are intermediate control points.
   * <br>
   * The first control point may be null to ensure a smooth transition occurs. In this case,  
   * the second to last control point of the path is mirrored into the control points of the Bezier curve.
   * In other words, the trailing gradient of the path matches the new gradient of the curve. 
   * @param {Vector2D[]} controlpoints - list of control points
   * @param {Object} [options] - options for construction
   * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
   * @returns {Path2D} new Path2D object (not closed)
   *
   * @example
   * let p5 = new CSG.Path2D([[10,-20]],false);
   * p5 = p5.appendBezier([[10,-10],[25,-10],[25,-20]]);
   * p5 = p5.appendBezier([[25,-30],[40,-30],[40,-20]]);
   */
  appendBezier: function (controlpoints, options) {
    if (arguments.length < 2) {
      options = {}
    }
    if (this.closed) {
      throw new Error('Path must not be closed')
    }
    if (!(controlpoints instanceof Array)) {
      throw new Error('appendBezier: should pass an array of control points')
    }
    if (controlpoints.length < 1) {
      throw new Error('appendBezier: need at least 1 control point')
    }
    if (this.points.length < 1) {
      throw new Error('appendBezier: path must already contain a point (the endpoint of the path is used as the starting point for the bezier curve)')
    }
    let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)
    if (resolution < 4) resolution = 4
    let factorials = []
    let controlpointsParsed = []
    controlpointsParsed.push(this.points[this.points.length - 1]) // start at the previous end point
    for (let i = 0; i < controlpoints.length; ++i) {
      let p = controlpoints[i]
      if (p === null) {
                // we can pass null as the first control point. In that case a smooth gradient is ensured:
        if (i !== 0) {
          throw new Error('appendBezier: null can only be passed as the first control point')
        }
        if (controlpoints.length < 2) {
          throw new Error('appendBezier: null can only be passed if there is at least one more control point')
        }
        let lastBezierControlPoint
        if ('lastBezierControlPoint' in this) {
          lastBezierControlPoint = this.lastBezierControlPoint
        } else {
          if (this.points.length < 2) {
            throw new Error('appendBezier: null is passed as a control point but this requires a previous bezier curve or at least two points in the existing path')
          }
          lastBezierControlPoint = this.points[this.points.length - 2]
        }
                // mirror the last bezier control point:
        p = this.points[this.points.length - 1].times(2).minus(lastBezierControlPoint)
      } else {
        p = new Vector2D(p) // cast to Vector2D
      }
      controlpointsParsed.push(p)
    }
    let bezierOrder = controlpointsParsed.length - 1
    let fact = 1
    for (let i = 0; i <= bezierOrder; ++i) {
      if (i > 0) fact *= i
      factorials.push(fact)
    }
    let binomials = []
    for (let i = 0; i <= bezierOrder; ++i) {
      let binomial = factorials[bezierOrder] / (factorials[i] * factorials[bezierOrder - i])
      binomials.push(binomial)
    }
    let getPointForT = function (t) {
      let t_k = 1 // = pow(t,k)
      let one_minus_t_n_minus_k = Math.pow(1 - t, bezierOrder) // = pow( 1-t, bezierOrder - k)
      let inv_1_minus_t = (t !== 1) ? (1 / (1 - t)) : 1
      let point = new Vector2D(0, 0)
      for (let k = 0; k <= bezierOrder; ++k) {
        if (k === bezierOrder) one_minus_t_n_minus_k = 1
        let bernstein_coefficient = binomials[k] * t_k * one_minus_t_n_minus_k
        point = point.plus(controlpointsParsed[k].times(bernstein_coefficient))
        t_k *= t
        one_minus_t_n_minus_k *= inv_1_minus_t
      }
      return point
    }
    let newpoints = []
    let newpoints_t = []
    let numsteps = bezierOrder + 1
    for (let i = 0; i < numsteps; ++i) {
      let t = i / (numsteps - 1)
      let point = getPointForT(t)
      newpoints.push(point)
      newpoints_t.push(t)
    }
    // subdivide each segment until the angle at each vertex becomes small enough:
    let subdivideBase = 1
    let maxangle = Math.PI * 2 / resolution // segments may have differ no more in angle than this
    let maxsinangle = Math.sin(maxangle)
    while (subdivideBase < newpoints.length - 1) {
      let dir1 = newpoints[subdivideBase].minus(newpoints[subdivideBase - 1]).unit()
      let dir2 = newpoints[subdivideBase + 1].minus(newpoints[subdivideBase]).unit()
      let sinangle = dir1.cross(dir2) // this is the sine of the angle
      if (Math.abs(sinangle) > maxsinangle) {
                // angle is too big, we need to subdivide
        let t0 = newpoints_t[subdivideBase - 1]
        let t1 = newpoints_t[subdivideBase + 1]
        let t0_new = t0 + (t1 - t0) * 1 / 3
        let t1_new = t0 + (t1 - t0) * 2 / 3
        let point0_new = getPointForT(t0_new)
        let point1_new = getPointForT(t1_new)
                // remove the point at subdivideBase and replace with 2 new points:
        newpoints.splice(subdivideBase, 1, point0_new, point1_new)
        newpoints_t.splice(subdivideBase, 1, t0_new, t1_new)
                // re - evaluate the angles, starting at the previous junction since it has changed:
        subdivideBase--
        if (subdivideBase < 1) subdivideBase = 1
      } else {
        ++subdivideBase
      }
    }
        // append to the previous points, but skip the first new point because it is identical to the last point:
    newpoints = this.points.concat(newpoints.slice(1))
    let result = new Path2D(newpoints)
    result.lastBezierControlPoint = controlpointsParsed[controlpointsParsed.length - 2]
    return result
  },


  /**
   * Append an arc to the end of the path.
   * This implementation follows the SVG arc specs. For the details see
   * http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
   * @param {Vector2D} endpoint - end point of arc
   * @param {Object} [options] - options for construction
   * @param {Number} [options.radius=0] - radius of arc (X and Y), see also xradius and yradius
   * @param {Number} [options.xradius=0] - X radius of arc, see also radius
   * @param {Number} [options.yradius=0] - Y radius of arc, see also radius
   * @param {Number} [options.xaxisrotation=0] -  rotation (in degrees) of the X axis of the arc with respect to the X axis of the coordinate system
   * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
   * @param {Boolean} [options.clockwise=false] - draw an arc clockwise with respect to the center point
   * @param {Boolean} [options.large=false] - draw an arc longer than 180 degrees
   * @returns {Path2D} new Path2D object (not closed)
   *
   * @example
   * let p1 = new CSG.Path2D([[27.5,-22.96875]],false);
   * p1 = p1.appendPoint([27.5,-3.28125]);
   * p1 = p1.appendArc([12.5,-22.96875],{xradius: 15,yradius: -19.6875,xaxisrotation: 0,clockwise: false,large: false});
   * p1 = p1.close();
   */
  appendArc: function (endpoint, options) {
    let decimals = 100000
    if (arguments.length < 2) {
      options = {}
    }
    if (this.closed) {
      throw new Error('Path must not be closed')
    }
    if (this.points.length < 1) {
      throw new Error('appendArc: path must already contain a point (the endpoint of the path is used as the starting point for the arc)')
    }
    let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)
    if (resolution < 4) resolution = 4
    let xradius, yradius
    if (('xradius' in options) || ('yradius' in options)) {
      if ('radius' in options) {
        throw new Error('Should either give an xradius and yradius parameter, or a radius parameter')
      }
      xradius = parseOptionAsFloat(options, 'xradius', 0)
      yradius = parseOptionAsFloat(options, 'yradius', 0)
    } else {
      xradius = parseOptionAsFloat(options, 'radius', 0)
      yradius = xradius
    }
    let xaxisrotation = parseOptionAsFloat(options, 'xaxisrotation', 0)
    let clockwise = parseOptionAsBool(options, 'clockwise', false)
    let largearc = parseOptionAsBool(options, 'large', false)
    let startpoint = this.points[this.points.length - 1]
    endpoint = new Vector2D(endpoint)
        // round to precision in order to have determinate calculations
    xradius = Math.round(xradius * decimals) / decimals
    yradius = Math.round(yradius * decimals) / decimals
    endpoint = new Vector2D(Math.round(endpoint.x * decimals) / decimals, Math.round(endpoint.y * decimals) / decimals)

    let sweepFlag = !clockwise
    let newpoints = []
    if ((xradius === 0) || (yradius === 0)) {
            // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes:
            // If rx = 0 or ry = 0, then treat this as a straight line from (x1, y1) to (x2, y2) and stop
      newpoints.push(endpoint)
    } else {
      xradius = Math.abs(xradius)
      yradius = Math.abs(yradius)

            // see http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes :
      let phi = xaxisrotation * Math.PI / 180.0
      let cosphi = Math.cos(phi)
      let sinphi = Math.sin(phi)
      let minushalfdistance = startpoint.minus(endpoint).times(0.5)
            // F.6.5.1:
            // round to precision in order to have determinate calculations
      let x = Math.round((cosphi * minushalfdistance.x + sinphi * minushalfdistance.y) * decimals) / decimals
      let y = Math.round((-sinphi * minushalfdistance.x + cosphi * minushalfdistance.y) * decimals) / decimals
      let startTranslated = new Vector2D(x, y)
            // F.6.6.2:
      let biglambda = (startTranslated.x * startTranslated.x) / (xradius * xradius) + (startTranslated.y * startTranslated.y) / (yradius * yradius)
      if (biglambda > 1.0) {
                // F.6.6.3:
        let sqrtbiglambda = Math.sqrt(biglambda)
        xradius *= sqrtbiglambda
        yradius *= sqrtbiglambda
                // round to precision in order to have determinate calculations
        xradius = Math.round(xradius * decimals) / decimals
        yradius = Math.round(yradius * decimals) / decimals
      }
            // F.6.5.2:
      let multiplier1 = Math.sqrt((xradius * xradius * yradius * yradius - xradius * xradius * startTranslated.y * startTranslated.y - yradius * yradius * startTranslated.x * startTranslated.x) / (xradius * xradius * startTranslated.y * startTranslated.y + yradius * yradius * startTranslated.x * startTranslated.x))
      if (sweepFlag === largearc) multiplier1 = -multiplier1
      let centerTranslated = new Vector2D(xradius * startTranslated.y / yradius, -yradius * startTranslated.x / xradius).times(multiplier1)
            // F.6.5.3:
      let center = new Vector2D(cosphi * centerTranslated.x - sinphi * centerTranslated.y, sinphi * centerTranslated.x + cosphi * centerTranslated.y).plus((startpoint.plus(endpoint)).times(0.5))
            // F.6.5.5:
      let vec1 = new Vector2D((startTranslated.x - centerTranslated.x) / xradius, (startTranslated.y - centerTranslated.y) / yradius)
      let vec2 = new Vector2D((-startTranslated.x - centerTranslated.x) / xradius, (-startTranslated.y - centerTranslated.y) / yradius)
      let theta1 = vec1.angleRadians()
      let theta2 = vec2.angleRadians()
      let deltatheta = theta2 - theta1
      deltatheta = deltatheta % (2 * Math.PI)
      if ((!sweepFlag) && (deltatheta > 0)) {
        deltatheta -= 2 * Math.PI
      } else if ((sweepFlag) && (deltatheta < 0)) {
        deltatheta += 2 * Math.PI
      }

            // Ok, we have the center point and angle range (from theta1, deltatheta radians) so we can create the ellipse
      let numsteps = Math.ceil(Math.abs(deltatheta) / (2 * Math.PI) * resolution) + 1
      if (numsteps < 1) numsteps = 1
      for (let step = 1; step <= numsteps; step++) {
        let theta = theta1 + step / numsteps * deltatheta
        let costheta = Math.cos(theta)
        let sintheta = Math.sin(theta)
                // F.6.3.1:
        let point = new Vector2D(cosphi * xradius * costheta - sinphi * yradius * sintheta, sinphi * xradius * costheta + cosphi * yradius * sintheta).plus(center)
        newpoints.push(point)
      }
    }
    newpoints = this.points.concat(newpoints)
    let result = new Path2D(newpoints)
    return result
  }
}

module.exports = Path2D


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const Vector3D = __webpack_require__(1)
const Vector2D = __webpack_require__(3)

// Parse an option from the options object
// If the option is not present, return the default value
const parseOption = function (options, optionname, defaultvalue) {
  var result = defaultvalue
  if (options && optionname in options) {
    result = options[optionname]
  }
  return result
}

  // Parse an option and force into a Vector3D. If a scalar is passed it is converted
  // into a vector with equal x,y,z
const parseOptionAs3DVector = function (options, optionname, defaultvalue) {
  var result = parseOption(options, optionname, defaultvalue)
  result = new Vector3D(result)
  return result
}

const parseOptionAs3DVectorList = function (options, optionname, defaultvalue) {
  var result = parseOption(options, optionname, defaultvalue)
  return result.map(function (res) {
    return new Vector3D(res)
  })
}

  // Parse an option and force into a Vector2D. If a scalar is passed it is converted
  // into a vector with equal x,y
const parseOptionAs2DVector = function (options, optionname, defaultvalue) {
  var result = parseOption(options, optionname, defaultvalue)
  result = new Vector2D(result)
  return result
}

const parseOptionAsFloat = function (options, optionname, defaultvalue) {
  var result = parseOption(options, optionname, defaultvalue)
  if (typeof (result) === 'string') {
    result = Number(result)
  }
  if (isNaN(result) || typeof (result) !== 'number') {
    throw new Error('Parameter ' + optionname + ' should be a number')
  }
  return result
}

const parseOptionAsInt = function (options, optionname, defaultvalue) {
  var result = parseOption(options, optionname, defaultvalue)
  result = Number(Math.floor(result))
  if (isNaN(result)) {
    throw new Error('Parameter ' + optionname + ' should be a number')
  }
  return result
}

const parseOptionAsBool = function (options, optionname, defaultvalue) {
  var result = parseOption(options, optionname, defaultvalue)
  if (typeof (result) === 'string') {
    if (result === 'true') result = true
    else if (result === 'false') result = false
    else if (result === 0) result = false
  }
  result = !!result
  return result
}

module.exports = {
  parseOption,
  parseOptionAsInt,
  parseOptionAsFloat,
  parseOptionAsBool,
  parseOptionAs3DVector,
  parseOptionAs2DVector,
  parseOptionAs3DVectorList
}


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const Vector2D = __webpack_require__(3)
const {solve2Linear} = __webpack_require__(9)

/**  class Line2D
 * Represents a directional line in 2D space
 * A line is parametrized by its normal vector (perpendicular to the line, rotated 90 degrees counter clockwise)
 * and w. The line passes through the point <normal>.times(w).
 * Equation: p is on line if normal.dot(p)==w
 * @param {Vector2D} normal normal must be a unit vector!
 * @returns {Line2D}
*/
const Line2D = function (normal, w) {
  normal = new Vector2D(normal)
  w = parseFloat(w)
  let l = normal.length()
    // normalize:
  w *= l
  normal = normal.times(1.0 / l)
  this.normal = normal
  this.w = w
}

Line2D.fromPoints = function (p1, p2) {
  p1 = new Vector2D(p1)
  p2 = new Vector2D(p2)
  let direction = p2.minus(p1)
  let normal = direction.normal().negated().unit()
  let w = p1.dot(normal)
  return new Line2D(normal, w)
}

Line2D.prototype = {
    // same line but opposite direction:
  reverse: function () {
    return new Line2D(this.normal.negated(), -this.w)
  },

  equals: function (l) {
    return (l.normal.equals(this.normal) && (l.w === this.w))
  },

  origin: function () {
    return this.normal.times(this.w)
  },

  direction: function () {
    return this.normal.normal()
  },

  xAtY: function (y) {
        // (py == y) && (normal * p == w)
        // -> px = (w - normal._y * y) / normal.x
    let x = (this.w - this.normal._y * y) / this.normal.x
    return x
  },

  absDistanceToPoint: function (point) {
    point = new Vector2D(point)
    let pointProjected = point.dot(this.normal)
    let distance = Math.abs(pointProjected - this.w)
    return distance
  },
    /* FIXME: has error - origin is not defined, the method is never used
     closestPoint: function(point) {
         point = new Vector2D(point);
         let vector = point.dot(this.direction());
         return origin.plus(vector);
     },
     */

    // intersection between two lines, returns point as Vector2D
  intersectWithLine: function (line2d) {
    let point = solve2Linear(this.normal.x, this.normal.y, line2d.normal.x, line2d.normal.y, this.w, line2d.w)
    point = new Vector2D(point) // make  vector2d
    return point
  },

  transform: function (matrix4x4) {
    let origin = new Vector2D(0, 0)
    let pointOnPlane = this.normal.times(this.w)
    let neworigin = origin.multiply4x4(matrix4x4)
    let neworiginPlusNormal = this.normal.multiply4x4(matrix4x4)
    let newnormal = neworiginPlusNormal.minus(neworigin)
    let newpointOnPlane = pointOnPlane.multiply4x4(matrix4x4)
    let neww = newnormal.dot(newpointOnPlane)
    return new Line2D(newnormal, neww)
  }
}

module.exports = Line2D


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const CAG = __webpack_require__(10)
const Side = __webpack_require__(17)
const Vector2D = __webpack_require__(3)
const Vertex = __webpack_require__(16)
const Path2 = __webpack_require__(19)

/** Reconstruct a CAG from an object with identical property names.
 * @param {Object} obj - anonymous object, typically from JSON
 * @returns {CAG} new CAG object
 */
const fromObject = function (obj) {
  let sides = obj.sides.map(function (s) {
    return Side.fromObject(s)
  })
  let cag = CAG.fromSides(sides)
  cag.isCanonicalized = obj.isCanonicalized
  return cag
}

/** Construct a CAG from a list of points (a polygon).
 * Like fromPoints() but does not check if the result is a valid polygon.
 * The points MUST rotate counter clockwise.
 * The points can define a convex or a concave polygon.
 * The polygon must not self intersect.
 * @param {points[]} points - list of points in 2D space
 * @returns {CAG} new CAG object
 */
const fromPointsNoCheck = function (points) {
  let sides = []
  let prevpoint = new Vector2D(points[points.length - 1])
  let prevvertex = new Vertex(prevpoint)
  points.map(function (p) {
    let point = new Vector2D(p)
    let vertex = new Vertex(point)
    let side = new Side(prevvertex, vertex)
    sides.push(side)
    prevvertex = vertex
  })
  return CAG.fromSides(sides)
}

/** Construct a CAG from a 2d-path (a closed sequence of points).
 * Like fromPoints() but does not check if the result is a valid polygon.
 * @param {path} Path2 - a Path2 path
 * @returns {CAG} new CAG object
 */
const fromPath2 = function (path) {
  if (!path.isClosed()) throw new Error('The path should be closed!')
  return CAG.fromPoints(path.getPoints())
}


module.exports = {
  fromObject,
  fromPointsNoCheck,
  fromPath2
  //fromFakeCSG
}


/***/ }),
/* 23 */
/***/ (function(module, exports) {

// ////////////////////////////////////
// # Class Properties
// This class is used to store properties of a solid
// A property can for example be a Vertex, a Plane or a Line3D
// Whenever an affine transform is applied to the CSG solid, all its properties are
// transformed as well.
// The properties can be stored in a complex nested structure (using arrays and objects)
const Properties = function () {}

Properties.prototype = {
  _transform: function (matrix4x4) {
    let result = new Properties()
    Properties.transformObj(this, result, matrix4x4)
    return result
  },
  _merge: function (otherproperties) {
    let result = new Properties()
    Properties.cloneObj(this, result)
    Properties.addFrom(result, otherproperties)
    return result
  }
}

Properties.transformObj = function (source, result, matrix4x4) {
  for (let propertyname in source) {
    if (propertyname === '_transform') continue
    if (propertyname === '_merge') continue
    let propertyvalue = source[propertyname]
    let transformed = propertyvalue
    if (typeof (propertyvalue) === 'object') {
      if (('transform' in propertyvalue) && (typeof (propertyvalue.transform) === 'function')) {
        transformed = propertyvalue.transform(matrix4x4)
      } else if (propertyvalue instanceof Array) {
        transformed = []
        Properties.transformObj(propertyvalue, transformed, matrix4x4)
      } else if (propertyvalue instanceof Properties) {
        transformed = new Properties()
        Properties.transformObj(propertyvalue, transformed, matrix4x4)
      }
    }
    result[propertyname] = transformed
  }
}

Properties.cloneObj = function (source, result) {
  for (let propertyname in source) {
    if (propertyname === '_transform') continue
    if (propertyname === '_merge') continue
    let propertyvalue = source[propertyname]
    let cloned = propertyvalue
    if (typeof (propertyvalue) === 'object') {
      if (propertyvalue instanceof Array) {
        cloned = []
        for (let i = 0; i < propertyvalue.length; i++) {
          cloned.push(propertyvalue[i])
        }
      } else if (propertyvalue instanceof Properties) {
        cloned = new Properties()
        Properties.cloneObj(propertyvalue, cloned)
      }
    }
    result[propertyname] = cloned
  }
}

Properties.addFrom = function (result, otherproperties) {
  for (let propertyname in otherproperties) {
    if (propertyname === '_transform') continue
    if (propertyname === '_merge') continue
    if ((propertyname in result) &&
            (typeof (result[propertyname]) === 'object') &&
            (result[propertyname] instanceof Properties) &&
            (typeof (otherproperties[propertyname]) === 'object') &&
            (otherproperties[propertyname] instanceof Properties)) {
      Properties.addFrom(result[propertyname], otherproperties[propertyname])
    } else if (!(propertyname in result)) {
      result[propertyname] = otherproperties[propertyname]
    }
  }
}

module.exports = Properties


/***/ }),
/* 24 */
/***/ (function(module, exports) {

// //////////////////////////////
// ## class fuzzyFactory
// This class acts as a factory for objects. We can search for an object with approximately
// the desired properties (say a rectangle with width 2 and height 1)
// The lookupOrCreate() method looks for an existing object (for example it may find an existing rectangle
// with width 2.0001 and height 0.999. If no object is found, the user supplied callback is
// called, which should generate a new object. The new object is inserted into the database
// so it can be found by future lookupOrCreate() calls.
// Constructor:
//   numdimensions: the number of parameters for each object
//     for example for a 2D rectangle this would be 2
//   tolerance: The maximum difference for each parameter allowed to be considered a match
const FuzzyFactory = function (numdimensions, tolerance) {
  this.lookuptable = {}
  this.multiplier = 1.0 / tolerance
}

FuzzyFactory.prototype = {
    // let obj = f.lookupOrCreate([el1, el2, el3], function(elements) {/* create the new object */});
    // Performs a fuzzy lookup of the object with the specified elements.
    // If found, returns the existing object
    // If not found, calls the supplied callback function which should create a new object with
    // the specified properties. This object is inserted in the lookup database.
  lookupOrCreate: function (els, creatorCallback) {
    let hash = ''
    let multiplier = this.multiplier
    els.forEach(function (el) {
      let valueQuantized = Math.round(el * multiplier)
      hash += valueQuantized + '/'
    })
    if (hash in this.lookuptable) {
      return this.lookuptable[hash]
    } else {
      let object = creatorCallback(els)
      let hashparts = els.map(function (el) {
        let q0 = Math.floor(el * multiplier)
        let q1 = q0 + 1
        return ['' + q0 + '/', '' + q1 + '/']
      })
      let numelements = els.length
      let numhashes = 1 << numelements
      for (let hashmask = 0; hashmask < numhashes; ++hashmask) {
        let hashmaskShifted = hashmask
        hash = ''
        hashparts.forEach(function (hashpart) {
          hash += hashpart[hashmaskShifted & 1]
          hashmaskShifted >>= 1
        })
        this.lookuptable[hash] = object
      }
      return object
    }
  }
}

module.exports = FuzzyFactory


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

const CAG = __webpack_require__(10)

/*
2D polygons are now supported through the CAG class.
With many improvements (see documentation):
  - shapes do no longer have to be convex
  - union/intersect/subtract is supported
  - expand / contract are supported

But we'll keep CSG.Polygon2D as a stub for backwards compatibility
*/
function Polygon2D (points) {
  const cag = CAG.fromPoints(points)
  this.sides = cag.sides
}

Polygon2D.prototype = CAG.prototype

module.exports = Polygon2D


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const CSG = __webpack_require__(5)
const {parseOption, parseOptionAs3DVector, parseOptionAs2DVector, parseOptionAs3DVectorList, parseOptionAsFloat, parseOptionAsInt} = __webpack_require__(20)
const {defaultResolution3D, defaultResolution2D, EPS} = __webpack_require__(0)
const Vector3D = __webpack_require__(1)
const Vertex = __webpack_require__(8)
const Polygon = __webpack_require__(7)
const {Connector} = __webpack_require__(15)
const Properties = __webpack_require__(23)

/** Construct an axis-aligned solid cuboid.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.center=[0,0,0]] - center of cube
 * @param {Vector3D} [options.radius=[1,1,1]] - radius of cube, single scalar also possible
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cube = CSG.cube({
 *   center: [5, 5, 5],
 *   radius: 5, // scalar radius
 * });
 */
const cube = function (options) {
  let c
  let r
  let corner1
  let corner2
  options = options || {}
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('cube: should either give a radius and center parameter, or a corner1 and corner2 parameter')
    }
    corner1 = parseOptionAs3DVector(options, 'corner1', [0, 0, 0])
    corner2 = parseOptionAs3DVector(options, 'corner2', [1, 1, 1])
    c = corner1.plus(corner2).times(0.5)
    r = corner2.minus(corner1).times(0.5)
  } else {
    c = parseOptionAs3DVector(options, 'center', [0, 0, 0])
    r = parseOptionAs3DVector(options, 'radius', [1, 1, 1])
  }
  r = r.abs() // negative radii make no sense
  let result = CSG.fromPolygons([
    [
            [0, 4, 6, 2],
            [-1, 0, 0]
    ],
    [
            [1, 3, 7, 5],
            [+1, 0, 0]
    ],
    [
            [0, 1, 5, 4],
            [0, -1, 0]
    ],
    [
            [2, 6, 7, 3],
            [0, +1, 0]
    ],
    [
            [0, 2, 3, 1],
            [0, 0, -1]
    ],
    [
            [4, 5, 7, 6],
            [0, 0, +1]
    ]
  ].map(function (info) {
    let vertices = info[0].map(function (i) {
      let pos = new Vector3D(
                c.x + r.x * (2 * !!(i & 1) - 1), c.y + r.y * (2 * !!(i & 2) - 1), c.z + r.z * (2 * !!(i & 4) - 1))
      return new Vertex(pos)
    })
    return new Polygon(vertices, null /* , plane */)
  }))
  result.properties.cube = new Properties()
  result.properties.cube.center = new Vector3D(c)
    // add 6 connectors, at the centers of each face:
  result.properties.cube.facecenters = [
    new Connector(new Vector3D([r.x, 0, 0]).plus(c), [1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3D([-r.x, 0, 0]).plus(c), [-1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, r.y, 0]).plus(c), [0, 1, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, -r.y, 0]).plus(c), [0, -1, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, 0, r.z]).plus(c), [0, 0, 1], [1, 0, 0]),
    new Connector(new Vector3D([0, 0, -r.z]).plus(c), [0, 0, -1], [1, 0, 0])
  ]
  return result
}

/** Construct a solid sphere
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.center=[0,0,0]] - center of sphere
 * @param {Number} [options.radius=1] - radius of sphere
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @param {Array} [options.axes] -  an array with 3 vectors for the x, y and z base vectors
 * @returns {CSG} new 3D solid
 *
 *
 * @example
 * let sphere = CSG.sphere({
 *   center: [0, 0, 0],
 *   radius: 2,
 *   resolution: 32,
 * });
*/
const sphere = function (options) {
  options = options || {}
  let center = parseOptionAs3DVector(options, 'center', [0, 0, 0])
  let radius = parseOptionAsFloat(options, 'radius', 1)
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)
  let xvector, yvector, zvector
  if ('axes' in options) {
    xvector = options.axes[0].unit().times(radius)
    yvector = options.axes[1].unit().times(radius)
    zvector = options.axes[2].unit().times(radius)
  } else {
    xvector = new Vector3D([1, 0, 0]).times(radius)
    yvector = new Vector3D([0, -1, 0]).times(radius)
    zvector = new Vector3D([0, 0, 1]).times(radius)
  }
  if (resolution < 4) resolution = 4
  let qresolution = Math.round(resolution / 4)
  let prevcylinderpoint
  let polygons = []
  for (let slice1 = 0; slice1 <= resolution; slice1++) {
    let angle = Math.PI * 2.0 * slice1 / resolution
    let cylinderpoint = xvector.times(Math.cos(angle)).plus(yvector.times(Math.sin(angle)))
    if (slice1 > 0) {
            // cylinder vertices:
      let vertices = []
      let prevcospitch, prevsinpitch
      for (let slice2 = 0; slice2 <= qresolution; slice2++) {
        let pitch = 0.5 * Math.PI * slice2 / qresolution
        let cospitch = Math.cos(pitch)
        let sinpitch = Math.sin(pitch)
        if (slice2 > 0) {
          vertices = []
          vertices.push(new Vertex(center.plus(prevcylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
          vertices.push(new Vertex(center.plus(cylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
          if (slice2 < qresolution) {
            vertices.push(new Vertex(center.plus(cylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
          }
          vertices.push(new Vertex(center.plus(prevcylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
          polygons.push(new Polygon(vertices))
          vertices = []
          vertices.push(new Vertex(center.plus(prevcylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
          vertices.push(new Vertex(center.plus(cylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
          if (slice2 < qresolution) {
            vertices.push(new Vertex(center.plus(cylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
          }
          vertices.push(new Vertex(center.plus(prevcylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
          vertices.reverse()
          polygons.push(new Polygon(vertices))
        }
        prevcospitch = cospitch
        prevsinpitch = sinpitch
      }
    }
    prevcylinderpoint = cylinderpoint
  }
  let result = CSG.fromPolygons(polygons)
  result.properties.sphere = new Properties()
  result.properties.sphere.center = new Vector3D(center)
  result.properties.sphere.facepoint = center.plus(xvector)
  return result
}

/** Construct a solid cylinder.
 * @param {Object} [options] - options for construction
 * @param {Vector} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector} [options.end=[0,1,0]] - end point of cylinder
 * @param {Number} [options.radius=1] - radius of cylinder, must be scalar
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cylinder = CSG.cylinder({
 *   start: [0, -10, 0],
 *   end: [0, 10, 0],
 *   radius: 10,
 *   resolution: 16
 * });
 */
const cylinder = function (options) {
  let s = parseOptionAs3DVector(options, 'start', [0, -1, 0])
  let e = parseOptionAs3DVector(options, 'end', [0, 1, 0])
  let r = parseOptionAsFloat(options, 'radius', 1)
  let rEnd = parseOptionAsFloat(options, 'radiusEnd', r)
  let rStart = parseOptionAsFloat(options, 'radiusStart', r)
  let alpha = parseOptionAsFloat(options, 'sectorAngle', 360)
  alpha = alpha > 360 ? alpha % 360 : alpha

  if ((rEnd < 0) || (rStart < 0)) {
    throw new Error('Radius should be non-negative')
  }
  if ((rEnd === 0) && (rStart === 0)) {
    throw new Error('Either radiusStart or radiusEnd should be positive')
  }

  let slices = parseOptionAsInt(options, 'resolution', defaultResolution2D) // FIXME is this 3D?
  let ray = e.minus(s)
  let axisZ = ray.unit() //, isY = (Math.abs(axisZ.y) > 0.5);
  let axisX = axisZ.randomNonParallelVector().unit()

    //  let axisX = new Vector3D(isY, !isY, 0).cross(axisZ).unit();
  let axisY = axisX.cross(axisZ).unit()
  let start = new Vertex(s)
  let end = new Vertex(e)
  let polygons = []

  function point (stack, slice, radius) {
    let angle = slice * Math.PI * alpha / 180
    let out = axisX.times(Math.cos(angle)).plus(axisY.times(Math.sin(angle)))
    let pos = s.plus(ray.times(stack)).plus(out.times(radius))
    return new Vertex(pos)
  }
  if (alpha > 0) {
    for (let i = 0; i < slices; i++) {
      let t0 = i / slices
      let t1 = (i + 1) / slices
      if (rEnd === rStart) {
        polygons.push(new Polygon([start, point(0, t0, rEnd), point(0, t1, rEnd)]))
        polygons.push(new Polygon([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]))
        polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
      } else {
        if (rStart > 0) {
          polygons.push(new Polygon([start, point(0, t0, rStart), point(0, t1, rStart)]))
          polygons.push(new Polygon([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]))
        }
        if (rEnd > 0) {
          polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
          polygons.push(new Polygon([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]))
        }
      }
    }
    if (alpha < 360) {
      polygons.push(new Polygon([start, end, point(0, 0, rStart)]))
      polygons.push(new Polygon([point(0, 0, rStart), end, point(1, 0, rEnd)]))
      polygons.push(new Polygon([start, point(0, 1, rStart), end]))
      polygons.push(new Polygon([point(0, 1, rStart), point(1, 1, rEnd), end]))
    }
  }
  let result = CSG.fromPolygons(polygons)
  result.properties.cylinder = new Properties()
  result.properties.cylinder.start = new Connector(s, axisZ.negated(), axisX)
  result.properties.cylinder.end = new Connector(e, axisZ, axisX)
  let cylCenter = s.plus(ray.times(0.5))
  let fptVec = axisX.rotate(s, axisZ, -alpha / 2).times((rStart + rEnd) / 2)
  let fptVec90 = fptVec.cross(axisZ)
    // note this one is NOT a face normal for a cone. - It's horizontal from cyl perspective
  result.properties.cylinder.facepointH = new Connector(cylCenter.plus(fptVec), fptVec, axisZ)
  result.properties.cylinder.facepointH90 = new Connector(cylCenter.plus(fptVec90), fptVec90, axisZ)
  return result
}

/** Construct a cylinder with rounded ends.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector3D} [options.end=[0,1,0]] - end point of cylinder
 * @param {Number} [options.radius=1] - radius of rounded ends, must be scalar
 * @param {Vector3D} [options.normal] - vector determining the starting angle for tesselation. Should be non-parallel to start.minus(end)
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cylinder = CSG.roundedCylinder({
 *   start: [0, -10, 0],
 *   end: [0, 10, 0],
 *   radius: 2,
 *   resolution: 16
 * });
 */
const roundedCylinder = function (options) {
  let p1 = parseOptionAs3DVector(options, 'start', [0, -1, 0])
  let p2 = parseOptionAs3DVector(options, 'end', [0, 1, 0])
  let radius = parseOptionAsFloat(options, 'radius', 1)
  let direction = p2.minus(p1)
  let defaultnormal
  if (Math.abs(direction.x) > Math.abs(direction.y)) {
    defaultnormal = new Vector3D(0, 1, 0)
  } else {
    defaultnormal = new Vector3D(1, 0, 0)
  }
  let normal = parseOptionAs3DVector(options, 'normal', defaultnormal)
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)
  if (resolution < 4) resolution = 4
  let polygons = []
  let qresolution = Math.floor(0.25 * resolution)
  let length = direction.length()
  if (length < EPS) {
    return sphere({
      center: p1,
      radius: radius,
      resolution: resolution
    })
  }
  let zvector = direction.unit().times(radius)
  let xvector = zvector.cross(normal).unit().times(radius)
  let yvector = xvector.cross(zvector).unit().times(radius)
  let prevcylinderpoint
  for (let slice1 = 0; slice1 <= resolution; slice1++) {
    let angle = Math.PI * 2.0 * slice1 / resolution
    let cylinderpoint = xvector.times(Math.cos(angle)).plus(yvector.times(Math.sin(angle)))
    if (slice1 > 0) {
            // cylinder vertices:
      let vertices = []
      vertices.push(new Vertex(p1.plus(cylinderpoint)))
      vertices.push(new Vertex(p1.plus(prevcylinderpoint)))
      vertices.push(new Vertex(p2.plus(prevcylinderpoint)))
      vertices.push(new Vertex(p2.plus(cylinderpoint)))
      polygons.push(new Polygon(vertices))
      let prevcospitch, prevsinpitch
      for (let slice2 = 0; slice2 <= qresolution; slice2++) {
        let pitch = 0.5 * Math.PI * slice2 / qresolution
                // let pitch = Math.asin(slice2/qresolution);
        let cospitch = Math.cos(pitch)
        let sinpitch = Math.sin(pitch)
        if (slice2 > 0) {
          vertices = []
          vertices.push(new Vertex(p1.plus(prevcylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
          vertices.push(new Vertex(p1.plus(cylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
          if (slice2 < qresolution) {
            vertices.push(new Vertex(p1.plus(cylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
          }
          vertices.push(new Vertex(p1.plus(prevcylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
          polygons.push(new Polygon(vertices))
          vertices = []
          vertices.push(new Vertex(p2.plus(prevcylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
          vertices.push(new Vertex(p2.plus(cylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
          if (slice2 < qresolution) {
            vertices.push(new Vertex(p2.plus(cylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
          }
          vertices.push(new Vertex(p2.plus(prevcylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
          vertices.reverse()
          polygons.push(new Polygon(vertices))
        }
        prevcospitch = cospitch
        prevsinpitch = sinpitch
      }
    }
    prevcylinderpoint = cylinderpoint
  }
  let result = CSG.fromPolygons(polygons)
  let ray = zvector.unit()
  let axisX = xvector.unit()
  result.properties.roundedCylinder = new Properties()
  result.properties.roundedCylinder.start = new Connector(p1, ray.negated(), axisX)
  result.properties.roundedCylinder.end = new Connector(p2, ray, axisX)
  result.properties.roundedCylinder.facepoint = p1.plus(xvector)
  return result
}

/** Construct an elliptic cylinder.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector3D} [options.end=[0,1,0]] - end point of cylinder
 * @param {Vector2D} [options.radius=[1,1]] - radius of rounded ends, must be two dimensional array
 * @param {Vector2D} [options.radiusStart=[1,1]] - OPTIONAL radius of rounded start, must be two dimensional array
 * @param {Vector2D} [options.radiusEnd=[1,1]] - OPTIONAL radius of rounded end, must be two dimensional array
 * @param {Number} [options.resolution=defaultResolution2D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 *     let cylinder = CSG.cylinderElliptic({
 *       start: [0, -10, 0],
 *       end: [0, 10, 0],
 *       radiusStart: [10,5],
 *       radiusEnd: [8,3],
 *       resolution: 16
 *     });
 */

const cylinderElliptic = function (options) {
  let s = parseOptionAs3DVector(options, 'start', [0, -1, 0])
  let e = parseOptionAs3DVector(options, 'end', [0, 1, 0])
  let r = parseOptionAs2DVector(options, 'radius', [1, 1])
  let rEnd = parseOptionAs2DVector(options, 'radiusEnd', r)
  let rStart = parseOptionAs2DVector(options, 'radiusStart', r)

  if ((rEnd._x < 0) || (rStart._x < 0) || (rEnd._y < 0) || (rStart._y < 0)) {
    throw new Error('Radius should be non-negative')
  }
  if ((rEnd._x === 0 || rEnd._y === 0) && (rStart._x === 0 || rStart._y === 0)) {
    throw new Error('Either radiusStart or radiusEnd should be positive')
  }

  let slices = parseOptionAsInt(options, 'resolution', defaultResolution2D) // FIXME is this correct?
  let ray = e.minus(s)
  let axisZ = ray.unit() //, isY = (Math.abs(axisZ.y) > 0.5);
  let axisX = axisZ.randomNonParallelVector().unit()

    //  let axisX = new Vector3D(isY, !isY, 0).cross(axisZ).unit();
  let axisY = axisX.cross(axisZ).unit()
  let start = new Vertex(s)
  let end = new Vertex(e)
  let polygons = []

  function point (stack, slice, radius) {
    let angle = slice * Math.PI * 2
    let out = axisX.times(radius._x * Math.cos(angle)).plus(axisY.times(radius._y * Math.sin(angle)))
    let pos = s.plus(ray.times(stack)).plus(out)
    return new Vertex(pos)
  }
  for (let i = 0; i < slices; i++) {
    let t0 = i / slices
    let t1 = (i + 1) / slices

    if (rEnd._x === rStart._x && rEnd._y === rStart._y) {
      polygons.push(new Polygon([start, point(0, t0, rEnd), point(0, t1, rEnd)]))
      polygons.push(new Polygon([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]))
      polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
    } else {
      if (rStart._x > 0) {
        polygons.push(new Polygon([start, point(0, t0, rStart), point(0, t1, rStart)]))
        polygons.push(new Polygon([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]))
      }
      if (rEnd._x > 0) {
        polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
        polygons.push(new Polygon([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]))
      }
    }
  }
  let result = CSG.fromPolygons(polygons)
  result.properties.cylinder = new Properties()
  result.properties.cylinder.start = new Connector(s, axisZ.negated(), axisX)
  result.properties.cylinder.end = new Connector(e, axisZ, axisX)
  result.properties.cylinder.facepoint = s.plus(axisX.times(rStart))
  return result
}

/** Construct an axis-aligned solid rounded cuboid.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.center=[0,0,0]] - center of rounded cube
 * @param {Vector3D} [options.radius=[1,1,1]] - radius of rounded cube, single scalar is possible
 * @param {Number} [options.roundradius=0.2] - radius of rounded edges
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cube = CSG.roundedCube({
 *   center: [2, 0, 2],
 *   radius: 15,
 *   roundradius: 2,
 *   resolution: 36,
 * });
 */
const roundedCube = function (options) {
  let minRR = 1e-2 // minroundradius 1e-3 gives rounding errors already
  let center
  let cuberadius
  let corner1
  let corner2
  options = options || {}
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('roundedCube: should either give a radius and center parameter, or a corner1 and corner2 parameter')
    }
    corner1 = parseOptionAs3DVector(options, 'corner1', [0, 0, 0])
    corner2 = parseOptionAs3DVector(options, 'corner2', [1, 1, 1])
    center = corner1.plus(corner2).times(0.5)
    cuberadius = corner2.minus(corner1).times(0.5)
  } else {
    center = parseOptionAs3DVector(options, 'center', [0, 0, 0])
    cuberadius = parseOptionAs3DVector(options, 'radius', [1, 1, 1])
  }
  cuberadius = cuberadius.abs() // negative radii make no sense
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)
  if (resolution < 4) resolution = 4
  if (resolution % 2 === 1 && resolution < 8) resolution = 8 // avoid ugly
  let roundradius = parseOptionAs3DVector(options, 'roundradius', [0.2, 0.2, 0.2])
    // slight hack for now - total radius stays ok
  roundradius = Vector3D.Create(Math.max(roundradius.x, minRR), Math.max(roundradius.y, minRR), Math.max(roundradius.z, minRR))
  let innerradius = cuberadius.minus(roundradius)
  if (innerradius.x < 0 || innerradius.y < 0 || innerradius.z < 0) {
    throw new Error('roundradius <= radius!')
  }
  let res = sphere({radius: 1, resolution: resolution})
  res = res.scale(roundradius)
  innerradius.x > EPS && (res = res.stretchAtPlane([1, 0, 0], [0, 0, 0], 2 * innerradius.x))
  innerradius.y > EPS && (res = res.stretchAtPlane([0, 1, 0], [0, 0, 0], 2 * innerradius.y))
  innerradius.z > EPS && (res = res.stretchAtPlane([0, 0, 1], [0, 0, 0], 2 * innerradius.z))
  res = res.translate([-innerradius.x + center.x, -innerradius.y + center.y, -innerradius.z + center.z])
  res = res.reTesselated()
  res.properties.roundedCube = new Properties()
  res.properties.roundedCube.center = new Vertex(center)
  res.properties.roundedCube.facecenters = [
    new Connector(new Vector3D([cuberadius.x, 0, 0]).plus(center), [1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3D([-cuberadius.x, 0, 0]).plus(center), [-1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, cuberadius.y, 0]).plus(center), [0, 1, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, -cuberadius.y, 0]).plus(center), [0, -1, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, 0, cuberadius.z]).plus(center), [0, 0, 1], [1, 0, 0]),
    new Connector(new Vector3D([0, 0, -cuberadius.z]).plus(center), [0, 0, -1], [1, 0, 0])
  ]
  return res
}

/** Create a polyhedron using Openscad style arguments.
 * Define face vertices clockwise looking from outside.
 * @param {Object} [options] - options for construction
 * @returns {CSG} new 3D solid
 */
const polyhedron = function (options) {
  options = options || {}
  if (('points' in options) !== ('faces' in options)) {
    throw new Error("polyhedron needs 'points' and 'faces' arrays")
  }
  let vertices = parseOptionAs3DVectorList(options, 'points', [
            [1, 1, 0],
            [1, -1, 0],
            [-1, -1, 0],
            [-1, 1, 0],
            [0, 0, 1]
  ])
        .map(function (pt) {
          return new Vertex(pt)
        })
  let faces = parseOption(options, 'faces', [
            [0, 1, 4],
            [1, 2, 4],
            [2, 3, 4],
            [3, 0, 4],
            [1, 0, 3],
            [2, 1, 3]
  ])
    // Openscad convention defines inward normals - so we have to invert here
  faces.forEach(function (face) {
    face.reverse()
  })
  let polygons = faces.map(function (face) {
    return new Polygon(face.map(function (idx) {
      return vertices[idx]
    }))
  })

    // TODO: facecenters as connectors? probably overkill. Maybe centroid
    // the re-tesselation here happens because it's so easy for a user to
    // create parametrized polyhedrons that end up with 1-2 dimensional polygons.
    // These will create infinite loops at CSG.Tree()
  return CSG.fromPolygons(polygons).reTesselated()
}

module.exports = {
  cube,
  sphere,
  roundedCube,
  cylinder,
  roundedCylinder,
  cylinderElliptic,
  polyhedron
}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const { CAG } = __webpack_require__(12)

// -- 2D primitives (OpenSCAD like notion)

function square () {
  let v = [1, 1]
  let off
  let a = arguments
  let p = a[0]

  if (p && Number.isFinite(p)) v = [p, p]
  if (p && p.length) v = a[0], p = a[1]
  if (p && p.size && p.size.length) v = p.size

  off = [v[0] / 2, v[1] / 2]
  if (p && p.center === true) off = [0, 0]

  var o = CAG.rectangle({center: off, radius: [v[0] / 2, v[1] / 2]})

  return o
}

function circle () {
  let r = 1
  let off
  let fn = 32
  let a = arguments
  let p = a[0]
  if (p && p.r) r = p.r
  if (p && p.fn) fn = p.fn
  if (p && !p.r && !p.fn && !p.center) r = p
  off = [r, r]
  if (p && p.center === true) { off = [0, 0] }
  var o = CAG.circle({center: off, radius: r, resolution: fn})
  return o
}

function polygon (p) { // array of po(ints) and pa(ths)
  var points = [ ]
  if (p.paths && p.paths.length && p.paths[0].length) { // pa(th): [[0,1,2],[2,3,1]] (two paths)
    for (var j = 0; j < p.paths.length; j++) {
      for (var i = 0; i < p.paths[j].length; i++) {
        points[i] = p.points[p.paths[j][i]]
      }
    }
  } else if (p.paths && p.paths.length) { // pa(th): [0,1,2,3,4] (single path)
    for (var i = 0; i < p.paths.length; i++) {
      points[i] = p.points[p.paths[i]]
    }
  } else { // pa(th) = po(ints)
    if (p.length) {
      points = p
    } else {
      points = p.points
    }
  }
  return CAG.fromPoints(points)
}

function triangle () { // -- new addition
  var a = arguments
  if (a[0] && a[0].length) a = a[0]
  var o = CAG.fromPoints(a)
  return o
}

module.exports = {
  square,
  circle,
  polygon,
  triangle
}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const { CSG } = __webpack_require__(12)
// -- 2D to 3D primitives (OpenSCAD like notion)

function linear_extrude (p, s) {
  // console.log("linear_extrude() not yet implemented")
  // return
  let h = 1
  let off = 0
  let twist = 0
  let slices = 10
  /* convexity = 10, */

  if (p.height) h = p.height
  // if(p.convexity) convexity = p.convexity      // abandoned
  if (p.twist) twist = p.twist
  if (p.slices) slices = p.slices
  var o = s.extrude({offset: [0, 0, h], twistangle: twist, twiststeps: slices})
  if (p.center === true) {
    var b = [ ]
    b = o.getBounds() // b[0] = min, b[1] = max
    off = b[1].plus(b[0])
    off = off.times(-0.5)
    o = o.translate(off)
  }
  return o
}

function rotate_extrude (p, o) {
  var fn = 32
  if (arguments.length < 2) {
    o = p // no switches, just an object
  } else if (p !== undefined) {
    fn = p.fn
  }
  if (fn < 3) fn = 3
  var ps = []
  for (var i = 0; i < fn; i++) {
    // o.{x,y} -> rotate([0,0,i:0..360], obj->{o.x,0,o.y})
    for (var j = 0; j < o.sides.length; j++) {
      // has o.sides[j].vertex{0,1}.pos (only x,y)
      var p = []
      var m

      m = new CSG.Matrix4x4.rotationZ(i / fn * 360)
      p[0] = new CSG.Vector3D(o.sides[j].vertex0.pos.x, 0, o.sides[j].vertex0.pos.y)
      p[0] = m.rightMultiply1x3Vector(p[0])

      p[1] = new CSG.Vector3D(o.sides[j].vertex1.pos.x, 0, o.sides[j].vertex1.pos.y)
      p[1] = m.rightMultiply1x3Vector(p[1])

      m = new CSG.Matrix4x4.rotationZ((i + 1) / fn * 360)
      p[2] = new CSG.Vector3D(o.sides[j].vertex1.pos.x, 0, o.sides[j].vertex1.pos.y)
      p[2] = m.rightMultiply1x3Vector(p[2])

      p[3] = new CSG.Vector3D(o.sides[j].vertex0.pos.x, 0, o.sides[j].vertex0.pos.y)
      p[3] = m.rightMultiply1x3Vector(p[3])

      var p1 = new CSG.Polygon([
        new CSG.Vertex(p[0]),
        new CSG.Vertex(p[1]),
        new CSG.Vertex(p[2]),
        new CSG.Vertex(p[3]) // we make a square polygon (instead of 2 triangles)
      ])
      // var p2 = new CSG.Polygon([
      //   new CSG.Vertex(p[0]),
      //   new CSG.Vertex(p[2]),
      //   new CSG.Vertex(p[3]),
      // ])
      ps.push(p1)
    // ps.push(p2)
    // echo("i="+i,i/fn*360,"j="+j)
    }
  }
  return CSG.fromPolygons(ps)
}

function rectangular_extrude (pa, p) {
  let w = 1
  let h = 1
  let fn = 8
  let closed = false
  let round = true
  if (p) {
    if (p.w) w = p.w
    if (p.h) h = p.h
    if (p.fn) fn = p.fn
    if (p.closed !== undefined) closed = p.closed
    if (p.round !== undefined) round = p.round
  }
  return new CSG.Path2D(pa, closed).rectangularExtrude(w, h, fn, round)
}

module.exports = {
  linear_extrude,
  rotate_extrude,
  rectangular_extrude
}


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const { CAG } = __webpack_require__(12)

// -- 3D operations (OpenSCAD like notion)
// FIXME should this be lazy ? in which case, how do we deal with 2D/3D combined
// TODO we should have an option to set behaviour as first parameter
function union () {
  let options = {}
  const defaults = {
    extrude2d: false
  }
  var o, i = 0, a = arguments
  if (a[0].length) a = a[0]
  if ('extrude2d' in a[0]) { // first parameter is options
    options = Object.assign({}, defaults, a[0])
    o = a[i++]
  }

  o = a[i++]

  // TODO: add option to be able to set this?
  if ((typeof (a[i]) === 'object') && a[i] instanceof CAG && options.extrude2d) {
    o = a[i].extrude({offset: [0, 0, 0.1]}) // -- convert a 2D shape to a thin solid, note: do not a[i] = a[i].extrude()
  }
  for (; i < a.length; i++) {
    var obj = a[i]

    if ((typeof (a[i]) === 'object') && a[i] instanceof CAG && options.extrude2d) {
      obj = a[i].extrude({offset: [0, 0, 0.1]}) // -- convert a 2D shape to a thin solid:
    }
    o = o.union(obj)
  }
  return o
}

function difference () {
  var o, i = 0, a = arguments
  if (a[0].length) a = a[0]
  for (o = a[i++]; i < a.length; i++) {
    if (a[i] instanceof CAG) {
      o = o.subtract(a[i])
    } else {
      o = o.subtract(a[i].setColor(1, 1, 0)) // -- color the cuts
    }
  }
  return o
}

function intersection () {
  var o, i = 0, a = arguments
  if (a[0].length) a = a[0]
  for (o = a[i++]; i < a.length; i++) {
    if (a[i] instanceof CAG) {
      o = o.intersect(a[i])
    } else {
      o = o.intersect(a[i].setColor(1, 1, 0)) // -- color the cuts
    }
  }
  return o
}

module.exports = {
  union,
  difference,
  intersection
}


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var union = scadApi.booleanOps.union;


var Component = __webpack_require__(2);

var Union = function (_Component) {
  _inherits(Union, _Component);

  function Union() {
    _classCallCheck(this, Union);

    return _possibleConstructorReturn(this, (Union.__proto__ || Object.getPrototypeOf(Union)).apply(this, arguments));
  }

  _createClass(Union, [{
    key: 'applyCsg',
    value: function applyCsg(renderedChildren) {
      return union.apply(undefined, _toConsumableArray(renderedChildren));
    }
  }]);

  return Union;
}(Component);

module.exports = Union;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const Landau = __webpack_require__(14);
const { CableChainMount1 } = __webpack_require__(63);

const part = Landau.createElement({
  elementName: CableChainMount1,
  attributes: {},
  children: null
});

module.exports = part;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
 Evaluates all the render() functions of an recursively, creating a fully materialized component tree.
 */
var materializeTree = function materializeTree(element) {
  var clone = Object.assign({}, element);
  var inst = new clone.type(clone.props);
  clone.instance = inst;
  clone.rendered = inst.render();
  if (!Array.isArray(clone.rendered)) {
    if (clone.rendered) {
      clone.rendered = [clone.rendered];
    } else {
      clone.rendered = [];
    }
  }
  clone.rendered = clone.rendered.map(function (child) {
    return materializeTree(child);
  });
  return clone;
};

var renderAsTreeStringRecurse = function renderAsTreeStringRecurse(element) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var expanded = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var treeStr = '';
  [].concat(_toConsumableArray(Array(depth))).forEach(function (_, i) {
    treeStr = treeStr + '-';
  });
  treeStr = treeStr + element.type.name + '\n';

  if (expanded) {
    var renderedChildren = element.rendered;

    renderedChildren.forEach(function (child) {
      treeStr = treeStr + renderAsTreeStringRecurse(child, depth + 1, expanded);
    });
  } else if (element.props.children && element.props.children.length > 0) {
    element.props.children.forEach(function (child) {
      treeStr = treeStr + renderAsTreeStringRecurse(child, depth + 1, expanded);
    });
  }

  return treeStr;
};

/**
 Renders a simple tree view of the element and its rendered children as string.
 */
var renderAsTreeString = function renderAsTreeString(element) {
  var expanded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var materialized = materializeTree(element);
  var treeStr = renderAsTreeStringRecurse(materialized, 0, expanded);

  return treeStr;
};

var renderAsTreeRecurse = function renderAsTreeRecurse(element) {
  var elementName = element.type.name;
  var newElement = Object.assign({}, element);
  newElement.elementName = elementName;
  newElement.children = newElement.rendered.map(function (child) {
    return renderAsTreeRecurse(child);
  });
  delete newElement.instance;
  delete newElement.rendered;
  delete newElement.type;
  delete newElement['$$typeof'];

  return newElement;
};

/**
 Renders a object-tree view of the element and its rendered children.

 When `skipMateralize` is set to `true`, it is assumed that the provided `element` has already been materalized.
 */
var renderAsTree = function renderAsTree(element) {
  var skipMateralize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var materialized = element;
  if (!skipMateralize) {
    materialized = materializeTree(element);
  }
  var tree = renderAsTreeRecurse(materialized);
  return tree;
};

var renderAsCsgRecurse = function renderAsCsgRecurse(element) {
  var renderedChildren = element.rendered.map(function (child) {
    return renderAsCsgRecurse(child);
  });
  return element.instance.applyCsg(renderedChildren);
};

/**
 Renders the element as a CSG object.

 When `skipMateralize` is set to `true`, it is assumed that the provided `element` has already been materalized.
 */
var renderAsCsg = function renderAsCsg(element) {
  var skipMateralize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var materialized = element;
  if (!skipMateralize) {
    materialized = materializeTree(element);
  }
  var csg = renderAsCsgRecurse(materialized);

  return csg;
};

module.exports = {
  materializeTree: materializeTree,
  renderAsCsg: renderAsCsg,
  renderAsTree: renderAsTree,
  renderAsTreeString: renderAsTreeString
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LandauElement = function () {
  function LandauElement(type, props) {
    _classCallCheck(this, LandauElement);

    this['$$typeof'] = Symbol.for('landau.element');

    this.type = type;
    this.props = props;

    // TODO: owner (component that created the element)
  }

  _createClass(LandauElement, null, [{
    key: 'tree',
    value: function tree() {
      console.log('props', this.props);
      console.log('render', this.build());
      var children = (this.props || {}).children;
      if (children) {
        children = children.map(function (child) {
          return child.tree();
        });
      }
      var props = this.props;
      if (props) {
        delete props.children;
      }
      return {
        elementName: this.constructor.name,
        props: props,
        children: children
      };
    }
  }, {
    key: 'createElement',
    value: function createElement(type) {
      if (type.elementName) {
        return LandauElement.createElementPureJsx(type);
      } else {
        throw new Error("Error creating Element. This might be caused by using `babel-plugin-transform-react-jsx` instead of `babel-plugin-transform-jsx`.");
      }
    }
  }, {
    key: 'createElementPureJsx',
    value: function createElementPureJsx(element) {
      var type = element.elementName;
      var props = element.attributes;

      var children = element.children;
      if (children && children.length === 1 && Array.isArray(children[0])) {
        children = children[0];
      }
      props.children = props.children || children; // TODO: warn when both are present
      if (props.children) {
        // Filter out comments
        props.children = props.children.filter(function (x) {
          return x !== '';
        });
      }

      return new LandauElement(type, props);
    }
  }]);

  return LandauElement;
}();

module.exports = LandauElement;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var cube = scadApi.primitives3d.cube;


var Component = __webpack_require__(2);

var Cube = function (_Component) {
  _inherits(Cube, _Component);

  function Cube(props) {
    _classCallCheck(this, Cube);

    var _this = _possibleConstructorReturn(this, (Cube.__proto__ || Object.getPrototypeOf(Cube)).call(this, props));

    _this.props.size = _this.props.size || 1;
    _this.props.center = _this.props.center || false;
    return _this;
  }

  _createClass(Cube, [{
    key: 'applyCsg',
    value: function applyCsg() {
      return cube({ size: this.props.size, center: this.props.center });
    }
  }]);

  return Cube;
}(Component);

module.exports = Cube;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// -- 3D primitives (OpenSCAD like notion)
const { CSG } = __webpack_require__(12)
const { circle } = __webpack_require__(27)
const { rotate_extrude } = __webpack_require__(28)

function cube (p) {
  var s = 1, v = null, off = [0, 0, 0], round = false, r = 0, fn = 8
  if (p && p.length) v = p
  if (p && p.size && p.size.length) v = p.size // { size: [1,2,3] }
  if (p && p.size && !p.size.length) s = p.size // { size: 1 }
  // if(p&&!p.size&&!p.length&&p.center===undefined&&!p.round&&!p.radius) s = p      // (2)
  if (p && (typeof p !== 'object')) s = p// (2)
  if (p && p.round === true) { round = true, r = v && v.length ? (v[0] + v[1] + v[2]) / 30 : s / 10}
  if (p && p.radius) { round = true, r = p.radius }
  if (p && p.fn) fn = p.fn // applies in case of round: true

  var x = s, y = s, z = s
  if (v && v.length) {
    x = v[0], y = v[1], z = v[2]
  }
  off = [x / 2, y / 2, z / 2] // center: false default
  var o = round ?
    CSG.roundedCube({radius: [x / 2, y / 2, z / 2], roundradius: r, resolution: fn}) :
    CSG.cube({radius: [x / 2, y / 2, z / 2]})
  if (p && p.center && p.center.length) {
    off = [p.center[0] ? 0 : x / 2, p.center[1] ? 0 : y / 2, p.center[2] ? 0 : z / 2]
  } else if (p && p.center == true) {
    off = [0, 0, 0]
  } else if (p && p.center == false) {
    off = [x / 2, y / 2, z / 2]
  }
  if (off[0] || off[1] || off[2]) o = o.translate(off)
  // if(v&&v.length) o = o.scale(v)      // we don't scale afterwards, we already created box with the correct size
  return o
}

function sphere (p) {
  var r = 1
  var fn = 32
  var off = [0, 0, 0]
  var type = 'normal'

  // var zoff = 0 // sphere() in openscad has no center:true|false
  if (p && p.r) r = p.r
  if (p && p.fn) fn = p.fn
  if (p && p.type) type = p.type
  // if(p&&!p.r&&!p.fn&&!p.type) r = p
  if (p && (typeof p !== 'object')) r = p
  off = [0, 0, 0] // center: false (default)

  var o
  if (type === 'geodesic')
    o = geodesicSphere(p)
  else
    o = CSG.sphere({radius: r, resolution: fn})

  if (p && p.center && p.center.length) { // preparing individual x,y,z center
    off = [p.center[0] ? 0 : r, p.center[1] ? 0 : r, p.center[2] ? 0 : r]
  } else if (p && p.center === true) {
    off = [0, 0, 0]
  } else if (p && p.center === false) {
    off = [r, r, r]
  }
  if (off[0] || off[1] || off[2]) o = o.translate(off)
  return o
}

function geodesicSphere (p) {
  var r = 1, fn = 5

  var ci = [ // hard-coded data of icosahedron (20 faces, all triangles)
    [0.850651, 0.000000, -0.525731],
    [0.850651, -0.000000, 0.525731],
    [-0.850651, -0.000000, 0.525731],
    [-0.850651, 0.000000, -0.525731],
    [0.000000, -0.525731, 0.850651],
    [0.000000, 0.525731, 0.850651],
    [0.000000, 0.525731, -0.850651],
    [0.000000, -0.525731, -0.850651],
    [-0.525731, -0.850651, -0.000000],
    [0.525731, -0.850651, -0.000000],
    [0.525731, 0.850651, 0.000000],
    [-0.525731, 0.850651, 0.000000]]

  var ti = [ [0, 9, 1], [1, 10, 0], [6, 7, 0], [10, 6, 0], [7, 9, 0], [5, 1, 4], [4, 1, 9], [5, 10, 1], [2, 8, 3], [3, 11, 2], [2, 5, 4],
    [4, 8, 2], [2, 11, 5], [3, 7, 6], [6, 11, 3], [8, 7, 3], [9, 8, 4], [11, 10, 5], [10, 11, 6], [8, 9, 7]]

  var geodesicSubDivide = function (p, fn, off) {
    var p1 = p[0], p2 = p[1], p3 = p[2]
    var n = off
    var c = []
    var f = []

    //           p3
    //           /\
    //          /__\     fn = 3
    //      i  /\  /\
    //        /__\/__\       total triangles = 9 (fn*fn)
    //       /\  /\  /\
    //     0/__\/__\/__\
    //    p1 0   j      p2

    for (var i = 0; i < fn; i++) {
      for (var j = 0; j < fn - i; j++) {
        var t0 = i / fn
        var t1 = (i + 1) / fn
        var s0 = j / (fn - i)
        var s1 = (j + 1) / (fn - i)
        var s2 = fn - i - 1 ? j / (fn - i - 1) : 1
        var q = []

        q[0] = mix3(mix3(p1, p2, s0), p3, t0)
        q[1] = mix3(mix3(p1, p2, s1), p3, t0)
        q[2] = mix3(mix3(p1, p2, s2), p3, t1)

        // -- normalize
        for (var k = 0; k < 3; k++) {
          var r = Math.sqrt(q[k][0] * q[k][0] + q[k][1] * q[k][1] + q[k][2] * q[k][2])
          for (var l = 0; l < 3; l++) {
            q[k][l] /= r
          }
        }
        c.push(q[0], q[1], q[2])
        f.push([n, n + 1, n + 2]); n += 3

        if (j < fn - i - 1) {
          var s3 = fn - i - 1 ? (j + 1) / (fn - i - 1) : 1
          q[0] = mix3(mix3(p1, p2, s1), p3, t0)
          q[1] = mix3(mix3(p1, p2, s3), p3, t1)
          q[2] = mix3(mix3(p1, p2, s2), p3, t1)

          // -- normalize
          for (var k = 0; k < 3; k++) {
            var r = Math.sqrt(q[k][0] * q[k][0] + q[k][1] * q[k][1] + q[k][2] * q[k][2])
            for (var l = 0; l < 3; l++) {
              q[k][l] /= r
            }
          }
          c.push(q[0], q[1], q[2])
          f.push([n, n + 1, n + 2]); n += 3
        }
      }
    }
    return { points: c, triangles: f, off: n }
  }

  var mix3 = function (a, b, f) {
    var _f = 1 - f
    var c = []
    for (var i = 0; i < 3; i++) {
      c[i] = a[i] * _f + b[i] * f
    }
    return c
  }

  if (p) {
    if (p.fn) fn = Math.floor(p.fn / 6)
    if (p.r) r = p.r
  }

  if (fn <= 0) fn = 1

  var q = []
  var c = [], f = []
  var off = 0

  for (var i = 0; i < ti.length; i++) {
    var g = geodesicSubDivide([ ci[ti[i][0]], ci[ti[i][1]], ci[ti[i][2]]], fn, off)
    c = c.concat(g.points)
    f = f.concat(g.triangles)
    off = g.off
  }
  return polyhedron({points: c, triangles: f}).scale(r)
}

function cylinder (p) {
  var r1 = 1, r2 = 1, h = 1, fn = 32, round = false
  var a = arguments
  var off = [0, 0, 0]
  if (p && p.d) {
    r1 = r2 = p.d / 2
  }
  if (p && p.r) {
    r1 = p.r
    r2 = p.r
  }
  if (p && p.h) {
    h = p.h
  }
  if (p && (p.r1 || p.r2)) {
    r1 = p.r1
    r2 = p.r2
    if (p.h) h = p.h
  }
  if (p && (p.d1 || p.d2)) {
    r1 = p.d1 / 2
    r2 = p.d2 / 2
  }

  if (a && a[0] && a[0].length) {
    a = a[0]
    r1 = a[0]
    r2 = a[1]
    h = a[2]
    if (a.length === 4) fn = a[3]
  }
  if (p && p.fn) fn = p.fn
  // if(p&&p.center==true) zoff = -h/2
  if (p && p.round === true) round = true
  var o
  if (p && (p.start && p.end)) {
    o = round ?
      CSG.roundedCylinder({start: p.start, end: p.end, radiusStart: r1, radiusEnd: r2, resolution: fn}) :
      CSG.cylinder({start: p.start, end: p.end, radiusStart: r1, radiusEnd: r2, resolution: fn})
  } else {
    o = round ?
      CSG.roundedCylinder({start: [0, 0, 0], end: [0, 0, h], radiusStart: r1, radiusEnd: r2, resolution: fn}) :
      CSG.cylinder({start: [0, 0, 0], end: [0, 0, h], radiusStart: r1, radiusEnd: r2, resolution: fn})
    var r = r1 > r2 ? r1 : r2
    if (p && p.center && p.center.length) { // preparing individual x,y,z center
      off = [p.center[0] ? 0 : r, p.center[1] ? 0 : r, p.center[2] ? -h / 2 : 0]
    } else if (p && p.center === true) {
      off = [0, 0, -h / 2]
    } else if (p && p.center === false) {
      off = [0, 0, 0]
    }
    if (off[0] || off[1] || off[2]) o = o.translate(off)
  }
  return o
}

function torus (p) {
  var ri = 1, ro = 4, fni = 16, fno = 32, roti = 0
  if (p) {
    if (p.ri) ri = p.ri
    if (p.fni) fni = p.fni
    if (p.roti) roti = p.roti
    if (p.ro) ro = p.ro
    if (p.fno) fno = p.fno
  }
  if (fni < 3) fni = 3
  if (fno < 3) fno = 3
  var c = circle({r: ri, fn: fni, center: true})
  if (roti) c = c.rotateZ(roti)
  return rotate_extrude({fn: fno}, c.translate([ro, 0, 0]))
}

function polyhedron (p) {
  var pgs = []
  var ref = p.triangles || p.polygons
  var colors = p.colors || null

  for (var i = 0; i < ref.length; i++) {
    var pp = []
    for (var j = 0; j < ref[i].length; j++) {
      pp[j] = p.points[ref[i][j]]
    }

    var v = []
    for (j = ref[i].length - 1; j >= 0; j--) { // --- we reverse order for examples of OpenSCAD work
      v.push(new CSG.Vertex(new CSG.Vector3D(pp[j][0], pp[j][1], pp[j][2])))
    }
    var s = CSG.Polygon.defaultShared
    if (colors && colors[i]) {
      s = CSG.Polygon.Shared.fromColor(colors[i])
    }
    pgs.push(new CSG.Polygon(v, s))
  }
  var r = CSG.fromPolygons(pgs)
  return r
}

module.exports = {
  cube,
  sphere,
  geodesicSphere,
  cylinder,
  torus,
  polyhedron
}


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

const Matrix4x4 = __webpack_require__(11)
const Vector3D = __webpack_require__(1)
const Plane = __webpack_require__(6)

// Add several convenience methods to the classes that support a transform() method:
const addTransformationMethodsToPrototype = function (prot) {
  prot.mirrored = function (plane) {
    return this.transform(Matrix4x4.mirroring(plane))
  }

  prot.mirroredX = function () {
    let plane = new Plane(Vector3D.Create(1, 0, 0), 0)
    return this.mirrored(plane)
  }

  prot.mirroredY = function () {
    let plane = new Plane(Vector3D.Create(0, 1, 0), 0)
    return this.mirrored(plane)
  }

  prot.mirroredZ = function () {
    let plane = new Plane(Vector3D.Create(0, 0, 1), 0)
    return this.mirrored(plane)
  }

  prot.translate = function (v) {
    return this.transform(Matrix4x4.translation(v))
  }

  prot.scale = function (f) {
    return this.transform(Matrix4x4.scaling(f))
  }

  prot.rotateX = function (deg) {
    return this.transform(Matrix4x4.rotationX(deg))
  }

  prot.rotateY = function (deg) {
    return this.transform(Matrix4x4.rotationY(deg))
  }

  prot.rotateZ = function (deg) {
    return this.transform(Matrix4x4.rotationZ(deg))
  }

  prot.rotate = function (rotationCenter, rotationAxis, degrees) {
    return this.transform(Matrix4x4.rotation(rotationCenter, rotationAxis, degrees))
  }

  prot.rotateEulerAngles = function (alpha, beta, gamma, position) {
    position = position || [0, 0, 0]

    let Rz1 = Matrix4x4.rotationZ(alpha)
    let Rx = Matrix4x4.rotationX(beta)
    let Rz2 = Matrix4x4.rotationZ(gamma)
    let T = Matrix4x4.translation(new Vector3D(position))

    return this.transform(Rz2.multiply(Rx).multiply(Rz1).multiply(T))
  }
}

// TODO: consider generalization and adding to addTransformationMethodsToPrototype
const addCenteringToPrototype = function (prot, axes) {
  prot.center = function (cAxes) {
    cAxes = Array.prototype.map.call(arguments, function (a) {
      return a // .toLowerCase();
    })
        // no args: center on all axes
    if (!cAxes.length) {
      cAxes = axes.slice()
    }
    let b = this.getBounds()
    return this.translate(axes.map(function (a) {
      return cAxes.indexOf(a) > -1 ? -(b[0][a] + b[1][a]) / 2 : 0
    }))
  }
}
module.exports = {
  addTransformationMethodsToPrototype,
  addCenteringToPrototype
}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

const {EPS} = __webpack_require__(0)
const Polygon = __webpack_require__(7)
const FuzzyFactory = __webpack_require__(24)

// ////////////////////////////////////
const FuzzyCSGFactory = function () {
  this.vertexfactory = new FuzzyFactory(3, EPS)
  this.planefactory = new FuzzyFactory(4, EPS)
  this.polygonsharedfactory = {}
}

FuzzyCSGFactory.prototype = {
  getPolygonShared: function (sourceshared) {
    let hash = sourceshared.getHash()
    if (hash in this.polygonsharedfactory) {
      return this.polygonsharedfactory[hash]
    } else {
      this.polygonsharedfactory[hash] = sourceshared
      return sourceshared
    }
  },

  getVertex: function (sourcevertex) {
    let elements = [sourcevertex.pos._x, sourcevertex.pos._y, sourcevertex.pos._z]
    let result = this.vertexfactory.lookupOrCreate(elements, function (els) {
      return sourcevertex
    })
    return result
  },

  getPlane: function (sourceplane) {
    let elements = [sourceplane.normal._x, sourceplane.normal._y, sourceplane.normal._z, sourceplane.w]
    let result = this.planefactory.lookupOrCreate(elements, function (els) {
      return sourceplane
    })
    return result
  },

  getPolygon: function (sourcepolygon) {
    let newplane = this.getPlane(sourcepolygon.plane)
    let newshared = this.getPolygonShared(sourcepolygon.shared)
    let _this = this
    let newvertices = sourcepolygon.vertices.map(function (vertex) {
      return _this.getVertex(vertex)
    })
        // two vertices that were originally very close may now have become
        // truly identical (referring to the same Vertex object).
        // Remove duplicate vertices:
    let newverticesDedup = []
    if (newvertices.length > 0) {
      let prevvertextag = newvertices[newvertices.length - 1].getTag()
      newvertices.forEach(function (vertex) {
        let vertextag = vertex.getTag()
        if (vertextag !== prevvertextag) {
          newverticesDedup.push(vertex)
        }
        prevvertextag = vertextag
      })
    }
        // If it's degenerate, remove all vertices:
    if (newverticesDedup.length < 3) {
      newverticesDedup = []
    }
    return new Polygon(newverticesDedup, newshared, newplane)
  }
}

module.exports = FuzzyCSGFactory


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const {EPS} = __webpack_require__(0)
const {solve2Linear} = __webpack_require__(9)

// see if the line between p0start and p0end intersects with the line between p1start and p1end
// returns true if the lines strictly intersect, the end points are not counted!
const linesIntersect = function (p0start, p0end, p1start, p1end) {
  if (p0end.equals(p1start) || p1end.equals(p0start)) {
    let d = p1end.minus(p1start).unit().plus(p0end.minus(p0start).unit()).length()
    if (d < EPS) {
      return true
    }
  } else {
    let d0 = p0end.minus(p0start)
    let d1 = p1end.minus(p1start)
        // FIXME These epsilons need review and testing
    if (Math.abs(d0.cross(d1)) < 1e-9) return false // lines are parallel
    let alphas = solve2Linear(-d0.x, d1.x, -d0.y, d1.y, p0start.x - p1start.x, p0start.y - p1start.y)
    if ((alphas[0] > 1e-6) && (alphas[0] < 0.999999) && (alphas[1] > 1e-5) && (alphas[1] < 0.999999)) return true
        //    if( (alphas[0] >= 0) && (alphas[0] <= 1) && (alphas[1] >= 0) && (alphas[1] <= 1) ) return true;
  }
  return false
}


module.exports = {linesIntersect}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const FuzzyFactory = __webpack_require__(24)
const {EPS} = __webpack_require__(0)
const Side = __webpack_require__(17)

const FuzzyCAGFactory = function () {
  this.vertexfactory = new FuzzyFactory(2, EPS)
}

FuzzyCAGFactory.prototype = {
  getVertex: function (sourcevertex) {
    let elements = [sourcevertex.pos._x, sourcevertex.pos._y]
    let result = this.vertexfactory.lookupOrCreate(elements, function (els) {
      return sourcevertex
    })
    return result
  },

  getSide: function (sourceside) {
    let vertex0 = this.getVertex(sourceside.vertex0)
    let vertex1 = this.getVertex(sourceside.vertex1)
    return new Side(vertex0, vertex1)
  }
}

module.exports = FuzzyCAGFactory


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

const {_CSGDEBUG, EPS} = __webpack_require__(0)
const Vertex = __webpack_require__(8)
const Polygon = __webpack_require__(7)

// Returns object:
// .type:
//   0: coplanar-front
//   1: coplanar-back
//   2: front
//   3: back
//   4: spanning
// In case the polygon is spanning, returns:
// .front: a Polygon of the front part
// .back: a Polygon of the back part
function splitPolygonByPlane (plane, polygon) {
  let result = {
    type: null,
    front: null,
    back: null
  }
      // cache in local lets (speedup):
  let planenormal = plane.normal
  let vertices = polygon.vertices
  let numvertices = vertices.length
  if (polygon.plane.equals(plane)) {
    result.type = 0
  } else {
    let thisw = plane.w
    let hasfront = false
    let hasback = false
    let vertexIsBack = []
    let MINEPS = -EPS
    for (let i = 0; i < numvertices; i++) {
      let t = planenormal.dot(vertices[i].pos) - thisw
      let isback = (t < 0)
      vertexIsBack.push(isback)
      if (t > EPS) hasfront = true
      if (t < MINEPS) hasback = true
    }
    if ((!hasfront) && (!hasback)) {
              // all points coplanar
      let t = planenormal.dot(polygon.plane.normal)
      result.type = (t >= 0) ? 0 : 1
    } else if (!hasback) {
      result.type = 2
    } else if (!hasfront) {
      result.type = 3
    } else {
              // spanning
      result.type = 4
      let frontvertices = []
      let backvertices = []
      let isback = vertexIsBack[0]
      for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
        let vertex = vertices[vertexindex]
        let nextvertexindex = vertexindex + 1
        if (nextvertexindex >= numvertices) nextvertexindex = 0
        let nextisback = vertexIsBack[nextvertexindex]
        if (isback === nextisback) {
                      // line segment is on one side of the plane:
          if (isback) {
            backvertices.push(vertex)
          } else {
            frontvertices.push(vertex)
          }
        } else {
                      // line segment intersects plane:
          let point = vertex.pos
          let nextpoint = vertices[nextvertexindex].pos
          let intersectionpoint = plane.splitLineBetweenPoints(point, nextpoint)
          let intersectionvertex = new Vertex(intersectionpoint)
          if (isback) {
            backvertices.push(vertex)
            backvertices.push(intersectionvertex)
            frontvertices.push(intersectionvertex)
          } else {
            frontvertices.push(vertex)
            frontvertices.push(intersectionvertex)
            backvertices.push(intersectionvertex)
          }
        }
        isback = nextisback
      } // for vertexindex
              // remove duplicate vertices:
      let EPS_SQUARED = EPS * EPS
      if (backvertices.length >= 3) {
        let prevvertex = backvertices[backvertices.length - 1]
        for (let vertexindex = 0; vertexindex < backvertices.length; vertexindex++) {
          let vertex = backvertices[vertexindex]
          if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
            backvertices.splice(vertexindex, 1)
            vertexindex--
          }
          prevvertex = vertex
        }
      }
      if (frontvertices.length >= 3) {
        let prevvertex = frontvertices[frontvertices.length - 1]
        for (let vertexindex = 0; vertexindex < frontvertices.length; vertexindex++) {
          let vertex = frontvertices[vertexindex]
          if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
            frontvertices.splice(vertexindex, 1)
            vertexindex--
          }
          prevvertex = vertex
        }
      }
      if (frontvertices.length >= 3) {
        result.front = new Polygon(frontvertices, polygon.shared, polygon.plane)
      }
      if (backvertices.length >= 3) {
        result.back = new Polygon(backvertices, polygon.shared, polygon.plane)
      }
    }
  }
  return result
}

// # class PolygonTreeNode
// This class manages hierarchical splits of polygons
// At the top is a root node which doesn hold a polygon, only child PolygonTreeNodes
// Below that are zero or more 'top' nodes; each holds a polygon. The polygons can be in different planes
// splitByPlane() splits a node by a plane. If the plane intersects the polygon, two new child nodes
// are created holding the splitted polygon.
// getPolygons() retrieves the polygon from the tree. If for PolygonTreeNode the polygon is split but
// the two split parts (child nodes) are still intact, then the unsplit polygon is returned.
// This ensures that we can safely split a polygon into many fragments. If the fragments are untouched,
//  getPolygons() will return the original unsplit polygon instead of the fragments.
// remove() removes a polygon from the tree. Once a polygon is removed, the parent polygons are invalidated
// since they are no longer intact.
// constructor creates the root node:
const PolygonTreeNode = function () {
  this.parent = null
  this.children = []
  this.polygon = null
  this.removed = false
}

PolygonTreeNode.prototype = {
    // fill the tree with polygons. Should be called on the root node only; child nodes must
    // always be a derivate (split) of the parent node.
  addPolygons: function (polygons) {
    if (!this.isRootNode())
        // new polygons can only be added to root node; children can only be splitted polygons
          {
      throw new Error('Assertion failed')
    }
    let _this = this
    polygons.map(function (polygon) {
      _this.addChild(polygon)
    })
  },

    // remove a node
    // - the siblings become toplevel nodes
    // - the parent is removed recursively
  remove: function () {
    if (!this.removed) {
      this.removed = true

      if (_CSGDEBUG) {
        if (this.isRootNode()) throw new Error('Assertion failed') // can't remove root node
        if (this.children.length) throw new Error('Assertion failed') // we shouldn't remove nodes with children
      }

            // remove ourselves from the parent's children list:
      let parentschildren = this.parent.children
      let i = parentschildren.indexOf(this)
      if (i < 0) throw new Error('Assertion failed')
      parentschildren.splice(i, 1)

            // invalidate the parent's polygon, and of all parents above it:
      this.parent.recursivelyInvalidatePolygon()
    }
  },

  isRemoved: function () {
    return this.removed
  },

  isRootNode: function () {
    return !this.parent
  },

    // invert all polygons in the tree. Call on the root node
  invert: function () {
    if (!this.isRootNode()) throw new Error('Assertion failed') // can only call this on the root node
    this.invertSub()
  },

  getPolygon: function () {
    if (!this.polygon) throw new Error('Assertion failed') // doesn't have a polygon, which means that it has been broken down
    return this.polygon
  },

  getPolygons: function (result) {
    let children = [this]
    let queue = [children]
    let i, j, l, node
    for (i = 0; i < queue.length; ++i) { // queue size can change in loop, don't cache length
      children = queue[i]
      for (j = 0, l = children.length; j < l; j++) { // ok to cache length
        node = children[j]
        if (node.polygon) {
                    // the polygon hasn't been broken yet. We can ignore the children and return our polygon:
          result.push(node.polygon)
        } else {
                    // our polygon has been split up and broken, so gather all subpolygons from the children
          queue.push(node.children)
        }
      }
    }
  },

    // split the node by a plane; add the resulting nodes to the frontnodes and backnodes array
    // If the plane doesn't intersect the polygon, the 'this' object is added to one of the arrays
    // If the plane does intersect the polygon, two new child nodes are created for the front and back fragments,
    //  and added to both arrays.
  splitByPlane: function (plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
    if (this.children.length) {
      let queue = [this.children]
      let i
      let j
      let l
      let node
      let nodes
      for (i = 0; i < queue.length; i++) { // queue.length can increase, do not cache
        nodes = queue[i]
        for (j = 0, l = nodes.length; j < l; j++) { // ok to cache length
          node = nodes[j]
          if (node.children.length) {
            queue.push(node.children)
          } else {
                        // no children. Split the polygon:
            node._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes)
          }
        }
      }
    } else {
      this._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes)
    }
  },

    // only to be called for nodes with no children
  _splitByPlane: function (plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
    let polygon = this.polygon
    if (polygon) {
      let bound = polygon.boundingSphere()
      let sphereradius = bound[1] + EPS // FIXME Why add imprecision?
      let planenormal = plane.normal
      let spherecenter = bound[0]
      let d = planenormal.dot(spherecenter) - plane.w
      if (d > sphereradius) {
        frontnodes.push(this)
      } else if (d < -sphereradius) {
        backnodes.push(this)
      } else {
        let splitresult = splitPolygonByPlane(plane, polygon)
        switch (splitresult.type) {
          case 0:
                        // coplanar front:
            coplanarfrontnodes.push(this)
            break

          case 1:
                        // coplanar back:
            coplanarbacknodes.push(this)
            break

          case 2:
                        // front:
            frontnodes.push(this)
            break

          case 3:
                        // back:
            backnodes.push(this)
            break

          case 4:
                        // spanning:
            if (splitresult.front) {
              let frontnode = this.addChild(splitresult.front)
              frontnodes.push(frontnode)
            }
            if (splitresult.back) {
              let backnode = this.addChild(splitresult.back)
              backnodes.push(backnode)
            }
            break
        }
      }
    }
  },

    // PRIVATE methods from here:
    // add child to a node
    // this should be called whenever the polygon is split
    // a child should be created for every fragment of the split polygon
    // returns the newly created child
  addChild: function (polygon) {
    let newchild = new PolygonTreeNode()
    newchild.parent = this
    newchild.polygon = polygon
    this.children.push(newchild)
    return newchild
  },

  invertSub: function () {
    let children = [this]
    let queue = [children]
    let i, j, l, node
    for (i = 0; i < queue.length; i++) {
      children = queue[i]
      for (j = 0, l = children.length; j < l; j++) {
        node = children[j]
        if (node.polygon) {
          node.polygon = node.polygon.flipped()
        }
        queue.push(node.children)
      }
    }
  },

  recursivelyInvalidatePolygon: function () {
    let node = this
    while (node.polygon) {
      node.polygon = null
      if (node.parent) {
        node = node.parent
      }
    }
  }
}

// # class Tree
// This is the root of a BSP tree
// We are using this separate class for the root of the tree, to hold the PolygonTreeNode root
// The actual tree is kept in this.rootnode
const Tree = function (polygons) {
  this.polygonTree = new PolygonTreeNode()
  this.rootnode = new Node(null)
  if (polygons) this.addPolygons(polygons)
}

Tree.prototype = {
  invert: function () {
    this.polygonTree.invert()
    this.rootnode.invert()
  },

    // Remove all polygons in this BSP tree that are inside the other BSP tree
    // `tree`.
  clipTo: function (tree, alsoRemovecoplanarFront) {
    alsoRemovecoplanarFront = alsoRemovecoplanarFront ? true : false
    this.rootnode.clipTo(tree, alsoRemovecoplanarFront)
  },

  allPolygons: function () {
    let result = []
    this.polygonTree.getPolygons(result)
    return result
  },

  addPolygons: function (polygons) {
    let _this = this
    let polygontreenodes = polygons.map(function (p) {
      return _this.polygonTree.addChild(p)
    })
    this.rootnode.addPolygonTreeNodes(polygontreenodes)
  }
}

// # class Node
// Holds a node in a BSP tree. A BSP tree is built from a collection of polygons
// by picking a polygon to split along.
// Polygons are not stored directly in the tree, but in PolygonTreeNodes, stored in
// this.polygontreenodes. Those PolygonTreeNodes are children of the owning
// Tree.polygonTree
// This is not a leafy BSP tree since there is
// no distinction between internal and leaf nodes.
const Node = function (parent) {
  this.plane = null
  this.front = null
  this.back = null
  this.polygontreenodes = []
  this.parent = parent
}

Node.prototype = {
    // Convert solid space to empty space and empty space to solid space.
  invert: function () {
    let queue = [this]
    let node
    for (let i = 0; i < queue.length; i++) {
      node = queue[i]
      if (node.plane) node.plane = node.plane.flipped()
      if (node.front) queue.push(node.front)
      if (node.back) queue.push(node.back)
      let temp = node.front
      node.front = node.back
      node.back = temp
    }
  },

    // clip polygontreenodes to our plane
    // calls remove() for all clipped PolygonTreeNodes
  clipPolygons: function (polygontreenodes, alsoRemovecoplanarFront) {
    let args = {'node': this, 'polygontreenodes': polygontreenodes}
    let node
    let stack = []

    do {
      node = args.node
      polygontreenodes = args.polygontreenodes

            // begin "function"
      if (node.plane) {
        let backnodes = []
        let frontnodes = []
        let coplanarfrontnodes = alsoRemovecoplanarFront ? backnodes : frontnodes
        let plane = node.plane
        let numpolygontreenodes = polygontreenodes.length
        for (let i = 0; i < numpolygontreenodes; i++) {
          let node1 = polygontreenodes[i]
          if (!node1.isRemoved()) {
            node1.splitByPlane(plane, coplanarfrontnodes, backnodes, frontnodes, backnodes)
          }
        }

        if (node.front && (frontnodes.length > 0)) {
          stack.push({'node': node.front, 'polygontreenodes': frontnodes})
        }
        let numbacknodes = backnodes.length
        if (node.back && (numbacknodes > 0)) {
          stack.push({'node': node.back, 'polygontreenodes': backnodes})
        } else {
                    // there's nothing behind this plane. Delete the nodes behind this plane:
          for (let i = 0; i < numbacknodes; i++) {
            backnodes[i].remove()
          }
        }
      }
      args = stack.pop()
    } while (typeof (args) !== 'undefined')
  },

    // Remove all polygons in this BSP tree that are inside the other BSP tree
    // `tree`.
  clipTo: function (tree, alsoRemovecoplanarFront) {
    let node = this
    let stack = []
    do {
      if (node.polygontreenodes.length > 0) {
        tree.rootnode.clipPolygons(node.polygontreenodes, alsoRemovecoplanarFront)
      }
      if (node.front) stack.push(node.front)
      if (node.back) stack.push(node.back)
      node = stack.pop()
    } while (typeof (node) !== 'undefined')
  },

  addPolygonTreeNodes: function (polygontreenodes) {
    let args = {'node': this, 'polygontreenodes': polygontreenodes}
    let node
    let stack = []
    do {
      node = args.node
      polygontreenodes = args.polygontreenodes

      if (polygontreenodes.length === 0) {
        args = stack.pop()
        continue
      }
      let _this = node
      if (!node.plane) {
        let bestplane = polygontreenodes[0].getPolygon().plane
        node.plane = bestplane
      }
      let frontnodes = []
      let backnodes = []

      for (let i = 0, n = polygontreenodes.length; i < n; ++i) {
        polygontreenodes[i].splitByPlane(_this.plane, _this.polygontreenodes, backnodes, frontnodes, backnodes)
      }

      if (frontnodes.length > 0) {
        if (!node.front) node.front = new Node(node)
        stack.push({'node': node.front, 'polygontreenodes': frontnodes})
      }
      if (backnodes.length > 0) {
        if (!node.back) node.back = new Node(node)
        stack.push({'node': node.back, 'polygontreenodes': backnodes})
      }

      args = stack.pop()
    } while (typeof (args) !== 'undefined')
  },

  getParentPlaneNormals: function (normals, maxdepth) {
    if (maxdepth > 0) {
      if (this.parent) {
        normals.push(this.parent.plane.normal)
        this.parent.getParentPlaneNormals(normals, maxdepth - 1)
      }
    }
  }
}

module.exports = Tree


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

const {EPS} = __webpack_require__(0)
const OrthoNormalBasis = __webpack_require__(13)
const {interpolateBetween2DPointsForY, insertSorted, fnNumberSort} = __webpack_require__(9)
const Vertex = __webpack_require__(8)
const Vector2D = __webpack_require__(3)
const Line2D = __webpack_require__(21)
const Polygon = __webpack_require__(7)

// Retesselation function for a set of coplanar polygons. See the introduction at the top of
// this file.
const reTesselateCoplanarPolygons = function (sourcepolygons, destpolygons) {
  let numpolygons = sourcepolygons.length
  if (numpolygons > 0) {
    let plane = sourcepolygons[0].plane
    let shared = sourcepolygons[0].shared
    let orthobasis = new OrthoNormalBasis(plane)
    let polygonvertices2d = [] // array of array of Vector2D
    let polygontopvertexindexes = [] // array of indexes of topmost vertex per polygon
    let topy2polygonindexes = {}
    let ycoordinatetopolygonindexes = {}

    let xcoordinatebins = {}
    let ycoordinatebins = {}

        // convert all polygon vertices to 2D
        // Make a list of all encountered y coordinates
        // And build a map of all polygons that have a vertex at a certain y coordinate:
    let ycoordinateBinningFactor = 1.0 / EPS * 10
    for (let polygonindex = 0; polygonindex < numpolygons; polygonindex++) {
      let poly3d = sourcepolygons[polygonindex]
      let vertices2d = []
      let numvertices = poly3d.vertices.length
      let minindex = -1
      if (numvertices > 0) {
        let miny, maxy, maxindex
        for (let i = 0; i < numvertices; i++) {
          let pos2d = orthobasis.to2D(poly3d.vertices[i].pos)
                    // perform binning of y coordinates: If we have multiple vertices very
                    // close to each other, give them the same y coordinate:
          let ycoordinatebin = Math.floor(pos2d.y * ycoordinateBinningFactor)
          let newy
          if (ycoordinatebin in ycoordinatebins) {
            newy = ycoordinatebins[ycoordinatebin]
          } else if (ycoordinatebin + 1 in ycoordinatebins) {
            newy = ycoordinatebins[ycoordinatebin + 1]
          } else if (ycoordinatebin - 1 in ycoordinatebins) {
            newy = ycoordinatebins[ycoordinatebin - 1]
          } else {
            newy = pos2d.y
            ycoordinatebins[ycoordinatebin] = pos2d.y
          }
          pos2d = Vector2D.Create(pos2d.x, newy)
          vertices2d.push(pos2d)
          let y = pos2d.y
          if ((i === 0) || (y < miny)) {
            miny = y
            minindex = i
          }
          if ((i === 0) || (y > maxy)) {
            maxy = y
            maxindex = i
          }
          if (!(y in ycoordinatetopolygonindexes)) {
            ycoordinatetopolygonindexes[y] = {}
          }
          ycoordinatetopolygonindexes[y][polygonindex] = true
        }
        if (miny >= maxy) {
                    // degenerate polygon, all vertices have same y coordinate. Just ignore it from now:
          vertices2d = []
          numvertices = 0
          minindex = -1
        } else {
          if (!(miny in topy2polygonindexes)) {
            topy2polygonindexes[miny] = []
          }
          topy2polygonindexes[miny].push(polygonindex)
        }
      } // if(numvertices > 0)
            // reverse the vertex order:
      vertices2d.reverse()
      minindex = numvertices - minindex - 1
      polygonvertices2d.push(vertices2d)
      polygontopvertexindexes.push(minindex)
    }
    let ycoordinates = []
    for (let ycoordinate in ycoordinatetopolygonindexes) ycoordinates.push(ycoordinate)
    ycoordinates.sort(fnNumberSort)

        // Now we will iterate over all y coordinates, from lowest to highest y coordinate
        // activepolygons: source polygons that are 'active', i.e. intersect with our y coordinate
        //   Is sorted so the polygons are in left to right order
        // Each element in activepolygons has these properties:
        //        polygonindex: the index of the source polygon (i.e. an index into the sourcepolygons
        //                      and polygonvertices2d arrays)
        //        leftvertexindex: the index of the vertex at the left side of the polygon (lowest x)
        //                         that is at or just above the current y coordinate
        //        rightvertexindex: dito at right hand side of polygon
        //        topleft, bottomleft: coordinates of the left side of the polygon crossing the current y coordinate
        //        topright, bottomright: coordinates of the right hand side of the polygon crossing the current y coordinate
    let activepolygons = []
    let prevoutpolygonrow = []
    for (let yindex = 0; yindex < ycoordinates.length; yindex++) {
      let newoutpolygonrow = []
      let ycoordinate_as_string = ycoordinates[yindex]
      let ycoordinate = Number(ycoordinate_as_string)

            // update activepolygons for this y coordinate:
            // - Remove any polygons that end at this y coordinate
            // - update leftvertexindex and rightvertexindex (which point to the current vertex index
            //   at the the left and right side of the polygon
            // Iterate over all polygons that have a corner at this y coordinate:
      let polygonindexeswithcorner = ycoordinatetopolygonindexes[ycoordinate_as_string]
      for (let activepolygonindex = 0; activepolygonindex < activepolygons.length; ++activepolygonindex) {
        let activepolygon = activepolygons[activepolygonindex]
        let polygonindex = activepolygon.polygonindex
        if (polygonindexeswithcorner[polygonindex]) {
                    // this active polygon has a corner at this y coordinate:
          let vertices2d = polygonvertices2d[polygonindex]
          let numvertices = vertices2d.length
          let newleftvertexindex = activepolygon.leftvertexindex
          let newrightvertexindex = activepolygon.rightvertexindex
                    // See if we need to increase leftvertexindex or decrease rightvertexindex:
          while (true) {
            let nextleftvertexindex = newleftvertexindex + 1
            if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0
            if (vertices2d[nextleftvertexindex].y !== ycoordinate) break
            newleftvertexindex = nextleftvertexindex
          }
          let nextrightvertexindex = newrightvertexindex - 1
          if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1
          if (vertices2d[nextrightvertexindex].y === ycoordinate) {
            newrightvertexindex = nextrightvertexindex
          }
          if ((newleftvertexindex !== activepolygon.leftvertexindex) && (newleftvertexindex === newrightvertexindex)) {
                        // We have increased leftvertexindex or decreased rightvertexindex, and now they point to the same vertex
                        // This means that this is the bottom point of the polygon. We'll remove it:
            activepolygons.splice(activepolygonindex, 1)
            --activepolygonindex
          } else {
            activepolygon.leftvertexindex = newleftvertexindex
            activepolygon.rightvertexindex = newrightvertexindex
            activepolygon.topleft = vertices2d[newleftvertexindex]
            activepolygon.topright = vertices2d[newrightvertexindex]
            let nextleftvertexindex = newleftvertexindex + 1
            if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0
            activepolygon.bottomleft = vertices2d[nextleftvertexindex]
            let nextrightvertexindex = newrightvertexindex - 1
            if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1
            activepolygon.bottomright = vertices2d[nextrightvertexindex]
          }
        } // if polygon has corner here
      } // for activepolygonindex
      let nextycoordinate
      if (yindex >= ycoordinates.length - 1) {
                // last row, all polygons must be finished here:
        activepolygons = []
        nextycoordinate = null
      } else // yindex < ycoordinates.length-1
            {
        nextycoordinate = Number(ycoordinates[yindex + 1])
        let middleycoordinate = 0.5 * (ycoordinate + nextycoordinate)
                // update activepolygons by adding any polygons that start here:
        let startingpolygonindexes = topy2polygonindexes[ycoordinate_as_string]
        for (let polygonindex_key in startingpolygonindexes) {
          let polygonindex = startingpolygonindexes[polygonindex_key]
          let vertices2d = polygonvertices2d[polygonindex]
          let numvertices = vertices2d.length
          let topvertexindex = polygontopvertexindexes[polygonindex]
                    // the top of the polygon may be a horizontal line. In that case topvertexindex can point to any point on this line.
                    // Find the left and right topmost vertices which have the current y coordinate:
          let topleftvertexindex = topvertexindex
          while (true) {
            let i = topleftvertexindex + 1
            if (i >= numvertices) i = 0
            if (vertices2d[i].y !== ycoordinate) break
            if (i === topvertexindex) break // should not happen, but just to prevent endless loops
            topleftvertexindex = i
          }
          let toprightvertexindex = topvertexindex
          while (true) {
            let i = toprightvertexindex - 1
            if (i < 0) i = numvertices - 1
            if (vertices2d[i].y !== ycoordinate) break
            if (i === topleftvertexindex) break // should not happen, but just to prevent endless loops
            toprightvertexindex = i
          }
          let nextleftvertexindex = topleftvertexindex + 1
          if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0
          let nextrightvertexindex = toprightvertexindex - 1
          if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1
          let newactivepolygon = {
            polygonindex: polygonindex,
            leftvertexindex: topleftvertexindex,
            rightvertexindex: toprightvertexindex,
            topleft: vertices2d[topleftvertexindex],
            topright: vertices2d[toprightvertexindex],
            bottomleft: vertices2d[nextleftvertexindex],
            bottomright: vertices2d[nextrightvertexindex]
          }
          insertSorted(activepolygons, newactivepolygon, function (el1, el2) {
            let x1 = interpolateBetween2DPointsForY(
                            el1.topleft, el1.bottomleft, middleycoordinate)
            let x2 = interpolateBetween2DPointsForY(
                            el2.topleft, el2.bottomleft, middleycoordinate)
            if (x1 > x2) return 1
            if (x1 < x2) return -1
            return 0
          })
        } // for(let polygonindex in startingpolygonindexes)
      } //  yindex < ycoordinates.length-1
            // if( (yindex === ycoordinates.length-1) || (nextycoordinate - ycoordinate > EPS) )
      if (true) {
                // Now activepolygons is up to date
                // Build the output polygons for the next row in newoutpolygonrow:
        for (let activepolygonKey in activepolygons) {
          let activepolygon = activepolygons[activepolygonKey]
          let polygonindex = activepolygon.polygonindex
          let vertices2d = polygonvertices2d[polygonindex]
          let numvertices = vertices2d.length

          let x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, ycoordinate)
          let topleft = Vector2D.Create(x, ycoordinate)
          x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, ycoordinate)
          let topright = Vector2D.Create(x, ycoordinate)
          x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, nextycoordinate)
          let bottomleft = Vector2D.Create(x, nextycoordinate)
          x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, nextycoordinate)
          let bottomright = Vector2D.Create(x, nextycoordinate)
          let outpolygon = {
            topleft: topleft,
            topright: topright,
            bottomleft: bottomleft,
            bottomright: bottomright,
            leftline: Line2D.fromPoints(topleft, bottomleft),
            rightline: Line2D.fromPoints(bottomright, topright)
          }
          if (newoutpolygonrow.length > 0) {
            let prevoutpolygon = newoutpolygonrow[newoutpolygonrow.length - 1]
            let d1 = outpolygon.topleft.distanceTo(prevoutpolygon.topright)
            let d2 = outpolygon.bottomleft.distanceTo(prevoutpolygon.bottomright)
            if ((d1 < EPS) && (d2 < EPS)) {
                            // we can join this polygon with the one to the left:
              outpolygon.topleft = prevoutpolygon.topleft
              outpolygon.leftline = prevoutpolygon.leftline
              outpolygon.bottomleft = prevoutpolygon.bottomleft
              newoutpolygonrow.splice(newoutpolygonrow.length - 1, 1)
            }
          }
          newoutpolygonrow.push(outpolygon)
        } // for(activepolygon in activepolygons)
        if (yindex > 0) {
                    // try to match the new polygons against the previous row:
          let prevcontinuedindexes = {}
          let matchedindexes = {}
          for (let i = 0; i < newoutpolygonrow.length; i++) {
            let thispolygon = newoutpolygonrow[i]
            for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
              if (!matchedindexes[ii]) // not already processed?
                            {
                                // We have a match if the sidelines are equal or if the top coordinates
                                // are on the sidelines of the previous polygon
                let prevpolygon = prevoutpolygonrow[ii]
                if (prevpolygon.bottomleft.distanceTo(thispolygon.topleft) < EPS) {
                  if (prevpolygon.bottomright.distanceTo(thispolygon.topright) < EPS) {
                                        // Yes, the top of this polygon matches the bottom of the previous:
                    matchedindexes[ii] = true
                                        // Now check if the joined polygon would remain convex:
                    let d1 = thispolygon.leftline.direction().x - prevpolygon.leftline.direction().x
                    let d2 = thispolygon.rightline.direction().x - prevpolygon.rightline.direction().x
                    let leftlinecontinues = Math.abs(d1) < EPS
                    let rightlinecontinues = Math.abs(d2) < EPS
                    let leftlineisconvex = leftlinecontinues || (d1 >= 0)
                    let rightlineisconvex = rightlinecontinues || (d2 >= 0)
                    if (leftlineisconvex && rightlineisconvex) {
                                            // yes, both sides have convex corners:
                                            // This polygon will continue the previous polygon
                      thispolygon.outpolygon = prevpolygon.outpolygon
                      thispolygon.leftlinecontinues = leftlinecontinues
                      thispolygon.rightlinecontinues = rightlinecontinues
                      prevcontinuedindexes[ii] = true
                    }
                    break
                  }
                }
              } // if(!prevcontinuedindexes[ii])
            } // for ii
          } // for i
          for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
            if (!prevcontinuedindexes[ii]) {
                            // polygon ends here
                            // Finish the polygon with the last point(s):
              let prevpolygon = prevoutpolygonrow[ii]
              prevpolygon.outpolygon.rightpoints.push(prevpolygon.bottomright)
              if (prevpolygon.bottomright.distanceTo(prevpolygon.bottomleft) > EPS) {
                                // polygon ends with a horizontal line:
                prevpolygon.outpolygon.leftpoints.push(prevpolygon.bottomleft)
              }
                            // reverse the left half so we get a counterclockwise circle:
              prevpolygon.outpolygon.leftpoints.reverse()
              let points2d = prevpolygon.outpolygon.rightpoints.concat(prevpolygon.outpolygon.leftpoints)
              let vertices3d = []
              points2d.map(function (point2d) {
                let point3d = orthobasis.to3D(point2d)
                let vertex3d = new Vertex(point3d)
                vertices3d.push(vertex3d)
              })
              let polygon = new Polygon(vertices3d, shared, plane)
              destpolygons.push(polygon)
            }
          }
        } // if(yindex > 0)
        for (let i = 0; i < newoutpolygonrow.length; i++) {
          let thispolygon = newoutpolygonrow[i]
          if (!thispolygon.outpolygon) {
                        // polygon starts here:
            thispolygon.outpolygon = {
              leftpoints: [],
              rightpoints: []
            }
            thispolygon.outpolygon.leftpoints.push(thispolygon.topleft)
            if (thispolygon.topleft.distanceTo(thispolygon.topright) > EPS) {
                            // we have a horizontal line at the top:
              thispolygon.outpolygon.rightpoints.push(thispolygon.topright)
            }
          } else {
                        // continuation of a previous row
            if (!thispolygon.leftlinecontinues) {
              thispolygon.outpolygon.leftpoints.push(thispolygon.topleft)
            }
            if (!thispolygon.rightlinecontinues) {
              thispolygon.outpolygon.rightpoints.push(thispolygon.topright)
            }
          }
        }
        prevoutpolygonrow = newoutpolygonrow
      }
    } // for yindex
  } // if(numpolygons > 0)
}

module.exports = {reTesselateCoplanarPolygons}


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

const {EPS} = __webpack_require__(0)
const Polygon = __webpack_require__(7)
const Plane = __webpack_require__(6)

function addSide (sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) {
  let starttag = vertex0.getTag()
  let endtag = vertex1.getTag()
  if (starttag === endtag) throw new Error('Assertion failed')
  let newsidetag = starttag + '/' + endtag
  let reversesidetag = endtag + '/' + starttag
  if (reversesidetag in sidemap) {
    // we have a matching reverse oriented side.
    // Instead of adding the new side, cancel out the reverse side:
    // console.log("addSide("+newsidetag+") has reverse side:");
    deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, vertex1, vertex0, null)
    return null
  }
  //  console.log("addSide("+newsidetag+")");
  let newsideobj = {
    vertex0: vertex0,
    vertex1: vertex1,
    polygonindex: polygonindex
  }
  if (!(newsidetag in sidemap)) {
    sidemap[newsidetag] = [newsideobj]
  } else {
    sidemap[newsidetag].push(newsideobj)
  }
  if (starttag in vertextag2sidestart) {
    vertextag2sidestart[starttag].push(newsidetag)
  } else {
    vertextag2sidestart[starttag] = [newsidetag]
  }
  if (endtag in vertextag2sideend) {
    vertextag2sideend[endtag].push(newsidetag)
  } else {
    vertextag2sideend[endtag] = [newsidetag]
  }
  return newsidetag
}

function deleteSide (sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) {
  let starttag = vertex0.getTag()
  let endtag = vertex1.getTag()
  let sidetag = starttag + '/' + endtag
  // console.log("deleteSide("+sidetag+")");
  if (!(sidetag in sidemap)) throw new Error('Assertion failed')
  let idx = -1
  let sideobjs = sidemap[sidetag]
  for (let i = 0; i < sideobjs.length; i++) {
    let sideobj = sideobjs[i]
    if (sideobj.vertex0 !== vertex0) continue
    if (sideobj.vertex1 !== vertex1) continue
    if (polygonindex !== null) {
      if (sideobj.polygonindex !== polygonindex) continue
    }
    idx = i
    break
  }
  if (idx < 0) throw new Error('Assertion failed')
  sideobjs.splice(idx, 1)
  if (sideobjs.length === 0) {
    delete sidemap[sidetag]
  }
  idx = vertextag2sidestart[starttag].indexOf(sidetag)
  if (idx < 0) throw new Error('Assertion failed')
  vertextag2sidestart[starttag].splice(idx, 1)
  if (vertextag2sidestart[starttag].length === 0) {
    delete vertextag2sidestart[starttag]
  }

  idx = vertextag2sideend[endtag].indexOf(sidetag)
  if (idx < 0) throw new Error('Assertion failed')
  vertextag2sideend[endtag].splice(idx, 1)
  if (vertextag2sideend[endtag].length === 0) {
    delete vertextag2sideend[endtag]
  }
}

/*
     fixTJunctions:

     Suppose we have two polygons ACDB and EDGF:

      A-----B
      |     |
      |     E--F
      |     |  |
      C-----D--G

     Note that vertex E forms a T-junction on the side BD. In this case some STL slicers will complain
     that the solid is not watertight. This is because the watertightness check is done by checking if
     each side DE is matched by another side ED.

     This function will return a new solid with ACDB replaced by ACDEB

     Note that this can create polygons that are slightly non-convex (due to rounding errors). Therefore the result should
     not be used for further CSG operations!
*/
const fixTJunctions = function (fromPolygons, csg) {
  csg = csg.canonicalized()
  let sidemap = {}

  // STEP 1
  for (let polygonindex = 0; polygonindex < csg.polygons.length; polygonindex++) {
    let polygon = csg.polygons[polygonindex]
    let numvertices = polygon.vertices.length
    // should be true
    if (numvertices >= 3) {
      let vertex = polygon.vertices[0]
      let vertextag = vertex.getTag()
      for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
        let nextvertexindex = vertexindex + 1
        if (nextvertexindex === numvertices) nextvertexindex = 0
        let nextvertex = polygon.vertices[nextvertexindex]
        let nextvertextag = nextvertex.getTag()
        let sidetag = vertextag + '/' + nextvertextag
        let reversesidetag = nextvertextag + '/' + vertextag
        if (reversesidetag in sidemap) {
          // this side matches the same side in another polygon. Remove from sidemap:
          let ar = sidemap[reversesidetag]
          ar.splice(-1, 1)
          if (ar.length === 0) {
            delete sidemap[reversesidetag]
          }
        } else {
          let sideobj = {
            vertex0: vertex,
            vertex1: nextvertex,
            polygonindex: polygonindex
          }
          if (!(sidetag in sidemap)) {
            sidemap[sidetag] = [sideobj]
          } else {
            sidemap[sidetag].push(sideobj)
          }
        }
        vertex = nextvertex
        vertextag = nextvertextag
      }
    }
  }
  // STEP 2
  // now sidemap contains 'unmatched' sides
  // i.e. side AB in one polygon does not have a matching side BA in another polygon
  let vertextag2sidestart = {}
  let vertextag2sideend = {}
  let sidestocheck = {}
  let sidemapisempty = true
  for (let sidetag in sidemap) {
    sidemapisempty = false
    sidestocheck[sidetag] = true
    sidemap[sidetag].map(function (sideobj) {
      let starttag = sideobj.vertex0.getTag()
      let endtag = sideobj.vertex1.getTag()
      if (starttag in vertextag2sidestart) {
        vertextag2sidestart[starttag].push(sidetag)
      } else {
        vertextag2sidestart[starttag] = [sidetag]
      }
      if (endtag in vertextag2sideend) {
        vertextag2sideend[endtag].push(sidetag)
      } else {
        vertextag2sideend[endtag] = [sidetag]
      }
    })
  }

  // STEP 3 : if sidemap is not empty
  if (!sidemapisempty) {
    // make a copy of the polygons array, since we are going to modify it:
    let polygons = csg.polygons.slice(0)
    while (true) {
      let sidemapisempty = true
      for (let sidetag in sidemap) {
        sidemapisempty = false
        sidestocheck[sidetag] = true
      }
      if (sidemapisempty) break
      let donesomething = false
      while (true) {
        let sidetagtocheck = null
        for (let sidetag in sidestocheck) {
          sidetagtocheck = sidetag
          break // FIXME  : say what now ?
        }
        if (sidetagtocheck === null) break // sidestocheck is empty, we're done!
        let donewithside = true
        if (sidetagtocheck in sidemap) {
          let sideobjs = sidemap[sidetagtocheck]
          if (sideobjs.length === 0) throw new Error('Assertion failed')
          let sideobj = sideobjs[0]
          for (let directionindex = 0; directionindex < 2; directionindex++) {
            let startvertex = (directionindex === 0) ? sideobj.vertex0 : sideobj.vertex1
            let endvertex = (directionindex === 0) ? sideobj.vertex1 : sideobj.vertex0
            let startvertextag = startvertex.getTag()
            let endvertextag = endvertex.getTag()
            let matchingsides = []
            if (directionindex === 0) {
              if (startvertextag in vertextag2sideend) {
                matchingsides = vertextag2sideend[startvertextag]
              }
            } else {
              if (startvertextag in vertextag2sidestart) {
                matchingsides = vertextag2sidestart[startvertextag]
              }
            }
            for (let matchingsideindex = 0; matchingsideindex < matchingsides.length; matchingsideindex++) {
              let matchingsidetag = matchingsides[matchingsideindex]
              let matchingside = sidemap[matchingsidetag][0]
              let matchingsidestartvertex = (directionindex === 0) ? matchingside.vertex0 : matchingside.vertex1
              let matchingsideendvertex = (directionindex === 0) ? matchingside.vertex1 : matchingside.vertex0
              let matchingsidestartvertextag = matchingsidestartvertex.getTag()
              let matchingsideendvertextag = matchingsideendvertex.getTag()
              if (matchingsideendvertextag !== startvertextag) throw new Error('Assertion failed')
              if (matchingsidestartvertextag === endvertextag) {
                // matchingside cancels sidetagtocheck
                deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, startvertex, endvertex, null)
                deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, startvertex, null)
                donewithside = false
                directionindex = 2 // skip reverse direction check
                donesomething = true
                break
              } else {
                let startpos = startvertex.pos
                let endpos = endvertex.pos
                let checkpos = matchingsidestartvertex.pos
                let direction = checkpos.minus(startpos)
                // Now we need to check if endpos is on the line startpos-checkpos:
                let t = endpos.minus(startpos).dot(direction) / direction.dot(direction)
                if ((t > 0) && (t < 1)) {
                  let closestpoint = startpos.plus(direction.times(t))
                  let distancesquared = closestpoint.distanceToSquared(endpos)
                  if (distancesquared < (EPS * EPS)) {
                    // Yes it's a t-junction! We need to split matchingside in two:
                    let polygonindex = matchingside.polygonindex
                    let polygon = polygons[polygonindex]
                    // find the index of startvertextag in polygon:
                    let insertionvertextag = matchingside.vertex1.getTag()
                    let insertionvertextagindex = -1
                    for (let i = 0; i < polygon.vertices.length; i++) {
                      if (polygon.vertices[i].getTag() === insertionvertextag) {
                        insertionvertextagindex = i
                        break
                      }
                    }
                    if (insertionvertextagindex < 0) throw new Error('Assertion failed')
                    // split the side by inserting the vertex:
                    let newvertices = polygon.vertices.slice(0)
                    newvertices.splice(insertionvertextagindex, 0, endvertex)
                    let newpolygon = new Polygon(newvertices, polygon.shared /* polygon.plane */)

                    // calculate plane with differents point
                    if (isNaN(newpolygon.plane.w)) {
                      let found = false
                      let loop = function (callback) {
                        newpolygon.vertices.forEach(function (item) {
                          if (found) return
                          callback(item)
                        })
                      }

                      loop(function (a) {
                        loop(function (b) {
                          loop(function (c) {
                            newpolygon.plane = Plane.fromPoints(a.pos, b.pos, c.pos)
                            if (!isNaN(newpolygon.plane.w)) {
                              found = true
                            }
                          })
                        })
                      })
                    }
                    polygons[polygonindex] = newpolygon
                    // remove the original sides from our maps
                    // deleteSide(sideobj.vertex0, sideobj.vertex1, null)
                    deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, matchingside.vertex1, polygonindex)
                    let newsidetag1 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, endvertex, polygonindex)
                    let newsidetag2 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, matchingside.vertex1, polygonindex)
                    if (newsidetag1 !== null) sidestocheck[newsidetag1] = true
                    if (newsidetag2 !== null) sidestocheck[newsidetag2] = true
                    donewithside = false
                    directionindex = 2 // skip reverse direction check
                    donesomething = true
                    break
                  } // if(distancesquared < 1e-10)
                } // if( (t > 0) && (t < 1) )
              } // if(endingstidestartvertextag === endvertextag)
            } // for matchingsideindex
          } // for directionindex
        } // if(sidetagtocheck in sidemap)
        if (donewithside) {
          delete sidestocheck[sidetagtocheck]
        }
      }
      if (!donesomething) break
    }
    let newcsg = fromPolygons(polygons)
    newcsg.properties = csg.properties
    newcsg.isCanonicalized = true
    newcsg.isRetesselated = true
    csg = newcsg
  }

  // FIXME : what is even the point of this ???
  /* sidemapisempty = true
  for (let sidetag in sidemap) {
    sidemapisempty = false
    break
  }
  */

  return csg
}

module.exports = fixTJunctions


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

const CAG = __webpack_require__(10)
const {parseOptionAs2DVector, parseOptionAsFloat, parseOptionAsInt} = __webpack_require__(20)
const {defaultResolution2D} = __webpack_require__(0)
const Vector2D = __webpack_require__(3)
const Path2D = __webpack_require__(19)
const {fromCompactBinary} = __webpack_require__(22)

/** Construct a circle.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of circle
 * @param {Number} [options.radius=1] - radius of circle
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {CAG} new CAG object
 */
const circle = function (options) {
  options = options || {}
  let center = parseOptionAs2DVector(options, 'center', [0, 0])
  let radius = parseOptionAsFloat(options, 'radius', 1)
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)
  let points = []
  for (let i = 0; i < resolution; i++) {
    let radians = 2 * Math.PI * i / resolution
    let point = Vector2D.fromAngleRadians(radians).times(radius).plus(center)
    points.push(point)
  }
  return CAG.fromPoints(points)
}

/** Construct an ellispe.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of ellipse
 * @param {Vector2D} [options.radius=[1,1]] - radius of ellipse, width and height
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {CAG} new CAG object
 */
const ellipse = function (options) {
  options = options || {}
  let c = parseOptionAs2DVector(options, 'center', [0, 0])
  let r = parseOptionAs2DVector(options, 'radius', [1, 1])
  r = r.abs() // negative radii make no sense
  let res = parseOptionAsInt(options, 'resolution', defaultResolution2D)

  let e2 = new Path2D([[c.x, c.y + r.y]])
  e2 = e2.appendArc([c.x, c.y - r.y], {
    xradius: r.x,
    yradius: r.y,
    xaxisrotation: 0,
    resolution: res,
    clockwise: true,
    large: false
  })
  e2 = e2.appendArc([c.x, c.y + r.y], {
    xradius: r.x,
    yradius: r.y,
    xaxisrotation: 0,
    resolution: res,
    clockwise: true,
    large: false
  })
  e2 = e2.close()
  return CAG.fromPath2(e2)
}

/** Construct a rectangle.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of rectangle
 * @param {Vector2D} [options.radius=[1,1]] - radius of rectangle, width and height
 * @param {Vector2D} [options.corner1=[0,0]] - bottom left corner of rectangle (alternate)
 * @param {Vector2D} [options.corner2=[0,0]] - upper right corner of rectangle (alternate)
 * @returns {CAG} new CAG object
 */
const rectangle = function (options) {
  options = options || {}
  let c, r
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('rectangle: should either give a radius and center parameter, or a corner1 and corner2 parameter')
    }
    let corner1 = parseOptionAs2DVector(options, 'corner1', [0, 0])
    let corner2 = parseOptionAs2DVector(options, 'corner2', [1, 1])
    c = corner1.plus(corner2).times(0.5)
    r = corner2.minus(corner1).times(0.5)
  } else {
    c = parseOptionAs2DVector(options, 'center', [0, 0])
    r = parseOptionAs2DVector(options, 'radius', [1, 1])
  }
  r = r.abs() // negative radii make no sense
  let rswap = new Vector2D(r.x, -r.y)
  let points = [
    c.plus(r), c.plus(rswap), c.minus(r), c.minus(rswap)
  ]
  return CAG.fromPoints(points)
}

/** Construct a rounded rectangle.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of rounded rectangle
 * @param {Vector2D} [options.radius=[1,1]] - radius of rounded rectangle, width and height
 * @param {Vector2D} [options.corner1=[0,0]] - bottom left corner of rounded rectangle (alternate)
 * @param {Vector2D} [options.corner2=[0,0]] - upper right corner of rounded rectangle (alternate)
 * @param {Number} [options.roundradius=0.2] - round radius of corners
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {CAG} new CAG object
 *
 * @example
 * let r = roundedRectangle({
 *   center: [0, 0],
 *   radius: [5, 10],
 *   roundradius: 2,
 *   resolution: 36,
 * });
 */
const roundedRectangle = function (options) {
  options = options || {}
  let center, radius
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('roundedRectangle: should either give a radius and center parameter, or a corner1 and corner2 parameter')
    }
    let corner1 = parseOptionAs2DVector(options, 'corner1', [0, 0])
    let corner2 = parseOptionAs2DVector(options, 'corner2', [1, 1])
    center = corner1.plus(corner2).times(0.5)
    radius = corner2.minus(corner1).times(0.5)
  } else {
    center = parseOptionAs2DVector(options, 'center', [0, 0])
    radius = parseOptionAs2DVector(options, 'radius', [1, 1])
  }
  radius = radius.abs() // negative radii make no sense
  let roundradius = parseOptionAsFloat(options, 'roundradius', 0.2)
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)
  let maxroundradius = Math.min(radius.x, radius.y)
  maxroundradius -= 0.1
  roundradius = Math.min(roundradius, maxroundradius)
  roundradius = Math.max(0, roundradius)
  radius = new Vector2D(radius.x - roundradius, radius.y - roundradius)
  let rect = CAG.rectangle({
    center: center,
    radius: radius
  })
  if (roundradius > 0) {
    rect = rect.expand(roundradius, resolution)
  }
  return rect
}

/** Reconstruct a CAG from the output of toCompactBinary().
 * @param {CompactBinary} bin - see toCompactBinary()
 * @returns {CAG} new CAG object
 */
CAG.fromCompactBinary = function (bin) {
  if (bin['class'] !== 'CAG') throw new Error('Not a CAG')
  let vertices = []
  let vertexData = bin.vertexData
  let numvertices = vertexData.length / 2
  let arrayindex = 0
  for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
    let x = vertexData[arrayindex++]
    let y = vertexData[arrayindex++]
    let pos = new Vector2D(x, y)
    let vertex = new CAG.Vertex(pos)
    vertices.push(vertex)
  }

  let sides = []
  let numsides = bin.sideVertexIndices.length / 2
  arrayindex = 0
  for (let sideindex = 0; sideindex < numsides; sideindex++) {
    let vertexindex0 = bin.sideVertexIndices[arrayindex++]
    let vertexindex1 = bin.sideVertexIndices[arrayindex++]
    let side = new CAG.Side(vertices[vertexindex0], vertices[vertexindex1])
    sides.push(side)
  }
  let cag = CAG.fromSides(sides)
  cag.isCanonicalized = true
  return cag
}

module.exports = {
  circle,
  ellipse,
  rectangle,
  roundedRectangle,
  fromCompactBinary
}


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

const Vector3D = __webpack_require__(1)
const Vertex = __webpack_require__(8)
const Plane = __webpack_require__(6)
const Polygon2D = __webpack_require__(25)
const Polygon3D = __webpack_require__(7)

/** Construct a CSG solid from a list of pre-generated slices.
 * See Polygon.prototype.solidFromSlices() for details.
 * @param {Object} options - options passed to solidFromSlices()
 * @returns {CSG} new CSG object
 */
function fromSlices (options) {
  return (new Polygon2D.createFromPoints([
        [0, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
  ])).solidFromSlices(options)
}

/** Reconstruct a CSG solid from an object with identical property names.
 * @param {Object} obj - anonymous object, typically from JSON
 * @returns {CSG} new CSG object
 */
function fromObject (obj) {
  const CSG = __webpack_require__(5)
  let polygons = obj.polygons.map(function (p) {
    return Polygon3D.fromObject(p)
  })
  let csg = CSG.fromPolygons(polygons)
  csg.isCanonicalized = obj.isCanonicalized
  csg.isRetesselated = obj.isRetesselated
  return csg
}

/** Reconstruct a CSG from the output of toCompactBinary().
 * @param {CompactBinary} bin - see toCompactBinary().
 * @returns {CSG} new CSG object
 */
function fromCompactBinary (bin) {
  const CSG = __webpack_require__(5) // FIXME: circular dependency ??

  if (bin['class'] !== 'CSG') throw new Error('Not a CSG')
  let planes = []
  let planeData = bin.planeData
  let numplanes = planeData.length / 4
  let arrayindex = 0
  let x, y, z, w, normal, plane
  for (let planeindex = 0; planeindex < numplanes; planeindex++) {
    x = planeData[arrayindex++]
    y = planeData[arrayindex++]
    z = planeData[arrayindex++]
    w = planeData[arrayindex++]
    normal = Vector3D.Create(x, y, z)
    plane = new Plane(normal, w)
    planes.push(plane)
  }

  let vertices = []
  const vertexData = bin.vertexData
  const numvertices = vertexData.length / 3
  let pos
  let vertex
  arrayindex = 0
  for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
    x = vertexData[arrayindex++]
    y = vertexData[arrayindex++]
    z = vertexData[arrayindex++]
    pos = Vector3D.Create(x, y, z)
    vertex = new Vertex(pos)
    vertices.push(vertex)
  }

  let shareds = bin.shared.map(function (shared) {
    return Polygon3D.Shared.fromObject(shared)
  })

  let polygons = []
  let numpolygons = bin.numPolygons
  let numVerticesPerPolygon = bin.numVerticesPerPolygon
  let polygonVertices = bin.polygonVertices
  let polygonPlaneIndexes = bin.polygonPlaneIndexes
  let polygonSharedIndexes = bin.polygonSharedIndexes
  let numpolygonvertices
  let polygonvertices
  let shared
  let polygon // already defined plane,
  arrayindex = 0
  for (let polygonindex = 0; polygonindex < numpolygons; polygonindex++) {
    numpolygonvertices = numVerticesPerPolygon[polygonindex]
    polygonvertices = []
    for (let i = 0; i < numpolygonvertices; i++) {
      polygonvertices.push(vertices[polygonVertices[arrayindex++]])
    }
    plane = planes[polygonPlaneIndexes[polygonindex]]
    shared = shareds[polygonSharedIndexes[polygonindex]]
    polygon = new Polygon3D(polygonvertices, shared, plane)
    polygons.push(polygon)
  }
  let csg = CSG.fromPolygons(polygons)
  csg.isCanonicalized = true
  csg.isRetesselated = true
  return csg
}

module.exports = {
  //fromPolygons,
  fromSlices,
  fromObject,
  fromCompactBinary
}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

const CSG = __webpack_require__(5)
const {cube} = __webpack_require__(26)

// For debugging
// Creates a new solid with a tiny cube at every vertex of the source solid
// this is seperated from the CSG class itself because of the dependency on cube
const toPointCloud = function (csg, cuberadius) {
  csg = csg.reTesselated()

  let result = new CSG()

    // make a list of all unique vertices
    // For each vertex we also collect the list of normals of the planes touching the vertices
  let vertexmap = {}
  csg.polygons.map(function (polygon) {
    polygon.vertices.map(function (vertex) {
      vertexmap[vertex.getTag()] = vertex.pos
    })
  })

  for (let vertextag in vertexmap) {
    let pos = vertexmap[vertextag]
    let _cube = cube({
      center: pos,
      radius: cuberadius
    })
    result = result.unionSub(_cube, false, false)
  }
  result = result.reTesselated()
  return result
}

module.exports = {toPointCloud}


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

const { CSG, CAG } = __webpack_require__(12)
const { union } = __webpack_require__(29)
// -- 3D transformations (OpenSCAD like notion)

function translate () {      // v, obj or array
  var a = arguments, v = a[0], o, i = 1
  if (a[1].length) { a = a[1]; i = 0 }
  for (o = a[i++]; i < a.length; i++) {
    o = o.union(a[i])
  }
  return o.translate(v)
}

function center () { // v, obj or array
  var a = arguments, v = a[0], o, i = 1
  if (a[1].length) { a = a[1]; i = 0 }
  for (o = a[i++]; i < a.length; i++) {
    o = o.union(a[i])
  }
  return o.center(v)
}

function scale () {         // v, obj or array
  var a = arguments, v = a[0], o, i = 1
  if (a[1].length) { a = a[1]; i = 0 }
  for (o = a[i++]; i < a.length; i++) {
    o = o.union(a[i])
  }
  return o.scale(v)
}

function rotate () {
  var o, i, v, r = 1, a = arguments
  if (!a[0].length) {        // rotate(r,[x,y,z],o)
    r = a[0]
    v = a[1]
    i = 2
    if (a[2].length) { a = a[2]; i = 0 }
  } else {                   // rotate([x,y,z],o)
    v = a[0]
    i = 1
    if (a[1].length) { a = a[1]; i = 0 }
  }
  for (o = a[i++]; i < a.length; i++) {
    o = o.union(a[i])
  }
  if (r != 1) {
    return o.rotateX(v[0] * r).rotateY(v[1] * r).rotateZ(v[2] * r)
  } else {
    return o.rotateX(v[0]).rotateY(v[1]).rotateZ(v[2])
  }
}

function mirror (v, o) {
  var a = Array.prototype.slice.call(arguments, 1, arguments.length),
    o = a[0]

  for (var i = 1; i < a.length; i++) {
    o = o.union(a[i])
  }
  var plane = new CSG.Plane(new CSG.Vector3D(v[0], v[1], v[2]).unit(), 0)
  return o.mirrored(plane)
}

function expand (r, n, o) {
  return o.expand(r, n)
}

function contract (r, n, o) {
  return o.contract(r, n)
}

function multmatrix (mat, obj) {
  console.log('multmatrix() not yet implemented')
}

function minkowski () {
  console.log('minkowski() not yet implemented')
}

function hull () {
  var pts = []

  var a = arguments
  if (a[0].length) a = a[0]
  var done = []

  for (var i = 0; i < a.length; i++) {              // extract all points of the CAG in the argument list
    var cag = a[i]
    if (!(cag instanceof CAG)) {
      throw ('ERROR: hull() accepts only 2D forms / CAG')
      return
    }
    for (var j = 0; j < cag.sides.length; j++) {
      var x = cag.sides[j].vertex0.pos.x
      var y = cag.sides[j].vertex0.pos.y
      if (done['' + x + ',' + y])  // avoid some coord to appear multiple times
           {
        continue
      }
      pts.push({ x: x, y: y })
      done['' + x + ',' + y]++
         // echo(x,y);
    }
  }
   // echo(pts.length+" points in",pts);

   // from http://www.psychedelicdevelopment.com/grahamscan/
   //    see also at https://github.com/bkiers/GrahamScan/blob/master/src/main/cg/GrahamScan.java
  var ConvexHullPoint = function (i, a, d) {
    this.index = i
    this.angle = a
    this.distance = d

    this.compare = function (p) {
      if (this.angle < p.angle) {
        return -1
      } else if (this.angle > p.angle) {
        return 1
      } else {
        if (this.distance < p.distance) {
          return -1
        } else if (this.distance > p.distance) {
          return 1
        }
      }
      return 0
    }
  }

  var ConvexHull = function () {
    this.points = null
    this.indices = null

    this.getIndices = function () {
      return this.indices
    }

    this.clear = function () {
      this.indices = null
      this.points = null
    }

    this.ccw = function (p1, p2, p3) {
      var ccw = (this.points[p2].x - this.points[p1].x) * (this.points[p3].y - this.points[p1].y) -
                   (this.points[p2].y - this.points[p1].y) * (this.points[p3].x - this.points[p1].x)
      if (ccw < 1e-5)      // we need this, otherwise sorting never ends, see https://github.com/Spiritdude/OpenJSCAD.org/issues/18
            {
        return 0
      }
      return ccw
    }

    this.angle = function (o, a) {
         // return Math.atan((this.points[a].y-this.points[o].y) / (this.points[a].x - this.points[o].x));
      return Math.atan2((this.points[a].y - this.points[o].y), (this.points[a].x - this.points[o].x))
    }

    this.distance = function (a, b) {
      return ((this.points[b].x - this.points[a].x) * (this.points[b].x - this.points[a].x) +
                 (this.points[b].y - this.points[a].y) * (this.points[b].y - this.points[a].y))
    }

    this.compute = function (_points) {
      this.indices = null
      if (_points.length < 3) {
        return
      }
      this.points = _points

         // Find the lowest point
      var min = 0
      for (var i = 1; i < this.points.length; i++) {
        if (this.points[i].y == this.points[min].y) {
          if (this.points[i].x < this.points[min].x) {
            min = i
          }
        } else if (this.points[i].y < this.points[min].y) {
          min = i
        }
      }

         // Calculate angle and distance from base
      var al = new Array()
      var ang = 0.0
      var dist = 0.0
      for (i = 0; i < this.points.length; i++) {
        if (i == min) {
          continue
        }
        ang = this.angle(min, i)
        if (ang < 0) {
          ang += Math.PI
        }
        dist = this.distance(min, i)
        al.push(new ConvexHullPoint(i, ang, dist))
      }

      al.sort(function (a, b) { return a.compare(b) })

         // Create stack
      var stack = new Array(this.points.length + 1)
      var j = 2
      for (i = 0; i < this.points.length; i++) {
        if (i == min) {
          continue
        }
        stack[j] = al[j - 2].index
        j++
      }
      stack[0] = stack[this.points.length]
      stack[1] = min

      var tmp
      var M = 2
      for (i = 3; i <= this.points.length; i++) {
        while (this.ccw(stack[M - 1], stack[M], stack[i]) <= 0) {
          M--
        }
        M++
        tmp = stack[i]
        stack[i] = stack[M]
        stack[M] = tmp
      }

      this.indices = new Array(M)
      for (i = 0; i < M; i++) {
        this.indices[i] = stack[i + 1]
      }
    }
  }

  var hull = new ConvexHull()

  hull.compute(pts)
  var indices = hull.getIndices()

  if (indices && indices.length > 0) {
    var ch = []
    for (var i = 0; i < indices.length; i++) {
      ch.push(pts[indices[i]])
         // echo(pts[indices[i]]);
    }
      // echo(ch.length+" points out",ch);
    return CAG.fromPoints(ch)
      // return CAG.fromPointsNoCheck(ch);
  }
}

// "Whosa whatsis" suggested "Chain Hull" as described at https://plus.google.com/u/0/105535247347788377245/posts/aZGXKFX1ACN
// essentially hull A+B, B+C, C+D and then union those

function chain_hull () {
  var a = arguments
  var j = 0, closed = false

  if (a[j].closed !== undefined) {
    closed = a[j++].closed
  }

  if (a[j].length) { a = a[j] }

  var h = []; var n = a.length - (closed ? 0 : 1)
  for (var i = 0; i < n; i++) {
    h.push(hull(a[i], a[(i + 1) % a.length]))
  }
  return union(h)
}

module.exports = {
  translate,
  center,
  scale,
  rotate,
  mirror,
  expand,
  contract,
  multmatrix,
  minkowski,
  hull,
  chain_hull
}


/***/ }),
/* 47 */
/***/ (function(module, exports) {

// color table from http://www.w3.org/TR/css3-color/
var cssColors = {
// basic color keywords
  'black': [ 0 / 255, 0 / 255, 0 / 255 ],
  'silver': [ 192 / 255, 192 / 255, 192 / 255 ],
  'gray': [ 128 / 255, 128 / 255, 128 / 255 ],
  'white': [ 255 / 255, 255 / 255, 255 / 255 ],
  'maroon': [ 128 / 255, 0 / 255, 0 / 255 ],
  'red': [ 255 / 255, 0 / 255, 0 / 255 ],
  'purple': [ 128 / 255, 0 / 255, 128 / 255 ],
  'fuchsia': [ 255 / 255, 0 / 255, 255 / 255 ],
  'green': [ 0 / 255, 128 / 255, 0 / 255 ],
  'lime': [ 0 / 255, 255 / 255, 0 / 255 ],
  'olive': [ 128 / 255, 128 / 255, 0 / 255 ],
  'yellow': [ 255 / 255, 255 / 255, 0 / 255 ],
  'navy': [ 0 / 255, 0 / 255, 128 / 255 ],
  'blue': [ 0 / 255, 0 / 255, 255 / 255 ],
  'teal': [ 0 / 255, 128 / 255, 128 / 255 ],
  'aqua': [ 0 / 255, 255 / 255, 255 / 255 ],
// extended color keywords
  'aliceblue': [ 240 / 255, 248 / 255, 255 / 255 ],
  'antiquewhite': [ 250 / 255, 235 / 255, 215 / 255 ],
  //'aqua': [ 0 / 255, 255 / 255, 255 / 255 ],
  'aquamarine': [ 127 / 255, 255 / 255, 212 / 255 ],
  'azure': [ 240 / 255, 255 / 255, 255 / 255 ],
  'beige': [ 245 / 255, 245 / 255, 220 / 255 ],
  'bisque': [ 255 / 255, 228 / 255, 196 / 255 ],
  //'black': [ 0 / 255, 0 / 255, 0 / 255 ],
  'blanchedalmond': [ 255 / 255, 235 / 255, 205 / 255 ],
  //'blue': [ 0 / 255, 0 / 255, 255 / 255 ],
  'blueviolet': [ 138 / 255, 43 / 255, 226 / 255 ],
  'brown': [ 165 / 255, 42 / 255, 42 / 255 ],
  'burlywood': [ 222 / 255, 184 / 255, 135 / 255 ],
  'cadetblue': [ 95 / 255, 158 / 255, 160 / 255 ],
  'chartreuse': [ 127 / 255, 255 / 255, 0 / 255 ],
  'chocolate': [ 210 / 255, 105 / 255, 30 / 255 ],
  'coral': [ 255 / 255, 127 / 255, 80 / 255 ],
  'cornflowerblue': [ 100 / 255, 149 / 255, 237 / 255 ],
  'cornsilk': [ 255 / 255, 248 / 255, 220 / 255 ],
  'crimson': [ 220 / 255, 20 / 255, 60 / 255 ],
  'cyan': [ 0 / 255, 255 / 255, 255 / 255 ],
  'darkblue': [ 0 / 255, 0 / 255, 139 / 255 ],
  'darkcyan': [ 0 / 255, 139 / 255, 139 / 255 ],
  'darkgoldenrod': [ 184 / 255, 134 / 255, 11 / 255 ],
  'darkgray': [ 169 / 255, 169 / 255, 169 / 255 ],
  'darkgreen': [ 0 / 255, 100 / 255, 0 / 255 ],
  'darkgrey': [ 169 / 255, 169 / 255, 169 / 255 ],
  'darkkhaki': [ 189 / 255, 183 / 255, 107 / 255 ],
  'darkmagenta': [ 139 / 255, 0 / 255, 139 / 255 ],
  'darkolivegreen': [ 85 / 255, 107 / 255, 47 / 255 ],
  'darkorange': [ 255 / 255, 140 / 255, 0 / 255 ],
  'darkorchid': [ 153 / 255, 50 / 255, 204 / 255 ],
  'darkred': [ 139 / 255, 0 / 255, 0 / 255 ],
  'darksalmon': [ 233 / 255, 150 / 255, 122 / 255 ],
  'darkseagreen': [ 143 / 255, 188 / 255, 143 / 255 ],
  'darkslateblue': [ 72 / 255, 61 / 255, 139 / 255 ],
  'darkslategray': [ 47 / 255, 79 / 255, 79 / 255 ],
  'darkslategrey': [ 47 / 255, 79 / 255, 79 / 255 ],
  'darkturquoise': [ 0 / 255, 206 / 255, 209 / 255 ],
  'darkviolet': [ 148 / 255, 0 / 255, 211 / 255 ],
  'deeppink': [ 255 / 255, 20 / 255, 147 / 255 ],
  'deepskyblue': [ 0 / 255, 191 / 255, 255 / 255 ],
  'dimgray': [ 105 / 255, 105 / 255, 105 / 255 ],
  'dimgrey': [ 105 / 255, 105 / 255, 105 / 255 ],
  'dodgerblue': [ 30 / 255, 144 / 255, 255 / 255 ],
  'firebrick': [ 178 / 255, 34 / 255, 34 / 255 ],
  'floralwhite': [ 255 / 255, 250 / 255, 240 / 255 ],
  'forestgreen': [ 34 / 255, 139 / 255, 34 / 255 ],
  //'fuchsia': [ 255 / 255, 0 / 255, 255 / 255 ],
  'gainsboro': [ 220 / 255, 220 / 255, 220 / 255 ],
  'ghostwhite': [ 248 / 255, 248 / 255, 255 / 255 ],
  'gold': [ 255 / 255, 215 / 255, 0 / 255 ],
  'goldenrod': [ 218 / 255, 165 / 255, 32 / 255 ],
  //'gray': [ 128 / 255, 128 / 255, 128 / 255 ],
  //'green': [ 0 / 255, 128 / 255, 0 / 255 ],
  'greenyellow': [ 173 / 255, 255 / 255, 47 / 255 ],
  'grey': [ 128 / 255, 128 / 255, 128 / 255 ],
  'honeydew': [ 240 / 255, 255 / 255, 240 / 255 ],
  'hotpink': [ 255 / 255, 105 / 255, 180 / 255 ],
  'indianred': [ 205 / 255, 92 / 255, 92 / 255 ],
  'indigo': [ 75 / 255, 0 / 255, 130 / 255 ],
  'ivory': [ 255 / 255, 255 / 255, 240 / 255 ],
  'khaki': [ 240 / 255, 230 / 255, 140 / 255 ],
  'lavender': [ 230 / 255, 230 / 255, 250 / 255 ],
  'lavenderblush': [ 255 / 255, 240 / 255, 245 / 255 ],
  'lawngreen': [ 124 / 255, 252 / 255, 0 / 255 ],
  'lemonchiffon': [ 255 / 255, 250 / 255, 205 / 255 ],
  'lightblue': [ 173 / 255, 216 / 255, 230 / 255 ],
  'lightcoral': [ 240 / 255, 128 / 255, 128 / 255 ],
  'lightcyan': [ 224 / 255, 255 / 255, 255 / 255 ],
  'lightgoldenrodyellow': [ 250 / 255, 250 / 255, 210 / 255 ],
  'lightgray': [ 211 / 255, 211 / 255, 211 / 255 ],
  'lightgreen': [ 144 / 255, 238 / 255, 144 / 255 ],
  'lightgrey': [ 211 / 255, 211 / 255, 211 / 255 ],
  'lightpink': [ 255 / 255, 182 / 255, 193 / 255 ],
  'lightsalmon': [ 255 / 255, 160 / 255, 122 / 255 ],
  'lightseagreen': [ 32 / 255, 178 / 255, 170 / 255 ],
  'lightskyblue': [ 135 / 255, 206 / 255, 250 / 255 ],
  'lightslategray': [ 119 / 255, 136 / 255, 153 / 255 ],
  'lightslategrey': [ 119 / 255, 136 / 255, 153 / 255 ],
  'lightsteelblue': [ 176 / 255, 196 / 255, 222 / 255 ],
  'lightyellow': [ 255 / 255, 255 / 255, 224 / 255 ],
  //'lime': [ 0 / 255, 255 / 255, 0 / 255 ],
  'limegreen': [ 50 / 255, 205 / 255, 50 / 255 ],
  'linen': [ 250 / 255, 240 / 255, 230 / 255 ],
  'magenta': [ 255 / 255, 0 / 255, 255 / 255 ],
  //'maroon': [ 128 / 255, 0 / 255, 0 / 255 ],
  'mediumaquamarine': [ 102 / 255, 205 / 255, 170 / 255 ],
  'mediumblue': [ 0 / 255, 0 / 255, 205 / 255 ],
  'mediumorchid': [ 186 / 255, 85 / 255, 211 / 255 ],
  'mediumpurple': [ 147 / 255, 112 / 255, 219 / 255 ],
  'mediumseagreen': [ 60 / 255, 179 / 255, 113 / 255 ],
  'mediumslateblue': [ 123 / 255, 104 / 255, 238 / 255 ],
  'mediumspringgreen': [ 0 / 255, 250 / 255, 154 / 255 ],
  'mediumturquoise': [ 72 / 255, 209 / 255, 204 / 255 ],
  'mediumvioletred': [ 199 / 255, 21 / 255, 133 / 255 ],
  'midnightblue': [ 25 / 255, 25 / 255, 112 / 255 ],
  'mintcream': [ 245 / 255, 255 / 255, 250 / 255 ],
  'mistyrose': [ 255 / 255, 228 / 255, 225 / 255 ],
  'moccasin': [ 255 / 255, 228 / 255, 181 / 255 ],
  'navajowhite': [ 255 / 255, 222 / 255, 173 / 255 ],
  //'navy': [ 0 / 255, 0 / 255, 128 / 255 ],
  'oldlace': [ 253 / 255, 245 / 255, 230 / 255 ],
  //'olive': [ 128 / 255, 128 / 255, 0 / 255 ],
  'olivedrab': [ 107 / 255, 142 / 255, 35 / 255 ],
  'orange': [ 255 / 255, 165 / 255, 0 / 255 ],
  'orangered': [ 255 / 255, 69 / 255, 0 / 255 ],
  'orchid': [ 218 / 255, 112 / 255, 214 / 255 ],
  'palegoldenrod': [ 238 / 255, 232 / 255, 170 / 255 ],
  'palegreen': [ 152 / 255, 251 / 255, 152 / 255 ],
  'paleturquoise': [ 175 / 255, 238 / 255, 238 / 255 ],
  'palevioletred': [ 219 / 255, 112 / 255, 147 / 255 ],
  'papayawhip': [ 255 / 255, 239 / 255, 213 / 255 ],
  'peachpuff': [ 255 / 255, 218 / 255, 185 / 255 ],
  'peru': [ 205 / 255, 133 / 255, 63 / 255 ],
  'pink': [ 255 / 255, 192 / 255, 203 / 255 ],
  'plum': [ 221 / 255, 160 / 255, 221 / 255 ],
  'powderblue': [ 176 / 255, 224 / 255, 230 / 255 ],
  //'purple': [ 128 / 255, 0 / 255, 128 / 255 ],
  //'red': [ 255 / 255, 0 / 255, 0 / 255 ],
  'rosybrown': [ 188 / 255, 143 / 255, 143 / 255 ],
  'royalblue': [ 65 / 255, 105 / 255, 225 / 255 ],
  'saddlebrown': [ 139 / 255, 69 / 255, 19 / 255 ],
  'salmon': [ 250 / 255, 128 / 255, 114 / 255 ],
  'sandybrown': [ 244 / 255, 164 / 255, 96 / 255 ],
  'seagreen': [ 46 / 255, 139 / 255, 87 / 255 ],
  'seashell': [ 255 / 255, 245 / 255, 238 / 255 ],
  'sienna': [ 160 / 255, 82 / 255, 45 / 255 ],
  //'silver': [ 192 / 255, 192 / 255, 192 / 255 ],
  'skyblue': [ 135 / 255, 206 / 255, 235 / 255 ],
  'slateblue': [ 106 / 255, 90 / 255, 205 / 255 ],
  'slategray': [ 112 / 255, 128 / 255, 144 / 255 ],
  'slategrey': [ 112 / 255, 128 / 255, 144 / 255 ],
  'snow': [ 255 / 255, 250 / 255, 250 / 255 ],
  'springgreen': [ 0 / 255, 255 / 255, 127 / 255 ],
  'steelblue': [ 70 / 255, 130 / 255, 180 / 255 ],
  'tan': [ 210 / 255, 180 / 255, 140 / 255 ],
  //'teal': [ 0 / 255, 128 / 255, 128 / 255 ],
  'thistle': [ 216 / 255, 191 / 255, 216 / 255 ],
  'tomato': [ 255 / 255, 99 / 255, 71 / 255 ],
  'turquoise': [ 64 / 255, 224 / 255, 208 / 255 ],
  'violet': [ 238 / 255, 130 / 255, 238 / 255 ],
  'wheat': [ 245 / 255, 222 / 255, 179 / 255 ],
  //'white': [ 255 / 255, 255 / 255, 255 / 255 ],
  'whitesmoke': [ 245 / 255, 245 / 255, 245 / 255 ],
  //'yellow': [ 255 / 255, 255 / 255, 0 / 255 ],
  'yellowgreen': [ 154 / 255, 205 / 255, 50 / 255 ],
};


/**
 * Converts an CSS color name to RGB color.
 *
 * @param   String  s       The CSS color name
 * @return  Array           The RGB representation, or [0,0,0] default
 */
function css2rgb(s) {
  return cssColors[s.toLowerCase()]
}

// color( (array[r,g,b] | css-string) [,alpha] (,array[objects] | list of objects) )
function color () {
  var o, i = 1, a = arguments, c = a[0], alpha

  // assume first argument is RGB array
  // but check if first argument is CSS string
  if (typeof c == 'string') {
    c = css2rgb(c)
  }
  // check if second argument is alpha
  if (Number.isFinite(a[i])) {
    c = c.concat(a[i])
    i++
  }
  // check if next argument is an an array
  if (Array.isArray(a[i])) { a = a[i], i = 0; } // use this as the list of objects
  for (o = a[i++]; i < a.length; i++) {
    o = o.union(a[i])
  }
  return o.setColor(c)
}

// from http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 1] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgb2hsl (r, g, b) {
  if (r.length) { b = r[2], g = r[1], r = r[0]; }
  var max = Math.max(r, g, b), min = Math.min(r, g, b)
  var h, s, l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h, s, l]
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hsl2rgb (h, s, l) {
  if (h.length) { l = h[2], s = h[1], h = h[0]; }
  var r, g, b

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [r, g, b]
}

function hue2rgb (p, q, t) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 1] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */

function rgb2hsv (r, g, b) {
  if (r.length) { b = r[2], g = r[1], r = r[0]; }
  var max = Math.max(r, g, b), min = Math.min(r, g, b)
  var h, s, v = max

  var d = max - min
  s = max == 0 ? 0 : d / max

  if (max == min) {
    h = 0 // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h, s, v]
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsv2rgb (h, s, v) {
  if (h.length) { v = h[2], s = h[1], h = h[0]; }
  var r, g, b

  var i = Math.floor(h * 6)
  var f = h * 6 - i
  var p = v * (1 - s)
  var q = v * (1 - f * s)
  var t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0:
      r = v, g = t, b = p
      break
    case 1:
      r = q, g = v, b = p
      break
    case 2:
      r = p, g = v, b = t
      break
    case 3:
      r = p, g = q, b = v
      break
    case 4:
      r = t, g = p, b = v
      break
    case 5:
      r = v, g = p, b = q
      break
  }

  return [r, g, b]
}

/**
 * Converts a HTML5 color value (string) to RGB values
 * See the color input type of HTML5 forms
 * Conversion formula:
 * - split the string; "#RRGGBB" into RGB components
 * - convert the HEX value into RGB values
 */
function html2rgb (s) {
  var r = 0
  var g = 0
  var b = 0
  if (s.length == 7) {
    r = parseInt('0x' + s.slice(1, 3)) / 255
    g = parseInt('0x' + s.slice(3, 5)) / 255
    b = parseInt('0x' + s.slice(5, 7)) / 255
  }
  return [r, g, b]
}

/**
 * Converts RGB color value to HTML5 color value (string)
 * Conversion forumla:
 * - convert R, G, B into HEX strings
 * - return HTML formatted string "#RRGGBB"
 */
function rgb2html (r, g, b) {
  if (r.length) { b = r[2], g = r[1], r = r[0]; }
  var s = '#' +
  Number(0x1000000 + r * 255 * 0x10000 + g * 255 * 0x100 + b * 255).toString(16).substring(1,7)
  return s
}

 module.exports = {
   css2rgb,
   color,
   rgb2hsl,
   hsl2rgb,
   rgb2hsv,
   hsv2rgb,
   html2rgb,
   rgb2html
 }


/***/ }),
/* 48 */
/***/ (function(module, exports) {

// -- Math functions (360 deg based vs 2pi)
function sin (a) {
  return Math.sin(a / 360 * Math.PI * 2)
}
function cos (a) {
  return Math.cos(a / 360 * Math.PI * 2)
}
function asin (a) {
  return Math.asin(a) / (Math.PI * 2) * 360
}
function acos (a) {
  return Math.acos(a) / (Math.PI * 2) * 360
}
function tan (a) {
  return Math.tan(a / 360 * Math.PI * 2)
}
function atan (a) {
  return Math.atan(a) / (Math.PI * 2) * 360
}
function atan2 (a, b) {
  return Math.atan2(a, b) / (Math.PI * 2) * 360
}
function ceil (a) {
  return Math.ceil(a)
}
function floor (a) {
  return Math.floor(a)
}
function abs (a) {
  return Math.abs(a)
}
function min (a, b) {
  return a < b ? a : b
}
function max (a, b) {
  return a > b ? a : b
}
function rands (min, max, vn, seed) {
  // -- seed is ignored for now, FIX IT (requires reimplementation of random())
  //    see http://stackoverflow.com/questions/424292/how-to-create-my-own-javascript-random-number-generator-that-i-can-also-set-the
  var v = new Array(vn)
  for (var i = 0; i < vn; i++) {
    v[i] = Math.random() * (max - min) + min
  }
}
function log (a) {
  return Math.log(a)
}
function lookup (ix, v) {
  var r = 0
  for (var i = 0; i < v.length; i++) {
    var a0 = v[i]
    if (a0[0] >= ix) {
      i--
      a0 = v[i]
      var a1 = v[i + 1]
      var m = 0
      if (a0[0] !== a1[0]) {
        m = abs((ix - a0[0]) / (a1[0] - a0[0]))
      }
      // echo(">>",i,ix,a0[0],a1[0],";",m,a0[1],a1[1])
      if (m > 0) {
        r = a0[1] * (1 - m) + a1[1] * m
      } else {
        r = a0[1]
      }
      return r
    }
  }
  return r
}

function pow (a, b) {
  return Math.pow(a, b)
}

function sign (a) {
  return a < 0 ? -1 : (a > 1 ? 1 : 0)
}

function sqrt (a) {
  return Math.sqrt(a)
}

function round (a) {
  return floor(a + 0.5)
}

module.exports = {
  sin,
  cos,
  asin,
  acos,
  tan,
  atan,
  atan2,
  ceil,
  floor,
  abs,
  min,
  max,
  rands,
  log,
  lookup,
  pow,
  sign,
  sqrt,
  round
}


/***/ }),
/* 49 */
/***/ (function(module, exports) {


function vector_char(x,y,c) {
   c = c.charCodeAt(0);
   c -= 32;
   if(c<0||c>=95) return { width: 0, segments: [] };

   var off = c*112;
   var n = simplexFont[off++];
   var w = simplexFont[off++];
   var l = [];
   var segs = [];

   for(var i=0; i<n; i++) {
      var xp = simplexFont[off+i*2];
      var yp = simplexFont[off+i*2+1];
      if(xp==-1&&yp==-1) {
         segs.push(l); l = [];
      } else {
         l.push([xp+x,yp+y]);
      }
   }
   if(l.length) segs.push(l);
   return { width: w, segments: segs };
}

function vector_text(x,y,s) {
   var o = [];
   var x0 = x;
   for(var i=0; i<s.length; i++) {
      var c = s.charAt(i);
      if(c=='\n') {
         x = x0; y -= 30;
      } else {
         var d = vector_char(x,y,c);
         x += d.width;
         o = o.concat(d.segments);
      }
   }
   return o;
}

// -- data below from http://paulbourke.net/dataformats/hershey/

var simplexFont = [
    0,16, /* Ascii 32 */
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,10, /* Ascii 33 */
    5,21, 5, 7,-1,-1, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,16, /* Ascii 34 */
    4,21, 4,14,-1,-1,12,21,12,14,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   11,21, /* Ascii 35 */
   11,25, 4,-7,-1,-1,17,25,10,-7,-1,-1, 4,12,18,12,-1,-1, 3, 6,17, 6,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   26,20, /* Ascii 36 */
    8,25, 8,-4,-1,-1,12,25,12,-4,-1,-1,17,18,15,20,12,21, 8,21, 5,20, 3,
   18, 3,16, 4,14, 5,13, 7,12,13,10,15, 9,16, 8,17, 6,17, 3,15, 1,12, 0,
    8, 0, 5, 1, 3, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   31,24, /* Ascii 37 */
   21,21, 3, 0,-1,-1, 8,21,10,19,10,17, 9,15, 7,14, 5,14, 3,16, 3,18, 4,
   20, 6,21, 8,21,10,20,13,19,16,19,19,20,21,21,-1,-1,17, 7,15, 6,14, 4,
   14, 2,16, 0,18, 0,20, 1,21, 3,21, 5,19, 7,17, 7,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   34,26, /* Ascii 38 */
   23,12,23,13,22,14,21,14,20,13,19,11,17, 6,15, 3,13, 1,11, 0, 7, 0, 5,
    1, 4, 2, 3, 4, 3, 6, 4, 8, 5, 9,12,13,13,14,14,16,14,18,13,20,11,21,
    9,20, 8,18, 8,16, 9,13,11,10,16, 3,18, 1,20, 0,22, 0,23, 1,23, 2,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    7,10, /* Ascii 39 */
    5,19, 4,20, 5,21, 6,20, 6,18, 5,16, 4,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   10,14, /* Ascii 40 */
   11,25, 9,23, 7,20, 5,16, 4,11, 4, 7, 5, 2, 7,-2, 9,-5,11,-7,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   10,14, /* Ascii 41 */
    3,25, 5,23, 7,20, 9,16,10,11,10, 7, 9, 2, 7,-2, 5,-5, 3,-7,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,16, /* Ascii 42 */
    8,21, 8, 9,-1,-1, 3,18,13,12,-1,-1,13,18, 3,12,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,26, /* Ascii 43 */
   13,18,13, 0,-1,-1, 4, 9,22, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,10, /* Ascii 44 */
    6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6,-1, 5,-3, 4,-4,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    2,26, /* Ascii 45 */
    4, 9,22, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,10, /* Ascii 46 */
    5, 2, 4, 1, 5, 0, 6, 1, 5, 2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    2,22, /* Ascii 47 */
   20,25, 2,-7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   17,20, /* Ascii 48 */
    9,21, 6,20, 4,17, 3,12, 3, 9, 4, 4, 6, 1, 9, 0,11, 0,14, 1,16, 4,17,
    9,17,12,16,17,14,20,11,21, 9,21,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    4,20, /* Ascii 49 */
    6,17, 8,18,11,21,11, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   14,20, /* Ascii 50 */
    4,16, 4,17, 5,19, 6,20, 8,21,12,21,14,20,15,19,16,17,16,15,15,13,13,
   10, 3, 0,17, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   15,20, /* Ascii 51 */
    5,21,16,21,10,13,13,13,15,12,16,11,17, 8,17, 6,16, 3,14, 1,11, 0, 8,
    0, 5, 1, 4, 2, 3, 4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    6,20, /* Ascii 52 */
   13,21, 3, 7,18, 7,-1,-1,13,21,13, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   17,20, /* Ascii 53 */
   15,21, 5,21, 4,12, 5,13, 8,14,11,14,14,13,16,11,17, 8,17, 6,16, 3,14,
    1,11, 0, 8, 0, 5, 1, 4, 2, 3, 4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   23,20, /* Ascii 54 */
   16,18,15,20,12,21,10,21, 7,20, 5,17, 4,12, 4, 7, 5, 3, 7, 1,10, 0,11,
    0,14, 1,16, 3,17, 6,17, 7,16,10,14,12,11,13,10,13, 7,12, 5,10, 4, 7,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,20, /* Ascii 55 */
   17,21, 7, 0,-1,-1, 3,21,17,21,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   29,20, /* Ascii 56 */
    8,21, 5,20, 4,18, 4,16, 5,14, 7,13,11,12,14,11,16, 9,17, 7,17, 4,16,
    2,15, 1,12, 0, 8, 0, 5, 1, 4, 2, 3, 4, 3, 7, 4, 9, 6,11, 9,12,13,13,
   15,14,16,16,16,18,15,20,12,21, 8,21,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   23,20, /* Ascii 57 */
   16,14,15,11,13, 9,10, 8, 9, 8, 6, 9, 4,11, 3,14, 3,15, 4,18, 6,20, 9,
   21,10,21,13,20,15,18,16,14,16, 9,15, 4,13, 1,10, 0, 8, 0, 5, 1, 4, 3,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   11,10, /* Ascii 58 */
    5,14, 4,13, 5,12, 6,13, 5,14,-1,-1, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   14,10, /* Ascii 59 */
    5,14, 4,13, 5,12, 6,13, 5,14,-1,-1, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6,
   -1, 5,-3, 4,-4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    3,24, /* Ascii 60 */
   20,18, 4, 9,20, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,26, /* Ascii 61 */
    4,12,22,12,-1,-1, 4, 6,22, 6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    3,24, /* Ascii 62 */
    4,18,20, 9, 4, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   20,18, /* Ascii 63 */
    3,16, 3,17, 4,19, 5,20, 7,21,11,21,13,20,14,19,15,17,15,15,14,13,13,
   12, 9,10, 9, 7,-1,-1, 9, 2, 8, 1, 9, 0,10, 1, 9, 2,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   55,27, /* Ascii 64 */
   18,13,17,15,15,16,12,16,10,15, 9,14, 8,11, 8, 8, 9, 6,11, 5,14, 5,16,
    6,17, 8,-1,-1,12,16,10,14, 9,11, 9, 8,10, 6,11, 5,-1,-1,18,16,17, 8,
   17, 6,19, 5,21, 5,23, 7,24,10,24,12,23,15,22,17,20,19,18,20,15,21,12,
   21, 9,20, 7,19, 5,17, 4,15, 3,12, 3, 9, 4, 6, 5, 4, 7, 2, 9, 1,12, 0,
   15, 0,18, 1,20, 2,21, 3,-1,-1,19,16,18, 8,18, 6,19, 5,
    8,18, /* Ascii 65 */
    9,21, 1, 0,-1,-1, 9,21,17, 0,-1,-1, 4, 7,14, 7,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   23,21, /* Ascii 66 */
    4,21, 4, 0,-1,-1, 4,21,13,21,16,20,17,19,18,17,18,15,17,13,16,12,13,
   11,-1,-1, 4,11,13,11,16,10,17, 9,18, 7,18, 4,17, 2,16, 1,13, 0, 4, 0,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   18,21, /* Ascii 67 */
   18,16,17,18,15,20,13,21, 9,21, 7,20, 5,18, 4,16, 3,13, 3, 8, 4, 5, 5,
    3, 7, 1, 9, 0,13, 0,15, 1,17, 3,18, 5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   15,21, /* Ascii 68 */
    4,21, 4, 0,-1,-1, 4,21,11,21,14,20,16,18,17,16,18,13,18, 8,17, 5,16,
    3,14, 1,11, 0, 4, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   11,19, /* Ascii 69 */
    4,21, 4, 0,-1,-1, 4,21,17,21,-1,-1, 4,11,12,11,-1,-1, 4, 0,17, 0,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,18, /* Ascii 70 */
    4,21, 4, 0,-1,-1, 4,21,17,21,-1,-1, 4,11,12,11,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   22,21, /* Ascii 71 */
   18,16,17,18,15,20,13,21, 9,21, 7,20, 5,18, 4,16, 3,13, 3, 8, 4, 5, 5,
    3, 7, 1, 9, 0,13, 0,15, 1,17, 3,18, 5,18, 8,-1,-1,13, 8,18, 8,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,22, /* Ascii 72 */
    4,21, 4, 0,-1,-1,18,21,18, 0,-1,-1, 4,11,18,11,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    2, 8, /* Ascii 73 */
    4,21, 4, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   10,16, /* Ascii 74 */
   12,21,12, 5,11, 2,10, 1, 8, 0, 6, 0, 4, 1, 3, 2, 2, 5, 2, 7,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,21, /* Ascii 75 */
    4,21, 4, 0,-1,-1,18,21, 4, 7,-1,-1, 9,12,18, 0,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,17, /* Ascii 76 */
    4,21, 4, 0,-1,-1, 4, 0,16, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   11,24, /* Ascii 77 */
    4,21, 4, 0,-1,-1, 4,21,12, 0,-1,-1,20,21,12, 0,-1,-1,20,21,20, 0,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,22, /* Ascii 78 */
    4,21, 4, 0,-1,-1, 4,21,18, 0,-1,-1,18,21,18, 0,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   21,22, /* Ascii 79 */
    9,21, 7,20, 5,18, 4,16, 3,13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0,13, 0,15,
    1,17, 3,18, 5,19, 8,19,13,18,16,17,18,15,20,13,21, 9,21,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   13,21, /* Ascii 80 */
    4,21, 4, 0,-1,-1, 4,21,13,21,16,20,17,19,18,17,18,14,17,12,16,11,13,
   10, 4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   24,22, /* Ascii 81 */
    9,21, 7,20, 5,18, 4,16, 3,13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0,13, 0,15,
    1,17, 3,18, 5,19, 8,19,13,18,16,17,18,15,20,13,21, 9,21,-1,-1,12, 4,
   18,-2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   16,21, /* Ascii 82 */
    4,21, 4, 0,-1,-1, 4,21,13,21,16,20,17,19,18,17,18,15,17,13,16,12,13,
   11, 4,11,-1,-1,11,11,18, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   20,20, /* Ascii 83 */
   17,18,15,20,12,21, 8,21, 5,20, 3,18, 3,16, 4,14, 5,13, 7,12,13,10,15,
    9,16, 8,17, 6,17, 3,15, 1,12, 0, 8, 0, 5, 1, 3, 3,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,16, /* Ascii 84 */
    8,21, 8, 0,-1,-1, 1,21,15,21,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   10,22, /* Ascii 85 */
    4,21, 4, 6, 5, 3, 7, 1,10, 0,12, 0,15, 1,17, 3,18, 6,18,21,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,18, /* Ascii 86 */
    1,21, 9, 0,-1,-1,17,21, 9, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   11,24, /* Ascii 87 */
    2,21, 7, 0,-1,-1,12,21, 7, 0,-1,-1,12,21,17, 0,-1,-1,22,21,17, 0,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,20, /* Ascii 88 */
    3,21,17, 0,-1,-1,17,21, 3, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    6,18, /* Ascii 89 */
    1,21, 9,11, 9, 0,-1,-1,17,21, 9,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,20, /* Ascii 90 */
   17,21, 3, 0,-1,-1, 3,21,17,21,-1,-1, 3, 0,17, 0,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   11,14, /* Ascii 91 */
    4,25, 4,-7,-1,-1, 5,25, 5,-7,-1,-1, 4,25,11,25,-1,-1, 4,-7,11,-7,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    2,14, /* Ascii 92 */
    0,21,14,-3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   11,14, /* Ascii 93 */
    9,25, 9,-7,-1,-1,10,25,10,-7,-1,-1, 3,25,10,25,-1,-1, 3,-7,10,-7,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   10,16, /* Ascii 94 */
    6,15, 8,18,10,15,-1,-1, 3,12, 8,17,13,12,-1,-1, 8,17, 8, 0,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    2,16, /* Ascii 95 */
    0,-2,16,-2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    7,10, /* Ascii 96 */
    6,21, 5,20, 4,18, 4,16, 5,15, 6,16, 5,17,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   17,19, /* Ascii 97 */
   15,14,15, 0,-1,-1,15,11,13,13,11,14, 8,14, 6,13, 4,11, 3, 8, 3, 6, 4,
    3, 6, 1, 8, 0,11, 0,13, 1,15, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   17,19, /* Ascii 98 */
    4,21, 4, 0,-1,-1, 4,11, 6,13, 8,14,11,14,13,13,15,11,16, 8,16, 6,15,
    3,13, 1,11, 0, 8, 0, 6, 1, 4, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   14,18, /* Ascii 99 */
   15,11,13,13,11,14, 8,14, 6,13, 4,11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0,11,
    0,13, 1,15, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   17,19, /* Ascii 100 */
   15,21,15, 0,-1,-1,15,11,13,13,11,14, 8,14, 6,13, 4,11, 3, 8, 3, 6, 4,
    3, 6, 1, 8, 0,11, 0,13, 1,15, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   17,18, /* Ascii 101 */
    3, 8,15, 8,15,10,14,12,13,13,11,14, 8,14, 6,13, 4,11, 3, 8, 3, 6, 4,
    3, 6, 1, 8, 0,11, 0,13, 1,15, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,12, /* Ascii 102 */
   10,21, 8,21, 6,20, 5,17, 5, 0,-1,-1, 2,14, 9,14,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   22,19, /* Ascii 103 */
   15,14,15,-2,14,-5,13,-6,11,-7, 8,-7, 6,-6,-1,-1,15,11,13,13,11,14, 8,
   14, 6,13, 4,11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0,11, 0,13, 1,15, 3,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   10,19, /* Ascii 104 */
    4,21, 4, 0,-1,-1, 4,10, 7,13, 9,14,12,14,14,13,15,10,15, 0,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8, 8, /* Ascii 105 */
    3,21, 4,20, 5,21, 4,22, 3,21,-1,-1, 4,14, 4, 0,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   11,10, /* Ascii 106 */
    5,21, 6,20, 7,21, 6,22, 5,21,-1,-1, 6,14, 6,-3, 5,-6, 3,-7, 1,-7,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,17, /* Ascii 107 */
    4,21, 4, 0,-1,-1,14,14, 4, 4,-1,-1, 8, 8,15, 0,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    2, 8, /* Ascii 108 */
    4,21, 4, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   18,30, /* Ascii 109 */
    4,14, 4, 0,-1,-1, 4,10, 7,13, 9,14,12,14,14,13,15,10,15, 0,-1,-1,15,
   10,18,13,20,14,23,14,25,13,26,10,26, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   10,19, /* Ascii 110 */
    4,14, 4, 0,-1,-1, 4,10, 7,13, 9,14,12,14,14,13,15,10,15, 0,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   17,19, /* Ascii 111 */
    8,14, 6,13, 4,11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0,11, 0,13, 1,15, 3,16,
    6,16, 8,15,11,13,13,11,14, 8,14,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   17,19, /* Ascii 112 */
    4,14, 4,-7,-1,-1, 4,11, 6,13, 8,14,11,14,13,13,15,11,16, 8,16, 6,15,
    3,13, 1,11, 0, 8, 0, 6, 1, 4, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   17,19, /* Ascii 113 */
   15,14,15,-7,-1,-1,15,11,13,13,11,14, 8,14, 6,13, 4,11, 3, 8, 3, 6, 4,
    3, 6, 1, 8, 0,11, 0,13, 1,15, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,13, /* Ascii 114 */
    4,14, 4, 0,-1,-1, 4, 8, 5,11, 7,13, 9,14,12,14,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   17,17, /* Ascii 115 */
   14,11,13,13,10,14, 7,14, 4,13, 3,11, 4, 9, 6, 8,11, 7,13, 6,14, 4,14,
    3,13, 1,10, 0, 7, 0, 4, 1, 3, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,12, /* Ascii 116 */
    5,21, 5, 4, 6, 1, 8, 0,10, 0,-1,-1, 2,14, 9,14,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   10,19, /* Ascii 117 */
    4,14, 4, 4, 5, 1, 7, 0,10, 0,12, 1,15, 4,-1,-1,15,14,15, 0,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,16, /* Ascii 118 */
    2,14, 8, 0,-1,-1,14,14, 8, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   11,22, /* Ascii 119 */
    3,14, 7, 0,-1,-1,11,14, 7, 0,-1,-1,11,14,15, 0,-1,-1,19,14,15, 0,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    5,17, /* Ascii 120 */
    3,14,14, 0,-1,-1,14,14, 3, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    9,16, /* Ascii 121 */
    2,14, 8, 0,-1,-1,14,14, 8, 0, 6,-4, 4,-6, 2,-7, 1,-7,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    8,17, /* Ascii 122 */
   14,14, 3, 0,-1,-1, 3,14,14,14,-1,-1, 3, 0,14, 0,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   39,14, /* Ascii 123 */
    9,25, 7,24, 6,23, 5,21, 5,19, 6,17, 7,16, 8,14, 8,12, 6,10,-1,-1, 7,
   24, 6,22, 6,20, 7,18, 8,17, 9,15, 9,13, 8,11, 4, 9, 8, 7, 9, 5, 9, 3,
    8, 1, 7, 0, 6,-2, 6,-4, 7,-6,-1,-1, 6, 8, 8, 6, 8, 4, 7, 2, 6, 1, 5,
   -1, 5,-3, 6,-5, 7,-6, 9,-7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    2, 8, /* Ascii 124 */
    4,25, 4,-7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   39,14, /* Ascii 125 */
    5,25, 7,24, 8,23, 9,21, 9,19, 8,17, 7,16, 6,14, 6,12, 8,10,-1,-1, 7,
   24, 8,22, 8,20, 7,18, 6,17, 5,15, 5,13, 6,11,10, 9, 6, 7, 5, 5, 5, 3,
    6, 1, 7, 0, 8,-2, 8,-4, 7,-6,-1,-1, 8, 8, 6, 6, 6, 4, 7, 2, 8, 1, 9,
   -1, 9,-3, 8,-5, 7,-6, 5,-7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   23,24, /* Ascii 126 */
    3, 6, 3, 8, 4,11, 6,12, 8,12,10,11,14, 8,16, 7,18, 7,20, 8,21,10,-1,
   -1, 3, 8, 4,10, 6,11, 8,11,10,10,14, 7,16, 6,18, 6,20, 7,21,10,21,12,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
];

module.exports = {
  vector_char,
  vector_text
}


/***/ }),
/* 50 */
/***/ (function(module, exports) {

function echo () {
  console.warn('echo() will be deprecated in the near future: please use console.log/warn/error instead')
  var s = '', a = arguments
  for (var i = 0; i < a.length; i++) {
    if (i) s += ', '
    s += a[i]
  }
  // var t = (new Date()-global.time)/1000
  // console.log(t,s)
  console.log(s)
}

module.exports = {
  echo
}


/***/ }),
/* 51 */
/***/ (function(module, exports) {

function log (txt) {
  var timeInMs = Date.now()
  var prevtime// OpenJsCad.log.prevLogTime
  if (!prevtime) prevtime = timeInMs
  var deltatime = timeInMs - prevtime
  log.prevLogTime = timeInMs
  var timefmt = (deltatime * 0.001).toFixed(3)
  txt = '[' + timefmt + '] ' + txt
  if ((typeof (console) === 'object') && (typeof (console.log) === 'function')) {
    console.log(txt)
  } else if ((typeof (self) === 'object') && (typeof (self.postMessage) === 'function')) {
    self.postMessage({cmd: 'log', txt: txt})
  } else throw new Error('Cannot log')
}

// See Processor.setStatus()
// Note: leave for compatibility
function status (s) {
  log(s)
}

module.exports = {
  log,
  status
}


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var cylinder = scadApi.primitives3d.cylinder;


var Component = __webpack_require__(2);

var Cylinder = function (_Component) {
  _inherits(Cylinder, _Component);

  function Cylinder() {
    _classCallCheck(this, Cylinder);

    return _possibleConstructorReturn(this, (Cylinder.__proto__ || Object.getPrototypeOf(Cylinder)).apply(this, arguments));
  }

  _createClass(Cylinder, [{
    key: 'applyCsg',
    value: function applyCsg() {
      var args = {};
      if (this.props.radius != null) {
        if (typeof this.props.radius === 'number') {
          args.r = this.props.radius;
        } else {
          args.r1 = this.props.radius.start;
          args.r2 = this.props.radius.end;
        }
      }
      if (this.props.height != null) {
        args.h = this.props.height;
      }
      if (this.props.position != null) {
        args.start = this.props.position.start;
        args.end = this.props.position.end;
      }
      if (this.props.resolution != null) {
        args.fn = this.props.resolution;
      }
      if (this.props.center != null) {
        args.center = this.props.center;
      }

      return cylinder(args);
    }
  }]);

  return Cylinder;
}(Component);

module.exports = Cylinder;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var geodesicSphere = scadApi.primitives3d.geodesicSphere;


var Component = __webpack_require__(2);

var GeodesicSphere = function (_Component) {
  _inherits(GeodesicSphere, _Component);

  function GeodesicSphere(props) {
    _classCallCheck(this, GeodesicSphere);

    var _this = _possibleConstructorReturn(this, (GeodesicSphere.__proto__ || Object.getPrototypeOf(GeodesicSphere)).call(this, props));

    _this.props.center = _this.props.center || false;
    return _this;
  }

  _createClass(GeodesicSphere, [{
    key: 'applyCsg',
    value: function applyCsg() {
      return geodesicSphere(this.props);
    }
  }]);

  return GeodesicSphere;
}(Component);

module.exports = GeodesicSphere;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var polyhedron = scadApi.primitives3d.polyhedron;


var Component = __webpack_require__(2);

var Polyhedron = function (_Component) {
  _inherits(Polyhedron, _Component);

  function Polyhedron() {
    _classCallCheck(this, Polyhedron);

    return _possibleConstructorReturn(this, (Polyhedron.__proto__ || Object.getPrototypeOf(Polyhedron)).apply(this, arguments));
  }

  _createClass(Polyhedron, [{
    key: 'applyCsg',
    value: function applyCsg() {
      return polyhedron({ points: this.props.points, polygons: this.props.polygons });
    }
  }]);

  return Polyhedron;
}(Component);

module.exports = Polyhedron;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var sphere = scadApi.primitives3d.sphere;


var Component = __webpack_require__(2);

var Sphere = function (_Component) {
  _inherits(Sphere, _Component);

  function Sphere(props) {
    _classCallCheck(this, Sphere);

    var _this = _possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this, props));

    _this.props.center = _this.props.center || false;
    return _this;
  }

  _createClass(Sphere, [{
    key: 'applyCsg',
    value: function applyCsg() {
      return sphere(this.props);
    }
  }]);

  return Sphere;
}(Component);

module.exports = Sphere;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var torus = scadApi.primitives3d.torus;


var Component = __webpack_require__(2);

var Torus = function (_Component) {
  _inherits(Torus, _Component);

  function Torus(props) {
    _classCallCheck(this, Torus);

    var _this = _possibleConstructorReturn(this, (Torus.__proto__ || Object.getPrototypeOf(Torus)).call(this, props));

    _this.props.center = _this.props.center || false;
    return _this;
  }

  _createClass(Torus, [{
    key: 'applyCsg',
    value: function applyCsg() {
      return torus(this.props);
    }
  }]);

  return Torus;
}(Component);

module.exports = Torus;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var difference = scadApi.booleanOps.difference;


var Component = __webpack_require__(2);

var Difference = function (_Component) {
  _inherits(Difference, _Component);

  function Difference() {
    _classCallCheck(this, Difference);

    return _possibleConstructorReturn(this, (Difference.__proto__ || Object.getPrototypeOf(Difference)).apply(this, arguments));
  }

  _createClass(Difference, [{
    key: 'applyCsg',
    value: function applyCsg(renderedChildren) {
      return difference.apply(undefined, _toConsumableArray(renderedChildren));
    }
  }]);

  return Difference;
}(Component);

module.exports = Difference;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var center = scadApi.transformations.center;


var Component = __webpack_require__(2);

/**
TODO: remove? This doesn't seem to do anything.
*/
var Center = function (_Component) {
  _inherits(Center, _Component);

  function Center(props) {
    _classCallCheck(this, Center);

    var _this = _possibleConstructorReturn(this, (Center.__proto__ || Object.getPrototypeOf(Center)).call(this, props));

    _this.props.vector = props.vector;
    return _this;
  }

  _createClass(Center, [{
    key: 'applyCsg',
    value: function applyCsg(renderedChildren) {
      return center.apply(undefined, [this.props.vector].concat(_toConsumableArray(renderedChildren)));
    }
  }]);

  return Center;
}(Component);

module.exports = Center;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var mirror = scadApi.transformations.mirror;


var Component = __webpack_require__(2);

var Mirror = function (_Component) {
  _inherits(Mirror, _Component);

  function Mirror() {
    _classCallCheck(this, Mirror);

    return _possibleConstructorReturn(this, (Mirror.__proto__ || Object.getPrototypeOf(Mirror)).apply(this, arguments));
  }

  _createClass(Mirror, [{
    key: 'applyCsg',
    value: function applyCsg(renderedChildren) {
      return mirror.apply(undefined, [this.props.normal].concat(_toConsumableArray(renderedChildren)));
    }
  }]);

  return Mirror;
}(Component);

module.exports = Mirror;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var rotate = scadApi.transformations.rotate;


var Component = __webpack_require__(2);

var Rotate = function (_Component) {
  _inherits(Rotate, _Component);

  function Rotate() {
    _classCallCheck(this, Rotate);

    return _possibleConstructorReturn(this, (Rotate.__proto__ || Object.getPrototypeOf(Rotate)).apply(this, arguments));
  }

  _createClass(Rotate, [{
    key: 'applyCsg',
    value: function applyCsg(renderedChildren) {
      return rotate.apply(undefined, [this.props.vector].concat(_toConsumableArray(renderedChildren)));
    }
  }]);

  return Rotate;
}(Component);

module.exports = Rotate;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var scale = scadApi.transformations.scale;


var Component = __webpack_require__(2);

var Scale = function (_Component) {
  _inherits(Scale, _Component);

  function Scale() {
    _classCallCheck(this, Scale);

    return _possibleConstructorReturn(this, (Scale.__proto__ || Object.getPrototypeOf(Scale)).apply(this, arguments));
  }

  _createClass(Scale, [{
    key: 'applyCsg',
    value: function applyCsg(renderedChildren) {
      return scale.apply(undefined, [this.props.vector].concat(_toConsumableArray(renderedChildren)));
    }
  }]);

  return Scale;
}(Component);

module.exports = Scale;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scadApi = __webpack_require__(4);
var translate = scadApi.transformations.translate;


var Component = __webpack_require__(2);
var Union = __webpack_require__(30);

var Translate = function (_Component) {
  _inherits(Translate, _Component);

  function Translate() {
    _classCallCheck(this, Translate);

    return _possibleConstructorReturn(this, (Translate.__proto__ || Object.getPrototypeOf(Translate)).apply(this, arguments));
  }

  _createClass(Translate, [{
    key: 'applyCsg',
    value: function applyCsg(renderedChildren) {
      return translate.apply(undefined, [this.props.vector].concat(_toConsumableArray(renderedChildren)));
    }
  }]);

  return Translate;
}(Component);

module.exports = Translate;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

const Landau = __webpack_require__(14);
const {
  Component,
  Rotate,
  Translate,
  Scale,
  Center,
  Difference,
  Union,
  Cube,
  Cylinder
} = __webpack_require__(14);
const { ChamfCube, MirrorCopy } = __webpack_require__(64);

const config = __webpack_require__(65);

class CableChainBarrel extends Component {
  constructor(props) {
    super(props);
    this.height = config.cable_chain_height;
    this.width = config.cable_chain_width;
    this.length = config.cable_chain_length;
    this.wall = config.cable_chain_wall;
  }

  render() {
    const { width, length, height, wall } = this;

    const cube1 = Landau.createElement({
      elementName: Cube,
      attributes: {
        size: [width, length - 20, height],
        center: true
      },
      children: null
    });
    const cube2 = Landau.createElement({
      elementName: Center,
      attributes: {},
      children: [Landau.createElement({
        elementName: ChamfCube,
        attributes: {
          size: [width - 4 * wall, length, height - wall],
          chamfer: 2
        },
        children: null
      })]
    });
    const cube3 = Landau.createElement({
      elementName: Cube,
      attributes: {
        size: [2, (length - 15) / Math.cos(40), 2 * wall],
        center: true
      },
      children: null
    });

    const part = Landau.createElement({
      elementName: Union,
      attributes: {},
      children: [Landau.createElement({
        elementName: Difference,
        attributes: {},
        children: [Landau.createElement({
          elementName: Translate,
          attributes: {
            vector: [0, 0, height / 2]
          },
          children: [cube1]
        }), Landau.createElement({
          elementName: Translate,
          attributes: {
            vector: [0, 0, height / 2]
          },
          children: [cube2]
        }), Landau.createElement({
          elementName: Rotate,
          attributes: {
            vector: [0, 0, 50]
          },
          children: [cube3]
        })]
      })]
    });

    const coloredPart = part;
    // const coloredPart = color(css2rgb('springgreen'), part);
    return coloredPart;
  }
}

class CableChainMount1 extends Component {
  constructor() {
    super();
    this.height = config.cable_chain_height;
    this.width = config.cable_chain_width;
    this.length = config.cable_chain_length;
    this.rotation = config.cable_chain_pivot / 2;
    this.wall = config.cable_chain_wall;
    this.bump = config.cable_chain_bump;
    this.printer_slop = config.printer_slop;
  }

  render() {
    const { width, length, height, wall, printer_slop, rotation, bump } = this;
    const part = Landau.createElement({
      elementName: Union,
      attributes: {},
      children: [Landau.createElement({
        elementName: Difference,
        attributes: {},
        children: [, Landau.createElement({
          elementName: MirrorCopy,
          attributes: {
            normal: [1, 0, 0]
          },
          children: [Landau.createElement({
            elementName: Translate,
            attributes: {
              vector: [width / 2 - 3 * wall / 2 - printer_slop / 2, -length / 4, height / 2]
            },
            children: [Landau.createElement({
              elementName: Cube,
              attributes: {
                center: true,
                size: [wall - printer_slop, length / 2, height]
              },
              children: null
            })]
          })]
        }), , Landau.createElement({
          elementName: Translate,
          attributes: {
            vector: [0, -length / 2, 0]
          },
          children: [Landau.createElement({
            elementName: Scale,
            attributes: {
              vector: [1, Math.tan(30 * Math.PI / 180), 1]
            },
            children: [Landau.createElement({
              elementName: Rotate,
              attributes: {
                vector: [45, 0, 0]
              },
              children: [Landau.createElement({
                elementName: Cube,
                attributes: {
                  center: true,
                  size: [width + 2, height / 2 * Math.sqrt(2), height / 2 * Math.sqrt(2)]
                },
                children: null
              })]
            })]
          })]
        }), , Landau.createElement({
          elementName: Translate,
          attributes: {
            vector: [0, -length / 2, height]
          },
          children: [Landau.createElement({
            elementName: Difference,
            attributes: {},
            children: [Landau.createElement({
              elementName: Cube,
              attributes: {
                center: true,
                size: [width + 2, height, height]
              },
              children: null
            }), Landau.createElement({
              elementName: Translate,
              attributes: {
                vector: [0, height / 2, -height / 2]
              },
              children: [Landau.createElement({
                elementName: Rotate,
                attributes: {
                  vector: [0, 90, 0]
                },
                children: [Landau.createElement({
                  elementName: Cylinder,
                  attributes: {
                    fn: 32,
                    center: true,
                    h: width + 3,
                    r: height / 2
                  },
                  children: null
                })]
              })]
            })]
          })]
        }), , Landau.createElement({
          elementName: MirrorCopy,
          attributes: {
            normal: [1, 0, 0]
          },
          children: [Landau.createElement({
            elementName: Translate,
            attributes: {
              vector: [(width - wall) / 2, 0, height / 2]
            },
            children: [Landau.createElement({
              elementName: Translate,
              attributes: {
                vector: [-wall / 2 - bump / 2, -length / 2 + rotation + 2.75 - printer_slop, 0]
              },
              children: [Landau.createElement({
                elementName: Rotate,
                attributes: {
                  vector: [0, 90, 0]
                },
                children: [Landau.createElement({
                  elementName: Cylinder,
                  attributes: {
                    fn: 32,
                    center: true,
                    h: bump + 0.05,
                    r1: rotation,
                    r2: rotation + bump
                  },
                  children: null
                })]
              })]
            })]
          })]
        })]
      })]
    });

    const coloredPart = part;
    // const coloredPart = color(css2rgb('springgreen'), part);
    return coloredPart;
  }
}

class CableChainMount2 extends Component {
  constructor() {
    super();
    this.height = config.cable_chain_height;
    this.width = config.cable_chain_width;
    this.length = config.cable_chain_length;
    this.rotation = config.cable_chain_pivot / 2;
    this.wall = config.cable_chain_wall;
    this.bump = config.cable_chain_bump;
    this.printer_slop = config.printer_slop;
  }

  render() {
    const { width, length, height, wall, printer_slop, rotation, bump } = this;
    const part = Landau.createElement({
      elementName: Union,
      attributes: {},
      children: [Landau.createElement({
        elementName: Difference,
        attributes: {},
        children: [Landau.createElement({
          elementName: MirrorCopy,
          attributes: {
            normal: [1, 0, 0]
          },
          children: [Landau.createElement({
            elementName: Translate,
            attributes: {
              vector: [(width - wall) / 2, 0, height / 2]
            },
            children: [Landau.createElement({
              elementName: Translate,
              attributes: {
                vector: [0, length / 4, 0]
              },
              children: [Landau.createElement({
                elementName: Cube,
                attributes: {
                  center: true,
                  size: [wall, length / 2, height]
                },
                children: null
              })]
            }), Landau.createElement({
              elementName: Translate,
              attributes: {
                vector: [0, length / 2 - height / 3, 0]
              },
              children: [Landau.createElement({
                elementName: Rotate,
                attributes: {
                  vector: [0, 90, 0]
                },
                children: [Landau.createElement({
                  elementName: Cylinder,
                  attributes: {
                    h: wall,
                    r: rotation + 1.333,
                    center: true,
                    fn: 64
                  },
                  children: null
                })]
              })]
            }), , Landau.createElement({
              elementName: Translate,
              attributes: {
                vector: [-wall / 2 - bump / 2, length / 2 - height / 3, 0]
              },
              children: [Landau.createElement({
                elementName: Rotate,
                attributes: {
                  vector: [0, 90, 0]
                },
                children: [Landau.createElement({
                  elementName: Cylinder,
                  attributes: {
                    h: bump,
                    r1: rotation,
                    r2: rotation + bump,
                    center: true,
                    fn: 32
                  },
                  children: null
                })]
              })]
            })]
          })]
        }), , Landau.createElement({
          elementName: Translate,
          attributes: {
            vector: [0, length / 2, height]
          },
          children: [[5, 15, 25, 35, 45].map(ang => Landau.createElement({
            elementName: Scale,
            attributes: {
              vector: [1, Math.sin(ang), Math.cos(ang)]
            },
            children: [Landau.createElement({
              elementName: Rotate,
              attributes: {
                vector: [45, 0, 0]
              },
              children: [Landau.createElement({
                elementName: Cube,
                attributes: {
                  center: true,
                  size: [width + 2, height / 2 * Math.sqrt(2), height / 2 * Math.sqrt(2)]
                },
                children: null
              })]
            })]
          }))]
        }), ]
      })]
    });

    const coloredPart = part;
    // const coloredPart = color(css2rgb('springgreen'), part);
    return coloredPart;
  }
}

module.exports = {
  CableChainBarrel,
  CableChainMount1,
  CableChainMount2
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

const Landau = __webpack_require__(14);
const {
  Component,
  Rotate,
  Translate,
  Scale,
  Difference,
  Union,
  Mirror,
  Cube,
  Polyhedron
} = __webpack_require__(14);

class ChamfCube extends Component {
  constructor(props) {
    super(props);
    this.props.size = this.props.size || [1, 1, 1];
    this.props.chamfer = this.props.chamfer || 0.25;
    this.props.chamfaxes = this.props.chamfaxes || [1, 1, 1];
    this.props.chamfcorners = this.props.chamfcorners || true;
  }

  render() {
    const { size, chamfer, chamfaxes, chamfcorners } = this.props;
    const ch_width = Math.sqrt(2) * chamfer;

    const basecube = Landau.createElement({
      elementName: Cube,
      attributes: {
        size: size,
        center: true
      },
      children: null
    });
    let substractions = [];
    for (let xs of [-1, 1]) {
      for (let ys of [-1, 1]) {
        if (chamfaxes[0] == 1) {
          substractions.push(Landau.createElement({
            elementName: Translate,
            attributes: {
              vector: [0, xs * size[1] / 2, ys * size[2] / 2]
            },
            children: [Landau.createElement({
              elementName: Rotate,
              attributes: {
                vector: [45, 0, 0]
              },
              children: [Landau.createElement({
                elementName: Cube,
                attributes: {
                  center: true,
                  size: [size[0] + 0.1, ch_width, ch_width]
                },
                children: null
              })]
            })]
          }));
        }
        if (chamfaxes[1] == 1) {
          substractions.push(Landau.createElement({
            elementName: Translate,
            attributes: {
              vector: [xs * size[0] / 2, 0, ys * size[2] / 2]
            },
            children: [Landau.createElement({
              elementName: Rotate,
              attributes: {
                vector: [0, 45, 0]
              },
              children: [Landau.createElement({
                elementName: Cube,
                attributes: {
                  center: true,
                  size: [ch_width, size[1] + 0.1, ch_width]
                },
                children: null
              })]
            })]
          }));
        }
        if (chamfaxes[2] == 1) {
          substractions.push(Landau.createElement({
            elementName: Translate,
            attributes: {
              vector: [xs * size[0] / 2, ys * size[1] / 2, 0]
            },
            children: [Landau.createElement({
              elementName: Rotate,
              attributes: {
                vector: [0, 0, 45]
              },
              children: [Landau.createElement({
                elementName: Cube,
                attributes: {
                  center: true,
                  size: [ch_width, ch_width, size[2] + 0.1]
                },
                children: null
              })]
            })]
          }));
        }
        if (chamfcorners) {
          for (let zs of [-1, 1]) {
            substractions.push(Landau.createElement({
              elementName: Translate,
              attributes: {
                vector: [xs * size[0] / 2, ys * size[1] / 2, zs * size[2] / 2]
              },
              children: [Landau.createElement({
                elementName: Scale,
                attributes: {
                  vector: [chamfer, chamfer, chamfer]
                },
                children: [Landau.createElement({
                  elementName: Polyhedron,
                  attributes: {
                    points: [[0, -1, -1], [0, -1, 1], [0, 1, 1], [0, 1, -1], [-1, 0, -1], [-1, 0, 1], [1, 0, 1], [1, 0, -1], [-1, -1, 0], [-1, 1, 0], [1, 1, 0], [1, -1, 0]],
                    polygons: [[8, 4, 9, 5], [9, 3, 10, 2], [10, 7, 11, 6], [11, 0, 8, 1], [0, 7, 3, 4], [1, 5, 2, 6], [1, 8, 5], [5, 9, 2], [2, 10, 6], [6, 11, 1], [0, 4, 8], [4, 3, 9], [3, 7, 10], [7, 0, 11]]
                  },
                  children: null
                })]
              })]
            }));
          }
        }
      }
    }

    return Landau.createElement({
      elementName: Difference,
      attributes: {},
      children: [[basecube, ...substractions]]
    });
  }
}

class MirrorCopy extends Component {
  constructor(props) {
    super(props);
    this.props.normal = this.props.normal || [0, 0, 1];
  }

  render() {
    const mirror = Landau.createElement({
      elementName: Mirror,
      attributes: {
        normal: this.props.normal,
        children: this.props.children
      },
      children: null
    });
    return Landau.createElement({
      elementName: Union,
      attributes: {
        children: [...this.props.children, mirror]
      },
      children: null
    });
  }
}

module.exports = {
  ChamfCube,
  MirrorCopy
};

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = {
  // Cable chain dimensions
  cable_chain_height: 13, // mm
  cable_chain_width: 25, // mm
  cable_chain_length: 26, // mm
  cable_chain_pivot: 6, // mm
  cable_chain_bump: 1, // mm
  cable_chain_wall: 3, // mm
  // This is the slop needed to make parts fit more exactly, and might be
  // printer and slicer dependant.  Printing a slop calibration block should
  // help dial this setting in for your printer.
  printer_slop: 0.20, // mm
  gear_backlash: 0 };

/***/ })
/******/ ]);