/* =====================================================================
   Fort Leonard Wood Digital Tour — Demo application logic
   Vanilla JS. Demonstrates: responsive PWA, interactive map (MapLibre),
   POIs, two tours, specialized search, browser narration (Web Speech),
   optional browser geofencing simulation, privacy-first (no accounts).
   ===================================================================== */
(function () {
  "use strict";

  var state = {
    view: "home",
    activeTour: "history",
    activePOI: null,
    detailTab: "overview",
    locationOn: false,
    searchFilter: "all",
    map: null,
    markers: [],
    routeAdded: false
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- icons (inline SVG) ---------- */
  var IC = {
    star: '<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.8 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 10-.7.7l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>',
    tours: '<svg viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z"/></svg>',
    map: '<svg viewBox="0 0 24 24"><path d="M15 4l-6 2-6-2v16l6 2 6-2 6 2V4l-6 2zm-6 2.5l6 2v9.5l-6-2z"/></svg>',
    near: '<svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 00-8 8c0 5.2 8 12 8 12s8-6.8 8-12a8 8 0 00-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15.5 4l-8 8 8 8 1.5-1.5L10.5 12l6-6z"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.3-8.6C1 9.3 2.5 6 5.7 6c1.9 0 3.2 1.1 3.9 2.3C10.3 7.1 11.6 6 13.5 6c3.2 0 4.7 3.3 3 6.4C19.3 16.5 12 21 12 21z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M18 16a3 3 0 00-2.3 1.1L9 13.5a3 3 0 000-3l6.7-3.6A3 3 0 1015 5l-6.7 3.6a3 3 0 100 6.8L15 19a3 3 0 103-3z"/></svg>',
    dir: '<svg viewBox="0 0 24 24"><path d="M21.7 11.3l-9-9a1 1 0 00-1.4 0l-9 9a1 1 0 000 1.4l9 9a1 1 0 001.4 0l9-9a1 1 0 000-1.4zM14 14.5V12h-4v3H8v-4a1 1 0 011-1h5V7.5l3.5 3.5z"/></svg>',
    video: '<svg viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11z"/></svg>',
    image: '<svg viewBox="0 0 24 24"><path d="M21 5H3v14h18zM6 15l3-4 2 3 3-4 4 5z"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 00-10 0v2H5v12h14V9zm-8 0V7a3 3 0 016 0v2z"/></svg>',
    geo: '<svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 3h-2.1A7 7 0 0013 5.1V3h-2v2.1A7 7 0 005.1 11H3v2h2.1A7 7 0 0011 18.9V21h2v-2.1A7 7 0 0018.9 13H21z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19 20 8l-1.5-1.5z"/></svg>'
  };

  /* ---------- gradient per category (stands in for FLW imagery) ---------- */
  function poiGradient(p) {
    var map = {
      "Memorial": "linear-gradient(135deg,#5c6b3f,#333f25)",
      "Museum": "linear-gradient(135deg,#3a6ea5,#1b3b5f)",
      "Historic Site": "linear-gradient(135deg,#7a6a4a,#4a3f2c)",
      "Visitor Support": "linear-gradient(135deg,#2f8f86,#1b5f57)"
    };
    return map[p.category] || "linear-gradient(135deg,#6b7a4f,#3f4d2e)";
  }

  /* ---------- rough distance between two [lon,lat] in miles ---------- */
  function miles(a, b) {
    var R = 3958.8, dLat = (b[1] - a[1]) * Math.PI / 180, dLon = (b[0] - a[0]) * Math.PI / 180;
    var la1 = a[1] * Math.PI / 180, la2 = b[1] * Math.PI / 180;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  /* ================= NAVIGATION ================= */
  function go(view) {
    state.view = view;
    $$(".view").forEach(function (v) { v.classList.toggle("active", v.id === "view-" + view); });
    $$(".tabbar button").forEach(function (b) { b.classList.toggle("active", b.dataset.view === view); });
    if (view === "map") { setTimeout(ensureMap, 30); }
    var body = $(".app-body"); if (body) body.scrollTop = 0;
    $$(".view").forEach(function (v) { v.scrollTop = 0; });
  }

  /* ================= HOME / HISTORY ================= */
  function renderHome() {
    var el = $("#view-home");
    el.innerHTML =
      '<div class="hero">' +
        '<div class="kicker">U.S. Army Garrison</div>' +
        '<h1>Fort Leonard Wood<br>Self-Guided Digital Tour</h1>' +
        '<p>Explore the history of Fort Leonard Wood and take an interactive, self-guided tour of its historic sites, memorials, and museums — from any phone, tablet, or computer. No app to download.</p>' +
        '<div class="cta">' +
          '<button class="btn btn-teal" data-act="start-history">' + IC.tours + ' Start a Tour</button>' +
          '<button class="btn btn-ghost" data-act="open-map">' + IC.map + ' Open Map</button>' +
        '</div>' +
      '</div>' +
      '<div class="privacy-strip">' + IC.lock +
        '<span><b>Privacy-first.</b> No account, no registration, no personal data collected. Location is optional and stays on your device.</span>' +
      '</div>' +
      '<div class="scroll-pad">' +
        '<div class="section-title">The History of Fort Leonard Wood</div>' +
        '<div class="hist-card">' +
          '<h3>Building Strength Since 1940</h3>' +
          '<p>Established in 1940, Fort Leonard Wood grew rapidly to train Soldiers for World War II and has since become the U.S. Army\'s Maneuver Support Center of Excellence — home to the Engineer, Military Police, and Chemical Corps regiments. This tour brings that history to life at the places where it happened.</p>' +
          '<p style="margin-bottom:16px"><span class="badge-508">' + IC.check + ' Section 508 / WCAG accessible</span></p>' +
        '</div>' +
        '<div class="section-title">Available Tours</div>' +
        '<div id="home-tours"></div>' +
        '<div class="section-title">Featured Stops</div>' +
        '<div id="home-featured"></div>' +
        '<p class="note" style="margin-top:18px"><b>Demonstration note:</b> This is a working demonstration of the proposed platform. Historical text, imagery, audio, names, and map coordinates shown here are notional placeholders. In production, all content is provided and approved by Fort Leonard Wood.</p>' +
      '</div>';

    var ht = $("#home-tours");
    ht.innerHTML = TOURS.map(tourCardHTML).join("");
    var feat = $("#home-featured");
    feat.innerHTML = ["sapper-grove", "engineer-museum", "historic-district"].map(function (id) {
      return poiRowHTML(POI_BY_ID[id], null);
    }).join("");
  }

  function tourCardHTML(t) {
    return '<div class="tour-card" data-tour="' + t.id + '">' +
      '<div class="row">' +
        '<div class="badge" style="background:' + t.color + '">' + IC.tours + '</div>' +
        '<div style="flex:1"><h3>' + t.title + '<span class="chip">' + t.stops.length + ' stops</span></h3>' +
        '<div class="sub">' + t.subtitle + '</div></div>' +
      '</div>' +
      '<div class="meta"><span>📍 <b>' + t.stops.length + '</b> points of interest</span>' +
      '<span>🚗 <b>' + t.distance + '</b></span><span>⏱ <b>' + t.duration + '</b></span></div>' +
    '</div>';
  }

  /* ================= TOURS VIEW ================= */
  function renderTours() {
    var el = $("#view-tours");
    el.innerHTML = '<div class="scroll-pad">' +
      '<div class="section-title">Choose a Tour</div>' +
      TOURS.map(function (t) {
        var stops = t.stops.map(function (id) { return POI_BY_ID[id]; });
        return '<div class="tour-card" data-tour="' + t.id + '">' +
          '<div class="row"><div class="badge" style="background:' + t.color + '">' + IC.tours + '</div>' +
          '<div style="flex:1"><h3>' + t.title + '</h3><div class="sub">' + t.subtitle + '</div></div></div>' +
          '<div class="meta"><span>📍 <b>' + t.stops.length + '</b> stops</span><span>🚗 <b>' + t.distance + '</b></span><span>⏱ <b>' + t.duration + '</b></span></div>' +
          '<div style="margin-top:12px">' + stops.map(function (p, i) {
            return poiRowHTML(p, i + 1);
          }).join("") + '</div>' +
          '<button class="btn btn-primary btn-block" style="margin-top:6px" data-viewtour="' + t.id + '">' + IC.map + ' View on Map</button>' +
        '</div>';
      }).join("") +
    '</div>';
  }

  function poiRowHTML(p, num) {
    return '<div class="poi-row" data-poi="' + p.id + '">' +
      (num ? '<div class="num">' + num + '</div>' : '') +
      '<div style="flex:1;min-width:0"><div class="cat">' + p.category + '</div>' +
      '<h4>' + p.title + '</h4><div class="sub">' + p.subtitle + '</div></div>' +
      (num ? '' : '<div class="dist">›</div>') +
    '</div>';
  }

  /* ================= MAP VIEW ================= */
  function pinSVG(color) {
    return '<svg viewBox="0 0 30 38"><path d="M15 0C6.7 0 0 6.7 0 15c0 10 15 23 15 23s15-13 15-23C30 6.7 23.3 0 15 0z" fill="' + color + '"/></svg>';
  }

  function ensureMap() {
    if (state.map) { state.map.resize(); drawTour(state.activeTour); return; }
    if (typeof maplibregl === "undefined") { showMapFallback(); return; }
    try {
      state.map = new maplibregl.Map({
        container: "map",
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors (open-source data)"
            }
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }]
        },
        center: FLW.center,
        zoom: FLW.defaultZoom,
        attributionControl: true
      });
      state.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
      state.map.on("load", function () { drawTour(state.activeTour); });
      state.map.on("error", function () {/* tile errors are non-fatal for the demo */});
    } catch (e) { showMapFallback(); }
  }

  function showMapFallback() {
    var mp = $("#map");
    if (mp) mp.innerHTML = '<div style="position:absolute;inset:0;display:grid;place-items:center;' +
      'background:#e9ece6;color:#5b6472;text-align:center;padding:30px;font-size:14px">' +
      'Interactive map requires an internet connection to load open-source map tiles.<br><br>' +
      'Use the <b>list view</b> button to browse all stops offline.</div>';
    var lt = $("#list-alt"); if (lt) lt.classList.add("active");
  }

  function clearMarkers() {
    state.markers.forEach(function (m) { m.remove(); });
    state.markers = [];
  }

  function drawTour(tourId) {
    state.activeTour = tourId;
    $$(".map-tour-switch button").forEach(function (b) { b.classList.toggle("active", b.dataset.mtour === tourId); });
    renderListAlt();
    if (!state.map || !state.map.isStyleLoaded()) {
      if (state.map) state.map.once("idle", function () { drawTour(tourId); });
      return;
    }
    var tour = TOUR_BY_ID[tourId];
    var coords = tour.stops.map(function (id) { return POI_BY_ID[id].coords; });

    // route line
    var geo = { type: "Feature", geometry: { type: "LineString", coordinates: coords } };
    if (state.map.getSource("route")) {
      state.map.getSource("route").setData(geo);
      state.map.setPaintProperty("route-line", "line-color", tour.color);
    } else {
      state.map.addSource("route", { type: "geojson", data: geo });
      state.map.addLayer({
        id: "route-line", type: "line", source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": tour.color, "line-width": 4, "line-opacity": .85 }
      });
    }

    // markers
    clearMarkers();
    tour.stops.forEach(function (id, i) {
      var p = POI_BY_ID[id];
      var color = p.category === "Museum" ? "#2f8f86" : "#1b3b5f";
      var elm = document.createElement("div");
      elm.className = "marker";
      elm.innerHTML = pinSVG(color) + '<div class="num">' + (i + 1) + '</div>';
      elm.addEventListener("click", function () { openMapCard(p); });
      var mk = new maplibregl.Marker({ element: elm, anchor: "bottom" }).setLngLat(p.coords).addTo(state.map);
      state.markers.push(mk);
    });

    // fit
    var b = new maplibregl.LngLatBounds();
    coords.forEach(function (c) { b.extend(c); });
    state.map.fitBounds(b, { padding: { top: 80, bottom: 80, left: 60, right: 60 }, maxZoom: 15, duration: 500 });

    openMapCard(POI_BY_ID[tour.stops[1] || tour.stops[0]]);
  }

  function openMapCard(p) {
    var host = $("#map-card");
    var tour = TOUR_BY_ID[state.activeTour];
    var idx = tour.stops.indexOf(p.id);
    var next = idx >= 0 && idx < tour.stops.length - 1 ? POI_BY_ID[tour.stops[idx + 1]] : null;
    var dist = next ? miles(p.coords, next.coords).toFixed(1) + " mi · " + Math.max(2, Math.round(miles(p.coords, next.coords) / 25 * 60)) + " min" : "Selected stop";
    host.style.display = "block";
    host.innerHTML =
      '<div class="thumb" style="background:' + poiGradient(p) + '">' + IC.image +
        '<div class="noimg">Imagery provided by FLW</div></div>' +
      '<div class="body">' +
        '<h3>' + p.title + '</h3><div class="sub">' + p.subtitle + '</div>' +
        '<p>' + p.short + '</p>' +
        '<button class="btn btn-primary btn-block" data-poi="' + p.id + '">View Details</button>' +
        '<div class="dir">' + IC.dir + ' Directions &nbsp; ' + dist + '</div>' +
      '</div>';
  }

  function renderListAlt() {
    var lt = $("#list-alt-body");
    if (!lt) return;
    var tour = TOUR_BY_ID[state.activeTour];
    lt.innerHTML = '<div class="scroll-pad"><div class="section-title">' + tour.title + ' — All Stops (list view)</div>' +
      tour.stops.map(function (id, i) { return poiRowHTML(POI_BY_ID[id], i + 1); }).join("") + '</div>';
  }

  /* ================= POI DETAIL ================= */
  function openPOI(id) {
    state.activePOI = id;
    state.detailTab = "overview";
    var p = POI_BY_ID[id];
    var tour = TOUR_BY_ID[state.activeTour];
    var idx = tour.stops.indexOf(id);
    // nearby = other stops on active tour, by distance
    var nearby = POIS.filter(function (x) { return x.id !== id; })
      .map(function (x) { return { p: x, d: miles(p.coords, x.coords) }; })
      .sort(function (a, b) { return a.d - b.d; }).slice(0, 3);

    var el = $("#view-detail");
    el.innerHTML =
      '<div class="detail-hero" style="background:' + poiGradient(p) + '">' +
        '<div class="grad"></div>' +
        '<button class="back" data-act="back">' + IC.back + '</button>' +
        '<div class="fav"><button title="Share">' + IC.share + '</button><button title="Save">' + IC.heart + '</button></div>' +
        '<div class="noimg">Imagery provided by Fort Leonard Wood</div>' +
        '<div class="cap"><h2>' + p.title + '</h2><div class="sub">' + p.subtitle + '</div></div>' +
      '</div>' +
      '<div class="detail-body">' +
        (p.geofence ? '<div style="margin-top:14px"><span class="geo-pill">' + IC.geo + ' Geofenced · autoplay within ' + p.geofence + ' m</span></div>' : '') +
        '<div class="tabs">' +
          '<button data-tab="overview" class="active">Overview</button>' +
          '<button data-tab="history">History</button>' +
          '<button data-tab="media">Media</button>' +
          '<button data-tab="directions">Directions</button>' +
        '</div>' +
        '<div class="tab-panel active" id="tab-overview">' +
          '<p>' + p.short + '</p>' + narrationHTML(p) +
        '</div>' +
        '<div class="tab-panel" id="tab-history"><p>' + p.history + '</p>' + narrationHTML(p, true) + '</div>' +
        '<div class="tab-panel" id="tab-media">' + mediaHTML(p) + '</div>' +
        '<div class="tab-panel" id="tab-directions">' + directionsHTML(p, idx, tour) + '</div>' +
        '<div class="nearby" style="margin-top:18px"><h4>Nearby Stops</h4>' +
          nearby.map(function (o, i) {
            return '<div class="poi-row" data-poi="' + o.p.id + '" style="margin-bottom:8px">' +
              '<div class="num">' + (i + 1) + '</div><div style="flex:1"><h4>' + o.p.title + '</h4>' +
              '<div class="sub">' + o.p.subtitle + '</div></div><div class="dist">' + o.d.toFixed(1) + ' mi</div></div>';
          }).join("") +
        '</div>' +
        '<div class="detail-actions">' +
          '<button class="btn btn-primary" data-act="start-here">' + IC.tours + ' Start Tour Here</button>' +
          '<button class="btn btn-outline" data-act="directions">' + IC.dir + ' Get Directions</button>' +
        '</div>' +
      '</div>';
    go("detail");
    // hide tabbar highlight while in detail
    $$(".tabbar button").forEach(function (b) { b.classList.remove("active"); });
  }

  function narrationHTML(p, second) {
    var uid = "player-" + (second ? "h" : "o");
    return '<div class="player" id="' + uid + '">' +
      '<button class="play" data-narrate="' + p.id + '" data-player="' + uid + '">' + IC.play + '</button>' +
      '<div class="meta"><b>Listen to Narration</b>' +
      '<div class="time"><span class="t">0:00</span> · Read aloud (accessible)</div>' +
      '<div class="bar"><span></span></div></div></div>';
  }

  function mediaHTML(p) {
    if (!p.media || !p.media.length) return '<p>No additional media for this stop.</p>';
    return p.media.map(function (m) {
      var ic = m.type === "video" ? IC.video : IC.image;
      var extra = m.type === "video" ? '<small>Opens externally · you choose before connecting (privacy-safe)</small>' : '<small>Imagery provided by Fort Leonard Wood · captioned</small>';
      var open = m.link ? ' data-extlink="' + m.link + '"' : '';
      return '<a class="media-item"' + open + '><div class="ic">' + ic + '</div>' +
        '<div><b>' + m.label + '</b>' + extra + '</div></a>';
    }).join("") + '<p class="note">All video is captioned and all audio has a transcript (Section 508 / WCAG).</p>';
  }

  function directionsHTML(p, idx, tour) {
    var next = idx >= 0 && idx < tour.stops.length - 1 ? POI_BY_ID[tour.stops[idx + 1]] : null;
    var html = '<p>Wayfinding routes you from your current location to this stop using an approved installation routing dataset. Turn-by-turn guidance is provided outdoors on approved roads.</p>';
    html += '<div class="loc-status ' + (state.locationOn ? "on" : "") + '"><span class="dot"></span>' +
      (state.locationOn ? 'Location enabled — routing from your position' : 'Enable location for live wayfinding (optional)') + '</div>';
    if (next) {
      html += '<div class="poi-row" style="cursor:default"><div class="num">→</div>' +
        '<div style="flex:1"><h4>Next stop: ' + next.title + '</h4><div class="sub">' + next.subtitle + '</div></div>' +
        '<div class="dist">' + miles(p.coords, next.coords).toFixed(1) + ' mi</div></div>';
    }
    html += '<p class="note">Devis does not promise nationwide turn-by-turn navigation. Optional links to an external navigation service are offered only if the Government approves, with a clear third-party privacy notice.</p>';
    return html;
  }

  function setTab(tab) {
    state.detailTab = tab;
    $$("#view-detail .tabs button").forEach(function (b) { b.classList.toggle("active", b.dataset.tab === tab); });
    $$("#view-detail .tab-panel").forEach(function (pn) { pn.classList.toggle("active", pn.id === "tab-" + tab); });
  }

  /* ================= NARRATION (Web Speech API) ================= */
  var speaking = { id: null, playerEl: null, timer: null, secs: 0 };
  function toggleNarration(poiId, playerId) {
    var synth = window.speechSynthesis;
    var btn = $('[data-narrate="' + poiId + '"][data-player="' + playerId + '"]');
    if (!synth) { alert("Text-to-speech is not available in this browser. In production, prerecorded narration approved by FLW is provided."); return; }
    if (speaking.id === poiId && synth.speaking) { stopNarration(synth); return; }
    stopNarration(synth);
    var p = POI_BY_ID[poiId];
    var u = new SpeechSynthesisUtterance(p.narration);
    u.rate = 0.98; u.pitch = 1;
    u.onend = function () { stopNarration(synth); };
    synth.speak(u);
    speaking.id = poiId; speaking.secs = 0;
    if (btn) btn.innerHTML = IC.pause;
    var player = document.getElementById(playerId);
    speaking.playerEl = player;
    var est = Math.max(6, Math.round(p.narration.length / 14));
    speaking.timer = setInterval(function () {
      speaking.secs++;
      if (player) {
        var t = player.querySelector(".t"); if (t) t.textContent = fmt(speaking.secs);
        var bar = player.querySelector(".bar span"); if (bar) bar.style.width = Math.min(100, speaking.secs / est * 100) + "%";
      }
    }, 1000);
  }
  function stopNarration(synth) {
    if (synth && synth.speaking) synth.cancel();
    if (speaking.timer) clearInterval(speaking.timer);
    $$('[data-narrate]').forEach(function (b) { b.innerHTML = IC.play; });
    if (speaking.playerEl) {
      var bar = speaking.playerEl.querySelector(".bar span"); if (bar) bar.style.width = "0";
      var t = speaking.playerEl.querySelector(".t"); if (t) t.textContent = "0:00";
    }
    speaking.id = null; speaking.timer = null; speaking.playerEl = null;
  }
  function fmt(s) { var m = Math.floor(s / 60); var ss = s % 60; return m + ":" + (ss < 10 ? "0" : "") + ss; }

  /* ================= SEARCH ================= */
  function fuzzy(hay, needle) {
    hay = hay.toLowerCase(); needle = needle.toLowerCase().trim();
    if (!needle) return 0;
    if (hay.indexOf(needle) >= 0) return 2; // direct substring
    // token overlap / subsequence (typo-tolerant-ish)
    var toks = needle.split(/\s+/), hit = 0;
    toks.forEach(function (t) {
      if (t.length < 2) return;
      if (hay.indexOf(t) >= 0) { hit += 1; return; }
      // subsequence match for small typos
      var i = 0; for (var j = 0; j < hay.length && i < t.length; j++) { if (hay[j] === t[i]) i++; }
      if (i / t.length > 0.8) hit += 0.6;
    });
    return hit;
  }

  function renderSearch() {
    var el = $("#view-search");
    el.innerHTML =
      '<div class="search-box"><div class="field">' + IC.search +
        '<input id="search-input" type="text" placeholder="Search people, memorials, exhibits, places…" autocomplete="off">' +
      '</div><div class="search-hint">Try “Sapper Grove”, a memorial name, “bridging gallery”, or “museum”. Fuzzy, typo-tolerant, runs in your browser.</div></div>' +
      '<div class="filter-row">' +
        ['all', 'Place', 'Person / Memorial', 'Museum Exhibit'].map(function (f) {
          return '<button data-filter="' + f + '" class="' + (f === 'all' ? 'active' : '') + '">' + (f === 'all' ? 'All' : f) + '</button>';
        }).join("") +
      '</div>' +
      '<div class="scroll-pad" id="search-results" style="padding-top:6px"></div>';
    doSearch("");
  }

  function doSearch(q) {
    var host = $("#search-results");
    var rows = SEARCH_INDEX.filter(function (r) {
      return state.searchFilter === "all" || r.kind === state.searchFilter;
    });
    if (q.trim()) {
      rows = rows.map(function (r) { return { r: r, s: fuzzy(r.terms + " " + r.label, q) }; })
        .filter(function (o) { return o.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .map(function (o) { return o.r; });
    }
    if (!rows.length) { host.innerHTML = '<div class="empty">No matches. Try another name or keyword.</div>'; return; }
    host.innerHTML = rows.slice(0, 30).map(function (r) {
      var cls = r.kind === "Place" ? "place" : (r.kind.indexOf("Person") >= 0 ? "person" : "");
      return '<div class="result-row" data-poi="' + r.poi + '">' +
        '<span class="kind ' + cls + '">' + r.kind + '</span>' +
        '<div style="flex:1"><h4>' + r.label + '</h4><div class="sub">' + r.sub + '</div></div></div>';
    }).join("");
  }

  /* ================= NEAR ME / GEOFENCE SIM ================= */
  function renderNear() {
    var el = $("#view-near");
    el.innerHTML =
      '<div class="nearme-head"><h2>Near Me</h2><p>See stops closest to you and let the tour play automatically as you arrive — all processed on your device.</p></div>' +
      '<div class="scroll-pad">' +
        '<div class="sim-panel">' +
          '<h4>Location Services <span style="font-weight:400;color:var(--muted);font-size:12px">(optional)</span></h4>' +
          '<p>The app explains why location is requested, then you grant or deny it in your browser. Your location is compared to each stop <b>on your device</b> — Devis is not designed to receive or store it.</p>' +
          '<div class="loc-status ' + (state.locationOn ? 'on' : '') + '" id="loc-status"><span class="dot"></span><span id="loc-text">' +
            (state.locationOn ? 'Location enabled (demo)' : 'Location off') + '</span></div>' +
          '<button class="btn ' + (state.locationOn ? 'btn-outline' : 'btn-teal') + ' btn-block" id="loc-toggle">' +
            (state.locationOn ? 'Turn off location' : IC.geo + ' Enable location (demo)') + '</button>' +
        '</div>' +
        '<div class="sim-panel">' +
          '<h4>Geofencing demonstration</h4>' +
          '<p>Simulate driving the History Tour. As you enter each stop\'s geofence, the app prompts you and narration can begin — exactly as it would on the road.</p>' +
          '<button class="btn btn-primary btn-block" id="sim-drive">▶ Simulate driving the tour</button>' +
        '</div>' +
        '<div class="section-title">Stops Nearest You</div>' +
        '<div id="near-list"></div>' +
      '</div>';
    renderNearList();
  }

  function renderNearList() {
    // notional "current location" near the visitor center
    var here = state.locationOn ? [-92.1450, 37.7085] : FLW.center;
    var rows = POIS.map(function (p) { return { p: p, d: miles(here, p.coords) }; })
      .sort(function (a, b) { return a.d - b.d; });
    $("#near-list").innerHTML = rows.map(function (o) {
      return '<div class="poi-row" data-poi="' + o.p.id + '"><div class="num">' + IC.near.replace('width:20px', '') + '</div>' +
        '<div style="flex:1"><div class="cat">' + o.p.category + '</div><h4>' + o.p.title + '</h4>' +
        '<div class="sub">' + o.p.subtitle + '</div></div><div class="dist">' + o.d.toFixed(1) + ' mi</div></div>';
    }).join("");
  }

  var simTimer = null;
  function simulateDrive() {
    if (simTimer) { clearTimeout(simTimer); simTimer = null; }
    if (!state.locationOn) { state.locationOn = true; }
    var tour = TOUR_BY_ID["history"];
    var seq = tour.stops.slice();
    var i = 0;
    function step() {
      if (i >= seq.length) { return; }
      var p = POI_BY_ID[seq[i]];
      geoToast(p, i + 1, seq.length);
      i++;
      simTimer = setTimeout(step, 4200);
    }
    step();
  }

  function geoToast(p, n, total) {
    var t = $("#geo-toast");
    t.innerHTML =
      '<div class="gt-head">' + IC.geo + ' Entering geofence · Stop ' + n + ' of ' + total + '</div>' +
      '<p><b>' + p.title + '</b> — ' + p.short + '</p>' +
      '<div class="gt-actions">' +
        '<button class="btn btn-teal" data-geoplay="' + p.id + '">▶ Play narration</button>' +
        '<button class="btn btn-outline" data-geoopen="' + p.id + '">Open stop</button>' +
      '</div>';
    t.classList.add("show");
    clearTimeout(t._hide);
    t._hide = setTimeout(function () { t.classList.remove("show"); }, 4000);
  }

  /* ================= MODALS ================= */
  function openModal(kind) {
    var mask = $("#modal-mask");
    var m = $("#modal-body");
    if (kind === "feedback") {
      m.innerHTML =
        '<button class="close" data-close>×</button><h3>Report an issue / feedback</h3>' +
        '<div class="msub">Help us keep the tour accurate. We only receive what you type below.</div>' +
        '<label>Related stop (optional)</label>' +
        '<select><option>— none —</option>' + POIS.map(function (p) { return '<option>' + p.title + '</option>'; }).join("") + '</select>' +
        '<label>What did you notice?</label><textarea placeholder="Describe the issue or suggestion…"></textarea>' +
        '<div class="note">' + IC.lock + ' No account or personal data is required or stored. Submissions route to the Fort Leonard Wood point of contact and the Devis content team.</div>' +
        '<div class="m-actions"><button class="btn btn-outline btn-block" data-close>Cancel</button>' +
        '<button class="btn btn-primary btn-block" data-act="fb-send">Send</button></div>';
    } else if (kind === "menu") {
      m.innerHTML =
        '<button class="close" data-close>×</button><h3>Menu</h3>' +
        '<div class="msub">Fort Leonard Wood Digital Tour</div>' +
        menuItem("home", "Home & History") + menuItem("tours", "Tours") + menuItem("map", "Interactive Map") +
        menuItem("search", "Search") + menuItem("near", "Near Me") +
        '<label style="margin-top:16px">About</label>' +
        '<p style="font-size:13px;color:#33404f;line-height:1.55">A self-guided, privacy-first digital tour of Fort Leonard Wood. No download, no account, no personal data collected. Hosted by Devis on AWS GovCloud. Available 24/7 by public link or QR code.</p>' +
        '<div class="m-actions"><button class="btn btn-outline btn-block" data-act="open-feedback">Report an issue</button>' +
        '<button class="btn btn-primary btn-block" data-close>Close</button></div>';
    } else if (kind === "share") {
      m.innerHTML = '<button class="close" data-close>×</button><h3>Share this tour</h3>' +
        '<div class="msub">Anyone can open the tour instantly — no app, no login.</div>' +
        '<div style="text-align:center;padding:10px 0">' + qrSVG() +
        '<div style="font-size:12px;color:var(--muted);margin-top:8px">tour.leonardwood.army.mil <span style="opacity:.6">(illustrative)</span></div></div>' +
        '<div class="m-actions"><button class="btn btn-primary btn-block" data-close>Done</button></div>';
    }
    mask.classList.add("show");
  }
  function menuItem(view, label) {
    return '<div class="poi-row" data-menuview="' + view + '" style="margin-bottom:8px"><div style="flex:1"><h4>' + label + '</h4></div><div class="dist">›</div></div>';
  }
  function closeModal() { $("#modal-mask").classList.remove("show"); }

  function qrSVG() {
    // decorative QR-style block (not a real code)
    var g = '', n = 11;
    var seed = [1,0,1,1,0,1,0,0,1,1,0, 0,1,1,0,1,0,1,1,0,0,1, 1,1,0,0,1,1,0,1,0,1,0,
      0,0,1,1,0,1,1,0,1,1,0, 1,0,1,0,1,0,0,1,0,1,1, 0,1,0,1,1,0,1,0,1,0,0,
      1,1,0,0,1,0,1,1,0,1,1, 0,0,1,1,0,1,0,0,1,1,0, 1,0,1,0,1,1,0,1,0,0,1,
      0,1,1,0,0,1,1,0,1,1,0, 1,0,0,1,1,0,1,1,0,1,1];
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      if (seed[y * n + x]) g += '<rect x="' + (x * 12) + '" y="' + (y * 12) + '" width="12" height="12"/>';
    }
    return '<svg width="150" height="150" viewBox="0 0 132 132" fill="#1b3b5f"><rect width="132" height="132" fill="#fff"/>' + g +
      '<rect x="0" y="0" width="36" height="36" fill="none" stroke="#1b3b5f" stroke-width="8"/>' +
      '<rect x="96" y="0" width="36" height="36" fill="none" stroke="#1b3b5f" stroke-width="8"/>' +
      '<rect x="0" y="96" width="36" height="36" fill="none" stroke="#1b3b5f" stroke-width="8"/></svg>';
  }

  /* ================= EVENT DELEGATION ================= */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-tour],[data-viewtour],[data-poi],[data-tab],[data-act],[data-narrate],[data-filter],[data-mtour],[data-menuview],[data-close],[data-extlink],[data-geoplay],[data-geoopen]");
    if (!t) return;

    if (t.dataset.narrate) { toggleNarration(t.dataset.narrate, t.dataset.player); return; }
    if (t.dataset.tab) { setTab(t.dataset.tab); return; }
    if (t.dataset.filter) { state.searchFilter = t.dataset.filter; $$("[data-filter]").forEach(function (b) { b.classList.toggle("active", b === t); }); doSearch($("#search-input") ? $("#search-input").value : ""); return; }
    if (t.dataset.mtour) { drawTour(t.dataset.mtour); return; }
    if (t.dataset.extlink) { e.preventDefault(); if (confirm("This opens an external website (" + t.dataset.extlink + ").\n\nExternal sites are governed by their own privacy practices. Continue?")) window.open(t.dataset.extlink, "_blank", "noopener"); return; }
    if (t.dataset.geoplay) { window.speechSynthesis && toggleNarrationDirect(t.dataset.geoplay); return; }
    if (t.dataset.geoopen) { $("#geo-toast").classList.remove("show"); openPOI(t.dataset.geoopen); return; }
    if (t.dataset.menuview) { closeModal(); go(t.dataset.menuview); return; }
    if (t.dataset.close !== undefined) { closeModal(); return; }

    if (t.dataset.viewtour) { drawTour(t.dataset.viewtour); go("map"); return; }
    if (t.dataset.tour) { drawTour(t.dataset.tour); go("map"); return; }
    if (t.dataset.poi) { stopNarration(window.speechSynthesis); openPOI(t.dataset.poi); return; }

    var act = t.dataset.act;
    if (act === "start-history") { drawTour("history"); go("map"); }
    else if (act === "open-map") { go("map"); }
    else if (act === "back") { stopNarration(window.speechSynthesis); go(state.activeTour ? "map" : "home"); }
    else if (act === "start-here" || act === "directions") { go("map"); if (state.activePOI) setTimeout(function(){ openMapCard(POI_BY_ID[state.activePOI]); }, 60); }
    else if (act === "open-feedback") { openModal("feedback"); }
    else if (act === "fb-send") { closeModal(); toast("Thank you — your note was routed to the content team. No personal data was stored."); }
  });

  function toggleNarrationDirect(poiId) {
    var synth = window.speechSynthesis; stopNarration(synth);
    var p = POI_BY_ID[poiId]; var u = new SpeechSynthesisUtterance(p.narration); u.rate = .98;
    synth.speak(u);
  }

  function toast(msg) {
    var t = $("#geo-toast");
    t.innerHTML = '<div class="gt-head">' + IC.check + ' Done</div><p>' + msg + '</p>';
    t.classList.add("show"); clearTimeout(t._hide);
    t._hide = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  document.addEventListener("input", function (e) {
    if (e.target.id === "search-input") doSearch(e.target.value);
  });

  /* header + tabbar + device controls wired in init() */
  function init() {
    renderHome(); renderTours(); renderSearch(); renderNear();

    // tabbar
    $$(".tabbar button").forEach(function (b) {
      b.addEventListener("click", function () { if (b.dataset.view === "map") { } go(b.dataset.view); });
    });
    // header buttons
    $("#h-search").addEventListener("click", function () { go("search"); setTimeout(function(){ var i=$("#search-input"); if(i) i.focus(); }, 50); });
    $("#h-menu").addEventListener("click", function () { openModal("menu"); });

    // map controls
    $("#list-toggle").addEventListener("click", function () {
      var la = $("#list-alt"); la.classList.toggle("active");
      this.textContent = la.classList.contains("active") ? "Show map" : "List view";
    });
    $("#geo-toast").addEventListener("click", function (e) { /* handled by delegation */ });
    $("#near-sim-hook"); // noop

    // Near Me actions (delegated targets that need fresh state)
    document.addEventListener("click", function (e) {
      if (e.target.closest("#loc-toggle")) {
        state.locationOn = !state.locationOn; renderNear();
      } else if (e.target.closest("#sim-drive")) {
        simulateDrive();
      }
    });

    // demo device toggle
    $$(".demo-bar [data-device]").forEach(function (b) {
      b.addEventListener("click", function () {
        var mode = b.dataset.device;
        var stage = $("#stage");
        stage.className = "stage " + (mode === "desktop" ? "" : "phone " + (mode === "android" ? "android" : "ios"));
        $$(".demo-bar [data-device]").forEach(function (x) { x.classList.toggle("active", x === b); });
        if (state.map) setTimeout(function () { state.map.resize(); }, 350);
      });
    });
    $("#demo-share").addEventListener("click", function () { openModal("share"); });

    go("home");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
