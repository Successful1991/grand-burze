(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports)
    : typeof define === 'function' && define.amd ? define(['exports'], factory)
      : (global = global || self, factory(global.window = global.window || {}))
}(this, (exports => {
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype)
    subClass.prototype.constructor = subClass
    subClass.__proto__ = superClass
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')
    }

    return self
  }

  /*!
   * GSAP 3.5.1
   * https://greensock.com
   *
   * @license Copyright 2008-2020, GreenSock. All rights reserved.
   * Subject to the terms at https://greensock.com/standard-license or for
   * Club GreenSock members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */
  const _config = {
    autoSleep: 120,
    force3D: 'auto',
    nullTargetWarn: 1,
    units: {
      lineHeight: '',
    },
  }
  const _defaults = {
    duration: 0.5,
    overwrite: false,
    delay: 0,
  }
  const _bigNum = 1e8
  const _tinyNum = 1 / _bigNum
  const _2PI = Math.PI * 2
  const _HALF_PI = _2PI / 4
  let _gsID = 0
  const _sqrt = Math.sqrt
  const _cos = Math.cos
  const _sin = Math.sin
  const _isString = function _isString(value) {
    return typeof value === 'string'
  }
  const _isFunction = function _isFunction(value) {
    return typeof value === 'function'
  }
  const _isNumber = function _isNumber(value) {
    return typeof value === 'number'
  }
  const _isUndefined = function _isUndefined(value) {
    return typeof value === 'undefined'
  }
  const _isObject = function _isObject(value) {
    return typeof value === 'object'
  }
  const _isNotFalse = function _isNotFalse(value) {
    return value !== false
  }
  const _windowExists = function _windowExists() {
    return typeof window !== 'undefined'
  }
  const _isFuncOrString = function _isFuncOrString(value) {
    return _isFunction(value) || _isString(value)
  }
  const _isTypedArray = typeof ArrayBuffer === 'function' && ArrayBuffer.isView || function () {}
  const _isArray = Array.isArray
  const _strictNumExp = /(?:-?\.?\d|\.)+/gi
  const _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-\+]*\d*/g
  const _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g
  const _complexStringNumExp = /[-+=.]*\d+(?:\.|e-|e)*\d*/gi
  const _relExp = /[+-]=-?[\.\d]+/
  const _delimitedValueExp = /[#\-+.]*\b[a-z\d-=+%.]+/gi
  let _globalTimeline
  let _win
  let _coreInitted
  let _doc
  const _globals = {}
  let _installScope = {}
  let _coreReady
  const _install = function _install(scope) {
    return (_installScope = _merge(scope, _globals)) && gsap
  }
  const _missingPlugin = function _missingPlugin(property, value) {
    return console.warn('Invalid property', property, 'set to', value, 'Missing plugin? gsap.registerPlugin()')
  }
  const _warn = function _warn(message, suppress) {
    return !suppress && console.warn(message)
  }
  const _addGlobal = function _addGlobal(name, obj) {
    return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals
  }
  const _emptyFunc = function _emptyFunc() {
    return 0
  }
  const _reservedProps = {}
  const _lazyTweens = []
  let _lazyLookup = {}
  let _lastRenderedFrame
  const _plugins = {}
  const _effects = {}
  let _nextGCFrame = 30
  const _harnessPlugins = []
  let _callbackNames = ''
  const _harness = function _harness(targets) {
    const target = targets[0]
    let harnessPlugin
    let i
    _isObject(target) || _isFunction(target) || (targets = [targets])

    if (!(harnessPlugin = (target._gsap || {}).harness)) {
      i = _harnessPlugins.length

      while (i-- && !_harnessPlugins[i].targetTest(target)) {}

      harnessPlugin = _harnessPlugins[i]
    }

    i = targets.length

    while (i--) {
      targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1)
    }

    return targets
  }
  const _getCache = function _getCache(target) {
    return target._gsap || _harness(toArray(target))[0]._gsap
  }
  const _getProperty = function _getProperty(target, property, v) {
    return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v
  }
  const _forEachName = function _forEachName(names, func) {
    return (names = names.split(',')).forEach(func) || names
  }
  const _round = function _round(value) {
    return Math.round(value * 100000) / 100000 || 0
  }
  const _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
    const l = toFind.length
    let i = 0

    for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}

    return i < l
  }
  const _parseVars = function _parseVars(params, type, parent) {
    const isLegacy = _isNumber(params[1])
    const varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1)
    const vars = params[varsIndex]
    let irVars

    isLegacy && (vars.duration = params[1])
    vars.parent = parent

    if (type) {
      irVars = vars

      while (parent && !('immediateRender' in irVars)) {
        irVars = parent.vars.defaults || {}
        parent = _isNotFalse(parent.vars.inherit) && parent.parent
      }

      vars.immediateRender = _isNotFalse(irVars.immediateRender)
      type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1]
    }

    return vars
  }
  const _lazyRender = function _lazyRender() {
    const l = _lazyTweens.length
    const a = _lazyTweens.slice(0)
    let i
    let tween

    _lazyLookup = {}
    _lazyTweens.length = 0

    for (i = 0; i < l; i++) {
      tween = a[i]
      tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0)
    }
  }
  const _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
    _lazyTweens.length && _lazyRender()
    animation.render(time, suppressEvents, force)
    _lazyTweens.length && _lazyRender()
  }
  const _numericIfPossible = function _numericIfPossible(value) {
    const n = parseFloat(value)
    return (n || n === 0) && (`${value}`).match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value
  }
  const _passThrough = function _passThrough(p) {
    return p
  }
  const _setDefaults = function _setDefaults(obj, defaults) {
    for (const p in defaults) {
      p in obj || (obj[p] = defaults[p])
    }

    return obj
  }
  const _setKeyframeDefaults = function _setKeyframeDefaults(obj, defaults) {
    for (const p in defaults) {
      p in obj || p === 'duration' || p === 'ease' || (obj[p] = defaults[p])
    }
  }
  var _merge = function _merge(base, toMerge) {
    for (const p in toMerge) {
      base[p] = toMerge[p]
    }

    return base
  }
  const _mergeDeep = function _mergeDeep(base, toMerge) {
    for (const p in toMerge) {
      base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]
    }

    return base
  }
  const _copyExcluding = function _copyExcluding(obj, excluding) {
    const copy = {}
    let p

    for (p in obj) {
      p in excluding || (copy[p] = obj[p])
    }

    return copy
  }
  const _inheritDefaults = function _inheritDefaults(vars) {
    let parent = vars.parent || _globalTimeline
    const func = vars.keyframes ? _setKeyframeDefaults : _setDefaults

    if (_isNotFalse(vars.inherit)) {
      while (parent) {
        func(vars, parent.vars.defaults)
        parent = parent.parent || parent._dp
      }
    }

    return vars
  }
  const _arraysMatch = function _arraysMatch(a1, a2) {
    let i = a1.length
    const match = i === a2.length

    while (match && i-- && a1[i] === a2[i]) {}

    return i < 0
  }
  const _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
    if (firstProp === void 0) {
      firstProp = '_first'
    }

    if (lastProp === void 0) {
      lastProp = '_last'
    }

    let prev = parent[lastProp]
    let t

    if (sortBy) {
      t = child[sortBy]

      while (prev && prev[sortBy] > t) {
        prev = prev._prev
      }
    }

    if (prev) {
      child._next = prev._next
      prev._next = child
    } else {
      child._next = parent[firstProp]
      parent[firstProp] = child
    }

    if (child._next) {
      child._next._prev = child
    } else {
      parent[lastProp] = child
    }

    child._prev = prev
    child.parent = child._dp = parent
    return child
  }
  const _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
    if (firstProp === void 0) {
      firstProp = '_first'
    }

    if (lastProp === void 0) {
      lastProp = '_last'
    }

    const prev = child._prev
    const next = child._next

    if (prev) {
      prev._next = next
    } else if (parent[firstProp] === child) {
      parent[firstProp] = next
    }

    if (next) {
      next._prev = prev
    } else if (parent[lastProp] === child) {
      parent[lastProp] = prev
    }

    child._next = child._prev = child.parent = null
  }
  const _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
    child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove(child)
    child._act = 0
  }
  const _uncache = function _uncache(animation, child) {
    if (animation && (!child || child._end > animation._dur || child._start < 0)) {
      let a = animation

      while (a) {
        a._dirty = 1
        a = a.parent
      }
    }

    return animation
  }
  const _recacheAncestors = function _recacheAncestors(animation) {
    let { parent } = animation

    while (parent && parent.parent) {
      parent._dirty = 1
      parent.totalDuration()
      parent = parent.parent
    }

    return animation
  }
  const _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
    return !animation || animation._ts && _hasNoPausedAncestors(animation.parent)
  }
  const _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
    return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0
  }
  var _animationCycle = function _animationCycle(tTime, cycleDuration) {
    return (tTime /= cycleDuration) && ~~tTime === tTime ? ~~tTime - 1 : ~~tTime
  }
  const _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
    return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur)
  }
  const _setEnd = function _setEnd(animation) {
    return animation._end = _round(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0))
  }
  const _alignPlayhead = function _alignPlayhead(animation, totalTime) {
    const parent = animation._dp

    if (parent && parent.smoothChildTiming && animation._ts) {
      animation._start = _round(animation._dp._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts))

      _setEnd(animation)

      parent._dirty || _uncache(parent, animation)
    }

    return animation
  }
  const _postAddChecks = function _postAddChecks(timeline, child) {
    let t

    if (child._time || child._initted && !child._dur) {
      t = _parentToChildTotalTime(timeline.rawTime(), child)

      if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
        child.render(t, true)
      }
    }

    if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
      if (timeline._dur < timeline.duration()) {
        t = timeline

        while (t._dp) {
          t.rawTime() >= 0 && t.totalTime(t._tTime)
          t = t._dp
        }
      }

      timeline._zTime = -_tinyNum
    }
  }
  const _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
    child.parent && _removeFromParent(child)
    child._start = _round(position + child._delay)
    child._end = _round(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0))

    _addLinkedListItem(timeline, child, '_first', '_last', timeline._sort ? '_start' : 0)

    timeline._recent = child
    skipChecks || _postAddChecks(timeline, child)
    return timeline
  }
  const _scrollTrigger = function _scrollTrigger(animation, trigger) {
    return (_globals.ScrollTrigger || _missingPlugin('scrollTrigger', trigger)) && _globals.ScrollTrigger.create(trigger, animation)
  }
  const _attemptInitTween = function _attemptInitTween(tween, totalTime, force, suppressEvents) {
    _initTween(tween, totalTime)

    if (!tween._initted) {
      return 1
    }

    if (!force && tween._pt && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
      _lazyTweens.push(tween)

      tween._lazy = [totalTime, suppressEvents]
      return 1
    }
  }
  const _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
    let prevRatio = tween.ratio
    let ratio = totalTime < 0 || !totalTime && prevRatio && !tween._start && tween._zTime > _tinyNum && !tween._dp._lock || (tween._ts < 0 || tween._dp._ts < 0) && tween.data !== 'isFromStart' && tween.data !== 'isStart' ? 0 : 1
    const repeatDelay = tween._rDelay
    let tTime = 0
    let pt
    let iteration
    let prevIteration

    if (repeatDelay && tween._repeat) {
      tTime = _clamp(0, tween._tDur, totalTime)
      iteration = _animationCycle(tTime, repeatDelay)
      prevIteration = _animationCycle(tween._tTime, repeatDelay)

      if (iteration !== prevIteration) {
        prevRatio = 1 - ratio
        tween.vars.repeatRefresh && tween._initted && tween.invalidate()
      }
    }

    if (ratio !== prevRatio || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
      if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) {
        return
      }

      prevIteration = tween._zTime
      tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0)
      suppressEvents || (suppressEvents = totalTime && !prevIteration)
      tween.ratio = ratio
      tween._from && (ratio = 1 - ratio)
      tween._time = 0
      tween._tTime = tTime
      suppressEvents || _callback(tween, 'onStart')
      pt = tween._pt

      while (pt) {
        pt.r(ratio, pt.d)
        pt = pt._next
      }

      tween._startAt && totalTime < 0 && tween._startAt.render(totalTime, true, true)
      tween._onUpdate && !suppressEvents && _callback(tween, 'onUpdate')
      tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, 'onRepeat')

      if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
        ratio && _removeFromParent(tween, 1)

        if (!suppressEvents) {
          _callback(tween, ratio ? 'onComplete' : 'onReverseComplete', true)

          tween._prom && tween._prom()
        }
      }
    } else if (!tween._zTime) {
      tween._zTime = totalTime
    }
  }
  const _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
    let child

    if (time > prevTime) {
      child = animation._first

      while (child && child._start <= time) {
        if (!child._dur && child.data === 'isPause' && child._start > prevTime) {
          return child
        }

        child = child._next
      }
    } else {
      child = animation._last

      while (child && child._start >= time) {
        if (!child._dur && child.data === 'isPause' && child._start < prevTime) {
          return child
        }

        child = child._prev
      }
    }
  }
  const _setDuration = function _setDuration(animation, duration, skipUncache, leavePlayhead) {
    const repeat = animation._repeat
    const dur = _round(duration) || 0
    const totalProgress = animation._tTime / animation._tDur
    totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur)
    animation._dur = dur
    animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _round(dur * (repeat + 1) + animation._rDelay * repeat)
    totalProgress && !leavePlayhead ? _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress) : animation.parent && _setEnd(animation)
    skipUncache || _uncache(animation.parent, animation)
    return animation
  }
  const _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
    return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur)
  }
  const _zeroPosition = {
    _start: 0,
    endTime: _emptyFunc,
  }
  const _parsePosition = function _parsePosition(animation, position) {
    const { labels } = animation
    const recent = animation._recent || _zeroPosition
    const clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur
    let i
    let offset

    if (_isString(position) && (isNaN(position) || position in labels)) {
      i = position.charAt(0)

      if (i === '<' || i === '>') {
        return (i === '<' ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0)
      }

      i = position.indexOf('=')

      if (i < 0) {
        position in labels || (labels[position] = clippedDuration)
        return labels[position]
      }

      offset = +(position.charAt(i - 1) + position.substr(i + 1))
      return i > 1 ? _parsePosition(animation, position.substr(0, i - 1)) + offset : clippedDuration + offset
    }

    return position == null ? clippedDuration : +position
  }
  const _conditionalReturn = function _conditionalReturn(value, func) {
    return value || value === 0 ? func(value) : func
  }
  var _clamp = function _clamp(min, max, value) {
    return value < min ? min : value > max ? max : value
  }
  const getUnit = function getUnit(value) {
    return (value = (`${value}`).substr((`${parseFloat(value)}`).length)) && isNaN(value) ? value : ''
  }
  const clamp = function clamp(min, max, value) {
    return _conditionalReturn(value, v => _clamp(min, max, v))
  }
  const _slice = [].slice
  const _isArrayLike = function _isArrayLike(value, nonEmpty) {
    return value && _isObject(value) && 'length' in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win
  }
  const _flatten = function _flatten(ar, leaveStrings, accumulator) {
    if (accumulator === void 0) {
      accumulator = []
    }

    return ar.forEach(value => {
      let _accumulator

      return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value)
    }) || accumulator
  }
  var toArray = function toArray(value, leaveStrings) {
    return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call(_doc.querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : []
  }
  const shuffle = function shuffle(a) {
    return a.sort(() => 0.5 - Math.random())
  }
  const distribute = function distribute(v) {
    if (_isFunction(v)) {
      return v
    }

    const vars = _isObject(v) ? v : {
      each: v,
    }
    let ease = _parseEase(vars.ease)
    const from = vars.from || 0
    const base = parseFloat(vars.base) || 0
    const cache = {}
    const isDecimal = from > 0 && from < 1
    const ratios = isNaN(from) || isDecimal
    const { axis } = vars
    let ratioX = from
    let ratioY = from

    if (_isString(from)) {
      ratioX = ratioY = {
        center: 0.5,
        edges: 0.5,
        end: 1,
      }[from] || 0
    } else if (!isDecimal && ratios) {
      ratioX = from[0]
      ratioY = from[1]
    }

    return function (i, target, a) {
      let l = (a || vars).length
      let distances = cache[l]
      let originX
      let originY
      let x
      let y
      let d
      let j
      let max
      let min
      let wrapAt

      if (!distances) {
        wrapAt = vars.grid === 'auto' ? 0 : (vars.grid || [1, _bigNum])[1]

        if (!wrapAt) {
          max = -_bigNum

          while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}

          wrapAt--
        }

        distances = cache[l] = []
        originX = ratios ? Math.min(wrapAt, l) * ratioX - 0.5 : from % wrapAt
        originY = ratios ? l * ratioY / wrapAt - 0.5 : from / wrapAt | 0
        max = 0
        min = _bigNum

        for (j = 0; j < l; j++) {
          x = j % wrapAt - originX
          y = originY - (j / wrapAt | 0)
          distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === 'y' ? y : x)
          d > max && (max = d)
          d < min && (min = d)
        }

        from === 'random' && shuffle(distances)
        distances.max = max - min
        distances.min = min
        distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === 'y' ? l / wrapAt : wrapAt) || 0) * (from === 'edges' ? -1 : 1)
        distances.b = l < 0 ? base - l : base
        distances.u = getUnit(vars.amount || vars.each) || 0
        ease = ease && l < 0 ? _invertEase(ease) : ease
      }

      l = (distances[i] - distances.min) / distances.max || 0
      return _round(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u
    }
  }
  const _roundModifier = function _roundModifier(v) {
    const p = v < 1 ? Math.pow(10, (`${v}`).length - 2) : 1
    return function (raw) {
      return Math.floor(Math.round(parseFloat(raw) / v) * v * p) / p + (_isNumber(raw) ? 0 : getUnit(raw))
    }
  }
  const snap = function snap(snapTo, value) {
    let isArray = _isArray(snapTo)
    let radius
    let is2D

    if (!isArray && _isObject(snapTo)) {
      radius = isArray = snapTo.radius || _bigNum

      if (snapTo.values) {
        snapTo = toArray(snapTo.values)

        if (is2D = !_isNumber(snapTo[0])) {
          radius *= radius
        }
      } else {
        snapTo = _roundModifier(snapTo.increment)
      }
    }

    return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? raw => {
      is2D = snapTo(raw)
      return Math.abs(is2D - raw) <= radius ? is2D : raw
    } : raw => {
      const x = parseFloat(is2D ? raw.x : raw)
      const y = parseFloat(is2D ? raw.y : 0)
      let min = _bigNum
      let closest = 0
      let i = snapTo.length
      let dx
      let dy

      while (i--) {
        if (is2D) {
          dx = snapTo[i].x - x
          dy = snapTo[i].y - y
          dx = dx * dx + dy * dy
        } else {
          dx = Math.abs(snapTo[i] - x)
        }

        if (dx < min) {
          min = dx
          closest = i
        }
      }

      closest = !radius || min <= radius ? snapTo[closest] : raw
      return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw)
    })
  }
  const random = function random(min, max, roundingIncrement, returnFunction) {
    return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, () => (_isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (`${roundingIncrement}`).length - 2) : 1) && Math.floor(Math.round((min + Math.random() * (max - min)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction))
  }
  const pipe = function pipe() {
    for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
      functions[_key] = arguments[_key]
    }

    return function (value) {
      return functions.reduce((v, f) => f(v), value)
    }
  }
  const unitize = function unitize(func, unit) {
    return function (value) {
      return func(parseFloat(value)) + (unit || getUnit(value))
    }
  }
  const normalize = function normalize(min, max, value) {
    return mapRange(min, max, 0, 1, value)
  }
  const _wrapArray = function _wrapArray(a, wrapper, value) {
    return _conditionalReturn(value, index => a[~~wrapper(index)])
  }
  const wrap = function wrap(min, max, value) {
    const range = max - min
    return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, value => (range + (value - min) % range) % range + min)
  }
  const wrapYoyo = function wrapYoyo(min, max, value) {
    const range = max - min
    const total = range * 2
    return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, value => {
      value = (total + (value - min) % total) % total || 0
      return min + (value > range ? total - value : value)
    })
  }
  const _replaceRandom = function _replaceRandom(value) {
    let prev = 0
    let s = ''
    let i
    let nums
    let end
    let isArray

    while (~(i = value.indexOf('random(', prev))) {
      end = value.indexOf(')', i)
      isArray = value.charAt(i + 7) === '['
      nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp)
      s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5)
      prev = end + 1
    }

    return s + value.substr(prev, value.length - prev)
  }
  var mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
    const inRange = inMax - inMin
    const outRange = outMax - outMin
    return _conditionalReturn(value, value => outMin + ((value - inMin) / inRange * outRange || 0))
  }
  const interpolate = function interpolate(start, end, progress, mutate) {
    let func = isNaN(start + end) ? 0 : function (p) {
      return (1 - p) * start + p * end
    }

    if (!func) {
      const isString = _isString(start)
      const master = {}
      let p
      let i
      let interpolators
      let l
      let il

      progress === true && (mutate = 1) && (progress = null)

      if (isString) {
        start = {
          p: start,
        }
        end = {
          p: end,
        }
      } else if (_isArray(start) && !_isArray(end)) {
        interpolators = []
        l = start.length
        il = l - 2

        for (i = 1; i < l; i++) {
          interpolators.push(interpolate(start[i - 1], start[i]))
        }

        l--

        func = function func(p) {
          p *= l
          const i = Math.min(il, ~~p)
          return interpolators[i](p - i)
        }

        progress = end
      } else if (!mutate) {
        start = _merge(_isArray(start) ? [] : {}, start)
      }

      if (!interpolators) {
        for (p in end) {
          _addPropTween.call(master, start, p, 'get', end[p])
        }

        func = function func(p) {
          return _renderPropTweens(p, master) || (isString ? start.p : start)
        }
      }
    }

    return _conditionalReturn(progress, func)
  }
  const _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
    const { labels } = timeline
    let min = _bigNum
    let p
    let distance
    let label

    for (p in labels) {
      distance = labels[p] - fromTime

      if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
        label = p
        min = distance
      }
    }

    return label
  }
  var _callback = function _callback(animation, type, executeLazyFirst) {
    const v = animation.vars
    const callback = v[type]
    let params
    let scope

    if (!callback) {
      return
    }

    params = v[`${type}Params`]
    scope = v.callbackScope || animation
    executeLazyFirst && _lazyTweens.length && _lazyRender()
    return params ? callback.apply(scope, params) : callback.call(scope)
  }
  const _interrupt = function _interrupt(animation) {
    _removeFromParent(animation)

    animation.progress() < 1 && _callback(animation, 'onInterrupt')
    return animation
  }
  let _quickTween
  const _createPlugin = function _createPlugin(config) {
    config = !config.name && config['default'] || config

    let { name } = config
    const isFunc = _isFunction(config)
    const Plugin = name && !isFunc && config.init ? function () {
      this._props = []
    } : config
    const instanceDefaults = {
      init: _emptyFunc,
      render: _renderPropTweens,
      add: _addPropTween,
      kill: _killPropTweensOf,
      modifier: _addPluginModifier,
      rawVars: 0,
    }
    const statics = {
      targetTest: 0,
      get: 0,
      getSetter: _getSetter,
      aliases: {},
      register: 0,
    }

    _wake()

    if (config !== Plugin) {
      if (_plugins[name]) {
        return
      }

      _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics))

      _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics)))

      _plugins[Plugin.prop = name] = Plugin

      if (config.targetTest) {
        _harnessPlugins.push(Plugin)

        _reservedProps[name] = 1
      }

      name = `${name === 'css' ? 'CSS' : name.charAt(0).toUpperCase() + name.substr(1)}Plugin`
    }

    _addGlobal(name, Plugin)

    config.register && config.register(gsap, Plugin, PropTween)
  }
  const _255 = 255
  const _colorLookup = {
    aqua: [0, _255, _255],
    lime: [0, _255, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, _255],
    navy: [0, 0, 128],
    white: [_255, _255, _255],
    olive: [128, 128, 0],
    yellow: [_255, _255, 0],
    orange: [_255, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [_255, 0, 0],
    pink: [_255, 192, 203],
    cyan: [0, _255, _255],
    transparent: [_255, _255, _255, 0],
  }
  const _hue = function _hue(h, m1, m2) {
    h = h < 0 ? h + 1 : h > 1 ? h - 1 : h
    return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < 0.5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + 0.5 | 0
  }
  const splitColor = function splitColor(v, toHSL, forceAlpha) {
    let a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0
    let r
    let g
    let b
    let h
    let s
    let l
    let max
    let min
    let d
    let wasHSL

    if (!a) {
      if (v.substr(-1) === ',') {
        v = v.substr(0, v.length - 1)
      }

      if (_colorLookup[v]) {
        a = _colorLookup[v]
      } else if (v.charAt(0) === '#') {
        if (v.length === 4) {
          r = v.charAt(1)
          g = v.charAt(2)
          b = v.charAt(3)
          v = `#${r}${r}${g}${g}${b}${b}`
        }

        v = parseInt(v.substr(1), 16)
        a = [v >> 16, v >> 8 & _255, v & _255]
      } else if (v.substr(0, 3) === 'hsl') {
        a = wasHSL = v.match(_strictNumExp)

        if (!toHSL) {
          h = +a[0] % 360 / 360
          s = +a[1] / 100
          l = +a[2] / 100
          g = l <= 0.5 ? l * (s + 1) : l + s - l * s
          r = l * 2 - g
          a.length > 3 && (a[3] *= 1)
          a[0] = _hue(h + 1 / 3, r, g)
          a[1] = _hue(h, r, g)
          a[2] = _hue(h - 1 / 3, r, g)
        } else if (~v.indexOf('=')) {
          a = v.match(_numExp)
          forceAlpha && a.length < 4 && (a[3] = 1)
          return a
        }
      } else {
        a = v.match(_strictNumExp) || _colorLookup.transparent
      }

      a = a.map(Number)
    }

    if (toHSL && !wasHSL) {
      r = a[0] / _255
      g = a[1] / _255
      b = a[2] / _255
      max = Math.max(r, g, b)
      min = Math.min(r, g, b)
      l = (max + min) / 2

      if (max === min) {
        h = s = 0
      } else {
        d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
        h *= 60
      }

      a[0] = ~~(h + 0.5)
      a[1] = ~~(s * 100 + 0.5)
      a[2] = ~~(l * 100 + 0.5)
    }

    forceAlpha && a.length < 4 && (a[3] = 1)
    return a
  }
  const _colorOrderData = function _colorOrderData(v) {
    const values = []
    const c = []
    let i = -1
    v.split(_colorExp).forEach(v => {
      const a = v.match(_numWithUnitExp) || []
      values.push.apply(values, a)
      c.push(i += a.length + 1)
    })
    values.c = c
    return values
  }
  const _formatColors = function _formatColors(s, toHSL, orderMatchData) {
    let result = ''
    let colors = (s + result).match(_colorExp)
    const type = toHSL ? 'hsla(' : 'rgba('
    let i = 0
    let c
    let shell
    let d
    let l

    if (!colors) {
      return s
    }

    colors = colors.map(color => (color = splitColor(color, toHSL, 1)) && `${type + (toHSL ? `${color[0]},${color[1]}%,${color[2]}%,${color[3]}` : color.join(','))})`)

    if (orderMatchData) {
      d = _colorOrderData(s)
      c = orderMatchData.c

      if (c.join(result) !== d.c.join(result)) {
        shell = s.replace(_colorExp, '1').split(_numWithUnitExp)
        l = shell.length - 1

        for (; i < l; i++) {
          result += shell[i] + (~c.indexOf(i) ? colors.shift() || `${type}0,0,0,0)` : (d.length ? d : colors.length ? colors : orderMatchData).shift())
        }
      }
    }

    if (!shell) {
      shell = s.split(_colorExp)
      l = shell.length - 1

      for (; i < l; i++) {
        result += shell[i] + colors[i]
      }
    }

    return result + shell[l]
  }
  var _colorExp = (function () {
    let s = '(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b'
    let p

    for (p in _colorLookup) {
      s += `|${p}\\b`
    }

    return new RegExp(`${s})`, 'gi')
  }())
  const _hslExp = /hsl[a]?\(/
  const _colorStringFilter = function _colorStringFilter(a) {
    const combined = a.join(' ')
    let toHSL
    _colorExp.lastIndex = 0

    if (_colorExp.test(combined)) {
      toHSL = _hslExp.test(combined)
      a[1] = _formatColors(a[1], toHSL)
      a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]))
      return true
    }
  }
  let _tickerActive
  var _ticker = (function () {
    const _getTime = Date.now
    let _lagThreshold = 500
    let _adjustedLag = 33
    let _startTime = _getTime()
    let _lastUpdate = _startTime
    let _gap = 1000 / 240
    let _nextTime = _gap
    const _listeners = []
    let _id
    let _req
    let _raf
    let _self
    let _delta
    let _i
    const _tick = function _tick(v) {
      const elapsed = _getTime() - _lastUpdate
      const manual = v === true
      let overlap
      let dispatch
      let time
      let frame

      elapsed > _lagThreshold && (_startTime += elapsed - _adjustedLag)
      _lastUpdate += elapsed
      time = _lastUpdate - _startTime
      overlap = time - _nextTime

      if (overlap > 0 || manual) {
        frame = ++_self.frame
        _delta = time - _self.time * 1000
        _self.time = time /= 1000
        _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap)
        dispatch = 1
      }

      manual || (_id = _req(_tick))

      if (dispatch) {
        for (_i = 0; _i < _listeners.length; _i++) {
          _listeners[_i](time, _delta, frame, v)
        }
      }
    }

    _self = {
      time: 0,
      frame: 0,
      tick: function tick() {
        _tick(true)
      },
      deltaRatio: function deltaRatio(fps) {
        return _delta / (1000 / (fps || 60))
      },
      wake: function wake() {
        if (_coreReady) {
          if (!_coreInitted && _windowExists()) {
            _win = _coreInitted = window
            _doc = _win.document || {}
            _globals.gsap = gsap;
            (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version)

            _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {})

            _raf = _win.requestAnimationFrame
          }

          _id && _self.sleep()

          _req = _raf || function (f) {
            return setTimeout(f, _nextTime - _self.time * 1000 + 1 | 0)
          }

          _tickerActive = 1

          _tick(2)
        }
      },
      sleep: function sleep() {
        (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id)
        _tickerActive = 0
        _req = _emptyFunc
      },
      lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
        _lagThreshold = threshold || 1 / _tinyNum
        _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0)
      },
      fps: function fps(_fps) {
        _gap = 1000 / (_fps || 240)
        _nextTime = _self.time * 1000 + _gap
      },
      add: function add(callback) {
        _listeners.indexOf(callback) < 0 && _listeners.push(callback)

        _wake()
      },
      remove: function remove(callback) {
        let i
        ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1) && _i >= i && _i--
      },
      _listeners,
    }
    return _self
  }())
  var _wake = function _wake() {
    return !_tickerActive && _ticker.wake()
  }
  const _easeMap = {}
  const _customEaseExp = /^[\d.\-M][\d.\-,\s]/
  const _quotesExp = /["']/g
  const _parseObjectInString = function _parseObjectInString(value) {
    const obj = {}
    const split = value.substr(1, value.length - 3).split(':')
    let key = split[0]
    let i = 1
    const l = split.length
    let index
    let val
    let parsedVal

    for (; i < l; i++) {
      val = split[i]
      index = i !== l - 1 ? val.lastIndexOf(',') : val.length
      parsedVal = val.substr(0, index)
      obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, '').trim() : +parsedVal
      key = val.substr(index + 1).trim()
    }

    return obj
  }
  const _valueInParentheses = function _valueInParentheses(value) {
    const open = value.indexOf('(') + 1
    const close = value.indexOf(')')
    const nested = value.indexOf('(', open)
    return value.substring(open, ~nested && nested < close ? value.indexOf(')', close + 1) : close)
  }
  const _configEaseFromString = function _configEaseFromString(name) {
    const split = (`${name}`).split('(')
    const ease = _easeMap[split[0]]
    return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf('{') ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(',').map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE('', name) : ease
  }
  var _invertEase = function _invertEase(ease) {
    return function (p) {
      return 1 - ease(1 - p)
    }
  }
  const _propagateYoyoEase = function _propagateYoyoEase(timeline, isYoyo) {
    let child = timeline._first
    let ease

    while (child) {
      if (child instanceof Timeline) {
        _propagateYoyoEase(child, isYoyo)
      } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
        if (child.timeline) {
          _propagateYoyoEase(child.timeline, isYoyo)
        } else {
          ease = child._ease
          child._ease = child._yEase
          child._yEase = ease
          child._yoyo = isYoyo
        }
      }

      child = child._next
    }
  }
  var _parseEase = function _parseEase(ease, defaultEase) {
    return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase
  }
  const _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
    if (easeOut === void 0) {
      easeOut = function easeOut(p) {
        return 1 - easeIn(1 - p)
      }
    }

    if (easeInOut === void 0) {
      easeInOut = function easeInOut(p) {
        return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2
      }
    }

    const ease = {
      easeIn,
      easeOut,
      easeInOut,
    }
    let lowercaseName

    _forEachName(names, name => {
      _easeMap[name] = _globals[name] = ease
      _easeMap[lowercaseName = name.toLowerCase()] = easeOut

      for (const p in ease) {
        _easeMap[lowercaseName + (p === 'easeIn' ? '.in' : p === 'easeOut' ? '.out' : '.inOut')] = _easeMap[`${name}.${p}`] = ease[p]
      }
    })

    return ease
  }
  const _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
    return function (p) {
      return p < 0.5 ? (1 - easeOut(1 - p * 2)) / 2 : 0.5 + easeOut((p - 0.5) * 2) / 2
    }
  }
  const _configElastic = function _configElastic(type, amplitude, period) {
    const p1 = amplitude >= 1 ? amplitude : 1
    let p2 = (period || (type ? 0.3 : 0.45)) / (amplitude < 1 ? amplitude : 1)
    const p3 = p2 / _2PI * (Math.asin(1 / p1) || 0)
    const easeOut = function easeOut(p) {
      return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1
    }
    const ease = type === 'out' ? easeOut : type === 'in' ? function (p) {
      return 1 - easeOut(1 - p)
    } : _easeInOutFromOut(easeOut)

    p2 = _2PI / p2

    ease.config = function (amplitude, period) {
      return _configElastic(type, amplitude, period)
    }

    return ease
  }
  const _configBack = function _configBack(type, overshoot) {
    if (overshoot === void 0) {
      overshoot = 1.70158
    }

    const easeOut = function easeOut(p) {
      return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0
    }
    const ease = type === 'out' ? easeOut : type === 'in' ? function (p) {
      return 1 - easeOut(1 - p)
    } : _easeInOutFromOut(easeOut)

    ease.config = function (overshoot) {
      return _configBack(type, overshoot)
    }

    return ease
  }

  _forEachName('Linear,Quad,Cubic,Quart,Quint,Strong', (name, i) => {
    const power = i < 5 ? i + 1 : i

    _insertEase(`${name},Power${power - 1}`, i ? p => Math.pow(p, power) : p => p, p => 1 - Math.pow(1 - p, power), p => (p < 0.5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2))
  })

  _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn

  _insertEase('Elastic', _configElastic('in'), _configElastic('out'), _configElastic());

  (function (n, c) {
    const n1 = 1 / c
    const n2 = 2 * n1
    const n3 = 2.5 * n1
    const easeOut = function easeOut(p) {
      return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + 0.75 : p < n3 ? n * (p -= 2.25 / c) * p + 0.9375 : n * Math.pow(p - 2.625 / c, 2) + 0.984375
    }

    _insertEase('Bounce', p => 1 - easeOut(1 - p), easeOut)
  }(7.5625, 2.75))

  _insertEase('Expo', p => (p ? Math.pow(2, 10 * (p - 1)) : 0))

  _insertEase('Circ', p => -(_sqrt(1 - p * p) - 1))

  _insertEase('Sine', p => (p === 1 ? 1 : -_cos(p * _HALF_PI) + 1))

  _insertEase('Back', _configBack('in'), _configBack('out'), _configBack())

  _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
    config: function config(steps, immediateStart) {
      if (steps === void 0) {
        steps = 1
      }

      const p1 = 1 / steps
      const p2 = steps + (immediateStart ? 0 : 1)
      const p3 = immediateStart ? 1 : 0
      const max = 1 - _tinyNum
      return function (p) {
        return ((p2 * _clamp(0, max, p) | 0) + p3) * p1
      }
    },
  }
  _defaults.ease = _easeMap['quad.out']

  _forEachName('onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt', name => _callbackNames += `${name},${name}Params,`)

  var GSCache = function GSCache(target, harness) {
    this.id = _gsID++
    target._gsap = this
    this.target = target
    this.harness = harness
    this.get = harness ? harness.get : _getProperty
    this.set = harness ? harness.getSetter : _getSetter
  }
  const Animation = (function () {
    function Animation(vars, time) {
      const parent = vars.parent || _globalTimeline
      this.vars = vars
      this._delay = +vars.delay || 0

      if (this._repeat = vars.repeat || 0) {
        this._rDelay = vars.repeatDelay || 0
        this._yoyo = !!vars.yoyo || !!vars.yoyoEase
      }

      this._ts = 1

      _setDuration(this, +vars.duration, 1, 1)

      this.data = vars.data
      _tickerActive || _ticker.wake()
      parent && _addToTimeline(parent, this, time || time === 0 ? time : parent._time, 1)
      vars.reversed && this.reverse()
      vars.paused && this.paused(true)
    }

    const _proto = Animation.prototype

    _proto.delay = function delay(value) {
      if (value || value === 0) {
        this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay)
        this._delay = value
        return this
      }

      return this._delay
    }

    _proto.duration = function duration(value) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur
    }

    _proto.totalDuration = function totalDuration(value) {
      if (!arguments.length) {
        return this._tDur
      }

      this._dirty = 0
      return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1))
    }

    _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
      _wake()

      if (!arguments.length) {
        return this._tTime
      }

      let parent = this._dp

      if (parent && parent.smoothChildTiming && this._ts) {
        _alignPlayhead(this, _totalTime)

        while (parent.parent) {
          if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
            parent.totalTime(parent._tTime, true)
          }

          parent = parent.parent
        }

        if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
          _addToTimeline(this._dp, this, this._start - this._delay)
        }
      }

      if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
        this._ts || (this._pTime = _totalTime)

        _lazySafeRender(this, _totalTime, suppressEvents)
      }

      return this
    }

    _proto.time = function time(value, suppressEvents) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % this._dur || (value ? this._dur : 0), suppressEvents) : this._time
    }

    _proto.totalProgress = function totalProgress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio
    }

    _proto.progress = function progress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio
    }

    _proto.iteration = function iteration(value, suppressEvents) {
      const cycleDuration = this.duration() + this._rDelay

      return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1
    }

    _proto.timeScale = function timeScale(value) {
      if (!arguments.length) {
        return this._rts === -_tinyNum ? 0 : this._rts
      }

      if (this._rts === value) {
        return this
      }

      const tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime
      this._rts = +value || 0
      this._ts = this._ps || value === -_tinyNum ? 0 : this._rts
      return _recacheAncestors(this.totalTime(_clamp(-this._delay, this._tDur, tTime), true))
    }

    _proto.paused = function paused(value) {
      if (!arguments.length) {
        return this._ps
      }

      if (this._ps !== value) {
        this._ps = value

        if (value) {
          this._pTime = this._tTime || Math.max(-this._delay, this.rawTime())
          this._ts = this._act = 0
        } else {
          _wake()

          this._ts = this._rts
          this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && (this._tTime -= _tinyNum) && Math.abs(this._zTime) !== _tinyNum)
        }
      }

      return this
    }

    _proto.startTime = function startTime(value) {
      if (arguments.length) {
        this._start = value
        const parent = this.parent || this._dp
        parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay)
        return this
      }

      return this._start
    }

    _proto.endTime = function endTime(includeRepeats) {
      return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts)
    }

    _proto.rawTime = function rawTime(wrapRepeats) {
      const parent = this.parent || this._dp
      return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this)
    }

    _proto.globalTime = function globalTime(rawTime) {
      let animation = this
      let time = arguments.length ? rawTime : animation.rawTime()

      while (animation) {
        time = animation._start + time / (animation._ts || 1)
        animation = animation._dp
      }

      return time
    }

    _proto.repeat = function repeat(value) {
      if (arguments.length) {
        this._repeat = value
        return _onUpdateTotalDuration(this)
      }

      return this._repeat
    }

    _proto.repeatDelay = function repeatDelay(value) {
      if (arguments.length) {
        this._rDelay = value
        return _onUpdateTotalDuration(this)
      }

      return this._rDelay
    }

    _proto.yoyo = function yoyo(value) {
      if (arguments.length) {
        this._yoyo = value
        return this
      }

      return this._yoyo
    }

    _proto.seek = function seek(position, suppressEvents) {
      return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents))
    }

    _proto.restart = function restart(includeDelay, suppressEvents) {
      return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents))
    }

    _proto.play = function play(from, suppressEvents) {
      from != null && this.seek(from, suppressEvents)
      return this.reversed(false).paused(false)
    }

    _proto.reverse = function reverse(from, suppressEvents) {
      from != null && this.seek(from || this.totalDuration(), suppressEvents)
      return this.reversed(true).paused(false)
    }

    _proto.pause = function pause(atTime, suppressEvents) {
      atTime != null && this.seek(atTime, suppressEvents)
      return this.paused(true)
    }

    _proto.resume = function resume() {
      return this.paused(false)
    }

    _proto.reversed = function reversed(value) {
      if (arguments.length) {
        !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0))
        return this
      }

      return this._rts < 0
    }

    _proto.invalidate = function invalidate() {
      this._initted = 0
      this._zTime = -_tinyNum
      return this
    }

    _proto.isActive = function isActive() {
      const parent = this.parent || this._dp
      const start = this._start
      let rawTime
      return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum)
    }

    _proto.eventCallback = function eventCallback(type, callback, params) {
      const { vars } = this

      if (arguments.length > 1) {
        if (!callback) {
          delete vars[type]
        } else {
          vars[type] = callback
          params && (vars[`${type}Params`] = params)
          type === 'onUpdate' && (this._onUpdate = callback)
        }

        return this
      }

      return vars[type]
    }

    _proto.then = function then(onFulfilled) {
      const self = this
      return new Promise((resolve => {
        let f = _isFunction(onFulfilled) ? onFulfilled : _passThrough
        const _resolve = function _resolve() {
          const _then = self.then
          self.then = null
          _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then)
          resolve(f)
          self.then = _then
        }

        if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
          _resolve()
        } else {
          self._prom = _resolve
        }
      }))
    }

    _proto.kill = function kill() {
      _interrupt(this)
    }

    return Animation
  }())

  _setDefaults(Animation.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: false,
    parent: null,
    _initted: false,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -_tinyNum,
    _prom: 0,
    _ps: false,
    _rts: 1,
  })

  var Timeline = (function (_Animation) {
    _inheritsLoose(Timeline, _Animation)

    function Timeline(vars, time) {
      let _this

      if (vars === void 0) {
        vars = {}
      }

      _this = _Animation.call(this, vars, time) || this
      _this.labels = {}
      _this.smoothChildTiming = !!vars.smoothChildTiming
      _this.autoRemoveChildren = !!vars.autoRemoveChildren
      _this._sort = _isNotFalse(vars.sortChildren)
      _this.parent && _postAddChecks(_this.parent, _assertThisInitialized(_this))
      vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger)
      return _this
    }

    const _proto2 = Timeline.prototype

    _proto2.to = function to(targets, vars, position) {
      new Tween(targets, _parseVars(arguments, 0, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position))
      return this
    }

    _proto2.from = function from(targets, vars, position) {
      new Tween(targets, _parseVars(arguments, 1, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position))
      return this
    }

    _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
      new Tween(targets, _parseVars(arguments, 2, this), _parsePosition(this, _isNumber(fromVars) ? arguments[4] : position))
      return this
    }

    _proto2.set = function set(targets, vars, position) {
      vars.duration = 0
      vars.parent = this
      _inheritDefaults(vars).repeatDelay || (vars.repeat = 0)
      vars.immediateRender = !!vars.immediateRender
      new Tween(targets, vars, _parsePosition(this, position), 1)
      return this
    }

    _proto2.call = function call(callback, params, position) {
      return _addToTimeline(this, Tween.delayedCall(0, callback, params), _parsePosition(this, position))
    }

    _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.duration = duration
      vars.stagger = vars.stagger || stagger
      vars.onComplete = onCompleteAll
      vars.onCompleteParams = onCompleteAllParams
      vars.parent = this
      new Tween(targets, vars, _parsePosition(this, position))
      return this
    }

    _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.runBackwards = 1
      _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender)
      return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams)
    }

    _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
      toVars.startAt = fromVars
      _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender)
      return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams)
    }

    _proto2.render = function render(totalTime, suppressEvents, force) {
      let prevTime = this._time
      let tDur = this._dirty ? this.totalDuration() : this._tDur
      let dur = this._dur
      let tTime = this !== _globalTimeline && totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime
      const crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur)
      let time
      let child
      let next
      let iteration
      let cycleDuration
      let prevPaused
      let pauseTween
      let timeScale
      let prevStart
      let prevIteration
      let yoyo
      let isYoyo

      if (tTime !== this._tTime || force || crossingStart) {
        if (prevTime !== this._time && dur) {
          tTime += this._time - prevTime
          totalTime += this._time - prevTime
        }

        time = tTime
        prevStart = this._start
        timeScale = this._ts
        prevPaused = !timeScale

        if (crossingStart) {
          dur || (prevTime = this._zTime);
          (totalTime || !suppressEvents) && (this._zTime = totalTime)
        }

        if (this._repeat) {
          yoyo = this._yoyo
          cycleDuration = dur + this._rDelay
          time = _round(tTime % cycleDuration)

          if (tTime === tDur) {
            iteration = this._repeat
            time = dur
          } else {
            iteration = ~~(tTime / cycleDuration)

            if (iteration && iteration === tTime / cycleDuration) {
              time = dur
              iteration--
            }

            time > dur && (time = dur)
          }

          prevIteration = _animationCycle(this._tTime, cycleDuration)
          !prevTime && this._tTime && prevIteration !== iteration && (prevIteration = iteration)

          if (yoyo && iteration & 1) {
            time = dur - time
            isYoyo = 1
          }

          if (iteration !== prevIteration && !this._lock) {
            let rewinding = yoyo && prevIteration & 1
            const doesWrap = rewinding === (yoyo && iteration & 1)
            iteration < prevIteration && (rewinding = !rewinding)
            prevTime = rewinding ? 0 : dur
            this._lock = 1
            this.render(prevTime || (isYoyo ? 0 : _round(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0
            !suppressEvents && this.parent && _callback(this, 'onRepeat')
            this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1)

            if (prevTime !== this._time || prevPaused !== !this._ts) {
              return this
            }

            dur = this._dur
            tDur = this._tDur

            if (doesWrap) {
              this._lock = 2
              prevTime = rewinding ? dur : -0.0001
              this.render(prevTime, true)
              this.vars.repeatRefresh && !isYoyo && this.invalidate()
            }

            this._lock = 0

            if (!this._ts && !prevPaused) {
              return this
            }

            _propagateYoyoEase(this, isYoyo)
          }
        }

        if (this._hasPause && !this._forcing && this._lock < 2) {
          pauseTween = _findNextPauseTween(this, _round(prevTime), _round(time))

          if (pauseTween) {
            tTime -= time - (time = pauseTween._start)
          }
        }

        this._tTime = tTime
        this._time = time
        this._act = !timeScale

        if (!this._initted) {
          this._onUpdate = this.vars.onUpdate
          this._initted = 1
          this._zTime = totalTime
        }

        !prevTime && time && !suppressEvents && _callback(this, 'onStart')

        if (time >= prevTime && totalTime >= 0) {
          child = this._first

          while (child) {
            next = child._next

            if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force)
              }

              child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force)

              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0
                next && (tTime += this._zTime = -_tinyNum)
                break
              }
            }

            child = next
          }
        } else {
          child = this._last
          const adjustedTime = totalTime < 0 ? totalTime : time

          while (child) {
            next = child._prev

            if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force)
              }

              child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force)

              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0
                next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum)
                break
              }
            }

            child = next
          }
        }

        if (pauseTween && !suppressEvents) {
          this.pause()
          pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1

          if (this._ts) {
            this._start = prevStart

            _setEnd(this)

            return this.render(totalTime, suppressEvents, force)
          }
        }

        this._onUpdate && !suppressEvents && _callback(this, 'onUpdate', true)
        if (tTime === tDur && tDur >= this.totalDuration() || !tTime && prevTime) {
          if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
            if (!this._lock) {
              (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1)

              if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
                _callback(this, tTime === tDur ? 'onComplete' : 'onReverseComplete', true)

                this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom()
              }
            }
          }
        }
      }

      return this
    }

    _proto2.add = function add(child, position) {
      const _this2 = this

      if (!_isNumber(position)) {
        position = _parsePosition(this, position)
      }

      if (!(child instanceof Animation)) {
        if (_isArray(child)) {
          child.forEach(obj => _this2.add(obj, position))
          return this
        }

        if (_isString(child)) {
          return this.addLabel(child, position)
        }

        if (_isFunction(child)) {
          child = Tween.delayedCall(0, child)
        } else {
          return this
        }
      }

      return this !== child ? _addToTimeline(this, child, position) : this
    }

    _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
      if (nested === void 0) {
        nested = true
      }

      if (tweens === void 0) {
        tweens = true
      }

      if (timelines === void 0) {
        timelines = true
      }

      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = -_bigNum
      }

      const a = []
      let child = this._first

      while (child) {
        if (child._start >= ignoreBeforeTime) {
          if (child instanceof Tween) {
            tweens && a.push(child)
          } else {
            timelines && a.push(child)
            nested && a.push.apply(a, child.getChildren(true, tweens, timelines))
          }
        }

        child = child._next
      }

      return a
    }

    _proto2.getById = function getById(id) {
      const animations = this.getChildren(1, 1, 1)
      let i = animations.length

      while (i--) {
        if (animations[i].vars.id === id) {
          return animations[i]
        }
      }
    }

    _proto2.remove = function remove(child) {
      if (_isString(child)) {
        return this.removeLabel(child)
      }

      if (_isFunction(child)) {
        return this.killTweensOf(child)
      }

      _removeLinkedListItem(this, child)

      if (child === this._recent) {
        this._recent = this._last
      }

      return _uncache(this)
    }

    _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
      if (!arguments.length) {
        return this._tTime
      }

      this._forcing = 1

      if (!this._dp && this._ts) {
        this._start = _round(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts))
      }

      _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents)

      this._forcing = 0
      return this
    }

    _proto2.addLabel = function addLabel(label, position) {
      this.labels[label] = _parsePosition(this, position)
      return this
    }

    _proto2.removeLabel = function removeLabel(label) {
      delete this.labels[label]
      return this
    }

    _proto2.addPause = function addPause(position, callback, params) {
      const t = Tween.delayedCall(0, callback || _emptyFunc, params)
      t.data = 'isPause'
      this._hasPause = 1
      return _addToTimeline(this, t, _parsePosition(this, position))
    }

    _proto2.removePause = function removePause(position) {
      let child = this._first
      position = _parsePosition(this, position)

      while (child) {
        if (child._start === position && child.data === 'isPause') {
          _removeFromParent(child)
        }

        child = child._next
      }
    }

    _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      const tweens = this.getTweensOf(targets, onlyActive)
      let i = tweens.length

      while (i--) {
        _overwritingTween !== tweens[i] && tweens[i].kill(targets, props)
      }

      return this
    }

    _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
      const a = []
      const parsedTargets = toArray(targets)
      let child = this._first
      const isGlobalTime = _isNumber(onlyActive)
      let children

      while (child) {
        if (child instanceof Tween) {
          if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
            a.push(child)
          }
        } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
          a.push.apply(a, children)
        }

        child = child._next
      }

      return a
    }

    _proto2.tweenTo = function tweenTo(position, vars) {
      vars = vars || {}

      const tl = this
      const endTime = _parsePosition(tl, position)
      const _vars = vars
      const { startAt } = _vars
      const _onStart = _vars.onStart
      const { onStartParams } = _vars
      var tween = Tween.to(tl, _setDefaults(vars, {
        ease: 'none',
        lazy: false,
        time: endTime,
        overwrite: 'auto',
        duration: vars.duration || Math.abs((endTime - (startAt && 'time' in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
        onStart: function onStart() {
          tl.pause()
          const duration = vars.duration || Math.abs((endTime - tl._time) / tl.timeScale())
          tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true)
          _onStart && _onStart.apply(tween, onStartParams || [])
        },
      }))

      return tween
    }

    _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
      return this.tweenTo(toPosition, _setDefaults({
        startAt: {
          time: _parsePosition(this, fromPosition),
        },
      }, vars))
    }

    _proto2.recent = function recent() {
      return this._recent
    }

    _proto2.nextLabel = function nextLabel(afterTime) {
      if (afterTime === void 0) {
        afterTime = this._time
      }

      return _getLabelInDirection(this, _parsePosition(this, afterTime))
    }

    _proto2.previousLabel = function previousLabel(beforeTime) {
      if (beforeTime === void 0) {
        beforeTime = this._time
      }

      return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1)
    }

    _proto2.currentLabel = function currentLabel(value) {
      return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum)
    }

    _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = 0
      }

      let child = this._first
      const { labels } = this
      let p

      while (child) {
        if (child._start >= ignoreBeforeTime) {
          child._start += amount
          child._end += amount
        }

        child = child._next
      }

      if (adjustLabels) {
        for (p in labels) {
          if (labels[p] >= ignoreBeforeTime) {
            labels[p] += amount
          }
        }
      }

      return _uncache(this)
    }

    _proto2.invalidate = function invalidate() {
      let child = this._first
      this._lock = 0

      while (child) {
        child.invalidate()
        child = child._next
      }

      return _Animation.prototype.invalidate.call(this)
    }

    _proto2.clear = function clear(includeLabels) {
      if (includeLabels === void 0) {
        includeLabels = true
      }

      let child = this._first
      let next

      while (child) {
        next = child._next
        this.remove(child)
        child = next
      }

      this._time = this._tTime = this._pTime = 0
      includeLabels && (this.labels = {})
      return _uncache(this)
    }

    _proto2.totalDuration = function totalDuration(value) {
      let max = 0
      const self = this
      let child = self._last
      let prevStart = _bigNum
      let prev
      let start
      let parent

      if (arguments.length) {
        return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value))
      }

      if (self._dirty) {
        parent = self.parent

        while (child) {
          prev = child._prev
          child._dirty && child.totalDuration()
          start = child._start

          if (start > prevStart && self._sort && child._ts && !self._lock) {
            self._lock = 1
            _addToTimeline(self, child, start - child._delay, 1)._lock = 0
          } else {
            prevStart = start
          }

          if (start < 0 && child._ts) {
            max -= start

            if (!parent && !self._dp || parent && parent.smoothChildTiming) {
              self._start += start / self._ts
              self._time -= start
              self._tTime -= start
            }

            self.shiftChildren(-start, false, -1e999)
            prevStart = 0
          }

          child._end > max && child._ts && (max = child._end)
          child = prev
        }

        _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1)

        self._dirty = 0
      }

      return self._tDur
    }

    Timeline.updateRoot = function updateRoot(time) {
      if (_globalTimeline._ts) {
        _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline))

        _lastRenderedFrame = _ticker.frame
      }

      if (_ticker.frame >= _nextGCFrame) {
        _nextGCFrame += _config.autoSleep || 120
        let child = _globalTimeline._first
        if (!child || !child._ts) {
          if (_config.autoSleep && _ticker._listeners.length < 2) {
            while (child && !child._ts) {
              child = child._next
            }

            child || _ticker.sleep()
          }
        }
      }
    }

    return Timeline
  }(Animation))

  _setDefaults(Timeline.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0,
  })

  const _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
    const pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter)
    let index = 0
    let matchIndex = 0
    let result
    let startNums
    let color
    let endNum
    let chunk
    let startNum
    let hasRandom
    let a
    pt.b = start
    pt.e = end
    start += ''
    end += ''

    if (hasRandom = ~end.indexOf('random(')) {
      end = _replaceRandom(end)
    }

    if (stringFilter) {
      a = [start, end]
      stringFilter(a, target, prop)
      start = a[0]
      end = a[1]
    }

    startNums = start.match(_complexStringNumExp) || []

    while (result = _complexStringNumExp.exec(end)) {
      endNum = result[0]
      chunk = end.substring(index, result.index)

      if (color) {
        color = (color + 1) % 5
      } else if (chunk.substr(-5) === 'rgba(') {
        color = 1
      }

      if (endNum !== startNums[matchIndex++]) {
        startNum = parseFloat(startNums[matchIndex - 1]) || 0
        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ',',
          s: startNum,
          c: endNum.charAt(1) === '=' ? parseFloat(endNum.substr(2)) * (endNum.charAt(0) === '-' ? -1 : 1) : parseFloat(endNum) - startNum,
          m: color && color < 4 ? Math.round : 0,
        }
        index = _complexStringNumExp.lastIndex
      }
    }

    pt.c = index < end.length ? end.substring(index, end.length) : ''
    pt.fp = funcParam

    if (_relExp.test(end) || hasRandom) {
      pt.e = 0
    }

    this._pt = pt
    return pt
  }
  var _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
    _isFunction(end) && (end = end(index || 0, target, targets))
    const currentValue = target[prop]
    const parsedStart = start !== 'get' ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf('set') || !_isFunction(target[`get${prop.substr(3)}`]) ? prop : `get${prop.substr(3)}`](funcParam) : target[prop]()
    const setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc
    let pt

    if (_isString(end)) {
      if (~end.indexOf('random(')) {
        end = _replaceRandom(end)
      }

      if (end.charAt(1) === '=') {
        end = parseFloat(parsedStart) + parseFloat(end.substr(2)) * (end.charAt(0) === '-' ? -1 : 1) + (getUnit(parsedStart) || 0)
      }
    }

    if (parsedStart !== end) {
      if (!isNaN(parsedStart * end)) {
        pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === 'boolean' ? _renderBoolean : _renderPlain, 0, setter)
        funcParam && (pt.fp = funcParam)
        modifier && pt.modifier(modifier, this, target)
        return this._pt = pt
      }

      !currentValue && !(prop in target) && _missingPlugin(prop, end)
      return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam)
    }
  }
  const _processVars = function _processVars(vars, index, target, targets, tween) {
    _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets))

    if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
      return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars
    }

    const copy = {}
    let p

    for (p in vars) {
      copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets)
    }

    return copy
  }
  const _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
    let plugin; let pt; let ptLookup; let
      i

    if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
      tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority)

      if (tween !== _quickTween) {
        ptLookup = tween._ptLookup[tween._targets.indexOf(target)]
        i = plugin._props.length

        while (i--) {
          ptLookup[plugin._props[i]] = pt
        }
      }
    }

    return plugin
  }
  let _overwritingTween
  var _initTween = function _initTween(tween, time) {
    const { vars } = tween
    let { ease } = vars
    const { startAt } = vars
    let { immediateRender } = vars
    let { lazy } = vars
    const { onUpdate } = vars
    const { onUpdateParams } = vars
    const { callbackScope } = vars
    const { runBackwards } = vars
    let { yoyoEase } = vars
    const { keyframes } = vars
    const { autoRevert } = vars
    const dur = tween._dur
    const prevStartAt = tween._startAt
    const targets = tween._targets
    const { parent } = tween
    const fullTargets = parent && parent.data === 'nested' ? parent.parent._targets : targets
    const autoOverwrite = tween._overwrite === 'auto'
    const tl = tween.timeline
    let cleanVars
    let i
    let p
    let pt
    let target
    let hasPriority
    let gsData
    let harness
    let plugin
    let ptLookup
    let index
    let harnessVars
    let overwritten
    tl && (!keyframes || !ease) && (ease = 'none')
    tween._ease = _parseEase(ease, _defaults.ease)
    tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0

    if (yoyoEase && tween._yoyo && !tween._repeat) {
      yoyoEase = tween._yEase
      tween._yEase = tween._ease
      tween._ease = yoyoEase
    }

    if (!tl) {
      harness = targets[0] ? _getCache(targets[0]).harness : 0
      harnessVars = harness && vars[harness.prop]
      cleanVars = _copyExcluding(vars, _reservedProps)
      prevStartAt && prevStartAt.render(-1, true).kill()

      if (startAt) {
        _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
          data: 'isStart',
          overwrite: false,
          parent,
          immediateRender: true,
          lazy: _isNotFalse(lazy),
          startAt: null,
          delay: 0,
          onUpdate,
          onUpdateParams,
          callbackScope,
          stagger: 0,
        }, startAt)))

        if (immediateRender) {
          if (time > 0) {
            autoRevert || (tween._startAt = 0)
          } else if (dur && !(time < 0 && prevStartAt)) {
            time && (tween._zTime = time)
            return
          }
        }
      } else if (runBackwards && dur) {
        if (prevStartAt) {
          !autoRevert && (tween._startAt = 0)
        } else {
          time && (immediateRender = false)
          p = _setDefaults({
            overwrite: false,
            data: 'isFromStart',
            lazy: immediateRender && _isNotFalse(lazy),
            immediateRender,
            stagger: 0,
            parent,
          }, cleanVars)
          harnessVars && (p[harness.prop] = harnessVars)

          _removeFromParent(tween._startAt = Tween.set(targets, p))

          if (!immediateRender) {
            _initTween(tween._startAt, _tinyNum)
          } else if (!time) {
            return
          }
        }
      }

      tween._pt = 0
      lazy = dur && _isNotFalse(lazy) || lazy && !dur

      for (i = 0; i < targets.length; i++) {
        target = targets[i]
        gsData = target._gsap || _harness(targets)[i]._gsap
        tween._ptLookup[i] = ptLookup = {}
        _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender()
        index = fullTargets === targets ? i : fullTargets.indexOf(target)

        if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
          tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority)

          plugin._props.forEach(name => {
            ptLookup[name] = pt
          })

          plugin.priority && (hasPriority = 1)
        }

        if (!harness || harnessVars) {
          for (p in cleanVars) {
            if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
              plugin.priority && (hasPriority = 1)
            } else {
              ptLookup[p] = pt = _addPropTween.call(tween, target, p, 'get', cleanVars[p], index, fullTargets, 0, vars.stringFilter)
            }
          }
        }

        tween._op && tween._op[i] && tween.kill(target, tween._op[i])

        if (autoOverwrite && tween._pt) {
          _overwritingTween = tween

          _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(0))

          overwritten = !tween.parent
          _overwritingTween = 0
        }

        tween._pt && lazy && (_lazyLookup[gsData.id] = 1)
      }

      hasPriority && _sortPropTweensByPriority(tween)
      tween._onInit && tween._onInit(tween)
    }

    tween._from = !tl && !!vars.runBackwards
    tween._onUpdate = onUpdate
    tween._initted = (!tween._op || tween._pt) && !overwritten
  }
  const _addAliasesToVars = function _addAliasesToVars(targets, vars) {
    const harness = targets[0] ? _getCache(targets[0]).harness : 0
    const propertyAliases = harness && harness.aliases
    let copy
    let p
    let i
    let aliases

    if (!propertyAliases) {
      return vars
    }

    copy = _merge({}, vars)

    for (p in propertyAliases) {
      if (p in copy) {
        aliases = propertyAliases[p].split(',')
        i = aliases.length

        while (i--) {
          copy[aliases[i]] = copy[p]
        }
      }
    }

    return copy
  }
  var _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
    return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf('random(') ? _replaceRandom(value) : value
  }
  const _staggerTweenProps = `${_callbackNames}repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase`
  const _staggerPropsToSkip = (`${_staggerTweenProps},id,stagger,delay,duration,paused,scrollTrigger`).split(',')

  var Tween = (function (_Animation2) {
    _inheritsLoose(Tween, _Animation2)

    function Tween(targets, vars, time, skipInherit) {
      let _this3

      if (typeof vars === 'number') {
        time.duration = vars
        vars = time
        time = null
      }

      _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars), time) || this
      const _this3$vars = _this3.vars
      let { duration } = _this3$vars
      let { delay } = _this3$vars
      const { immediateRender } = _this3$vars
      const { stagger } = _this3$vars
      const { overwrite } = _this3$vars
      const { keyframes } = _this3$vars
      const { defaults } = _this3$vars
      const { scrollTrigger } = _this3$vars
      const { yoyoEase } = _this3$vars
      const { parent } = _this3
      const parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : 'length' in vars) ? [targets] : toArray(targets)
      let tl
      let i
      let copy
      let l
      let p
      let curTarget
      let staggerFunc
      let staggerVarsToMerge
      _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn(`GSAP target ${targets} not found. https://greensock.com`, !_config.nullTargetWarn) || []
      _this3._ptLookup = []
      _this3._overwrite = overwrite

      if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        vars = _this3.vars
        tl = _this3.timeline = new Timeline({
          data: 'nested',
          defaults: defaults || {},
        })
        tl.kill()
        tl.parent = _assertThisInitialized(_this3)

        if (keyframes) {
          _setDefaults(tl.vars.defaults, {
            ease: 'none',
          })

          keyframes.forEach(frame => tl.to(parsedTargets, frame, '>'))
        } else {
          l = parsedTargets.length
          staggerFunc = stagger ? distribute(stagger) : _emptyFunc

          if (_isObject(stagger)) {
            for (p in stagger) {
              if (~_staggerTweenProps.indexOf(p)) {
                staggerVarsToMerge || (staggerVarsToMerge = {})
                staggerVarsToMerge[p] = stagger[p]
              }
            }
          }

          for (i = 0; i < l; i++) {
            copy = {}

            for (p in vars) {
              if (_staggerPropsToSkip.indexOf(p) < 0) {
                copy[p] = vars[p]
              }
            }

            copy.stagger = 0
            yoyoEase && (copy.yoyoEase = yoyoEase)
            staggerVarsToMerge && _merge(copy, staggerVarsToMerge)
            curTarget = parsedTargets[i]
            copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets)
            copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay

            if (!stagger && l === 1 && copy.delay) {
              _this3._delay = delay = copy.delay
              _this3._start += delay
              copy.delay = 0
            }

            tl.to(curTarget, copy, staggerFunc(i, curTarget, parsedTargets))
          }

          tl.duration() ? duration = delay = 0 : _this3.timeline = 0
        }

        duration || _this3.duration(duration = tl.duration())
      } else {
        _this3.timeline = 0
      }

      if (overwrite === true) {
        _overwritingTween = _assertThisInitialized(_this3)

        _globalTimeline.killTweensOf(parsedTargets)

        _overwritingTween = 0
      }

      parent && _postAddChecks(parent, _assertThisInitialized(_this3))

      if (immediateRender || !duration && !keyframes && _this3._start === _round(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== 'nested') {
        _this3._tTime = -_tinyNum

        _this3.render(Math.max(0, -delay))
      }

      scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger)
      return _this3
    }

    const _proto3 = Tween.prototype

    _proto3.render = function render(totalTime, suppressEvents, force) {
      const prevTime = this._time
      const tDur = this._tDur
      const dur = this._dur
      const tTime = totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime
      let time
      let pt
      let iteration
      let cycleDuration
      let prevIteration
      let isYoyo
      let ratio
      let timeline
      let yoyoEase

      if (!dur) {
        _renderZeroDurationTween(this, totalTime, suppressEvents, force)
      } else if (tTime !== this._tTime || !totalTime || force || this._startAt && this._zTime < 0 !== totalTime < 0) {
        time = tTime
        timeline = this.timeline

        if (this._repeat) {
          cycleDuration = dur + this._rDelay
          time = _round(tTime % cycleDuration)

          if (tTime === tDur) {
            iteration = this._repeat
            time = dur
          } else {
            iteration = ~~(tTime / cycleDuration)

            if (iteration && iteration === tTime / cycleDuration) {
              time = dur
              iteration--
            }

            time > dur && (time = dur)
          }

          isYoyo = this._yoyo && iteration & 1

          if (isYoyo) {
            yoyoEase = this._yEase
            time = dur - time
          }

          prevIteration = _animationCycle(this._tTime, cycleDuration)

          if (time === prevTime && !force && this._initted) {
            return this
          }

          if (iteration !== prevIteration) {
            timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo)

            if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
              this._lock = force = 1
              this.render(_round(cycleDuration * iteration), true).invalidate()._lock = 0
            }
          }
        }

        if (!this._initted) {
          if (_attemptInitTween(this, totalTime < 0 ? totalTime : time, force, suppressEvents)) {
            this._tTime = 0
            return this
          }

          if (dur !== this._dur) {
            return this.render(totalTime, suppressEvents, force)
          }
        }

        this._tTime = tTime
        this._time = time

        if (!this._act && this._ts) {
          this._act = 1
          this._lazy = 0
        }

        this.ratio = ratio = (yoyoEase || this._ease)(time / dur)

        if (this._from) {
          this.ratio = ratio = 1 - ratio
        }

        time && !prevTime && !suppressEvents && _callback(this, 'onStart')
        pt = this._pt

        while (pt) {
          pt.r(ratio, pt.d)
          pt = pt._next
        }

        timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * ratio, suppressEvents, force) || this._startAt && (this._zTime = totalTime)

        if (this._onUpdate && !suppressEvents) {
          totalTime < 0 && this._startAt && this._startAt.render(totalTime, true, force)

          _callback(this, 'onUpdate')
        }

        this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, 'onRepeat')

        if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
          totalTime < 0 && this._startAt && !this._onUpdate && this._startAt.render(totalTime, true, true);
          (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1)

          if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
            _callback(this, tTime === tDur ? 'onComplete' : 'onReverseComplete', true)

            this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom()
          }
        }
      }

      return this
    }

    _proto3.targets = function targets() {
      return this._targets
    }

    _proto3.invalidate = function invalidate() {
      this._pt = this._op = this._startAt = this._onUpdate = this._act = this._lazy = 0
      this._ptLookup = []
      this.timeline && this.timeline.invalidate()
      return _Animation2.prototype.invalidate.call(this)
    }

    _proto3.kill = function kill(targets, vars) {
      if (vars === void 0) {
        vars = 'all'
      }

      if (!targets && (!vars || vars === 'all')) {
        this._lazy = 0

        if (this.parent) {
          return _interrupt(this)
        }
      }

      if (this.timeline) {
        const tDur = this.timeline.totalDuration()
        this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this)
        this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1)
        return this
      }

      const parsedTargets = this._targets
      const killingTargets = targets ? toArray(targets) : parsedTargets
      const propTweenLookup = this._ptLookup
      const firstPT = this._pt
      let overwrittenProps
      let curLookup
      let curOverwriteProps
      let props
      let p
      let pt
      let i

      if ((!vars || vars === 'all') && _arraysMatch(parsedTargets, killingTargets)) {
        vars === 'all' && (this._pt = 0)
        return _interrupt(this)
      }

      overwrittenProps = this._op = this._op || []

      if (vars !== 'all') {
        if (_isString(vars)) {
          p = {}

          _forEachName(vars, name => p[name] = 1)

          vars = p
        }

        vars = _addAliasesToVars(parsedTargets, vars)
      }

      i = parsedTargets.length

      while (i--) {
        if (~killingTargets.indexOf(parsedTargets[i])) {
          curLookup = propTweenLookup[i]

          if (vars === 'all') {
            overwrittenProps[i] = vars
            props = curLookup
            curOverwriteProps = {}
          } else {
            curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {}
            props = vars
          }

          for (p in props) {
            pt = curLookup && curLookup[p]

            if (pt) {
              if (!('kill' in pt.d) || pt.d.kill(p) === true) {
                _removeLinkedListItem(this, pt, '_pt')
              }

              delete curLookup[p]
            }

            if (curOverwriteProps !== 'all') {
              curOverwriteProps[p] = 1
            }
          }
        }
      }

      this._initted && !this._pt && firstPT && _interrupt(this)
      return this
    }

    Tween.to = function to(targets, vars) {
      return new Tween(targets, vars, arguments[2])
    }

    Tween.from = function from(targets, vars) {
      return new Tween(targets, _parseVars(arguments, 1))
    }

    Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
      return new Tween(callback, 0, {
        immediateRender: false,
        lazy: false,
        overwrite: false,
        delay,
        onComplete: callback,
        onReverseComplete: callback,
        onCompleteParams: params,
        onReverseCompleteParams: params,
        callbackScope: scope,
      })
    }

    Tween.fromTo = function fromTo(targets, fromVars, toVars) {
      return new Tween(targets, _parseVars(arguments, 2))
    }

    Tween.set = function set(targets, vars) {
      vars.duration = 0
      vars.repeatDelay || (vars.repeat = 0)
      return new Tween(targets, vars)
    }

    Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      return _globalTimeline.killTweensOf(targets, props, onlyActive)
    }

    return Tween
  }(Animation))

  _setDefaults(Tween.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0,
  })

  _forEachName('staggerTo,staggerFrom,staggerFromTo', name => {
    Tween[name] = function () {
      const tl = new Timeline()
      const params = _slice.call(arguments, 0)

      params.splice(name === 'staggerFromTo' ? 5 : 4, 0, 0)
      return tl[name].apply(tl, params)
    }
  })

  var _setterPlain = function _setterPlain(target, property, value) {
    return target[property] = value
  }
  var _setterFunc = function _setterFunc(target, property, value) {
    return target[property](value)
  }
  var _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
    return target[property](data.fp, value)
  }
  const _setterAttribute = function _setterAttribute(target, property, value) {
    return target.setAttribute(property, value)
  }
  var _getSetter = function _getSetter(target, property) {
    return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain
  }
  var _renderPlain = function _renderPlain(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000, data)
  }
  var _renderBoolean = function _renderBoolean(ratio, data) {
    return data.set(data.t, data.p, !!(data.s + data.c * ratio), data)
  }
  var _renderComplexString = function _renderComplexString(ratio, data) {
    let pt = data._pt
    let s = ''

    if (!ratio && data.b) {
      s = data.b
    } else if (ratio === 1 && data.e) {
      s = data.e
    } else {
      while (pt) {
        s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s
        pt = pt._next
      }

      s += data.c
    }

    data.set(data.t, data.p, s, data)
  }
  var _renderPropTweens = function _renderPropTweens(ratio, data) {
    let pt = data._pt

    while (pt) {
      pt.r(ratio, pt.d)
      pt = pt._next
    }
  }
  var _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
    let pt = this._pt
    let next

    while (pt) {
      next = pt._next
      pt.p === property && pt.modifier(modifier, tween, target)
      pt = next
    }
  }
  var _killPropTweensOf = function _killPropTweensOf(property) {
    let pt = this._pt
    let hasNonDependentRemaining
    let next

    while (pt) {
      next = pt._next

      if (pt.p === property && !pt.op || pt.op === property) {
        _removeLinkedListItem(this, pt, '_pt')
      } else if (!pt.dep) {
        hasNonDependentRemaining = 1
      }

      pt = next
    }

    return !hasNonDependentRemaining
  }
  const _setterWithModifier = function _setterWithModifier(target, property, value, data) {
    data.mSet(target, property, data.m.call(data.tween, value, data.mt), data)
  }
  var _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
    let pt = parent._pt
    let next
    let pt2
    let first
    let last

    while (pt) {
      next = pt._next
      pt2 = first

      while (pt2 && pt2.pr > pt.pr) {
        pt2 = pt2._next
      }

      if (pt._prev = pt2 ? pt2._prev : last) {
        pt._prev._next = pt
      } else {
        first = pt
      }

      if (pt._next = pt2) {
        pt2._prev = pt
      } else {
        last = pt
      }

      pt = next
    }

    parent._pt = first
  }

  var PropTween = (function () {
    function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
      this.t = target
      this.s = start
      this.c = change
      this.p = prop
      this.r = renderer || _renderPlain
      this.d = data || this
      this.set = setter || _setterPlain
      this.pr = priority || 0
      this._next = next

      if (next) {
        next._prev = this
      }
    }

    const _proto4 = PropTween.prototype

    _proto4.modifier = function modifier(func, tween, target) {
      this.mSet = this.mSet || this.set
      this.set = _setterWithModifier
      this.m = func
      this.mt = target
      this.tween = tween
    }

    return PropTween
  }())

  _forEachName(`${_callbackNames}parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger`, name => _reservedProps[name] = 1)

  _globals.TweenMax = _globals.TweenLite = Tween
  _globals.TimelineLite = _globals.TimelineMax = Timeline
  _globalTimeline = new Timeline({
    sortChildren: false,
    defaults: _defaults,
    autoRemoveChildren: true,
    id: 'root',
    smoothChildTiming: true,
  })
  _config.stringFilter = _colorStringFilter
  const _gsap = {
    registerPlugin: function registerPlugin() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2]
      }

      args.forEach(config => _createPlugin(config))
    },
    timeline: function timeline(vars) {
      return new Timeline(vars)
    },
    getTweensOf: function getTweensOf(targets, onlyActive) {
      return _globalTimeline.getTweensOf(targets, onlyActive)
    },
    getProperty: function getProperty(target, property, unit, uncache) {
      _isString(target) && (target = toArray(target)[0])

      const getter = _getCache(target || {}).get
      const format = unit ? _passThrough : _numericIfPossible

      unit === 'native' && (unit = '')
      return !target ? target : !property ? function (property, unit, uncache) {
        return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache))
      } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache))
    },
    quickSetter: function quickSetter(target, property, unit) {
      target = toArray(target)

      if (target.length > 1) {
        const setters = target.map(t => gsap.quickSetter(t, property, unit))
        const l = setters.length
        return function (value) {
          let i = l

          while (i--) {
            setters[i](value)
          }
        }
      }

      target = target[0] || {}

      const Plugin = _plugins[property]
      const cache = _getCache(target)
      const p = cache.harness && (cache.harness.aliases || {})[property] || property
      const setter = Plugin ? function (value) {
        const p = new Plugin()
        _quickTween._pt = 0
        p.init(target, unit ? value + unit : value, _quickTween, 0, [target])
        p.render(1, p)
        _quickTween._pt && _renderPropTweens(1, _quickTween)
      } : cache.set(target, p)

      return Plugin ? setter : function (value) {
        return setter(target, p, unit ? value + unit : value, cache, 1)
      }
    },
    isTweening: function isTweening(targets) {
      return _globalTimeline.getTweensOf(targets, true).length > 0
    },
    defaults: function defaults(value) {
      value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease))
      return _mergeDeep(_defaults, value || {})
    },
    config: function config(value) {
      return _mergeDeep(_config, value || {})
    },
    registerEffect: function registerEffect(_ref) {
      const { name } = _ref
      const { effect } = _ref
      const { plugins } = _ref
      const { defaults } = _ref
      const { extendTimeline } = _ref;
      (plugins || '').split(',').forEach(pluginName => pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(`${name} effect requires ${pluginName} plugin.`))

      _effects[name] = function (targets, vars, tl) {
        return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl)
      }

      if (extendTimeline) {
        Timeline.prototype[name] = function (targets, vars, position) {
          return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position)
        }
      }
    },
    registerEase: function registerEase(name, ease) {
      _easeMap[name] = _parseEase(ease)
    },
    parseEase: function parseEase(ease, defaultEase) {
      return arguments.length ? _parseEase(ease, defaultEase) : _easeMap
    },
    getById: function getById(id) {
      return _globalTimeline.getById(id)
    },
    exportRoot: function exportRoot(vars, includeDelayedCalls) {
      if (vars === void 0) {
        vars = {}
      }

      const tl = new Timeline(vars)
      let child
      let next
      tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming)

      _globalTimeline.remove(tl)

      tl._dp = 0
      tl._time = tl._tTime = _globalTimeline._time
      child = _globalTimeline._first

      while (child) {
        next = child._next

        if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
          _addToTimeline(tl, child, child._start - child._delay)
        }

        child = next
      }

      _addToTimeline(_globalTimeline, tl, 0)

      return tl
    },
    utils: {
      wrap,
      wrapYoyo,
      distribute,
      random,
      snap,
      normalize,
      getUnit,
      clamp,
      splitColor,
      toArray,
      mapRange,
      pipe,
      unitize,
      interpolate,
      shuffle,
    },
    install: _install,
    effects: _effects,
    ticker: _ticker,
    updateRoot: Timeline.updateRoot,
    plugins: _plugins,
    globalTimeline: _globalTimeline,
    core: {
      PropTween,
      globals: _addGlobal,
      Tween,
      Timeline,
      Animation,
      getCache: _getCache,
      _removeLinkedListItem,
    },
  }

  _forEachName('to,from,fromTo,delayedCall,set,killTweensOf', name => _gsap[name] = Tween[name])

  _ticker.add(Timeline.updateRoot)

  _quickTween = _gsap.to({}, {
    duration: 0,
  })

  const _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
    let pt = plugin._pt

    while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
      pt = pt._next
    }

    return pt
  }
  const _addModifiers = function _addModifiers(tween, modifiers) {
    const targets = tween._targets
    let p
    let i
    let pt

    for (p in modifiers) {
      i = targets.length

      while (i--) {
        pt = tween._ptLookup[i][p]

        if (pt && (pt = pt.d)) {
          if (pt._pt) {
            pt = _getPluginPropTween(pt, p)
          }

          pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p)
        }
      }
    }
  }
  const _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
    return {
      name,
      rawVars: 1,
      init: function init(target, vars, tween) {
        tween._onInit = function (tween) {
          let temp; let
            p

          if (_isString(vars)) {
            temp = {}

            _forEachName(vars, name => temp[name] = 1)

            vars = temp
          }

          if (modifier) {
            temp = {}

            for (p in vars) {
              temp[p] = modifier(vars[p])
            }

            vars = temp
          }

          _addModifiers(tween, vars)
        }
      },
    }
  }

  var gsap = _gsap.registerPlugin({
    name: 'attr',
    init: function init(target, vars, tween, index, targets) {
      let p; let
        pt

      for (p in vars) {
        pt = this.add(target, 'setAttribute', `${target.getAttribute(p) || 0}`, vars[p], index, targets, 0, 0, p)
        pt && (pt.op = p)

        this._props.push(p)
      }
    },
  }, {
    name: 'endArray',
    init: function init(target, value) {
      let i = value.length

      while (i--) {
        this.add(target, i, target[i] || 0, value[i])
      }
    },
  }, _buildModifierPlugin('roundProps', _roundModifier), _buildModifierPlugin('modifiers'), _buildModifierPlugin('snap', snap)) || _gsap
  Tween.version = Timeline.version = gsap.version = '3.5.1'
  _coreReady = 1

  if (_windowExists()) {
    _wake()
  }

  const { Power0 } = _easeMap
  const { Power1 } = _easeMap
  const { Power2 } = _easeMap
  const { Power3 } = _easeMap
  const { Power4 } = _easeMap
  const { Linear } = _easeMap
  const { Quad } = _easeMap
  const { Cubic } = _easeMap
  const { Quart } = _easeMap
  const { Quint } = _easeMap
  const { Strong } = _easeMap
  const { Elastic } = _easeMap
  const { Back } = _easeMap
  const { SteppedEase } = _easeMap
  const { Bounce } = _easeMap
  const { Sine } = _easeMap
  const { Expo } = _easeMap
  const { Circ } = _easeMap

  let _win$1
  let _doc$1
  let _docElement
  let _pluginInitted
  let _tempDiv
  let _tempDivStyler
  let _recentSetterPlugin
  const _windowExists$1 = function _windowExists() {
    return typeof window !== 'undefined'
  }
  const _transformProps = {}
  const _RAD2DEG = 180 / Math.PI
  const _DEG2RAD = Math.PI / 180
  const _atan2 = Math.atan2
  const _bigNum$1 = 1e8
  const _capsExp = /([A-Z])/g
  const _horizontalExp = /(?:left|right|width|margin|padding|x)/i
  const _complexExp = /[\s,\(]\S/
  const _propertyAliases = {
    autoAlpha: 'opacity,visibility',
    scale: 'scaleX,scaleY',
    alpha: 'opacity',
  }
  const _renderCSSProp = function _renderCSSProp(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data)
  }
  const _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
    return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data)
  }
  const _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
    return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u : data.b, data)
  }
  const _renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
    const value = data.s + data.c * ratio
    data.set(data.t, data.p, ~~(value + (value < 0 ? -0.5 : 0.5)) + data.u, data)
  }
  const _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
    return data.set(data.t, data.p, ratio ? data.e : data.b, data)
  }
  const _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
    return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data)
  }
  const _setterCSSStyle = function _setterCSSStyle(target, property, value) {
    return target.style[property] = value
  }
  const _setterCSSProp = function _setterCSSProp(target, property, value) {
    return target.style.setProperty(property, value)
  }
  const _setterTransform = function _setterTransform(target, property, value) {
    return target._gsap[property] = value
  }
  const _setterScale = function _setterScale(target, property, value) {
    return target._gsap.scaleX = target._gsap.scaleY = value
  }
  const _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
    const cache = target._gsap
    cache.scaleX = cache.scaleY = value
    cache.renderTransform(ratio, cache)
  }
  const _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
    const cache = target._gsap
    cache[property] = value
    cache.renderTransform(ratio, cache)
  }
  let _transformProp = 'transform'
  let _transformOriginProp = `${_transformProp}Origin`
  let _supports3D
  const _createElement = function _createElement(type, ns) {
    const e = _doc$1.createElementNS ? _doc$1.createElementNS((ns || 'http://www.w3.org/1999/xhtml').replace(/^https/, 'http'), type) : _doc$1.createElement(type)
    return e.style ? e : _doc$1.createElement(type)
  }
  const _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
    const cs = getComputedStyle(target)
    return cs[property] || cs.getPropertyValue(property.replace(_capsExp, '-$1').toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || ''
  }
  const _prefixes = 'O,Moz,ms,Ms,Webkit'.split(',')
  var _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
    const e = element || _tempDiv
    const s = e.style
    let i = 5

    if (property in s && !preferPrefix) {
      return property
    }

    property = property.charAt(0).toUpperCase() + property.substr(1)

    while (i-- && !(_prefixes[i] + property in s)) {}

    return i < 0 ? null : (i === 3 ? 'ms' : i >= 0 ? _prefixes[i] : '') + property
  }
  const _initCore = function _initCore() {
    if (_windowExists$1() && window.document) {
      _win$1 = window
      _doc$1 = _win$1.document
      _docElement = _doc$1.documentElement
      _tempDiv = _createElement('div') || {
        style: {},
      }
      _tempDivStyler = _createElement('div')
      _transformProp = _checkPropPrefix(_transformProp)
      _transformOriginProp = `${_transformProp}Origin`
      _tempDiv.style.cssText = 'border-width:0;line-height:0;position:absolute;padding:0'
      _supports3D = !!_checkPropPrefix('perspective')
      _pluginInitted = 1
    }
  }
  const _getBBoxHack = function _getBBoxHack(swapIfPossible) {
    const svg = _createElement('svg', this.ownerSVGElement && this.ownerSVGElement.getAttribute('xmlns') || 'http://www.w3.org/2000/svg')
    const oldParent = this.parentNode
    const oldSibling = this.nextSibling
    const oldCSS = this.style.cssText
    let bbox

    _docElement.appendChild(svg)

    svg.appendChild(this)
    this.style.display = 'block'

    if (swapIfPossible) {
      try {
        bbox = this.getBBox()
        this._gsapBBox = this.getBBox
        this.getBBox = _getBBoxHack
      } catch (e) {}
    } else if (this._gsapBBox) {
      bbox = this._gsapBBox()
    }

    if (oldParent) {
      if (oldSibling) {
        oldParent.insertBefore(this, oldSibling)
      } else {
        oldParent.appendChild(this)
      }
    }

    _docElement.removeChild(svg)

    this.style.cssText = oldCSS
    return bbox
  }
  const _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
    let i = attributesArray.length

    while (i--) {
      if (target.hasAttribute(attributesArray[i])) {
        return target.getAttribute(attributesArray[i])
      }
    }
  }
  const _getBBox = function _getBBox(target) {
    let bounds

    try {
      bounds = target.getBBox()
    } catch (error) {
      bounds = _getBBoxHack.call(target, true)
    }

    bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true))
    return bounds && !bounds.width && !bounds.x && !bounds.y ? {
      x: +_getAttributeFallbacks(target, ['x', 'cx', 'x1']) || 0,
      y: +_getAttributeFallbacks(target, ['y', 'cy', 'y1']) || 0,
      width: 0,
      height: 0,
    } : bounds
  }
  const _isSVG = function _isSVG(e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e))
  }
  const _removeProperty = function _removeProperty(target, property) {
    if (property) {
      const { style } = target

      if (property in _transformProps && property !== _transformOriginProp) {
        property = _transformProp
      }

      if (style.removeProperty) {
        if (property.substr(0, 2) === 'ms' || property.substr(0, 6) === 'webkit') {
          property = `-${property}`
        }

        style.removeProperty(property.replace(_capsExp, '-$1').toLowerCase())
      } else {
        style.removeAttribute(property)
      }
    }
  }
  const _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
    const pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue)
    plugin._pt = pt
    pt.b = beginning
    pt.e = end

    plugin._props.push(property)

    return pt
  }
  const _nonConvertibleUnits = {
    deg: 1,
    rad: 1,
    turn: 1,
  }
  const _convertToUnit = function _convertToUnit(target, property, value, unit) {
    let curValue = parseFloat(value) || 0
    const curUnit = (`${value}`).trim().substr((`${curValue}`).length) || 'px'
    const { style } = _tempDiv
    const horizontal = _horizontalExp.test(property)
    const isRootSVG = target.tagName.toLowerCase() === 'svg'
    const measureProperty = (isRootSVG ? 'client' : 'offset') + (horizontal ? 'Width' : 'Height')
    const amount = 100
    const toPixels = unit === 'px'
    const toPercent = unit === '%'
    let px
    let parent
    let cache
    let isSVG

    if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
      return curValue
    }

    curUnit !== 'px' && !toPixels && (curValue = _convertToUnit(target, property, value, 'px'))
    isSVG = target.getCTM && _isSVG(target)

    if (toPercent && (_transformProps[property] || ~property.indexOf('adius'))) {
      return _round(curValue / (isSVG ? target.getBBox()[horizontal ? 'width' : 'height'] : target[measureProperty]) * amount)
    }

    style[horizontal ? 'width' : 'height'] = amount + (toPixels ? curUnit : unit)
    parent = ~property.indexOf('adius') || unit === 'em' && target.appendChild && !isRootSVG ? target : target.parentNode

    if (isSVG) {
      parent = (target.ownerSVGElement || {}).parentNode
    }

    if (!parent || parent === _doc$1 || !parent.appendChild) {
      parent = _doc$1.body
    }

    cache = parent._gsap

    if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time) {
      return _round(curValue / cache.width * amount)
    }
    (toPercent || curUnit === '%') && (style.position = _getComputedProperty(target, 'position'))
    parent === target && (style.position = 'static')
    parent.appendChild(_tempDiv)
    px = _tempDiv[measureProperty]
    parent.removeChild(_tempDiv)
    style.position = 'absolute'

    if (horizontal && toPercent) {
      cache = _getCache(parent)
      cache.time = _ticker.time
      cache.width = parent[measureProperty]
    }

    return _round(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0)
  }
  const _get = function _get(target, property, unit, uncache) {
    let value
    _pluginInitted || _initCore()

    if (property in _propertyAliases && property !== 'transform') {
      property = _propertyAliases[property]

      if (~property.indexOf(',')) {
        property = property.split(',')[0]
      }
    }

    if (_transformProps[property] && property !== 'transform') {
      value = _parseTransform(target, uncache)
      value = property !== 'transformOrigin' ? value[property] : `${_firstTwoOnly(_getComputedProperty(target, _transformOriginProp))} ${value.zOrigin}px`
    } else {
      value = target.style[property]

      if (!value || value === 'auto' || uncache || ~(`${value}`).indexOf('calc(')) {
        value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === 'opacity' ? 1 : 0)
      }
    }

    return unit && !~(`${value}`).indexOf(' ') ? _convertToUnit(target, property, value, unit) + unit : value
  }
  const _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
    if (!start || start === 'none') {
      const p = _checkPropPrefix(prop, target, 1)
      const s = p && _getComputedProperty(target, p, 1)

      if (s && s !== start) {
        prop = p
        start = s
      } else if (prop === 'borderColor') {
        start = _getComputedProperty(target, 'borderTopColor')
      }
    }

    const pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString)
    let index = 0
    let matchIndex = 0
    let a
    let result
    let startValues
    let startNum
    let color
    let startValue
    let endValue
    let endNum
    let chunk
    let endUnit
    let startUnit
    let relative
    let endValues
    pt.b = start
    pt.e = end
    start += ''
    end += ''

    if (end === 'auto') {
      target.style[prop] = end
      end = _getComputedProperty(target, prop) || end
      target.style[prop] = start
    }

    a = [start, end]

    _colorStringFilter(a)

    start = a[0]
    end = a[1]
    startValues = start.match(_numWithUnitExp) || []
    endValues = end.match(_numWithUnitExp) || []

    if (endValues.length) {
      while (result = _numWithUnitExp.exec(end)) {
        endValue = result[0]
        chunk = end.substring(index, result.index)

        if (color) {
          color = (color + 1) % 5
        } else if (chunk.substr(-5) === 'rgba(' || chunk.substr(-5) === 'hsla(') {
          color = 1
        }

        if (endValue !== (startValue = startValues[matchIndex++] || '')) {
          startNum = parseFloat(startValue) || 0
          startUnit = startValue.substr((`${startNum}`).length)
          relative = endValue.charAt(1) === '=' ? +(`${endValue.charAt(0)}1`) : 0

          if (relative) {
            endValue = endValue.substr(2)
          }

          endNum = parseFloat(endValue)
          endUnit = endValue.substr((`${endNum}`).length)
          index = _numWithUnitExp.lastIndex - endUnit.length

          if (!endUnit) {
            endUnit = endUnit || _config.units[prop] || startUnit

            if (index === end.length) {
              end += endUnit
              pt.e += endUnit
            }
          }

          if (startUnit !== endUnit) {
            startNum = _convertToUnit(target, prop, startValue, endUnit) || 0
          }

          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ',',
            s: startNum,
            c: relative ? relative * endNum : endNum - startNum,
            m: color && color < 4 ? Math.round : 0,
          }
        }
      }

      pt.c = index < end.length ? end.substring(index, end.length) : ''
    } else {
      pt.r = prop === 'display' && end === 'none' ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue
    }

    if (_relExp.test(end)) {
      pt.e = 0
    }

    this._pt = pt
    return pt
  }
  const _keywordToPercent = {
    top: '0%',
    bottom: '100%',
    left: '0%',
    right: '100%',
    center: '50%',
  }
  const _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
    const split = value.split(' ')
    let x = split[0]
    let y = split[1] || '50%'

    if (x === 'top' || x === 'bottom' || y === 'left' || y === 'right') {
      value = x
      x = y
      y = value
    }

    split[0] = _keywordToPercent[x] || x
    split[1] = _keywordToPercent[y] || y
    return split.join(' ')
  }
  const _renderClearProps = function _renderClearProps(ratio, data) {
    if (data.tween && data.tween._time === data.tween._dur) {
      const target = data.t
      const { style } = target
      let props = data.u
      const cache = target._gsap
      let prop
      let clearTransforms
      let i

      if (props === 'all' || props === true) {
        style.cssText = ''
        clearTransforms = 1
      } else {
        props = props.split(',')
        i = props.length

        while (--i > -1) {
          prop = props[i]

          if (_transformProps[prop]) {
            clearTransforms = 1
            prop = prop === 'transformOrigin' ? _transformOriginProp : _transformProp
          }

          _removeProperty(target, prop)
        }
      }

      if (clearTransforms) {
        _removeProperty(target, _transformProp)

        if (cache) {
          cache.svg && target.removeAttribute('transform')

          _parseTransform(target, 1)

          cache.uncache = 1
        }
      }
    }
  }
  var _specialProps = {
    clearProps: function clearProps(plugin, target, property, endValue, tween) {
      if (tween.data !== 'isFromStart') {
        const pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps)
        pt.u = endValue
        pt.pr = -10
        pt.tween = tween

        plugin._props.push(property)

        return 1
      }
    },
  }
  const _identity2DMatrix = [1, 0, 0, 1, 0, 0]
  const _rotationalProperties = {}
  const _isNullTransform = function _isNullTransform(value) {
    return value === 'matrix(1, 0, 0, 1, 0, 0)' || value === 'none' || !value
  }
  const _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
    const matrixString = _getComputedProperty(target, _transformProp)

    return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round)
  }
  const _getMatrix = function _getMatrix(target, force2D) {
    const cache = target._gsap || _getCache(target)
    const { style } = target
    let matrix = _getComputedTransformMatrixAsArray(target)
    let parent
    let nextSibling
    let temp
    let addedToDOM

    if (cache.svg && target.getAttribute('transform')) {
      temp = target.transform.baseVal.consolidate().matrix
      matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f]
      return matrix.join(',') === '1,0,0,1,0,0' ? _identity2DMatrix : matrix
    } if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
      temp = style.display
      style.display = 'block'
      parent = target.parentNode

      if (!parent || !target.offsetParent) {
        addedToDOM = 1
        nextSibling = target.nextSibling

        _docElement.appendChild(target)
      }

      matrix = _getComputedTransformMatrixAsArray(target)
      temp ? style.display = temp : _removeProperty(target, 'display')

      if (addedToDOM) {
        nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target)
      }
    }

    return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix
  }
  const _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
    const cache = target._gsap
    const matrix = matrixArray || _getMatrix(target, true)
    const xOriginOld = cache.xOrigin || 0
    const yOriginOld = cache.yOrigin || 0
    const xOffsetOld = cache.xOffset || 0
    const yOffsetOld = cache.yOffset || 0
    const a = matrix[0]
    const b = matrix[1]
    const c = matrix[2]
    const d = matrix[3]
    let tx = matrix[4]
    let ty = matrix[5]
    const originSplit = origin.split(' ')
    let xOrigin = parseFloat(originSplit[0]) || 0
    let yOrigin = parseFloat(originSplit[1]) || 0
    let bounds
    let determinant
    let x
    let y

    if (!originIsAbsolute) {
      bounds = _getBBox(target)
      xOrigin = bounds.x + (~originSplit[0].indexOf('%') ? xOrigin / 100 * bounds.width : xOrigin)
      yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf('%') ? yOrigin / 100 * bounds.height : yOrigin)
    } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
      x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant
      y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant
      xOrigin = x
      yOrigin = y
    }

    if (smooth || smooth !== false && cache.smooth) {
      tx = xOrigin - xOriginOld
      ty = yOrigin - yOriginOld
      cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx
      cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty
    } else {
      cache.xOffset = cache.yOffset = 0
    }

    cache.xOrigin = xOrigin
    cache.yOrigin = yOrigin
    cache.smooth = !!smooth
    cache.origin = origin
    cache.originIsAbsolute = !!originIsAbsolute
    target.style[_transformOriginProp] = '0px 0px'

    if (pluginToAddPropTweensTo) {
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, 'xOrigin', xOriginOld, xOrigin)

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, 'yOrigin', yOriginOld, yOrigin)

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, 'xOffset', xOffsetOld, cache.xOffset)

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, 'yOffset', yOffsetOld, cache.yOffset)
    }

    target.setAttribute('data-svg-origin', `${xOrigin} ${yOrigin}`)
  }
  var _parseTransform = function _parseTransform(target, uncache) {
    const cache = target._gsap || new GSCache(target)

    if ('x' in cache && !uncache && !cache.uncache) {
      return cache
    }

    const { style } = target
    const invertedScaleX = cache.scaleX < 0
    const px = 'px'
    const deg = 'deg'
    const origin = _getComputedProperty(target, _transformOriginProp) || '0'
    let x
    let y
    let z
    let scaleX
    let scaleY
    let rotation
    let rotationX
    let rotationY
    let skewX
    let skewY
    let perspective
    let xOrigin
    let yOrigin
    let matrix
    let angle
    let cos
    let sin
    let a
    let b
    let c
    let d
    let a12
    let a22
    let t1
    let t2
    let t3
    let a13
    let a23
    let a33
    let a42
    let a43
    let a32
    x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0
    scaleX = scaleY = 1
    cache.svg = !!(target.getCTM && _isSVG(target))
    matrix = _getMatrix(target, cache.svg)

    if (cache.svg) {
      t1 = !cache.uncache && target.getAttribute('data-svg-origin')

      _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix)
    }

    xOrigin = cache.xOrigin || 0
    yOrigin = cache.yOrigin || 0

    if (matrix !== _identity2DMatrix) {
      a = matrix[0]
      b = matrix[1]
      c = matrix[2]
      d = matrix[3]
      x = a12 = matrix[4]
      y = a22 = matrix[5]

      if (matrix.length === 6) {
        scaleX = Math.sqrt(a * a + b * b)
        scaleY = Math.sqrt(d * d + c * c)
        rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0
        skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0
        skewX && (scaleY *= Math.cos(skewX * _DEG2RAD))

        if (cache.svg) {
          x -= xOrigin - (xOrigin * a + yOrigin * c)
          y -= yOrigin - (xOrigin * b + yOrigin * d)
        }
      } else {
        a32 = matrix[6]
        a42 = matrix[7]
        a13 = matrix[8]
        a23 = matrix[9]
        a33 = matrix[10]
        a43 = matrix[11]
        x = matrix[12]
        y = matrix[13]
        z = matrix[14]
        angle = _atan2(a32, a33)
        rotationX = angle * _RAD2DEG

        if (angle) {
          cos = Math.cos(-angle)
          sin = Math.sin(-angle)
          t1 = a12 * cos + a13 * sin
          t2 = a22 * cos + a23 * sin
          t3 = a32 * cos + a33 * sin
          a13 = a12 * -sin + a13 * cos
          a23 = a22 * -sin + a23 * cos
          a33 = a32 * -sin + a33 * cos
          a43 = a42 * -sin + a43 * cos
          a12 = t1
          a22 = t2
          a32 = t3
        }

        angle = _atan2(-c, a33)
        rotationY = angle * _RAD2DEG

        if (angle) {
          cos = Math.cos(-angle)
          sin = Math.sin(-angle)
          t1 = a * cos - a13 * sin
          t2 = b * cos - a23 * sin
          t3 = c * cos - a33 * sin
          a43 = d * sin + a43 * cos
          a = t1
          b = t2
          c = t3
        }

        angle = _atan2(b, a)
        rotation = angle * _RAD2DEG

        if (angle) {
          cos = Math.cos(angle)
          sin = Math.sin(angle)
          t1 = a * cos + b * sin
          t2 = a12 * cos + a22 * sin
          b = b * cos - a * sin
          a22 = a22 * cos - a12 * sin
          a = t1
          a12 = t2
        }

        if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
          rotationX = rotation = 0
          rotationY = 180 - rotationY
        }

        scaleX = _round(Math.sqrt(a * a + b * b + c * c))
        scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32))
        angle = _atan2(a12, a22)
        skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0
        perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0
      }

      if (cache.svg) {
        t1 = target.getAttribute('transform')
        cache.forceCSS = target.setAttribute('transform', '') || !_isNullTransform(_getComputedProperty(target, _transformProp))
        t1 && target.setAttribute('transform', t1)
      }
    }

    if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
      if (invertedScaleX) {
        scaleX *= -1
        skewX += rotation <= 0 ? 180 : -180
        rotation += rotation <= 0 ? 180 : -180
      } else {
        scaleY *= -1
        skewX += skewX <= 0 ? 180 : -180
      }
    }

    cache.x = ((cache.xPercent = x && Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0) ? 0 : x) + px
    cache.y = ((cache.yPercent = y && Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0) ? 0 : y) + px
    cache.z = z + px
    cache.scaleX = _round(scaleX)
    cache.scaleY = _round(scaleY)
    cache.rotation = _round(rotation) + deg
    cache.rotationX = _round(rotationX) + deg
    cache.rotationY = _round(rotationY) + deg
    cache.skewX = skewX + deg
    cache.skewY = skewY + deg
    cache.transformPerspective = perspective + px

    if (cache.zOrigin = parseFloat(origin.split(' ')[2]) || 0) {
      style[_transformOriginProp] = _firstTwoOnly(origin)
    }

    cache.xOffset = cache.yOffset = 0
    cache.force3D = _config.force3D
    cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms
    cache.uncache = 0
    return cache
  }
  var _firstTwoOnly = function _firstTwoOnly(value) {
    return `${(value = value.split(' '))[0]} ${value[1]}`
  }
  const _addPxTranslate = function _addPxTranslate(target, start, value) {
    const unit = getUnit(start)
    return _round(parseFloat(start) + parseFloat(_convertToUnit(target, 'x', `${value}px`, unit))) + unit
  }
  var _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
    cache.z = '0px'
    cache.rotationY = cache.rotationX = '0deg'
    cache.force3D = 0

    _renderCSSTransforms(ratio, cache)
  }
  const _zeroDeg = '0deg'
  const _zeroPx = '0px'
  const _endParenthesis = ') '
  var _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
    const _ref = cache || this
    const { xPercent } = _ref
    const { yPercent } = _ref
    let { x } = _ref
    let { y } = _ref
    let { z } = _ref
    const { rotation } = _ref
    const { rotationY } = _ref
    const { rotationX } = _ref
    const { skewX } = _ref
    const { skewY } = _ref
    const { scaleX } = _ref
    const { scaleY } = _ref
    const { transformPerspective } = _ref
    const { force3D } = _ref
    const { target } = _ref
    const { zOrigin } = _ref
    let transforms = ''
    const use3D = force3D === 'auto' && ratio && ratio !== 1 || force3D === true

    if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
      let angle = parseFloat(rotationY) * _DEG2RAD
      const a13 = Math.sin(angle)
      const a33 = Math.cos(angle)
      let cos

      angle = parseFloat(rotationX) * _DEG2RAD
      cos = Math.cos(angle)
      x = _addPxTranslate(target, x, a13 * cos * -zOrigin)
      y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin)
      z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin)
    }

    if (transformPerspective !== _zeroPx) {
      transforms += `perspective(${transformPerspective}${_endParenthesis}`
    }

    if (xPercent || yPercent) {
      transforms += `translate(${xPercent}%, ${yPercent}%) `
    }

    if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
      transforms += z !== _zeroPx || use3D ? `translate3d(${x}, ${y}, ${z}) ` : `translate(${x}, ${y}${_endParenthesis}`
    }

    if (rotation !== _zeroDeg) {
      transforms += `rotate(${rotation}${_endParenthesis}`
    }

    if (rotationY !== _zeroDeg) {
      transforms += `rotateY(${rotationY}${_endParenthesis}`
    }

    if (rotationX !== _zeroDeg) {
      transforms += `rotateX(${rotationX}${_endParenthesis}`
    }

    if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
      transforms += `skew(${skewX}, ${skewY}${_endParenthesis}`
    }

    if (scaleX !== 1 || scaleY !== 1) {
      transforms += `scale(${scaleX}, ${scaleY}${_endParenthesis}`
    }

    target.style[_transformProp] = transforms || 'translate(0, 0)'
  }
  var _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
    const _ref2 = cache || this
    const { xPercent } = _ref2
    const { yPercent } = _ref2
    const { x } = _ref2
    const { y } = _ref2
    let { rotation } = _ref2
    let { skewX } = _ref2
    let { skewY } = _ref2
    const { scaleX } = _ref2
    const { scaleY } = _ref2
    const { target } = _ref2
    const { xOrigin } = _ref2
    const { yOrigin } = _ref2
    const { xOffset } = _ref2
    const { yOffset } = _ref2
    const { forceCSS } = _ref2
    let tx = parseFloat(x)
    let ty = parseFloat(y)
    let a11
    let a21
    let a12
    let a22
    let temp

    rotation = parseFloat(rotation)
    skewX = parseFloat(skewX)
    skewY = parseFloat(skewY)

    if (skewY) {
      skewY = parseFloat(skewY)
      skewX += skewY
      rotation += skewY
    }

    if (rotation || skewX) {
      rotation *= _DEG2RAD
      skewX *= _DEG2RAD
      a11 = Math.cos(rotation) * scaleX
      a21 = Math.sin(rotation) * scaleX
      a12 = Math.sin(rotation - skewX) * -scaleY
      a22 = Math.cos(rotation - skewX) * scaleY

      if (skewX) {
        skewY *= _DEG2RAD
        temp = Math.tan(skewX - skewY)
        temp = Math.sqrt(1 + temp * temp)
        a12 *= temp
        a22 *= temp

        if (skewY) {
          temp = Math.tan(skewY)
          temp = Math.sqrt(1 + temp * temp)
          a11 *= temp
          a21 *= temp
        }
      }

      a11 = _round(a11)
      a21 = _round(a21)
      a12 = _round(a12)
      a22 = _round(a22)
    } else {
      a11 = scaleX
      a22 = scaleY
      a21 = a12 = 0
    }

    if (tx && !~(`${x}`).indexOf('px') || ty && !~(`${y}`).indexOf('px')) {
      tx = _convertToUnit(target, 'x', x, 'px')
      ty = _convertToUnit(target, 'y', y, 'px')
    }

    if (xOrigin || yOrigin || xOffset || yOffset) {
      tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset)
      ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset)
    }

    if (xPercent || yPercent) {
      temp = target.getBBox()
      tx = _round(tx + xPercent / 100 * temp.width)
      ty = _round(ty + yPercent / 100 * temp.height)
    }

    temp = `matrix(${a11},${a21},${a12},${a22},${tx},${ty})`
    target.setAttribute('transform', temp)

    if (forceCSS) {
      target.style[_transformProp] = temp
    }
  }
  const _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue, relative) {
    const cap = 360
    const isString = _isString(endValue)
    const endNum = parseFloat(endValue) * (isString && ~endValue.indexOf('rad') ? _RAD2DEG : 1)
    let change = relative ? endNum * relative : endNum - startNum
    const finalValue = `${startNum + change}deg`
    let direction
    let pt

    if (isString) {
      direction = endValue.split('_')[1]

      if (direction === 'short') {
        change %= cap

        if (change !== change % (cap / 2)) {
          change += change < 0 ? cap : -cap
        }
      }

      if (direction === 'cw' && change < 0) {
        change = (change + cap * _bigNum$1) % cap - ~~(change / cap) * cap
      } else if (direction === 'ccw' && change > 0) {
        change = (change - cap * _bigNum$1) % cap - ~~(change / cap) * cap
      }
    }

    plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd)
    pt.e = finalValue
    pt.u = 'deg'

    plugin._props.push(property)

    return pt
  }
  const _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
    const { style } = _tempDivStyler
    const startCache = target._gsap
    const exclude = 'perspective,force3D,transformOrigin,svgOrigin'
    let endCache
    let p
    let startValue
    let endValue
    let startNum
    let endNum
    let startUnit
    let endUnit
    style.cssText = `${getComputedStyle(target).cssText};position:absolute;display:block;`
    style[_transformProp] = transforms

    _doc$1.body.appendChild(_tempDivStyler)

    endCache = _parseTransform(_tempDivStyler, 1)

    for (p in _transformProps) {
      startValue = startCache[p]
      endValue = endCache[p]

      if (startValue !== endValue && exclude.indexOf(p) < 0) {
        startUnit = getUnit(startValue)
        endUnit = getUnit(endValue)
        startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue)
        endNum = parseFloat(endValue)
        plugin._pt = new PropTween(plugin._pt, startCache, p, startNum, endNum - startNum, _renderCSSProp)
        plugin._pt.u = endUnit || 0

        plugin._props.push(p)
      }
    }

    _doc$1.body.removeChild(_tempDivStyler)
  }

  _forEachName('padding,margin,Width,Radius', (name, index) => {
    const t = 'Top'
    const r = 'Right'
    const b = 'Bottom'
    const l = 'Left'
    const props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(side => (index < 2 ? name + side : `border${side}${name}`))

    _specialProps[index > 1 ? `border${name}` : name] = function (plugin, target, property, endValue, tween) {
      let a; let
        vars

      if (arguments.length < 4) {
        a = props.map(prop => _get(plugin, prop, property))
        vars = a.join(' ')
        return vars.split(a[0]).length === 5 ? a[0] : vars
      }

      a = (`${endValue}`).split(' ')
      vars = {}
      props.forEach((prop, i) => vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0])
      plugin.init(target, vars, tween)
    }
  })

  const CSSPlugin = {
    name: 'css',
    register: _initCore,
    targetTest: function targetTest(target) {
      return target.style && target.nodeType
    },
    init: function init(target, vars, tween, index, targets) {
      const props = this._props
      const { style } = target
      let startValue
      let endValue
      let endNum
      let startNum
      let type
      let specialProp
      let p
      let startUnit
      let endUnit
      let relative
      let isTransformRelated
      let transformPropTween
      let cache
      let smooth
      let hasPriority
      _pluginInitted || _initCore()

      for (p in vars) {
        if (p === 'autoRound') {
          continue
        }

        endValue = vars[p]

        if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
          continue
        }

        type = typeof endValue
        specialProp = _specialProps[p]

        if (type === 'function') {
          endValue = endValue.call(tween, index, target, targets)
          type = typeof endValue
        }

        if (type === 'string' && ~endValue.indexOf('random(')) {
          endValue = _replaceRandom(endValue)
        }

        if (specialProp) {
          if (specialProp(this, target, p, endValue, tween)) {
            hasPriority = 1
          }
        } else if (p.substr(0, 2) === '--') {
          this.add(style, 'setProperty', `${getComputedStyle(target).getPropertyValue(p)}`, `${endValue}`, index, targets, 0, 0, p)
        } else if (type !== 'undefined') {
          startValue = _get(target, p)
          startNum = parseFloat(startValue)
          relative = type === 'string' && endValue.charAt(1) === '=' ? +(`${endValue.charAt(0)}1`) : 0

          if (relative) {
            endValue = endValue.substr(2)
          }

          endNum = parseFloat(endValue)

          if (p in _propertyAliases) {
            if (p === 'autoAlpha') {
              if (startNum === 1 && _get(target, 'visibility') === 'hidden' && endNum) {
                startNum = 0
              }

              _addNonTweeningPT(this, style, 'visibility', startNum ? 'inherit' : 'hidden', endNum ? 'inherit' : 'hidden', !endNum)
            }

            if (p !== 'scale' && p !== 'transform') {
              p = _propertyAliases[p]
              ~p.indexOf(',') && (p = p.split(',')[0])
            }
          }

          isTransformRelated = p in _transformProps

          if (isTransformRelated) {
            if (!transformPropTween) {
              cache = target._gsap
              cache.renderTransform || _parseTransform(target)
              smooth = vars.smoothOrigin !== false && cache.smooth
              transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1)
              transformPropTween.dep = 1
            }

            if (p === 'scale') {
              this._pt = new PropTween(this._pt, cache, 'scaleY', cache.scaleY, relative ? relative * endNum : endNum - cache.scaleY)
              props.push('scaleY', p)
              p += 'X'
            } else if (p === 'transformOrigin') {
              endValue = _convertKeywordsToPercentages(endValue)

              if (cache.svg) {
                _applySVGOrigin(target, endValue, 0, smooth, 0, this)
              } else {
                endUnit = parseFloat(endValue.split(' ')[2]) || 0
                endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, 'zOrigin', cache.zOrigin, endUnit)

                _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue))
              }

              continue
            } else if (p === 'svgOrigin') {
              _applySVGOrigin(target, endValue, 1, smooth, 0, this)

              continue
            } else if (p in _rotationalProperties) {
              _addRotationalPropTween(this, cache, p, startNum, endValue, relative)

              continue
            } else if (p === 'smoothOrigin') {
              _addNonTweeningPT(this, cache, 'smooth', cache.smooth, endValue)

              continue
            } else if (p === 'force3D') {
              cache[p] = endValue
              continue
            } else if (p === 'transform') {
              _addRawTransformPTs(this, endValue, target)

              continue
            }
          } else if (!(p in style)) {
            p = _checkPropPrefix(p) || p
          }

          if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
            startUnit = (`${startValue}`).substr((`${startNum}`).length)
            endNum || (endNum = 0)
            endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit)
            startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit))
            this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, relative ? relative * endNum : endNum - startNum, endUnit === 'px' && vars.autoRound !== false && !isTransformRelated ? _renderRoundedCSSProp : _renderCSSProp)
            this._pt.u = endUnit || 0

            if (startUnit !== endUnit) {
              this._pt.b = startValue
              this._pt.r = _renderCSSPropWithBeginning
            }
          } else if (!(p in style)) {
            if (p in target) {
              this.add(target, p, target[p], endValue, index, targets)
            } else {
              _missingPlugin(p, endValue)

              continue
            }
          } else {
            _tweenComplexCSSString.call(this, target, p, startValue, endValue)
          }

          props.push(p)
        }
      }

      hasPriority && _sortPropTweensByPriority(this)
    },
    get: _get,
    aliases: _propertyAliases,
    getSetter: function getSetter(target, property, plugin) {
      const p = _propertyAliases[property]
      p && p.indexOf(',') < 0 && (property = p)
      return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, 'x')) ? plugin && _recentSetterPlugin === plugin ? property === 'scale' ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === 'scale' ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf('-') ? _setterCSSProp : _getSetter(target, property)
    },
    core: {
      _removeProperty,
      _getMatrix,
    },
  }
  gsap.utils.checkPrefix = _checkPropPrefix;

  (function (positionAndScale, rotation, others, aliases) {
    const all = _forEachName(`${positionAndScale},${rotation},${others}`, name => {
      _transformProps[name] = 1
    })

    _forEachName(rotation, name => {
      _config.units[name] = 'deg'
      _rotationalProperties[name] = 1
    })

    _propertyAliases[all[13]] = `${positionAndScale},${rotation}`

    _forEachName(aliases, name => {
      const split = name.split(':')
      _propertyAliases[split[1]] = all[split[0]]
    })
  }('x,y,z,scale,scaleX,scaleY,xPercent,yPercent', 'rotation,rotationX,rotationY,skewX,skewY', 'transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective', '0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY'))

  _forEachName('x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective', name => {
    _config.units[name] = 'px'
  })

  gsap.registerPlugin(CSSPlugin)

  const gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap
  const TweenMaxWithCSS = gsapWithCSS.core.Tween

  exports.Back = Back
  exports.Bounce = Bounce
  exports.CSSPlugin = CSSPlugin
  exports.Circ = Circ
  exports.Cubic = Cubic
  exports.Elastic = Elastic
  exports.Expo = Expo
  exports.Linear = Linear
  exports.Power0 = Power0
  exports.Power1 = Power1
  exports.Power2 = Power2
  exports.Power3 = Power3
  exports.Power4 = Power4
  exports.Quad = Quad
  exports.Quart = Quart
  exports.Quint = Quint
  exports.Sine = Sine
  exports.SteppedEase = SteppedEase
  exports.Strong = Strong
  exports.TimelineLite = Timeline
  exports.TimelineMax = Timeline
  exports.TweenLite = Tween
  exports.TweenMax = TweenMaxWithCSS
  exports.default = gsapWithCSS
  exports.gsap = gsapWithCSS

  if (typeof (window) === 'undefined' || window !== exports) { Object.defineProperty(exports, '__esModule', { value: true }) } else { delete window.default }
})))
