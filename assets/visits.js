(function () {
  var key = "visit-count-off";
  var params = new URLSearchParams(location.search);
  if (params.has("me")) {
    if (params.get("me") === "0") localStorage.removeItem(key);
    else localStorage.setItem(key, "1");
    params.delete("me");
    var query = params.toString();
    history.replaceState(null, "", location.pathname + (query ? "?" + query : "") + location.hash);
  }
  if (localStorage.getItem(key) === "1") return;
  var script = document.createElement("script");
  script.async = true;
  script.src = "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
  document.body.appendChild(script);
})();
