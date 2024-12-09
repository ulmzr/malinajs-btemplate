var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/malinajs/runtime.js
function WatchObject(fn, cb) {
  this.fn = fn;
  this.cb = cb;
  this.value = NaN;
  this.cmp = null;
}
function $watch(fn, callback, option) {
  let w = new WatchObject(fn, callback);
  option && Object.assign(w, option);
  current_cd.watchers.push(w);
  return w;
}
function removeItem(array, item) {
  let i = array.indexOf(item);
  if (i >= 0) array.splice(i, 1);
}
function $ChangeDetector(parent) {
  this.parent = parent;
  this.children = [];
  this.watchers = [];
  this.prefix = [];
}
function cloneDeep(d, lvl) {
  if (lvl < 0 || !d) return d;
  if (isObject(d)) {
    if (d instanceof Date) return d;
    if (d instanceof Element) return d;
    if (isArray(d)) return d.map((i) => cloneDeep(i, lvl - 1));
    let r = {};
    for (let k in d) r[k] = cloneDeep(d[k], lvl - 1);
    return r;
  }
  return d;
}
function deepComparator(depth) {
  return function(w, value) {
    let diff = _compareDeep(w.value, value, depth);
    diff && (w.value = cloneDeep(value, depth), !w.idle && w.cb(value));
    w.idle = false;
  };
}
function $digest($cd, flag) {
  let loop = 10;
  let w;
  while (loop >= 0) {
    let index = 0;
    let queue = [];
    let i, value, cd = $cd, changes = 0;
    while (cd) {
      for (i = 0; i < cd.prefix.length; i++) cd.prefix[i]();
      for (i = 0; i < cd.watchers.length; i++) {
        w = cd.watchers[i];
        value = w.fn();
        if (w.value !== value) {
          flag[0] = 0;
          if (w.cmp) {
            w.cmp(w, value);
          } else {
            w.cb(w.value = value);
          }
          changes += flag[0];
        }
      }
      if (cd.children.length) queue.push.apply(queue, cd.children);
      cd = queue[index++];
    }
    loop--;
    if (!changes) break;
  }
  if (loop < 0) __app_onerror("Infinity changes: ", w);
}
function $tick(fn) {
  fn && resolvedPromise.then(fn);
  return resolvedPromise;
}
function ifBlock(label, fn, parts, parentLabel) {
  let first, last, $cd, destroyList, parentCD = current_cd;
  $onDestroy(() => safeGroupCall2(destroyList, destroyResults));
  function createBlock(builder) {
    let $dom;
    destroyList = current_destroyList = [];
    let mountList = current_mountList = [];
    $cd = current_cd = cd_new(parentCD);
    try {
      $dom = builder();
    } finally {
      current_destroyList = current_mountList = current_cd = null;
    }
    cd_attach(parentCD, $cd);
    if ($dom.nodeType == 11) {
      first = $dom.firstChild;
      last = $dom.lastChild;
    } else first = last = $dom;
    if (parentLabel) label.appendChild($dom);
    else label.parentNode.insertBefore($dom, label);
    safeGroupCall2(mountList, destroyList, 1);
  }
  function destroyBlock() {
    if (!first) return;
    destroyResults = [];
    safeGroupCall2(destroyList, destroyResults);
    destroyList.length = 0;
    if ($cd) {
      cd_detach($cd);
      $cd = null;
    }
    if (destroyResults.length) {
      let f = first, l = last;
      Promise.allSettled(destroyResults).then(() => {
        removeElements(f, l);
      });
    } else removeElements(first, last);
    first = last = null;
    destroyResults = null;
  }
  $watch(fn, (value) => {
    destroyBlock();
    if (value != null) createBlock(parts[value]);
  });
}
var current_destroyList, current_mountList, current_cd, destroyResults, $onDestroy, __app_onerror, isFunction, isObject, safeCall, safeGroupCall, safeGroupCall2, cd_component, cd_new, cd_attach, cd_detach, isArray, _compareDeep, compareDeep, keyComparator, fire, templatecache, htmlToFragment, iterNodes, removeElements, resolvedPromise, current_component, $context, makeApply, makeComponent, callComponent, callComponentDyn, attachDynComponent, bindText, makeBlock, mount, refer;
var init_runtime = __esm({
  "node_modules/malinajs/runtime.js"() {
    $onDestroy = (fn) => fn && current_destroyList.push(fn);
    __app_onerror = console.error;
    isFunction = (fn) => typeof fn == "function";
    isObject = (d) => typeof d == "object";
    safeCall = (fn) => {
      try {
        return fn?.();
      } catch (e) {
        __app_onerror(e);
      }
    };
    safeGroupCall = (list) => {
      try {
        list?.forEach((fn) => fn?.());
      } catch (e) {
        __app_onerror(e);
      }
    };
    safeGroupCall2 = (list, resultList, onlyFunction) => {
      list?.forEach((fn) => {
        let r = safeCall(fn);
        r && (!onlyFunction || isFunction(r)) && resultList.push(r);
      });
    };
    cd_component = (cd) => {
      while (cd.parent) cd = cd.parent;
      return cd.component;
    };
    cd_new = (parent) => new $ChangeDetector(parent);
    cd_attach = (parent, cd) => {
      if (cd) {
        cd.parent = parent;
        parent.children.push(cd);
      }
    };
    cd_detach = (cd) => removeItem(cd.parent.children, cd);
    isArray = (a) => Array.isArray(a);
    _compareDeep = (a, b, lvl) => {
      if (lvl < 0 || !a || !b) return a !== b;
      if (a === b) return false;
      let o0 = isObject(a);
      let o1 = isObject(b);
      if (!(o0 && o1)) return a !== b;
      let a0 = isArray(a);
      let a1 = isArray(b);
      if (a0 !== a1) return true;
      if (a0) {
        if (a.length !== b.length) return true;
        for (let i = 0; i < a.length; i++) {
          if (_compareDeep(a[i], b[i], lvl - 1)) return true;
        }
      } else if (a instanceof Date) {
        if (b instanceof Date) return +a !== +b;
      } else {
        let set = {};
        for (let k in a) {
          if (_compareDeep(a[k], b[k], lvl - 1)) return true;
          set[k] = true;
        }
        for (let k in b) {
          if (set[k]) continue;
          return true;
        }
      }
      return false;
    };
    compareDeep = deepComparator(10);
    keyComparator = (w, value) => {
      let diff = false;
      for (let k in value) {
        if (w.value[k] != value[k]) diff = true;
        w.value[k] = value[k];
      }
      diff && !w.idle && w.cb(value);
      w.idle = false;
    };
    fire = (w) => {
      let value = w.fn();
      if (w.cmp) w.cmp(w, value);
      else {
        w.value = value;
        w.cb(w.value);
      }
      return value;
    };
    templatecache = {};
    htmlToFragment = (html, option) => {
      let result = templatecache[html];
      if (!result) {
        let t = document.createElement("template");
        t.innerHTML = html.replace(/<>/g, "<!---->");
        result = t.content;
        if (!(option & 2) && result.firstChild == result.lastChild) result = result.firstChild;
        templatecache[html] = result;
      }
      return option & 1 ? result.cloneNode(true) : result;
    };
    iterNodes = (el, last, fn) => {
      let next;
      while (el) {
        next = el.nextSibling;
        fn(el);
        if (el == last) break;
        el = next;
      }
    };
    removeElements = (el, last) => iterNodes(el, last, (n) => n.remove());
    resolvedPromise = Promise.resolve();
    makeApply = () => {
      let $cd = current_component.$cd = current_cd = cd_new();
      $cd.component = current_component;
      let planned, flag = [0];
      let apply = (r) => {
        flag[0]++;
        if (planned) return r;
        planned = true;
        $tick(() => {
          try {
            $digest($cd, flag);
          } finally {
            planned = false;
          }
        });
        return r;
      };
      current_component.$apply = apply;
      current_component.$push = apply;
      apply();
      return apply;
    };
    makeComponent = (init) => {
      return ($option = {}) => {
        $context = $option.context || {};
        let prev_component = current_component, prev_cd = current_cd, $component = current_component = { $option };
        current_cd = null;
        try {
          $component.$dom = init($option);
        } finally {
          current_component = prev_component;
          current_cd = prev_cd;
          $context = null;
        }
        return $component;
      };
    };
    callComponent = (component, context, option = {}) => {
      option.context = { ...context };
      let $component = safeCall(() => component(option));
      if ($component instanceof Node) $component = { $dom: $component };
      return $component;
    };
    callComponentDyn = (component, context, option = {}, propFn, cmp, setter, classFn) => {
      let $component, parentWatch;
      if (propFn) {
        parentWatch = $watch(propFn, (value) => {
          $component.$push?.(value);
          $component.$apply?.();
        }, { value: {}, idle: true, cmp });
        option.props = fire(parentWatch);
      }
      if (classFn) {
        fire($watch(classFn, (value) => {
          option.$class = value;
          $component?.$apply?.();
        }, { value: {}, cmp: keyComparator }));
      }
      $component = callComponent(component, context, option);
      if (setter && $component?.$exportedProps) {
        let parentCD = current_cd, w = new WatchObject($component.$exportedProps, (value) => {
          setter(value);
          cd_component(parentCD).$apply();
          $component.$push(parentWatch.fn());
          $component.$apply();
        });
        Object.assign(w, { idle: true, cmp, value: parentWatch.value });
        $component.$cd.watchers.push(w);
      }
      return $component;
    };
    attachDynComponent = (label, exp, bind, parentLabel) => {
      let parentCD = current_cd;
      let destroyList, $cd, first;
      const destroy = () => safeGroupCall(destroyList);
      $onDestroy(destroy);
      $watch(exp, (component) => {
        destroy();
        if ($cd) cd_detach($cd);
        if (first) removeElements(first, parentLabel ? null : label.previousSibling);
        if (component) {
          destroyList = current_destroyList = [];
          current_mountList = [];
          $cd = current_cd = cd_new(parentCD);
          try {
            const $dom = bind(component).$dom;
            cd_attach(parentCD, $cd);
            first = $dom.nodeType == 11 ? $dom.firstChild : $dom;
            if (parentLabel) label.appendChild($dom);
            else label.parentNode.insertBefore($dom, label);
            safeGroupCall2(current_mountList, destroyList);
          } finally {
            current_destroyList = current_mountList = current_cd = null;
          }
        } else {
          $cd = first = destroyList = null;
        }
      });
    };
    bindText = (element, fn) => {
      $watch(() => "" + fn(), (value) => {
        element.textContent = value;
      });
    };
    makeBlock = (fr, fn) => {
      return (v) => {
        let $dom = fr.cloneNode(true);
        fn?.($dom, v);
        return $dom;
      };
    };
    mount = (label, component, option) => {
      let app, first, last, destroyList = current_destroyList = [];
      current_mountList = [];
      try {
        app = component(option);
        let $dom = app.$dom;
        delete app.$dom;
        if ($dom.nodeType == 11) {
          first = $dom.firstChild;
          last = $dom.lastChild;
        } else first = last = $dom;
        label.appendChild($dom);
        safeGroupCall2(current_mountList, destroyList);
      } finally {
        current_destroyList = current_mountList = null;
      }
      app.destroy = () => {
        safeGroupCall(destroyList);
        removeElements(first, last);
      };
      return app;
    };
    refer = (active, line) => {
      let result = [], i, v;
      const code = (x, d) => x.charCodeAt() - d;
      for (i = 0; i < line.length; i++) {
        let a = line[i];
        switch (a) {
          case ">":
            active = active.firstChild;
            break;
          case "+":
            active = active.firstChild;
          case ".":
            result.push(active);
            break;
          case "!":
            v = code(line[++i], 48) * 42 + code(line[++i], 48);
            while (v--) active = active.nextSibling;
            break;
          case "#":
            active = result[code(line[++i], 48) * 26 + code(line[++i], 48)];
            break;
          default:
            v = code(a, 0);
            if (v >= 97) active = result[v - 97];
            else {
              v -= 48;
              while (v--) active = active.nextSibling;
            }
        }
      }
      return result;
    };
  }
});

// src/Home.xht
var Home_exports = {};
__export(Home_exports, {
  default: () => Home_default
});
var Home_default;
var init_Home = __esm({
  "src/Home.xht"() {
    init_runtime();
    init_runtime();
    Home_default = ($option = {}) => {
      {
        const $parentElement = htmlToFragment(`<h1>Home page</h1>`, 1);
        return { $dom: $parentElement };
      }
    };
  }
});

// src/About.xht
var About_exports = {};
__export(About_exports, {
  default: () => About_default
});
var About_default;
var init_About = __esm({
  "src/About.xht"() {
    init_runtime();
    init_runtime();
    About_default = makeComponent(($option) => {
      const $$apply = makeApply();
      let $props = $option.props || {};
      let { params } = $props;
      current_component.$push = ($$props) => ({ params = params } = $props = $$props);
      current_component.$exportedProps = () => ({ params });
      {
        const $parentElement = htmlToFragment(`<h1> </h1>`, 1);
        let [el0] = refer($parentElement, "+");
        bindText(el0, () => `About ${params.name}`);
        return $parentElement;
      }
    });
  }
});

// src/Setting.xht
var Setting_exports = {};
__export(Setting_exports, {
  default: () => Setting_default
});
var Setting_default;
var init_Setting = __esm({
  "src/Setting.xht"() {
    init_runtime();
    init_runtime();
    Setting_default = makeComponent(($option) => {
      const $$apply = makeApply();
      let $props = $option.props || {};
      let { params } = $props;
      current_component.$push = ($$props) => ({ params = params } = $props = $$props);
      current_component.$exportedProps = () => ({ params });
      {
        const $parentElement = htmlToFragment(`<h1>Settings</h1>`, 1);
        return $parentElement;
      }
    });
  }
});

// src/Users.xht
var Users_exports = {};
__export(Users_exports, {
  default: () => Users_default
});
var Users_default;
var init_Users = __esm({
  "src/Users.xht"() {
    init_runtime();
    init_runtime();
    Users_default = ($option = {}) => {
      {
        const $parentElement = htmlToFragment(`<h1>Users</h1>`, 1);
        return { $dom: $parentElement };
      }
    };
  }
});

// src/Posts.xht
var Posts_exports = {};
__export(Posts_exports, {
  default: () => Posts_default
});
var Posts_default;
var init_Posts = __esm({
  "src/Posts.xht"() {
    init_runtime();
    init_runtime();
    Posts_default = ($option = {}) => {
      {
        const $parentElement = htmlToFragment(`<h1>Posts</h1>`, 1);
        return { $dom: $parentElement };
      }
    };
  }
});

// src/404.xht
var __exports = {};
__export(__exports, {
  default: () => __default
});
var __default;
var init__ = __esm({
  "src/404.xht"() {
    init_runtime();
    init_runtime();
    __default = ($option = {}) => {
      {
        const $parentElement = htmlToFragment(`<center><h1>404 | NOT FOUND</h1></center>`, 1);
        return { $dom: $parentElement };
      }
    };
  }
});

// src/main.js
init_runtime();

// src/App.xht
init_runtime();
init_runtime();

// node_modules/@dififa/spa-router/index.js
var Router = class {
  routes = [];
  notFoundComponent = null;
  matchCallback = null;
  on(path, componentPromise) {
    const keys = [];
    const regex = new RegExp(
      `^${path.replace(/:[^\s/]+/g, (match) => {
        keys.push(match.slice(1));
        return "([^/]+)";
      })}$`
    );
    this.routes.push({ regex, keys, componentPromise });
    return this;
  }
  on404(componentPromise) {
    this.notFoundComponent = componentPromise;
    return this;
  }
  async run(href) {
    const url = new URL(href, location.origin);
    const path = url.pathname;
    for (const { regex, keys, componentPromise } of this.routes) {
      const match = path.match(regex);
      if (match) {
        const params = keys.reduce((acc, key, i) => ({ ...acc, [key]: match[i + 1] }), {});
        const query = Object.fromEntries(url.searchParams.entries());
        try {
          const module = await componentPromise;
          this.matchCallback({
            cmp: module.default || module,
            params,
            query
          });
        } catch (err) {
          console.error("Failed to load component:", err);
        }
        return;
      }
    }
    if (this.notFoundComponent) {
      try {
        const module = await this.notFoundComponent;
        this.matchCallback({
          cmp: module.default || module,
          params: {},
          query: {}
        });
      } catch (err) {
        console.error("Failed to load 404 component:", err);
      }
    } else {
      console.log("404 | PAGE NOT FOUND");
    }
  }
  listen(callback) {
    this.matchCallback = callback;
    const handleLink = (evt) => {
      evt.preventDefault();
      const href = evt.currentTarget.getAttribute("href");
      if (location.pathname + location.search === href) {
        console.warn("Ignoring click: Already on the current page", href);
        return;
      }
      history.pushState({}, "", href);
      this.run(href);
    };
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("a[href]").forEach((link) => {
        link.addEventListener("click", handleLink);
      });
    });
    window.addEventListener("popstate", () => this.run(location.pathname + location.search));
    this.run(location.pathname + location.search);
    return this;
  }
};
var spa_router_default = Router;

// src/App.xht
init_Home();
init_About();
var App_default = makeComponent(($option) => {
  const $$apply = makeApply();
  const $context2 = $context;
  let name = "world";
  const componentCache = /* @__PURE__ */ new Map();
  async function loadComponent(path, importer) {
    $$apply();
    if (componentCache.has(path)) {
      return componentCache.get(path);
    }
    const component = await importer();
    $$apply();
    componentCache.set(path, component);
    return component;
  }
  let cmp, params = {}, query = {};
  const router = new spa_router_default();
  router.on("/", Promise.resolve().then(() => (init_Home(), Home_exports))).on("/about/:name", Promise.resolve().then(() => (init_About(), About_exports))).on("/setting", Promise.resolve().then(() => (init_Setting(), Setting_exports))).on("/users/:id", Promise.resolve().then(() => (init_Users(), Users_exports))).on("/posts/:postId/comments", Promise.resolve().then(() => (init_Posts(), Posts_exports))).on404(Promise.resolve().then(() => (init__(), __exports))).listen((matchedRoute) => {
    $$apply();
    ({ cmp, params, query } = matchedRoute);
  });
  {
    const $parentElement = htmlToFragment(`<ul><li><a href="/">Home</a></li><li><a href="/about/me">About</a></li><li><a href="/setting?about=setting">Setting</a></li><li><a href="/users/123?active=true">User 123</a></li><li><a href="/posts/456/comments?sort=latest">Comments for Post 456</a></li></ul> <>`, 3);
    let [el1] = refer($parentElement, ">2.");
    ifBlock(
      el1,
      () => cmp ? 0 : null,
      [makeBlock(htmlToFragment(` <> `, 2), ($parentElement2) => {
        let [el0] = refer($parentElement2, ">1.");
        attachDynComponent(el0, () => cmp, ($ComponentConstructor) => callComponentDyn(
          $ComponentConstructor,
          $context2,
          {},
          () => ({ params, query }),
          compareDeep
        ));
      })]
    );
    return $parentElement;
  }
});

// src/main.js
mount(document.body, App_default);
