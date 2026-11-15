(function () {
  var APPS = {
    epson: {
      name: "Epson",
      locales: true,
      pages: ["", "guide/", "guide/dashboard/", "guide/getting-started/", "guide/home-assistant-dashboard/", "guide/home-automation/", "guide/languages/", "guide/lens/", "guide/maintenance/", "guide/picture/", "guide/remote/", "guide/scenes/", "guide/settings/", "help/", "highlights/", "pricing/"]
    },
    jvc: {
      name: "JVC D-ILA",
      locales: true,
      pages: ["", "guide/", "guide/dashboard/", "guide/getting-started/", "guide/home-assistant/", "guide/home-assistant-dashboard/", "guide/home-automation/", "guide/languages/", "guide/lens/", "guide/maintenance/", "guide/picture/", "guide/remote/", "guide/scenes/", "guide/settings/", "help/", "highlights/", "pricing/", "privacy/"]
    }
  };
  var SAME = { "guide/home-assistant-dashboard/": "guide/home-assistant/", "guide/home-assistant/": "guide/home-assistant-dashboard/" };
  var ORDER = ["epson", "jvc"];

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function remember(app) {
    try { localStorage.setItem("app", app); } catch (e) {}
  }

  function where() {
    var m = location.pathname.match(/^\/(?:([a-z]{2}(?:-[a-z]+)?)\/)?(epson|jvc)\/(.*)$/);
    if (!m) return { app: null, locale: null, rest: "" };
    return { app: m[2], locale: m[1] || null, rest: m[3] };
  }

  function href(app, here) {
    var rest = "";
    if (here.app) {
      var mapped = SAME[here.rest] || here.rest;
      if (APPS[app].pages.indexOf(here.rest) >= 0) rest = here.rest;
      else if (APPS[app].pages.indexOf(mapped) >= 0) rest = mapped;
    }
    var locale = here.locale;
    if (!locale) {
      var saved = read("lang");
      if (saved && saved !== "en") locale = saved;
    }
    var prefix = APPS[app].locales && locale ? "/" + locale : "";
    return prefix + "/" + app + "/" + rest;
  }

  function mount() {
    var here = where();
    if (here.app) remember(here.app);
    var active = here.app || read("app");
    var wrap = document.querySelector("header.nav .wrap") || document.querySelector("header .wrap");
    if (!wrap || wrap.querySelector(".app-switch")) return;
    var box = document.createElement("div");
    box.className = "app-switch";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Projector brand");
    ORDER.forEach(function (app) {
      var a = document.createElement("a");
      a.href = href(app, here);
      a.textContent = APPS[app].name;
      a.setAttribute("data-app", app);
      if (app === active) {
        a.className = "on";
        if (here.app === app) a.setAttribute("aria-current", "true");
      }
      a.addEventListener("click", function () { remember(app); });
      box.appendChild(a);
    });
    var brand = wrap.querySelector(".brand");
    if (brand && brand.nextSibling) wrap.insertBefore(box, brand.nextSibling);
    else wrap.appendChild(box);
    var picks = document.querySelectorAll("[data-app-pick]");
    for (var i = 0; i < picks.length; i++) {
      picks[i].addEventListener("click", function (e) { remember(e.currentTarget.getAttribute("data-app-pick")); });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
