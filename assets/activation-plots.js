(function () {
  var NS = "http://www.w3.org/2000/svg";
  var W = 720, H = 320, ML = 46, MR = 18, MT = 16, MB = 34;
  var PW = W - ML - MR, PH = H - MT - MB;

  function erf(x) {
    var s = Math.sign(x), a = Math.abs(x);
    var t = 1 / (1 + 0.3275911 * a);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
    return s * y;
  }
  function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
  function softplus(x) { return x > 20 ? x : Math.log1p(Math.exp(x)); }
  var F = {
    sigmoid: sigmoid,
    softmax: sigmoid,
    tanh: Math.tanh,
    relu: function (x) { return Math.max(0, x); },
    leaky: function (x) { return x >= 0 ? x : 0.25 * x; },
    prelu: function (x) { return x >= 0 ? x : 0.5 * x; },
    elu: function (x) { return x >= 0 ? x : Math.exp(x) - 1; },
    selu: function (x) {
      var lam = 1.0507009873554805, alpha = 1.6732632423543772;
      return x > 0 ? lam * x : lam * alpha * (Math.exp(x) - 1);
    },
    softplus: softplus,
    gelu: function (x) { return 0.5 * x * (1 + erf(x / Math.SQRT2)); },
    silu: function (x) { return x * sigmoid(x); },
    mish: function (x) { return x * Math.tanh(softplus(x)); },
    hardswish: function (x) { return x * Math.min(Math.max(0, x + 3), 6) / 6; }
  };

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    return node;
  }

  function draw(svg) {
    var fn = F[svg.dataset.fn];
    if (!fn) return;
    var xmin = +svg.dataset.xmin, xmax = +svg.dataset.xmax;
    var ymin = +svg.dataset.ymin, ymax = +svg.dataset.ymax;
    var xt = svg.dataset.xticks.split(",").map(Number);
    var yt = svg.dataset.yticks.split(",").map(Number);
    function sx(x) { return ML + (x - xmin) / (xmax - xmin) * PW; }
    function sy(y) { return MT + (ymax - y) / (ymax - ymin) * PH; }
    function fmtTick(v) {
      if (Math.abs(v) < 1e-9) return "0";
      if (Math.abs(v - Math.round(v)) < 1e-6) return String(Math.round(v));
      return String(Math.round(v * 100) / 100);
    }

    if (ymin < 0 && ymax > 0) {
      var y0 = sy(0).toFixed(1);
      svg.appendChild(el("line", { class: "fn-zero", x1: ML, y1: y0, x2: W - MR, y2: y0 }));
    }
    if (xmin < 0 && xmax > 0) {
      var x0 = sx(0).toFixed(1);
      svg.appendChild(el("line", { class: "fn-hair", x1: x0, y1: MT, x2: x0, y2: MT + PH }));
    }
    xt.forEach(function (v) {
      svg.appendChild(el("text", { class: "fn-tick", x: sx(v).toFixed(1), y: H - 10, "text-anchor": "middle" })).textContent = fmtTick(v);
    });
    yt.forEach(function (v) {
      svg.appendChild(el("text", { class: "fn-tick", x: ML - 8, y: (sy(v) + 4).toFixed(1), "text-anchor": "end" })).textContent = fmtTick(v);
    });

    var d = [];
    for (var i = 0; i < 361; i++) {
      var x = xmin + (xmax - xmin) * i / 360;
      d.push((i ? "L" : "M") + sx(x).toFixed(1) + " " + sy(fn(x)).toFixed(1));
    }
    svg.appendChild(el("path", { class: "fn-curve", d: d.join(" ") }));
    var handle = el("circle", { class: "fn-handle", r: "11" });
    svg.appendChild(handle);
    var readout = svg.parentNode.querySelector(".fn-readout");

    function setX(x) {
      x = Math.min(xmax, Math.max(xmin, x));
      var y = fn(x);
      handle.setAttribute("cx", sx(x).toFixed(1));
      handle.setAttribute("cy", sy(y).toFixed(1));
      if (readout) readout.textContent = "x = " + x.toFixed(2) + "，f(x) = " + y.toFixed(2);
    }
    function xFromEvent(event) {
      var point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      var ctm = svg.getScreenCTM();
      if (!ctm) return 0;
      var local = point.matrixTransform(ctm.inverse());
      return xmin + (local.x - ML) / PW * (xmax - xmin);
    }
    setX(0);
    svg.addEventListener("pointerdown", function (event) {
      svg.setPointerCapture(event.pointerId);
      svg.dataset.dragging = "1";
      setX(xFromEvent(event));
    });
    svg.addEventListener("pointermove", function (event) {
      if (svg.dataset.dragging !== "1") return;
      setX(xFromEvent(event));
    });
    function stop() { delete svg.dataset.dragging; }
    svg.addEventListener("pointerup", stop);
    svg.addEventListener("pointercancel", stop);
  }

  document.querySelectorAll(".fn-plot svg").forEach(draw);
})();
