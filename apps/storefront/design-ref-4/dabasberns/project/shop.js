// Dabasberns — shared shop/header chrome.
// Inline-loaded early in <head> so there's no theme flash.
(function () {
  var KEY = "db.theme";
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === "night" || saved === "day") {
    document.documentElement.setAttribute("data-theme", saved);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // ----- Theme toggle (works on all pages) -----
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cur = document.documentElement.getAttribute("data-theme") === "night" ? "night" : "day";
        var next = cur === "night" ? "day" : "night";
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
        // Landing page exposes window.applyPalette to sync the parallax scene tokens
        if (typeof window.applyPalette === "function") {
          try { window.applyPalette(next); } catch (e) {}
        }
      });
    });

    // ----- Generic slide-in panel helper -----
    function wirePanel(panelId, overlayId, openSelector, closeSelector) {
      var p = document.getElementById(panelId);
      var o = document.getElementById(overlayId);
      if (!p || !o) return null;

      function open() {
        p.classList.add("open");
        o.classList.add("open");
        p.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
      function close() {
        p.classList.remove("open");
        o.classList.remove("open");
        p.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
      document.querySelectorAll(openSelector).forEach(function (b) {
        b.addEventListener("click", function (e) { e.preventDefault(); open(); });
      });
      document.querySelectorAll(closeSelector).forEach(function (b) {
        b.addEventListener("click", function (e) { e.preventDefault(); close(); });
      });
      o.addEventListener("click", close);
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && p.classList.contains("open")) close();
      });
      // Close menu when a link inside it is clicked (navigating away)
      if (panelId === "menu-panel") {
        p.querySelectorAll("a[href]").forEach(function (a) {
          a.addEventListener("click", function () {
            // For same-page hashes we still want to close. Real nav reloads anyway.
            close();
          });
        });
      }
      return { open: open, close: close, panel: p };
    }

    wirePanel("menu-panel", "menu-overlay", "[data-open-menu]", "[data-close-menu]");

    // ----- Cart side panel -----
    wirePanel("cart-panel", "cart-overlay", "[data-open-cart]", "[data-close-cart]");

    var panel = document.getElementById("cart-panel");
    if (!panel) return;

    // ----- Cart qty & remove (demo only) -----
    panel.querySelectorAll(".cart-item").forEach(function (item) {
      var btns = item.querySelectorAll(".qty-mini button");
      var vEl = item.querySelector(".qty-mini .v");
      btns.forEach(function (b, i) {
        b.addEventListener("click", function () {
          var v = parseInt(vEl.textContent, 10) || 1;
          v = i === 0 ? Math.max(1, v - 1) : Math.min(9, v + 1);
          vEl.textContent = v;
          recalc();
        });
      });
      var rm = item.querySelector(".rm");
      if (rm) rm.addEventListener("click", function () {
        item.remove();
        recalc();
      });
    });

    function recalc() {
      var items = panel.querySelectorAll(".cart-item");
      var sub = 0;
      items.forEach(function (it) {
        var price = parseFloat(it.querySelector(".price").dataset.unit || 0);
        var qty = parseInt(it.querySelector(".qty-mini .v").textContent, 10) || 1;
        sub += price * qty;
        it.querySelector(".price").textContent =
          "€" + (price * qty).toFixed(price % 1 ? 2 : 0).replace(/\.00$/, "");
      });
      var subEl = panel.querySelector(".subtotal .v");
      if (subEl) subEl.textContent = "€" + sub.toFixed(sub % 1 ? 2 : 0).replace(/\.00$/, "");
      var cntEl = panel.querySelector(".cart-head .cnt");
      if (cntEl) cntEl.textContent = items.length + (items.length === 1 ? " item" : " items");
      var badge = document.querySelector(".cart-btn .badge");
      if (badge) badge.textContent = items.length;
      // empty state
      var list = panel.querySelector(".cart-items");
      if (items.length === 0 && list && !list.querySelector(".cart-empty")) {
        list.innerHTML =
          '<div class="cart-empty">' +
          '<div style="font-family:var(--font-display); font-size:18px; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink);">Bench is empty</div>' +
          '<div style="font-size:14px; max-width:28ch;">Nothing on the workbench yet. Wander the shop and add something quiet.</div>' +
          '<a href="category.html" style="margin-top:10px; font-size:11px; letter-spacing:0.24em; text-transform:uppercase; color:var(--accent-deep); border-bottom:1px solid currentColor; padding-bottom:2px; text-decoration:none;">Browse rods →</a>' +
          '</div>';
      }
    }
  });
})();
