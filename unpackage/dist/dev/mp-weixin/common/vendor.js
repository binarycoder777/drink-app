"use strict";
/**
* @vue/shared v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return expectsLowerCase ? (val) => set2.has(val.toLowerCase()) : (val) => set2.has(val);
}
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize$1 = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s = str ? `on${capitalize$1(str)}` : ``;
  return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns$1 = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
const LOCALE_ZH_HANS = "zh-Hans";
const LOCALE_ZH_HANT = "zh-Hant";
const LOCALE_EN = "en";
const LOCALE_FR = "fr";
const LOCALE_ES = "es";
function include(str, parts) {
  return !!parts.find((part) => str.indexOf(part) !== -1);
}
function startsWith(str, parts) {
  return parts.find((part) => str.indexOf(part) === 0);
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, "-");
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === "chinese") {
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf("zh") === 0) {
    if (locale.indexOf("-hans") > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("-hant") > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  if (messages && Object.keys(messages).length > 0) {
    locales = Object.keys(messages);
  }
  const lang = startsWith(locale, locales);
  if (lang) {
    return lang;
  }
}
const SLOT_DEFAULT_NAME = "d";
const ON_SHOW = "onShow";
const ON_HIDE = "onHide";
const ON_LAUNCH = "onLaunch";
const ON_ERROR = "onError";
const ON_THEME_CHANGE = "onThemeChange";
const ON_PAGE_NOT_FOUND = "onPageNotFound";
const ON_UNHANDLE_REJECTION = "onUnhandledRejection";
const ON_EXIT = "onExit";
const ON_LOAD = "onLoad";
const ON_READY = "onReady";
const ON_UNLOAD = "onUnload";
const ON_INIT = "onInit";
const ON_SAVE_EXIT_STATE = "onSaveExitState";
const ON_RESIZE = "onResize";
const ON_BACK_PRESS = "onBackPress";
const ON_PAGE_SCROLL = "onPageScroll";
const ON_TAB_ITEM_TAP = "onTabItemTap";
const ON_REACH_BOTTOM = "onReachBottom";
const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
const ON_SHARE_TIMELINE = "onShareTimeline";
const ON_SHARE_CHAT = "onShareChat";
const ON_ADD_TO_FAVORITES = "onAddToFavorites";
const ON_SHARE_APP_MESSAGE = "onShareAppMessage";
const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED = "onNavigationBarSearchInputClicked";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED = "onNavigationBarSearchInputChanged";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED = "onNavigationBarSearchInputConfirmed";
const ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED = "onNavigationBarSearchInputFocusChanged";
const VIRTUAL_HOST_STYLE = "virtualHostStyle";
const VIRTUAL_HOST_CLASS = "virtualHostClass";
const VIRTUAL_HOST_HIDDEN = "virtualHostHidden";
const VIRTUAL_HOST_ID = "virtualHostId";
function hasLeadingSlash(str) {
  return str.indexOf("/") === 0;
}
function addLeadingSlash(str) {
  return hasLeadingSlash(str) ? str : "/" + str;
}
const invokeArrayFns = (fns, arg) => {
  let ret;
  for (let i = 0; i < fns.length; i++) {
    ret = fns[i](arg);
  }
  return ret;
};
function once(fn, ctx = null) {
  let res;
  return (...args) => {
    if (fn) {
      res = fn.apply(ctx, args);
      fn = null;
    }
    return res;
  };
}
function getValueByDataPath(obj, path) {
  if (!isString(path)) {
    return;
  }
  path = path.replace(/\[(\d+)\]/g, ".$1");
  const parts = path.split(".");
  let key = parts[0];
  if (!obj) {
    obj = {};
  }
  if (parts.length === 1) {
    return obj[key];
  }
  return getValueByDataPath(obj[key], parts.slice(1).join("."));
}
function sortObject(obj) {
  let sortObj = {};
  if (isPlainObject(obj)) {
    Object.keys(obj).sort().forEach((key) => {
      const _key = key;
      sortObj[_key] = obj[_key];
    });
  }
  return !Object.keys(sortObj) ? obj : sortObj;
}
const customizeRE = /:/g;
function customizeEvent(str) {
  return camelize(str.replace(customizeRE, "-"));
}
const encode = encodeURIComponent;
function stringifyQuery(obj, encodeStr = encode) {
  const res = obj ? Object.keys(obj).map((key) => {
    let val = obj[key];
    if (typeof val === void 0 || val === null) {
      val = "";
    } else if (isPlainObject(val)) {
      val = JSON.stringify(val);
    }
    return encodeStr(key) + "=" + encodeStr(val);
  }).filter((x) => x.length > 0).join("&") : null;
  return res ? `?${res}` : "";
}
const PAGE_HOOKS = [
  ON_INIT,
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_ADD_TO_FAVORITES,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
function isRootHook(name) {
  return PAGE_HOOKS.indexOf(name) > -1;
}
const UniLifecycleHooks = [
  ON_SHOW,
  ON_HIDE,
  ON_LAUNCH,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION,
  ON_EXIT,
  ON_INIT,
  ON_LOAD,
  ON_READY,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_ADD_TO_FAVORITES,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
const MINI_PROGRAM_PAGE_RUNTIME_HOOKS = /* @__PURE__ */ (() => {
  return {
    onPageScroll: 1,
    onShareAppMessage: 1 << 1,
    onShareTimeline: 1 << 2
  };
})();
function isUniLifecycleHook(name, value, checkType = true) {
  if (checkType && !isFunction(value)) {
    return false;
  }
  if (UniLifecycleHooks.indexOf(name) > -1) {
    return true;
  } else if (name.indexOf("on") === 0) {
    return true;
  }
  return false;
}
let vueApp;
const createVueAppHooks = [];
function onCreateVueApp(hook) {
  if (vueApp) {
    return hook(vueApp);
  }
  createVueAppHooks.push(hook);
}
function invokeCreateVueAppHook(app) {
  vueApp = app;
  createVueAppHooks.forEach((hook) => hook(app));
}
const invokeCreateErrorHandler = once((app, createErrorHandler2) => {
  return createErrorHandler2(app);
});
const E$1 = function() {
};
E$1.prototype = {
  _id: 1,
  on: function(name, callback, ctx) {
    var e2 = this.e || (this.e = {});
    (e2[name] || (e2[name] = [])).push({
      fn: callback,
      ctx,
      _id: this._id
    });
    return this._id++;
  },
  once: function(name, callback, ctx) {
    var self2 = this;
    function listener() {
      self2.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;
    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }
    return this;
  },
  off: function(name, event) {
    var e2 = this.e || (this.e = {});
    var evts = e2[name];
    var liveEvents = [];
    if (evts && event) {
      for (var i = evts.length - 1; i >= 0; i--) {
        if (evts[i].fn === event || evts[i].fn._ === event || evts[i]._id === event) {
          evts.splice(i, 1);
          break;
        }
      }
      liveEvents = evts;
    }
    liveEvents.length ? e2[name] = liveEvents : delete e2[name];
    return this;
  }
};
var E$1$1 = E$1;
/**
* @dcloudio/uni-mp-vue v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function warn$2(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else {
      warn$2(`cannot run an inactive effect scope.`);
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    var _a;
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      (_a = this.onStop) == null ? void 0 : _a.call(this);
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  var _a;
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
    {
      (_a = effect2.onTrack) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  var _a;
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      {
        (_a = effect2.onTrigger) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
      }
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("iterate");
const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep,
      {
        target,
        type,
        key
      }
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4,
        {
          target,
          type,
          key,
          newValue,
          oldValue,
          oldTarget
        }
      );
    }
  }
  resetScheduling();
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    {
      warn$2(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
  deleteProperty(target, key) {
    {
      warn$2(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      warn$2(
        `${capitalize$1(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    warn$2(
      `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    {
      warn$2(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
const COMPUTED_SIDE_EFFECT_WARN = `Computed is still dirty after getter evaluation, likely because a computed is mutating its own dependency in its getter. State mutations in computed getters should be avoided.  Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self = toRaw(this);
    if ((!self._cacheable || self.effect.dirty) && hasChanged(self._value, self._value = self.effect.run())) {
      triggerRefValue(self, 4);
    }
    trackRefValue(self);
    if (self.effect._dirtyLevel >= 2) {
      if (this._warnRecursive) {
        warn$2(COMPUTED_SIDE_EFFECT_WARN, `

getter: `, this.getter);
      }
      triggerRefValue(self, 2);
    }
    return self._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
      warn$2("Write operation failed: computed value is readonly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  if (debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack;
    cRef.effect.onTrigger = debugOptions.onTrigger;
  }
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      ),
      {
        target: ref2,
        type: "get",
        key: "value"
      }
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel,
      {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      }
    );
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4, newVal);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a2) => {
          var _a, _b;
          return (_b = (_a = a2.toString) == null ? void 0 : _a.call(a2)) != null ? _b : JSON.stringify(a2);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://github.com/vuejs/core ."
};
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = ErrorTypeStrings[type] || type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    const info = ErrorTypeStrings[type] || type;
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      console.error(err);
    } else {
      console.error(err);
    }
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue$1 = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick$1(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue$1.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue$1[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue$1.length || !queue$1.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue$1.push(job);
    } else {
      queue$1.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function hasQueueJob(job) {
  return queue$1.indexOf(job) > -1;
}
function invalidateJob(job) {
  const i = queue$1.indexOf(job);
  if (i > flushIndex) {
    queue$1.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  for (; i < queue$1.length; i++) {
    const cb = queue$1[i];
    if (cb && cb.pre) {
      if (checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      queue$1.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a2, b) => getId(a2) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a2, b) => {
  const diff2 = getId(a2) - getId(b);
  if (diff2 === 0) {
    if (a2.pre && !b.pre)
      return -1;
    if (b.pre && !a2.pre)
      return 1;
  }
  return diff2;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  queue$1.sort(comparator);
  const check = (job) => checkRecursiveUpdates(seen, job);
  try {
    for (flushIndex = 0; flushIndex < queue$1.length; flushIndex++) {
      const job = queue$1[flushIndex];
      if (job && job.active !== false) {
        if (check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue$1.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue$1.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);
    if (count > RECURSION_LIMIT) {
      const instance = fn.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}
let devtools;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook(hook, target) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app, version2) {
  emit$1("app:init", app, version2, {
    Fragment,
    Text,
    Comment,
    Static
  });
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:added"
  /* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:updated"
  /* COMPONENT_UPDATED */
);
const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:removed"
  /* COMPONENT_REMOVED */
);
const devtoolsComponentRemoved = (component) => {
  if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
  !devtools.cleanupBuffer(component)) {
    _devtoolsComponentRemoved(component);
  }
};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(
      hook,
      component.appContext.app,
      component.uid,
      // fixed by xxxxxx
      // 为 0 是 App，无 parent 是 Page 指向 App
      component.uid === 0 ? void 0 : component.parent ? component.parent.uid : 0,
      component
    );
  };
}
const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:start"
  /* PERFORMANCE_START */
);
const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:end"
  /* PERFORMANCE_END */
);
function createDevtoolsPerformanceHook(hook) {
  return (component, type, time2) => {
    emit$1(hook, component.appContext.app, component.uid, component, type, time2);
  };
}
function devtoolsComponentEmit(component, event, params) {
  emit$1(
    "component:emit",
    component.appContext.app,
    component,
    event,
    params
  );
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
          warn$1(
            `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`
          );
        }
      } else {
        const validator = emitsOptions[event];
        if (isFunction(validator)) {
          const isValid = validator(...rawArgs);
          if (!isValid) {
            warn$1(
              `Invalid event arguments: event validation failed for event "${event}".`
            );
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a2) => isString(a2) ? a2.trim() : a2);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  {
    devtoolsComponentEmit(instance, event, args);
  }
  {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
      warn$1(
        `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
          event
        )}" instead of "${event}".`
      );
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  instance && instance.type.__scopeId || null;
  return prev;
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component2 = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component2,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize$1(camelize(name)))) {
        return Component2;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component2[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component2;
    }
    if (warnMissing && !res) {
      const extra = type === COMPONENTS ? `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.` : ``;
      warn$1(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
    }
    return res;
  } else {
    warn$1(
      `resolve${capitalize$1(type.slice(0, -1))} can only be used in render() or setup().`
    );
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize$1(camelize(name))]);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  if (!isFunction(cb)) {
    warn$1(
      `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
    );
  }
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once: once2,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once2) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  if (deep !== void 0 && typeof deep === "number") {
    warn$1(
      `watch() "deep" option with number value will be used as watch depth in future versions. Please use a boolean instead to avoid potential breakage.`
    );
  }
  if (!cb) {
    if (immediate !== void 0) {
      warn$1(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn$1(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (once2 !== void 0) {
      warn$1(
        `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const warnInvalidSource = (s2) => {
    warn$1(
      `Invalid watch source: `,
      s2,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return reactiveGetter(s2);
      } else if (isFunction(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else {
        warnInvalidSource(s2);
      }
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect$1(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  {
    effect2.onTrack = onTrack;
    effect2.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect$1(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth, currentDepth = 0, seen) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  if (depth && depth > 0) {
    if (currentDepth >= depth) {
      return value;
    }
    currentDepth++;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, depth, currentDepth, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, currentDepth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, currentDepth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, currentDepth, seen);
    }
  }
  return value;
}
function validateDirectiveName(name) {
  if (isBuiltInDirective(name)) {
    warn$1("Do not use built-in directive ids as custom directive id: " + name);
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      warn$1(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
        {
          warn$1(
            `app.config cannot be replaced. Modify individual options instead.`
          );
        }
      },
      use(plugin2, ...options) {
        if (installedPlugins.has(plugin2)) {
          warn$1(`Plugin has already been applied to target app.`);
        } else if (plugin2 && isFunction(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app, ...options);
        } else if (isFunction(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app, ...options);
        } else {
          warn$1(
            `A plugin must either be a function or an object with an "install" function.`
          );
        }
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          } else {
            warn$1(
              "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
            );
          }
        }
        return app;
      },
      component(name, component) {
        {
          validateComponentName(name, context.config);
        }
        if (!component) {
          return context.components[name];
        }
        if (context.components[name]) {
          warn$1(`Component "${name}" has already been registered in target app.`);
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context.directives[name];
        }
        if (context.directives[name]) {
          warn$1(`Directive "${name}" has already been registered in target app.`);
        }
        context.directives[name] = directive;
        return app;
      },
      // fixed by xxxxxx
      mount() {
      },
      // fixed by xxxxxx
      unmount() {
      },
      provide(key, value) {
        if (key in context.provides) {
          warn$1(
            `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
          );
        }
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) {
    {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
    if (currentInstance.type.mpType === "app") {
      currentInstance.appContext.app.provide(key, value);
    }
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else {
      warn$1(`injection "${String(key)}" not found.`);
    }
  } else {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    if (isRootHook(type)) {
      target = target.root;
    }
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else {
    const apiName = toHandlerKey(
      (ErrorTypeStrings[type] || type.replace(/^on/, "")).replace(/ hook$/, "")
    );
    warn$1(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().`
    );
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    // fixed by xxxxxx vue-i18n 在 dev 模式，访问了 $el，故模拟一个假的
    // $el: i => i.vnode.el,
    $el: (i) => i.__$el || (i.__$el = {}),
    $data: (i) => i.data,
    $props: (i) => shallowReadonly(i.props),
    $attrs: (i) => shallowReadonly(i.attrs),
    $slots: (i) => shallowReadonly(i.slots),
    $refs: (i) => shallowReadonly(i.refs),
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    // $nextTick: i => i.n || (i.n = nextTick.bind(i.proxy!)),// fixed by xxxxxx
    $watch: (i) => instanceWatch.bind(i)
  })
);
const isReservedPrefix = (key) => key === "_" || key === "$";
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key === "__isVue") {
      return true;
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      } else if (key === "$slots") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else if (currentRenderingInstance && (!isString(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key.indexOf("__v") !== 0)) {
      if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
        warn$1(
          `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
        );
      } else if (instance === currentRenderingInstance) {
        warn$1(
          `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
        );
      }
    }
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
      warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
      return false;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      warn$1(
        `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
      );
      return false;
    } else {
      if (key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
{
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn$1(
      `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
    );
    return Reflect.ownKeys(target);
  };
}
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys(toRaw(setupState)).forEach((key) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key[0])) {
        warn$1(
          `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: NOOP
      });
    }
  });
}
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type, key) => {
    if (cache[key]) {
      warn$1(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions$1(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = createDuplicateChecker();
  {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props", key);
      }
    }
  }
  function initInjections() {
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
  }
  {
    initInjections();
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        }
        {
          checkDuplicateProperties("Methods", key);
        }
      } else {
        warn$1(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
        );
      }
    }
  }
  if (dataOptions) {
    if (!isFunction(dataOptions)) {
      warn$1(
        `The data option must be a function. Plain object usage is no longer supported.`
      );
    }
    const data = dataOptions.call(publicThis, publicThis);
    if (isPromise(data)) {
      warn$1(
        `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
      );
    }
    if (!isObject(data)) {
      warn$1(`data() should return an object.`);
    } else {
      instance.data = reactive(data);
      {
        for (const key in data) {
          checkDuplicateProperties("Data", key);
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      if (get2 === NOOP) {
        warn$1(`Computed property "${key}" has no getter.`);
      }
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : () => {
        warn$1(
          `Write operation failed: computed property "${key}" is readonly.`
        );
      };
      const c2 = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v) => c2.value = v
      });
      {
        checkDuplicateProperties("Computed", key);
      }
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  function initProvides() {
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
  }
  {
    initProvides();
  }
  {
    if (created) {
      callHook$1(created, instance, "c");
    }
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
  if (instance.ctx.$onApplyOptions) {
    instance.ctx.$onApplyOptions(options, instance, publicThis);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
    {
      checkDuplicateProperties("Inject", key);
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    } else {
      warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      } else {
        warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else {
    warn$1(`Invalid watch option: "${key}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m2) => mergeOptions(resolved, m2, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m2) => mergeOptions(to, m2, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") {
      warn$1(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray$1,
  created: mergeAsArray$1,
  beforeMount: mergeAsArray$1,
  mounted: mergeAsArray$1,
  beforeUpdate: mergeAsArray$1,
  updated: mergeAsArray$1,
  beforeDestroy: mergeAsArray$1,
  beforeUnmount: mergeAsArray$1,
  destroyed: mergeAsArray$1,
  unmounted: mergeAsArray$1,
  activated: mergeAsArray$1,
  deactivated: mergeAsArray$1,
  errorCaptured: mergeAsArray$1,
  serverPrefetch: mergeAsArray$1,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray$1(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray$1(to[key], from[key]);
  }
  return merged;
}
function initProps$1(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function isInHmrContext(instance) {
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !isInHmrContext() && (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue$1(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue$1(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue$1(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue$1(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if (!isString(raw[i])) {
        warn$1(`props must be strings when using array syntax.`, raw[i]);
      }
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if (!isObject(raw)) {
      warn$1(`invalid props options`, raw);
    }
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  } else {
    warn$1(`Invalid prop name: "${key}" is a reserved property.`);
  }
  return false;
}
function getType$1(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a2, b) {
  return getType$1(a2) === getType$1(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props, instance) {
  const resolvedValues = toRaw(props);
  const options = instance.propsOptions[0];
  for (const key in options) {
    let opt = options[key];
    if (opt == null)
      continue;
    validateProp$1(
      key,
      resolvedValues[key],
      opt,
      shallowReadonly(resolvedValues),
      !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate(key))
    );
  }
}
function validateProp$1(name, value, prop, props, isAbsent) {
  const { type, required, validator, skipCheck } = prop;
  if (required && isAbsent) {
    warn$1('Missing required prop: "' + name + '"');
    return;
  }
  if (value == null && !required) {
    return;
  }
  if (type != null && type !== true && !skipCheck) {
    let isValid = false;
    const types = isArray(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType$1(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      warn$1(getInvalidTypeMessage$1(name, value, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value, props)) {
    warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType$1 = /* @__PURE__ */ makeMap(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function assertType$1(value, type) {
  let valid;
  const expectedType = getType$1(type);
  if (isSimpleType$1(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject(value);
  } else if (expectedType === "Array") {
    valid = isArray(value);
  } else if (expectedType === "null") {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage$1(name, value, expectedTypes) {
  if (expectedTypes.length === 0) {
    return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
  }
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize$1).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue$1(value, expectedType);
  const receivedValue = styleValue$1(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable$1(expectedType) && !isBoolean$1(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable$1(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue$1(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable$1(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean$1(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
let supported;
let perf;
function startMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type}-${instance.uid}`);
  }
  {
    devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function endMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    );
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }
  {
    devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function isSupported() {
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }
  return supported;
}
const queuePostRenderEffect$1 = queuePostFlushCb;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
const InternalObjectKey = `__vInternal`;
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null,
    // fixed by xxxxxx 用于存储uni-app的元素缓存
    $uniElements: /* @__PURE__ */ new Map(),
    $templateUniElementRefs: [],
    $templateUniElementStyles: {},
    $eS: {}
  };
  {
    instance.ctx = createDevRenderContext(instance);
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  internalSetCurrentInstance = (i) => {
    currentInstance = i;
  };
  setInSSRSetupState = (v) => {
    isInSSRComponentSetup = v;
  };
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, { isNativeTag }) {
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn$1(
      "Do not use built-in or reserved HTML elements as component id: " + name
    );
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const {
    props
    /*, children*/
  } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps$1(instance, props, isStateful, isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component2 = instance.type;
  {
    if (Component2.name) {
      validateComponentName(Component2.name, instance.appContext.config);
    }
    if (Component2.components) {
      const names = Object.keys(Component2.components);
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config);
      }
    }
    if (Component2.directives) {
      const names = Object.keys(Component2.directives);
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i]);
      }
    }
    if (Component2.compilerOptions && isRuntimeOnly()) {
      warn$1(
        `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
      );
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component2;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        shallowReadonly(instance.props),
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      {
        warn$1(
          `setup() returned a Promise, but the version of Vue you are using does not support it yet.`
        );
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    if (isVNode(setupResult)) {
      warn$1(
        `setup() should not return VNodes directly - return a render function instead.`
      );
    }
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if (setupResult !== void 0) {
    warn$1(
      `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
    );
  }
  finishComponentSetup(instance, isSSR);
}
let compile;
const isRuntimeOnly = () => !compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component2 = instance.type;
  if (!instance.render) {
    instance.render = Component2.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions$1(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
  if (!Component2.render && instance.render === NOOP && !isSSR) {
    if (Component2.template) {
      warn$1(
        `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
      );
    } else {
      warn$1(`Component is missing template or render function.`);
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      },
      set() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      },
      deleteProperty() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      }
    }
  ));
}
function getSlotsProxy(instance) {
  return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
    get(target, key) {
      track(instance, "get", "$slots");
      return target[key];
    }
  }));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    {
      if (instance.exposed) {
        warn$1(`expose() should be called only once per setup().`);
      }
      if (exposed != null) {
        let exposedType = typeof exposed;
        if (exposedType === "object") {
          if (isArray(exposed)) {
            exposedType = "array";
          } else if (isRef(exposed)) {
            exposedType = "ref";
          }
        }
        if (exposedType !== "object") {
          warn$1(
            `expose() should be passed a plain object, received ${exposedType}.`
          );
        }
      }
    }
    instance.exposed = exposed || {};
  };
  {
    return Object.freeze({
      get attrs() {
        return getAttrsProxy(instance);
      },
      get slots() {
        return getSlotsProxy(instance);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        }
        return instance.proxy[key];
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component2, includeInferred = true) {
  return isFunction(Component2) ? Component2.displayName || Component2.name : Component2.name || includeInferred && Component2.__name;
}
function formatComponentName(instance, Component2, isRoot = false) {
  let name = getComponentName(Component2);
  if (!name && Component2.__file) {
    const match = Component2.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component2) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
const computed = (getterOrOptions, debugOptions) => {
  const c2 = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  {
    const i = getCurrentInstance();
    if (i && i.appContext.config.warnRecursiveComputed) {
      c2._warnRecursive = true;
    }
  }
  return c2;
};
const version = "3.4.21";
const warn = warn$1;
function unwrapper(target) {
  return unref(target);
}
const ARRAYTYPE = "[object Array]";
const OBJECTTYPE = "[object Object]";
function diff(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, "", result);
  return result;
}
function syncKeys(current, pre) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    for (let key in pre) {
      const currentValue = current[key];
      if (currentValue === void 0) {
        current[key] = null;
      } else {
        syncKeys(currentValue, pre[key]);
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item, index2) => {
        syncKeys(current[index2], item);
      });
    }
  }
}
function _diff(current, pre, path, result) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
      setResult(result, path, current);
    } else {
      for (let key in current) {
        const currentValue = unwrapper(current[key]);
        const preValue = pre[key];
        const currentType = toTypeString(currentValue);
        const preType = toTypeString(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != preValue) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            if (currentValue.length < preValue.length) {
              setResult(
                result,
                (path == "" ? "" : path + ".") + key,
                currentValue
              );
            } else {
              currentValue.forEach((item, index2) => {
                _diff(
                  item,
                  preValue[index2],
                  (path == "" ? "" : path + ".") + key + "[" + index2 + "]",
                  result
                );
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == "" ? "" : path + ".") + key + "." + subKey,
                result
              );
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach((item, index2) => {
          _diff(item, pre[index2], path + "[" + index2 + "]", result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}
function setResult(result, k, v) {
  result[k] = v;
}
function hasComponentEffect(instance) {
  return queue$1.includes(instance.update);
}
function flushCallbacks(instance) {
  const ctx = instance.ctx;
  const callbacks = ctx.__next_tick_callbacks;
  if (callbacks && callbacks.length) {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
}
function nextTick(instance, fn) {
  const ctx = instance.ctx;
  if (!ctx.__next_tick_pending && !hasComponentEffect(instance)) {
    return nextTick$1(fn && fn.bind(instance.proxy));
  }
  let _resolve;
  if (!ctx.__next_tick_callbacks) {
    ctx.__next_tick_callbacks = [];
  }
  ctx.__next_tick_callbacks.push(() => {
    if (fn) {
      callWithErrorHandling(
        fn.bind(instance.proxy),
        instance,
        14
      );
    } else if (_resolve) {
      _resolve(instance.proxy);
    }
  });
  return new Promise((resolve2) => {
    _resolve = resolve2;
  });
}
function clone(src, seen) {
  src = unwrapper(src);
  const type = typeof src;
  if (type === "object" && src !== null) {
    let copy = seen.get(src);
    if (typeof copy !== "undefined") {
      return copy;
    }
    if (isArray(src)) {
      const len = src.length;
      copy = new Array(len);
      seen.set(src, copy);
      for (let i = 0; i < len; i++) {
        copy[i] = clone(src[i], seen);
      }
    } else {
      copy = {};
      seen.set(src, copy);
      for (const name in src) {
        if (hasOwn(src, name)) {
          copy[name] = clone(src[name], seen);
        }
      }
    }
    return copy;
  }
  if (type !== "symbol") {
    return src;
  }
}
function deepCopy(src) {
  return clone(src, typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map());
}
function getMPInstanceData(instance, keys) {
  const data = instance.data;
  const ret = /* @__PURE__ */ Object.create(null);
  keys.forEach((key) => {
    ret[key] = data[key];
  });
  return ret;
}
function patch(instance, data, oldData) {
  if (!data) {
    return;
  }
  data = deepCopy(data);
  data.$eS = instance.$eS || {};
  const ctx = instance.ctx;
  const mpType = ctx.mpType;
  if (mpType === "page" || mpType === "component") {
    data.r0 = 1;
    const mpInstance = ctx.$scope;
    const keys = Object.keys(data);
    const diffData = diff(data, oldData || getMPInstanceData(mpInstance, keys));
    if (Object.keys(diffData).length) {
      ctx.__next_tick_pending = true;
      mpInstance.setData(diffData, () => {
        ctx.__next_tick_pending = false;
        flushCallbacks(instance);
      });
      flushPreFlushCbs();
    } else {
      flushCallbacks(instance);
    }
  }
}
function initAppConfig(appConfig) {
  appConfig.globalProperties.$nextTick = function $nextTick(fn) {
    return nextTick(this.$, fn);
  };
}
function onApplyOptions(options, instance, publicThis) {
  instance.appContext.config.globalProperties.$applyOptions(
    options,
    instance,
    publicThis
  );
  const computedOptions = options.computed;
  if (computedOptions) {
    const keys = Object.keys(computedOptions);
    if (keys.length) {
      const ctx = instance.ctx;
      if (!ctx.$computedKeys) {
        ctx.$computedKeys = [];
      }
      ctx.$computedKeys.push(...keys);
    }
  }
  delete instance.ctx.$onApplyOptions;
}
function setRef$1(instance, isUnmount = false) {
  const {
    setupState,
    $templateRefs,
    $templateUniElementRefs,
    ctx: { $scope, $mpPlatform }
  } = instance;
  if ($mpPlatform === "mp-alipay") {
    return;
  }
  if (!$scope || !$templateRefs && !$templateUniElementRefs) {
    return;
  }
  if (isUnmount) {
    $templateRefs && $templateRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    $templateUniElementRefs && $templateUniElementRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    return;
  }
  const check = $mpPlatform === "mp-baidu" || $mpPlatform === "mp-toutiao";
  const doSetByRefs = (refs) => {
    if (refs.length === 0) {
      return [];
    }
    const mpComponents = (
      // 字节小程序 selectAllComponents 可能返回 null
      // https://github.com/dcloudio/uni-app/issues/3954
      ($scope.selectAllComponents(".r") || []).concat(
        $scope.selectAllComponents(".r-i-f") || []
      )
    );
    return refs.filter((templateRef) => {
      const refValue = findComponentPublicInstance(mpComponents, templateRef.i);
      if (check && refValue === null) {
        return true;
      }
      setTemplateRef(templateRef, refValue, setupState);
      return false;
    });
  };
  const doSet = () => {
    if ($templateRefs) {
      const refs = doSetByRefs($templateRefs);
      if (refs.length && instance.proxy && instance.proxy.$scope) {
        instance.proxy.$scope.setData({ r1: 1 }, () => {
          doSetByRefs(refs);
        });
      }
    }
  };
  if ($templateUniElementRefs && $templateUniElementRefs.length) {
    nextTick(instance, () => {
      $templateUniElementRefs.forEach((templateRef) => {
        if (isArray(templateRef.v)) {
          templateRef.v.forEach((v) => {
            setTemplateRef(templateRef, v, setupState);
          });
        } else {
          setTemplateRef(templateRef, templateRef.v, setupState);
        }
      });
    });
  }
  if ($scope._$setRef) {
    $scope._$setRef(doSet);
  } else {
    nextTick(instance, doSet);
  }
}
function toSkip(value) {
  if (isObject(value)) {
    markRaw(value);
  }
  return value;
}
function findComponentPublicInstance(mpComponents, id) {
  const mpInstance = mpComponents.find(
    (com) => com && (com.properties || com.props).uI === id
  );
  if (mpInstance) {
    const vm = mpInstance.$vm;
    if (vm) {
      return getExposeProxy(vm.$) || vm;
    }
    return toSkip(mpInstance);
  }
  return null;
}
function setTemplateRef({ r: r2, f: f2 }, refValue, setupState) {
  if (isFunction(r2)) {
    r2(refValue, {});
  } else {
    const _isString = isString(r2);
    const _isRef = isRef(r2);
    if (_isString || _isRef) {
      if (f2) {
        if (!_isRef) {
          return;
        }
        if (!isArray(r2.value)) {
          r2.value = [];
        }
        const existing = r2.value;
        if (existing.indexOf(refValue) === -1) {
          existing.push(refValue);
          if (!refValue) {
            return;
          }
          if (refValue.$) {
            onBeforeUnmount(() => remove(existing, refValue), refValue.$);
          }
        }
      } else if (_isString) {
        if (hasOwn(setupState, r2)) {
          setupState[r2] = refValue;
        }
      } else if (isRef(r2)) {
        r2.value = refValue;
      } else {
        warnRef(r2);
      }
    } else {
      warnRef(r2);
    }
  }
}
function warnRef(ref2) {
  warn("Invalid template ref type:", ref2, `(${typeof ref2})`);
}
const queuePostRenderEffect = queuePostFlushCb;
function mountComponent(initialVNode, options) {
  const instance = initialVNode.component = createComponentInstance(initialVNode, options.parentComponent, null);
  {
    instance.ctx.$onApplyOptions = onApplyOptions;
    instance.ctx.$children = [];
  }
  if (options.mpType === "app") {
    instance.render = NOOP;
  }
  if (options.onBeforeSetup) {
    options.onBeforeSetup(instance, options);
  }
  {
    pushWarningContext(initialVNode);
    startMeasure(instance, `mount`);
  }
  {
    startMeasure(instance, `init`);
  }
  setupComponent(instance);
  {
    endMeasure(instance, `init`);
  }
  {
    if (options.parentComponent && instance.proxy) {
      options.parentComponent.ctx.$children.push(getExposeProxy(instance) || instance.proxy);
    }
  }
  setupRenderEffect(instance);
  {
    popWarningContext();
    endMeasure(instance, `mount`);
  }
  return instance.proxy;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
function renderComponentRoot(instance) {
  const {
    type: Component2,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    uid: uid2,
    appContext: {
      app: {
        config: {
          globalProperties: { pruneComponentPropsCache: pruneComponentPropsCache2 }
        }
      }
    },
    inheritAttrs
  } = instance;
  instance.$uniElementIds = /* @__PURE__ */ new Map();
  instance.$templateRefs = [];
  instance.$templateUniElementRefs = [];
  instance.$templateUniElementStyles = {};
  instance.$ei = 0;
  pruneComponentPropsCache2(uid2);
  instance.__counter = instance.__counter === 0 ? 1 : 0;
  let result;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      fallthroughAttrs(inheritAttrs, props, propsOptions, attrs);
      const proxyToUse = withProxy || proxy;
      result = render.call(
        proxyToUse,
        proxyToUse,
        renderCache,
        props,
        setupState,
        data,
        ctx
      );
    } else {
      fallthroughAttrs(
        inheritAttrs,
        props,
        propsOptions,
        Component2.props ? attrs : getFunctionalFallthrough(attrs)
      );
      const render2 = Component2;
      result = render2.length > 1 ? render2(props, { attrs, slots, emit: emit2 }) : render2(
        props,
        null
        /* we know it doesn't need it */
      );
    }
  } catch (err) {
    handleError(err, instance, 1);
    result = false;
  }
  setRef$1(instance);
  setCurrentRenderingInstance(prev);
  return result;
}
function fallthroughAttrs(inheritAttrs, props, propsOptions, fallthroughAttrs2) {
  if (props && fallthroughAttrs2 && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs2).filter(
      (key) => key !== "class" && key !== "style"
    );
    if (!keys.length) {
      return;
    }
    if (propsOptions && keys.some(isModelListener)) {
      keys.forEach((key) => {
        if (!isModelListener(key) || !(key.slice(9) in propsOptions)) {
          props[key] = fallthroughAttrs2[key];
        }
      });
    } else {
      keys.forEach((key) => props[key] = fallthroughAttrs2[key]);
    }
  }
}
const updateComponentPreRender = (instance) => {
  pauseTracking();
  flushPreFlushCbs();
  resetTracking();
};
function componentUpdateScopedSlotsFn() {
  const scopedSlotsData = this.$scopedSlotsData;
  if (!scopedSlotsData || scopedSlotsData.length === 0) {
    return;
  }
  const mpInstance = this.ctx.$scope;
  const oldData = mpInstance.data;
  const diffData = /* @__PURE__ */ Object.create(null);
  scopedSlotsData.forEach(({ path, index: index2, data }) => {
    const oldScopedSlotData = getValueByDataPath(oldData, path);
    const diffPath = isString(index2) ? `${path}.${index2}` : `${path}[${index2}]`;
    if (typeof oldScopedSlotData === "undefined" || typeof oldScopedSlotData[index2] === "undefined") {
      diffData[diffPath] = data;
    } else {
      const diffScopedSlotData = diff(
        data,
        oldScopedSlotData[index2]
      );
      Object.keys(diffScopedSlotData).forEach((name) => {
        diffData[diffPath + "." + name] = diffScopedSlotData[name];
      });
    }
  });
  scopedSlotsData.length = 0;
  if (Object.keys(diffData).length) {
    mpInstance.setData(diffData);
  }
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function setupRenderEffect(instance) {
  const updateScopedSlots = componentUpdateScopedSlotsFn.bind(
    instance
  );
  instance.$updateScopedSlots = () => nextTick$1(() => queueJob(updateScopedSlots));
  const componentUpdateFn = () => {
    if (!instance.isMounted) {
      onBeforeUnmount(() => {
        setRef$1(instance, true);
      }, instance);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      {
        devtoolsComponentAdded(instance);
      }
    } else {
      const { next, bu, u: u2 } = instance;
      {
        pushWarningContext(next || instance.vnode);
      }
      toggleRecurse(instance, false);
      updateComponentPreRender();
      if (bu) {
        invokeArrayFns$1(bu);
      }
      toggleRecurse(instance, true);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      if (u2) {
        queuePostRenderEffect(u2);
      }
      {
        devtoolsComponentUpdated(instance);
      }
      {
        popWarningContext();
      }
    }
  };
  const effect2 = instance.effect = new ReactiveEffect(
    componentUpdateFn,
    NOOP,
    () => queueJob(update),
    instance.scope
    // track it in component's effect scope
  );
  const update = instance.update = () => {
    if (effect2.dirty) {
      effect2.run();
    }
  };
  update.id = instance.uid;
  toggleRecurse(instance, true);
  {
    effect2.onTrack = instance.rtc ? (e2) => invokeArrayFns$1(instance.rtc, e2) : void 0;
    effect2.onTrigger = instance.rtg ? (e2) => invokeArrayFns$1(instance.rtg, e2) : void 0;
    update.ownerInstance = instance;
  }
  {
    update();
  }
}
function unmountComponent(instance) {
  const { bum, scope, update, um } = instance;
  if (bum) {
    invokeArrayFns$1(bum);
  }
  {
    const parentInstance = instance.parent;
    if (parentInstance) {
      const $children = parentInstance.ctx.$children;
      const target = getExposeProxy(instance) || instance.proxy;
      const index2 = $children.indexOf(target);
      if (index2 > -1) {
        $children.splice(index2, 1);
      }
    }
  }
  scope.stop();
  if (update) {
    update.active = false;
  }
  if (um) {
    queuePostRenderEffect(um);
  }
  queuePostRenderEffect(() => {
    instance.isUnmounted = true;
  });
  {
    devtoolsComponentRemoved(instance);
  }
}
const oldCreateApp = createAppAPI();
function getTarget() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof my !== "undefined") {
    return my;
  }
}
function createVueApp(rootComponent, rootProps = null) {
  const target = getTarget();
  target.__VUE__ = true;
  {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }
  const app = oldCreateApp(rootComponent, rootProps);
  const appContext = app._context;
  initAppConfig(appContext.config);
  const createVNode2 = (initialVNode) => {
    initialVNode.appContext = appContext;
    initialVNode.shapeFlag = 6;
    return initialVNode;
  };
  const createComponent2 = function createComponent22(initialVNode, options) {
    return mountComponent(createVNode2(initialVNode), options);
  };
  const destroyComponent = function destroyComponent2(component) {
    return component && unmountComponent(component.$);
  };
  app.mount = function mount() {
    rootComponent.render = NOOP;
    const instance = mountComponent(
      createVNode2({ type: rootComponent }),
      {
        mpType: "app",
        mpInstance: null,
        parentComponent: null,
        slots: [],
        props: null
      }
    );
    app._instance = instance.$;
    {
      devtoolsInitApp(app, version);
    }
    instance.$app = app;
    instance.$createComponent = createComponent2;
    instance.$destroyComponent = destroyComponent;
    appContext.$appInstance = instance;
    return instance;
  };
  app.unmount = function unmount() {
    warn(`Cannot unmount an app.`);
  };
  return app;
}
function injectLifecycleHook(name, hook, publicThis, instance) {
  if (isFunction(hook)) {
    injectHook(name, hook.bind(publicThis), instance);
  }
}
function initHooks$1(options, instance, publicThis) {
  const mpType = options.mpType || publicThis.$mpType;
  if (!mpType || mpType === "component") {
    return;
  }
  Object.keys(options).forEach((name) => {
    if (isUniLifecycleHook(name, options[name], false)) {
      const hooks = options[name];
      if (isArray(hooks)) {
        hooks.forEach((hook) => injectLifecycleHook(name, hook, publicThis, instance));
      } else {
        injectLifecycleHook(name, hooks, publicThis, instance);
      }
    }
  });
}
function applyOptions$2(options, instance, publicThis) {
  initHooks$1(options, instance, publicThis);
}
function set(target, key, val) {
  return target[key] = val;
}
function $callMethod(method, ...args) {
  const fn = this[method];
  if (fn) {
    return fn(...args);
  }
  console.error(`method ${method} not found`);
  return null;
}
function createErrorHandler(app) {
  const userErrorHandler = app.config.errorHandler;
  return function errorHandler(err, instance, info) {
    if (userErrorHandler) {
      userErrorHandler(err, instance, info);
    }
    const appInstance = app._instance;
    if (!appInstance || !appInstance.proxy) {
      throw err;
    }
    if (appInstance[ON_ERROR]) {
      {
        appInstance.proxy.$callHook(ON_ERROR, err);
      }
    } else {
      logError(err, info, instance ? instance.$.vnode : null, false);
    }
  };
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function initOptionMergeStrategies(optionMergeStrategies) {
  UniLifecycleHooks.forEach((name) => {
    optionMergeStrategies[name] = mergeAsArray;
  });
}
let realAtob;
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== "function") {
  realAtob = function(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    str += "==".slice(2 - (str.length & 3));
    var bitmap;
    var result = "";
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length; ) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split("").map(function(c2) {
    return "%" + ("00" + c2.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
}
function getCurrentUserInfo() {
  const token = index.getStorageSync("uni_id_token") || "";
  const tokenArr = token.split(".");
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  let userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error("获取当前用户信息出错，详细错误信息为：" + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1e3;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(globalProperties) {
  globalProperties.uniIDHasRole = function(roleId) {
    const { role } = getCurrentUserInfo();
    return role.indexOf(roleId) > -1;
  };
  globalProperties.uniIDHasPermission = function(permissionId) {
    const { permission } = getCurrentUserInfo();
    return this.uniIDHasRole("admin") || permission.indexOf(permissionId) > -1;
  };
  globalProperties.uniIDTokenValid = function() {
    const { tokenExpired } = getCurrentUserInfo();
    return tokenExpired > Date.now();
  };
}
function initApp(app) {
  const appConfig = app.config;
  appConfig.errorHandler = invokeCreateErrorHandler(app, createErrorHandler);
  initOptionMergeStrategies(appConfig.optionMergeStrategies);
  const globalProperties = appConfig.globalProperties;
  {
    uniIdMixin(globalProperties);
  }
  {
    globalProperties.$set = set;
    globalProperties.$applyOptions = applyOptions$2;
    globalProperties.$callMethod = $callMethod;
  }
  {
    index.invokeCreateVueAppHook(app);
  }
}
const propsCaches = /* @__PURE__ */ Object.create(null);
function renderProps(props) {
  const { uid: uid2, __counter } = getCurrentInstance();
  const propsId = (propsCaches[uid2] || (propsCaches[uid2] = [])).push(guardReactiveProps(props)) - 1;
  return uid2 + "," + propsId + "," + __counter;
}
function pruneComponentPropsCache(uid2) {
  delete propsCaches[uid2];
}
function findComponentPropsData(up) {
  if (!up) {
    return;
  }
  const [uid2, propsId] = up.split(",");
  if (!propsCaches[uid2]) {
    return;
  }
  return propsCaches[uid2][parseInt(propsId)];
}
var plugin = {
  install(app) {
    initApp(app);
    app.config.globalProperties.pruneComponentPropsCache = pruneComponentPropsCache;
    const oldMount = app.mount;
    app.mount = function mount(rootContainer) {
      const instance = oldMount.call(app, rootContainer);
      const createApp2 = getCreateApp();
      if (createApp2) {
        createApp2(instance);
      } else {
        if (typeof createMiniProgramApp !== "undefined") {
          createMiniProgramApp(instance);
        }
      }
      return instance;
    };
  }
};
function getCreateApp() {
  const method = "createApp";
  if (typeof global !== "undefined" && typeof global[method] !== "undefined") {
    return global[method];
  } else if (typeof my !== "undefined") {
    return my[method];
  }
}
function vOn(value, key) {
  const instance = getCurrentInstance();
  const ctx = instance.ctx;
  const extraKey = typeof key !== "undefined" && (ctx.$mpPlatform === "mp-weixin" || ctx.$mpPlatform === "mp-qq" || ctx.$mpPlatform === "mp-xhs") && (isString(key) || typeof key === "number") ? "_" + key : "";
  const name = "e" + instance.$ei++ + extraKey;
  const mpInstance = ctx.$scope;
  if (!value) {
    delete mpInstance[name];
    return name;
  }
  const existingInvoker = mpInstance[name];
  if (existingInvoker) {
    existingInvoker.value = value;
  } else {
    mpInstance[name] = createInvoker(value, instance);
  }
  return name;
}
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    patchMPEvent(e2);
    let args = [e2];
    if (instance && instance.ctx.$getTriggerEventDetail) {
      if (typeof e2.detail === "number") {
        e2.detail = instance.ctx.$getTriggerEventDetail(e2.detail);
      }
    }
    if (e2.detail && e2.detail.__args__) {
      args = e2.detail.__args__;
    }
    const eventValue = invoker.value;
    const invoke = () => callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, eventValue), instance, 5, args);
    const eventTarget = e2.target;
    const eventSync = eventTarget ? eventTarget.dataset ? String(eventTarget.dataset.eventsync) === "true" : false : false;
    if (bubbles.includes(e2.type) && !eventSync) {
      setTimeout(invoke);
    } else {
      const res = invoke();
      if (e2.type === "input" && (isArray(res) || isPromise(res))) {
        return;
      }
      return res;
    }
  };
  invoker.value = initialValue;
  return invoker;
}
const bubbles = [
  // touch事件暂不做延迟，否则在 Android 上会影响性能，比如一些拖拽跟手手势等
  // 'touchstart',
  // 'touchmove',
  // 'touchcancel',
  // 'touchend',
  "tap",
  "longpress",
  "longtap",
  "transitionend",
  "animationstart",
  "animationiteration",
  "animationend",
  "touchforcechange"
];
function patchMPEvent(event, instance) {
  if (event.type && event.target) {
    event.preventDefault = NOOP;
    event.stopPropagation = NOOP;
    event.stopImmediatePropagation = NOOP;
    if (!hasOwn(event, "detail")) {
      event.detail = {};
    }
    if (hasOwn(event, "markerId")) {
      event.detail = typeof event.detail === "object" ? event.detail : {};
      event.detail.markerId = event.markerId;
    }
    if (isPlainObject(event.detail) && hasOwn(event.detail, "checked") && !hasOwn(event.detail, "value")) {
      event.detail.value = event.detail.checked;
    }
    if (isPlainObject(event.detail)) {
      event.target = extend({}, event.target, event.detail);
    }
  }
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop && originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map((fn) => (e3) => !e3._stopped && fn(e3));
  } else {
    return value;
  }
}
function vFor(source, renderItem) {
  let ret;
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, i);
    }
  } else if (typeof source === "number") {
    if (!Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`);
      return [];
    }
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, i);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, i));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function setRef(ref2, id, opts = {}) {
  const { $templateRefs } = getCurrentInstance();
  $templateRefs.push({ i: id, r: ref2, k: opts.k, f: opts.f });
}
const o = (value, key) => vOn(value, key);
const f$1 = (source, renderItem) => vFor(source, renderItem);
const e$1 = (target, ...sources) => extend(target, ...sources);
const t = (val) => toDisplayString(val);
const p = (props) => renderProps(props);
const sr = (ref2, id, opts) => setRef(ref2, id, opts);
function createApp$1(rootComponent, rootProps = null) {
  rootComponent && (rootComponent.mpType = "app");
  return createVueApp(rootComponent, rootProps).use(plugin);
}
const createSSRApp = createApp$1;
function validateProtocolFail(name, msg) {
  console.warn(`${name}: ${msg}`);
}
function validateProtocol(name, data, protocol, onFail) {
  if (!onFail) {
    onFail = validateProtocolFail;
  }
  for (const key in protocol) {
    const errMsg = validateProp(key, data[key], protocol[key], !hasOwn(data, key));
    if (isString(errMsg)) {
      onFail(name, errMsg);
    }
  }
}
function validateProtocols(name, args, protocol, onFail) {
  if (!protocol) {
    return;
  }
  if (!isArray(protocol)) {
    return validateProtocol(name, args[0] || /* @__PURE__ */ Object.create(null), protocol, onFail);
  }
  const len = protocol.length;
  const argsLen = args.length;
  for (let i = 0; i < len; i++) {
    const opts = protocol[i];
    const data = /* @__PURE__ */ Object.create(null);
    if (argsLen > i) {
      data[opts.name] = args[i];
    }
    validateProtocol(name, data, { [opts.name]: opts }, onFail);
  }
}
function validateProp(name, value, prop, isAbsent) {
  if (!isPlainObject(prop)) {
    prop = { type: prop };
  }
  const { type, required, validator } = prop;
  if (required && isAbsent) {
    return 'Missing required args: "' + name + '"';
  }
  if (value == null && !required) {
    return;
  }
  if (type != null) {
    let isValid = false;
    const types = isArray(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      return getInvalidTypeMessage(name, value, expectedTypes);
    }
  }
  if (validator) {
    return validator(value);
  }
}
const isSimpleType = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol");
function assertType(value, type) {
  let valid;
  const expectedType = getType(type);
  if (isSimpleType(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject(value);
  } else if (expectedType === "Array") {
    valid = isArray(value);
  } else {
    {
      valid = value instanceof type;
    }
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value, expectedTypes) {
  let message = `Invalid args: type check failed for args "${name}". Expected ${expectedTypes.map(capitalize$1).join(", ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
function tryCatch(fn) {
  return function() {
    try {
      return fn.apply(fn, arguments);
    } catch (e2) {
      console.error(e2);
    }
  };
}
let invokeCallbackId = 1;
const invokeCallbacks = {};
function addInvokeCallback(id, name, callback, keepAlive = false) {
  invokeCallbacks[id] = {
    name,
    keepAlive,
    callback
  };
  return id;
}
function invokeCallback(id, res, extras) {
  if (typeof id === "number") {
    const opts = invokeCallbacks[id];
    if (opts) {
      if (!opts.keepAlive) {
        delete invokeCallbacks[id];
      }
      return opts.callback(res, extras);
    }
  }
  return res;
}
const API_SUCCESS = "success";
const API_FAIL = "fail";
const API_COMPLETE = "complete";
function getApiCallbacks(args) {
  const apiCallbacks = {};
  for (const name in args) {
    const fn = args[name];
    if (isFunction(fn)) {
      apiCallbacks[name] = tryCatch(fn);
      delete args[name];
    }
  }
  return apiCallbacks;
}
function normalizeErrMsg(errMsg, name) {
  if (!errMsg || errMsg.indexOf(":fail") === -1) {
    return name + ":ok";
  }
  return name + errMsg.substring(errMsg.indexOf(":fail"));
}
function createAsyncApiCallback(name, args = {}, { beforeAll, beforeSuccess } = {}) {
  if (!isPlainObject(args)) {
    args = {};
  }
  const { success, fail, complete } = getApiCallbacks(args);
  const hasSuccess = isFunction(success);
  const hasFail = isFunction(fail);
  const hasComplete = isFunction(complete);
  const callbackId = invokeCallbackId++;
  addInvokeCallback(callbackId, name, (res) => {
    res = res || {};
    res.errMsg = normalizeErrMsg(res.errMsg, name);
    isFunction(beforeAll) && beforeAll(res);
    if (res.errMsg === name + ":ok") {
      isFunction(beforeSuccess) && beforeSuccess(res, args);
      hasSuccess && success(res);
    } else {
      hasFail && fail(res);
    }
    hasComplete && complete(res);
  });
  return callbackId;
}
const HOOK_SUCCESS = "success";
const HOOK_FAIL = "fail";
const HOOK_COMPLETE = "complete";
const globalInterceptors = {};
const scopedInterceptors = {};
function wrapperHook(hook, params) {
  return function(data) {
    return hook(data, params) || data;
  };
}
function queue(hooks, data, params) {
  let promise = false;
  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook, params));
    } else {
      const res = hook(data, params);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then() {
          },
          catch() {
          }
        };
      }
    }
  }
  return promise || {
    then(callback) {
      return callback(data);
    },
    catch() {
    }
  };
}
function wrapperOptions(interceptors2, options = {}) {
  [HOOK_SUCCESS, HOOK_FAIL, HOOK_COMPLETE].forEach((name) => {
    const hooks = interceptors2[name];
    if (!isArray(hooks)) {
      return;
    }
    const oldCallback = options[name];
    options[name] = function callbackInterceptor(res) {
      queue(hooks, res, options).then((res2) => {
        return isFunction(oldCallback) && oldCallback(res2) || res2;
      });
    };
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  const returnValueHooks = [];
  if (isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push(...globalInterceptors.returnValue);
  }
  const interceptor = scopedInterceptors[method];
  if (interceptor && isArray(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue);
  }
  returnValueHooks.forEach((hook) => {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  const interceptor = /* @__PURE__ */ Object.create(null);
  Object.keys(globalInterceptors).forEach((hook) => {
    if (hook !== "returnValue") {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  const scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach((hook) => {
      if (hook !== "returnValue") {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options, params) {
  const interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (isArray(interceptor.invoke)) {
      const res = queue(interceptor.invoke, options);
      return res.then((options2) => {
        return api(wrapperOptions(getApiInterceptorHooks(method), options2), ...params);
      });
    } else {
      return api(wrapperOptions(interceptor, options), ...params);
    }
  }
  return api(options, ...params);
}
function hasCallback(args) {
  if (isPlainObject(args) && [API_SUCCESS, API_FAIL, API_COMPLETE].find((cb) => isFunction(args[cb]))) {
    return true;
  }
  return false;
}
function handlePromise(promise) {
  return promise;
}
function promisify$1(name, fn) {
  return (args = {}, ...rest) => {
    if (hasCallback(args)) {
      return wrapperReturnValue(name, invokeApi(name, fn, args, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, fn, extend(args, { success: resolve2, fail: reject }), rest);
    })));
  };
}
function formatApiArgs(args, options) {
  args[0];
  {
    return;
  }
}
function invokeSuccess(id, name, res) {
  const result = {
    errMsg: name + ":ok"
  };
  return invokeCallback(id, extend(res || {}, result));
}
function invokeFail(id, name, errMsg, errRes = {}) {
  const errMsgPrefix = name + ":fail";
  let apiErrMsg = "";
  if (!errMsg) {
    apiErrMsg = errMsgPrefix;
  } else if (errMsg.indexOf(errMsgPrefix) === 0) {
    apiErrMsg = errMsg;
  } else {
    apiErrMsg = errMsgPrefix + " " + errMsg;
  }
  {
    delete errRes.errCode;
  }
  let res = extend({ errMsg: apiErrMsg }, errRes);
  return invokeCallback(id, res);
}
function beforeInvokeApi(name, args, protocol, options) {
  {
    validateProtocols(name, args, protocol);
  }
  const errMsg = formatApiArgs(args);
  if (errMsg) {
    return errMsg;
  }
}
function parseErrMsg(errMsg) {
  if (!errMsg || isString(errMsg)) {
    return errMsg;
  }
  if (errMsg.stack) {
    if (typeof globalThis === "undefined" || !globalThis.harmonyChannel) {
      console.error(errMsg.message + "\n" + errMsg.stack);
    }
    return errMsg.message;
  }
  return errMsg;
}
function wrapperTaskApi(name, fn, protocol, options) {
  return (args) => {
    const id = createAsyncApiCallback(name, args, options);
    const errMsg = beforeInvokeApi(name, [args], protocol);
    if (errMsg) {
      return invokeFail(id, name, errMsg);
    }
    return fn(args, {
      resolve: (res) => invokeSuccess(id, name, res),
      reject: (errMsg2, errRes) => invokeFail(id, name, parseErrMsg(errMsg2), errRes)
    });
  };
}
function wrapperSyncApi(name, fn, protocol, options) {
  return (...args) => {
    const errMsg = beforeInvokeApi(name, args, protocol);
    if (errMsg) {
      throw new Error(errMsg);
    }
    return fn.apply(null, args);
  };
}
function wrapperAsyncApi(name, fn, protocol, options) {
  return wrapperTaskApi(name, fn, protocol, options);
}
function defineSyncApi(name, fn, protocol, options) {
  return wrapperSyncApi(name, fn, protocol);
}
function defineAsyncApi(name, fn, protocol, options) {
  return promisify$1(name, wrapperAsyncApi(name, fn, protocol, options));
}
const API_UPX2PX = "upx2px";
const Upx2pxProtocol = [
  {
    name: "upx",
    type: [Number, String],
    required: true
  }
];
const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;
function checkDeviceWidth() {
  const { windowWidth, pixelRatio, platform } = Object.assign({}, wx.getWindowInfo(), {
    platform: wx.getDeviceInfo().platform
  });
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === "ios";
}
const upx2px = defineSyncApi(API_UPX2PX, (number, newDeviceWidth) => {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  let width = newDeviceWidth || deviceWidth;
  let result = number / BASE_DEVICE_WIDTH * width;
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}, Upx2pxProtocol);
function __f__(type, filename, ...args) {
  if (filename) {
    args.push(filename);
  }
  console[type].apply(console, args);
}
const API_ADD_INTERCEPTOR = "addInterceptor";
const API_REMOVE_INTERCEPTOR = "removeInterceptor";
const AddInterceptorProtocol = [
  {
    name: "method",
    type: [String, Object],
    required: true
  }
];
const RemoveInterceptorProtocol = AddInterceptorProtocol;
function mergeInterceptorHook(interceptors2, interceptor) {
  Object.keys(interceptor).forEach((hook) => {
    if (isFunction(interceptor[hook])) {
      interceptors2[hook] = mergeHook(interceptors2[hook], interceptor[hook]);
    }
  });
}
function removeInterceptorHook(interceptors2, interceptor) {
  if (!interceptors2 || !interceptor) {
    return;
  }
  Object.keys(interceptor).forEach((name) => {
    const hooks = interceptors2[name];
    const hook = interceptor[name];
    if (isArray(hooks) && isFunction(hook)) {
      remove(hooks, hook);
    }
  });
}
function mergeHook(parentVal, childVal) {
  const res = childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}
const addInterceptor = defineSyncApi(API_ADD_INTERCEPTOR, (method, interceptor) => {
  if (isString(method) && isPlainObject(interceptor)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), interceptor);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}, AddInterceptorProtocol);
const removeInterceptor = defineSyncApi(API_REMOVE_INTERCEPTOR, (method, interceptor) => {
  if (isString(method)) {
    if (isPlainObject(interceptor)) {
      removeInterceptorHook(scopedInterceptors[method], interceptor);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}, RemoveInterceptorProtocol);
const interceptors = {};
const API_ON = "$on";
const OnProtocol = [
  {
    name: "event",
    type: String,
    required: true
  },
  {
    name: "callback",
    type: Function,
    required: true
  }
];
const API_ONCE = "$once";
const OnceProtocol = OnProtocol;
const API_OFF = "$off";
const OffProtocol = [
  {
    name: "event",
    type: [String, Array]
  },
  {
    name: "callback",
    type: [Function, Number]
  }
];
const API_EMIT = "$emit";
const EmitProtocol = [
  {
    name: "event",
    type: String,
    required: true
  }
];
class EventBus {
  constructor() {
    this.$emitter = new E$1$1();
  }
  on(name, callback) {
    return this.$emitter.on(name, callback);
  }
  once(name, callback) {
    return this.$emitter.once(name, callback);
  }
  off(name, callback) {
    if (!name) {
      this.$emitter.e = {};
      return;
    }
    this.$emitter.off(name, callback);
  }
  emit(name, ...args) {
    this.$emitter.emit(name, ...args);
  }
}
const eventBus = new EventBus();
const $on = defineSyncApi(API_ON, (name, callback) => {
  eventBus.on(name, callback);
  return () => eventBus.off(name, callback);
}, OnProtocol);
const $once = defineSyncApi(API_ONCE, (name, callback) => {
  eventBus.once(name, callback);
  return () => eventBus.off(name, callback);
}, OnceProtocol);
const $off = defineSyncApi(API_OFF, (name, callback) => {
  if (!isArray(name))
    name = name ? [name] : [];
  name.forEach((n) => eventBus.off(n, callback));
}, OffProtocol);
const $emit = defineSyncApi(API_EMIT, (name, ...args) => {
  eventBus.emit(name, ...args);
}, EmitProtocol);
let cid;
let cidErrMsg;
let enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e2) {
  }
  return message;
}
function invokePushCallback(args) {
  if (args.type === "enabled") {
    enabled = true;
  } else if (args.type === "clientId") {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === "pushMsg") {
    const message = {
      type: "receive",
      data: normalizePushMessage(args.message)
    };
    for (let i = 0; i < onPushMessageCallbacks.length; i++) {
      const callback = onPushMessageCallbacks[i];
      callback(message);
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === "click") {
    onPushMessageCallbacks.forEach((callback) => {
      callback({
        type: "click",
        data: normalizePushMessage(args.message)
      });
    });
  }
}
const getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid2, errMsg) {
  getPushCidCallbacks.forEach((callback) => {
    callback(cid2, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
const API_GET_PUSH_CLIENT_ID = "getPushClientId";
const getPushClientId = defineAsyncApi(API_GET_PUSH_CLIENT_ID, (_, { resolve: resolve2, reject }) => {
  Promise.resolve().then(() => {
    if (typeof enabled === "undefined") {
      enabled = false;
      cid = "";
      cidErrMsg = "uniPush is not enabled";
    }
    getPushCidCallbacks.push((cid2, errMsg) => {
      if (cid2) {
        resolve2({ cid: cid2 });
      } else {
        reject(errMsg);
      }
    });
    if (typeof cid !== "undefined") {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
});
const onPushMessageCallbacks = [];
const onPushMessage = (fn) => {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
const offPushMessage = (fn) => {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    const index2 = onPushMessageCallbacks.indexOf(fn);
    if (index2 > -1) {
      onPushMessageCallbacks.splice(index2, 1);
    }
  }
};
const SYNC_API_RE = /^\$|__f__|getLocale|setLocale|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|rpx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getDeviceInfo|getAppBaseInfo|getWindowInfo|getSystemSetting|getAppAuthorizeSetting/;
const CONTEXT_API_RE = /^create|Manager$/;
const CONTEXT_API_RE_EXC = ["createBLEConnection"];
const TASK_APIS = ["request", "downloadFile", "uploadFile", "connectSocket"];
const ASYNC_API = ["createBLEConnection"];
const CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== "onPush";
}
function isTaskApi(name) {
  return TASK_APIS.indexOf(name) !== -1;
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(onfinally) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(onfinally && onfinally()).then(() => value), (reason) => promise.resolve(onfinally && onfinally()).then(() => {
      throw reason;
    }));
  };
}
function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  if (!isFunction(api)) {
    return api;
  }
  return function promiseApi(options = {}, ...rest) {
    if (isFunction(options.success) || isFunction(options.fail) || isFunction(options.complete)) {
      return wrapperReturnValue(name, invokeApi(name, api, options, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, api, extend({}, options, {
        success: resolve2,
        fail: reject
      }), rest);
    })));
  };
}
const CALLBACKS = ["success", "fail", "cancel", "complete"];
function initWrapper(protocols2) {
  function processCallback(methodName, method, returnValue) {
    return function(res) {
      return method(processReturnValue(methodName, res, returnValue));
    };
  }
  function processArgs(methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false) {
    if (isPlainObject(fromArgs)) {
      const toArgs = keepFromArgs === true ? fromArgs : {};
      if (isFunction(argsOption)) {
        argsOption = argsOption(fromArgs, toArgs) || {};
      }
      for (const key in fromArgs) {
        if (hasOwn(argsOption, key)) {
          let keyOption = argsOption[key];
          if (isFunction(keyOption)) {
            keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
          }
          if (!keyOption) {
            console.warn(`微信小程序 ${methodName} 暂不支持 ${key}`);
          } else if (isString(keyOption)) {
            toArgs[keyOption] = fromArgs[key];
          } else if (isPlainObject(keyOption)) {
            toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
          }
        } else if (CALLBACKS.indexOf(key) !== -1) {
          const callback = fromArgs[key];
          if (isFunction(callback)) {
            toArgs[key] = processCallback(methodName, callback, returnValue);
          }
        } else {
          if (!keepFromArgs && !hasOwn(toArgs, key)) {
            toArgs[key] = fromArgs[key];
          }
        }
      }
      return toArgs;
    } else if (isFunction(fromArgs)) {
      if (isFunction(argsOption)) {
        argsOption(fromArgs, {});
      }
      fromArgs = processCallback(methodName, fromArgs, returnValue);
    }
    return fromArgs;
  }
  function processReturnValue(methodName, res, returnValue, keepReturnValue = false) {
    if (isFunction(protocols2.returnValue)) {
      res = protocols2.returnValue(methodName, res);
    }
    const realKeepReturnValue = keepReturnValue || false;
    return processArgs(methodName, res, returnValue, {}, realKeepReturnValue);
  }
  return function wrapper(methodName, method) {
    const hasProtocol = hasOwn(protocols2, methodName);
    const needWrapper = hasProtocol || isFunction(protocols2.returnValue) || isContextApi(methodName) || isTaskApi(methodName);
    const hasMethod = hasProtocol || isFunction(method);
    if (!hasProtocol && !method) {
      return function() {
        console.error(`微信小程序 暂不支持${methodName}`);
      };
    }
    if (!needWrapper || !hasMethod) {
      return method;
    }
    const protocol = protocols2[methodName];
    return function(arg1, arg2) {
      let options = protocol || {};
      if (isFunction(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      const args = [arg1];
      if (typeof arg2 !== "undefined") {
        args.push(arg2);
      }
      const returnValue = wx[options.name || methodName].apply(wx, args);
      if (isContextApi(methodName) || isTaskApi(methodName)) {
        if (returnValue && !returnValue.__v_skip) {
          returnValue.__v_skip = true;
        }
      }
      if (isSyncApi(methodName)) {
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  };
}
const getLocale = () => {
  const app = isFunction(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm) {
    return app.$vm.$locale;
  }
  return normalizeLocale(wx.getAppBaseInfo().language) || LOCALE_EN;
};
const setLocale = (locale) => {
  const app = isFunction(getApp) && getApp();
  if (!app) {
    return false;
  }
  const oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach((fn) => fn({ locale }));
    return true;
  }
  return false;
};
const onLocaleChangeCallbacks = [];
const onLocaleChange = (fn) => {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
};
if (typeof global !== "undefined") {
  global.getLocale = getLocale;
}
const UUID_KEY = "__DC_STAT_UUID";
let deviceId;
function useDeviceId(global2 = wx) {
  return function addDeviceId(_, toRes) {
    deviceId = deviceId || global2.getStorageSync(UUID_KEY);
    if (!deviceId) {
      deviceId = Date.now() + "" + Math.floor(Math.random() * 1e7);
      wx.setStorage({
        key: UUID_KEY,
        data: deviceId
      });
    }
    toRes.deviceId = deviceId;
  };
}
function addSafeAreaInsets(fromRes, toRes) {
  if (fromRes.safeArea) {
    const safeArea = fromRes.safeArea;
    toRes.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: fromRes.windowWidth - safeArea.right,
      bottom: fromRes.screenHeight - safeArea.bottom
    };
  }
}
function getOSInfo(system, platform) {
  let osName = "";
  let osVersion = "";
  if (platform && false) {
    osName = platform;
    osVersion = system;
  } else {
    osName = system.split(" ")[0] || "";
    osVersion = system.split(" ")[1] || "";
  }
  return {
    osName: osName.toLocaleLowerCase(),
    osVersion
  };
}
function populateParameters(fromRes, toRes) {
  const { brand = "", model = "", system = "", language = "", theme, version: version2, platform, fontSizeSetting, SDKVersion, pixelRatio, deviceOrientation } = fromRes;
  const { osName, osVersion } = getOSInfo(system, platform);
  let hostVersion = version2;
  let deviceType = getGetDeviceType(fromRes, model);
  let deviceBrand = getDeviceBrand(brand);
  let _hostName = getHostName(fromRes);
  let _deviceOrientation = deviceOrientation;
  let _devicePixelRatio = pixelRatio;
  let _SDKVersion = SDKVersion;
  const hostLanguage = (language || "").replace(/_/g, "-");
  const parameters = {
    appId: "__UNI__B3AD110",
    appName: "drink-app",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "4.45",
    uniCompilerVersion: "4.45",
    uniRuntimeVersion: "4.45",
    uniPlatform: "mp-weixin",
    deviceBrand,
    deviceModel: model,
    deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName,
    osVersion,
    hostTheme: theme,
    hostVersion,
    hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    // TODO
    osLanguage: void 0,
    osTheme: void 0,
    ua: void 0,
    hostPackageName: void 0,
    browserName: void 0,
    browserVersion: void 0,
    isUniAppX: false
  };
  extend(toRes, parameters);
}
function getGetDeviceType(fromRes, model) {
  let deviceType = fromRes.deviceType || "phone";
  {
    const deviceTypeMaps = {
      ipad: "pad",
      windows: "pc",
      mac: "pc"
    };
    const deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    const _model = model.toLocaleLowerCase();
    for (let index2 = 0; index2 < deviceTypeMapsKeys.length; index2++) {
      const _m = deviceTypeMapsKeys[index2];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  let deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = deviceBrand.toLocaleLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale ? getLocale() : defaultLanguage;
}
function getHostName(fromRes) {
  const _platform = "WeChat";
  let _hostName = fromRes.hostName || _platform;
  {
    if (fromRes.environment) {
      _hostName = fromRes.environment;
    } else if (fromRes.host && fromRes.host.env) {
      _hostName = fromRes.host.env;
    }
  }
  return _hostName;
}
const getSystemInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    useDeviceId()(fromRes, toRes);
    populateParameters(fromRes, toRes);
  }
};
const getSystemInfoSync = getSystemInfo;
const redirectTo = {};
const previewImage = {
  args(fromArgs, toArgs) {
    let currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    const urls = fromArgs.urls;
    if (!isArray(urls)) {
      return;
    }
    const len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      toArgs.current = urls[currentIndex];
      toArgs.urls = urls.filter((item, index2) => index2 < currentIndex ? item !== urls[currentIndex] : true);
    } else {
      toArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
const showActionSheet = {
  args(fromArgs, toArgs) {
    toArgs.alertText = fromArgs.title;
  }
};
const getDeviceInfo = {
  returnValue: (fromRes, toRes) => {
    const { brand, model, system = "", platform = "" } = fromRes;
    let deviceType = getGetDeviceType(fromRes, model);
    let deviceBrand = getDeviceBrand(brand);
    useDeviceId()(fromRes, toRes);
    const { osName, osVersion } = getOSInfo(system, platform);
    toRes = sortObject(extend(toRes, {
      deviceType,
      deviceBrand,
      deviceModel: model,
      osName,
      osVersion
    }));
  }
};
const getAppBaseInfo = {
  returnValue: (fromRes, toRes) => {
    const { version: version2, language, SDKVersion, theme } = fromRes;
    let _hostName = getHostName(fromRes);
    let hostLanguage = (language || "").replace(/_/g, "-");
    const parameters = {
      hostVersion: version2,
      hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      appId: "__UNI__B3AD110",
      appName: "drink-app",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      isUniAppX: false,
      uniPlatform: "mp-weixin",
      uniCompileVersion: "4.45",
      uniCompilerVersion: "4.45",
      uniRuntimeVersion: "4.45"
    };
    extend(toRes, parameters);
  }
};
const getWindowInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    toRes = sortObject(extend(toRes, {
      windowTop: 0,
      windowBottom: 0
    }));
  }
};
const getAppAuthorizeSetting = {
  returnValue: function(fromRes, toRes) {
    const { locationReducedAccuracy } = fromRes;
    toRes.locationAccuracy = "unsupported";
    if (locationReducedAccuracy === true) {
      toRes.locationAccuracy = "reduced";
    } else if (locationReducedAccuracy === false) {
      toRes.locationAccuracy = "full";
    }
  }
};
const onError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        wx.$onErrorHandlers = [];
      }
      wx.$onErrorHandlers.push(fromArgs);
    } else {
      injectHook(ON_ERROR, fromArgs, app.$vm.$);
    }
  }
};
const offError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        return;
      }
      const index2 = wx.$onErrorHandlers.findIndex((fn) => fn === fromArgs);
      if (index2 !== -1) {
        wx.$onErrorHandlers.splice(index2, 1);
      }
    } else if (fromArgs.__weh) {
      const onErrors = app.$vm.$[ON_ERROR];
      if (onErrors) {
        const index2 = onErrors.indexOf(fromArgs.__weh);
        if (index2 > -1) {
          onErrors.splice(index2, 1);
        }
      }
    }
  }
};
const onSocketOpen = {
  args() {
    if (wx.__uni_console__) {
      if (wx.__uni_console_warned__) {
        return;
      }
      wx.__uni_console_warned__ = true;
      console.warn(`开发模式下小程序日志回显会使用 socket 连接，为了避免冲突，建议使用 SocketTask 的方式去管理 WebSocket 或手动关闭日志回显功能。[详情](https://uniapp.dcloud.net.cn/tutorial/run/mp-log.html)`);
    }
  }
};
const onSocketMessage = onSocketOpen;
const baseApis = {
  $on,
  $off,
  $once,
  $emit,
  upx2px,
  rpx2px: upx2px,
  interceptors,
  addInterceptor,
  removeInterceptor,
  onCreateVueApp,
  invokeCreateVueAppHook,
  getLocale,
  setLocale,
  onLocaleChange,
  getPushClientId,
  onPushMessage,
  offPushMessage,
  invokePushCallback,
  __f__
};
function initUni(api, protocols2, platform = wx) {
  const wrapper = initWrapper(protocols2);
  const UniProxyHandlers = {
    get(target, key) {
      if (hasOwn(target, key)) {
        return target[key];
      }
      if (hasOwn(api, key)) {
        return promisify(key, api[key]);
      }
      if (hasOwn(baseApis, key)) {
        return promisify(key, baseApis[key]);
      }
      return promisify(key, wrapper(key, platform[key]));
    }
  };
  return new Proxy({}, UniProxyHandlers);
}
function initGetProvider(providers) {
  return function getProvider2({ service, success, fail, complete }) {
    let res;
    if (providers[service]) {
      res = {
        errMsg: "getProvider:ok",
        service,
        provider: providers[service]
      };
      isFunction(success) && success(res);
    } else {
      res = {
        errMsg: "getProvider:fail:服务[" + service + "]不存在"
      };
      isFunction(fail) && fail(res);
    }
    isFunction(complete) && complete(res);
  };
}
const objectKeys = [
  "qy",
  "env",
  "error",
  "version",
  "lanDebug",
  "cloud",
  "serviceMarket",
  "router",
  "worklet",
  "__webpack_require_UNI_MP_PLUGIN__"
];
const singlePageDisableKey = ["lanDebug", "router", "worklet"];
const launchOption = wx.getLaunchOptionsSync ? wx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof wx[key] === "function";
}
function initWx() {
  const newWx = {};
  for (const key in wx) {
    if (isWxKey(key)) {
      newWx[key] = wx[key];
    }
  }
  if (typeof globalThis !== "undefined" && typeof requireMiniProgram === "undefined") {
    globalThis.wx = newWx;
  }
  return newWx;
}
const mocks$1 = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
const getProvider = initGetProvider({
  oauth: ["weixin"],
  share: ["weixin"],
  payment: ["wxpay"],
  push: ["weixin"]
});
function initComponentMocks(component) {
  const res = /* @__PURE__ */ Object.create(null);
  mocks$1.forEach((name) => {
    res[name] = component[name];
  });
  return res;
}
function createSelectorQuery() {
  const query = wx$2.createSelectorQuery();
  const oldIn = query.in;
  query.in = function newIn(component) {
    return oldIn.call(this, initComponentMocks(component));
  };
  return query;
}
const wx$2 = initWx();
let baseInfo = wx$2.getAppBaseInfo && wx$2.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx$2.getSystemInfoSync();
}
const host = baseInfo ? baseInfo.host : null;
const shareVideoMessage = host && host.env === "SAAASDK" ? wx$2.miniapp.shareVideoMessage : wx$2.shareVideoMessage;
var shims = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  createSelectorQuery,
  getProvider,
  shareVideoMessage
});
const compressImage = {
  args(fromArgs, toArgs) {
    if (fromArgs.compressedHeight && !toArgs.compressHeight) {
      toArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !toArgs.compressWidth) {
      toArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  compressImage,
  getAppAuthorizeSetting,
  getAppBaseInfo,
  getDeviceInfo,
  getSystemInfo,
  getSystemInfoSync,
  getWindowInfo,
  offError,
  onError,
  onSocketMessage,
  onSocketOpen,
  previewImage,
  redirectTo,
  showActionSheet
});
const wx$1 = initWx();
var index = initUni(shims, protocols, wx$1);
const CONSOLE_TYPES = ["log", "warn", "error", "info", "debug"];
let sendConsole = null;
const messageQueue = [];
function sendConsoleMessages(messages) {
  if (sendConsole == null) {
    messageQueue.push(...messages);
    return;
  }
  sendConsole(JSON.stringify({
    type: "console",
    data: messages
  }));
}
function setSendConsole(value) {
  sendConsole = value;
  if (value != null && messageQueue.length > 0) {
    const messages = messageQueue.slice();
    messageQueue.length = 0;
    sendConsoleMessages(messages);
  }
}
const originalConsole = /* @__PURE__ */ CONSOLE_TYPES.reduce((methods, type) => {
  methods[type] = console[type].bind(console);
  return methods;
}, {});
const atFileRegex = /^at\s+[\w/./-]+:\d+$/;
function rewriteConsole() {
  function wrapConsole(type) {
    return function(...args) {
      const originalArgs = [...args];
      if (originalArgs.length) {
        const maybeAtFile = originalArgs[originalArgs.length - 1];
        if (typeof maybeAtFile === "string" && atFileRegex.test(maybeAtFile)) {
          originalArgs.pop();
        }
      }
      {
        originalConsole[type](...originalArgs);
      }
      sendConsoleMessages([formatMessage(type, args)]);
    };
  }
  if (isConsoleWritable()) {
    CONSOLE_TYPES.forEach((type) => {
      console[type] = wrapConsole(type);
    });
    return function restoreConsole() {
      CONSOLE_TYPES.forEach((type) => {
        console[type] = originalConsole[type];
      });
    };
  } else {
    const oldLog = index.__f__;
    if (oldLog) {
      index.__f__ = function(...args) {
        const [type, filename, ...rest] = args;
        oldLog(type, "", ...rest);
        sendConsoleMessages([formatMessage(type, [...rest, filename])]);
      };
      return function restoreConsole() {
        index.__f__ = oldLog;
      };
    }
  }
  return function restoreConsole() {
  };
}
function isConsoleWritable() {
  const value = console.log;
  const sym = Symbol();
  try {
    console.log = sym;
  } catch (ex) {
    return false;
  }
  const isWritable = console.log === sym;
  console.log = value;
  return isWritable;
}
function formatMessage(type, args) {
  try {
    return {
      type,
      args: formatArgs(args)
    };
  } catch (e2) {
    originalConsole.error(e2);
  }
  return {
    type,
    args: []
  };
}
function formatArgs(args) {
  return args.map((arg) => formatArg(arg));
}
function formatArg(arg, depth = 0) {
  if (depth >= 7) {
    return {
      type: "object",
      value: "[Maximum depth reached]"
    };
  }
  return ARG_FORMATTERS[typeof arg](arg, depth);
}
function formatObject(value, depth) {
  if (value === null) {
    return {
      type: "null"
    };
  }
  if (isComponentPublicInstance(value)) {
    return formatComponentPublicInstance(value, depth);
  }
  if (isComponentInternalInstance(value)) {
    return formatComponentInternalInstance(value, depth);
  }
  if (isUniElement(value)) {
    return formatUniElement(value, depth);
  }
  if (isCSSStyleDeclaration(value)) {
    return formatCSSStyleDeclaration(value, depth);
  }
  if (Array.isArray(value)) {
    return {
      type: "object",
      subType: "array",
      value: {
        properties: value.map((v, i) => formatArrayElement(v, i, depth + 1))
      }
    };
  }
  if (value instanceof Set) {
    return {
      type: "object",
      subType: "set",
      className: "Set",
      description: `Set(${value.size})`,
      value: {
        entries: Array.from(value).map((v) => formatSetEntry(v, depth + 1))
      }
    };
  }
  if (value instanceof Map) {
    return {
      type: "object",
      subType: "map",
      className: "Map",
      description: `Map(${value.size})`,
      value: {
        entries: Array.from(value.entries()).map((v) => formatMapEntry(v, depth + 1))
      }
    };
  }
  if (value instanceof Promise) {
    return {
      type: "object",
      subType: "promise",
      value: {
        properties: []
      }
    };
  }
  if (value instanceof RegExp) {
    return {
      type: "object",
      subType: "regexp",
      value: String(value),
      className: "Regexp"
    };
  }
  if (value instanceof Date) {
    return {
      type: "object",
      subType: "date",
      value: String(value),
      className: "Date"
    };
  }
  if (value instanceof Error) {
    return {
      type: "object",
      subType: "error",
      value: value.message || String(value),
      className: value.name || "Error"
    };
  }
  return {
    type: "object",
    value: {
      properties: Object.entries(value).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isComponentPublicInstance(value) {
  return value.$ && isComponentInternalInstance(value.$);
}
function isComponentInternalInstance(value) {
  return value.type && value.uid != null && value.appContext;
}
function formatComponentPublicInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentPublicInstance",
    value: {
      properties: Object.entries(value.$.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function formatComponentInternalInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentInternalInstance",
    value: {
      properties: Object.entries(value.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isUniElement(value) {
  return value.style && value.tagName != null && value.nodeName != null;
}
function formatUniElement(value, depth) {
  return {
    type: "object",
    // 非 x 没有 UniElement 的概念
    // className: 'UniElement',
    value: {
      properties: Object.entries(value).filter(([name]) => [
        "id",
        "tagName",
        "nodeName",
        "dataset",
        "offsetTop",
        "offsetLeft",
        "style"
      ].includes(name)).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isCSSStyleDeclaration(value) {
  return typeof value.getPropertyValue === "function" && typeof value.setProperty === "function" && value.$styles;
}
function formatCSSStyleDeclaration(style, depth) {
  return {
    type: "object",
    value: {
      properties: Object.entries(style.$styles).map(([name, value]) => formatObjectProperty(name, value, depth + 1))
    }
  };
}
function formatObjectProperty(name, value, depth) {
  return Object.assign(formatArg(value, depth), {
    name
  });
}
function formatArrayElement(value, index2, depth) {
  return Object.assign(formatArg(value, depth), {
    name: `${index2}`
  });
}
function formatSetEntry(value, depth) {
  return {
    value: formatArg(value, depth)
  };
}
function formatMapEntry(value, depth) {
  return {
    key: formatArg(value[0], depth),
    value: formatArg(value[1], depth)
  };
}
const ARG_FORMATTERS = {
  function(value) {
    return {
      type: "function",
      value: `function ${value.name}() {}`
    };
  },
  undefined() {
    return {
      type: "undefined"
    };
  },
  object(value, depth) {
    return formatObject(value, depth);
  },
  boolean(value) {
    return {
      type: "boolean",
      value: String(value)
    };
  },
  number(value) {
    return {
      type: "number",
      value: String(value)
    };
  },
  bigint(value) {
    return {
      type: "bigint",
      value: String(value)
    };
  },
  string(value) {
    return {
      type: "string",
      value
    };
  },
  symbol(value) {
    return {
      type: "symbol",
      value: value.description
    };
  }
};
function initRuntimeSocket(hosts, port, id) {
  if (!hosts || !port || !id)
    return Promise.resolve(null);
  return hosts.split(",").reduce((promise, host2) => {
    return promise.then((socket) => {
      if (socket)
        return socket;
      return tryConnectSocket(host2, port, id);
    });
  }, Promise.resolve(null));
}
const SOCKET_TIMEOUT = 500;
function tryConnectSocket(host2, port, id) {
  return new Promise((resolve2, reject) => {
    const socket = index.connectSocket({
      url: `ws://${host2}:${port}/${id}`,
      // 支付宝小程序 是否开启多实例
      multiple: true,
      fail() {
        resolve2(null);
      }
    });
    const timer = setTimeout(() => {
      socket.close({
        code: 1006,
        reason: "connect timeout"
      });
      resolve2(null);
    }, SOCKET_TIMEOUT);
    socket.onOpen((e2) => {
      clearTimeout(timer);
      resolve2(socket);
    });
    socket.onClose((e2) => {
      clearTimeout(timer);
      resolve2(null);
    });
    socket.onError((e2) => {
      clearTimeout(timer);
      resolve2(null);
    });
  });
}
let sendError = null;
const errorQueue = /* @__PURE__ */ new Set();
function sendErrorMessages(errors) {
  if (sendError == null) {
    errors.forEach((error) => {
      errorQueue.add(error);
    });
    return;
  }
  sendError(JSON.stringify({
    type: "error",
    data: errors.map((err) => {
      const isPromiseRejection = err && "promise" in err && "reason" in err;
      const prefix = isPromiseRejection ? "UnhandledPromiseRejection: " : "";
      if (isPromiseRejection) {
        err = err.reason;
      }
      if (err instanceof Error && err.stack) {
        return prefix + err.stack;
      }
      if (typeof err === "object" && err !== null) {
        try {
          return prefix + JSON.stringify(err);
        } catch (err2) {
          return prefix + String(err2);
        }
      }
      return prefix + String(err);
    })
  }));
}
function setSendError(value) {
  sendError = value;
  if (value != null && errorQueue.size > 0) {
    const errors = Array.from(errorQueue);
    errorQueue.clear();
    sendErrorMessages(errors);
  }
}
function initOnError() {
  function onError2(error) {
    try {
      if (typeof PromiseRejectionEvent !== "undefined" && error instanceof PromiseRejectionEvent && error.reason instanceof Error && error.reason.message && error.reason.message.includes(`Cannot create property 'errMsg' on string 'taskId`)) {
        return;
      }
      if (true) {
        originalConsole.error(error);
      }
      sendErrorMessages([error]);
    } catch (err) {
      originalConsole.error(err);
    }
  }
  if (typeof index.onError === "function") {
    index.onError(onError2);
  }
  if (typeof index.onUnhandledRejection === "function") {
    index.onUnhandledRejection(onError2);
  }
  return function offError2() {
    if (typeof index.offError === "function") {
      index.offError(onError2);
    }
    if (typeof index.offUnhandledRejection === "function") {
      index.offUnhandledRejection(onError2);
    }
  };
}
function initRuntimeSocketService() {
  const hosts = "127.0.0.1,192.168.2.51";
  const port = "8090";
  const id = "mp-weixin_FGbW3q";
  const lazy = typeof swan !== "undefined";
  let restoreError = lazy ? () => {
  } : initOnError();
  let restoreConsole = lazy ? () => {
  } : rewriteConsole();
  return Promise.resolve().then(() => {
    if (lazy) {
      restoreError = initOnError();
      restoreConsole = rewriteConsole();
    }
    return initRuntimeSocket(hosts, port, id).then((socket) => {
      if (!socket) {
        restoreError();
        restoreConsole();
        originalConsole.error(wrapError("开发模式下日志通道建立 socket 连接失败。"));
        originalConsole.error(wrapError("如果是小程序平台，请勾选不校验合法域名配置。"));
        originalConsole.error(wrapError("如果是运行到真机，请确认手机与电脑处于同一网络。"));
        return false;
      }
      initMiniProgramGlobalFlag();
      socket.onClose(() => {
        originalConsole.error(wrapError("开发模式下日志通道 socket 连接关闭，请在 HBuilderX 中重新运行。"));
        restoreError();
        restoreConsole();
      });
      setSendConsole((data) => {
        socket.send({
          data
        });
      });
      setSendError((data) => {
        socket.send({
          data
        });
      });
      return true;
    });
  });
}
const ERROR_CHAR = "‌";
function wrapError(error) {
  return `${ERROR_CHAR}${error}${ERROR_CHAR}`;
}
function initMiniProgramGlobalFlag() {
  if (typeof wx$1 !== "undefined") {
    wx$1.__uni_console__ = true;
  } else if (typeof my !== "undefined") {
    my.__uni_console__ = true;
  } else if (typeof tt !== "undefined") {
    tt.__uni_console__ = true;
  } else if (typeof swan !== "undefined") {
    swan.__uni_console__ = true;
  } else if (typeof qq !== "undefined") {
    qq.__uni_console__ = true;
  } else if (typeof ks !== "undefined") {
    ks.__uni_console__ = true;
  } else if (typeof jd !== "undefined") {
    jd.__uni_console__ = true;
  } else if (typeof xhs !== "undefined") {
    xhs.__uni_console__ = true;
  } else if (typeof has !== "undefined") {
    has.__uni_console__ = true;
  } else if (typeof qa !== "undefined") {
    qa.__uni_console__ = true;
  }
}
initRuntimeSocketService();
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
function initVueIds(vueIds, mpInstance) {
  if (!vueIds) {
    return;
  }
  const ids = vueIds.split(",");
  const len = ids.length;
  if (len === 1) {
    mpInstance._$vueId = ids[0];
  } else if (len === 2) {
    mpInstance._$vueId = ids[0];
    mpInstance._$vuePid = ids[1];
  }
}
const EXTRAS = ["externalClasses"];
function initExtraOptions(miniProgramComponentOptions, vueOptions) {
  EXTRAS.forEach((name) => {
    if (hasOwn(vueOptions, name)) {
      miniProgramComponentOptions[name] = vueOptions[name];
    }
  });
}
const WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach((name) => {
      const matches = name.match(WORKLET_RE);
      if (matches) {
        const workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
function initWxsCallMethods(methods, wxsCallMethods) {
  if (!isArray(wxsCallMethods)) {
    return;
  }
  wxsCallMethods.forEach((callMethod) => {
    methods[callMethod] = function(args) {
      return this.$vm[callMethod](args);
    };
  });
}
function selectAllComponents(mpInstance, selector, $refs) {
  const components = mpInstance.selectAllComponents(selector);
  components.forEach((component) => {
    const ref2 = component.properties.uR;
    $refs[ref2] = component.$vm || component;
  });
}
function initRefs(instance, mpInstance) {
  Object.defineProperty(instance, "refs", {
    get() {
      const $refs = {};
      selectAllComponents(mpInstance, ".r", $refs);
      const forComponents = mpInstance.selectAllComponents(".r-i-f");
      forComponents.forEach((component) => {
        const ref2 = component.properties.uR;
        if (!ref2) {
          return;
        }
        if (!$refs[ref2]) {
          $refs[ref2] = [];
        }
        $refs[ref2].push(component.$vm || component);
      });
      return $refs;
    }
  });
}
function findVmByVueId(instance, vuePid) {
  const $children = instance.$children;
  for (let i = $children.length - 1; i >= 0; i--) {
    const childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  let parentVm;
  for (let i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
const MP_METHODS = [
  "createSelectorQuery",
  "createIntersectionObserver",
  "selectAllComponents",
  "selectComponent"
];
function createEmitFn(oldEmit, ctx) {
  return function emit2(event, ...args) {
    const scope = ctx.$scope;
    if (scope && event) {
      const detail = { __args__: args };
      {
        scope.triggerEvent(event, detail);
      }
    }
    return oldEmit.apply(this, [event, ...args]);
  };
}
function initBaseInstance(instance, options) {
  const ctx = instance.ctx;
  ctx.mpType = options.mpType;
  ctx.$mpType = options.mpType;
  ctx.$mpPlatform = "mp-weixin";
  ctx.$scope = options.mpInstance;
  {
    Object.defineProperties(ctx, {
      // only id
      [VIRTUAL_HOST_ID]: {
        get() {
          const id = this.$scope.data[VIRTUAL_HOST_ID];
          return id === void 0 ? "" : id;
        }
      }
    });
  }
  ctx.$mp = {};
  {
    ctx._self = {};
  }
  instance.slots = {};
  if (isArray(options.slots) && options.slots.length) {
    options.slots.forEach((name) => {
      instance.slots[name] = true;
    });
    if (instance.slots[SLOT_DEFAULT_NAME]) {
      instance.slots.default = true;
    }
  }
  ctx.getOpenerEventChannel = function() {
    {
      return options.mpInstance.getOpenerEventChannel();
    }
  };
  ctx.$hasHook = hasHook;
  ctx.$callHook = callHook;
  instance.emit = createEmitFn(instance.emit, ctx);
}
function initComponentInstance(instance, options) {
  initBaseInstance(instance, options);
  const ctx = instance.ctx;
  MP_METHODS.forEach((method) => {
    ctx[method] = function(...args) {
      const mpInstance = ctx.$scope;
      if (mpInstance && mpInstance[method]) {
        return mpInstance[method].apply(mpInstance, args);
      }
    };
  });
}
function initMocks(instance, mpInstance, mocks2) {
  const ctx = instance.ctx;
  mocks2.forEach((mock) => {
    if (hasOwn(mpInstance, mock)) {
      instance[mock] = ctx[mock] = mpInstance[mock];
    }
  });
}
function hasHook(name) {
  const hooks = this.$[name];
  if (hooks && hooks.length) {
    return true;
  }
  return false;
}
function callHook(name, args) {
  if (name === "mounted") {
    callHook.call(this, "bm");
    this.$.isMounted = true;
    name = "m";
  }
  const hooks = this.$[name];
  return hooks && invokeArrayFns(hooks, args);
}
const PAGE_INIT_HOOKS = [
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_ADD_TO_FAVORITES
  // 'onReady', // lifetimes.ready
  // 'onPageScroll', // 影响性能，开发者手动注册
  // 'onShareTimeline', // 右上角菜单，开发者手动注册
  // 'onShareAppMessage' // 右上角菜单，开发者手动注册
];
function findHooks(vueOptions, hooks = /* @__PURE__ */ new Set()) {
  if (vueOptions) {
    Object.keys(vueOptions).forEach((name) => {
      if (isUniLifecycleHook(name, vueOptions[name])) {
        hooks.add(name);
      }
    });
    {
      const { extends: extendsOptions, mixins } = vueOptions;
      if (mixins) {
        mixins.forEach((mixin) => findHooks(mixin, hooks));
      }
      if (extendsOptions) {
        findHooks(extendsOptions, hooks);
      }
    }
  }
  return hooks;
}
function initHook(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function(args) {
      return this.$vm && this.$vm.$callHook(hook, args);
    };
  }
}
const EXCLUDE_HOOKS = [ON_READY];
function initHooks(mpOptions, hooks, excludes = EXCLUDE_HOOKS) {
  hooks.forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initUnknownHooks(mpOptions, vueOptions, excludes = EXCLUDE_HOOKS) {
  findHooks(vueOptions).forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initRuntimeHooks(mpOptions, runtimeHooks) {
  if (!runtimeHooks) {
    return;
  }
  const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
  hooks.forEach((hook) => {
    if (runtimeHooks & MINI_PROGRAM_PAGE_RUNTIME_HOOKS[hook]) {
      initHook(mpOptions, hook, []);
    }
  });
}
const findMixinRuntimeHooks = /* @__PURE__ */ once(() => {
  const runtimeHooks = [];
  const app = isFunction(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm && app.$vm.$) {
    const mixins = app.$vm.$.appContext.mixins;
    if (isArray(mixins)) {
      const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
      mixins.forEach((mixin) => {
        hooks.forEach((hook) => {
          if (hasOwn(mixin, hook) && !runtimeHooks.includes(hook)) {
            runtimeHooks.push(hook);
          }
        });
      });
    }
  }
  return runtimeHooks;
});
function initMixinRuntimeHooks(mpOptions) {
  initHooks(mpOptions, findMixinRuntimeHooks());
}
const HOOKS = [
  ON_SHOW,
  ON_HIDE,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION
];
function parseApp(instance, parseAppOptions) {
  const internalInstance = instance.$;
  const appOptions = {
    globalData: instance.$options && instance.$options.globalData || {},
    $vm: instance,
    // mp-alipay 组件 data 初始化比 onLaunch 早，提前挂载
    onLaunch(options) {
      this.$vm = instance;
      const ctx = internalInstance.ctx;
      if (this.$vm && ctx.$scope && ctx.$callHook) {
        return;
      }
      initBaseInstance(internalInstance, {
        mpType: "app",
        mpInstance: this,
        slots: []
      });
      ctx.globalData = this.globalData;
      instance.$callHook(ON_LAUNCH, options);
    }
  };
  const onErrorHandlers = wx.$onErrorHandlers;
  if (onErrorHandlers) {
    onErrorHandlers.forEach((fn) => {
      injectHook(ON_ERROR, fn, internalInstance);
    });
    onErrorHandlers.length = 0;
  }
  initLocale(instance);
  const vueOptions = instance.$.type;
  initHooks(appOptions, HOOKS);
  initUnknownHooks(appOptions, vueOptions);
  {
    const methods = vueOptions.methods;
    methods && extend(appOptions, methods);
  }
  return appOptions;
}
function initCreateApp(parseAppOptions) {
  return function createApp2(vm) {
    return App(parseApp(vm));
  };
}
function initCreateSubpackageApp(parseAppOptions) {
  return function createApp2(vm) {
    const appOptions = parseApp(vm);
    const app = isFunction(getApp) && getApp({
      allowDefault: true
    });
    if (!app)
      return;
    vm.$.ctx.$scope = app;
    const globalData = app.globalData;
    if (globalData) {
      Object.keys(appOptions.globalData).forEach((name) => {
        if (!hasOwn(globalData, name)) {
          globalData[name] = appOptions.globalData[name];
        }
      });
    }
    Object.keys(appOptions).forEach((name) => {
      if (!hasOwn(app, name)) {
        app[name] = appOptions[name];
      }
    });
    initAppLifecycle(appOptions, vm);
  };
}
function initAppLifecycle(appOptions, vm) {
  if (isFunction(appOptions.onLaunch)) {
    const args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    appOptions.onLaunch(args);
  }
  if (isFunction(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow((args) => {
      vm.$callHook("onShow", args);
    });
  }
  if (isFunction(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide((args) => {
      vm.$callHook("onHide", args);
    });
  }
}
function initLocale(appVm) {
  const locale = ref(
    normalizeLocale(wx.getAppBaseInfo().language) || LOCALE_EN
  );
  Object.defineProperty(appVm, "$locale", {
    get() {
      return locale.value;
    },
    set(v) {
      locale.value = v;
    }
  });
}
const builtInProps = [
  // 百度小程序,快手小程序自定义组件不支持绑定动态事件，动态dataset，故通过props传递事件信息
  // event-opts
  "eO",
  // 组件 ref
  "uR",
  // 组件 ref-in-for
  "uRIF",
  // 组件 id
  "uI",
  // 组件类型 m: 小程序组件
  "uT",
  // 组件 props
  "uP",
  // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
  "uS"
];
function initDefaultProps(options, isBehavior = false) {
  const properties = {};
  if (!isBehavior) {
    let observerSlots = function(newVal) {
      const $slots = /* @__PURE__ */ Object.create(null);
      newVal && newVal.forEach((slotName) => {
        $slots[slotName] = true;
      });
      this.setData({
        $slots
      });
    };
    builtInProps.forEach((name) => {
      properties[name] = {
        type: null,
        value: ""
      };
    });
    properties.uS = {
      type: null,
      value: []
    };
    {
      properties.uS.observer = observerSlots;
    }
  }
  if (options.behaviors) {
    if (options.behaviors.includes("wx://form-field")) {
      if (!options.properties || !options.properties.name) {
        properties.name = {
          type: null,
          value: ""
        };
      }
      if (!options.properties || !options.properties.value) {
        properties.value = {
          type: null,
          value: ""
        };
      }
    }
  }
  return properties;
}
function initVirtualHostProps(options) {
  const properties = {};
  {
    if (options && options.virtualHost) {
      properties[VIRTUAL_HOST_STYLE] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_CLASS] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_HIDDEN] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_ID] = {
        type: null,
        value: ""
      };
    }
  }
  return properties;
}
function initProps(mpComponentOptions) {
  if (!mpComponentOptions.properties) {
    mpComponentOptions.properties = {};
  }
  extend(mpComponentOptions.properties, initDefaultProps(mpComponentOptions), initVirtualHostProps(mpComponentOptions.options));
}
const PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function parsePropType(type, defaultValue) {
  if (isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function normalizePropType(type, defaultValue) {
  const res = parsePropType(type);
  return PROP_TYPES.indexOf(res) !== -1 ? res : null;
}
function initPageProps({ properties }, rawProps) {
  if (isArray(rawProps)) {
    rawProps.forEach((key) => {
      properties[key] = {
        type: String,
        value: ""
      };
    });
  } else if (isPlainObject(rawProps)) {
    Object.keys(rawProps).forEach((key) => {
      const opts = rawProps[key];
      if (isPlainObject(opts)) {
        let value = opts.default;
        if (isFunction(value)) {
          value = value();
        }
        const type = opts.type;
        opts.type = normalizePropType(type);
        properties[key] = {
          type: opts.type,
          value
        };
      } else {
        properties[key] = {
          type: normalizePropType(opts)
        };
      }
    });
  }
}
function findPropsData(properties, isPage2) {
  return (isPage2 ? findPagePropsData(properties) : findComponentPropsData(resolvePropValue(properties.uP))) || {};
}
function findPagePropsData(properties) {
  const propsData = {};
  if (isPlainObject(properties)) {
    Object.keys(properties).forEach((name) => {
      if (builtInProps.indexOf(name) === -1) {
        propsData[name] = resolvePropValue(properties[name]);
      }
    });
  }
  return propsData;
}
function initFormField(vm) {
  const vueOptions = vm.$options;
  if (isArray(vueOptions.behaviors) && vueOptions.behaviors.includes("uni://form-field")) {
    vm.$watch("modelValue", () => {
      vm.$scope && vm.$scope.setData({
        name: vm.name,
        value: vm.modelValue
      });
    }, {
      immediate: true
    });
  }
}
function resolvePropValue(prop) {
  return prop;
}
function initData(_) {
  return {};
}
function initPropsObserver(componentOptions) {
  const observe = function observe2() {
    const up = this.properties.uP;
    if (!up) {
      return;
    }
    if (this.$vm) {
      updateComponentProps(resolvePropValue(up), this.$vm.$);
    } else if (resolvePropValue(this.properties.uT) === "m") {
      updateMiniProgramComponentProperties(resolvePropValue(up), this);
    }
  };
  {
    if (!componentOptions.observers) {
      componentOptions.observers = {};
    }
    componentOptions.observers.uP = observe;
  }
}
function updateMiniProgramComponentProperties(up, mpInstance) {
  const prevProps = mpInstance.properties;
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps, false)) {
    mpInstance.setData(nextProps);
  }
}
function updateComponentProps(up, instance) {
  const prevProps = toRaw(instance.props);
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps)) {
    updateProps(instance, nextProps, prevProps, false);
    if (hasQueueJob(instance.update)) {
      invalidateJob(instance.update);
    }
    {
      instance.update();
    }
  }
}
function hasPropsChanged(prevProps, nextProps, checkLen = true) {
  const nextKeys = Object.keys(nextProps);
  if (checkLen && nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
function initBehaviors(vueOptions) {
  const vueBehaviors = vueOptions.behaviors;
  let vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  const behaviors = [];
  if (isArray(vueBehaviors)) {
    vueBehaviors.forEach((behavior) => {
      behaviors.push(behavior.replace("uni://", "wx://"));
      if (behavior === "uni://form-field") {
        if (isArray(vueProps)) {
          vueProps.push("name");
          vueProps.push("modelValue");
        } else {
          vueProps.name = {
            type: String,
            default: ""
          };
          vueProps.modelValue = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ""
          };
        }
      }
    });
  }
  return behaviors;
}
function applyOptions(componentOptions, vueOptions) {
  componentOptions.data = initData();
  componentOptions.behaviors = initBehaviors(vueOptions);
}
function parseComponent(vueOptions, { parse: parse2, mocks: mocks2, isPage: isPage2, isPageInProject, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 }) {
  vueOptions = vueOptions.default || vueOptions;
  const options = {
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true,
    pureDataPattern: /^uP$/
  };
  if (isArray(vueOptions.mixins)) {
    vueOptions.mixins.forEach((item) => {
      if (isObject(item.options)) {
        extend(options, item.options);
      }
    });
  }
  if (vueOptions.options) {
    extend(options, vueOptions.options);
  }
  const mpComponentOptions = {
    options,
    lifetimes: initLifetimes2({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }),
    pageLifetimes: {
      show() {
        this.$vm && this.$vm.$callHook("onPageShow");
      },
      hide() {
        this.$vm && this.$vm.$callHook("onPageHide");
      },
      resize(size2) {
        this.$vm && this.$vm.$callHook("onPageResize", size2);
      }
    },
    methods: {
      __l: handleLink2
    }
  };
  {
    applyOptions(mpComponentOptions, vueOptions);
  }
  initProps(mpComponentOptions);
  initPropsObserver(mpComponentOptions);
  initExtraOptions(mpComponentOptions, vueOptions);
  initWxsCallMethods(mpComponentOptions.methods, vueOptions.wxsCallMethods);
  {
    initWorkletMethods(mpComponentOptions.methods, vueOptions.methods);
  }
  if (parse2) {
    parse2(mpComponentOptions, { handleLink: handleLink2 });
  }
  return mpComponentOptions;
}
function initCreateComponent(parseOptions2) {
  return function createComponent2(vueComponentOptions) {
    return Component(parseComponent(vueComponentOptions, parseOptions2));
  };
}
let $createComponentFn;
let $destroyComponentFn;
function getAppVm() {
  return getApp().$vm;
}
function $createComponent(initialVNode, options) {
  if (!$createComponentFn) {
    $createComponentFn = getAppVm().$createComponent;
  }
  const proxy = $createComponentFn(initialVNode, options);
  return getExposeProxy(proxy.$) || proxy;
}
function $destroyComponent(instance) {
  if (!$destroyComponentFn) {
    $destroyComponentFn = getAppVm().$destroyComponent;
  }
  return $destroyComponentFn(instance);
}
function parsePage(vueOptions, parseOptions2) {
  const { parse: parse2, mocks: mocks2, isPage: isPage2, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 } = parseOptions2;
  const miniProgramPageOptions = parseComponent(vueOptions, {
    mocks: mocks2,
    isPage: isPage2,
    isPageInProject: true,
    initRelation: initRelation2,
    handleLink: handleLink2,
    initLifetimes: initLifetimes2
  });
  initPageProps(miniProgramPageOptions, (vueOptions.default || vueOptions).props);
  const methods = miniProgramPageOptions.methods;
  methods.onLoad = function(query) {
    {
      this.options = query;
    }
    this.$page = {
      fullPath: addLeadingSlash(this.route + stringifyQuery(query))
    };
    return this.$vm && this.$vm.$callHook(ON_LOAD, query);
  };
  initHooks(methods, PAGE_INIT_HOOKS);
  {
    initUnknownHooks(methods, vueOptions);
  }
  initRuntimeHooks(methods, vueOptions.__runtimeHooks);
  initMixinRuntimeHooks(methods);
  parse2 && parse2(miniProgramPageOptions, { handleLink: handleLink2 });
  return miniProgramPageOptions;
}
function initCreatePage(parseOptions2) {
  return function createPage2(vuePageOptions) {
    return Component(parsePage(vuePageOptions, parseOptions2));
  };
}
function initCreatePluginApp(parseAppOptions) {
  return function createApp2(vm) {
    initAppLifecycle(parseApp(vm), vm);
  };
}
const MPPage = Page;
const MPComponent = Component;
function initTriggerEvent(mpInstance) {
  const oldTriggerEvent = mpInstance.triggerEvent;
  const newTriggerEvent = function(event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [
      customizeEvent(event),
      ...args
    ]);
  };
  try {
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initMiniProgramHook(name, options, isComponent) {
  const oldHook = options[name];
  if (!oldHook) {
    options[name] = function() {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function(...args) {
      initTriggerEvent(this);
      return oldHook.apply(this, args);
    };
  }
}
Page = function(options) {
  initMiniProgramHook(ON_LOAD, options);
  return MPPage(options);
};
Component = function(options) {
  initMiniProgramHook("created", options);
  const isVueComponent = options.properties && options.properties.uP;
  if (!isVueComponent) {
    initProps(options);
    initPropsObserver(options);
  }
  return MPComponent(options);
};
function initLifetimes({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }) {
  return {
    attached() {
      let properties = this.properties;
      initVueIds(properties.uI, this);
      const relationOptions = {
        vuePid: this._$vuePid
      };
      initRelation2(this, relationOptions);
      const mpInstance = this;
      const isMiniProgramPage = isPage2(mpInstance);
      let propsData = properties;
      this.$vm = $createComponent({
        type: vueOptions,
        props: findPropsData(propsData, isMiniProgramPage)
      }, {
        mpType: isMiniProgramPage ? "page" : "component",
        mpInstance,
        slots: properties.uS || {},
        // vueSlots
        parentComponent: relationOptions.parent && relationOptions.parent.$,
        onBeforeSetup(instance, options) {
          initRefs(instance, mpInstance);
          initMocks(instance, mpInstance, mocks2);
          initComponentInstance(instance, options);
        }
      });
      if (!isMiniProgramPage) {
        initFormField(this.$vm);
      }
    },
    ready() {
      if (this.$vm) {
        {
          this.$vm.$callHook("mounted");
          this.$vm.$callHook(ON_READY);
        }
      }
    },
    detached() {
      if (this.$vm) {
        pruneComponentPropsCache(this.$vm.$.uid);
        $destroyComponent(this.$vm);
      }
    }
  };
}
const mocks = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
function isPage(mpInstance) {
  return !!mpInstance.route;
}
function initRelation(mpInstance, detail) {
  mpInstance.triggerEvent("__l", detail);
}
function handleLink(event) {
  const detail = event.detail || event.value;
  const vuePid = detail.vuePid;
  let parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  detail.parent = parentVm;
}
var parseOptions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  handleLink,
  initLifetimes,
  initRelation,
  isPage,
  mocks
});
const createApp = initCreateApp();
const createPage = initCreatePage(parseOptions);
const createComponent = initCreateComponent(parseOptions);
const createPluginApp = initCreatePluginApp();
const createSubpackageApp = initCreateSubpackageApp();
{
  wx.createApp = global.createApp = createApp;
  wx.createPage = createPage;
  wx.createComponent = createComponent;
  wx.createPluginApp = global.createPluginApp = createPluginApp;
  wx.createSubpackageApp = global.createSubpackageApp = createSubpackageApp;
}
/*!
 * html2canvas 1.4.1 <https://html2canvas.hertzen.com>
 * Copyright (c) 2022 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p2 in b2)
      if (Object.prototype.hasOwnProperty.call(b2, p2))
        d2[p2] = b2[p2];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t2) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p2 in s)
        if (Object.prototype.hasOwnProperty.call(s, p2))
          t2[p2] = s[p2];
    }
    return t2;
  };
  return __assign.apply(this, arguments);
};
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e2) {
        reject(e2);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t2[0] & 1)
      throw t2[1];
    return t2[1];
  }, trys: [], ops: [] }, f2, y, t2, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f2)
      throw new TypeError("Generator is already executing.");
    while (_)
      try {
        if (f2 = 1, y && (t2 = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t2 = y["return"]) && t2.call(y), 0) : y.next) && !(t2 = t2.call(y, op[1])).done)
          return t2;
        if (y = 0, t2)
          op = [op[0] & 2, t2.value];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t2 = _.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t2[1]) {
              _.label = t2[1];
              t2 = op;
              break;
            }
            if (t2 && _.label < t2[2]) {
              _.label = t2[2];
              _.ops.push(op);
              break;
            }
            if (t2[2])
              _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e2) {
        op = [6, e2];
        y = 0;
      } finally {
        f2 = t2 = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __spreadArray(to, from, pack2) {
  if (pack2 || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || from);
}
var Bounds = (
  /** @class */
  function() {
    function Bounds2(left, top, width, height) {
      this.left = left;
      this.top = top;
      this.width = width;
      this.height = height;
    }
    Bounds2.prototype.add = function(x, y, w, h) {
      return new Bounds2(this.left + x, this.top + y, this.width + w, this.height + h);
    };
    Bounds2.fromClientRect = function(context, clientRect) {
      return new Bounds2(clientRect.left + context.windowBounds.left, clientRect.top + context.windowBounds.top, clientRect.width, clientRect.height);
    };
    Bounds2.fromDOMRectList = function(context, domRectList) {
      var domRect = Array.from(domRectList).find(function(rect) {
        return rect.width !== 0;
      });
      return domRect ? new Bounds2(domRect.left + context.windowBounds.left, domRect.top + context.windowBounds.top, domRect.width, domRect.height) : Bounds2.EMPTY;
    };
    Bounds2.EMPTY = new Bounds2(0, 0, 0, 0);
    return Bounds2;
  }()
);
var parseBounds = function(context, node) {
  return Bounds.fromClientRect(context, node.getBoundingClientRect());
};
var parseDocumentSize = function(document2) {
  var body = document2.body;
  var documentElement = document2.documentElement;
  if (!body || !documentElement) {
    throw new Error("Unable to get document size");
  }
  var width = Math.max(Math.max(body.scrollWidth, documentElement.scrollWidth), Math.max(body.offsetWidth, documentElement.offsetWidth), Math.max(body.clientWidth, documentElement.clientWidth));
  var height = Math.max(Math.max(body.scrollHeight, documentElement.scrollHeight), Math.max(body.offsetHeight, documentElement.offsetHeight), Math.max(body.clientHeight, documentElement.clientHeight));
  return new Bounds(0, 0, width, height);
};
var toCodePoints$1 = function(str) {
  var codePoints = [];
  var i = 0;
  var length = str.length;
  while (i < length) {
    var value = str.charCodeAt(i++);
    if (value >= 55296 && value <= 56319 && i < length) {
      var extra = str.charCodeAt(i++);
      if ((extra & 64512) === 56320) {
        codePoints.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        codePoints.push(value);
        i--;
      }
    } else {
      codePoints.push(value);
    }
  }
  return codePoints;
};
var fromCodePoint$1 = function() {
  var codePoints = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    codePoints[_i] = arguments[_i];
  }
  if (String.fromCodePoint) {
    return String.fromCodePoint.apply(String, codePoints);
  }
  var length = codePoints.length;
  if (!length) {
    return "";
  }
  var codeUnits = [];
  var index2 = -1;
  var result = "";
  while (++index2 < length) {
    var codePoint = codePoints[index2];
    if (codePoint <= 65535) {
      codeUnits.push(codePoint);
    } else {
      codePoint -= 65536;
      codeUnits.push((codePoint >> 10) + 55296, codePoint % 1024 + 56320);
    }
    if (index2 + 1 === length || codeUnits.length > 16384) {
      result += String.fromCharCode.apply(String, codeUnits);
      codeUnits.length = 0;
    }
  }
  return result;
};
var chars$2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup$2 = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (var i$2 = 0; i$2 < chars$2.length; i$2++) {
  lookup$2[chars$2.charCodeAt(i$2)] = i$2;
}
var chars$1$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup$1$1 = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (var i$1$1 = 0; i$1$1 < chars$1$1.length; i$1$1++) {
  lookup$1$1[chars$1$1.charCodeAt(i$1$1)] = i$1$1;
}
var decode$1 = function(base642) {
  var bufferLength = base642.length * 0.75, len = base642.length, i, p2 = 0, encoded1, encoded2, encoded3, encoded4;
  if (base642[base642.length - 1] === "=") {
    bufferLength--;
    if (base642[base642.length - 2] === "=") {
      bufferLength--;
    }
  }
  var buffer2 = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined" && typeof Uint8Array.prototype.slice !== "undefined" ? new ArrayBuffer(bufferLength) : new Array(bufferLength);
  var bytes = Array.isArray(buffer2) ? buffer2 : new Uint8Array(buffer2);
  for (i = 0; i < len; i += 4) {
    encoded1 = lookup$1$1[base642.charCodeAt(i)];
    encoded2 = lookup$1$1[base642.charCodeAt(i + 1)];
    encoded3 = lookup$1$1[base642.charCodeAt(i + 2)];
    encoded4 = lookup$1$1[base642.charCodeAt(i + 3)];
    bytes[p2++] = encoded1 << 2 | encoded2 >> 4;
    bytes[p2++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[p2++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }
  return buffer2;
};
var polyUint16Array$1 = function(buffer2) {
  var length = buffer2.length;
  var bytes = [];
  for (var i = 0; i < length; i += 2) {
    bytes.push(buffer2[i + 1] << 8 | buffer2[i]);
  }
  return bytes;
};
var polyUint32Array$1 = function(buffer2) {
  var length = buffer2.length;
  var bytes = [];
  for (var i = 0; i < length; i += 4) {
    bytes.push(buffer2[i + 3] << 24 | buffer2[i + 2] << 16 | buffer2[i + 1] << 8 | buffer2[i]);
  }
  return bytes;
};
var UTRIE2_SHIFT_2$1 = 5;
var UTRIE2_SHIFT_1$1 = 6 + 5;
var UTRIE2_INDEX_SHIFT$1 = 2;
var UTRIE2_SHIFT_1_2$1 = UTRIE2_SHIFT_1$1 - UTRIE2_SHIFT_2$1;
var UTRIE2_LSCP_INDEX_2_OFFSET$1 = 65536 >> UTRIE2_SHIFT_2$1;
var UTRIE2_DATA_BLOCK_LENGTH$1 = 1 << UTRIE2_SHIFT_2$1;
var UTRIE2_DATA_MASK$1 = UTRIE2_DATA_BLOCK_LENGTH$1 - 1;
var UTRIE2_LSCP_INDEX_2_LENGTH$1 = 1024 >> UTRIE2_SHIFT_2$1;
var UTRIE2_INDEX_2_BMP_LENGTH$1 = UTRIE2_LSCP_INDEX_2_OFFSET$1 + UTRIE2_LSCP_INDEX_2_LENGTH$1;
var UTRIE2_UTF8_2B_INDEX_2_OFFSET$1 = UTRIE2_INDEX_2_BMP_LENGTH$1;
var UTRIE2_UTF8_2B_INDEX_2_LENGTH$1 = 2048 >> 6;
var UTRIE2_INDEX_1_OFFSET$1 = UTRIE2_UTF8_2B_INDEX_2_OFFSET$1 + UTRIE2_UTF8_2B_INDEX_2_LENGTH$1;
var UTRIE2_OMITTED_BMP_INDEX_1_LENGTH$1 = 65536 >> UTRIE2_SHIFT_1$1;
var UTRIE2_INDEX_2_BLOCK_LENGTH$1 = 1 << UTRIE2_SHIFT_1_2$1;
var UTRIE2_INDEX_2_MASK$1 = UTRIE2_INDEX_2_BLOCK_LENGTH$1 - 1;
var slice16$1 = function(view, start, end) {
  if (view.slice) {
    return view.slice(start, end);
  }
  return new Uint16Array(Array.prototype.slice.call(view, start, end));
};
var slice32$1 = function(view, start, end) {
  if (view.slice) {
    return view.slice(start, end);
  }
  return new Uint32Array(Array.prototype.slice.call(view, start, end));
};
var createTrieFromBase64$1 = function(base642, _byteLength) {
  var buffer2 = decode$1(base642);
  var view32 = Array.isArray(buffer2) ? polyUint32Array$1(buffer2) : new Uint32Array(buffer2);
  var view16 = Array.isArray(buffer2) ? polyUint16Array$1(buffer2) : new Uint16Array(buffer2);
  var headerLength = 24;
  var index2 = slice16$1(view16, headerLength / 2, view32[4] / 2);
  var data = view32[5] === 2 ? slice16$1(view16, (headerLength + view32[4]) / 2) : slice32$1(view32, Math.ceil((headerLength + view32[4]) / 4));
  return new Trie$1(view32[0], view32[1], view32[2], view32[3], index2, data);
};
var Trie$1 = (
  /** @class */
  function() {
    function Trie2(initialValue, errorValue, highStart, highValueIndex, index2, data) {
      this.initialValue = initialValue;
      this.errorValue = errorValue;
      this.highStart = highStart;
      this.highValueIndex = highValueIndex;
      this.index = index2;
      this.data = data;
    }
    Trie2.prototype.get = function(codePoint) {
      var ix;
      if (codePoint >= 0) {
        if (codePoint < 55296 || codePoint > 56319 && codePoint <= 65535) {
          ix = this.index[codePoint >> UTRIE2_SHIFT_2$1];
          ix = (ix << UTRIE2_INDEX_SHIFT$1) + (codePoint & UTRIE2_DATA_MASK$1);
          return this.data[ix];
        }
        if (codePoint <= 65535) {
          ix = this.index[UTRIE2_LSCP_INDEX_2_OFFSET$1 + (codePoint - 55296 >> UTRIE2_SHIFT_2$1)];
          ix = (ix << UTRIE2_INDEX_SHIFT$1) + (codePoint & UTRIE2_DATA_MASK$1);
          return this.data[ix];
        }
        if (codePoint < this.highStart) {
          ix = UTRIE2_INDEX_1_OFFSET$1 - UTRIE2_OMITTED_BMP_INDEX_1_LENGTH$1 + (codePoint >> UTRIE2_SHIFT_1$1);
          ix = this.index[ix];
          ix += codePoint >> UTRIE2_SHIFT_2$1 & UTRIE2_INDEX_2_MASK$1;
          ix = this.index[ix];
          ix = (ix << UTRIE2_INDEX_SHIFT$1) + (codePoint & UTRIE2_DATA_MASK$1);
          return this.data[ix];
        }
        if (codePoint <= 1114111) {
          return this.data[this.highValueIndex];
        }
      }
      return this.errorValue;
    };
    return Trie2;
  }()
);
var chars$3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup$3 = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (var i$3 = 0; i$3 < chars$3.length; i$3++) {
  lookup$3[chars$3.charCodeAt(i$3)] = i$3;
}
var base64$1 = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==";
var LETTER_NUMBER_MODIFIER = 50;
var BK = 1;
var CR$1 = 2;
var LF$1 = 3;
var CM = 4;
var NL = 5;
var WJ = 7;
var ZW = 8;
var GL = 9;
var SP = 10;
var ZWJ$1 = 11;
var B2 = 12;
var BA = 13;
var BB = 14;
var HY = 15;
var CB = 16;
var CL = 17;
var CP = 18;
var EX = 19;
var IN = 20;
var NS = 21;
var OP = 22;
var QU = 23;
var IS = 24;
var NU = 25;
var PO = 26;
var PR = 27;
var SY = 28;
var AI = 29;
var AL = 30;
var CJ = 31;
var EB = 32;
var EM = 33;
var H2 = 34;
var H3 = 35;
var HL = 36;
var ID = 37;
var JL = 38;
var JV = 39;
var JT = 40;
var RI$1 = 41;
var SA = 42;
var XX = 43;
var ea_OP = [9001, 65288];
var BREAK_MANDATORY = "!";
var BREAK_NOT_ALLOWED$1 = "×";
var BREAK_ALLOWED$1 = "÷";
var UnicodeTrie$1 = createTrieFromBase64$1(base64$1);
var ALPHABETICS = [AL, HL];
var HARD_LINE_BREAKS = [BK, CR$1, LF$1, NL];
var SPACE$1 = [SP, ZW];
var PREFIX_POSTFIX = [PR, PO];
var LINE_BREAKS = HARD_LINE_BREAKS.concat(SPACE$1);
var KOREAN_SYLLABLE_BLOCK = [JL, JV, JT, H2, H3];
var HYPHEN = [HY, BA];
var codePointsToCharacterClasses = function(codePoints, lineBreak2) {
  if (lineBreak2 === void 0) {
    lineBreak2 = "strict";
  }
  var types = [];
  var indices = [];
  var categories = [];
  codePoints.forEach(function(codePoint, index2) {
    var classType = UnicodeTrie$1.get(codePoint);
    if (classType > LETTER_NUMBER_MODIFIER) {
      categories.push(true);
      classType -= LETTER_NUMBER_MODIFIER;
    } else {
      categories.push(false);
    }
    if (["normal", "auto", "loose"].indexOf(lineBreak2) !== -1) {
      if ([8208, 8211, 12316, 12448].indexOf(codePoint) !== -1) {
        indices.push(index2);
        return types.push(CB);
      }
    }
    if (classType === CM || classType === ZWJ$1) {
      if (index2 === 0) {
        indices.push(index2);
        return types.push(AL);
      }
      var prev = types[index2 - 1];
      if (LINE_BREAKS.indexOf(prev) === -1) {
        indices.push(indices[index2 - 1]);
        return types.push(prev);
      }
      indices.push(index2);
      return types.push(AL);
    }
    indices.push(index2);
    if (classType === CJ) {
      return types.push(lineBreak2 === "strict" ? NS : ID);
    }
    if (classType === SA) {
      return types.push(AL);
    }
    if (classType === AI) {
      return types.push(AL);
    }
    if (classType === XX) {
      if (codePoint >= 131072 && codePoint <= 196605 || codePoint >= 196608 && codePoint <= 262141) {
        return types.push(ID);
      } else {
        return types.push(AL);
      }
    }
    types.push(classType);
  });
  return [indices, types, categories];
};
var isAdjacentWithSpaceIgnored = function(a2, b, currentIndex, classTypes) {
  var current = classTypes[currentIndex];
  if (Array.isArray(a2) ? a2.indexOf(current) !== -1 : a2 === current) {
    var i = currentIndex;
    while (i <= classTypes.length) {
      i++;
      var next = classTypes[i];
      if (next === b) {
        return true;
      }
      if (next !== SP) {
        break;
      }
    }
  }
  if (current === SP) {
    var i = currentIndex;
    while (i > 0) {
      i--;
      var prev = classTypes[i];
      if (Array.isArray(a2) ? a2.indexOf(prev) !== -1 : a2 === prev) {
        var n = currentIndex;
        while (n <= classTypes.length) {
          n++;
          var next = classTypes[n];
          if (next === b) {
            return true;
          }
          if (next !== SP) {
            break;
          }
        }
      }
      if (prev !== SP) {
        break;
      }
    }
  }
  return false;
};
var previousNonSpaceClassType = function(currentIndex, classTypes) {
  var i = currentIndex;
  while (i >= 0) {
    var type = classTypes[i];
    if (type === SP) {
      i--;
    } else {
      return type;
    }
  }
  return 0;
};
var _lineBreakAtIndex = function(codePoints, classTypes, indicies, index2, forbiddenBreaks) {
  if (indicies[index2] === 0) {
    return BREAK_NOT_ALLOWED$1;
  }
  var currentIndex = index2 - 1;
  if (Array.isArray(forbiddenBreaks) && forbiddenBreaks[currentIndex] === true) {
    return BREAK_NOT_ALLOWED$1;
  }
  var beforeIndex = currentIndex - 1;
  var afterIndex = currentIndex + 1;
  var current = classTypes[currentIndex];
  var before = beforeIndex >= 0 ? classTypes[beforeIndex] : 0;
  var next = classTypes[afterIndex];
  if (current === CR$1 && next === LF$1) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (HARD_LINE_BREAKS.indexOf(current) !== -1) {
    return BREAK_MANDATORY;
  }
  if (HARD_LINE_BREAKS.indexOf(next) !== -1) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (SPACE$1.indexOf(next) !== -1) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (previousNonSpaceClassType(currentIndex, classTypes) === ZW) {
    return BREAK_ALLOWED$1;
  }
  if (UnicodeTrie$1.get(codePoints[currentIndex]) === ZWJ$1) {
    return BREAK_NOT_ALLOWED$1;
  }
  if ((current === EB || current === EM) && UnicodeTrie$1.get(codePoints[afterIndex]) === ZWJ$1) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (current === WJ || next === WJ) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (current === GL) {
    return BREAK_NOT_ALLOWED$1;
  }
  if ([SP, BA, HY].indexOf(current) === -1 && next === GL) {
    return BREAK_NOT_ALLOWED$1;
  }
  if ([CL, CP, EX, IS, SY].indexOf(next) !== -1) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (previousNonSpaceClassType(currentIndex, classTypes) === OP) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (isAdjacentWithSpaceIgnored(QU, OP, currentIndex, classTypes)) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (isAdjacentWithSpaceIgnored([CL, CP], NS, currentIndex, classTypes)) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (isAdjacentWithSpaceIgnored(B2, B2, currentIndex, classTypes)) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (current === SP) {
    return BREAK_ALLOWED$1;
  }
  if (current === QU || next === QU) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (next === CB || current === CB) {
    return BREAK_ALLOWED$1;
  }
  if ([BA, HY, NS].indexOf(next) !== -1 || current === BB) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (before === HL && HYPHEN.indexOf(current) !== -1) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (current === SY && next === HL) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (next === IN) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (ALPHABETICS.indexOf(next) !== -1 && current === NU || ALPHABETICS.indexOf(current) !== -1 && next === NU) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (current === PR && [ID, EB, EM].indexOf(next) !== -1 || [ID, EB, EM].indexOf(current) !== -1 && next === PO) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (ALPHABETICS.indexOf(current) !== -1 && PREFIX_POSTFIX.indexOf(next) !== -1 || PREFIX_POSTFIX.indexOf(current) !== -1 && ALPHABETICS.indexOf(next) !== -1) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (
    // (PR | PO) × ( OP | HY )? NU
    [PR, PO].indexOf(current) !== -1 && (next === NU || [OP, HY].indexOf(next) !== -1 && classTypes[afterIndex + 1] === NU) || // ( OP | HY ) × NU
    [OP, HY].indexOf(current) !== -1 && next === NU || // NU ×	(NU | SY | IS)
    current === NU && [NU, SY, IS].indexOf(next) !== -1
  ) {
    return BREAK_NOT_ALLOWED$1;
  }
  if ([NU, SY, IS, CL, CP].indexOf(next) !== -1) {
    var prevIndex = currentIndex;
    while (prevIndex >= 0) {
      var type = classTypes[prevIndex];
      if (type === NU) {
        return BREAK_NOT_ALLOWED$1;
      } else if ([SY, IS].indexOf(type) !== -1) {
        prevIndex--;
      } else {
        break;
      }
    }
  }
  if ([PR, PO].indexOf(next) !== -1) {
    var prevIndex = [CL, CP].indexOf(current) !== -1 ? beforeIndex : currentIndex;
    while (prevIndex >= 0) {
      var type = classTypes[prevIndex];
      if (type === NU) {
        return BREAK_NOT_ALLOWED$1;
      } else if ([SY, IS].indexOf(type) !== -1) {
        prevIndex--;
      } else {
        break;
      }
    }
  }
  if (JL === current && [JL, JV, H2, H3].indexOf(next) !== -1 || [JV, H2].indexOf(current) !== -1 && [JV, JT].indexOf(next) !== -1 || [JT, H3].indexOf(current) !== -1 && next === JT) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (KOREAN_SYLLABLE_BLOCK.indexOf(current) !== -1 && [IN, PO].indexOf(next) !== -1 || KOREAN_SYLLABLE_BLOCK.indexOf(next) !== -1 && current === PR) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (ALPHABETICS.indexOf(current) !== -1 && ALPHABETICS.indexOf(next) !== -1) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (current === IS && ALPHABETICS.indexOf(next) !== -1) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (ALPHABETICS.concat(NU).indexOf(current) !== -1 && next === OP && ea_OP.indexOf(codePoints[afterIndex]) === -1 || ALPHABETICS.concat(NU).indexOf(next) !== -1 && current === CP) {
    return BREAK_NOT_ALLOWED$1;
  }
  if (current === RI$1 && next === RI$1) {
    var i = indicies[currentIndex];
    var count = 1;
    while (i > 0) {
      i--;
      if (classTypes[i] === RI$1) {
        count++;
      } else {
        break;
      }
    }
    if (count % 2 !== 0) {
      return BREAK_NOT_ALLOWED$1;
    }
  }
  if (current === EB && next === EM) {
    return BREAK_NOT_ALLOWED$1;
  }
  return BREAK_ALLOWED$1;
};
var cssFormattedClasses = function(codePoints, options) {
  if (!options) {
    options = { lineBreak: "normal", wordBreak: "normal" };
  }
  var _a = codePointsToCharacterClasses(codePoints, options.lineBreak), indicies = _a[0], classTypes = _a[1], isLetterNumber = _a[2];
  if (options.wordBreak === "break-all" || options.wordBreak === "break-word") {
    classTypes = classTypes.map(function(type) {
      return [NU, AL, SA].indexOf(type) !== -1 ? ID : type;
    });
  }
  var forbiddenBreakpoints = options.wordBreak === "keep-all" ? isLetterNumber.map(function(letterNumber, i) {
    return letterNumber && codePoints[i] >= 19968 && codePoints[i] <= 40959;
  }) : void 0;
  return [indicies, classTypes, forbiddenBreakpoints];
};
var Break = (
  /** @class */
  function() {
    function Break2(codePoints, lineBreak2, start, end) {
      this.codePoints = codePoints;
      this.required = lineBreak2 === BREAK_MANDATORY;
      this.start = start;
      this.end = end;
    }
    Break2.prototype.slice = function() {
      return fromCodePoint$1.apply(void 0, this.codePoints.slice(this.start, this.end));
    };
    return Break2;
  }()
);
var LineBreaker = function(str, options) {
  var codePoints = toCodePoints$1(str);
  var _a = cssFormattedClasses(codePoints, options), indicies = _a[0], classTypes = _a[1], forbiddenBreakpoints = _a[2];
  var length = codePoints.length;
  var lastEnd = 0;
  var nextIndex = 0;
  return {
    next: function() {
      if (nextIndex >= length) {
        return { done: true, value: null };
      }
      var lineBreak2 = BREAK_NOT_ALLOWED$1;
      while (nextIndex < length && (lineBreak2 = _lineBreakAtIndex(codePoints, classTypes, indicies, ++nextIndex, forbiddenBreakpoints)) === BREAK_NOT_ALLOWED$1) {
      }
      if (lineBreak2 !== BREAK_NOT_ALLOWED$1 || nextIndex === length) {
        var value = new Break(codePoints, lineBreak2, lastEnd, nextIndex);
        lastEnd = nextIndex;
        return { value, done: false };
      }
      return { done: true, value: null };
    }
  };
};
var FLAG_UNRESTRICTED = 1 << 0;
var FLAG_ID = 1 << 1;
var FLAG_INTEGER = 1 << 2;
var FLAG_NUMBER = 1 << 3;
var LINE_FEED = 10;
var SOLIDUS = 47;
var REVERSE_SOLIDUS = 92;
var CHARACTER_TABULATION = 9;
var SPACE = 32;
var QUOTATION_MARK = 34;
var EQUALS_SIGN = 61;
var NUMBER_SIGN = 35;
var DOLLAR_SIGN = 36;
var PERCENTAGE_SIGN = 37;
var APOSTROPHE = 39;
var LEFT_PARENTHESIS = 40;
var RIGHT_PARENTHESIS = 41;
var LOW_LINE = 95;
var HYPHEN_MINUS = 45;
var EXCLAMATION_MARK = 33;
var LESS_THAN_SIGN = 60;
var GREATER_THAN_SIGN = 62;
var COMMERCIAL_AT = 64;
var LEFT_SQUARE_BRACKET = 91;
var RIGHT_SQUARE_BRACKET = 93;
var CIRCUMFLEX_ACCENT = 61;
var LEFT_CURLY_BRACKET = 123;
var QUESTION_MARK = 63;
var RIGHT_CURLY_BRACKET = 125;
var VERTICAL_LINE = 124;
var TILDE = 126;
var CONTROL = 128;
var REPLACEMENT_CHARACTER = 65533;
var ASTERISK = 42;
var PLUS_SIGN = 43;
var COMMA = 44;
var COLON = 58;
var SEMICOLON = 59;
var FULL_STOP = 46;
var NULL = 0;
var BACKSPACE = 8;
var LINE_TABULATION = 11;
var SHIFT_OUT = 14;
var INFORMATION_SEPARATOR_ONE = 31;
var DELETE = 127;
var EOF = -1;
var ZERO = 48;
var a = 97;
var e = 101;
var f = 102;
var u = 117;
var z = 122;
var A = 65;
var E = 69;
var F = 70;
var U = 85;
var Z = 90;
var isDigit = function(codePoint) {
  return codePoint >= ZERO && codePoint <= 57;
};
var isSurrogateCodePoint = function(codePoint) {
  return codePoint >= 55296 && codePoint <= 57343;
};
var isHex = function(codePoint) {
  return isDigit(codePoint) || codePoint >= A && codePoint <= F || codePoint >= a && codePoint <= f;
};
var isLowerCaseLetter = function(codePoint) {
  return codePoint >= a && codePoint <= z;
};
var isUpperCaseLetter = function(codePoint) {
  return codePoint >= A && codePoint <= Z;
};
var isLetter = function(codePoint) {
  return isLowerCaseLetter(codePoint) || isUpperCaseLetter(codePoint);
};
var isNonASCIICodePoint = function(codePoint) {
  return codePoint >= CONTROL;
};
var isWhiteSpace = function(codePoint) {
  return codePoint === LINE_FEED || codePoint === CHARACTER_TABULATION || codePoint === SPACE;
};
var isNameStartCodePoint = function(codePoint) {
  return isLetter(codePoint) || isNonASCIICodePoint(codePoint) || codePoint === LOW_LINE;
};
var isNameCodePoint = function(codePoint) {
  return isNameStartCodePoint(codePoint) || isDigit(codePoint) || codePoint === HYPHEN_MINUS;
};
var isNonPrintableCodePoint = function(codePoint) {
  return codePoint >= NULL && codePoint <= BACKSPACE || codePoint === LINE_TABULATION || codePoint >= SHIFT_OUT && codePoint <= INFORMATION_SEPARATOR_ONE || codePoint === DELETE;
};
var isValidEscape = function(c1, c2) {
  if (c1 !== REVERSE_SOLIDUS) {
    return false;
  }
  return c2 !== LINE_FEED;
};
var isIdentifierStart = function(c1, c2, c3) {
  if (c1 === HYPHEN_MINUS) {
    return isNameStartCodePoint(c2) || isValidEscape(c2, c3);
  } else if (isNameStartCodePoint(c1)) {
    return true;
  } else if (c1 === REVERSE_SOLIDUS && isValidEscape(c1, c2)) {
    return true;
  }
  return false;
};
var isNumberStart = function(c1, c2, c3) {
  if (c1 === PLUS_SIGN || c1 === HYPHEN_MINUS) {
    if (isDigit(c2)) {
      return true;
    }
    return c2 === FULL_STOP && isDigit(c3);
  }
  if (c1 === FULL_STOP) {
    return isDigit(c2);
  }
  return isDigit(c1);
};
var stringToNumber = function(codePoints) {
  var c = 0;
  var sign = 1;
  if (codePoints[c] === PLUS_SIGN || codePoints[c] === HYPHEN_MINUS) {
    if (codePoints[c] === HYPHEN_MINUS) {
      sign = -1;
    }
    c++;
  }
  var integers = [];
  while (isDigit(codePoints[c])) {
    integers.push(codePoints[c++]);
  }
  var int = integers.length ? parseInt(fromCodePoint$1.apply(void 0, integers), 10) : 0;
  if (codePoints[c] === FULL_STOP) {
    c++;
  }
  var fraction = [];
  while (isDigit(codePoints[c])) {
    fraction.push(codePoints[c++]);
  }
  var fracd = fraction.length;
  var frac = fracd ? parseInt(fromCodePoint$1.apply(void 0, fraction), 10) : 0;
  if (codePoints[c] === E || codePoints[c] === e) {
    c++;
  }
  var expsign = 1;
  if (codePoints[c] === PLUS_SIGN || codePoints[c] === HYPHEN_MINUS) {
    if (codePoints[c] === HYPHEN_MINUS) {
      expsign = -1;
    }
    c++;
  }
  var exponent = [];
  while (isDigit(codePoints[c])) {
    exponent.push(codePoints[c++]);
  }
  var exp = exponent.length ? parseInt(fromCodePoint$1.apply(void 0, exponent), 10) : 0;
  return sign * (int + frac * Math.pow(10, -fracd)) * Math.pow(10, expsign * exp);
};
var LEFT_PARENTHESIS_TOKEN = {
  type: 2
  /* LEFT_PARENTHESIS_TOKEN */
};
var RIGHT_PARENTHESIS_TOKEN = {
  type: 3
  /* RIGHT_PARENTHESIS_TOKEN */
};
var COMMA_TOKEN = {
  type: 4
  /* COMMA_TOKEN */
};
var SUFFIX_MATCH_TOKEN = {
  type: 13
  /* SUFFIX_MATCH_TOKEN */
};
var PREFIX_MATCH_TOKEN = {
  type: 8
  /* PREFIX_MATCH_TOKEN */
};
var COLUMN_TOKEN = {
  type: 21
  /* COLUMN_TOKEN */
};
var DASH_MATCH_TOKEN = {
  type: 9
  /* DASH_MATCH_TOKEN */
};
var INCLUDE_MATCH_TOKEN = {
  type: 10
  /* INCLUDE_MATCH_TOKEN */
};
var LEFT_CURLY_BRACKET_TOKEN = {
  type: 11
  /* LEFT_CURLY_BRACKET_TOKEN */
};
var RIGHT_CURLY_BRACKET_TOKEN = {
  type: 12
  /* RIGHT_CURLY_BRACKET_TOKEN */
};
var SUBSTRING_MATCH_TOKEN = {
  type: 14
  /* SUBSTRING_MATCH_TOKEN */
};
var BAD_URL_TOKEN = {
  type: 23
  /* BAD_URL_TOKEN */
};
var BAD_STRING_TOKEN = {
  type: 1
  /* BAD_STRING_TOKEN */
};
var CDO_TOKEN = {
  type: 25
  /* CDO_TOKEN */
};
var CDC_TOKEN = {
  type: 24
  /* CDC_TOKEN */
};
var COLON_TOKEN = {
  type: 26
  /* COLON_TOKEN */
};
var SEMICOLON_TOKEN = {
  type: 27
  /* SEMICOLON_TOKEN */
};
var LEFT_SQUARE_BRACKET_TOKEN = {
  type: 28
  /* LEFT_SQUARE_BRACKET_TOKEN */
};
var RIGHT_SQUARE_BRACKET_TOKEN = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
};
var WHITESPACE_TOKEN = {
  type: 31
  /* WHITESPACE_TOKEN */
};
var EOF_TOKEN = {
  type: 32
  /* EOF_TOKEN */
};
var Tokenizer = (
  /** @class */
  function() {
    function Tokenizer2() {
      this._value = [];
    }
    Tokenizer2.prototype.write = function(chunk) {
      this._value = this._value.concat(toCodePoints$1(chunk));
    };
    Tokenizer2.prototype.read = function() {
      var tokens = [];
      var token = this.consumeToken();
      while (token !== EOF_TOKEN) {
        tokens.push(token);
        token = this.consumeToken();
      }
      return tokens;
    };
    Tokenizer2.prototype.consumeToken = function() {
      var codePoint = this.consumeCodePoint();
      switch (codePoint) {
        case QUOTATION_MARK:
          return this.consumeStringToken(QUOTATION_MARK);
        case NUMBER_SIGN:
          var c1 = this.peekCodePoint(0);
          var c2 = this.peekCodePoint(1);
          var c3 = this.peekCodePoint(2);
          if (isNameCodePoint(c1) || isValidEscape(c2, c3)) {
            var flags = isIdentifierStart(c1, c2, c3) ? FLAG_ID : FLAG_UNRESTRICTED;
            var value = this.consumeName();
            return { type: 5, value, flags };
          }
          break;
        case DOLLAR_SIGN:
          if (this.peekCodePoint(0) === EQUALS_SIGN) {
            this.consumeCodePoint();
            return SUFFIX_MATCH_TOKEN;
          }
          break;
        case APOSTROPHE:
          return this.consumeStringToken(APOSTROPHE);
        case LEFT_PARENTHESIS:
          return LEFT_PARENTHESIS_TOKEN;
        case RIGHT_PARENTHESIS:
          return RIGHT_PARENTHESIS_TOKEN;
        case ASTERISK:
          if (this.peekCodePoint(0) === EQUALS_SIGN) {
            this.consumeCodePoint();
            return SUBSTRING_MATCH_TOKEN;
          }
          break;
        case PLUS_SIGN:
          if (isNumberStart(codePoint, this.peekCodePoint(0), this.peekCodePoint(1))) {
            this.reconsumeCodePoint(codePoint);
            return this.consumeNumericToken();
          }
          break;
        case COMMA:
          return COMMA_TOKEN;
        case HYPHEN_MINUS:
          var e1 = codePoint;
          var e2 = this.peekCodePoint(0);
          var e3 = this.peekCodePoint(1);
          if (isNumberStart(e1, e2, e3)) {
            this.reconsumeCodePoint(codePoint);
            return this.consumeNumericToken();
          }
          if (isIdentifierStart(e1, e2, e3)) {
            this.reconsumeCodePoint(codePoint);
            return this.consumeIdentLikeToken();
          }
          if (e2 === HYPHEN_MINUS && e3 === GREATER_THAN_SIGN) {
            this.consumeCodePoint();
            this.consumeCodePoint();
            return CDC_TOKEN;
          }
          break;
        case FULL_STOP:
          if (isNumberStart(codePoint, this.peekCodePoint(0), this.peekCodePoint(1))) {
            this.reconsumeCodePoint(codePoint);
            return this.consumeNumericToken();
          }
          break;
        case SOLIDUS:
          if (this.peekCodePoint(0) === ASTERISK) {
            this.consumeCodePoint();
            while (true) {
              var c = this.consumeCodePoint();
              if (c === ASTERISK) {
                c = this.consumeCodePoint();
                if (c === SOLIDUS) {
                  return this.consumeToken();
                }
              }
              if (c === EOF) {
                return this.consumeToken();
              }
            }
          }
          break;
        case COLON:
          return COLON_TOKEN;
        case SEMICOLON:
          return SEMICOLON_TOKEN;
        case LESS_THAN_SIGN:
          if (this.peekCodePoint(0) === EXCLAMATION_MARK && this.peekCodePoint(1) === HYPHEN_MINUS && this.peekCodePoint(2) === HYPHEN_MINUS) {
            this.consumeCodePoint();
            this.consumeCodePoint();
            return CDO_TOKEN;
          }
          break;
        case COMMERCIAL_AT:
          var a1 = this.peekCodePoint(0);
          var a2 = this.peekCodePoint(1);
          var a3 = this.peekCodePoint(2);
          if (isIdentifierStart(a1, a2, a3)) {
            var value = this.consumeName();
            return { type: 7, value };
          }
          break;
        case LEFT_SQUARE_BRACKET:
          return LEFT_SQUARE_BRACKET_TOKEN;
        case REVERSE_SOLIDUS:
          if (isValidEscape(codePoint, this.peekCodePoint(0))) {
            this.reconsumeCodePoint(codePoint);
            return this.consumeIdentLikeToken();
          }
          break;
        case RIGHT_SQUARE_BRACKET:
          return RIGHT_SQUARE_BRACKET_TOKEN;
        case CIRCUMFLEX_ACCENT:
          if (this.peekCodePoint(0) === EQUALS_SIGN) {
            this.consumeCodePoint();
            return PREFIX_MATCH_TOKEN;
          }
          break;
        case LEFT_CURLY_BRACKET:
          return LEFT_CURLY_BRACKET_TOKEN;
        case RIGHT_CURLY_BRACKET:
          return RIGHT_CURLY_BRACKET_TOKEN;
        case u:
        case U:
          var u1 = this.peekCodePoint(0);
          var u2 = this.peekCodePoint(1);
          if (u1 === PLUS_SIGN && (isHex(u2) || u2 === QUESTION_MARK)) {
            this.consumeCodePoint();
            this.consumeUnicodeRangeToken();
          }
          this.reconsumeCodePoint(codePoint);
          return this.consumeIdentLikeToken();
        case VERTICAL_LINE:
          if (this.peekCodePoint(0) === EQUALS_SIGN) {
            this.consumeCodePoint();
            return DASH_MATCH_TOKEN;
          }
          if (this.peekCodePoint(0) === VERTICAL_LINE) {
            this.consumeCodePoint();
            return COLUMN_TOKEN;
          }
          break;
        case TILDE:
          if (this.peekCodePoint(0) === EQUALS_SIGN) {
            this.consumeCodePoint();
            return INCLUDE_MATCH_TOKEN;
          }
          break;
        case EOF:
          return EOF_TOKEN;
      }
      if (isWhiteSpace(codePoint)) {
        this.consumeWhiteSpace();
        return WHITESPACE_TOKEN;
      }
      if (isDigit(codePoint)) {
        this.reconsumeCodePoint(codePoint);
        return this.consumeNumericToken();
      }
      if (isNameStartCodePoint(codePoint)) {
        this.reconsumeCodePoint(codePoint);
        return this.consumeIdentLikeToken();
      }
      return { type: 6, value: fromCodePoint$1(codePoint) };
    };
    Tokenizer2.prototype.consumeCodePoint = function() {
      var value = this._value.shift();
      return typeof value === "undefined" ? -1 : value;
    };
    Tokenizer2.prototype.reconsumeCodePoint = function(codePoint) {
      this._value.unshift(codePoint);
    };
    Tokenizer2.prototype.peekCodePoint = function(delta) {
      if (delta >= this._value.length) {
        return -1;
      }
      return this._value[delta];
    };
    Tokenizer2.prototype.consumeUnicodeRangeToken = function() {
      var digits = [];
      var codePoint = this.consumeCodePoint();
      while (isHex(codePoint) && digits.length < 6) {
        digits.push(codePoint);
        codePoint = this.consumeCodePoint();
      }
      var questionMarks = false;
      while (codePoint === QUESTION_MARK && digits.length < 6) {
        digits.push(codePoint);
        codePoint = this.consumeCodePoint();
        questionMarks = true;
      }
      if (questionMarks) {
        var start_1 = parseInt(fromCodePoint$1.apply(void 0, digits.map(function(digit) {
          return digit === QUESTION_MARK ? ZERO : digit;
        })), 16);
        var end = parseInt(fromCodePoint$1.apply(void 0, digits.map(function(digit) {
          return digit === QUESTION_MARK ? F : digit;
        })), 16);
        return { type: 30, start: start_1, end };
      }
      var start = parseInt(fromCodePoint$1.apply(void 0, digits), 16);
      if (this.peekCodePoint(0) === HYPHEN_MINUS && isHex(this.peekCodePoint(1))) {
        this.consumeCodePoint();
        codePoint = this.consumeCodePoint();
        var endDigits = [];
        while (isHex(codePoint) && endDigits.length < 6) {
          endDigits.push(codePoint);
          codePoint = this.consumeCodePoint();
        }
        var end = parseInt(fromCodePoint$1.apply(void 0, endDigits), 16);
        return { type: 30, start, end };
      } else {
        return { type: 30, start, end: start };
      }
    };
    Tokenizer2.prototype.consumeIdentLikeToken = function() {
      var value = this.consumeName();
      if (value.toLowerCase() === "url" && this.peekCodePoint(0) === LEFT_PARENTHESIS) {
        this.consumeCodePoint();
        return this.consumeUrlToken();
      } else if (this.peekCodePoint(0) === LEFT_PARENTHESIS) {
        this.consumeCodePoint();
        return { type: 19, value };
      }
      return { type: 20, value };
    };
    Tokenizer2.prototype.consumeUrlToken = function() {
      var value = [];
      this.consumeWhiteSpace();
      if (this.peekCodePoint(0) === EOF) {
        return { type: 22, value: "" };
      }
      var next = this.peekCodePoint(0);
      if (next === APOSTROPHE || next === QUOTATION_MARK) {
        var stringToken = this.consumeStringToken(this.consumeCodePoint());
        if (stringToken.type === 0) {
          this.consumeWhiteSpace();
          if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {
            this.consumeCodePoint();
            return { type: 22, value: stringToken.value };
          }
        }
        this.consumeBadUrlRemnants();
        return BAD_URL_TOKEN;
      }
      while (true) {
        var codePoint = this.consumeCodePoint();
        if (codePoint === EOF || codePoint === RIGHT_PARENTHESIS) {
          return { type: 22, value: fromCodePoint$1.apply(void 0, value) };
        } else if (isWhiteSpace(codePoint)) {
          this.consumeWhiteSpace();
          if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {
            this.consumeCodePoint();
            return { type: 22, value: fromCodePoint$1.apply(void 0, value) };
          }
          this.consumeBadUrlRemnants();
          return BAD_URL_TOKEN;
        } else if (codePoint === QUOTATION_MARK || codePoint === APOSTROPHE || codePoint === LEFT_PARENTHESIS || isNonPrintableCodePoint(codePoint)) {
          this.consumeBadUrlRemnants();
          return BAD_URL_TOKEN;
        } else if (codePoint === REVERSE_SOLIDUS) {
          if (isValidEscape(codePoint, this.peekCodePoint(0))) {
            value.push(this.consumeEscapedCodePoint());
          } else {
            this.consumeBadUrlRemnants();
            return BAD_URL_TOKEN;
          }
        } else {
          value.push(codePoint);
        }
      }
    };
    Tokenizer2.prototype.consumeWhiteSpace = function() {
      while (isWhiteSpace(this.peekCodePoint(0))) {
        this.consumeCodePoint();
      }
    };
    Tokenizer2.prototype.consumeBadUrlRemnants = function() {
      while (true) {
        var codePoint = this.consumeCodePoint();
        if (codePoint === RIGHT_PARENTHESIS || codePoint === EOF) {
          return;
        }
        if (isValidEscape(codePoint, this.peekCodePoint(0))) {
          this.consumeEscapedCodePoint();
        }
      }
    };
    Tokenizer2.prototype.consumeStringSlice = function(count) {
      var SLICE_STACK_SIZE = 5e4;
      var value = "";
      while (count > 0) {
        var amount = Math.min(SLICE_STACK_SIZE, count);
        value += fromCodePoint$1.apply(void 0, this._value.splice(0, amount));
        count -= amount;
      }
      this._value.shift();
      return value;
    };
    Tokenizer2.prototype.consumeStringToken = function(endingCodePoint) {
      var value = "";
      var i = 0;
      do {
        var codePoint = this._value[i];
        if (codePoint === EOF || codePoint === void 0 || codePoint === endingCodePoint) {
          value += this.consumeStringSlice(i);
          return { type: 0, value };
        }
        if (codePoint === LINE_FEED) {
          this._value.splice(0, i);
          return BAD_STRING_TOKEN;
        }
        if (codePoint === REVERSE_SOLIDUS) {
          var next = this._value[i + 1];
          if (next !== EOF && next !== void 0) {
            if (next === LINE_FEED) {
              value += this.consumeStringSlice(i);
              i = -1;
              this._value.shift();
            } else if (isValidEscape(codePoint, next)) {
              value += this.consumeStringSlice(i);
              value += fromCodePoint$1(this.consumeEscapedCodePoint());
              i = -1;
            }
          }
        }
        i++;
      } while (true);
    };
    Tokenizer2.prototype.consumeNumber = function() {
      var repr = [];
      var type = FLAG_INTEGER;
      var c1 = this.peekCodePoint(0);
      if (c1 === PLUS_SIGN || c1 === HYPHEN_MINUS) {
        repr.push(this.consumeCodePoint());
      }
      while (isDigit(this.peekCodePoint(0))) {
        repr.push(this.consumeCodePoint());
      }
      c1 = this.peekCodePoint(0);
      var c2 = this.peekCodePoint(1);
      if (c1 === FULL_STOP && isDigit(c2)) {
        repr.push(this.consumeCodePoint(), this.consumeCodePoint());
        type = FLAG_NUMBER;
        while (isDigit(this.peekCodePoint(0))) {
          repr.push(this.consumeCodePoint());
        }
      }
      c1 = this.peekCodePoint(0);
      c2 = this.peekCodePoint(1);
      var c3 = this.peekCodePoint(2);
      if ((c1 === E || c1 === e) && ((c2 === PLUS_SIGN || c2 === HYPHEN_MINUS) && isDigit(c3) || isDigit(c2))) {
        repr.push(this.consumeCodePoint(), this.consumeCodePoint());
        type = FLAG_NUMBER;
        while (isDigit(this.peekCodePoint(0))) {
          repr.push(this.consumeCodePoint());
        }
      }
      return [stringToNumber(repr), type];
    };
    Tokenizer2.prototype.consumeNumericToken = function() {
      var _a = this.consumeNumber(), number = _a[0], flags = _a[1];
      var c1 = this.peekCodePoint(0);
      var c2 = this.peekCodePoint(1);
      var c3 = this.peekCodePoint(2);
      if (isIdentifierStart(c1, c2, c3)) {
        var unit = this.consumeName();
        return { type: 15, number, flags, unit };
      }
      if (c1 === PERCENTAGE_SIGN) {
        this.consumeCodePoint();
        return { type: 16, number, flags };
      }
      return { type: 17, number, flags };
    };
    Tokenizer2.prototype.consumeEscapedCodePoint = function() {
      var codePoint = this.consumeCodePoint();
      if (isHex(codePoint)) {
        var hex = fromCodePoint$1(codePoint);
        while (isHex(this.peekCodePoint(0)) && hex.length < 6) {
          hex += fromCodePoint$1(this.consumeCodePoint());
        }
        if (isWhiteSpace(this.peekCodePoint(0))) {
          this.consumeCodePoint();
        }
        var hexCodePoint = parseInt(hex, 16);
        if (hexCodePoint === 0 || isSurrogateCodePoint(hexCodePoint) || hexCodePoint > 1114111) {
          return REPLACEMENT_CHARACTER;
        }
        return hexCodePoint;
      }
      if (codePoint === EOF) {
        return REPLACEMENT_CHARACTER;
      }
      return codePoint;
    };
    Tokenizer2.prototype.consumeName = function() {
      var result = "";
      while (true) {
        var codePoint = this.consumeCodePoint();
        if (isNameCodePoint(codePoint)) {
          result += fromCodePoint$1(codePoint);
        } else if (isValidEscape(codePoint, this.peekCodePoint(0))) {
          result += fromCodePoint$1(this.consumeEscapedCodePoint());
        } else {
          this.reconsumeCodePoint(codePoint);
          return result;
        }
      }
    };
    return Tokenizer2;
  }()
);
var Parser = (
  /** @class */
  function() {
    function Parser2(tokens) {
      this._tokens = tokens;
    }
    Parser2.create = function(value) {
      var tokenizer = new Tokenizer();
      tokenizer.write(value);
      return new Parser2(tokenizer.read());
    };
    Parser2.parseValue = function(value) {
      return Parser2.create(value).parseComponentValue();
    };
    Parser2.parseValues = function(value) {
      return Parser2.create(value).parseComponentValues();
    };
    Parser2.prototype.parseComponentValue = function() {
      var token = this.consumeToken();
      while (token.type === 31) {
        token = this.consumeToken();
      }
      if (token.type === 32) {
        throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
      }
      this.reconsumeToken(token);
      var value = this.consumeComponentValue();
      do {
        token = this.consumeToken();
      } while (token.type === 31);
      if (token.type === 32) {
        return value;
      }
      throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one");
    };
    Parser2.prototype.parseComponentValues = function() {
      var values = [];
      while (true) {
        var value = this.consumeComponentValue();
        if (value.type === 32) {
          return values;
        }
        values.push(value);
        values.push();
      }
    };
    Parser2.prototype.consumeComponentValue = function() {
      var token = this.consumeToken();
      switch (token.type) {
        case 11:
        case 28:
        case 2:
          return this.consumeSimpleBlock(token.type);
        case 19:
          return this.consumeFunction(token);
      }
      return token;
    };
    Parser2.prototype.consumeSimpleBlock = function(type) {
      var block = { type, values: [] };
      var token = this.consumeToken();
      while (true) {
        if (token.type === 32 || isEndingTokenFor(token, type)) {
          return block;
        }
        this.reconsumeToken(token);
        block.values.push(this.consumeComponentValue());
        token = this.consumeToken();
      }
    };
    Parser2.prototype.consumeFunction = function(functionToken) {
      var cssFunction = {
        name: functionToken.value,
        values: [],
        type: 18
        /* FUNCTION */
      };
      while (true) {
        var token = this.consumeToken();
        if (token.type === 32 || token.type === 3) {
          return cssFunction;
        }
        this.reconsumeToken(token);
        cssFunction.values.push(this.consumeComponentValue());
      }
    };
    Parser2.prototype.consumeToken = function() {
      var token = this._tokens.shift();
      return typeof token === "undefined" ? EOF_TOKEN : token;
    };
    Parser2.prototype.reconsumeToken = function(token) {
      this._tokens.unshift(token);
    };
    return Parser2;
  }()
);
var isDimensionToken = function(token) {
  return token.type === 15;
};
var isNumberToken = function(token) {
  return token.type === 17;
};
var isIdentToken = function(token) {
  return token.type === 20;
};
var isStringToken = function(token) {
  return token.type === 0;
};
var isIdentWithValue = function(token, value) {
  return isIdentToken(token) && token.value === value;
};
var nonWhiteSpace = function(token) {
  return token.type !== 31;
};
var nonFunctionArgSeparator = function(token) {
  return token.type !== 31 && token.type !== 4;
};
var parseFunctionArgs = function(tokens) {
  var args = [];
  var arg = [];
  tokens.forEach(function(token) {
    if (token.type === 4) {
      if (arg.length === 0) {
        throw new Error("Error parsing function args, zero tokens for arg");
      }
      args.push(arg);
      arg = [];
      return;
    }
    if (token.type !== 31) {
      arg.push(token);
    }
  });
  if (arg.length) {
    args.push(arg);
  }
  return args;
};
var isEndingTokenFor = function(token, type) {
  if (type === 11 && token.type === 12) {
    return true;
  }
  if (type === 28 && token.type === 29) {
    return true;
  }
  return type === 2 && token.type === 3;
};
var isLength = function(token) {
  return token.type === 17 || token.type === 15;
};
var isLengthPercentage = function(token) {
  return token.type === 16 || isLength(token);
};
var parseLengthPercentageTuple = function(tokens) {
  return tokens.length > 1 ? [tokens[0], tokens[1]] : [tokens[0]];
};
var ZERO_LENGTH = {
  type: 17,
  number: 0,
  flags: FLAG_INTEGER
};
var FIFTY_PERCENT = {
  type: 16,
  number: 50,
  flags: FLAG_INTEGER
};
var HUNDRED_PERCENT = {
  type: 16,
  number: 100,
  flags: FLAG_INTEGER
};
var getAbsoluteValueForTuple = function(tuple, width, height) {
  var x = tuple[0], y = tuple[1];
  return [getAbsoluteValue(x, width), getAbsoluteValue(typeof y !== "undefined" ? y : x, height)];
};
var getAbsoluteValue = function(token, parent) {
  if (token.type === 16) {
    return token.number / 100 * parent;
  }
  if (isDimensionToken(token)) {
    switch (token.unit) {
      case "rem":
      case "em":
        return 16 * token.number;
      case "px":
      default:
        return token.number;
    }
  }
  return token.number;
};
var DEG = "deg";
var GRAD = "grad";
var RAD = "rad";
var TURN = "turn";
var angle = {
  name: "angle",
  parse: function(_context, value) {
    if (value.type === 15) {
      switch (value.unit) {
        case DEG:
          return Math.PI * value.number / 180;
        case GRAD:
          return Math.PI / 200 * value.number;
        case RAD:
          return value.number;
        case TURN:
          return Math.PI * 2 * value.number;
      }
    }
    throw new Error("Unsupported angle type");
  }
};
var isAngle = function(value) {
  if (value.type === 15) {
    if (value.unit === DEG || value.unit === GRAD || value.unit === RAD || value.unit === TURN) {
      return true;
    }
  }
  return false;
};
var parseNamedSide = function(tokens) {
  var sideOrCorner = tokens.filter(isIdentToken).map(function(ident) {
    return ident.value;
  }).join(" ");
  switch (sideOrCorner) {
    case "to bottom right":
    case "to right bottom":
    case "left top":
    case "top left":
      return [ZERO_LENGTH, ZERO_LENGTH];
    case "to top":
    case "bottom":
      return deg(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
      return [ZERO_LENGTH, HUNDRED_PERCENT];
    case "to right":
    case "left":
      return deg(90);
    case "to top left":
    case "to left top":
    case "right bottom":
    case "bottom right":
      return [HUNDRED_PERCENT, HUNDRED_PERCENT];
    case "to bottom":
    case "top":
      return deg(180);
    case "to top right":
    case "to right top":
    case "left bottom":
    case "bottom left":
      return [HUNDRED_PERCENT, ZERO_LENGTH];
    case "to left":
    case "right":
      return deg(270);
  }
  return 0;
};
var deg = function(deg2) {
  return Math.PI * deg2 / 180;
};
var color$1 = {
  name: "color",
  parse: function(context, value) {
    if (value.type === 18) {
      var colorFunction = SUPPORTED_COLOR_FUNCTIONS[value.name];
      if (typeof colorFunction === "undefined") {
        throw new Error('Attempting to parse an unsupported color function "' + value.name + '"');
      }
      return colorFunction(context, value.values);
    }
    if (value.type === 5) {
      if (value.value.length === 3) {
        var r = value.value.substring(0, 1);
        var g = value.value.substring(1, 2);
        var b = value.value.substring(2, 3);
        return pack(parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16), 1);
      }
      if (value.value.length === 4) {
        var r = value.value.substring(0, 1);
        var g = value.value.substring(1, 2);
        var b = value.value.substring(2, 3);
        var a2 = value.value.substring(3, 4);
        return pack(parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16), parseInt(a2 + a2, 16) / 255);
      }
      if (value.value.length === 6) {
        var r = value.value.substring(0, 2);
        var g = value.value.substring(2, 4);
        var b = value.value.substring(4, 6);
        return pack(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), 1);
      }
      if (value.value.length === 8) {
        var r = value.value.substring(0, 2);
        var g = value.value.substring(2, 4);
        var b = value.value.substring(4, 6);
        var a2 = value.value.substring(6, 8);
        return pack(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), parseInt(a2, 16) / 255);
      }
    }
    if (value.type === 20) {
      var namedColor = COLORS[value.value.toUpperCase()];
      if (typeof namedColor !== "undefined") {
        return namedColor;
      }
    }
    return COLORS.TRANSPARENT;
  }
};
var isTransparent = function(color2) {
  return (255 & color2) === 0;
};
var asString = function(color2) {
  var alpha = 255 & color2;
  var blue = 255 & color2 >> 8;
  var green = 255 & color2 >> 16;
  var red = 255 & color2 >> 24;
  return alpha < 255 ? "rgba(" + red + "," + green + "," + blue + "," + alpha / 255 + ")" : "rgb(" + red + "," + green + "," + blue + ")";
};
var pack = function(r, g, b, a2) {
  return (r << 24 | g << 16 | b << 8 | Math.round(a2 * 255) << 0) >>> 0;
};
var getTokenColorValue = function(token, i) {
  if (token.type === 17) {
    return token.number;
  }
  if (token.type === 16) {
    var max = i === 3 ? 1 : 255;
    return i === 3 ? token.number / 100 * max : Math.round(token.number / 100 * max);
  }
  return 0;
};
var rgb = function(_context, args) {
  var tokens = args.filter(nonFunctionArgSeparator);
  if (tokens.length === 3) {
    var _a = tokens.map(getTokenColorValue), r = _a[0], g = _a[1], b = _a[2];
    return pack(r, g, b, 1);
  }
  if (tokens.length === 4) {
    var _b = tokens.map(getTokenColorValue), r = _b[0], g = _b[1], b = _b[2], a2 = _b[3];
    return pack(r, g, b, a2);
  }
  return 0;
};
function hue2rgb(t1, t2, hue) {
  if (hue < 0) {
    hue += 1;
  }
  if (hue >= 1) {
    hue -= 1;
  }
  if (hue < 1 / 6) {
    return (t2 - t1) * hue * 6 + t1;
  } else if (hue < 1 / 2) {
    return t2;
  } else if (hue < 2 / 3) {
    return (t2 - t1) * 6 * (2 / 3 - hue) + t1;
  } else {
    return t1;
  }
}
var hsl = function(context, args) {
  var tokens = args.filter(nonFunctionArgSeparator);
  var hue = tokens[0], saturation = tokens[1], lightness = tokens[2], alpha = tokens[3];
  var h = (hue.type === 17 ? deg(hue.number) : angle.parse(context, hue)) / (Math.PI * 2);
  var s = isLengthPercentage(saturation) ? saturation.number / 100 : 0;
  var l = isLengthPercentage(lightness) ? lightness.number / 100 : 0;
  var a2 = typeof alpha !== "undefined" && isLengthPercentage(alpha) ? getAbsoluteValue(alpha, 1) : 1;
  if (s === 0) {
    return pack(l * 255, l * 255, l * 255, 1);
  }
  var t2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
  var t1 = l * 2 - t2;
  var r = hue2rgb(t1, t2, h + 1 / 3);
  var g = hue2rgb(t1, t2, h);
  var b = hue2rgb(t1, t2, h - 1 / 3);
  return pack(r * 255, g * 255, b * 255, a2);
};
var SUPPORTED_COLOR_FUNCTIONS = {
  hsl,
  hsla: hsl,
  rgb,
  rgba: rgb
};
var parseColor = function(context, value) {
  return color$1.parse(context, Parser.create(value).parseComponentValue());
};
var COLORS = {
  ALICEBLUE: 4042850303,
  ANTIQUEWHITE: 4209760255,
  AQUA: 16777215,
  AQUAMARINE: 2147472639,
  AZURE: 4043309055,
  BEIGE: 4126530815,
  BISQUE: 4293182719,
  BLACK: 255,
  BLANCHEDALMOND: 4293643775,
  BLUE: 65535,
  BLUEVIOLET: 2318131967,
  BROWN: 2771004159,
  BURLYWOOD: 3736635391,
  CADETBLUE: 1604231423,
  CHARTREUSE: 2147418367,
  CHOCOLATE: 3530104575,
  CORAL: 4286533887,
  CORNFLOWERBLUE: 1687547391,
  CORNSILK: 4294499583,
  CRIMSON: 3692313855,
  CYAN: 16777215,
  DARKBLUE: 35839,
  DARKCYAN: 9145343,
  DARKGOLDENROD: 3095837695,
  DARKGRAY: 2846468607,
  DARKGREEN: 6553855,
  DARKGREY: 2846468607,
  DARKKHAKI: 3182914559,
  DARKMAGENTA: 2332068863,
  DARKOLIVEGREEN: 1433087999,
  DARKORANGE: 4287365375,
  DARKORCHID: 2570243327,
  DARKRED: 2332033279,
  DARKSALMON: 3918953215,
  DARKSEAGREEN: 2411499519,
  DARKSLATEBLUE: 1211993087,
  DARKSLATEGRAY: 793726975,
  DARKSLATEGREY: 793726975,
  DARKTURQUOISE: 13554175,
  DARKVIOLET: 2483082239,
  DEEPPINK: 4279538687,
  DEEPSKYBLUE: 12582911,
  DIMGRAY: 1768516095,
  DIMGREY: 1768516095,
  DODGERBLUE: 512819199,
  FIREBRICK: 2988581631,
  FLORALWHITE: 4294635775,
  FORESTGREEN: 579543807,
  FUCHSIA: 4278255615,
  GAINSBORO: 3705462015,
  GHOSTWHITE: 4177068031,
  GOLD: 4292280575,
  GOLDENROD: 3668254975,
  GRAY: 2155905279,
  GREEN: 8388863,
  GREENYELLOW: 2919182335,
  GREY: 2155905279,
  HONEYDEW: 4043305215,
  HOTPINK: 4285117695,
  INDIANRED: 3445382399,
  INDIGO: 1258324735,
  IVORY: 4294963455,
  KHAKI: 4041641215,
  LAVENDER: 3873897215,
  LAVENDERBLUSH: 4293981695,
  LAWNGREEN: 2096890111,
  LEMONCHIFFON: 4294626815,
  LIGHTBLUE: 2916673279,
  LIGHTCORAL: 4034953471,
  LIGHTCYAN: 3774873599,
  LIGHTGOLDENRODYELLOW: 4210742015,
  LIGHTGRAY: 3553874943,
  LIGHTGREEN: 2431553791,
  LIGHTGREY: 3553874943,
  LIGHTPINK: 4290167295,
  LIGHTSALMON: 4288707327,
  LIGHTSEAGREEN: 548580095,
  LIGHTSKYBLUE: 2278488831,
  LIGHTSLATEGRAY: 2005441023,
  LIGHTSLATEGREY: 2005441023,
  LIGHTSTEELBLUE: 2965692159,
  LIGHTYELLOW: 4294959359,
  LIME: 16711935,
  LIMEGREEN: 852308735,
  LINEN: 4210091775,
  MAGENTA: 4278255615,
  MAROON: 2147483903,
  MEDIUMAQUAMARINE: 1724754687,
  MEDIUMBLUE: 52735,
  MEDIUMORCHID: 3126187007,
  MEDIUMPURPLE: 2473647103,
  MEDIUMSEAGREEN: 1018393087,
  MEDIUMSLATEBLUE: 2070474495,
  MEDIUMSPRINGGREEN: 16423679,
  MEDIUMTURQUOISE: 1221709055,
  MEDIUMVIOLETRED: 3340076543,
  MIDNIGHTBLUE: 421097727,
  MINTCREAM: 4127193855,
  MISTYROSE: 4293190143,
  MOCCASIN: 4293178879,
  NAVAJOWHITE: 4292783615,
  NAVY: 33023,
  OLDLACE: 4260751103,
  OLIVE: 2155872511,
  OLIVEDRAB: 1804477439,
  ORANGE: 4289003775,
  ORANGERED: 4282712319,
  ORCHID: 3664828159,
  PALEGOLDENROD: 4008225535,
  PALEGREEN: 2566625535,
  PALETURQUOISE: 2951671551,
  PALEVIOLETRED: 3681588223,
  PAPAYAWHIP: 4293907967,
  PEACHPUFF: 4292524543,
  PERU: 3448061951,
  PINK: 4290825215,
  PLUM: 3718307327,
  POWDERBLUE: 2967529215,
  PURPLE: 2147516671,
  REBECCAPURPLE: 1714657791,
  RED: 4278190335,
  ROSYBROWN: 3163525119,
  ROYALBLUE: 1097458175,
  SADDLEBROWN: 2336560127,
  SALMON: 4202722047,
  SANDYBROWN: 4104413439,
  SEAGREEN: 780883967,
  SEASHELL: 4294307583,
  SIENNA: 2689740287,
  SILVER: 3233857791,
  SKYBLUE: 2278484991,
  SLATEBLUE: 1784335871,
  SLATEGRAY: 1887473919,
  SLATEGREY: 1887473919,
  SNOW: 4294638335,
  SPRINGGREEN: 16744447,
  STEELBLUE: 1182971135,
  TAN: 3535047935,
  TEAL: 8421631,
  THISTLE: 3636451583,
  TOMATO: 4284696575,
  TRANSPARENT: 0,
  TURQUOISE: 1088475391,
  VIOLET: 4001558271,
  WHEAT: 4125012991,
  WHITE: 4294967295,
  WHITESMOKE: 4126537215,
  YELLOW: 4294902015,
  YELLOWGREEN: 2597139199
};
var backgroundClip = {
  name: "background-clip",
  initialValue: "border-box",
  prefix: false,
  type: 1,
  parse: function(_context, tokens) {
    return tokens.map(function(token) {
      if (isIdentToken(token)) {
        switch (token.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      }
      return 0;
    });
  }
};
var backgroundColor = {
  name: "background-color",
  initialValue: "transparent",
  prefix: false,
  type: 3,
  format: "color"
};
var parseColorStop = function(context, args) {
  var color2 = color$1.parse(context, args[0]);
  var stop = args[1];
  return stop && isLengthPercentage(stop) ? { color: color2, stop } : { color: color2, stop: null };
};
var processColorStops = function(stops, lineLength) {
  var first = stops[0];
  var last = stops[stops.length - 1];
  if (first.stop === null) {
    first.stop = ZERO_LENGTH;
  }
  if (last.stop === null) {
    last.stop = HUNDRED_PERCENT;
  }
  var processStops = [];
  var previous = 0;
  for (var i = 0; i < stops.length; i++) {
    var stop_1 = stops[i].stop;
    if (stop_1 !== null) {
      var absoluteValue = getAbsoluteValue(stop_1, lineLength);
      if (absoluteValue > previous) {
        processStops.push(absoluteValue);
      } else {
        processStops.push(previous);
      }
      previous = absoluteValue;
    } else {
      processStops.push(null);
    }
  }
  var gapBegin = null;
  for (var i = 0; i < processStops.length; i++) {
    var stop_2 = processStops[i];
    if (stop_2 === null) {
      if (gapBegin === null) {
        gapBegin = i;
      }
    } else if (gapBegin !== null) {
      var gapLength = i - gapBegin;
      var beforeGap = processStops[gapBegin - 1];
      var gapValue = (stop_2 - beforeGap) / (gapLength + 1);
      for (var g = 1; g <= gapLength; g++) {
        processStops[gapBegin + g - 1] = gapValue * g;
      }
      gapBegin = null;
    }
  }
  return stops.map(function(_a, i2) {
    var color2 = _a.color;
    return { color: color2, stop: Math.max(Math.min(1, processStops[i2] / lineLength), 0) };
  });
};
var getAngleFromCorner = function(corner, width, height) {
  var centerX = width / 2;
  var centerY = height / 2;
  var x = getAbsoluteValue(corner[0], width) - centerX;
  var y = centerY - getAbsoluteValue(corner[1], height);
  return (Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2);
};
var calculateGradientDirection = function(angle2, width, height) {
  var radian = typeof angle2 === "number" ? angle2 : getAngleFromCorner(angle2, width, height);
  var lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  var halfLineLength = lineLength / 2;
  var yDiff = Math.sin(radian - Math.PI / 2) * halfLineLength;
  var xDiff = Math.cos(radian - Math.PI / 2) * halfLineLength;
  return [lineLength, halfWidth - xDiff, halfWidth + xDiff, halfHeight - yDiff, halfHeight + yDiff];
};
var distance = function(a2, b) {
  return Math.sqrt(a2 * a2 + b * b);
};
var findCorner = function(width, height, x, y, closest) {
  var corners = [
    [0, 0],
    [0, height],
    [width, 0],
    [width, height]
  ];
  return corners.reduce(function(stat, corner) {
    var cx = corner[0], cy = corner[1];
    var d = distance(x - cx, y - cy);
    if (closest ? d < stat.optimumDistance : d > stat.optimumDistance) {
      return {
        optimumCorner: corner,
        optimumDistance: d
      };
    }
    return stat;
  }, {
    optimumDistance: closest ? Infinity : -Infinity,
    optimumCorner: null
  }).optimumCorner;
};
var calculateRadius = function(gradient, x, y, width, height) {
  var rx = 0;
  var ry = 0;
  switch (gradient.size) {
    case 0:
      if (gradient.shape === 0) {
        rx = ry = Math.min(Math.abs(x), Math.abs(x - width), Math.abs(y), Math.abs(y - height));
      } else if (gradient.shape === 1) {
        rx = Math.min(Math.abs(x), Math.abs(x - width));
        ry = Math.min(Math.abs(y), Math.abs(y - height));
      }
      break;
    case 2:
      if (gradient.shape === 0) {
        rx = ry = Math.min(distance(x, y), distance(x, y - height), distance(x - width, y), distance(x - width, y - height));
      } else if (gradient.shape === 1) {
        var c = Math.min(Math.abs(y), Math.abs(y - height)) / Math.min(Math.abs(x), Math.abs(x - width));
        var _a = findCorner(width, height, x, y, true), cx = _a[0], cy = _a[1];
        rx = distance(cx - x, (cy - y) / c);
        ry = c * rx;
      }
      break;
    case 1:
      if (gradient.shape === 0) {
        rx = ry = Math.max(Math.abs(x), Math.abs(x - width), Math.abs(y), Math.abs(y - height));
      } else if (gradient.shape === 1) {
        rx = Math.max(Math.abs(x), Math.abs(x - width));
        ry = Math.max(Math.abs(y), Math.abs(y - height));
      }
      break;
    case 3:
      if (gradient.shape === 0) {
        rx = ry = Math.max(distance(x, y), distance(x, y - height), distance(x - width, y), distance(x - width, y - height));
      } else if (gradient.shape === 1) {
        var c = Math.max(Math.abs(y), Math.abs(y - height)) / Math.max(Math.abs(x), Math.abs(x - width));
        var _b = findCorner(width, height, x, y, false), cx = _b[0], cy = _b[1];
        rx = distance(cx - x, (cy - y) / c);
        ry = c * rx;
      }
      break;
  }
  if (Array.isArray(gradient.size)) {
    rx = getAbsoluteValue(gradient.size[0], width);
    ry = gradient.size.length === 2 ? getAbsoluteValue(gradient.size[1], height) : rx;
  }
  return [rx, ry];
};
var linearGradient = function(context, tokens) {
  var angle$1 = deg(180);
  var stops = [];
  parseFunctionArgs(tokens).forEach(function(arg, i) {
    if (i === 0) {
      var firstToken = arg[0];
      if (firstToken.type === 20 && firstToken.value === "to") {
        angle$1 = parseNamedSide(arg);
        return;
      } else if (isAngle(firstToken)) {
        angle$1 = angle.parse(context, firstToken);
        return;
      }
    }
    var colorStop = parseColorStop(context, arg);
    stops.push(colorStop);
  });
  return {
    angle: angle$1,
    stops,
    type: 1
    /* LINEAR_GRADIENT */
  };
};
var prefixLinearGradient = function(context, tokens) {
  var angle$1 = deg(180);
  var stops = [];
  parseFunctionArgs(tokens).forEach(function(arg, i) {
    if (i === 0) {
      var firstToken = arg[0];
      if (firstToken.type === 20 && ["top", "left", "right", "bottom"].indexOf(firstToken.value) !== -1) {
        angle$1 = parseNamedSide(arg);
        return;
      } else if (isAngle(firstToken)) {
        angle$1 = (angle.parse(context, firstToken) + deg(270)) % deg(360);
        return;
      }
    }
    var colorStop = parseColorStop(context, arg);
    stops.push(colorStop);
  });
  return {
    angle: angle$1,
    stops,
    type: 1
    /* LINEAR_GRADIENT */
  };
};
var webkitGradient = function(context, tokens) {
  var angle2 = deg(180);
  var stops = [];
  var type = 1;
  var shape = 0;
  var size2 = 3;
  var position2 = [];
  parseFunctionArgs(tokens).forEach(function(arg, i) {
    var firstToken = arg[0];
    if (i === 0) {
      if (isIdentToken(firstToken) && firstToken.value === "linear") {
        type = 1;
        return;
      } else if (isIdentToken(firstToken) && firstToken.value === "radial") {
        type = 2;
        return;
      }
    }
    if (firstToken.type === 18) {
      if (firstToken.name === "from") {
        var color2 = color$1.parse(context, firstToken.values[0]);
        stops.push({ stop: ZERO_LENGTH, color: color2 });
      } else if (firstToken.name === "to") {
        var color2 = color$1.parse(context, firstToken.values[0]);
        stops.push({ stop: HUNDRED_PERCENT, color: color2 });
      } else if (firstToken.name === "color-stop") {
        var values = firstToken.values.filter(nonFunctionArgSeparator);
        if (values.length === 2) {
          var color2 = color$1.parse(context, values[1]);
          var stop_1 = values[0];
          if (isNumberToken(stop_1)) {
            stops.push({
              stop: { type: 16, number: stop_1.number * 100, flags: stop_1.flags },
              color: color2
            });
          }
        }
      }
    }
  });
  return type === 1 ? {
    angle: (angle2 + deg(180)) % deg(360),
    stops,
    type
  } : { size: size2, shape, stops, position: position2, type };
};
var CLOSEST_SIDE = "closest-side";
var FARTHEST_SIDE = "farthest-side";
var CLOSEST_CORNER = "closest-corner";
var FARTHEST_CORNER = "farthest-corner";
var CIRCLE = "circle";
var ELLIPSE = "ellipse";
var COVER = "cover";
var CONTAIN = "contain";
var radialGradient = function(context, tokens) {
  var shape = 0;
  var size2 = 3;
  var stops = [];
  var position2 = [];
  parseFunctionArgs(tokens).forEach(function(arg, i) {
    var isColorStop = true;
    if (i === 0) {
      var isAtPosition_1 = false;
      isColorStop = arg.reduce(function(acc, token) {
        if (isAtPosition_1) {
          if (isIdentToken(token)) {
            switch (token.value) {
              case "center":
                position2.push(FIFTY_PERCENT);
                return acc;
              case "top":
              case "left":
                position2.push(ZERO_LENGTH);
                return acc;
              case "right":
              case "bottom":
                position2.push(HUNDRED_PERCENT);
                return acc;
            }
          } else if (isLengthPercentage(token) || isLength(token)) {
            position2.push(token);
          }
        } else if (isIdentToken(token)) {
          switch (token.value) {
            case CIRCLE:
              shape = 0;
              return false;
            case ELLIPSE:
              shape = 1;
              return false;
            case "at":
              isAtPosition_1 = true;
              return false;
            case CLOSEST_SIDE:
              size2 = 0;
              return false;
            case COVER:
            case FARTHEST_SIDE:
              size2 = 1;
              return false;
            case CONTAIN:
            case CLOSEST_CORNER:
              size2 = 2;
              return false;
            case FARTHEST_CORNER:
              size2 = 3;
              return false;
          }
        } else if (isLength(token) || isLengthPercentage(token)) {
          if (!Array.isArray(size2)) {
            size2 = [];
          }
          size2.push(token);
          return false;
        }
        return acc;
      }, isColorStop);
    }
    if (isColorStop) {
      var colorStop = parseColorStop(context, arg);
      stops.push(colorStop);
    }
  });
  return {
    size: size2,
    shape,
    stops,
    position: position2,
    type: 2
    /* RADIAL_GRADIENT */
  };
};
var prefixRadialGradient = function(context, tokens) {
  var shape = 0;
  var size2 = 3;
  var stops = [];
  var position2 = [];
  parseFunctionArgs(tokens).forEach(function(arg, i) {
    var isColorStop = true;
    if (i === 0) {
      isColorStop = arg.reduce(function(acc, token) {
        if (isIdentToken(token)) {
          switch (token.value) {
            case "center":
              position2.push(FIFTY_PERCENT);
              return false;
            case "top":
            case "left":
              position2.push(ZERO_LENGTH);
              return false;
            case "right":
            case "bottom":
              position2.push(HUNDRED_PERCENT);
              return false;
          }
        } else if (isLengthPercentage(token) || isLength(token)) {
          position2.push(token);
          return false;
        }
        return acc;
      }, isColorStop);
    } else if (i === 1) {
      isColorStop = arg.reduce(function(acc, token) {
        if (isIdentToken(token)) {
          switch (token.value) {
            case CIRCLE:
              shape = 0;
              return false;
            case ELLIPSE:
              shape = 1;
              return false;
            case CONTAIN:
            case CLOSEST_SIDE:
              size2 = 0;
              return false;
            case FARTHEST_SIDE:
              size2 = 1;
              return false;
            case CLOSEST_CORNER:
              size2 = 2;
              return false;
            case COVER:
            case FARTHEST_CORNER:
              size2 = 3;
              return false;
          }
        } else if (isLength(token) || isLengthPercentage(token)) {
          if (!Array.isArray(size2)) {
            size2 = [];
          }
          size2.push(token);
          return false;
        }
        return acc;
      }, isColorStop);
    }
    if (isColorStop) {
      var colorStop = parseColorStop(context, arg);
      stops.push(colorStop);
    }
  });
  return {
    size: size2,
    shape,
    stops,
    position: position2,
    type: 2
    /* RADIAL_GRADIENT */
  };
};
var isLinearGradient = function(background) {
  return background.type === 1;
};
var isRadialGradient = function(background) {
  return background.type === 2;
};
var image = {
  name: "image",
  parse: function(context, value) {
    if (value.type === 22) {
      var image_1 = {
        url: value.value,
        type: 0
        /* URL */
      };
      context.cache.addImage(value.value);
      return image_1;
    }
    if (value.type === 18) {
      var imageFunction = SUPPORTED_IMAGE_FUNCTIONS[value.name];
      if (typeof imageFunction === "undefined") {
        throw new Error('Attempting to parse an unsupported image function "' + value.name + '"');
      }
      return imageFunction(context, value.values);
    }
    throw new Error("Unsupported image type " + value.type);
  }
};
function isSupportedImage(value) {
  return !(value.type === 20 && value.value === "none") && (value.type !== 18 || !!SUPPORTED_IMAGE_FUNCTIONS[value.name]);
}
var SUPPORTED_IMAGE_FUNCTIONS = {
  "linear-gradient": linearGradient,
  "-moz-linear-gradient": prefixLinearGradient,
  "-ms-linear-gradient": prefixLinearGradient,
  "-o-linear-gradient": prefixLinearGradient,
  "-webkit-linear-gradient": prefixLinearGradient,
  "radial-gradient": radialGradient,
  "-moz-radial-gradient": prefixRadialGradient,
  "-ms-radial-gradient": prefixRadialGradient,
  "-o-radial-gradient": prefixRadialGradient,
  "-webkit-radial-gradient": prefixRadialGradient,
  "-webkit-gradient": webkitGradient
};
var backgroundImage = {
  name: "background-image",
  initialValue: "none",
  type: 1,
  prefix: false,
  parse: function(context, tokens) {
    if (tokens.length === 0) {
      return [];
    }
    var first = tokens[0];
    if (first.type === 20 && first.value === "none") {
      return [];
    }
    return tokens.filter(function(value) {
      return nonFunctionArgSeparator(value) && isSupportedImage(value);
    }).map(function(value) {
      return image.parse(context, value);
    });
  }
};
var backgroundOrigin = {
  name: "background-origin",
  initialValue: "border-box",
  prefix: false,
  type: 1,
  parse: function(_context, tokens) {
    return tokens.map(function(token) {
      if (isIdentToken(token)) {
        switch (token.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      }
      return 0;
    });
  }
};
var backgroundPosition = {
  name: "background-position",
  initialValue: "0% 0%",
  type: 1,
  prefix: false,
  parse: function(_context, tokens) {
    return parseFunctionArgs(tokens).map(function(values) {
      return values.filter(isLengthPercentage);
    }).map(parseLengthPercentageTuple);
  }
};
var backgroundRepeat = {
  name: "background-repeat",
  initialValue: "repeat",
  prefix: false,
  type: 1,
  parse: function(_context, tokens) {
    return parseFunctionArgs(tokens).map(function(values) {
      return values.filter(isIdentToken).map(function(token) {
        return token.value;
      }).join(" ");
    }).map(parseBackgroundRepeat);
  }
};
var parseBackgroundRepeat = function(value) {
  switch (value) {
    case "no-repeat":
      return 1;
    case "repeat-x":
    case "repeat no-repeat":
      return 2;
    case "repeat-y":
    case "no-repeat repeat":
      return 3;
    case "repeat":
    default:
      return 0;
  }
};
var BACKGROUND_SIZE;
(function(BACKGROUND_SIZE2) {
  BACKGROUND_SIZE2["AUTO"] = "auto";
  BACKGROUND_SIZE2["CONTAIN"] = "contain";
  BACKGROUND_SIZE2["COVER"] = "cover";
})(BACKGROUND_SIZE || (BACKGROUND_SIZE = {}));
var backgroundSize = {
  name: "background-size",
  initialValue: "0",
  prefix: false,
  type: 1,
  parse: function(_context, tokens) {
    return parseFunctionArgs(tokens).map(function(values) {
      return values.filter(isBackgroundSizeInfoToken);
    });
  }
};
var isBackgroundSizeInfoToken = function(value) {
  return isIdentToken(value) || isLengthPercentage(value);
};
var borderColorForSide = function(side) {
  return {
    name: "border-" + side + "-color",
    initialValue: "transparent",
    prefix: false,
    type: 3,
    format: "color"
  };
};
var borderTopColor = borderColorForSide("top");
var borderRightColor = borderColorForSide("right");
var borderBottomColor = borderColorForSide("bottom");
var borderLeftColor = borderColorForSide("left");
var borderRadiusForSide = function(side) {
  return {
    name: "border-radius-" + side,
    initialValue: "0 0",
    prefix: false,
    type: 1,
    parse: function(_context, tokens) {
      return parseLengthPercentageTuple(tokens.filter(isLengthPercentage));
    }
  };
};
var borderTopLeftRadius = borderRadiusForSide("top-left");
var borderTopRightRadius = borderRadiusForSide("top-right");
var borderBottomRightRadius = borderRadiusForSide("bottom-right");
var borderBottomLeftRadius = borderRadiusForSide("bottom-left");
var borderStyleForSide = function(side) {
  return {
    name: "border-" + side + "-style",
    initialValue: "solid",
    prefix: false,
    type: 2,
    parse: function(_context, style) {
      switch (style) {
        case "none":
          return 0;
        case "dashed":
          return 2;
        case "dotted":
          return 3;
        case "double":
          return 4;
      }
      return 1;
    }
  };
};
var borderTopStyle = borderStyleForSide("top");
var borderRightStyle = borderStyleForSide("right");
var borderBottomStyle = borderStyleForSide("bottom");
var borderLeftStyle = borderStyleForSide("left");
var borderWidthForSide = function(side) {
  return {
    name: "border-" + side + "-width",
    initialValue: "0",
    type: 0,
    prefix: false,
    parse: function(_context, token) {
      if (isDimensionToken(token)) {
        return token.number;
      }
      return 0;
    }
  };
};
var borderTopWidth = borderWidthForSide("top");
var borderRightWidth = borderWidthForSide("right");
var borderBottomWidth = borderWidthForSide("bottom");
var borderLeftWidth = borderWidthForSide("left");
var color = {
  name: "color",
  initialValue: "transparent",
  prefix: false,
  type: 3,
  format: "color"
};
var direction = {
  name: "direction",
  initialValue: "ltr",
  prefix: false,
  type: 2,
  parse: function(_context, direction2) {
    switch (direction2) {
      case "rtl":
        return 1;
      case "ltr":
      default:
        return 0;
    }
  }
};
var display = {
  name: "display",
  initialValue: "inline-block",
  prefix: false,
  type: 1,
  parse: function(_context, tokens) {
    return tokens.filter(isIdentToken).reduce(
      function(bit, token) {
        return bit | parseDisplayValue(token.value);
      },
      0
      /* NONE */
    );
  }
};
var parseDisplayValue = function(display2) {
  switch (display2) {
    case "block":
    case "-webkit-box":
      return 2;
    case "inline":
      return 4;
    case "run-in":
      return 8;
    case "flow":
      return 16;
    case "flow-root":
      return 32;
    case "table":
      return 64;
    case "flex":
    case "-webkit-flex":
      return 128;
    case "grid":
    case "-ms-grid":
      return 256;
    case "ruby":
      return 512;
    case "subgrid":
      return 1024;
    case "list-item":
      return 2048;
    case "table-row-group":
      return 4096;
    case "table-header-group":
      return 8192;
    case "table-footer-group":
      return 16384;
    case "table-row":
      return 32768;
    case "table-cell":
      return 65536;
    case "table-column-group":
      return 131072;
    case "table-column":
      return 262144;
    case "table-caption":
      return 524288;
    case "ruby-base":
      return 1048576;
    case "ruby-text":
      return 2097152;
    case "ruby-base-container":
      return 4194304;
    case "ruby-text-container":
      return 8388608;
    case "contents":
      return 16777216;
    case "inline-block":
      return 33554432;
    case "inline-list-item":
      return 67108864;
    case "inline-table":
      return 134217728;
    case "inline-flex":
      return 268435456;
    case "inline-grid":
      return 536870912;
  }
  return 0;
};
var float = {
  name: "float",
  initialValue: "none",
  prefix: false,
  type: 2,
  parse: function(_context, float2) {
    switch (float2) {
      case "left":
        return 1;
      case "right":
        return 2;
      case "inline-start":
        return 3;
      case "inline-end":
        return 4;
    }
    return 0;
  }
};
var letterSpacing = {
  name: "letter-spacing",
  initialValue: "0",
  prefix: false,
  type: 0,
  parse: function(_context, token) {
    if (token.type === 20 && token.value === "normal") {
      return 0;
    }
    if (token.type === 17) {
      return token.number;
    }
    if (token.type === 15) {
      return token.number;
    }
    return 0;
  }
};
var LINE_BREAK;
(function(LINE_BREAK2) {
  LINE_BREAK2["NORMAL"] = "normal";
  LINE_BREAK2["STRICT"] = "strict";
})(LINE_BREAK || (LINE_BREAK = {}));
var lineBreak = {
  name: "line-break",
  initialValue: "normal",
  prefix: false,
  type: 2,
  parse: function(_context, lineBreak2) {
    switch (lineBreak2) {
      case "strict":
        return LINE_BREAK.STRICT;
      case "normal":
      default:
        return LINE_BREAK.NORMAL;
    }
  }
};
var lineHeight = {
  name: "line-height",
  initialValue: "normal",
  prefix: false,
  type: 4
  /* TOKEN_VALUE */
};
var computeLineHeight = function(token, fontSize2) {
  if (isIdentToken(token) && token.value === "normal") {
    return 1.2 * fontSize2;
  } else if (token.type === 17) {
    return fontSize2 * token.number;
  } else if (isLengthPercentage(token)) {
    return getAbsoluteValue(token, fontSize2);
  }
  return fontSize2;
};
var listStyleImage = {
  name: "list-style-image",
  initialValue: "none",
  type: 0,
  prefix: false,
  parse: function(context, token) {
    if (token.type === 20 && token.value === "none") {
      return null;
    }
    return image.parse(context, token);
  }
};
var listStylePosition = {
  name: "list-style-position",
  initialValue: "outside",
  prefix: false,
  type: 2,
  parse: function(_context, position2) {
    switch (position2) {
      case "inside":
        return 0;
      case "outside":
      default:
        return 1;
    }
  }
};
var listStyleType = {
  name: "list-style-type",
  initialValue: "none",
  prefix: false,
  type: 2,
  parse: function(_context, type) {
    switch (type) {
      case "disc":
        return 0;
      case "circle":
        return 1;
      case "square":
        return 2;
      case "decimal":
        return 3;
      case "cjk-decimal":
        return 4;
      case "decimal-leading-zero":
        return 5;
      case "lower-roman":
        return 6;
      case "upper-roman":
        return 7;
      case "lower-greek":
        return 8;
      case "lower-alpha":
        return 9;
      case "upper-alpha":
        return 10;
      case "arabic-indic":
        return 11;
      case "armenian":
        return 12;
      case "bengali":
        return 13;
      case "cambodian":
        return 14;
      case "cjk-earthly-branch":
        return 15;
      case "cjk-heavenly-stem":
        return 16;
      case "cjk-ideographic":
        return 17;
      case "devanagari":
        return 18;
      case "ethiopic-numeric":
        return 19;
      case "georgian":
        return 20;
      case "gujarati":
        return 21;
      case "gurmukhi":
        return 22;
      case "hebrew":
        return 22;
      case "hiragana":
        return 23;
      case "hiragana-iroha":
        return 24;
      case "japanese-formal":
        return 25;
      case "japanese-informal":
        return 26;
      case "kannada":
        return 27;
      case "katakana":
        return 28;
      case "katakana-iroha":
        return 29;
      case "khmer":
        return 30;
      case "korean-hangul-formal":
        return 31;
      case "korean-hanja-formal":
        return 32;
      case "korean-hanja-informal":
        return 33;
      case "lao":
        return 34;
      case "lower-armenian":
        return 35;
      case "malayalam":
        return 36;
      case "mongolian":
        return 37;
      case "myanmar":
        return 38;
      case "oriya":
        return 39;
      case "persian":
        return 40;
      case "simp-chinese-formal":
        return 41;
      case "simp-chinese-informal":
        return 42;
      case "tamil":
        return 43;
      case "telugu":
        return 44;
      case "thai":
        return 45;
      case "tibetan":
        return 46;
      case "trad-chinese-formal":
        return 47;
      case "trad-chinese-informal":
        return 48;
      case "upper-armenian":
        return 49;
      case "disclosure-open":
        return 50;
      case "disclosure-closed":
        return 51;
      case "none":
      default:
        return -1;
    }
  }
};
var marginForSide = function(side) {
  return {
    name: "margin-" + side,
    initialValue: "0",
    prefix: false,
    type: 4
    /* TOKEN_VALUE */
  };
};
var marginTop = marginForSide("top");
var marginRight = marginForSide("right");
var marginBottom = marginForSide("bottom");
var marginLeft = marginForSide("left");
var overflow = {
  name: "overflow",
  initialValue: "visible",
  prefix: false,
  type: 1,
  parse: function(_context, tokens) {
    return tokens.filter(isIdentToken).map(function(overflow2) {
      switch (overflow2.value) {
        case "hidden":
          return 1;
        case "scroll":
          return 2;
        case "clip":
          return 3;
        case "auto":
          return 4;
        case "visible":
        default:
          return 0;
      }
    });
  }
};
var overflowWrap = {
  name: "overflow-wrap",
  initialValue: "normal",
  prefix: false,
  type: 2,
  parse: function(_context, overflow2) {
    switch (overflow2) {
      case "break-word":
        return "break-word";
      case "normal":
      default:
        return "normal";
    }
  }
};
var paddingForSide = function(side) {
  return {
    name: "padding-" + side,
    initialValue: "0",
    prefix: false,
    type: 3,
    format: "length-percentage"
  };
};
var paddingTop = paddingForSide("top");
var paddingRight = paddingForSide("right");
var paddingBottom = paddingForSide("bottom");
var paddingLeft = paddingForSide("left");
var textAlign = {
  name: "text-align",
  initialValue: "left",
  prefix: false,
  type: 2,
  parse: function(_context, textAlign2) {
    switch (textAlign2) {
      case "right":
        return 2;
      case "center":
      case "justify":
        return 1;
      case "left":
      default:
        return 0;
    }
  }
};
var position = {
  name: "position",
  initialValue: "static",
  prefix: false,
  type: 2,
  parse: function(_context, position2) {
    switch (position2) {
      case "relative":
        return 1;
      case "absolute":
        return 2;
      case "fixed":
        return 3;
      case "sticky":
        return 4;
    }
    return 0;
  }
};
var textShadow = {
  name: "text-shadow",
  initialValue: "none",
  type: 1,
  prefix: false,
  parse: function(context, tokens) {
    if (tokens.length === 1 && isIdentWithValue(tokens[0], "none")) {
      return [];
    }
    return parseFunctionArgs(tokens).map(function(values) {
      var shadow = {
        color: COLORS.TRANSPARENT,
        offsetX: ZERO_LENGTH,
        offsetY: ZERO_LENGTH,
        blur: ZERO_LENGTH
      };
      var c = 0;
      for (var i = 0; i < values.length; i++) {
        var token = values[i];
        if (isLength(token)) {
          if (c === 0) {
            shadow.offsetX = token;
          } else if (c === 1) {
            shadow.offsetY = token;
          } else {
            shadow.blur = token;
          }
          c++;
        } else {
          shadow.color = color$1.parse(context, token);
        }
      }
      return shadow;
    });
  }
};
var textTransform = {
  name: "text-transform",
  initialValue: "none",
  prefix: false,
  type: 2,
  parse: function(_context, textTransform2) {
    switch (textTransform2) {
      case "uppercase":
        return 2;
      case "lowercase":
        return 1;
      case "capitalize":
        return 3;
    }
    return 0;
  }
};
var transform$1 = {
  name: "transform",
  initialValue: "none",
  prefix: true,
  type: 0,
  parse: function(_context, token) {
    if (token.type === 20 && token.value === "none") {
      return null;
    }
    if (token.type === 18) {
      var transformFunction = SUPPORTED_TRANSFORM_FUNCTIONS[token.name];
      if (typeof transformFunction === "undefined") {
        throw new Error('Attempting to parse an unsupported transform function "' + token.name + '"');
      }
      return transformFunction(token.values);
    }
    return null;
  }
};
var matrix = function(args) {
  var values = args.filter(function(arg) {
    return arg.type === 17;
  }).map(function(arg) {
    return arg.number;
  });
  return values.length === 6 ? values : null;
};
var matrix3d = function(args) {
  var values = args.filter(function(arg) {
    return arg.type === 17;
  }).map(function(arg) {
    return arg.number;
  });
  var a1 = values[0], b1 = values[1];
  values[2];
  values[3];
  var a2 = values[4], b2 = values[5];
  values[6];
  values[7];
  values[8];
  values[9];
  values[10];
  values[11];
  var a4 = values[12], b4 = values[13];
  values[14];
  values[15];
  return values.length === 16 ? [a1, b1, a2, b2, a4, b4] : null;
};
var SUPPORTED_TRANSFORM_FUNCTIONS = {
  matrix,
  matrix3d
};
var DEFAULT_VALUE = {
  type: 16,
  number: 50,
  flags: FLAG_INTEGER
};
var DEFAULT = [DEFAULT_VALUE, DEFAULT_VALUE];
var transformOrigin = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: true,
  type: 1,
  parse: function(_context, tokens) {
    var origins = tokens.filter(isLengthPercentage);
    if (origins.length !== 2) {
      return DEFAULT;
    }
    return [origins[0], origins[1]];
  }
};
var visibility = {
  name: "visible",
  initialValue: "none",
  prefix: false,
  type: 2,
  parse: function(_context, visibility2) {
    switch (visibility2) {
      case "hidden":
        return 1;
      case "collapse":
        return 2;
      case "visible":
      default:
        return 0;
    }
  }
};
var WORD_BREAK;
(function(WORD_BREAK2) {
  WORD_BREAK2["NORMAL"] = "normal";
  WORD_BREAK2["BREAK_ALL"] = "break-all";
  WORD_BREAK2["KEEP_ALL"] = "keep-all";
})(WORD_BREAK || (WORD_BREAK = {}));
var wordBreak = {
  name: "word-break",
  initialValue: "normal",
  prefix: false,
  type: 2,
  parse: function(_context, wordBreak2) {
    switch (wordBreak2) {
      case "break-all":
        return WORD_BREAK.BREAK_ALL;
      case "keep-all":
        return WORD_BREAK.KEEP_ALL;
      case "normal":
      default:
        return WORD_BREAK.NORMAL;
    }
  }
};
var zIndex = {
  name: "z-index",
  initialValue: "auto",
  prefix: false,
  type: 0,
  parse: function(_context, token) {
    if (token.type === 20) {
      return { auto: true, order: 0 };
    }
    if (isNumberToken(token)) {
      return { auto: false, order: token.number };
    }
    throw new Error("Invalid z-index number parsed");
  }
};
var time = {
  name: "time",
  parse: function(_context, value) {
    if (value.type === 15) {
      switch (value.unit.toLowerCase()) {
        case "s":
          return 1e3 * value.number;
        case "ms":
          return value.number;
      }
    }
    throw new Error("Unsupported time type");
  }
};
var opacity = {
  name: "opacity",
  initialValue: "1",
  type: 0,
  prefix: false,
  parse: function(_context, token) {
    if (isNumberToken(token)) {
      return token.number;
    }
    return 1;
  }
};
var textDecorationColor = {
  name: "text-decoration-color",
  initialValue: "transparent",
  prefix: false,
  type: 3,
  format: "color"
};
var textDecorationLine = {
  name: "text-decoration-line",
  initialValue: "none",
  prefix: false,
  type: 1,
  parse: function(_context, tokens) {
    return tokens.filter(isIdentToken).map(function(token) {
      switch (token.value) {
        case "underline":
          return 1;
        case "overline":
          return 2;
        case "line-through":
          return 3;
        case "none":
          return 4;
      }
      return 0;
    }).filter(function(line) {
      return line !== 0;
    });
  }
};
var fontFamily = {
  name: "font-family",
  initialValue: "",
  prefix: false,
  type: 1,
  parse: function(_context, tokens) {
    var accumulator = [];
    var results = [];
    tokens.forEach(function(token) {
      switch (token.type) {
        case 20:
        case 0:
          accumulator.push(token.value);
          break;
        case 17:
          accumulator.push(token.number.toString());
          break;
        case 4:
          results.push(accumulator.join(" "));
          accumulator.length = 0;
          break;
      }
    });
    if (accumulator.length) {
      results.push(accumulator.join(" "));
    }
    return results.map(function(result) {
      return result.indexOf(" ") === -1 ? result : "'" + result + "'";
    });
  }
};
var fontSize = {
  name: "font-size",
  initialValue: "0",
  prefix: false,
  type: 3,
  format: "length"
};
var fontWeight = {
  name: "font-weight",
  initialValue: "normal",
  type: 0,
  prefix: false,
  parse: function(_context, token) {
    if (isNumberToken(token)) {
      return token.number;
    }
    if (isIdentToken(token)) {
      switch (token.value) {
        case "bold":
          return 700;
        case "normal":
        default:
          return 400;
      }
    }
    return 400;
  }
};
var fontVariant = {
  name: "font-variant",
  initialValue: "none",
  type: 1,
  prefix: false,
  parse: function(_context, tokens) {
    return tokens.filter(isIdentToken).map(function(token) {
      return token.value;
    });
  }
};
var fontStyle = {
  name: "font-style",
  initialValue: "normal",
  prefix: false,
  type: 2,
  parse: function(_context, overflow2) {
    switch (overflow2) {
      case "oblique":
        return "oblique";
      case "italic":
        return "italic";
      case "normal":
      default:
        return "normal";
    }
  }
};
var contains = function(bit, value) {
  return (bit & value) !== 0;
};
var content = {
  name: "content",
  initialValue: "none",
  type: 1,
  prefix: false,
  parse: function(_context, tokens) {
    if (tokens.length === 0) {
      return [];
    }
    var first = tokens[0];
    if (first.type === 20 && first.value === "none") {
      return [];
    }
    return tokens;
  }
};
var counterIncrement = {
  name: "counter-increment",
  initialValue: "none",
  prefix: true,
  type: 1,
  parse: function(_context, tokens) {
    if (tokens.length === 0) {
      return null;
    }
    var first = tokens[0];
    if (first.type === 20 && first.value === "none") {
      return null;
    }
    var increments = [];
    var filtered = tokens.filter(nonWhiteSpace);
    for (var i = 0; i < filtered.length; i++) {
      var counter = filtered[i];
      var next = filtered[i + 1];
      if (counter.type === 20) {
        var increment = next && isNumberToken(next) ? next.number : 1;
        increments.push({ counter: counter.value, increment });
      }
    }
    return increments;
  }
};
var counterReset = {
  name: "counter-reset",
  initialValue: "none",
  prefix: true,
  type: 1,
  parse: function(_context, tokens) {
    if (tokens.length === 0) {
      return [];
    }
    var resets = [];
    var filtered = tokens.filter(nonWhiteSpace);
    for (var i = 0; i < filtered.length; i++) {
      var counter = filtered[i];
      var next = filtered[i + 1];
      if (isIdentToken(counter) && counter.value !== "none") {
        var reset = next && isNumberToken(next) ? next.number : 0;
        resets.push({ counter: counter.value, reset });
      }
    }
    return resets;
  }
};
var duration = {
  name: "duration",
  initialValue: "0s",
  prefix: false,
  type: 1,
  parse: function(context, tokens) {
    return tokens.filter(isDimensionToken).map(function(token) {
      return time.parse(context, token);
    });
  }
};
var quotes = {
  name: "quotes",
  initialValue: "none",
  prefix: true,
  type: 1,
  parse: function(_context, tokens) {
    if (tokens.length === 0) {
      return null;
    }
    var first = tokens[0];
    if (first.type === 20 && first.value === "none") {
      return null;
    }
    var quotes2 = [];
    var filtered = tokens.filter(isStringToken);
    if (filtered.length % 2 !== 0) {
      return null;
    }
    for (var i = 0; i < filtered.length; i += 2) {
      var open_1 = filtered[i].value;
      var close_1 = filtered[i + 1].value;
      quotes2.push({ open: open_1, close: close_1 });
    }
    return quotes2;
  }
};
var getQuote = function(quotes2, depth, open) {
  if (!quotes2) {
    return "";
  }
  var quote = quotes2[Math.min(depth, quotes2.length - 1)];
  if (!quote) {
    return "";
  }
  return open ? quote.open : quote.close;
};
var boxShadow = {
  name: "box-shadow",
  initialValue: "none",
  type: 1,
  prefix: false,
  parse: function(context, tokens) {
    if (tokens.length === 1 && isIdentWithValue(tokens[0], "none")) {
      return [];
    }
    return parseFunctionArgs(tokens).map(function(values) {
      var shadow = {
        color: 255,
        offsetX: ZERO_LENGTH,
        offsetY: ZERO_LENGTH,
        blur: ZERO_LENGTH,
        spread: ZERO_LENGTH,
        inset: false
      };
      var c = 0;
      for (var i = 0; i < values.length; i++) {
        var token = values[i];
        if (isIdentWithValue(token, "inset")) {
          shadow.inset = true;
        } else if (isLength(token)) {
          if (c === 0) {
            shadow.offsetX = token;
          } else if (c === 1) {
            shadow.offsetY = token;
          } else if (c === 2) {
            shadow.blur = token;
          } else {
            shadow.spread = token;
          }
          c++;
        } else {
          shadow.color = color$1.parse(context, token);
        }
      }
      return shadow;
    });
  }
};
var paintOrder = {
  name: "paint-order",
  initialValue: "normal",
  prefix: false,
  type: 1,
  parse: function(_context, tokens) {
    var DEFAULT_VALUE2 = [
      0,
      1,
      2
      /* MARKERS */
    ];
    var layers = [];
    tokens.filter(isIdentToken).forEach(function(token) {
      switch (token.value) {
        case "stroke":
          layers.push(
            1
            /* STROKE */
          );
          break;
        case "fill":
          layers.push(
            0
            /* FILL */
          );
          break;
        case "markers":
          layers.push(
            2
            /* MARKERS */
          );
          break;
      }
    });
    DEFAULT_VALUE2.forEach(function(value) {
      if (layers.indexOf(value) === -1) {
        layers.push(value);
      }
    });
    return layers;
  }
};
var webkitTextStrokeColor = {
  name: "-webkit-text-stroke-color",
  initialValue: "currentcolor",
  prefix: false,
  type: 3,
  format: "color"
};
var webkitTextStrokeWidth = {
  name: "-webkit-text-stroke-width",
  initialValue: "0",
  type: 0,
  prefix: false,
  parse: function(_context, token) {
    if (isDimensionToken(token)) {
      return token.number;
    }
    return 0;
  }
};
var CSSParsedDeclaration = (
  /** @class */
  function() {
    function CSSParsedDeclaration2(context, declaration) {
      var _a, _b;
      this.animationDuration = parse(context, duration, declaration.animationDuration);
      this.backgroundClip = parse(context, backgroundClip, declaration.backgroundClip);
      this.backgroundColor = parse(context, backgroundColor, declaration.backgroundColor);
      this.backgroundImage = parse(context, backgroundImage, declaration.backgroundImage);
      this.backgroundOrigin = parse(context, backgroundOrigin, declaration.backgroundOrigin);
      this.backgroundPosition = parse(context, backgroundPosition, declaration.backgroundPosition);
      this.backgroundRepeat = parse(context, backgroundRepeat, declaration.backgroundRepeat);
      this.backgroundSize = parse(context, backgroundSize, declaration.backgroundSize);
      this.borderTopColor = parse(context, borderTopColor, declaration.borderTopColor);
      this.borderRightColor = parse(context, borderRightColor, declaration.borderRightColor);
      this.borderBottomColor = parse(context, borderBottomColor, declaration.borderBottomColor);
      this.borderLeftColor = parse(context, borderLeftColor, declaration.borderLeftColor);
      this.borderTopLeftRadius = parse(context, borderTopLeftRadius, declaration.borderTopLeftRadius);
      this.borderTopRightRadius = parse(context, borderTopRightRadius, declaration.borderTopRightRadius);
      this.borderBottomRightRadius = parse(context, borderBottomRightRadius, declaration.borderBottomRightRadius);
      this.borderBottomLeftRadius = parse(context, borderBottomLeftRadius, declaration.borderBottomLeftRadius);
      this.borderTopStyle = parse(context, borderTopStyle, declaration.borderTopStyle);
      this.borderRightStyle = parse(context, borderRightStyle, declaration.borderRightStyle);
      this.borderBottomStyle = parse(context, borderBottomStyle, declaration.borderBottomStyle);
      this.borderLeftStyle = parse(context, borderLeftStyle, declaration.borderLeftStyle);
      this.borderTopWidth = parse(context, borderTopWidth, declaration.borderTopWidth);
      this.borderRightWidth = parse(context, borderRightWidth, declaration.borderRightWidth);
      this.borderBottomWidth = parse(context, borderBottomWidth, declaration.borderBottomWidth);
      this.borderLeftWidth = parse(context, borderLeftWidth, declaration.borderLeftWidth);
      this.boxShadow = parse(context, boxShadow, declaration.boxShadow);
      this.color = parse(context, color, declaration.color);
      this.direction = parse(context, direction, declaration.direction);
      this.display = parse(context, display, declaration.display);
      this.float = parse(context, float, declaration.cssFloat);
      this.fontFamily = parse(context, fontFamily, declaration.fontFamily);
      this.fontSize = parse(context, fontSize, declaration.fontSize);
      this.fontStyle = parse(context, fontStyle, declaration.fontStyle);
      this.fontVariant = parse(context, fontVariant, declaration.fontVariant);
      this.fontWeight = parse(context, fontWeight, declaration.fontWeight);
      this.letterSpacing = parse(context, letterSpacing, declaration.letterSpacing);
      this.lineBreak = parse(context, lineBreak, declaration.lineBreak);
      this.lineHeight = parse(context, lineHeight, declaration.lineHeight);
      this.listStyleImage = parse(context, listStyleImage, declaration.listStyleImage);
      this.listStylePosition = parse(context, listStylePosition, declaration.listStylePosition);
      this.listStyleType = parse(context, listStyleType, declaration.listStyleType);
      this.marginTop = parse(context, marginTop, declaration.marginTop);
      this.marginRight = parse(context, marginRight, declaration.marginRight);
      this.marginBottom = parse(context, marginBottom, declaration.marginBottom);
      this.marginLeft = parse(context, marginLeft, declaration.marginLeft);
      this.opacity = parse(context, opacity, declaration.opacity);
      var overflowTuple = parse(context, overflow, declaration.overflow);
      this.overflowX = overflowTuple[0];
      this.overflowY = overflowTuple[overflowTuple.length > 1 ? 1 : 0];
      this.overflowWrap = parse(context, overflowWrap, declaration.overflowWrap);
      this.paddingTop = parse(context, paddingTop, declaration.paddingTop);
      this.paddingRight = parse(context, paddingRight, declaration.paddingRight);
      this.paddingBottom = parse(context, paddingBottom, declaration.paddingBottom);
      this.paddingLeft = parse(context, paddingLeft, declaration.paddingLeft);
      this.paintOrder = parse(context, paintOrder, declaration.paintOrder);
      this.position = parse(context, position, declaration.position);
      this.textAlign = parse(context, textAlign, declaration.textAlign);
      this.textDecorationColor = parse(context, textDecorationColor, (_a = declaration.textDecorationColor) !== null && _a !== void 0 ? _a : declaration.color);
      this.textDecorationLine = parse(context, textDecorationLine, (_b = declaration.textDecorationLine) !== null && _b !== void 0 ? _b : declaration.textDecoration);
      this.textShadow = parse(context, textShadow, declaration.textShadow);
      this.textTransform = parse(context, textTransform, declaration.textTransform);
      this.transform = parse(context, transform$1, declaration.transform);
      this.transformOrigin = parse(context, transformOrigin, declaration.transformOrigin);
      this.visibility = parse(context, visibility, declaration.visibility);
      this.webkitTextStrokeColor = parse(context, webkitTextStrokeColor, declaration.webkitTextStrokeColor);
      this.webkitTextStrokeWidth = parse(context, webkitTextStrokeWidth, declaration.webkitTextStrokeWidth);
      this.wordBreak = parse(context, wordBreak, declaration.wordBreak);
      this.zIndex = parse(context, zIndex, declaration.zIndex);
    }
    CSSParsedDeclaration2.prototype.isVisible = function() {
      return this.display > 0 && this.opacity > 0 && this.visibility === 0;
    };
    CSSParsedDeclaration2.prototype.isTransparent = function() {
      return isTransparent(this.backgroundColor);
    };
    CSSParsedDeclaration2.prototype.isTransformed = function() {
      return this.transform !== null;
    };
    CSSParsedDeclaration2.prototype.isPositioned = function() {
      return this.position !== 0;
    };
    CSSParsedDeclaration2.prototype.isPositionedWithZIndex = function() {
      return this.isPositioned() && !this.zIndex.auto;
    };
    CSSParsedDeclaration2.prototype.isFloating = function() {
      return this.float !== 0;
    };
    CSSParsedDeclaration2.prototype.isInlineLevel = function() {
      return contains(
        this.display,
        4
        /* INLINE */
      ) || contains(
        this.display,
        33554432
        /* INLINE_BLOCK */
      ) || contains(
        this.display,
        268435456
        /* INLINE_FLEX */
      ) || contains(
        this.display,
        536870912
        /* INLINE_GRID */
      ) || contains(
        this.display,
        67108864
        /* INLINE_LIST_ITEM */
      ) || contains(
        this.display,
        134217728
        /* INLINE_TABLE */
      );
    };
    return CSSParsedDeclaration2;
  }()
);
var CSSParsedPseudoDeclaration = (
  /** @class */
  /* @__PURE__ */ function() {
    function CSSParsedPseudoDeclaration2(context, declaration) {
      this.content = parse(context, content, declaration.content);
      this.quotes = parse(context, quotes, declaration.quotes);
    }
    return CSSParsedPseudoDeclaration2;
  }()
);
var CSSParsedCounterDeclaration = (
  /** @class */
  /* @__PURE__ */ function() {
    function CSSParsedCounterDeclaration2(context, declaration) {
      this.counterIncrement = parse(context, counterIncrement, declaration.counterIncrement);
      this.counterReset = parse(context, counterReset, declaration.counterReset);
    }
    return CSSParsedCounterDeclaration2;
  }()
);
var parse = function(context, descriptor, style) {
  var tokenizer = new Tokenizer();
  var value = style !== null && typeof style !== "undefined" ? style.toString() : descriptor.initialValue;
  tokenizer.write(value);
  var parser = new Parser(tokenizer.read());
  switch (descriptor.type) {
    case 2:
      var token = parser.parseComponentValue();
      return descriptor.parse(context, isIdentToken(token) ? token.value : descriptor.initialValue);
    case 0:
      return descriptor.parse(context, parser.parseComponentValue());
    case 1:
      return descriptor.parse(context, parser.parseComponentValues());
    case 4:
      return parser.parseComponentValue();
    case 3:
      switch (descriptor.format) {
        case "angle":
          return angle.parse(context, parser.parseComponentValue());
        case "color":
          return color$1.parse(context, parser.parseComponentValue());
        case "image":
          return image.parse(context, parser.parseComponentValue());
        case "length":
          var length_1 = parser.parseComponentValue();
          return isLength(length_1) ? length_1 : ZERO_LENGTH;
        case "length-percentage":
          var value_1 = parser.parseComponentValue();
          return isLengthPercentage(value_1) ? value_1 : ZERO_LENGTH;
        case "time":
          return time.parse(context, parser.parseComponentValue());
      }
      break;
  }
};
var elementDebuggerAttribute = "data-html2canvas-debug";
var getElementDebugType = function(element) {
  var attribute = element.getAttribute(elementDebuggerAttribute);
  switch (attribute) {
    case "all":
      return 1;
    case "clone":
      return 2;
    case "parse":
      return 3;
    case "render":
      return 4;
    default:
      return 0;
  }
};
var isDebugging = function(element, type) {
  var elementType = getElementDebugType(element);
  return elementType === 1 || type === elementType;
};
var ElementContainer = (
  /** @class */
  /* @__PURE__ */ function() {
    function ElementContainer2(context, element) {
      this.context = context;
      this.textNodes = [];
      this.elements = [];
      this.flags = 0;
      if (isDebugging(
        element,
        3
        /* PARSE */
      )) {
        debugger;
      }
      this.styles = new CSSParsedDeclaration(context, window.getComputedStyle(element, null));
      if (isHTMLElementNode(element)) {
        if (this.styles.animationDuration.some(function(duration2) {
          return duration2 > 0;
        })) {
          element.style.animationDuration = "0s";
        }
        if (this.styles.transform !== null) {
          element.style.transform = "none";
        }
      }
      this.bounds = parseBounds(this.context, element);
      if (isDebugging(
        element,
        4
        /* RENDER */
      )) {
        this.flags |= 16;
      }
    }
    return ElementContainer2;
  }()
);
var base64 = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=";
var chars$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup$1 = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (var i$1 = 0; i$1 < chars$1.length; i$1++) {
  lookup$1[chars$1.charCodeAt(i$1)] = i$1;
}
var decode = function(base642) {
  var bufferLength = base642.length * 0.75, len = base642.length, i, p2 = 0, encoded1, encoded2, encoded3, encoded4;
  if (base642[base642.length - 1] === "=") {
    bufferLength--;
    if (base642[base642.length - 2] === "=") {
      bufferLength--;
    }
  }
  var buffer2 = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined" && typeof Uint8Array.prototype.slice !== "undefined" ? new ArrayBuffer(bufferLength) : new Array(bufferLength);
  var bytes = Array.isArray(buffer2) ? buffer2 : new Uint8Array(buffer2);
  for (i = 0; i < len; i += 4) {
    encoded1 = lookup$1[base642.charCodeAt(i)];
    encoded2 = lookup$1[base642.charCodeAt(i + 1)];
    encoded3 = lookup$1[base642.charCodeAt(i + 2)];
    encoded4 = lookup$1[base642.charCodeAt(i + 3)];
    bytes[p2++] = encoded1 << 2 | encoded2 >> 4;
    bytes[p2++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[p2++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }
  return buffer2;
};
var polyUint16Array = function(buffer2) {
  var length = buffer2.length;
  var bytes = [];
  for (var i = 0; i < length; i += 2) {
    bytes.push(buffer2[i + 1] << 8 | buffer2[i]);
  }
  return bytes;
};
var polyUint32Array = function(buffer2) {
  var length = buffer2.length;
  var bytes = [];
  for (var i = 0; i < length; i += 4) {
    bytes.push(buffer2[i + 3] << 24 | buffer2[i + 2] << 16 | buffer2[i + 1] << 8 | buffer2[i]);
  }
  return bytes;
};
var UTRIE2_SHIFT_2 = 5;
var UTRIE2_SHIFT_1 = 6 + 5;
var UTRIE2_INDEX_SHIFT = 2;
var UTRIE2_SHIFT_1_2 = UTRIE2_SHIFT_1 - UTRIE2_SHIFT_2;
var UTRIE2_LSCP_INDEX_2_OFFSET = 65536 >> UTRIE2_SHIFT_2;
var UTRIE2_DATA_BLOCK_LENGTH = 1 << UTRIE2_SHIFT_2;
var UTRIE2_DATA_MASK = UTRIE2_DATA_BLOCK_LENGTH - 1;
var UTRIE2_LSCP_INDEX_2_LENGTH = 1024 >> UTRIE2_SHIFT_2;
var UTRIE2_INDEX_2_BMP_LENGTH = UTRIE2_LSCP_INDEX_2_OFFSET + UTRIE2_LSCP_INDEX_2_LENGTH;
var UTRIE2_UTF8_2B_INDEX_2_OFFSET = UTRIE2_INDEX_2_BMP_LENGTH;
var UTRIE2_UTF8_2B_INDEX_2_LENGTH = 2048 >> 6;
var UTRIE2_INDEX_1_OFFSET = UTRIE2_UTF8_2B_INDEX_2_OFFSET + UTRIE2_UTF8_2B_INDEX_2_LENGTH;
var UTRIE2_OMITTED_BMP_INDEX_1_LENGTH = 65536 >> UTRIE2_SHIFT_1;
var UTRIE2_INDEX_2_BLOCK_LENGTH = 1 << UTRIE2_SHIFT_1_2;
var UTRIE2_INDEX_2_MASK = UTRIE2_INDEX_2_BLOCK_LENGTH - 1;
var slice16 = function(view, start, end) {
  if (view.slice) {
    return view.slice(start, end);
  }
  return new Uint16Array(Array.prototype.slice.call(view, start, end));
};
var slice32 = function(view, start, end) {
  if (view.slice) {
    return view.slice(start, end);
  }
  return new Uint32Array(Array.prototype.slice.call(view, start, end));
};
var createTrieFromBase64 = function(base642, _byteLength) {
  var buffer2 = decode(base642);
  var view32 = Array.isArray(buffer2) ? polyUint32Array(buffer2) : new Uint32Array(buffer2);
  var view16 = Array.isArray(buffer2) ? polyUint16Array(buffer2) : new Uint16Array(buffer2);
  var headerLength = 24;
  var index2 = slice16(view16, headerLength / 2, view32[4] / 2);
  var data = view32[5] === 2 ? slice16(view16, (headerLength + view32[4]) / 2) : slice32(view32, Math.ceil((headerLength + view32[4]) / 4));
  return new Trie(view32[0], view32[1], view32[2], view32[3], index2, data);
};
var Trie = (
  /** @class */
  function() {
    function Trie2(initialValue, errorValue, highStart, highValueIndex, index2, data) {
      this.initialValue = initialValue;
      this.errorValue = errorValue;
      this.highStart = highStart;
      this.highValueIndex = highValueIndex;
      this.index = index2;
      this.data = data;
    }
    Trie2.prototype.get = function(codePoint) {
      var ix;
      if (codePoint >= 0) {
        if (codePoint < 55296 || codePoint > 56319 && codePoint <= 65535) {
          ix = this.index[codePoint >> UTRIE2_SHIFT_2];
          ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
          return this.data[ix];
        }
        if (codePoint <= 65535) {
          ix = this.index[UTRIE2_LSCP_INDEX_2_OFFSET + (codePoint - 55296 >> UTRIE2_SHIFT_2)];
          ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
          return this.data[ix];
        }
        if (codePoint < this.highStart) {
          ix = UTRIE2_INDEX_1_OFFSET - UTRIE2_OMITTED_BMP_INDEX_1_LENGTH + (codePoint >> UTRIE2_SHIFT_1);
          ix = this.index[ix];
          ix += codePoint >> UTRIE2_SHIFT_2 & UTRIE2_INDEX_2_MASK;
          ix = this.index[ix];
          ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
          return this.data[ix];
        }
        if (codePoint <= 1114111) {
          return this.data[this.highValueIndex];
        }
      }
      return this.errorValue;
    };
    return Trie2;
  }()
);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (var i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}
var Prepend = 1;
var CR = 2;
var LF = 3;
var Control = 4;
var Extend = 5;
var SpacingMark = 7;
var L = 8;
var V = 9;
var T = 10;
var LV = 11;
var LVT = 12;
var ZWJ = 13;
var Extended_Pictographic = 14;
var RI = 15;
var toCodePoints = function(str) {
  var codePoints = [];
  var i = 0;
  var length = str.length;
  while (i < length) {
    var value = str.charCodeAt(i++);
    if (value >= 55296 && value <= 56319 && i < length) {
      var extra = str.charCodeAt(i++);
      if ((extra & 64512) === 56320) {
        codePoints.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        codePoints.push(value);
        i--;
      }
    } else {
      codePoints.push(value);
    }
  }
  return codePoints;
};
var fromCodePoint = function() {
  var codePoints = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    codePoints[_i] = arguments[_i];
  }
  if (String.fromCodePoint) {
    return String.fromCodePoint.apply(String, codePoints);
  }
  var length = codePoints.length;
  if (!length) {
    return "";
  }
  var codeUnits = [];
  var index2 = -1;
  var result = "";
  while (++index2 < length) {
    var codePoint = codePoints[index2];
    if (codePoint <= 65535) {
      codeUnits.push(codePoint);
    } else {
      codePoint -= 65536;
      codeUnits.push((codePoint >> 10) + 55296, codePoint % 1024 + 56320);
    }
    if (index2 + 1 === length || codeUnits.length > 16384) {
      result += String.fromCharCode.apply(String, codeUnits);
      codeUnits.length = 0;
    }
  }
  return result;
};
var UnicodeTrie = createTrieFromBase64(base64);
var BREAK_NOT_ALLOWED = "×";
var BREAK_ALLOWED = "÷";
var codePointToClass = function(codePoint) {
  return UnicodeTrie.get(codePoint);
};
var _graphemeBreakAtIndex = function(_codePoints, classTypes, index2) {
  var prevIndex = index2 - 2;
  var prev = classTypes[prevIndex];
  var current = classTypes[index2 - 1];
  var next = classTypes[index2];
  if (current === CR && next === LF) {
    return BREAK_NOT_ALLOWED;
  }
  if (current === CR || current === LF || current === Control) {
    return BREAK_ALLOWED;
  }
  if (next === CR || next === LF || next === Control) {
    return BREAK_ALLOWED;
  }
  if (current === L && [L, V, LV, LVT].indexOf(next) !== -1) {
    return BREAK_NOT_ALLOWED;
  }
  if ((current === LV || current === V) && (next === V || next === T)) {
    return BREAK_NOT_ALLOWED;
  }
  if ((current === LVT || current === T) && next === T) {
    return BREAK_NOT_ALLOWED;
  }
  if (next === ZWJ || next === Extend) {
    return BREAK_NOT_ALLOWED;
  }
  if (next === SpacingMark) {
    return BREAK_NOT_ALLOWED;
  }
  if (current === Prepend) {
    return BREAK_NOT_ALLOWED;
  }
  if (current === ZWJ && next === Extended_Pictographic) {
    while (prev === Extend) {
      prev = classTypes[--prevIndex];
    }
    if (prev === Extended_Pictographic) {
      return BREAK_NOT_ALLOWED;
    }
  }
  if (current === RI && next === RI) {
    var countRI = 0;
    while (prev === RI) {
      countRI++;
      prev = classTypes[--prevIndex];
    }
    if (countRI % 2 === 0) {
      return BREAK_NOT_ALLOWED;
    }
  }
  return BREAK_ALLOWED;
};
var GraphemeBreaker = function(str) {
  var codePoints = toCodePoints(str);
  var length = codePoints.length;
  var index2 = 0;
  var lastEnd = 0;
  var classTypes = codePoints.map(codePointToClass);
  return {
    next: function() {
      if (index2 >= length) {
        return { done: true, value: null };
      }
      var graphemeBreak = BREAK_NOT_ALLOWED;
      while (index2 < length && (graphemeBreak = _graphemeBreakAtIndex(codePoints, classTypes, ++index2)) === BREAK_NOT_ALLOWED) {
      }
      if (graphemeBreak !== BREAK_NOT_ALLOWED || index2 === length) {
        var value = fromCodePoint.apply(null, codePoints.slice(lastEnd, index2));
        lastEnd = index2;
        return { value, done: false };
      }
      return { done: true, value: null };
    }
  };
};
var splitGraphemes = function(str) {
  var breaker = GraphemeBreaker(str);
  var graphemes = [];
  var bk;
  while (!(bk = breaker.next()).done) {
    if (bk.value) {
      graphemes.push(bk.value.slice());
    }
  }
  return graphemes;
};
var testRangeBounds = function(document2) {
  var TEST_HEIGHT = 123;
  if (document2.createRange) {
    var range = document2.createRange();
    if (range.getBoundingClientRect) {
      var testElement = document2.createElement("boundtest");
      testElement.style.height = TEST_HEIGHT + "px";
      testElement.style.display = "block";
      document2.body.appendChild(testElement);
      range.selectNode(testElement);
      var rangeBounds = range.getBoundingClientRect();
      var rangeHeight = Math.round(rangeBounds.height);
      document2.body.removeChild(testElement);
      if (rangeHeight === TEST_HEIGHT) {
        return true;
      }
    }
  }
  return false;
};
var testIOSLineBreak = function(document2) {
  var testElement = document2.createElement("boundtest");
  testElement.style.width = "50px";
  testElement.style.display = "block";
  testElement.style.fontSize = "12px";
  testElement.style.letterSpacing = "0px";
  testElement.style.wordSpacing = "0px";
  document2.body.appendChild(testElement);
  var range = document2.createRange();
  testElement.innerHTML = typeof "".repeat === "function" ? "&#128104;".repeat(10) : "";
  var node = testElement.firstChild;
  var textList = toCodePoints$1(node.data).map(function(i) {
    return fromCodePoint$1(i);
  });
  var offset = 0;
  var prev = {};
  var supports = textList.every(function(text, i) {
    range.setStart(node, offset);
    range.setEnd(node, offset + text.length);
    var rect = range.getBoundingClientRect();
    offset += text.length;
    var boundAhead = rect.x > prev.x || rect.y > prev.y;
    prev = rect;
    if (i === 0) {
      return true;
    }
    return boundAhead;
  });
  document2.body.removeChild(testElement);
  return supports;
};
var testCORS = function() {
  return typeof new Image().crossOrigin !== "undefined";
};
var testResponseType = function() {
  return typeof new XMLHttpRequest().responseType === "string";
};
var testSVG = function(document2) {
  var img = new Image();
  var canvas = document2.createElement("canvas");
  var ctx = canvas.getContext("2d");
  if (!ctx) {
    return false;
  }
  img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
  try {
    ctx.drawImage(img, 0, 0);
    canvas.toDataURL();
  } catch (e2) {
    return false;
  }
  return true;
};
var isGreenPixel = function(data) {
  return data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;
};
var testForeignObject = function(document2) {
  var canvas = document2.createElement("canvas");
  var size2 = 100;
  canvas.width = size2;
  canvas.height = size2;
  var ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.reject(false);
  }
  ctx.fillStyle = "rgb(0, 255, 0)";
  ctx.fillRect(0, 0, size2, size2);
  var img = new Image();
  var greenImageSrc = canvas.toDataURL();
  img.src = greenImageSrc;
  var svg = createForeignObjectSVG(size2, size2, 0, 0, img);
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, size2, size2);
  return loadSerializedSVG$1(svg).then(function(img2) {
    ctx.drawImage(img2, 0, 0);
    var data = ctx.getImageData(0, 0, size2, size2).data;
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, size2, size2);
    var node = document2.createElement("div");
    node.style.backgroundImage = "url(" + greenImageSrc + ")";
    node.style.height = size2 + "px";
    return isGreenPixel(data) ? loadSerializedSVG$1(createForeignObjectSVG(size2, size2, 0, 0, node)) : Promise.reject(false);
  }).then(function(img2) {
    ctx.drawImage(img2, 0, 0);
    return isGreenPixel(ctx.getImageData(0, 0, size2, size2).data);
  }).catch(function() {
    return false;
  });
};
var createForeignObjectSVG = function(width, height, x, y, node) {
  var xmlns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(xmlns, "svg");
  var foreignObject = document.createElementNS(xmlns, "foreignObject");
  svg.setAttributeNS(null, "width", width.toString());
  svg.setAttributeNS(null, "height", height.toString());
  foreignObject.setAttributeNS(null, "width", "100%");
  foreignObject.setAttributeNS(null, "height", "100%");
  foreignObject.setAttributeNS(null, "x", x.toString());
  foreignObject.setAttributeNS(null, "y", y.toString());
  foreignObject.setAttributeNS(null, "externalResourcesRequired", "true");
  svg.appendChild(foreignObject);
  foreignObject.appendChild(node);
  return svg;
};
var loadSerializedSVG$1 = function(svg) {
  return new Promise(function(resolve2, reject) {
    var img = new Image();
    img.onload = function() {
      return resolve2(img);
    };
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  });
};
var FEATURES = {
  get SUPPORT_RANGE_BOUNDS() {
    var value = testRangeBounds(document);
    Object.defineProperty(FEATURES, "SUPPORT_RANGE_BOUNDS", { value });
    return value;
  },
  get SUPPORT_WORD_BREAKING() {
    var value = FEATURES.SUPPORT_RANGE_BOUNDS && testIOSLineBreak(document);
    Object.defineProperty(FEATURES, "SUPPORT_WORD_BREAKING", { value });
    return value;
  },
  get SUPPORT_SVG_DRAWING() {
    var value = testSVG(document);
    Object.defineProperty(FEATURES, "SUPPORT_SVG_DRAWING", { value });
    return value;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var value = typeof Array.from === "function" && typeof window.fetch === "function" ? testForeignObject(document) : Promise.resolve(false);
    Object.defineProperty(FEATURES, "SUPPORT_FOREIGNOBJECT_DRAWING", { value });
    return value;
  },
  get SUPPORT_CORS_IMAGES() {
    var value = testCORS();
    Object.defineProperty(FEATURES, "SUPPORT_CORS_IMAGES", { value });
    return value;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var value = testResponseType();
    Object.defineProperty(FEATURES, "SUPPORT_RESPONSE_TYPE", { value });
    return value;
  },
  get SUPPORT_CORS_XHR() {
    var value = "withCredentials" in new XMLHttpRequest();
    Object.defineProperty(FEATURES, "SUPPORT_CORS_XHR", { value });
    return value;
  },
  get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
    var value = !!(typeof Intl !== "undefined" && Intl.Segmenter);
    Object.defineProperty(FEATURES, "SUPPORT_NATIVE_TEXT_SEGMENTATION", { value });
    return value;
  }
};
var TextBounds = (
  /** @class */
  /* @__PURE__ */ function() {
    function TextBounds2(text, bounds) {
      this.text = text;
      this.bounds = bounds;
    }
    return TextBounds2;
  }()
);
var parseTextBounds = function(context, value, styles, node) {
  var textList = breakText(value, styles);
  var textBounds = [];
  var offset = 0;
  textList.forEach(function(text) {
    if (styles.textDecorationLine.length || text.trim().length > 0) {
      if (FEATURES.SUPPORT_RANGE_BOUNDS) {
        var clientRects = createRange(node, offset, text.length).getClientRects();
        if (clientRects.length > 1) {
          var subSegments = segmentGraphemes(text);
          var subOffset_1 = 0;
          subSegments.forEach(function(subSegment) {
            textBounds.push(new TextBounds(subSegment, Bounds.fromDOMRectList(context, createRange(node, subOffset_1 + offset, subSegment.length).getClientRects())));
            subOffset_1 += subSegment.length;
          });
        } else {
          textBounds.push(new TextBounds(text, Bounds.fromDOMRectList(context, clientRects)));
        }
      } else {
        var replacementNode = node.splitText(text.length);
        textBounds.push(new TextBounds(text, getWrapperBounds(context, node)));
        node = replacementNode;
      }
    } else if (!FEATURES.SUPPORT_RANGE_BOUNDS) {
      node = node.splitText(text.length);
    }
    offset += text.length;
  });
  return textBounds;
};
var getWrapperBounds = function(context, node) {
  var ownerDocument = node.ownerDocument;
  if (ownerDocument) {
    var wrapper = ownerDocument.createElement("html2canvaswrapper");
    wrapper.appendChild(node.cloneNode(true));
    var parentNode = node.parentNode;
    if (parentNode) {
      parentNode.replaceChild(wrapper, node);
      var bounds = parseBounds(context, wrapper);
      if (wrapper.firstChild) {
        parentNode.replaceChild(wrapper.firstChild, wrapper);
      }
      return bounds;
    }
  }
  return Bounds.EMPTY;
};
var createRange = function(node, offset, length) {
  var ownerDocument = node.ownerDocument;
  if (!ownerDocument) {
    throw new Error("Node has no owner document");
  }
  var range = ownerDocument.createRange();
  range.setStart(node, offset);
  range.setEnd(node, offset + length);
  return range;
};
var segmentGraphemes = function(value) {
  if (FEATURES.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var segmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
    return Array.from(segmenter.segment(value)).map(function(segment) {
      return segment.segment;
    });
  }
  return splitGraphemes(value);
};
var segmentWords = function(value, styles) {
  if (FEATURES.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var segmenter = new Intl.Segmenter(void 0, {
      granularity: "word"
    });
    return Array.from(segmenter.segment(value)).map(function(segment) {
      return segment.segment;
    });
  }
  return breakWords(value, styles);
};
var breakText = function(value, styles) {
  return styles.letterSpacing !== 0 ? segmentGraphemes(value) : segmentWords(value, styles);
};
var wordSeparators = [32, 160, 4961, 65792, 65793, 4153, 4241];
var breakWords = function(str, styles) {
  var breaker = LineBreaker(str, {
    lineBreak: styles.lineBreak,
    wordBreak: styles.overflowWrap === "break-word" ? "break-word" : styles.wordBreak
  });
  var words = [];
  var bk;
  var _loop_1 = function() {
    if (bk.value) {
      var value = bk.value.slice();
      var codePoints = toCodePoints$1(value);
      var word_1 = "";
      codePoints.forEach(function(codePoint) {
        if (wordSeparators.indexOf(codePoint) === -1) {
          word_1 += fromCodePoint$1(codePoint);
        } else {
          if (word_1.length) {
            words.push(word_1);
          }
          words.push(fromCodePoint$1(codePoint));
          word_1 = "";
        }
      });
      if (word_1.length) {
        words.push(word_1);
      }
    }
  };
  while (!(bk = breaker.next()).done) {
    _loop_1();
  }
  return words;
};
var TextContainer = (
  /** @class */
  /* @__PURE__ */ function() {
    function TextContainer2(context, node, styles) {
      this.text = transform(node.data, styles.textTransform);
      this.textBounds = parseTextBounds(context, this.text, styles, node);
    }
    return TextContainer2;
  }()
);
var transform = function(text, transform2) {
  switch (transform2) {
    case 1:
      return text.toLowerCase();
    case 3:
      return text.replace(CAPITALIZE, capitalize);
    case 2:
      return text.toUpperCase();
    default:
      return text;
  }
};
var CAPITALIZE = /(^|\s|:|-|\(|\))([a-z])/g;
var capitalize = function(m, p1, p2) {
  if (m.length > 0) {
    return p1 + p2.toUpperCase();
  }
  return m;
};
var ImageElementContainer = (
  /** @class */
  function(_super) {
    __extends(ImageElementContainer2, _super);
    function ImageElementContainer2(context, img) {
      var _this = _super.call(this, context, img) || this;
      _this.src = img.currentSrc || img.src;
      _this.intrinsicWidth = img.naturalWidth;
      _this.intrinsicHeight = img.naturalHeight;
      _this.context.cache.addImage(_this.src);
      return _this;
    }
    return ImageElementContainer2;
  }(ElementContainer)
);
var CanvasElementContainer = (
  /** @class */
  function(_super) {
    __extends(CanvasElementContainer2, _super);
    function CanvasElementContainer2(context, canvas) {
      var _this = _super.call(this, context, canvas) || this;
      _this.canvas = canvas;
      _this.intrinsicWidth = canvas.width;
      _this.intrinsicHeight = canvas.height;
      return _this;
    }
    return CanvasElementContainer2;
  }(ElementContainer)
);
var SVGElementContainer = (
  /** @class */
  function(_super) {
    __extends(SVGElementContainer2, _super);
    function SVGElementContainer2(context, img) {
      var _this = _super.call(this, context, img) || this;
      var s = new XMLSerializer();
      var bounds = parseBounds(context, img);
      img.setAttribute("width", bounds.width + "px");
      img.setAttribute("height", bounds.height + "px");
      _this.svg = "data:image/svg+xml," + encodeURIComponent(s.serializeToString(img));
      _this.intrinsicWidth = img.width.baseVal.value;
      _this.intrinsicHeight = img.height.baseVal.value;
      _this.context.cache.addImage(_this.svg);
      return _this;
    }
    return SVGElementContainer2;
  }(ElementContainer)
);
var LIElementContainer = (
  /** @class */
  function(_super) {
    __extends(LIElementContainer2, _super);
    function LIElementContainer2(context, element) {
      var _this = _super.call(this, context, element) || this;
      _this.value = element.value;
      return _this;
    }
    return LIElementContainer2;
  }(ElementContainer)
);
var OLElementContainer = (
  /** @class */
  function(_super) {
    __extends(OLElementContainer2, _super);
    function OLElementContainer2(context, element) {
      var _this = _super.call(this, context, element) || this;
      _this.start = element.start;
      _this.reversed = typeof element.reversed === "boolean" && element.reversed === true;
      return _this;
    }
    return OLElementContainer2;
  }(ElementContainer)
);
var CHECKBOX_BORDER_RADIUS = [
  {
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
  }
];
var RADIO_BORDER_RADIUS = [
  {
    type: 16,
    flags: 0,
    number: 50
  }
];
var reformatInputBounds = function(bounds) {
  if (bounds.width > bounds.height) {
    return new Bounds(bounds.left + (bounds.width - bounds.height) / 2, bounds.top, bounds.height, bounds.height);
  } else if (bounds.width < bounds.height) {
    return new Bounds(bounds.left, bounds.top + (bounds.height - bounds.width) / 2, bounds.width, bounds.width);
  }
  return bounds;
};
var getInputValue = function(node) {
  var value = node.type === PASSWORD ? new Array(node.value.length + 1).join("•") : node.value;
  return value.length === 0 ? node.placeholder || "" : value;
};
var CHECKBOX = "checkbox";
var RADIO = "radio";
var PASSWORD = "password";
var INPUT_COLOR = 707406591;
var InputElementContainer = (
  /** @class */
  function(_super) {
    __extends(InputElementContainer2, _super);
    function InputElementContainer2(context, input) {
      var _this = _super.call(this, context, input) || this;
      _this.type = input.type.toLowerCase();
      _this.checked = input.checked;
      _this.value = getInputValue(input);
      if (_this.type === CHECKBOX || _this.type === RADIO) {
        _this.styles.backgroundColor = 3739148031;
        _this.styles.borderTopColor = _this.styles.borderRightColor = _this.styles.borderBottomColor = _this.styles.borderLeftColor = 2779096575;
        _this.styles.borderTopWidth = _this.styles.borderRightWidth = _this.styles.borderBottomWidth = _this.styles.borderLeftWidth = 1;
        _this.styles.borderTopStyle = _this.styles.borderRightStyle = _this.styles.borderBottomStyle = _this.styles.borderLeftStyle = 1;
        _this.styles.backgroundClip = [
          0
          /* BORDER_BOX */
        ];
        _this.styles.backgroundOrigin = [
          0
          /* BORDER_BOX */
        ];
        _this.bounds = reformatInputBounds(_this.bounds);
      }
      switch (_this.type) {
        case CHECKBOX:
          _this.styles.borderTopRightRadius = _this.styles.borderTopLeftRadius = _this.styles.borderBottomRightRadius = _this.styles.borderBottomLeftRadius = CHECKBOX_BORDER_RADIUS;
          break;
        case RADIO:
          _this.styles.borderTopRightRadius = _this.styles.borderTopLeftRadius = _this.styles.borderBottomRightRadius = _this.styles.borderBottomLeftRadius = RADIO_BORDER_RADIUS;
          break;
      }
      return _this;
    }
    return InputElementContainer2;
  }(ElementContainer)
);
var SelectElementContainer = (
  /** @class */
  function(_super) {
    __extends(SelectElementContainer2, _super);
    function SelectElementContainer2(context, element) {
      var _this = _super.call(this, context, element) || this;
      var option = element.options[element.selectedIndex || 0];
      _this.value = option ? option.text || "" : "";
      return _this;
    }
    return SelectElementContainer2;
  }(ElementContainer)
);
var TextareaElementContainer = (
  /** @class */
  function(_super) {
    __extends(TextareaElementContainer2, _super);
    function TextareaElementContainer2(context, element) {
      var _this = _super.call(this, context, element) || this;
      _this.value = element.value;
      return _this;
    }
    return TextareaElementContainer2;
  }(ElementContainer)
);
var IFrameElementContainer = (
  /** @class */
  function(_super) {
    __extends(IFrameElementContainer2, _super);
    function IFrameElementContainer2(context, iframe) {
      var _this = _super.call(this, context, iframe) || this;
      _this.src = iframe.src;
      _this.width = parseInt(iframe.width, 10) || 0;
      _this.height = parseInt(iframe.height, 10) || 0;
      _this.backgroundColor = _this.styles.backgroundColor;
      try {
        if (iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.documentElement) {
          _this.tree = parseTree(context, iframe.contentWindow.document.documentElement);
          var documentBackgroundColor = iframe.contentWindow.document.documentElement ? parseColor(context, getComputedStyle(iframe.contentWindow.document.documentElement).backgroundColor) : COLORS.TRANSPARENT;
          var bodyBackgroundColor = iframe.contentWindow.document.body ? parseColor(context, getComputedStyle(iframe.contentWindow.document.body).backgroundColor) : COLORS.TRANSPARENT;
          _this.backgroundColor = isTransparent(documentBackgroundColor) ? isTransparent(bodyBackgroundColor) ? _this.styles.backgroundColor : bodyBackgroundColor : documentBackgroundColor;
        }
      } catch (e2) {
      }
      return _this;
    }
    return IFrameElementContainer2;
  }(ElementContainer)
);
var LIST_OWNERS = ["OL", "UL", "MENU"];
var parseNodeTree = function(context, node, parent, root) {
  for (var childNode = node.firstChild, nextNode = void 0; childNode; childNode = nextNode) {
    nextNode = childNode.nextSibling;
    if (isTextNode(childNode) && childNode.data.trim().length > 0) {
      parent.textNodes.push(new TextContainer(context, childNode, parent.styles));
    } else if (isElementNode(childNode)) {
      if (isSlotElement(childNode) && childNode.assignedNodes) {
        childNode.assignedNodes().forEach(function(childNode2) {
          return parseNodeTree(context, childNode2, parent, root);
        });
      } else {
        var container = createContainer(context, childNode);
        if (container.styles.isVisible()) {
          if (createsRealStackingContext(childNode, container, root)) {
            container.flags |= 4;
          } else if (createsStackingContext(container.styles)) {
            container.flags |= 2;
          }
          if (LIST_OWNERS.indexOf(childNode.tagName) !== -1) {
            container.flags |= 8;
          }
          parent.elements.push(container);
          childNode.slot;
          if (childNode.shadowRoot) {
            parseNodeTree(context, childNode.shadowRoot, container, root);
          } else if (!isTextareaElement(childNode) && !isSVGElement(childNode) && !isSelectElement(childNode)) {
            parseNodeTree(context, childNode, container, root);
          }
        }
      }
    }
  }
};
var createContainer = function(context, element) {
  if (isImageElement(element)) {
    return new ImageElementContainer(context, element);
  }
  if (isCanvasElement(element)) {
    return new CanvasElementContainer(context, element);
  }
  if (isSVGElement(element)) {
    return new SVGElementContainer(context, element);
  }
  if (isLIElement(element)) {
    return new LIElementContainer(context, element);
  }
  if (isOLElement(element)) {
    return new OLElementContainer(context, element);
  }
  if (isInputElement(element)) {
    return new InputElementContainer(context, element);
  }
  if (isSelectElement(element)) {
    return new SelectElementContainer(context, element);
  }
  if (isTextareaElement(element)) {
    return new TextareaElementContainer(context, element);
  }
  if (isIFrameElement(element)) {
    return new IFrameElementContainer(context, element);
  }
  return new ElementContainer(context, element);
};
var parseTree = function(context, element) {
  var container = createContainer(context, element);
  container.flags |= 4;
  parseNodeTree(context, element, container, container);
  return container;
};
var createsRealStackingContext = function(node, container, root) {
  return container.styles.isPositionedWithZIndex() || container.styles.opacity < 1 || container.styles.isTransformed() || isBodyElement(node) && root.styles.isTransparent();
};
var createsStackingContext = function(styles) {
  return styles.isPositioned() || styles.isFloating();
};
var isTextNode = function(node) {
  return node.nodeType === Node.TEXT_NODE;
};
var isElementNode = function(node) {
  return node.nodeType === Node.ELEMENT_NODE;
};
var isHTMLElementNode = function(node) {
  return isElementNode(node) && typeof node.style !== "undefined" && !isSVGElementNode(node);
};
var isSVGElementNode = function(element) {
  return typeof element.className === "object";
};
var isLIElement = function(node) {
  return node.tagName === "LI";
};
var isOLElement = function(node) {
  return node.tagName === "OL";
};
var isInputElement = function(node) {
  return node.tagName === "INPUT";
};
var isHTMLElement = function(node) {
  return node.tagName === "HTML";
};
var isSVGElement = function(node) {
  return node.tagName === "svg";
};
var isBodyElement = function(node) {
  return node.tagName === "BODY";
};
var isCanvasElement = function(node) {
  return node.tagName === "CANVAS";
};
var isVideoElement = function(node) {
  return node.tagName === "VIDEO";
};
var isImageElement = function(node) {
  return node.tagName === "IMG";
};
var isIFrameElement = function(node) {
  return node.tagName === "IFRAME";
};
var isStyleElement = function(node) {
  return node.tagName === "STYLE";
};
var isScriptElement = function(node) {
  return node.tagName === "SCRIPT";
};
var isTextareaElement = function(node) {
  return node.tagName === "TEXTAREA";
};
var isSelectElement = function(node) {
  return node.tagName === "SELECT";
};
var isSlotElement = function(node) {
  return node.tagName === "SLOT";
};
var isCustomElement = function(node) {
  return node.tagName.indexOf("-") > 0;
};
var CounterState = (
  /** @class */
  function() {
    function CounterState2() {
      this.counters = {};
    }
    CounterState2.prototype.getCounterValue = function(name) {
      var counter = this.counters[name];
      if (counter && counter.length) {
        return counter[counter.length - 1];
      }
      return 1;
    };
    CounterState2.prototype.getCounterValues = function(name) {
      var counter = this.counters[name];
      return counter ? counter : [];
    };
    CounterState2.prototype.pop = function(counters) {
      var _this = this;
      counters.forEach(function(counter) {
        return _this.counters[counter].pop();
      });
    };
    CounterState2.prototype.parse = function(style) {
      var _this = this;
      var counterIncrement2 = style.counterIncrement;
      var counterReset2 = style.counterReset;
      var canReset = true;
      if (counterIncrement2 !== null) {
        counterIncrement2.forEach(function(entry) {
          var counter = _this.counters[entry.counter];
          if (counter && entry.increment !== 0) {
            canReset = false;
            if (!counter.length) {
              counter.push(1);
            }
            counter[Math.max(0, counter.length - 1)] += entry.increment;
          }
        });
      }
      var counterNames = [];
      if (canReset) {
        counterReset2.forEach(function(entry) {
          var counter = _this.counters[entry.counter];
          counterNames.push(entry.counter);
          if (!counter) {
            counter = _this.counters[entry.counter] = [];
          }
          counter.push(entry.reset);
        });
      }
      return counterNames;
    };
    return CounterState2;
  }()
);
var ROMAN_UPPER = {
  integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
  values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
};
var ARMENIAN = {
  integers: [
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "Ք",
    "Փ",
    "Ւ",
    "Ց",
    "Ր",
    "Տ",
    "Վ",
    "Ս",
    "Ռ",
    "Ջ",
    "Պ",
    "Չ",
    "Ո",
    "Շ",
    "Ն",
    "Յ",
    "Մ",
    "Ճ",
    "Ղ",
    "Ձ",
    "Հ",
    "Կ",
    "Ծ",
    "Խ",
    "Լ",
    "Ի",
    "Ժ",
    "Թ",
    "Ը",
    "Է",
    "Զ",
    "Ե",
    "Դ",
    "Գ",
    "Բ",
    "Ա"
  ]
};
var HEBREW = {
  integers: [
    1e4,
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    19,
    18,
    17,
    16,
    15,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "י׳",
    "ט׳",
    "ח׳",
    "ז׳",
    "ו׳",
    "ה׳",
    "ד׳",
    "ג׳",
    "ב׳",
    "א׳",
    "ת",
    "ש",
    "ר",
    "ק",
    "צ",
    "פ",
    "ע",
    "ס",
    "נ",
    "מ",
    "ל",
    "כ",
    "יט",
    "יח",
    "יז",
    "טז",
    "טו",
    "י",
    "ט",
    "ח",
    "ז",
    "ו",
    "ה",
    "ד",
    "ג",
    "ב",
    "א"
  ]
};
var GEORGIAN = {
  integers: [
    1e4,
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "ჵ",
    "ჰ",
    "ჯ",
    "ჴ",
    "ხ",
    "ჭ",
    "წ",
    "ძ",
    "ც",
    "ჩ",
    "შ",
    "ყ",
    "ღ",
    "ქ",
    "ფ",
    "ჳ",
    "ტ",
    "ს",
    "რ",
    "ჟ",
    "პ",
    "ო",
    "ჲ",
    "ნ",
    "მ",
    "ლ",
    "კ",
    "ი",
    "თ",
    "ჱ",
    "ზ",
    "ვ",
    "ე",
    "დ",
    "გ",
    "ბ",
    "ა"
  ]
};
var createAdditiveCounter = function(value, min, max, symbols, fallback, suffix) {
  if (value < min || value > max) {
    return createCounterText(value, fallback, suffix.length > 0);
  }
  return symbols.integers.reduce(function(string, integer, index2) {
    while (value >= integer) {
      value -= integer;
      string += symbols.values[index2];
    }
    return string;
  }, "") + suffix;
};
var createCounterStyleWithSymbolResolver = function(value, codePointRangeLength, isNumeric, resolver) {
  var string = "";
  do {
    if (!isNumeric) {
      value--;
    }
    string = resolver(value) + string;
    value /= codePointRangeLength;
  } while (value * codePointRangeLength >= codePointRangeLength);
  return string;
};
var createCounterStyleFromRange = function(value, codePointRangeStart, codePointRangeEnd, isNumeric, suffix) {
  var codePointRangeLength = codePointRangeEnd - codePointRangeStart + 1;
  return (value < 0 ? "-" : "") + (createCounterStyleWithSymbolResolver(Math.abs(value), codePointRangeLength, isNumeric, function(codePoint) {
    return fromCodePoint$1(Math.floor(codePoint % codePointRangeLength) + codePointRangeStart);
  }) + suffix);
};
var createCounterStyleFromSymbols = function(value, symbols, suffix) {
  if (suffix === void 0) {
    suffix = ". ";
  }
  var codePointRangeLength = symbols.length;
  return createCounterStyleWithSymbolResolver(Math.abs(value), codePointRangeLength, false, function(codePoint) {
    return symbols[Math.floor(codePoint % codePointRangeLength)];
  }) + suffix;
};
var CJK_ZEROS = 1 << 0;
var CJK_TEN_COEFFICIENTS = 1 << 1;
var CJK_TEN_HIGH_COEFFICIENTS = 1 << 2;
var CJK_HUNDRED_COEFFICIENTS = 1 << 3;
var createCJKCounter = function(value, numbers, multipliers, negativeSign, suffix, flags) {
  if (value < -9999 || value > 9999) {
    return createCounterText(value, 4, suffix.length > 0);
  }
  var tmp = Math.abs(value);
  var string = suffix;
  if (tmp === 0) {
    return numbers[0] + string;
  }
  for (var digit = 0; tmp > 0 && digit <= 4; digit++) {
    var coefficient = tmp % 10;
    if (coefficient === 0 && contains(flags, CJK_ZEROS) && string !== "") {
      string = numbers[coefficient] + string;
    } else if (coefficient > 1 || coefficient === 1 && digit === 0 || coefficient === 1 && digit === 1 && contains(flags, CJK_TEN_COEFFICIENTS) || coefficient === 1 && digit === 1 && contains(flags, CJK_TEN_HIGH_COEFFICIENTS) && value > 100 || coefficient === 1 && digit > 1 && contains(flags, CJK_HUNDRED_COEFFICIENTS)) {
      string = numbers[coefficient] + (digit > 0 ? multipliers[digit - 1] : "") + string;
    } else if (coefficient === 1 && digit > 0) {
      string = multipliers[digit - 1] + string;
    }
    tmp = Math.floor(tmp / 10);
  }
  return (value < 0 ? negativeSign : "") + string;
};
var CHINESE_INFORMAL_MULTIPLIERS = "十百千萬";
var CHINESE_FORMAL_MULTIPLIERS = "拾佰仟萬";
var JAPANESE_NEGATIVE = "マイナス";
var KOREAN_NEGATIVE = "마이너스";
var createCounterText = function(value, type, appendSuffix) {
  var defaultSuffix = appendSuffix ? ". " : "";
  var cjkSuffix = appendSuffix ? "、" : "";
  var koreanSuffix = appendSuffix ? ", " : "";
  var spaceSuffix = appendSuffix ? " " : "";
  switch (type) {
    case 0:
      return "•" + spaceSuffix;
    case 1:
      return "◦" + spaceSuffix;
    case 2:
      return "◾" + spaceSuffix;
    case 5:
      var string = createCounterStyleFromRange(value, 48, 57, true, defaultSuffix);
      return string.length < 4 ? "0" + string : string;
    case 4:
      return createCounterStyleFromSymbols(value, "〇一二三四五六七八九", cjkSuffix);
    case 6:
      return createAdditiveCounter(value, 1, 3999, ROMAN_UPPER, 3, defaultSuffix).toLowerCase();
    case 7:
      return createAdditiveCounter(value, 1, 3999, ROMAN_UPPER, 3, defaultSuffix);
    case 8:
      return createCounterStyleFromRange(value, 945, 969, false, defaultSuffix);
    case 9:
      return createCounterStyleFromRange(value, 97, 122, false, defaultSuffix);
    case 10:
      return createCounterStyleFromRange(value, 65, 90, false, defaultSuffix);
    case 11:
      return createCounterStyleFromRange(value, 1632, 1641, true, defaultSuffix);
    case 12:
    case 49:
      return createAdditiveCounter(value, 1, 9999, ARMENIAN, 3, defaultSuffix);
    case 35:
      return createAdditiveCounter(value, 1, 9999, ARMENIAN, 3, defaultSuffix).toLowerCase();
    case 13:
      return createCounterStyleFromRange(value, 2534, 2543, true, defaultSuffix);
    case 14:
    case 30:
      return createCounterStyleFromRange(value, 6112, 6121, true, defaultSuffix);
    case 15:
      return createCounterStyleFromSymbols(value, "子丑寅卯辰巳午未申酉戌亥", cjkSuffix);
    case 16:
      return createCounterStyleFromSymbols(value, "甲乙丙丁戊己庚辛壬癸", cjkSuffix);
    case 17:
    case 48:
      return createCJKCounter(value, "零一二三四五六七八九", CHINESE_INFORMAL_MULTIPLIERS, "負", cjkSuffix, CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
    case 47:
      return createCJKCounter(value, "零壹貳參肆伍陸柒捌玖", CHINESE_FORMAL_MULTIPLIERS, "負", cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
    case 42:
      return createCJKCounter(value, "零一二三四五六七八九", CHINESE_INFORMAL_MULTIPLIERS, "负", cjkSuffix, CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
    case 41:
      return createCJKCounter(value, "零壹贰叁肆伍陆柒捌玖", CHINESE_FORMAL_MULTIPLIERS, "负", cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
    case 26:
      return createCJKCounter(value, "〇一二三四五六七八九", "十百千万", JAPANESE_NEGATIVE, cjkSuffix, 0);
    case 25:
      return createCJKCounter(value, "零壱弐参四伍六七八九", "拾百千万", JAPANESE_NEGATIVE, cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
    case 31:
      return createCJKCounter(value, "영일이삼사오육칠팔구", "십백천만", KOREAN_NEGATIVE, koreanSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
    case 33:
      return createCJKCounter(value, "零一二三四五六七八九", "十百千萬", KOREAN_NEGATIVE, koreanSuffix, 0);
    case 32:
      return createCJKCounter(value, "零壹貳參四五六七八九", "拾百千", KOREAN_NEGATIVE, koreanSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
    case 18:
      return createCounterStyleFromRange(value, 2406, 2415, true, defaultSuffix);
    case 20:
      return createAdditiveCounter(value, 1, 19999, GEORGIAN, 3, defaultSuffix);
    case 21:
      return createCounterStyleFromRange(value, 2790, 2799, true, defaultSuffix);
    case 22:
      return createCounterStyleFromRange(value, 2662, 2671, true, defaultSuffix);
    case 22:
      return createAdditiveCounter(value, 1, 10999, HEBREW, 3, defaultSuffix);
    case 23:
      return createCounterStyleFromSymbols(value, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
    case 24:
      return createCounterStyleFromSymbols(value, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
    case 27:
      return createCounterStyleFromRange(value, 3302, 3311, true, defaultSuffix);
    case 28:
      return createCounterStyleFromSymbols(value, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", cjkSuffix);
    case 29:
      return createCounterStyleFromSymbols(value, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", cjkSuffix);
    case 34:
      return createCounterStyleFromRange(value, 3792, 3801, true, defaultSuffix);
    case 37:
      return createCounterStyleFromRange(value, 6160, 6169, true, defaultSuffix);
    case 38:
      return createCounterStyleFromRange(value, 4160, 4169, true, defaultSuffix);
    case 39:
      return createCounterStyleFromRange(value, 2918, 2927, true, defaultSuffix);
    case 40:
      return createCounterStyleFromRange(value, 1776, 1785, true, defaultSuffix);
    case 43:
      return createCounterStyleFromRange(value, 3046, 3055, true, defaultSuffix);
    case 44:
      return createCounterStyleFromRange(value, 3174, 3183, true, defaultSuffix);
    case 45:
      return createCounterStyleFromRange(value, 3664, 3673, true, defaultSuffix);
    case 46:
      return createCounterStyleFromRange(value, 3872, 3881, true, defaultSuffix);
    case 3:
    default:
      return createCounterStyleFromRange(value, 48, 57, true, defaultSuffix);
  }
};
var IGNORE_ATTRIBUTE = "data-html2canvas-ignore";
var DocumentCloner = (
  /** @class */
  function() {
    function DocumentCloner2(context, element, options) {
      this.context = context;
      this.options = options;
      this.scrolledElements = [];
      this.referenceElement = element;
      this.counters = new CounterState();
      this.quoteDepth = 0;
      if (!element.ownerDocument) {
        throw new Error("Cloned element does not have an owner document");
      }
      this.documentElement = this.cloneNode(element.ownerDocument.documentElement, false);
    }
    DocumentCloner2.prototype.toIFrame = function(ownerDocument, windowSize) {
      var _this = this;
      var iframe = createIFrameContainer(ownerDocument, windowSize);
      if (!iframe.contentWindow) {
        return Promise.reject("Unable to find iframe window");
      }
      var scrollX = ownerDocument.defaultView.pageXOffset;
      var scrollY = ownerDocument.defaultView.pageYOffset;
      var cloneWindow = iframe.contentWindow;
      var documentClone = cloneWindow.document;
      var iframeLoad = iframeLoader(iframe).then(function() {
        return __awaiter(_this, void 0, void 0, function() {
          var onclone, referenceElement;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                this.scrolledElements.forEach(restoreNodeScroll);
                if (cloneWindow) {
                  cloneWindow.scrollTo(windowSize.left, windowSize.top);
                  if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (cloneWindow.scrollY !== windowSize.top || cloneWindow.scrollX !== windowSize.left)) {
                    this.context.logger.warn("Unable to restore scroll position for cloned document");
                    this.context.windowBounds = this.context.windowBounds.add(cloneWindow.scrollX - windowSize.left, cloneWindow.scrollY - windowSize.top, 0, 0);
                  }
                }
                onclone = this.options.onclone;
                referenceElement = this.clonedReferenceElement;
                if (typeof referenceElement === "undefined") {
                  return [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")];
                }
                if (!(documentClone.fonts && documentClone.fonts.ready))
                  return [3, 2];
                return [4, documentClone.fonts.ready];
              case 1:
                _a.sent();
                _a.label = 2;
              case 2:
                if (!/(AppleWebKit)/g.test(navigator.userAgent))
                  return [3, 4];
                return [4, imagesReady(documentClone)];
              case 3:
                _a.sent();
                _a.label = 4;
              case 4:
                if (typeof onclone === "function") {
                  return [2, Promise.resolve().then(function() {
                    return onclone(documentClone, referenceElement);
                  }).then(function() {
                    return iframe;
                  })];
                }
                return [2, iframe];
            }
          });
        });
      });
      documentClone.open();
      documentClone.write(serializeDoctype(document.doctype) + "<html></html>");
      restoreOwnerScroll(this.referenceElement.ownerDocument, scrollX, scrollY);
      documentClone.replaceChild(documentClone.adoptNode(this.documentElement), documentClone.documentElement);
      documentClone.close();
      return iframeLoad;
    };
    DocumentCloner2.prototype.createElementClone = function(node) {
      if (isDebugging(
        node,
        2
        /* CLONE */
      )) {
        debugger;
      }
      if (isCanvasElement(node)) {
        return this.createCanvasClone(node);
      }
      if (isVideoElement(node)) {
        return this.createVideoClone(node);
      }
      if (isStyleElement(node)) {
        return this.createStyleClone(node);
      }
      var clone2 = node.cloneNode(false);
      if (isImageElement(clone2)) {
        if (isImageElement(node) && node.currentSrc && node.currentSrc !== node.src) {
          clone2.src = node.currentSrc;
          clone2.srcset = "";
        }
        if (clone2.loading === "lazy") {
          clone2.loading = "eager";
        }
      }
      if (isCustomElement(clone2)) {
        return this.createCustomElementClone(clone2);
      }
      return clone2;
    };
    DocumentCloner2.prototype.createCustomElementClone = function(node) {
      var clone2 = document.createElement("html2canvascustomelement");
      copyCSSStyles(node.style, clone2);
      return clone2;
    };
    DocumentCloner2.prototype.createStyleClone = function(node) {
      try {
        var sheet = node.sheet;
        if (sheet && sheet.cssRules) {
          var css = [].slice.call(sheet.cssRules, 0).reduce(function(css2, rule) {
            if (rule && typeof rule.cssText === "string") {
              return css2 + rule.cssText;
            }
            return css2;
          }, "");
          var style = node.cloneNode(false);
          style.textContent = css;
          return style;
        }
      } catch (e2) {
        this.context.logger.error("Unable to access cssRules property", e2);
        if (e2.name !== "SecurityError") {
          throw e2;
        }
      }
      return node.cloneNode(false);
    };
    DocumentCloner2.prototype.createCanvasClone = function(canvas) {
      var _a;
      if (this.options.inlineImages && canvas.ownerDocument) {
        var img = canvas.ownerDocument.createElement("img");
        try {
          img.src = canvas.toDataURL();
          return img;
        } catch (e2) {
          this.context.logger.info("Unable to inline canvas contents, canvas is tainted", canvas);
        }
      }
      var clonedCanvas = canvas.cloneNode(false);
      try {
        clonedCanvas.width = canvas.width;
        clonedCanvas.height = canvas.height;
        var ctx = canvas.getContext("2d");
        var clonedCtx = clonedCanvas.getContext("2d");
        if (clonedCtx) {
          if (!this.options.allowTaint && ctx) {
            clonedCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
          } else {
            var gl = (_a = canvas.getContext("webgl2")) !== null && _a !== void 0 ? _a : canvas.getContext("webgl");
            if (gl) {
              var attribs = gl.getContextAttributes();
              if ((attribs === null || attribs === void 0 ? void 0 : attribs.preserveDrawingBuffer) === false) {
                this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false", canvas);
              }
            }
            clonedCtx.drawImage(canvas, 0, 0);
          }
        }
        return clonedCanvas;
      } catch (e2) {
        this.context.logger.info("Unable to clone canvas as it is tainted", canvas);
      }
      return clonedCanvas;
    };
    DocumentCloner2.prototype.createVideoClone = function(video) {
      var canvas = video.ownerDocument.createElement("canvas");
      canvas.width = video.offsetWidth;
      canvas.height = video.offsetHeight;
      var ctx = canvas.getContext("2d");
      try {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (!this.options.allowTaint) {
            ctx.getImageData(0, 0, canvas.width, canvas.height);
          }
        }
        return canvas;
      } catch (e2) {
        this.context.logger.info("Unable to clone video as it is tainted", video);
      }
      var blankCanvas = video.ownerDocument.createElement("canvas");
      blankCanvas.width = video.offsetWidth;
      blankCanvas.height = video.offsetHeight;
      return blankCanvas;
    };
    DocumentCloner2.prototype.appendChildNode = function(clone2, child, copyStyles) {
      if (!isElementNode(child) || !isScriptElement(child) && !child.hasAttribute(IGNORE_ATTRIBUTE) && (typeof this.options.ignoreElements !== "function" || !this.options.ignoreElements(child))) {
        if (!this.options.copyStyles || !isElementNode(child) || !isStyleElement(child)) {
          clone2.appendChild(this.cloneNode(child, copyStyles));
        }
      }
    };
    DocumentCloner2.prototype.cloneChildNodes = function(node, clone2, copyStyles) {
      var _this = this;
      for (var child = node.shadowRoot ? node.shadowRoot.firstChild : node.firstChild; child; child = child.nextSibling) {
        if (isElementNode(child) && isSlotElement(child) && typeof child.assignedNodes === "function") {
          var assignedNodes = child.assignedNodes();
          if (assignedNodes.length) {
            assignedNodes.forEach(function(assignedNode) {
              return _this.appendChildNode(clone2, assignedNode, copyStyles);
            });
          }
        } else {
          this.appendChildNode(clone2, child, copyStyles);
        }
      }
    };
    DocumentCloner2.prototype.cloneNode = function(node, copyStyles) {
      if (isTextNode(node)) {
        return document.createTextNode(node.data);
      }
      if (!node.ownerDocument) {
        return node.cloneNode(false);
      }
      var window2 = node.ownerDocument.defaultView;
      if (window2 && isElementNode(node) && (isHTMLElementNode(node) || isSVGElementNode(node))) {
        var clone2 = this.createElementClone(node);
        clone2.style.transitionProperty = "none";
        var style = window2.getComputedStyle(node);
        var styleBefore = window2.getComputedStyle(node, ":before");
        var styleAfter = window2.getComputedStyle(node, ":after");
        if (this.referenceElement === node && isHTMLElementNode(clone2)) {
          this.clonedReferenceElement = clone2;
        }
        if (isBodyElement(clone2)) {
          createPseudoHideStyles(clone2);
        }
        var counters = this.counters.parse(new CSSParsedCounterDeclaration(this.context, style));
        var before = this.resolvePseudoContent(node, clone2, styleBefore, PseudoElementType.BEFORE);
        if (isCustomElement(node)) {
          copyStyles = true;
        }
        if (!isVideoElement(node)) {
          this.cloneChildNodes(node, clone2, copyStyles);
        }
        if (before) {
          clone2.insertBefore(before, clone2.firstChild);
        }
        var after = this.resolvePseudoContent(node, clone2, styleAfter, PseudoElementType.AFTER);
        if (after) {
          clone2.appendChild(after);
        }
        this.counters.pop(counters);
        if (style && (this.options.copyStyles || isSVGElementNode(node)) && !isIFrameElement(node) || copyStyles) {
          copyCSSStyles(style, clone2);
        }
        if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
          this.scrolledElements.push([clone2, node.scrollLeft, node.scrollTop]);
        }
        if ((isTextareaElement(node) || isSelectElement(node)) && (isTextareaElement(clone2) || isSelectElement(clone2))) {
          clone2.value = node.value;
        }
        return clone2;
      }
      return node.cloneNode(false);
    };
    DocumentCloner2.prototype.resolvePseudoContent = function(node, clone2, style, pseudoElt) {
      var _this = this;
      if (!style) {
        return;
      }
      var value = style.content;
      var document2 = clone2.ownerDocument;
      if (!document2 || !value || value === "none" || value === "-moz-alt-content" || style.display === "none") {
        return;
      }
      this.counters.parse(new CSSParsedCounterDeclaration(this.context, style));
      var declaration = new CSSParsedPseudoDeclaration(this.context, style);
      var anonymousReplacedElement = document2.createElement("html2canvaspseudoelement");
      copyCSSStyles(style, anonymousReplacedElement);
      declaration.content.forEach(function(token) {
        if (token.type === 0) {
          anonymousReplacedElement.appendChild(document2.createTextNode(token.value));
        } else if (token.type === 22) {
          var img = document2.createElement("img");
          img.src = token.value;
          img.style.opacity = "1";
          anonymousReplacedElement.appendChild(img);
        } else if (token.type === 18) {
          if (token.name === "attr") {
            var attr = token.values.filter(isIdentToken);
            if (attr.length) {
              anonymousReplacedElement.appendChild(document2.createTextNode(node.getAttribute(attr[0].value) || ""));
            }
          } else if (token.name === "counter") {
            var _a = token.values.filter(nonFunctionArgSeparator), counter = _a[0], counterStyle = _a[1];
            if (counter && isIdentToken(counter)) {
              var counterState = _this.counters.getCounterValue(counter.value);
              var counterType = counterStyle && isIdentToken(counterStyle) ? listStyleType.parse(_this.context, counterStyle.value) : 3;
              anonymousReplacedElement.appendChild(document2.createTextNode(createCounterText(counterState, counterType, false)));
            }
          } else if (token.name === "counters") {
            var _b = token.values.filter(nonFunctionArgSeparator), counter = _b[0], delim = _b[1], counterStyle = _b[2];
            if (counter && isIdentToken(counter)) {
              var counterStates = _this.counters.getCounterValues(counter.value);
              var counterType_1 = counterStyle && isIdentToken(counterStyle) ? listStyleType.parse(_this.context, counterStyle.value) : 3;
              var separator = delim && delim.type === 0 ? delim.value : "";
              var text = counterStates.map(function(value2) {
                return createCounterText(value2, counterType_1, false);
              }).join(separator);
              anonymousReplacedElement.appendChild(document2.createTextNode(text));
            }
          } else
            ;
        } else if (token.type === 20) {
          switch (token.value) {
            case "open-quote":
              anonymousReplacedElement.appendChild(document2.createTextNode(getQuote(declaration.quotes, _this.quoteDepth++, true)));
              break;
            case "close-quote":
              anonymousReplacedElement.appendChild(document2.createTextNode(getQuote(declaration.quotes, --_this.quoteDepth, false)));
              break;
            default:
              anonymousReplacedElement.appendChild(document2.createTextNode(token.value));
          }
        }
      });
      anonymousReplacedElement.className = PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
      var newClassName = pseudoElt === PseudoElementType.BEFORE ? " " + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE : " " + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
      if (isSVGElementNode(clone2)) {
        clone2.className.baseValue += newClassName;
      } else {
        clone2.className += newClassName;
      }
      return anonymousReplacedElement;
    };
    DocumentCloner2.destroy = function(container) {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
        return true;
      }
      return false;
    };
    return DocumentCloner2;
  }()
);
var PseudoElementType;
(function(PseudoElementType2) {
  PseudoElementType2[PseudoElementType2["BEFORE"] = 0] = "BEFORE";
  PseudoElementType2[PseudoElementType2["AFTER"] = 1] = "AFTER";
})(PseudoElementType || (PseudoElementType = {}));
var createIFrameContainer = function(ownerDocument, bounds) {
  var cloneIframeContainer = ownerDocument.createElement("iframe");
  cloneIframeContainer.className = "html2canvas-container";
  cloneIframeContainer.style.visibility = "hidden";
  cloneIframeContainer.style.position = "fixed";
  cloneIframeContainer.style.left = "-10000px";
  cloneIframeContainer.style.top = "0px";
  cloneIframeContainer.style.border = "0";
  cloneIframeContainer.width = bounds.width.toString();
  cloneIframeContainer.height = bounds.height.toString();
  cloneIframeContainer.scrolling = "no";
  cloneIframeContainer.setAttribute(IGNORE_ATTRIBUTE, "true");
  ownerDocument.body.appendChild(cloneIframeContainer);
  return cloneIframeContainer;
};
var imageReady = function(img) {
  return new Promise(function(resolve2) {
    if (img.complete) {
      resolve2();
      return;
    }
    if (!img.src) {
      resolve2();
      return;
    }
    img.onload = resolve2;
    img.onerror = resolve2;
  });
};
var imagesReady = function(document2) {
  return Promise.all([].slice.call(document2.images, 0).map(imageReady));
};
var iframeLoader = function(iframe) {
  return new Promise(function(resolve2, reject) {
    var cloneWindow = iframe.contentWindow;
    if (!cloneWindow) {
      return reject("No window assigned for iframe");
    }
    var documentClone = cloneWindow.document;
    cloneWindow.onload = iframe.onload = function() {
      cloneWindow.onload = iframe.onload = null;
      var interval = setInterval(function() {
        if (documentClone.body.childNodes.length > 0 && documentClone.readyState === "complete") {
          clearInterval(interval);
          resolve2(iframe);
        }
      }, 50);
    };
  });
};
var ignoredStyleProperties = [
  "all",
  "d",
  "content"
  // Safari shows pseudoelements if content is set
];
var copyCSSStyles = function(style, target) {
  for (var i = style.length - 1; i >= 0; i--) {
    var property = style.item(i);
    if (ignoredStyleProperties.indexOf(property) === -1) {
      target.style.setProperty(property, style.getPropertyValue(property));
    }
  }
  return target;
};
var serializeDoctype = function(doctype) {
  var str = "";
  if (doctype) {
    str += "<!DOCTYPE ";
    if (doctype.name) {
      str += doctype.name;
    }
    if (doctype.internalSubset) {
      str += doctype.internalSubset;
    }
    if (doctype.publicId) {
      str += '"' + doctype.publicId + '"';
    }
    if (doctype.systemId) {
      str += '"' + doctype.systemId + '"';
    }
    str += ">";
  }
  return str;
};
var restoreOwnerScroll = function(ownerDocument, x, y) {
  if (ownerDocument && ownerDocument.defaultView && (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
    ownerDocument.defaultView.scrollTo(x, y);
  }
};
var restoreNodeScroll = function(_a) {
  var element = _a[0], x = _a[1], y = _a[2];
  element.scrollLeft = x;
  element.scrollTop = y;
};
var PSEUDO_BEFORE = ":before";
var PSEUDO_AFTER = ":after";
var PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before";
var PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after";
var PSEUDO_HIDE_ELEMENT_STYLE = '{\n    content: "" !important;\n    display: none !important;\n}';
var createPseudoHideStyles = function(body) {
  createStyles(body, "." + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + PSEUDO_BEFORE + PSEUDO_HIDE_ELEMENT_STYLE + "\n         ." + PSEUDO_HIDE_ELEMENT_CLASS_AFTER + PSEUDO_AFTER + PSEUDO_HIDE_ELEMENT_STYLE);
};
var createStyles = function(body, styles) {
  var document2 = body.ownerDocument;
  if (document2) {
    var style = document2.createElement("style");
    style.textContent = styles;
    body.appendChild(style);
  }
};
var CacheStorage = (
  /** @class */
  function() {
    function CacheStorage2() {
    }
    CacheStorage2.getOrigin = function(url) {
      var link = CacheStorage2._link;
      if (!link) {
        return "about:blank";
      }
      link.href = url;
      link.href = link.href;
      return link.protocol + link.hostname + link.port;
    };
    CacheStorage2.isSameOrigin = function(src) {
      return CacheStorage2.getOrigin(src) === CacheStorage2._origin;
    };
    CacheStorage2.setContext = function(window2) {
      CacheStorage2._link = window2.document.createElement("a");
      CacheStorage2._origin = CacheStorage2.getOrigin(window2.location.href);
    };
    CacheStorage2._origin = "about:blank";
    return CacheStorage2;
  }()
);
var Cache = (
  /** @class */
  function() {
    function Cache2(context, _options) {
      this.context = context;
      this._options = _options;
      this._cache = {};
    }
    Cache2.prototype.addImage = function(src) {
      var result = Promise.resolve();
      if (this.has(src)) {
        return result;
      }
      if (isBlobImage(src) || isRenderable(src)) {
        (this._cache[src] = this.loadImage(src)).catch(function() {
        });
        return result;
      }
      return result;
    };
    Cache2.prototype.match = function(src) {
      return this._cache[src];
    };
    Cache2.prototype.loadImage = function(key) {
      return __awaiter(this, void 0, void 0, function() {
        var isSameOrigin, useCORS, useProxy, src;
        var _this = this;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              isSameOrigin = CacheStorage.isSameOrigin(key);
              useCORS = !isInlineImage(key) && this._options.useCORS === true && FEATURES.SUPPORT_CORS_IMAGES && !isSameOrigin;
              useProxy = !isInlineImage(key) && !isSameOrigin && !isBlobImage(key) && typeof this._options.proxy === "string" && FEATURES.SUPPORT_CORS_XHR && !useCORS;
              if (!isSameOrigin && this._options.allowTaint === false && !isInlineImage(key) && !isBlobImage(key) && !useProxy && !useCORS) {
                return [
                  2
                  /*return*/
                ];
              }
              src = key;
              if (!useProxy)
                return [3, 2];
              return [4, this.proxy(src)];
            case 1:
              src = _a.sent();
              _a.label = 2;
            case 2:
              this.context.logger.debug("Added image " + key.substring(0, 256));
              return [4, new Promise(function(resolve2, reject) {
                var img = new Image();
                img.onload = function() {
                  return resolve2(img);
                };
                img.onerror = reject;
                if (isInlineBase64Image(src) || useCORS) {
                  img.crossOrigin = "anonymous";
                }
                img.src = src;
                if (img.complete === true) {
                  setTimeout(function() {
                    return resolve2(img);
                  }, 500);
                }
                if (_this._options.imageTimeout > 0) {
                  setTimeout(function() {
                    return reject("Timed out (" + _this._options.imageTimeout + "ms) loading image");
                  }, _this._options.imageTimeout);
                }
              })];
            case 3:
              return [2, _a.sent()];
          }
        });
      });
    };
    Cache2.prototype.has = function(key) {
      return typeof this._cache[key] !== "undefined";
    };
    Cache2.prototype.keys = function() {
      return Promise.resolve(Object.keys(this._cache));
    };
    Cache2.prototype.proxy = function(src) {
      var _this = this;
      var proxy = this._options.proxy;
      if (!proxy) {
        throw new Error("No proxy defined");
      }
      var key = src.substring(0, 256);
      return new Promise(function(resolve2, reject) {
        var responseType = FEATURES.SUPPORT_RESPONSE_TYPE ? "blob" : "text";
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          if (xhr.status === 200) {
            if (responseType === "text") {
              resolve2(xhr.response);
            } else {
              var reader_1 = new FileReader();
              reader_1.addEventListener("load", function() {
                return resolve2(reader_1.result);
              }, false);
              reader_1.addEventListener("error", function(e2) {
                return reject(e2);
              }, false);
              reader_1.readAsDataURL(xhr.response);
            }
          } else {
            reject("Failed to proxy resource " + key + " with status code " + xhr.status);
          }
        };
        xhr.onerror = reject;
        var queryString = proxy.indexOf("?") > -1 ? "&" : "?";
        xhr.open("GET", "" + proxy + queryString + "url=" + encodeURIComponent(src) + "&responseType=" + responseType);
        if (responseType !== "text" && xhr instanceof XMLHttpRequest) {
          xhr.responseType = responseType;
        }
        if (_this._options.imageTimeout) {
          var timeout_1 = _this._options.imageTimeout;
          xhr.timeout = timeout_1;
          xhr.ontimeout = function() {
            return reject("Timed out (" + timeout_1 + "ms) proxying " + key);
          };
        }
        xhr.send();
      });
    };
    return Cache2;
  }()
);
var INLINE_SVG = /^data:image\/svg\+xml/i;
var INLINE_BASE64 = /^data:image\/.*;base64,/i;
var INLINE_IMG = /^data:image\/.*/i;
var isRenderable = function(src) {
  return FEATURES.SUPPORT_SVG_DRAWING || !isSVG(src);
};
var isInlineImage = function(src) {
  return INLINE_IMG.test(src);
};
var isInlineBase64Image = function(src) {
  return INLINE_BASE64.test(src);
};
var isBlobImage = function(src) {
  return src.substr(0, 4) === "blob";
};
var isSVG = function(src) {
  return src.substr(-3).toLowerCase() === "svg" || INLINE_SVG.test(src);
};
var Vector = (
  /** @class */
  function() {
    function Vector2(x, y) {
      this.type = 0;
      this.x = x;
      this.y = y;
    }
    Vector2.prototype.add = function(deltaX, deltaY) {
      return new Vector2(this.x + deltaX, this.y + deltaY);
    };
    return Vector2;
  }()
);
var lerp = function(a2, b, t2) {
  return new Vector(a2.x + (b.x - a2.x) * t2, a2.y + (b.y - a2.y) * t2);
};
var BezierCurve = (
  /** @class */
  function() {
    function BezierCurve2(start, startControl, endControl, end) {
      this.type = 1;
      this.start = start;
      this.startControl = startControl;
      this.endControl = endControl;
      this.end = end;
    }
    BezierCurve2.prototype.subdivide = function(t2, firstHalf) {
      var ab = lerp(this.start, this.startControl, t2);
      var bc = lerp(this.startControl, this.endControl, t2);
      var cd = lerp(this.endControl, this.end, t2);
      var abbc = lerp(ab, bc, t2);
      var bccd = lerp(bc, cd, t2);
      var dest = lerp(abbc, bccd, t2);
      return firstHalf ? new BezierCurve2(this.start, ab, abbc, dest) : new BezierCurve2(dest, bccd, cd, this.end);
    };
    BezierCurve2.prototype.add = function(deltaX, deltaY) {
      return new BezierCurve2(this.start.add(deltaX, deltaY), this.startControl.add(deltaX, deltaY), this.endControl.add(deltaX, deltaY), this.end.add(deltaX, deltaY));
    };
    BezierCurve2.prototype.reverse = function() {
      return new BezierCurve2(this.end, this.endControl, this.startControl, this.start);
    };
    return BezierCurve2;
  }()
);
var isBezierCurve = function(path) {
  return path.type === 1;
};
var BoundCurves = (
  /** @class */
  /* @__PURE__ */ function() {
    function BoundCurves2(element) {
      var styles = element.styles;
      var bounds = element.bounds;
      var _a = getAbsoluteValueForTuple(styles.borderTopLeftRadius, bounds.width, bounds.height), tlh = _a[0], tlv = _a[1];
      var _b = getAbsoluteValueForTuple(styles.borderTopRightRadius, bounds.width, bounds.height), trh = _b[0], trv = _b[1];
      var _c = getAbsoluteValueForTuple(styles.borderBottomRightRadius, bounds.width, bounds.height), brh = _c[0], brv = _c[1];
      var _d = getAbsoluteValueForTuple(styles.borderBottomLeftRadius, bounds.width, bounds.height), blh = _d[0], blv = _d[1];
      var factors = [];
      factors.push((tlh + trh) / bounds.width);
      factors.push((blh + brh) / bounds.width);
      factors.push((tlv + blv) / bounds.height);
      factors.push((trv + brv) / bounds.height);
      var maxFactor = Math.max.apply(Math, factors);
      if (maxFactor > 1) {
        tlh /= maxFactor;
        tlv /= maxFactor;
        trh /= maxFactor;
        trv /= maxFactor;
        brh /= maxFactor;
        brv /= maxFactor;
        blh /= maxFactor;
        blv /= maxFactor;
      }
      var topWidth = bounds.width - trh;
      var rightHeight = bounds.height - brv;
      var bottomWidth = bounds.width - brh;
      var leftHeight = bounds.height - blv;
      var borderTopWidth2 = styles.borderTopWidth;
      var borderRightWidth2 = styles.borderRightWidth;
      var borderBottomWidth2 = styles.borderBottomWidth;
      var borderLeftWidth2 = styles.borderLeftWidth;
      var paddingTop2 = getAbsoluteValue(styles.paddingTop, element.bounds.width);
      var paddingRight2 = getAbsoluteValue(styles.paddingRight, element.bounds.width);
      var paddingBottom2 = getAbsoluteValue(styles.paddingBottom, element.bounds.width);
      var paddingLeft2 = getAbsoluteValue(styles.paddingLeft, element.bounds.width);
      this.topLeftBorderDoubleOuterBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 / 3, bounds.top + borderTopWidth2 / 3, tlh - borderLeftWidth2 / 3, tlv - borderTopWidth2 / 3, CORNER.TOP_LEFT) : new Vector(bounds.left + borderLeftWidth2 / 3, bounds.top + borderTopWidth2 / 3);
      this.topRightBorderDoubleOuterBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + topWidth, bounds.top + borderTopWidth2 / 3, trh - borderRightWidth2 / 3, trv - borderTopWidth2 / 3, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 / 3, bounds.top + borderTopWidth2 / 3);
      this.bottomRightBorderDoubleOuterBox = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh - borderRightWidth2 / 3, brv - borderBottomWidth2 / 3, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 / 3, bounds.top + bounds.height - borderBottomWidth2 / 3);
      this.bottomLeftBorderDoubleOuterBox = blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 / 3, bounds.top + leftHeight, blh - borderLeftWidth2 / 3, blv - borderBottomWidth2 / 3, CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borderLeftWidth2 / 3, bounds.top + bounds.height - borderBottomWidth2 / 3);
      this.topLeftBorderDoubleInnerBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 * 2 / 3, bounds.top + borderTopWidth2 * 2 / 3, tlh - borderLeftWidth2 * 2 / 3, tlv - borderTopWidth2 * 2 / 3, CORNER.TOP_LEFT) : new Vector(bounds.left + borderLeftWidth2 * 2 / 3, bounds.top + borderTopWidth2 * 2 / 3);
      this.topRightBorderDoubleInnerBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + topWidth, bounds.top + borderTopWidth2 * 2 / 3, trh - borderRightWidth2 * 2 / 3, trv - borderTopWidth2 * 2 / 3, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 * 2 / 3, bounds.top + borderTopWidth2 * 2 / 3);
      this.bottomRightBorderDoubleInnerBox = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh - borderRightWidth2 * 2 / 3, brv - borderBottomWidth2 * 2 / 3, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 * 2 / 3, bounds.top + bounds.height - borderBottomWidth2 * 2 / 3);
      this.bottomLeftBorderDoubleInnerBox = blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 * 2 / 3, bounds.top + leftHeight, blh - borderLeftWidth2 * 2 / 3, blv - borderBottomWidth2 * 2 / 3, CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borderLeftWidth2 * 2 / 3, bounds.top + bounds.height - borderBottomWidth2 * 2 / 3);
      this.topLeftBorderStroke = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 / 2, bounds.top + borderTopWidth2 / 2, tlh - borderLeftWidth2 / 2, tlv - borderTopWidth2 / 2, CORNER.TOP_LEFT) : new Vector(bounds.left + borderLeftWidth2 / 2, bounds.top + borderTopWidth2 / 2);
      this.topRightBorderStroke = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + topWidth, bounds.top + borderTopWidth2 / 2, trh - borderRightWidth2 / 2, trv - borderTopWidth2 / 2, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 / 2, bounds.top + borderTopWidth2 / 2);
      this.bottomRightBorderStroke = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh - borderRightWidth2 / 2, brv - borderBottomWidth2 / 2, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 / 2, bounds.top + bounds.height - borderBottomWidth2 / 2);
      this.bottomLeftBorderStroke = blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 / 2, bounds.top + leftHeight, blh - borderLeftWidth2 / 2, blv - borderBottomWidth2 / 2, CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borderLeftWidth2 / 2, bounds.top + bounds.height - borderBottomWidth2 / 2);
      this.topLeftBorderBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left, bounds.top, tlh, tlv, CORNER.TOP_LEFT) : new Vector(bounds.left, bounds.top);
      this.topRightBorderBox = trh > 0 || trv > 0 ? getCurvePoints(bounds.left + topWidth, bounds.top, trh, trv, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width, bounds.top);
      this.bottomRightBorderBox = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh, brv, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width, bounds.top + bounds.height);
      this.bottomLeftBorderBox = blh > 0 || blv > 0 ? getCurvePoints(bounds.left, bounds.top + leftHeight, blh, blv, CORNER.BOTTOM_LEFT) : new Vector(bounds.left, bounds.top + bounds.height);
      this.topLeftPaddingBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2, bounds.top + borderTopWidth2, Math.max(0, tlh - borderLeftWidth2), Math.max(0, tlv - borderTopWidth2), CORNER.TOP_LEFT) : new Vector(bounds.left + borderLeftWidth2, bounds.top + borderTopWidth2);
      this.topRightPaddingBox = trh > 0 || trv > 0 ? getCurvePoints(bounds.left + Math.min(topWidth, bounds.width - borderRightWidth2), bounds.top + borderTopWidth2, topWidth > bounds.width + borderRightWidth2 ? 0 : Math.max(0, trh - borderRightWidth2), Math.max(0, trv - borderTopWidth2), CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2, bounds.top + borderTopWidth2);
      this.bottomRightPaddingBox = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + Math.min(bottomWidth, bounds.width - borderLeftWidth2), bounds.top + Math.min(rightHeight, bounds.height - borderBottomWidth2), Math.max(0, brh - borderRightWidth2), Math.max(0, brv - borderBottomWidth2), CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2, bounds.top + bounds.height - borderBottomWidth2);
      this.bottomLeftPaddingBox = blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2, bounds.top + Math.min(leftHeight, bounds.height - borderBottomWidth2), Math.max(0, blh - borderLeftWidth2), Math.max(0, blv - borderBottomWidth2), CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borderLeftWidth2, bounds.top + bounds.height - borderBottomWidth2);
      this.topLeftContentBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 + paddingLeft2, bounds.top + borderTopWidth2 + paddingTop2, Math.max(0, tlh - (borderLeftWidth2 + paddingLeft2)), Math.max(0, tlv - (borderTopWidth2 + paddingTop2)), CORNER.TOP_LEFT) : new Vector(bounds.left + borderLeftWidth2 + paddingLeft2, bounds.top + borderTopWidth2 + paddingTop2);
      this.topRightContentBox = trh > 0 || trv > 0 ? getCurvePoints(bounds.left + Math.min(topWidth, bounds.width + borderLeftWidth2 + paddingLeft2), bounds.top + borderTopWidth2 + paddingTop2, topWidth > bounds.width + borderLeftWidth2 + paddingLeft2 ? 0 : trh - borderLeftWidth2 + paddingLeft2, trv - (borderTopWidth2 + paddingTop2), CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - (borderRightWidth2 + paddingRight2), bounds.top + borderTopWidth2 + paddingTop2);
      this.bottomRightContentBox = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + Math.min(bottomWidth, bounds.width - (borderLeftWidth2 + paddingLeft2)), bounds.top + Math.min(rightHeight, bounds.height + borderTopWidth2 + paddingTop2), Math.max(0, brh - (borderRightWidth2 + paddingRight2)), brv - (borderBottomWidth2 + paddingBottom2), CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - (borderRightWidth2 + paddingRight2), bounds.top + bounds.height - (borderBottomWidth2 + paddingBottom2));
      this.bottomLeftContentBox = blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 + paddingLeft2, bounds.top + leftHeight, Math.max(0, blh - (borderLeftWidth2 + paddingLeft2)), blv - (borderBottomWidth2 + paddingBottom2), CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borderLeftWidth2 + paddingLeft2, bounds.top + bounds.height - (borderBottomWidth2 + paddingBottom2));
    }
    return BoundCurves2;
  }()
);
var CORNER;
(function(CORNER2) {
  CORNER2[CORNER2["TOP_LEFT"] = 0] = "TOP_LEFT";
  CORNER2[CORNER2["TOP_RIGHT"] = 1] = "TOP_RIGHT";
  CORNER2[CORNER2["BOTTOM_RIGHT"] = 2] = "BOTTOM_RIGHT";
  CORNER2[CORNER2["BOTTOM_LEFT"] = 3] = "BOTTOM_LEFT";
})(CORNER || (CORNER = {}));
var getCurvePoints = function(x, y, r1, r2, position2) {
  var kappa = 4 * ((Math.sqrt(2) - 1) / 3);
  var ox = r1 * kappa;
  var oy = r2 * kappa;
  var xm = x + r1;
  var ym = y + r2;
  switch (position2) {
    case CORNER.TOP_LEFT:
      return new BezierCurve(new Vector(x, ym), new Vector(x, ym - oy), new Vector(xm - ox, y), new Vector(xm, y));
    case CORNER.TOP_RIGHT:
      return new BezierCurve(new Vector(x, y), new Vector(x + ox, y), new Vector(xm, ym - oy), new Vector(xm, ym));
    case CORNER.BOTTOM_RIGHT:
      return new BezierCurve(new Vector(xm, y), new Vector(xm, y + oy), new Vector(x + ox, ym), new Vector(x, ym));
    case CORNER.BOTTOM_LEFT:
    default:
      return new BezierCurve(new Vector(xm, ym), new Vector(xm - ox, ym), new Vector(x, y + oy), new Vector(x, y));
  }
};
var calculateBorderBoxPath = function(curves) {
  return [curves.topLeftBorderBox, curves.topRightBorderBox, curves.bottomRightBorderBox, curves.bottomLeftBorderBox];
};
var calculateContentBoxPath = function(curves) {
  return [
    curves.topLeftContentBox,
    curves.topRightContentBox,
    curves.bottomRightContentBox,
    curves.bottomLeftContentBox
  ];
};
var calculatePaddingBoxPath = function(curves) {
  return [
    curves.topLeftPaddingBox,
    curves.topRightPaddingBox,
    curves.bottomRightPaddingBox,
    curves.bottomLeftPaddingBox
  ];
};
var TransformEffect = (
  /** @class */
  /* @__PURE__ */ function() {
    function TransformEffect2(offsetX, offsetY, matrix2) {
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.matrix = matrix2;
      this.type = 0;
      this.target = 2 | 4;
    }
    return TransformEffect2;
  }()
);
var ClipEffect = (
  /** @class */
  /* @__PURE__ */ function() {
    function ClipEffect2(path, target) {
      this.path = path;
      this.target = target;
      this.type = 1;
    }
    return ClipEffect2;
  }()
);
var OpacityEffect = (
  /** @class */
  /* @__PURE__ */ function() {
    function OpacityEffect2(opacity2) {
      this.opacity = opacity2;
      this.type = 2;
      this.target = 2 | 4;
    }
    return OpacityEffect2;
  }()
);
var isTransformEffect = function(effect) {
  return effect.type === 0;
};
var isClipEffect = function(effect) {
  return effect.type === 1;
};
var isOpacityEffect = function(effect) {
  return effect.type === 2;
};
var equalPath = function(a2, b) {
  if (a2.length === b.length) {
    return a2.some(function(v, i) {
      return v === b[i];
    });
  }
  return false;
};
var transformPath = function(path, deltaX, deltaY, deltaW, deltaH) {
  return path.map(function(point, index2) {
    switch (index2) {
      case 0:
        return point.add(deltaX, deltaY);
      case 1:
        return point.add(deltaX + deltaW, deltaY);
      case 2:
        return point.add(deltaX + deltaW, deltaY + deltaH);
      case 3:
        return point.add(deltaX, deltaY + deltaH);
    }
    return point;
  });
};
var StackingContext = (
  /** @class */
  /* @__PURE__ */ function() {
    function StackingContext2(container) {
      this.element = container;
      this.inlineLevel = [];
      this.nonInlineLevel = [];
      this.negativeZIndex = [];
      this.zeroOrAutoZIndexOrTransformedOrOpacity = [];
      this.positiveZIndex = [];
      this.nonPositionedFloats = [];
      this.nonPositionedInlineLevel = [];
    }
    return StackingContext2;
  }()
);
var ElementPaint = (
  /** @class */
  function() {
    function ElementPaint2(container, parent) {
      this.container = container;
      this.parent = parent;
      this.effects = [];
      this.curves = new BoundCurves(this.container);
      if (this.container.styles.opacity < 1) {
        this.effects.push(new OpacityEffect(this.container.styles.opacity));
      }
      if (this.container.styles.transform !== null) {
        var offsetX = this.container.bounds.left + this.container.styles.transformOrigin[0].number;
        var offsetY = this.container.bounds.top + this.container.styles.transformOrigin[1].number;
        var matrix2 = this.container.styles.transform;
        this.effects.push(new TransformEffect(offsetX, offsetY, matrix2));
      }
      if (this.container.styles.overflowX !== 0) {
        var borderBox = calculateBorderBoxPath(this.curves);
        var paddingBox2 = calculatePaddingBoxPath(this.curves);
        if (equalPath(borderBox, paddingBox2)) {
          this.effects.push(new ClipEffect(
            borderBox,
            2 | 4
            /* CONTENT */
          ));
        } else {
          this.effects.push(new ClipEffect(
            borderBox,
            2
            /* BACKGROUND_BORDERS */
          ));
          this.effects.push(new ClipEffect(
            paddingBox2,
            4
            /* CONTENT */
          ));
        }
      }
    }
    ElementPaint2.prototype.getEffects = function(target) {
      var inFlow = [
        2,
        3
        /* FIXED */
      ].indexOf(this.container.styles.position) === -1;
      var parent = this.parent;
      var effects = this.effects.slice(0);
      while (parent) {
        var croplessEffects = parent.effects.filter(function(effect) {
          return !isClipEffect(effect);
        });
        if (inFlow || parent.container.styles.position !== 0 || !parent.parent) {
          effects.unshift.apply(effects, croplessEffects);
          inFlow = [
            2,
            3
            /* FIXED */
          ].indexOf(parent.container.styles.position) === -1;
          if (parent.container.styles.overflowX !== 0) {
            var borderBox = calculateBorderBoxPath(parent.curves);
            var paddingBox2 = calculatePaddingBoxPath(parent.curves);
            if (!equalPath(borderBox, paddingBox2)) {
              effects.unshift(new ClipEffect(
                paddingBox2,
                2 | 4
                /* CONTENT */
              ));
            }
          }
        } else {
          effects.unshift.apply(effects, croplessEffects);
        }
        parent = parent.parent;
      }
      return effects.filter(function(effect) {
        return contains(effect.target, target);
      });
    };
    return ElementPaint2;
  }()
);
var parseStackTree = function(parent, stackingContext, realStackingContext, listItems) {
  parent.container.elements.forEach(function(child) {
    var treatAsRealStackingContext = contains(
      child.flags,
      4
      /* CREATES_REAL_STACKING_CONTEXT */
    );
    var createsStackingContext2 = contains(
      child.flags,
      2
      /* CREATES_STACKING_CONTEXT */
    );
    var paintContainer = new ElementPaint(child, parent);
    if (contains(
      child.styles.display,
      2048
      /* LIST_ITEM */
    )) {
      listItems.push(paintContainer);
    }
    var listOwnerItems = contains(
      child.flags,
      8
      /* IS_LIST_OWNER */
    ) ? [] : listItems;
    if (treatAsRealStackingContext || createsStackingContext2) {
      var parentStack = treatAsRealStackingContext || child.styles.isPositioned() ? realStackingContext : stackingContext;
      var stack2 = new StackingContext(paintContainer);
      if (child.styles.isPositioned() || child.styles.opacity < 1 || child.styles.isTransformed()) {
        var order_1 = child.styles.zIndex.order;
        if (order_1 < 0) {
          var index_1 = 0;
          parentStack.negativeZIndex.some(function(current, i) {
            if (order_1 > current.element.container.styles.zIndex.order) {
              index_1 = i;
              return false;
            } else if (index_1 > 0) {
              return true;
            }
            return false;
          });
          parentStack.negativeZIndex.splice(index_1, 0, stack2);
        } else if (order_1 > 0) {
          var index_2 = 0;
          parentStack.positiveZIndex.some(function(current, i) {
            if (order_1 >= current.element.container.styles.zIndex.order) {
              index_2 = i + 1;
              return false;
            } else if (index_2 > 0) {
              return true;
            }
            return false;
          });
          parentStack.positiveZIndex.splice(index_2, 0, stack2);
        } else {
          parentStack.zeroOrAutoZIndexOrTransformedOrOpacity.push(stack2);
        }
      } else {
        if (child.styles.isFloating()) {
          parentStack.nonPositionedFloats.push(stack2);
        } else {
          parentStack.nonPositionedInlineLevel.push(stack2);
        }
      }
      parseStackTree(paintContainer, stack2, treatAsRealStackingContext ? stack2 : realStackingContext, listOwnerItems);
    } else {
      if (child.styles.isInlineLevel()) {
        stackingContext.inlineLevel.push(paintContainer);
      } else {
        stackingContext.nonInlineLevel.push(paintContainer);
      }
      parseStackTree(paintContainer, stackingContext, realStackingContext, listOwnerItems);
    }
    if (contains(
      child.flags,
      8
      /* IS_LIST_OWNER */
    )) {
      processListItems(child, listOwnerItems);
    }
  });
};
var processListItems = function(owner, elements) {
  var numbering = owner instanceof OLElementContainer ? owner.start : 1;
  var reversed = owner instanceof OLElementContainer ? owner.reversed : false;
  for (var i = 0; i < elements.length; i++) {
    var item = elements[i];
    if (item.container instanceof LIElementContainer && typeof item.container.value === "number" && item.container.value !== 0) {
      numbering = item.container.value;
    }
    item.listValue = createCounterText(numbering, item.container.styles.listStyleType, true);
    numbering += reversed ? -1 : 1;
  }
};
var parseStackingContexts = function(container) {
  var paintContainer = new ElementPaint(container, null);
  var root = new StackingContext(paintContainer);
  var listItems = [];
  parseStackTree(paintContainer, root, root, listItems);
  processListItems(paintContainer.container, listItems);
  return root;
};
var parsePathForBorder = function(curves, borderSide) {
  switch (borderSide) {
    case 0:
      return createPathFromCurves(curves.topLeftBorderBox, curves.topLeftPaddingBox, curves.topRightBorderBox, curves.topRightPaddingBox);
    case 1:
      return createPathFromCurves(curves.topRightBorderBox, curves.topRightPaddingBox, curves.bottomRightBorderBox, curves.bottomRightPaddingBox);
    case 2:
      return createPathFromCurves(curves.bottomRightBorderBox, curves.bottomRightPaddingBox, curves.bottomLeftBorderBox, curves.bottomLeftPaddingBox);
    case 3:
    default:
      return createPathFromCurves(curves.bottomLeftBorderBox, curves.bottomLeftPaddingBox, curves.topLeftBorderBox, curves.topLeftPaddingBox);
  }
};
var parsePathForBorderDoubleOuter = function(curves, borderSide) {
  switch (borderSide) {
    case 0:
      return createPathFromCurves(curves.topLeftBorderBox, curves.topLeftBorderDoubleOuterBox, curves.topRightBorderBox, curves.topRightBorderDoubleOuterBox);
    case 1:
      return createPathFromCurves(curves.topRightBorderBox, curves.topRightBorderDoubleOuterBox, curves.bottomRightBorderBox, curves.bottomRightBorderDoubleOuterBox);
    case 2:
      return createPathFromCurves(curves.bottomRightBorderBox, curves.bottomRightBorderDoubleOuterBox, curves.bottomLeftBorderBox, curves.bottomLeftBorderDoubleOuterBox);
    case 3:
    default:
      return createPathFromCurves(curves.bottomLeftBorderBox, curves.bottomLeftBorderDoubleOuterBox, curves.topLeftBorderBox, curves.topLeftBorderDoubleOuterBox);
  }
};
var parsePathForBorderDoubleInner = function(curves, borderSide) {
  switch (borderSide) {
    case 0:
      return createPathFromCurves(curves.topLeftBorderDoubleInnerBox, curves.topLeftPaddingBox, curves.topRightBorderDoubleInnerBox, curves.topRightPaddingBox);
    case 1:
      return createPathFromCurves(curves.topRightBorderDoubleInnerBox, curves.topRightPaddingBox, curves.bottomRightBorderDoubleInnerBox, curves.bottomRightPaddingBox);
    case 2:
      return createPathFromCurves(curves.bottomRightBorderDoubleInnerBox, curves.bottomRightPaddingBox, curves.bottomLeftBorderDoubleInnerBox, curves.bottomLeftPaddingBox);
    case 3:
    default:
      return createPathFromCurves(curves.bottomLeftBorderDoubleInnerBox, curves.bottomLeftPaddingBox, curves.topLeftBorderDoubleInnerBox, curves.topLeftPaddingBox);
  }
};
var parsePathForBorderStroke = function(curves, borderSide) {
  switch (borderSide) {
    case 0:
      return createStrokePathFromCurves(curves.topLeftBorderStroke, curves.topRightBorderStroke);
    case 1:
      return createStrokePathFromCurves(curves.topRightBorderStroke, curves.bottomRightBorderStroke);
    case 2:
      return createStrokePathFromCurves(curves.bottomRightBorderStroke, curves.bottomLeftBorderStroke);
    case 3:
    default:
      return createStrokePathFromCurves(curves.bottomLeftBorderStroke, curves.topLeftBorderStroke);
  }
};
var createStrokePathFromCurves = function(outer1, outer2) {
  var path = [];
  if (isBezierCurve(outer1)) {
    path.push(outer1.subdivide(0.5, false));
  } else {
    path.push(outer1);
  }
  if (isBezierCurve(outer2)) {
    path.push(outer2.subdivide(0.5, true));
  } else {
    path.push(outer2);
  }
  return path;
};
var createPathFromCurves = function(outer1, inner1, outer2, inner2) {
  var path = [];
  if (isBezierCurve(outer1)) {
    path.push(outer1.subdivide(0.5, false));
  } else {
    path.push(outer1);
  }
  if (isBezierCurve(outer2)) {
    path.push(outer2.subdivide(0.5, true));
  } else {
    path.push(outer2);
  }
  if (isBezierCurve(inner2)) {
    path.push(inner2.subdivide(0.5, true).reverse());
  } else {
    path.push(inner2);
  }
  if (isBezierCurve(inner1)) {
    path.push(inner1.subdivide(0.5, false).reverse());
  } else {
    path.push(inner1);
  }
  return path;
};
var paddingBox = function(element) {
  var bounds = element.bounds;
  var styles = element.styles;
  return bounds.add(styles.borderLeftWidth, styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth), -(styles.borderTopWidth + styles.borderBottomWidth));
};
var contentBox = function(element) {
  var styles = element.styles;
  var bounds = element.bounds;
  var paddingLeft2 = getAbsoluteValue(styles.paddingLeft, bounds.width);
  var paddingRight2 = getAbsoluteValue(styles.paddingRight, bounds.width);
  var paddingTop2 = getAbsoluteValue(styles.paddingTop, bounds.width);
  var paddingBottom2 = getAbsoluteValue(styles.paddingBottom, bounds.width);
  return bounds.add(paddingLeft2 + styles.borderLeftWidth, paddingTop2 + styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth + paddingLeft2 + paddingRight2), -(styles.borderTopWidth + styles.borderBottomWidth + paddingTop2 + paddingBottom2));
};
var calculateBackgroundPositioningArea = function(backgroundOrigin2, element) {
  if (backgroundOrigin2 === 0) {
    return element.bounds;
  }
  if (backgroundOrigin2 === 2) {
    return contentBox(element);
  }
  return paddingBox(element);
};
var calculateBackgroundPaintingArea = function(backgroundClip2, element) {
  if (backgroundClip2 === 0) {
    return element.bounds;
  }
  if (backgroundClip2 === 2) {
    return contentBox(element);
  }
  return paddingBox(element);
};
var calculateBackgroundRendering = function(container, index2, intrinsicSize) {
  var backgroundPositioningArea = calculateBackgroundPositioningArea(getBackgroundValueForIndex(container.styles.backgroundOrigin, index2), container);
  var backgroundPaintingArea = calculateBackgroundPaintingArea(getBackgroundValueForIndex(container.styles.backgroundClip, index2), container);
  var backgroundImageSize = calculateBackgroundSize(getBackgroundValueForIndex(container.styles.backgroundSize, index2), intrinsicSize, backgroundPositioningArea);
  var sizeWidth = backgroundImageSize[0], sizeHeight = backgroundImageSize[1];
  var position2 = getAbsoluteValueForTuple(getBackgroundValueForIndex(container.styles.backgroundPosition, index2), backgroundPositioningArea.width - sizeWidth, backgroundPositioningArea.height - sizeHeight);
  var path = calculateBackgroundRepeatPath(getBackgroundValueForIndex(container.styles.backgroundRepeat, index2), position2, backgroundImageSize, backgroundPositioningArea, backgroundPaintingArea);
  var offsetX = Math.round(backgroundPositioningArea.left + position2[0]);
  var offsetY = Math.round(backgroundPositioningArea.top + position2[1]);
  return [path, offsetX, offsetY, sizeWidth, sizeHeight];
};
var isAuto = function(token) {
  return isIdentToken(token) && token.value === BACKGROUND_SIZE.AUTO;
};
var hasIntrinsicValue = function(value) {
  return typeof value === "number";
};
var calculateBackgroundSize = function(size2, _a, bounds) {
  var intrinsicWidth = _a[0], intrinsicHeight = _a[1], intrinsicProportion = _a[2];
  var first = size2[0], second = size2[1];
  if (!first) {
    return [0, 0];
  }
  if (isLengthPercentage(first) && second && isLengthPercentage(second)) {
    return [getAbsoluteValue(first, bounds.width), getAbsoluteValue(second, bounds.height)];
  }
  var hasIntrinsicProportion = hasIntrinsicValue(intrinsicProportion);
  if (isIdentToken(first) && (first.value === BACKGROUND_SIZE.CONTAIN || first.value === BACKGROUND_SIZE.COVER)) {
    if (hasIntrinsicValue(intrinsicProportion)) {
      var targetRatio = bounds.width / bounds.height;
      return targetRatio < intrinsicProportion !== (first.value === BACKGROUND_SIZE.COVER) ? [bounds.width, bounds.width / intrinsicProportion] : [bounds.height * intrinsicProportion, bounds.height];
    }
    return [bounds.width, bounds.height];
  }
  var hasIntrinsicWidth = hasIntrinsicValue(intrinsicWidth);
  var hasIntrinsicHeight = hasIntrinsicValue(intrinsicHeight);
  var hasIntrinsicDimensions = hasIntrinsicWidth || hasIntrinsicHeight;
  if (isAuto(first) && (!second || isAuto(second))) {
    if (hasIntrinsicWidth && hasIntrinsicHeight) {
      return [intrinsicWidth, intrinsicHeight];
    }
    if (!hasIntrinsicProportion && !hasIntrinsicDimensions) {
      return [bounds.width, bounds.height];
    }
    if (hasIntrinsicDimensions && hasIntrinsicProportion) {
      var width_1 = hasIntrinsicWidth ? intrinsicWidth : intrinsicHeight * intrinsicProportion;
      var height_1 = hasIntrinsicHeight ? intrinsicHeight : intrinsicWidth / intrinsicProportion;
      return [width_1, height_1];
    }
    var width_2 = hasIntrinsicWidth ? intrinsicWidth : bounds.width;
    var height_2 = hasIntrinsicHeight ? intrinsicHeight : bounds.height;
    return [width_2, height_2];
  }
  if (hasIntrinsicProportion) {
    var width_3 = 0;
    var height_3 = 0;
    if (isLengthPercentage(first)) {
      width_3 = getAbsoluteValue(first, bounds.width);
    } else if (isLengthPercentage(second)) {
      height_3 = getAbsoluteValue(second, bounds.height);
    }
    if (isAuto(first)) {
      width_3 = height_3 * intrinsicProportion;
    } else if (!second || isAuto(second)) {
      height_3 = width_3 / intrinsicProportion;
    }
    return [width_3, height_3];
  }
  var width = null;
  var height = null;
  if (isLengthPercentage(first)) {
    width = getAbsoluteValue(first, bounds.width);
  } else if (second && isLengthPercentage(second)) {
    height = getAbsoluteValue(second, bounds.height);
  }
  if (width !== null && (!second || isAuto(second))) {
    height = hasIntrinsicWidth && hasIntrinsicHeight ? width / intrinsicWidth * intrinsicHeight : bounds.height;
  }
  if (height !== null && isAuto(first)) {
    width = hasIntrinsicWidth && hasIntrinsicHeight ? height / intrinsicHeight * intrinsicWidth : bounds.width;
  }
  if (width !== null && height !== null) {
    return [width, height];
  }
  throw new Error("Unable to calculate background-size for element");
};
var getBackgroundValueForIndex = function(values, index2) {
  var value = values[index2];
  if (typeof value === "undefined") {
    return values[0];
  }
  return value;
};
var calculateBackgroundRepeatPath = function(repeat, _a, _b, backgroundPositioningArea, backgroundPaintingArea) {
  var x = _a[0], y = _a[1];
  var width = _b[0], height = _b[1];
  switch (repeat) {
    case 2:
      return [
        new Vector(Math.round(backgroundPositioningArea.left), Math.round(backgroundPositioningArea.top + y)),
        new Vector(Math.round(backgroundPositioningArea.left + backgroundPositioningArea.width), Math.round(backgroundPositioningArea.top + y)),
        new Vector(Math.round(backgroundPositioningArea.left + backgroundPositioningArea.width), Math.round(height + backgroundPositioningArea.top + y)),
        new Vector(Math.round(backgroundPositioningArea.left), Math.round(height + backgroundPositioningArea.top + y))
      ];
    case 3:
      return [
        new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top)),
        new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top)),
        new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.height + backgroundPositioningArea.top)),
        new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.height + backgroundPositioningArea.top))
      ];
    case 1:
      return [
        new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top + y)),
        new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top + y)),
        new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top + y + height)),
        new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top + y + height))
      ];
    default:
      return [
        new Vector(Math.round(backgroundPaintingArea.left), Math.round(backgroundPaintingArea.top)),
        new Vector(Math.round(backgroundPaintingArea.left + backgroundPaintingArea.width), Math.round(backgroundPaintingArea.top)),
        new Vector(Math.round(backgroundPaintingArea.left + backgroundPaintingArea.width), Math.round(backgroundPaintingArea.height + backgroundPaintingArea.top)),
        new Vector(Math.round(backgroundPaintingArea.left), Math.round(backgroundPaintingArea.height + backgroundPaintingArea.top))
      ];
  }
};
var SMALL_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
var SAMPLE_TEXT = "Hidden Text";
var FontMetrics = (
  /** @class */
  function() {
    function FontMetrics2(document2) {
      this._data = {};
      this._document = document2;
    }
    FontMetrics2.prototype.parseMetrics = function(fontFamily2, fontSize2) {
      var container = this._document.createElement("div");
      var img = this._document.createElement("img");
      var span = this._document.createElement("span");
      var body = this._document.body;
      container.style.visibility = "hidden";
      container.style.fontFamily = fontFamily2;
      container.style.fontSize = fontSize2;
      container.style.margin = "0";
      container.style.padding = "0";
      container.style.whiteSpace = "nowrap";
      body.appendChild(container);
      img.src = SMALL_IMAGE;
      img.width = 1;
      img.height = 1;
      img.style.margin = "0";
      img.style.padding = "0";
      img.style.verticalAlign = "baseline";
      span.style.fontFamily = fontFamily2;
      span.style.fontSize = fontSize2;
      span.style.margin = "0";
      span.style.padding = "0";
      span.appendChild(this._document.createTextNode(SAMPLE_TEXT));
      container.appendChild(span);
      container.appendChild(img);
      var baseline = img.offsetTop - span.offsetTop + 2;
      container.removeChild(span);
      container.appendChild(this._document.createTextNode(SAMPLE_TEXT));
      container.style.lineHeight = "normal";
      img.style.verticalAlign = "super";
      var middle = img.offsetTop - container.offsetTop + 2;
      body.removeChild(container);
      return { baseline, middle };
    };
    FontMetrics2.prototype.getMetrics = function(fontFamily2, fontSize2) {
      var key = fontFamily2 + " " + fontSize2;
      if (typeof this._data[key] === "undefined") {
        this._data[key] = this.parseMetrics(fontFamily2, fontSize2);
      }
      return this._data[key];
    };
    return FontMetrics2;
  }()
);
var Renderer = (
  /** @class */
  /* @__PURE__ */ function() {
    function Renderer2(context, options) {
      this.context = context;
      this.options = options;
    }
    return Renderer2;
  }()
);
var MASK_OFFSET = 1e4;
var CanvasRenderer = (
  /** @class */
  function(_super) {
    __extends(CanvasRenderer2, _super);
    function CanvasRenderer2(context, options) {
      var _this = _super.call(this, context, options) || this;
      _this._activeEffects = [];
      _this.canvas = options.canvas ? options.canvas : document.createElement("canvas");
      _this.ctx = _this.canvas.getContext("2d");
      if (!options.canvas) {
        _this.canvas.width = Math.floor(options.width * options.scale);
        _this.canvas.height = Math.floor(options.height * options.scale);
        _this.canvas.style.width = options.width + "px";
        _this.canvas.style.height = options.height + "px";
      }
      _this.fontMetrics = new FontMetrics(document);
      _this.ctx.scale(_this.options.scale, _this.options.scale);
      _this.ctx.translate(-options.x, -options.y);
      _this.ctx.textBaseline = "bottom";
      _this._activeEffects = [];
      _this.context.logger.debug("Canvas renderer initialized (" + options.width + "x" + options.height + ") with scale " + options.scale);
      return _this;
    }
    CanvasRenderer2.prototype.applyEffects = function(effects) {
      var _this = this;
      while (this._activeEffects.length) {
        this.popEffect();
      }
      effects.forEach(function(effect) {
        return _this.applyEffect(effect);
      });
    };
    CanvasRenderer2.prototype.applyEffect = function(effect) {
      this.ctx.save();
      if (isOpacityEffect(effect)) {
        this.ctx.globalAlpha = effect.opacity;
      }
      if (isTransformEffect(effect)) {
        this.ctx.translate(effect.offsetX, effect.offsetY);
        this.ctx.transform(effect.matrix[0], effect.matrix[1], effect.matrix[2], effect.matrix[3], effect.matrix[4], effect.matrix[5]);
        this.ctx.translate(-effect.offsetX, -effect.offsetY);
      }
      if (isClipEffect(effect)) {
        this.path(effect.path);
        this.ctx.clip();
      }
      this._activeEffects.push(effect);
    };
    CanvasRenderer2.prototype.popEffect = function() {
      this._activeEffects.pop();
      this.ctx.restore();
    };
    CanvasRenderer2.prototype.renderStack = function(stack2) {
      return __awaiter(this, void 0, void 0, function() {
        var styles;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              styles = stack2.element.container.styles;
              if (!styles.isVisible())
                return [3, 2];
              return [4, this.renderStackContent(stack2)];
            case 1:
              _a.sent();
              _a.label = 2;
            case 2:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    CanvasRenderer2.prototype.renderNode = function(paint) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (contains(
                paint.container.flags,
                16
                /* DEBUG_RENDER */
              )) {
                debugger;
              }
              if (!paint.container.styles.isVisible())
                return [3, 3];
              return [4, this.renderNodeBackgroundAndBorders(paint)];
            case 1:
              _a.sent();
              return [4, this.renderNodeContent(paint)];
            case 2:
              _a.sent();
              _a.label = 3;
            case 3:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    CanvasRenderer2.prototype.renderTextWithLetterSpacing = function(text, letterSpacing2, baseline) {
      var _this = this;
      if (letterSpacing2 === 0) {
        this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + baseline);
      } else {
        var letters = segmentGraphemes(text.text);
        letters.reduce(function(left, letter) {
          _this.ctx.fillText(letter, left, text.bounds.top + baseline);
          return left + _this.ctx.measureText(letter).width;
        }, text.bounds.left);
      }
    };
    CanvasRenderer2.prototype.createFontStyle = function(styles) {
      var fontVariant2 = styles.fontVariant.filter(function(variant) {
        return variant === "normal" || variant === "small-caps";
      }).join("");
      var fontFamily2 = fixIOSSystemFonts(styles.fontFamily).join(", ");
      var fontSize2 = isDimensionToken(styles.fontSize) ? "" + styles.fontSize.number + styles.fontSize.unit : styles.fontSize.number + "px";
      return [
        [styles.fontStyle, fontVariant2, styles.fontWeight, fontSize2, fontFamily2].join(" "),
        fontFamily2,
        fontSize2
      ];
    };
    CanvasRenderer2.prototype.renderTextNode = function(text, styles) {
      return __awaiter(this, void 0, void 0, function() {
        var _a, font, fontFamily2, fontSize2, _b, baseline, middle, paintOrder2;
        var _this = this;
        return __generator(this, function(_c) {
          _a = this.createFontStyle(styles), font = _a[0], fontFamily2 = _a[1], fontSize2 = _a[2];
          this.ctx.font = font;
          this.ctx.direction = styles.direction === 1 ? "rtl" : "ltr";
          this.ctx.textAlign = "left";
          this.ctx.textBaseline = "alphabetic";
          _b = this.fontMetrics.getMetrics(fontFamily2, fontSize2), baseline = _b.baseline, middle = _b.middle;
          paintOrder2 = styles.paintOrder;
          text.textBounds.forEach(function(text2) {
            paintOrder2.forEach(function(paintOrderLayer) {
              switch (paintOrderLayer) {
                case 0:
                  _this.ctx.fillStyle = asString(styles.color);
                  _this.renderTextWithLetterSpacing(text2, styles.letterSpacing, baseline);
                  var textShadows = styles.textShadow;
                  if (textShadows.length && text2.text.trim().length) {
                    textShadows.slice(0).reverse().forEach(function(textShadow2) {
                      _this.ctx.shadowColor = asString(textShadow2.color);
                      _this.ctx.shadowOffsetX = textShadow2.offsetX.number * _this.options.scale;
                      _this.ctx.shadowOffsetY = textShadow2.offsetY.number * _this.options.scale;
                      _this.ctx.shadowBlur = textShadow2.blur.number;
                      _this.renderTextWithLetterSpacing(text2, styles.letterSpacing, baseline);
                    });
                    _this.ctx.shadowColor = "";
                    _this.ctx.shadowOffsetX = 0;
                    _this.ctx.shadowOffsetY = 0;
                    _this.ctx.shadowBlur = 0;
                  }
                  if (styles.textDecorationLine.length) {
                    _this.ctx.fillStyle = asString(styles.textDecorationColor || styles.color);
                    styles.textDecorationLine.forEach(function(textDecorationLine2) {
                      switch (textDecorationLine2) {
                        case 1:
                          _this.ctx.fillRect(text2.bounds.left, Math.round(text2.bounds.top + baseline), text2.bounds.width, 1);
                          break;
                        case 2:
                          _this.ctx.fillRect(text2.bounds.left, Math.round(text2.bounds.top), text2.bounds.width, 1);
                          break;
                        case 3:
                          _this.ctx.fillRect(text2.bounds.left, Math.ceil(text2.bounds.top + middle), text2.bounds.width, 1);
                          break;
                      }
                    });
                  }
                  break;
                case 1:
                  if (styles.webkitTextStrokeWidth && text2.text.trim().length) {
                    _this.ctx.strokeStyle = asString(styles.webkitTextStrokeColor);
                    _this.ctx.lineWidth = styles.webkitTextStrokeWidth;
                    _this.ctx.lineJoin = !!window.chrome ? "miter" : "round";
                    _this.ctx.strokeText(text2.text, text2.bounds.left, text2.bounds.top + baseline);
                  }
                  _this.ctx.strokeStyle = "";
                  _this.ctx.lineWidth = 0;
                  _this.ctx.lineJoin = "miter";
                  break;
              }
            });
          });
          return [
            2
            /*return*/
          ];
        });
      });
    };
    CanvasRenderer2.prototype.renderReplacedElement = function(container, curves, image2) {
      if (image2 && container.intrinsicWidth > 0 && container.intrinsicHeight > 0) {
        var box = contentBox(container);
        var path = calculatePaddingBoxPath(curves);
        this.path(path);
        this.ctx.save();
        this.ctx.clip();
        this.ctx.drawImage(image2, 0, 0, container.intrinsicWidth, container.intrinsicHeight, box.left, box.top, box.width, box.height);
        this.ctx.restore();
      }
    };
    CanvasRenderer2.prototype.renderNodeContent = function(paint) {
      return __awaiter(this, void 0, void 0, function() {
        var container, curves, styles, _i, _a, child, image2, image2, iframeRenderer, canvas, size2, _b, fontFamily2, fontSize2, baseline, bounds, x, textBounds, img, image2, url, fontFamily2, bounds;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              this.applyEffects(paint.getEffects(
                4
                /* CONTENT */
              ));
              container = paint.container;
              curves = paint.curves;
              styles = container.styles;
              _i = 0, _a = container.textNodes;
              _c.label = 1;
            case 1:
              if (!(_i < _a.length))
                return [3, 4];
              child = _a[_i];
              return [4, this.renderTextNode(child, styles)];
            case 2:
              _c.sent();
              _c.label = 3;
            case 3:
              _i++;
              return [3, 1];
            case 4:
              if (!(container instanceof ImageElementContainer))
                return [3, 8];
              _c.label = 5;
            case 5:
              _c.trys.push([5, 7, , 8]);
              return [4, this.context.cache.match(container.src)];
            case 6:
              image2 = _c.sent();
              this.renderReplacedElement(container, curves, image2);
              return [3, 8];
            case 7:
              _c.sent();
              this.context.logger.error("Error loading image " + container.src);
              return [3, 8];
            case 8:
              if (container instanceof CanvasElementContainer) {
                this.renderReplacedElement(container, curves, container.canvas);
              }
              if (!(container instanceof SVGElementContainer))
                return [3, 12];
              _c.label = 9;
            case 9:
              _c.trys.push([9, 11, , 12]);
              return [4, this.context.cache.match(container.svg)];
            case 10:
              image2 = _c.sent();
              this.renderReplacedElement(container, curves, image2);
              return [3, 12];
            case 11:
              _c.sent();
              this.context.logger.error("Error loading svg " + container.svg.substring(0, 255));
              return [3, 12];
            case 12:
              if (!(container instanceof IFrameElementContainer && container.tree))
                return [3, 14];
              iframeRenderer = new CanvasRenderer2(this.context, {
                scale: this.options.scale,
                backgroundColor: container.backgroundColor,
                x: 0,
                y: 0,
                width: container.width,
                height: container.height
              });
              return [4, iframeRenderer.render(container.tree)];
            case 13:
              canvas = _c.sent();
              if (container.width && container.height) {
                this.ctx.drawImage(canvas, 0, 0, container.width, container.height, container.bounds.left, container.bounds.top, container.bounds.width, container.bounds.height);
              }
              _c.label = 14;
            case 14:
              if (container instanceof InputElementContainer) {
                size2 = Math.min(container.bounds.width, container.bounds.height);
                if (container.type === CHECKBOX) {
                  if (container.checked) {
                    this.ctx.save();
                    this.path([
                      new Vector(container.bounds.left + size2 * 0.39363, container.bounds.top + size2 * 0.79),
                      new Vector(container.bounds.left + size2 * 0.16, container.bounds.top + size2 * 0.5549),
                      new Vector(container.bounds.left + size2 * 0.27347, container.bounds.top + size2 * 0.44071),
                      new Vector(container.bounds.left + size2 * 0.39694, container.bounds.top + size2 * 0.5649),
                      new Vector(container.bounds.left + size2 * 0.72983, container.bounds.top + size2 * 0.23),
                      new Vector(container.bounds.left + size2 * 0.84, container.bounds.top + size2 * 0.34085),
                      new Vector(container.bounds.left + size2 * 0.39363, container.bounds.top + size2 * 0.79)
                    ]);
                    this.ctx.fillStyle = asString(INPUT_COLOR);
                    this.ctx.fill();
                    this.ctx.restore();
                  }
                } else if (container.type === RADIO) {
                  if (container.checked) {
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.arc(container.bounds.left + size2 / 2, container.bounds.top + size2 / 2, size2 / 4, 0, Math.PI * 2, true);
                    this.ctx.fillStyle = asString(INPUT_COLOR);
                    this.ctx.fill();
                    this.ctx.restore();
                  }
                }
              }
              if (isTextInputElement(container) && container.value.length) {
                _b = this.createFontStyle(styles), fontFamily2 = _b[0], fontSize2 = _b[1];
                baseline = this.fontMetrics.getMetrics(fontFamily2, fontSize2).baseline;
                this.ctx.font = fontFamily2;
                this.ctx.fillStyle = asString(styles.color);
                this.ctx.textBaseline = "alphabetic";
                this.ctx.textAlign = canvasTextAlign(container.styles.textAlign);
                bounds = contentBox(container);
                x = 0;
                switch (container.styles.textAlign) {
                  case 1:
                    x += bounds.width / 2;
                    break;
                  case 2:
                    x += bounds.width;
                    break;
                }
                textBounds = bounds.add(x, 0, 0, -bounds.height / 2 + 1);
                this.ctx.save();
                this.path([
                  new Vector(bounds.left, bounds.top),
                  new Vector(bounds.left + bounds.width, bounds.top),
                  new Vector(bounds.left + bounds.width, bounds.top + bounds.height),
                  new Vector(bounds.left, bounds.top + bounds.height)
                ]);
                this.ctx.clip();
                this.renderTextWithLetterSpacing(new TextBounds(container.value, textBounds), styles.letterSpacing, baseline);
                this.ctx.restore();
                this.ctx.textBaseline = "alphabetic";
                this.ctx.textAlign = "left";
              }
              if (!contains(
                container.styles.display,
                2048
                /* LIST_ITEM */
              ))
                return [3, 20];
              if (!(container.styles.listStyleImage !== null))
                return [3, 19];
              img = container.styles.listStyleImage;
              if (!(img.type === 0))
                return [3, 18];
              image2 = void 0;
              url = img.url;
              _c.label = 15;
            case 15:
              _c.trys.push([15, 17, , 18]);
              return [4, this.context.cache.match(url)];
            case 16:
              image2 = _c.sent();
              this.ctx.drawImage(image2, container.bounds.left - (image2.width + 10), container.bounds.top);
              return [3, 18];
            case 17:
              _c.sent();
              this.context.logger.error("Error loading list-style-image " + url);
              return [3, 18];
            case 18:
              return [3, 20];
            case 19:
              if (paint.listValue && container.styles.listStyleType !== -1) {
                fontFamily2 = this.createFontStyle(styles)[0];
                this.ctx.font = fontFamily2;
                this.ctx.fillStyle = asString(styles.color);
                this.ctx.textBaseline = "middle";
                this.ctx.textAlign = "right";
                bounds = new Bounds(container.bounds.left, container.bounds.top + getAbsoluteValue(container.styles.paddingTop, container.bounds.width), container.bounds.width, computeLineHeight(styles.lineHeight, styles.fontSize.number) / 2 + 1);
                this.renderTextWithLetterSpacing(new TextBounds(paint.listValue, bounds), styles.letterSpacing, computeLineHeight(styles.lineHeight, styles.fontSize.number) / 2 + 2);
                this.ctx.textBaseline = "bottom";
                this.ctx.textAlign = "left";
              }
              _c.label = 20;
            case 20:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    CanvasRenderer2.prototype.renderStackContent = function(stack2) {
      return __awaiter(this, void 0, void 0, function() {
        var _i, _a, child, _b, _c, child, _d, _e, child, _f, _g, child, _h, _j, child, _k, _l, child, _m, _o, child;
        return __generator(this, function(_p) {
          switch (_p.label) {
            case 0:
              if (contains(
                stack2.element.container.flags,
                16
                /* DEBUG_RENDER */
              )) {
                debugger;
              }
              return [4, this.renderNodeBackgroundAndBorders(stack2.element)];
            case 1:
              _p.sent();
              _i = 0, _a = stack2.negativeZIndex;
              _p.label = 2;
            case 2:
              if (!(_i < _a.length))
                return [3, 5];
              child = _a[_i];
              return [4, this.renderStack(child)];
            case 3:
              _p.sent();
              _p.label = 4;
            case 4:
              _i++;
              return [3, 2];
            case 5:
              return [4, this.renderNodeContent(stack2.element)];
            case 6:
              _p.sent();
              _b = 0, _c = stack2.nonInlineLevel;
              _p.label = 7;
            case 7:
              if (!(_b < _c.length))
                return [3, 10];
              child = _c[_b];
              return [4, this.renderNode(child)];
            case 8:
              _p.sent();
              _p.label = 9;
            case 9:
              _b++;
              return [3, 7];
            case 10:
              _d = 0, _e = stack2.nonPositionedFloats;
              _p.label = 11;
            case 11:
              if (!(_d < _e.length))
                return [3, 14];
              child = _e[_d];
              return [4, this.renderStack(child)];
            case 12:
              _p.sent();
              _p.label = 13;
            case 13:
              _d++;
              return [3, 11];
            case 14:
              _f = 0, _g = stack2.nonPositionedInlineLevel;
              _p.label = 15;
            case 15:
              if (!(_f < _g.length))
                return [3, 18];
              child = _g[_f];
              return [4, this.renderStack(child)];
            case 16:
              _p.sent();
              _p.label = 17;
            case 17:
              _f++;
              return [3, 15];
            case 18:
              _h = 0, _j = stack2.inlineLevel;
              _p.label = 19;
            case 19:
              if (!(_h < _j.length))
                return [3, 22];
              child = _j[_h];
              return [4, this.renderNode(child)];
            case 20:
              _p.sent();
              _p.label = 21;
            case 21:
              _h++;
              return [3, 19];
            case 22:
              _k = 0, _l = stack2.zeroOrAutoZIndexOrTransformedOrOpacity;
              _p.label = 23;
            case 23:
              if (!(_k < _l.length))
                return [3, 26];
              child = _l[_k];
              return [4, this.renderStack(child)];
            case 24:
              _p.sent();
              _p.label = 25;
            case 25:
              _k++;
              return [3, 23];
            case 26:
              _m = 0, _o = stack2.positiveZIndex;
              _p.label = 27;
            case 27:
              if (!(_m < _o.length))
                return [3, 30];
              child = _o[_m];
              return [4, this.renderStack(child)];
            case 28:
              _p.sent();
              _p.label = 29;
            case 29:
              _m++;
              return [3, 27];
            case 30:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    CanvasRenderer2.prototype.mask = function(paths) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(this.canvas.width, 0);
      this.ctx.lineTo(this.canvas.width, this.canvas.height);
      this.ctx.lineTo(0, this.canvas.height);
      this.ctx.lineTo(0, 0);
      this.formatPath(paths.slice(0).reverse());
      this.ctx.closePath();
    };
    CanvasRenderer2.prototype.path = function(paths) {
      this.ctx.beginPath();
      this.formatPath(paths);
      this.ctx.closePath();
    };
    CanvasRenderer2.prototype.formatPath = function(paths) {
      var _this = this;
      paths.forEach(function(point, index2) {
        var start = isBezierCurve(point) ? point.start : point;
        if (index2 === 0) {
          _this.ctx.moveTo(start.x, start.y);
        } else {
          _this.ctx.lineTo(start.x, start.y);
        }
        if (isBezierCurve(point)) {
          _this.ctx.bezierCurveTo(point.startControl.x, point.startControl.y, point.endControl.x, point.endControl.y, point.end.x, point.end.y);
        }
      });
    };
    CanvasRenderer2.prototype.renderRepeat = function(path, pattern, offsetX, offsetY) {
      this.path(path);
      this.ctx.fillStyle = pattern;
      this.ctx.translate(offsetX, offsetY);
      this.ctx.fill();
      this.ctx.translate(-offsetX, -offsetY);
    };
    CanvasRenderer2.prototype.resizeImage = function(image2, width, height) {
      var _a;
      if (image2.width === width && image2.height === height) {
        return image2;
      }
      var ownerDocument = (_a = this.canvas.ownerDocument) !== null && _a !== void 0 ? _a : document;
      var canvas = ownerDocument.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      var ctx = canvas.getContext("2d");
      ctx.drawImage(image2, 0, 0, image2.width, image2.height, 0, 0, width, height);
      return canvas;
    };
    CanvasRenderer2.prototype.renderBackgroundImage = function(container) {
      return __awaiter(this, void 0, void 0, function() {
        var index2, _loop_1, this_1, _i, _a, backgroundImage2;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              index2 = container.styles.backgroundImage.length - 1;
              _loop_1 = function(backgroundImage3) {
                var image2, url, _c, path, x, y, width, height, pattern, _d, path, x, y, width, height, _e, lineLength, x0, x1, y0, y1, canvas, ctx, gradient_1, pattern, _f, path, left, top_1, width, height, position2, x, y, _g, rx, ry, radialGradient_1, midX, midY, f2, invF;
                return __generator(this, function(_h) {
                  switch (_h.label) {
                    case 0:
                      if (!(backgroundImage3.type === 0))
                        return [3, 5];
                      image2 = void 0;
                      url = backgroundImage3.url;
                      _h.label = 1;
                    case 1:
                      _h.trys.push([1, 3, , 4]);
                      return [4, this_1.context.cache.match(url)];
                    case 2:
                      image2 = _h.sent();
                      return [3, 4];
                    case 3:
                      _h.sent();
                      this_1.context.logger.error("Error loading background-image " + url);
                      return [3, 4];
                    case 4:
                      if (image2) {
                        _c = calculateBackgroundRendering(container, index2, [
                          image2.width,
                          image2.height,
                          image2.width / image2.height
                        ]), path = _c[0], x = _c[1], y = _c[2], width = _c[3], height = _c[4];
                        pattern = this_1.ctx.createPattern(this_1.resizeImage(image2, width, height), "repeat");
                        this_1.renderRepeat(path, pattern, x, y);
                      }
                      return [3, 6];
                    case 5:
                      if (isLinearGradient(backgroundImage3)) {
                        _d = calculateBackgroundRendering(container, index2, [null, null, null]), path = _d[0], x = _d[1], y = _d[2], width = _d[3], height = _d[4];
                        _e = calculateGradientDirection(backgroundImage3.angle, width, height), lineLength = _e[0], x0 = _e[1], x1 = _e[2], y0 = _e[3], y1 = _e[4];
                        canvas = document.createElement("canvas");
                        canvas.width = width;
                        canvas.height = height;
                        ctx = canvas.getContext("2d");
                        gradient_1 = ctx.createLinearGradient(x0, y0, x1, y1);
                        processColorStops(backgroundImage3.stops, lineLength).forEach(function(colorStop) {
                          return gradient_1.addColorStop(colorStop.stop, asString(colorStop.color));
                        });
                        ctx.fillStyle = gradient_1;
                        ctx.fillRect(0, 0, width, height);
                        if (width > 0 && height > 0) {
                          pattern = this_1.ctx.createPattern(canvas, "repeat");
                          this_1.renderRepeat(path, pattern, x, y);
                        }
                      } else if (isRadialGradient(backgroundImage3)) {
                        _f = calculateBackgroundRendering(container, index2, [
                          null,
                          null,
                          null
                        ]), path = _f[0], left = _f[1], top_1 = _f[2], width = _f[3], height = _f[4];
                        position2 = backgroundImage3.position.length === 0 ? [FIFTY_PERCENT] : backgroundImage3.position;
                        x = getAbsoluteValue(position2[0], width);
                        y = getAbsoluteValue(position2[position2.length - 1], height);
                        _g = calculateRadius(backgroundImage3, x, y, width, height), rx = _g[0], ry = _g[1];
                        if (rx > 0 && ry > 0) {
                          radialGradient_1 = this_1.ctx.createRadialGradient(left + x, top_1 + y, 0, left + x, top_1 + y, rx);
                          processColorStops(backgroundImage3.stops, rx * 2).forEach(function(colorStop) {
                            return radialGradient_1.addColorStop(colorStop.stop, asString(colorStop.color));
                          });
                          this_1.path(path);
                          this_1.ctx.fillStyle = radialGradient_1;
                          if (rx !== ry) {
                            midX = container.bounds.left + 0.5 * container.bounds.width;
                            midY = container.bounds.top + 0.5 * container.bounds.height;
                            f2 = ry / rx;
                            invF = 1 / f2;
                            this_1.ctx.save();
                            this_1.ctx.translate(midX, midY);
                            this_1.ctx.transform(1, 0, 0, f2, 0, 0);
                            this_1.ctx.translate(-midX, -midY);
                            this_1.ctx.fillRect(left, invF * (top_1 - midY) + midY, width, height * invF);
                            this_1.ctx.restore();
                          } else {
                            this_1.ctx.fill();
                          }
                        }
                      }
                      _h.label = 6;
                    case 6:
                      index2--;
                      return [
                        2
                        /*return*/
                      ];
                  }
                });
              };
              this_1 = this;
              _i = 0, _a = container.styles.backgroundImage.slice(0).reverse();
              _b.label = 1;
            case 1:
              if (!(_i < _a.length))
                return [3, 4];
              backgroundImage2 = _a[_i];
              return [5, _loop_1(backgroundImage2)];
            case 2:
              _b.sent();
              _b.label = 3;
            case 3:
              _i++;
              return [3, 1];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    CanvasRenderer2.prototype.renderSolidBorder = function(color2, side, curvePoints) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          this.path(parsePathForBorder(curvePoints, side));
          this.ctx.fillStyle = asString(color2);
          this.ctx.fill();
          return [
            2
            /*return*/
          ];
        });
      });
    };
    CanvasRenderer2.prototype.renderDoubleBorder = function(color2, width, side, curvePoints) {
      return __awaiter(this, void 0, void 0, function() {
        var outerPaths, innerPaths;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (!(width < 3))
                return [3, 2];
              return [4, this.renderSolidBorder(color2, side, curvePoints)];
            case 1:
              _a.sent();
              return [
                2
                /*return*/
              ];
            case 2:
              outerPaths = parsePathForBorderDoubleOuter(curvePoints, side);
              this.path(outerPaths);
              this.ctx.fillStyle = asString(color2);
              this.ctx.fill();
              innerPaths = parsePathForBorderDoubleInner(curvePoints, side);
              this.path(innerPaths);
              this.ctx.fill();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    CanvasRenderer2.prototype.renderNodeBackgroundAndBorders = function(paint) {
      return __awaiter(this, void 0, void 0, function() {
        var styles, hasBackground, borders, backgroundPaintingArea, side, _i, borders_1, border;
        var _this = this;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              this.applyEffects(paint.getEffects(
                2
                /* BACKGROUND_BORDERS */
              ));
              styles = paint.container.styles;
              hasBackground = !isTransparent(styles.backgroundColor) || styles.backgroundImage.length;
              borders = [
                { style: styles.borderTopStyle, color: styles.borderTopColor, width: styles.borderTopWidth },
                { style: styles.borderRightStyle, color: styles.borderRightColor, width: styles.borderRightWidth },
                { style: styles.borderBottomStyle, color: styles.borderBottomColor, width: styles.borderBottomWidth },
                { style: styles.borderLeftStyle, color: styles.borderLeftColor, width: styles.borderLeftWidth }
              ];
              backgroundPaintingArea = calculateBackgroundCurvedPaintingArea(getBackgroundValueForIndex(styles.backgroundClip, 0), paint.curves);
              if (!(hasBackground || styles.boxShadow.length))
                return [3, 2];
              this.ctx.save();
              this.path(backgroundPaintingArea);
              this.ctx.clip();
              if (!isTransparent(styles.backgroundColor)) {
                this.ctx.fillStyle = asString(styles.backgroundColor);
                this.ctx.fill();
              }
              return [4, this.renderBackgroundImage(paint.container)];
            case 1:
              _a.sent();
              this.ctx.restore();
              styles.boxShadow.slice(0).reverse().forEach(function(shadow) {
                _this.ctx.save();
                var borderBoxArea = calculateBorderBoxPath(paint.curves);
                var maskOffset = shadow.inset ? 0 : MASK_OFFSET;
                var shadowPaintingArea = transformPath(borderBoxArea, -maskOffset + (shadow.inset ? 1 : -1) * shadow.spread.number, (shadow.inset ? 1 : -1) * shadow.spread.number, shadow.spread.number * (shadow.inset ? -2 : 2), shadow.spread.number * (shadow.inset ? -2 : 2));
                if (shadow.inset) {
                  _this.path(borderBoxArea);
                  _this.ctx.clip();
                  _this.mask(shadowPaintingArea);
                } else {
                  _this.mask(borderBoxArea);
                  _this.ctx.clip();
                  _this.path(shadowPaintingArea);
                }
                _this.ctx.shadowOffsetX = shadow.offsetX.number + maskOffset;
                _this.ctx.shadowOffsetY = shadow.offsetY.number;
                _this.ctx.shadowColor = asString(shadow.color);
                _this.ctx.shadowBlur = shadow.blur.number;
                _this.ctx.fillStyle = shadow.inset ? asString(shadow.color) : "rgba(0,0,0,1)";
                _this.ctx.fill();
                _this.ctx.restore();
              });
              _a.label = 2;
            case 2:
              side = 0;
              _i = 0, borders_1 = borders;
              _a.label = 3;
            case 3:
              if (!(_i < borders_1.length))
                return [3, 13];
              border = borders_1[_i];
              if (!(border.style !== 0 && !isTransparent(border.color) && border.width > 0))
                return [3, 11];
              if (!(border.style === 2))
                return [3, 5];
              return [4, this.renderDashedDottedBorder(
                border.color,
                border.width,
                side,
                paint.curves,
                2
                /* DASHED */
              )];
            case 4:
              _a.sent();
              return [3, 11];
            case 5:
              if (!(border.style === 3))
                return [3, 7];
              return [4, this.renderDashedDottedBorder(
                border.color,
                border.width,
                side,
                paint.curves,
                3
                /* DOTTED */
              )];
            case 6:
              _a.sent();
              return [3, 11];
            case 7:
              if (!(border.style === 4))
                return [3, 9];
              return [4, this.renderDoubleBorder(border.color, border.width, side, paint.curves)];
            case 8:
              _a.sent();
              return [3, 11];
            case 9:
              return [4, this.renderSolidBorder(border.color, side, paint.curves)];
            case 10:
              _a.sent();
              _a.label = 11;
            case 11:
              side++;
              _a.label = 12;
            case 12:
              _i++;
              return [3, 3];
            case 13:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    CanvasRenderer2.prototype.renderDashedDottedBorder = function(color2, width, side, curvePoints, style) {
      return __awaiter(this, void 0, void 0, function() {
        var strokePaths, boxPaths, startX, startY, endX, endY, length, dashLength, spaceLength, useLineDash, multiplier, numberOfDashes, minSpace, maxSpace, path1, path2, path1, path2;
        return __generator(this, function(_a) {
          this.ctx.save();
          strokePaths = parsePathForBorderStroke(curvePoints, side);
          boxPaths = parsePathForBorder(curvePoints, side);
          if (style === 2) {
            this.path(boxPaths);
            this.ctx.clip();
          }
          if (isBezierCurve(boxPaths[0])) {
            startX = boxPaths[0].start.x;
            startY = boxPaths[0].start.y;
          } else {
            startX = boxPaths[0].x;
            startY = boxPaths[0].y;
          }
          if (isBezierCurve(boxPaths[1])) {
            endX = boxPaths[1].end.x;
            endY = boxPaths[1].end.y;
          } else {
            endX = boxPaths[1].x;
            endY = boxPaths[1].y;
          }
          if (side === 0 || side === 2) {
            length = Math.abs(startX - endX);
          } else {
            length = Math.abs(startY - endY);
          }
          this.ctx.beginPath();
          if (style === 3) {
            this.formatPath(strokePaths);
          } else {
            this.formatPath(boxPaths.slice(0, 2));
          }
          dashLength = width < 3 ? width * 3 : width * 2;
          spaceLength = width < 3 ? width * 2 : width;
          if (style === 3) {
            dashLength = width;
            spaceLength = width;
          }
          useLineDash = true;
          if (length <= dashLength * 2) {
            useLineDash = false;
          } else if (length <= dashLength * 2 + spaceLength) {
            multiplier = length / (2 * dashLength + spaceLength);
            dashLength *= multiplier;
            spaceLength *= multiplier;
          } else {
            numberOfDashes = Math.floor((length + spaceLength) / (dashLength + spaceLength));
            minSpace = (length - numberOfDashes * dashLength) / (numberOfDashes - 1);
            maxSpace = (length - (numberOfDashes + 1) * dashLength) / numberOfDashes;
            spaceLength = maxSpace <= 0 || Math.abs(spaceLength - minSpace) < Math.abs(spaceLength - maxSpace) ? minSpace : maxSpace;
          }
          if (useLineDash) {
            if (style === 3) {
              this.ctx.setLineDash([0, dashLength + spaceLength]);
            } else {
              this.ctx.setLineDash([dashLength, spaceLength]);
            }
          }
          if (style === 3) {
            this.ctx.lineCap = "round";
            this.ctx.lineWidth = width;
          } else {
            this.ctx.lineWidth = width * 2 + 1.1;
          }
          this.ctx.strokeStyle = asString(color2);
          this.ctx.stroke();
          this.ctx.setLineDash([]);
          if (style === 2) {
            if (isBezierCurve(boxPaths[0])) {
              path1 = boxPaths[3];
              path2 = boxPaths[0];
              this.ctx.beginPath();
              this.formatPath([new Vector(path1.end.x, path1.end.y), new Vector(path2.start.x, path2.start.y)]);
              this.ctx.stroke();
            }
            if (isBezierCurve(boxPaths[1])) {
              path1 = boxPaths[1];
              path2 = boxPaths[2];
              this.ctx.beginPath();
              this.formatPath([new Vector(path1.end.x, path1.end.y), new Vector(path2.start.x, path2.start.y)]);
              this.ctx.stroke();
            }
          }
          this.ctx.restore();
          return [
            2
            /*return*/
          ];
        });
      });
    };
    CanvasRenderer2.prototype.render = function(element) {
      return __awaiter(this, void 0, void 0, function() {
        var stack2;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (this.options.backgroundColor) {
                this.ctx.fillStyle = asString(this.options.backgroundColor);
                this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height);
              }
              stack2 = parseStackingContexts(element);
              return [4, this.renderStack(stack2)];
            case 1:
              _a.sent();
              this.applyEffects([]);
              return [2, this.canvas];
          }
        });
      });
    };
    return CanvasRenderer2;
  }(Renderer)
);
var isTextInputElement = function(container) {
  if (container instanceof TextareaElementContainer) {
    return true;
  } else if (container instanceof SelectElementContainer) {
    return true;
  } else if (container instanceof InputElementContainer && container.type !== RADIO && container.type !== CHECKBOX) {
    return true;
  }
  return false;
};
var calculateBackgroundCurvedPaintingArea = function(clip, curves) {
  switch (clip) {
    case 0:
      return calculateBorderBoxPath(curves);
    case 2:
      return calculateContentBoxPath(curves);
    case 1:
    default:
      return calculatePaddingBoxPath(curves);
  }
};
var canvasTextAlign = function(textAlign2) {
  switch (textAlign2) {
    case 1:
      return "center";
    case 2:
      return "right";
    case 0:
    default:
      return "left";
  }
};
var iOSBrokenFonts = ["-apple-system", "system-ui"];
var fixIOSSystemFonts = function(fontFamilies) {
  return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? fontFamilies.filter(function(fontFamily2) {
    return iOSBrokenFonts.indexOf(fontFamily2) === -1;
  }) : fontFamilies;
};
var ForeignObjectRenderer = (
  /** @class */
  function(_super) {
    __extends(ForeignObjectRenderer2, _super);
    function ForeignObjectRenderer2(context, options) {
      var _this = _super.call(this, context, options) || this;
      _this.canvas = options.canvas ? options.canvas : document.createElement("canvas");
      _this.ctx = _this.canvas.getContext("2d");
      _this.options = options;
      _this.canvas.width = Math.floor(options.width * options.scale);
      _this.canvas.height = Math.floor(options.height * options.scale);
      _this.canvas.style.width = options.width + "px";
      _this.canvas.style.height = options.height + "px";
      _this.ctx.scale(_this.options.scale, _this.options.scale);
      _this.ctx.translate(-options.x, -options.y);
      _this.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + options.width + "x" + options.height + " at " + options.x + "," + options.y + ") with scale " + options.scale);
      return _this;
    }
    ForeignObjectRenderer2.prototype.render = function(element) {
      return __awaiter(this, void 0, void 0, function() {
        var svg, img;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              svg = createForeignObjectSVG(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, element);
              return [4, loadSerializedSVG(svg)];
            case 1:
              img = _a.sent();
              if (this.options.backgroundColor) {
                this.ctx.fillStyle = asString(this.options.backgroundColor);
                this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale);
              }
              this.ctx.drawImage(img, -this.options.x * this.options.scale, -this.options.y * this.options.scale);
              return [2, this.canvas];
          }
        });
      });
    };
    return ForeignObjectRenderer2;
  }(Renderer)
);
var loadSerializedSVG = function(svg) {
  return new Promise(function(resolve2, reject) {
    var img = new Image();
    img.onload = function() {
      resolve2(img);
    };
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  });
};
var Logger = (
  /** @class */
  function() {
    function Logger2(_a) {
      var id = _a.id, enabled2 = _a.enabled;
      this.id = id;
      this.enabled = enabled2;
      this.start = Date.now();
    }
    Logger2.prototype.debug = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (this.enabled) {
        if (typeof window !== "undefined" && window.console && typeof console.debug === "function") {
          console.debug.apply(console, __spreadArray([this.id, this.getTime() + "ms"], args));
        } else {
          this.info.apply(this, args);
        }
      }
    };
    Logger2.prototype.getTime = function() {
      return Date.now() - this.start;
    };
    Logger2.prototype.info = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (this.enabled) {
        if (typeof window !== "undefined" && window.console && typeof console.info === "function") {
          console.info.apply(console, __spreadArray([this.id, this.getTime() + "ms"], args));
        }
      }
    };
    Logger2.prototype.warn = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (this.enabled) {
        if (typeof window !== "undefined" && window.console && typeof console.warn === "function") {
          console.warn.apply(console, __spreadArray([this.id, this.getTime() + "ms"], args));
        } else {
          this.info.apply(this, args);
        }
      }
    };
    Logger2.prototype.error = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (this.enabled) {
        if (typeof window !== "undefined" && window.console && typeof console.error === "function") {
          console.error.apply(console, __spreadArray([this.id, this.getTime() + "ms"], args));
        } else {
          this.info.apply(this, args);
        }
      }
    };
    Logger2.instances = {};
    return Logger2;
  }()
);
var Context = (
  /** @class */
  function() {
    function Context2(options, windowBounds) {
      var _a;
      this.windowBounds = windowBounds;
      this.instanceName = "#" + Context2.instanceCount++;
      this.logger = new Logger({ id: this.instanceName, enabled: options.logging });
      this.cache = (_a = options.cache) !== null && _a !== void 0 ? _a : new Cache(this, options);
    }
    Context2.instanceCount = 1;
    return Context2;
  }()
);
var html2canvas = function(element, options) {
  if (options === void 0) {
    options = {};
  }
  return renderElement(element, options);
};
if (typeof window !== "undefined") {
  CacheStorage.setContext(window);
}
var renderElement = function(element, opts) {
  return __awaiter(void 0, void 0, void 0, function() {
    var ownerDocument, defaultView, resourceOptions, contextOptions, windowOptions, windowBounds, context, foreignObjectRendering, cloneOptions, documentCloner, clonedElement, container, _a, width, height, left, top, backgroundColor2, renderOptions, canvas, renderer, root, renderer;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    return __generator(this, function(_u) {
      switch (_u.label) {
        case 0:
          if (!element || typeof element !== "object") {
            return [2, Promise.reject("Invalid element provided as first argument")];
          }
          ownerDocument = element.ownerDocument;
          if (!ownerDocument) {
            throw new Error("Element is not attached to a Document");
          }
          defaultView = ownerDocument.defaultView;
          if (!defaultView) {
            throw new Error("Document is not attached to a Window");
          }
          resourceOptions = {
            allowTaint: (_b = opts.allowTaint) !== null && _b !== void 0 ? _b : false,
            imageTimeout: (_c = opts.imageTimeout) !== null && _c !== void 0 ? _c : 15e3,
            proxy: opts.proxy,
            useCORS: (_d = opts.useCORS) !== null && _d !== void 0 ? _d : false
          };
          contextOptions = __assign({ logging: (_e = opts.logging) !== null && _e !== void 0 ? _e : true, cache: opts.cache }, resourceOptions);
          windowOptions = {
            windowWidth: (_f = opts.windowWidth) !== null && _f !== void 0 ? _f : defaultView.innerWidth,
            windowHeight: (_g = opts.windowHeight) !== null && _g !== void 0 ? _g : defaultView.innerHeight,
            scrollX: (_h = opts.scrollX) !== null && _h !== void 0 ? _h : defaultView.pageXOffset,
            scrollY: (_j = opts.scrollY) !== null && _j !== void 0 ? _j : defaultView.pageYOffset
          };
          windowBounds = new Bounds(windowOptions.scrollX, windowOptions.scrollY, windowOptions.windowWidth, windowOptions.windowHeight);
          context = new Context(contextOptions, windowBounds);
          foreignObjectRendering = (_k = opts.foreignObjectRendering) !== null && _k !== void 0 ? _k : false;
          cloneOptions = {
            allowTaint: (_l = opts.allowTaint) !== null && _l !== void 0 ? _l : false,
            onclone: opts.onclone,
            ignoreElements: opts.ignoreElements,
            inlineImages: foreignObjectRendering,
            copyStyles: foreignObjectRendering
          };
          context.logger.debug("Starting document clone with size " + windowBounds.width + "x" + windowBounds.height + " scrolled to " + -windowBounds.left + "," + -windowBounds.top);
          documentCloner = new DocumentCloner(context, element, cloneOptions);
          clonedElement = documentCloner.clonedReferenceElement;
          if (!clonedElement) {
            return [2, Promise.reject("Unable to find element in cloned iframe")];
          }
          return [4, documentCloner.toIFrame(ownerDocument, windowBounds)];
        case 1:
          container = _u.sent();
          _a = isBodyElement(clonedElement) || isHTMLElement(clonedElement) ? parseDocumentSize(clonedElement.ownerDocument) : parseBounds(context, clonedElement), width = _a.width, height = _a.height, left = _a.left, top = _a.top;
          backgroundColor2 = parseBackgroundColor(context, clonedElement, opts.backgroundColor);
          renderOptions = {
            canvas: opts.canvas,
            backgroundColor: backgroundColor2,
            scale: (_o = (_m = opts.scale) !== null && _m !== void 0 ? _m : defaultView.devicePixelRatio) !== null && _o !== void 0 ? _o : 1,
            x: ((_p = opts.x) !== null && _p !== void 0 ? _p : 0) + left,
            y: ((_q = opts.y) !== null && _q !== void 0 ? _q : 0) + top,
            width: (_r = opts.width) !== null && _r !== void 0 ? _r : Math.ceil(width),
            height: (_s = opts.height) !== null && _s !== void 0 ? _s : Math.ceil(height)
          };
          if (!foreignObjectRendering)
            return [3, 3];
          context.logger.debug("Document cloned, using foreign object rendering");
          renderer = new ForeignObjectRenderer(context, renderOptions);
          return [4, renderer.render(clonedElement)];
        case 2:
          canvas = _u.sent();
          return [3, 5];
        case 3:
          context.logger.debug("Document cloned, element located at " + left + "," + top + " with size " + width + "x" + height + " using computed rendering");
          context.logger.debug("Starting DOM parsing");
          root = parseTree(context, clonedElement);
          if (backgroundColor2 === root.styles.backgroundColor) {
            root.styles.backgroundColor = COLORS.TRANSPARENT;
          }
          context.logger.debug("Starting renderer for element at " + renderOptions.x + "," + renderOptions.y + " with size " + renderOptions.width + "x" + renderOptions.height);
          renderer = new CanvasRenderer(context, renderOptions);
          return [4, renderer.render(root)];
        case 4:
          canvas = _u.sent();
          _u.label = 5;
        case 5:
          if ((_t = opts.removeContainer) !== null && _t !== void 0 ? _t : true) {
            if (!DocumentCloner.destroy(container)) {
              context.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore");
            }
          }
          context.logger.debug("Finished rendering");
          return [2, canvas];
      }
    });
  });
};
var parseBackgroundColor = function(context, element, backgroundColorOverride) {
  var ownerDocument = element.ownerDocument;
  var documentBackgroundColor = ownerDocument.documentElement ? parseColor(context, getComputedStyle(ownerDocument.documentElement).backgroundColor) : COLORS.TRANSPARENT;
  var bodyBackgroundColor = ownerDocument.body ? parseColor(context, getComputedStyle(ownerDocument.body).backgroundColor) : COLORS.TRANSPARENT;
  var defaultBackgroundColor = typeof backgroundColorOverride === "string" ? parseColor(context, backgroundColorOverride) : backgroundColorOverride === null ? COLORS.TRANSPARENT : 4294967295;
  return element === ownerDocument.documentElement ? isTransparent(documentBackgroundColor) ? isTransparent(bodyBackgroundColor) ? defaultBackgroundColor : bodyBackgroundColor : documentBackgroundColor : defaultBackgroundColor;
};
exports._export_sfc = _export_sfc;
exports.createSSRApp = createSSRApp;
exports.e = e$1;
exports.f = f$1;
exports.html2canvas = html2canvas;
exports.index = index;
exports.markRaw = markRaw;
exports.o = o;
exports.p = p;
exports.ref = ref;
exports.resolveComponent = resolveComponent;
exports.sr = sr;
exports.t = t;
exports.wx$1 = wx$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map
