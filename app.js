/* =====================================================================
   Fort Leonard Wood Digital Tour — "The Engineer Post"
   Application logic for the "Monument" demo (Army Gold / Black / White).
   Vanilla JS. PWA-style: no accounts, no personal data, optional location.
   ===================================================================== */
(function () {
  "use strict";

  var S = {
    view: "tours",
    activeTour: "founding",
    activeStop: null,
    sheetPoi: "sapper-grove",
    sheetState: "half",
    mapMode: "map",
    filter: "all",
    query: "",
    locationPermission: "unprompted",
    map: null, markers: [], mapReady: false,
    now: null,            // {id, kind:'poi'|'intro', pos, playing}
    speakTimer: null, speakSecs: 0, speakEst: 1,
    simTimer: null, simIdx: 0
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- icons ---------- */
  var I = {
    menu:'<svg viewBox="0 0 24 24"><path d="M4 7h16v2H4zm0 8h16v2H4z"/></svg>',
    play:'<svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg>',
    pause:'<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>',
    back:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7 1.5-1.5L10 12l6.5-5.5z"/></svg>',
    share:'<svg viewBox="0 0 24 24"><path d="M18 16a3 3 0 00-2.3 1.1L9 13.5a3 3 0 000-3l6.7-3.6A3 3 0 1015 5l-6.7 3.6a3 3 0 100 6.8L15 19a3 3 0 103-3z"/></svg>',
    tours:'<svg viewBox="0 0 24 24"><path d="M4 5h16v3H4zm0 6h16v3H4zm0 6h10v3H4z"/></svg>',
    map:'<svg viewBox="0 0 24 24"><path d="M12 3l4 2 4-2v14l-4 2-8-4-4 2V5l4-2 4 2zm0 2.2L8 3.9v11.9l4 2z"/></svg>',
    search:'<svg viewBox="0 0 24 24"><path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 10-.7.7l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"/></svg>',
    near:'<svg viewBox="0 0 24 24"><path d="M21 3L3 10.5l7.2 2.3L12.5 20 21 3z"/></svg>',
    close:'<svg viewBox="0 0 24 24"><path d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 5.7 18.3 4.3 16.9 10.6 12 4.3 5.7 5.7 4.3 12 10.6l4.9-4.9z"/></svg>',
    chevron:'<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6z"/></svg>',
    arrowUp:'<svg viewBox="0 0 24 24"><path d="M12 4l7 8h-4v8h-6v-8H5z"/></svg>',
    nav:'<svg viewBox="0 0 24 24"><path d="M21.7 11.3l-9-9a1 1 0 00-1.4 0l-9 9a1 1 0 000 1.4l9 9a1 1 0 001.4 0l9-9a1 1 0 000-1.4z"/></svg>',
    video:'<svg viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11z"/></svg>',
    collapse:'<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>',
    skip15b:'<svg viewBox="0 0 24 24"><path d="M12 5V2L7 6l5 4V7a5 5 0 11-5 5H5a7 7 0 107-7z"/></svg>',
    lock:'<svg viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 00-10 0v2H5v12h14V9zm-8 0V7a3 3 0 016 0v2z"/></svg>'
  };

  /* ---------- helpers ---------- */
  function bg(p) {
    if (p && p.photo) return "style=\"background-image:url('" + p.photo + "')\"";
    return "";
  }
  function striped(p) { return (p && p.photo) ? "" : "striped"; }
  function heroBg(src) { return src ? "style=\"background-image:url('" + src + "')\" " : ""; }
  function heroStripe(src) { return src ? "" : "striped"; }

  function miles(a, b) {
    var R = 3958.8, dLat = (b[1]-a[1])*Math.PI/180, dLon = (b[0]-a[0])*Math.PI/180;
    var la1 = a[1]*Math.PI/180, la2 = b[1]*Math.PI/180;
    var h = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)*Math.sin(dLon/2);
    return R*2*Math.atan2(Math.sqrt(h), Math.sqrt(1-h));
  }
  function fmtDist(mi) {
    if (mi < 0.19) return Math.round(mi*1609/10)*10 + " m";
    return mi.toFixed(1) + " mi";
  }
  function bearing(a, b) {
    var y = Math.sin((b[0]-a[0])*Math.PI/180)*Math.cos(b[1]*Math.PI/180);
    var x = Math.cos(a[1]*Math.PI/180)*Math.sin(b[1]*Math.PI/180) -
            Math.sin(a[1]*Math.PI/180)*Math.cos(b[1]*Math.PI/180)*Math.cos((b[0]-a[0])*Math.PI/180);
    return (Math.atan2(y, x)*180/Math.PI + 360) % 360;
  }
  function cardinal(deg) {
    return ["N","NE","E","SE","S","SW","W","NW"][Math.round(deg/45)%8];
  }
  function fmtTime(s) { var m=Math.floor(s/60); s=Math.round(s%60); return m+":"+(s<10?"0":"")+s; }
  function durToSecs(d) { var p=d.split(":"); return (+p[0])*60+(+p[1]); }

  /* ================= NAV ================= */
  function go(view) {
    S.view = view;
    $$(".view").forEach(function (v){ v.classList.toggle("active", v.id === "v-"+view); v.scrollTop = 0; });
    var pl = document.getElementById("v-player"); if (pl) pl.classList.toggle("active", view === "player");
    $$(".tabbar button").forEach(function (b){ b.classList.toggle("active", b.dataset.view === view); });
    // tabbar active only for the 4 destinations
    var dest = ["tours","map","search","near"];
    if (dest.indexOf(view) < 0) $$(".tabbar button").forEach(function(b){ b.classList.remove("active"); });
    if (view === "map") setTimeout(ensureMap, 40);
  }

  /* ================= LANDING (Tours tab) ================= */
  function renderLanding() {
    var t1 = TOUR_BY_ID.founding;
    var el = $("#v-tours");
    el.innerHTML =
      '<div class="status on-dark"><span>9:41</span><span>LTE&nbsp;&nbsp;<span class="batt"></span></span></div>' +
      '<div class="hero">' +
        '<div class="bg striped"></div><div class="scrim"></div>' +
        '<div class="top"><span class="brand">FORT LEONARD WOOD</span>' +
          '<button class="circle-btn" id="menu-btn" aria-label="Menu">'+I.menu+'</button></div>' +
        '<div class="content">' +
          '<span class="pill-outline">'+I.lock+' Self-guided · No account</span>' +
          '<h1>The Engineer Post</h1>' +
          '<p>Since 1940 this ground has trained more than four million Soldiers. Two tours trace that record — its memorials, museums, and mobilization blocks.</p>' +
          '<div class="play-row"><button class="play" data-intro aria-label="Play the introduction">'+I.play+'</button>' +
            '<div class="lbl"><b>Play the introduction</b><span class="m">'+INTRO.duration+' · TRANSCRIPT</span></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="pad" style="padding-top:6px">' +
        '<div class="section-head"><span class="kick on-light">Two tours</span><span class="r">100 STOPS TOTAL</span></div>' +
        TOURS.map(tourCard).join("") +
        '<div class="demo-note"><b>Demonstration.</b> This is a working demo of the proposed platform. History, imagery, audio, names, and coordinates are notional placeholders; in production all content is provided and approved by Fort Leonard Wood. Memorial names shown in Search are fictional.</div>' +
      '</div>';
    var menu = $("#menu-btn"); if (menu) menu.onclick = function(){ openModal("menu"); };
  }
  function tourCard(t) {
    return '<div class="tour-card" data-tour="'+t.id+'">' +
      '<div class="ph '+heroStripe(t.hero)+'" '+heroBg(t.hero)+'><span class="badge">'+t.category+'</span></div>' +
      '<div class="body"><h3 class="disp">'+t.title+'</h3>' +
        '<div class="meta-row"><span>'+t.stopCount+' STOPS</span><span class="dot">·</span><span>'+t.mins+'</span><span class="dot">·</span><span>'+t.drive+'</span></div>' +
        '<button class="btn btn-primary cta-full" data-viewtour="'+t.id+'">View Tour</button>' +
      '</div></div>';
  }

  /* ================= TOUR DETAIL ================= */
  function renderDetail(id) {
    var t = TOUR_BY_ID[id]; S.activeTour = id;
    var el = $("#v-detail");
    el.innerHTML =
      '<div class="detail-hero"><div class="bg '+heroStripe(t.hero)+'" '+heroBg(t.hero)+'></div><div class="scrim"></div>' +
        '<button class="circle-btn back" data-go="tours" aria-label="Back">'+I.back+'</button>' +
        '<div class="cap"><span class="kick on-dark">'+t.num+'</span><h2>'+t.title+'</h2></div></div>' +
      '<div class="pad" style="padding-top:16px">' +
        '<p style="font-size:15px;line-height:1.65;color:var(--text-2);margin:0 0 4px">'+t.desc+'</p>' +
        '<div class="chips"><span class="chip">'+t.stopCount+' STOPS</span><span class="chip">'+t.mins+'</span>' +
          '<span class="chip">'+t.drive+' DRIVE</span><span class="chip filled">'+t.category+'</span></div>' +
        '<button class="btn btn-primary btn-block" style="height:56px;margin-top:16px" data-starttour="'+t.id+'">'+I.play+' Start Tour &amp; Enable Narration</button>' +
        '<p class="cta-caption">'+t.caption+'</p>' +
        '<div class="route-head"><span class="kick on-light">The Route</span>' +
          '<button class="link" data-viewtour="'+t.id+'">Preview any stop →</button></div>' +
        t.stops.map(function(sid, i){
          var p = POI_BY_ID[sid];
          var m = i === 0 ? '<span class="m start">START</span>' :
            '<span class="m">'+fmtDist(miles(POI_BY_ID[t.stops[i-1]].coords, p.coords))+' FROM STOP '+i+'</span>';
          return '<div class="stop-row" data-poi="'+sid+'"><span class="num disp">'+(i+1)+'</span>' +
            '<span class="thumb '+striped(p)+'" '+bg(p)+'></span>' +
            '<span class="info"><h4>'+p.title+'</h4><p class="t">'+(p.teaser||p.address)+'</p>'+m+'</span></div>';
        }).join("") +
      '</div>';
    go("detail");
  }

  /* ================= MAP ================= */
  var PARKING = [
    { id:"p1", coords:[-92.1300, 37.7077], glyph:"P" },
    { id:"p2", coords:[-92.1462, 37.7072], glyph:"P" }
  ];
  function ensureMap() {
    if (S.map) { S.map.resize(); return; }
    if (typeof maplibregl === "undefined") { mapFallback(); return; }
    try {
      S.map = new maplibregl.Map({
        container: "map",
        style: {
          version: 8, glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
          sources: { dark: {
            type:"raster",
            tiles:["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                   "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
            tileSize:256,
            attribution:"MAP DATA © OPENSTREETMAP CONTRIBUTORS © CARTO"
          }},
          layers:[{ id:"dark", type:"raster", source:"dark" }]
        },
        center: FLW.center, zoom: FLW.defaultZoom, attributionControl: true
      });
      S.map.on("load", function(){ S.mapReady = true; drawTour(); });
      S.map.on("error", function(){});
    } catch(e){ mapFallback(); }
  }
  function mapFallback() {
    $("#map").innerHTML = '<div style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;'+
      'text-align:center;padding:30px;font-size:13px;font-family:var(--font-ui)">Map needs an internet connection.<br>Use <b>List</b> for all stops.</div>';
    $("#map-list").classList.add("active");
  }
  function clearMarkers(){ S.markers.forEach(function(m){ m.remove(); }); S.markers = []; }
  function drawTour() {
    if (!S.mapReady) return;
    var t = TOUR_BY_ID[S.activeTour];
    var stops = t.stops.map(function(id){ return POI_BY_ID[id]; });
    var coords = stops.map(function(p){ return p.coords; });
    var geo = { type:"Feature", geometry:{ type:"LineString", coordinates: coords } };
    if (S.map.getSource("route")) S.map.getSource("route").setData(geo);
    else {
      S.map.addSource("route",{ type:"geojson", data:geo });
      S.map.addLayer({ id:"route", type:"line", source:"route",
        layout:{ "line-join":"round","line-cap":"round" },
        paint:{ "line-color":"#FFCC01","line-width":4,"line-opacity":.95 } });
    }
    clearMarkers();
    stops.forEach(function(p, i){
      if (S.filter === "memorials" && p.cat !== "memorial") return;
      if (S.filter === "museums" && p.cat !== "museum") return;
      if (S.filter === "parking") return;
      var el = document.createElement("div"); el.className = "marker" + (p.id===S.sheetPoi?" sel":"");
      el.innerHTML = '<div class="pin" style="background:#FFCC01">'+(i+1)+'</div>';
      el.onclick = function(){ selectPoi(p.id); };
      S.markers.push(new maplibregl.Marker({ element:el, anchor:"bottom" }).setLngLat(p.coords).addTo(S.map));
    });
    if (S.filter === "all" || S.filter === "parking") {
      PARKING.forEach(function(pk){
        var el = document.createElement("div"); el.className = "marker parking";
        el.innerHTML = '<div class="pin">'+pk.glyph+'</div>';
        S.markers.push(new maplibregl.Marker({ element:el, anchor:"bottom" }).setLngLat(pk.coords).addTo(S.map));
      });
    }
    var b = new maplibregl.LngLatBounds(); coords.forEach(function(c){ b.extend(c); });
    S.map.fitBounds(b, { padding:{ top:150, bottom:430, left:50, right:50 }, maxZoom:15.5, duration:500 });
    renderMapList();
    renderSheet();
  }
  function selectPoi(id){ S.sheetPoi = id; S.sheetState = "half"; drawTour(); }
  function renderSheet() {
    var p = POI_BY_ID[S.sheetPoi];
    var t = TOUR_BY_ID[S.activeTour];
    var kick = "STOP "+(t.stops.indexOf(p.id)+1)+" · "+p.category.toUpperCase();
    var sh = $("#sheet");
    sh.className = "sheet " + S.sheetState;
    $("#sheet-body").innerHTML =
      '<span class="kick on-light">'+kick+'</span>' +
      '<h3>'+p.title+'</h3>' +
      '<div class="sph '+striped(p)+'" '+bg(p)+'></div>' +
      '<p class="teaser">'+(p.teaser||"")+'</p>' +
      '<div class="sheet-actions"><button class="btn btn-dark" data-poi="'+p.id+'">'+I.nav+' Details</button>' +
        '<button class="btn btn-outline" data-poi="'+p.id+'">Directions</button></div>' +
      '<div class="access-line">'+(p.parking||"")+(p.access?" · "+p.access:"")+'</div>';
  }
  function renderMapList() {
    var t = TOUR_BY_ID[S.activeTour];
    $("#map-list").innerHTML = '<div class="pad" style="padding-top:120px">' +
      '<div class="section-head"><span class="kick on-light">'+t.title.split(",")[0]+' — all stops</span></div>' +
      t.stops.map(function(id,i){
        var p = POI_BY_ID[id];
        return '<div class="stop-row" data-poi="'+id+'"><span class="num disp">'+(i+1)+'</span>' +
          '<span class="thumb '+striped(p)+'" '+bg(p)+'></span>' +
          '<span class="info"><h4>'+p.title+'</h4><p class="t">'+(p.teaser||p.address)+'</p></span></div>';
      }).join("") + '</div>';
  }

  /* ================= POI DETAIL ================= */
  function renderPOI(id) {
    S.activeStop = id;
    var p = POI_BY_ID[id];
    var t = TOUR_BY_ID[S.activeTour];
    var idx = t.stops.indexOf(id);
    var kick = "STOP "+(idx+1)+" OF "+t.stopCount+" · "+t.title.split(",")[0].toUpperCase();
    var nearby = POIS.filter(function(x){ return x.id!==id; })
      .map(function(x){ return { p:x, d:miles(p.coords, x.coords) }; })
      .sort(function(a,b){ return a.d-b.d; }).slice(0,4);
    var hasVideo = p.cat === "museum";
    var el = $("#v-poi");
    el.innerHTML =
      '<div class="poi-hero"><div class="bg '+striped(p)+'" '+bg(p)+'></div><div class="scrim"></div>' +
        '<button class="circle-btn back" data-go="map" aria-label="Back">'+I.back+'</button>' +
        '<div class="acts"><button class="circle-btn" data-share aria-label="Share">'+I.share+'</button></div>' +
        '<div class="cap"><span class="kick on-dark">'+kick+'</span><h2>'+p.title+'</h2></div></div>' +
      '<div class="pad" style="padding-top:2px">' +
        '<p class="photo-caption">'+(p.caption||"")+'</p>' +
        narrationModule(p) +
        '<div class="interp">'+p.interpretive.map(function(x){ return '<p>'+x+'</p>'; }).join("")+'</div>' +
        (p.gallery ? '<div class="gallery">'+p.gallery.map(function(g){ return '<div class="g"><span class="c">'+g.cap+'</span></div>'; }).join("")+'</div>' : "") +
        (hasVideo ? '<a class="video-card" data-ext="https://www.youtube.com/results?search_query=US+Army+Engineer+Museum+Fort+Leonard+Wood">' +
          '<span class="th">'+I.video+'</span><span><b>Inside the museum (video)</b><small>Opens on an external site with its own privacy practices.</small></span></a>' : "") +
        '<div class="sub-head">Nearby stops</div>' +
        '<div class="nearby-scroll">'+nearby.map(function(o){
          return '<div class="near-card" data-poi="'+o.p.id+'"><div class="ph '+striped(o.p)+'" '+bg(o.p)+'></div>' +
            '<div class="b"><h5>'+o.p.title+'</h5><div class="m">'+fmtDist(o.d)+' · STOP '+o.p.n+'</div></div></div>';
        }).join("")+'</div>' +
        '<div class="notes-line">Parking: '+(p.parking||"—")+'<br>Accessibility: '+(p.access||"—")+'</div>' +
        '<button class="report-link" data-report="'+p.id+'">Report an issue</button>' +
      '</div>' +
      '<div class="bottom-cta"><button class="btn btn-primary btn-block" data-drive="'+p.id+'">'+I.nav+' Navigate to this stop</button></div>';
    go("poi");
  }
  function narrationModule(p) {
    return '<div class="narration"><div class="top">' +
      '<button class="play" data-play="'+p.id+'" aria-label="Play narration">'+I.play+'</button>' +
      '<div class="meta"><b>Narration · '+p.duration+'</b><div class="n">'+p.narrator+'</div></div>' +
      '<button class="tbtn" data-openplayer="'+p.id+'">Transcript</button></div>' +
      '<div class="progress" id="np-'+p.id+'"><span></span></div>' +
      '<div class="progress-row"><span class="np-cur">0:00</span><span class="rep">REPLAY 15s</span><span>'+p.duration+'</span></div></div>';
  }

  /* ================= NARRATION / PLAYER ================= */
  function narrationText(id) {
    if (id === "__intro") return INTRO.narration;
    return POI_BY_ID[id].narration;
  }
  function startNarration(id) {
    var synth = window.speechSynthesis;
    if (S.now && S.now.id === id && S.now.playing) { pauseNarration(); return; }
    stopNarration();
    var text = narrationText(id);
    if (synth) {
      var u = new SpeechSynthesisUtterance(text); u.rate = .98;
      u.onend = function(){ endNarration(); };
      synth.speak(u);
    }
    var dur = id === "__intro" ? durToSecs(INTRO.duration) : durToSecs(POI_BY_ID[id].duration);
    S.now = { id:id, playing:true }; S.speakSecs = 0; S.speakEst = dur;
    S.speakTimer = setInterval(tickNarration, 250);
    showMini(); syncPlayIcons();
    if (S.view === "player") syncPlayerScreen();
  }
  function tickNarration() {
    S.speakSecs += 0.25;
    var pct = Math.min(100, S.speakSecs / S.speakEst * 100);
    // narration module
    if (S.now) {
      var np = $("#np-"+S.now.id); if (np) np.querySelector("span").style.width = pct+"%";
      var cur = $("#v-poi .np-cur"); if (cur && S.activeStop===S.now.id) cur.textContent = fmtTime(S.speakSecs);
    }
    // mini
    var mp = $("#mini-time"); if (mp) mp.textContent = "PLAYING · "+fmtTime(S.speakSecs)+" / "+curDur();
    // full player
    if (S.view === "player") updateScrubber(pct);
    if (S.speakSecs >= S.speakEst) endNarration();
  }
  function curDur(){ return S.now ? (S.now.id==="__intro"?INTRO.duration:POI_BY_ID[S.now.id].duration) : "0:00"; }
  function pauseNarration() {
    if (window.speechSynthesis) window.speechSynthesis.pause();
    if (S.speakTimer) { clearInterval(S.speakTimer); S.speakTimer = null; }
    if (S.now) S.now.playing = false;
    syncPlayIcons(); if (S.view==="player") syncPlayerScreen();
  }
  function resumeNarration() {
    if (window.speechSynthesis) window.speechSynthesis.resume();
    if (!S.speakTimer) S.speakTimer = setInterval(tickNarration, 250);
    if (S.now) S.now.playing = true;
    syncPlayIcons(); if (S.view==="player") syncPlayerScreen();
  }
  function endNarration() {
    if (S.speakTimer){ clearInterval(S.speakTimer); S.speakTimer=null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (S.now) S.now.playing = false;
    syncPlayIcons(); if (S.view==="player") syncPlayerScreen();
  }
  function stopNarration() {
    if (S.speakTimer){ clearInterval(S.speakTimer); S.speakTimer=null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    // reset module bars
    $$(".progress span").forEach(function(s){ s.style.width="0"; });
  }
  function toggleNow() {
    if (!S.now) return;
    if (S.now.playing) pauseNarration(); else resumeNarration();
  }
  function syncPlayIcons() {
    var playing = S.now && S.now.playing;
    $$("[data-play]").forEach(function(b){ b.innerHTML = (playing && S.now.id===b.dataset.play) ? I.pause : I.play; });
    var mp = $("#mini-play"); if (mp) mp.innerHTML = playing ? I.pause : I.play;
  }
  function showMini() {
    var m = $("#mini"); if (!m || !S.now) return;
    var p = S.now.id === "__intro" ? null : POI_BY_ID[S.now.id];
    var title = S.now.id === "__intro" ? "Introduction · The Engineer Post" : p.title;
    m.querySelector(".art").className = "art " + (p && p.photo ? "" : "striped");
    if (p && p.photo) m.querySelector(".art").style.backgroundImage = "url('"+p.photo+"')";
    else m.querySelector(".art").style.backgroundImage = "";
    $("#mini-title").textContent = title;
    $("#mini-time").textContent = "PLAYING · 0:00 / " + curDur();
    m.classList.add("show");
    syncPlayIcons();
  }

  function openPlayer(id) {
    if (!id) id = S.now ? S.now.id : S.activeStop;
    if (!id) return;
    var isIntro = id === "__intro";
    var p = isIntro ? null : POI_BY_ID[id];
    var t = TOUR_BY_ID[S.activeTour];
    var idx = p ? t.stops.indexOf(id) : -1;
    var title = isIntro ? "The Engineer Post" : p.title;
    var narr = isIntro ? "INTRODUCTION" : p.narrator;
    var ctx = isIntro ? "INTRODUCTION" : "STOP "+(idx+1)+" OF "+t.stopCount;
    var lines = isIntro ? INTRO.transcript : p.transcript;
    var art = (p && p.photo) ? "style=\"background-image:url('"+p.photo+"')\"" : "";
    var artCls = (p && p.photo) ? "" : "striped";
    $("#v-player").innerHTML =
      '<button class="collapse" data-collapse aria-label="Collapse">'+I.collapse+'</button>' +
      '<div class="ctx">'+ctx+'</div>' +
      '<div class="art '+artCls+'" '+art+'></div>' +
      '<h2 class="disp">'+title+'</h2><div class="narr">'+narr+'</div>' +
      '<div class="scrubber" id="scrub"><span id="scrub-fill"></span><div class="thumb" id="scrub-thumb"></div></div>' +
      '<div class="scrub-time"><span id="scrub-cur">0:00</span><span id="scrub-rem">-'+curDur()+'</span></div>' +
      '<div class="controls">' +
        '<button class="c" data-speed>1.0×</button>' +
        '<button class="c" data-seek="-15">−15</button>' +
        '<button class="c big" data-toggle-now aria-label="Play/Pause">'+((S.now&&S.now.playing)?I.pause:I.play)+'</button>' +
        '<button class="c" data-seek="15">+15</button>' +
        '<button class="c" data-next>NEXT ›</button>' +
      '</div>' +
      '<div class="transcript-panel"><div class="th">Transcript</div>' +
        lines.map(function(l,i){ return '<p class="line'+(i===0?" active":"")+'" data-tline="'+i+'">'+l+'</p>'; }).join("") +
      '</div>';
    go("player");
    syncPlayerScreen();
  }
  function updateScrubber(pct) {
    var f = $("#scrub-fill"), th = $("#scrub-thumb");
    if (f) f.style.width = pct+"%"; if (th) th.style.left = pct+"%";
    var cur = $("#scrub-cur"); if (cur) cur.textContent = fmtTime(S.speakSecs);
    var rem = $("#scrub-rem"); if (rem) rem.textContent = "-"+fmtTime(Math.max(0,S.speakEst-S.speakSecs));
    // transcript active line
    var lines = $$("#v-player .line"); if (lines.length){
      var ai = Math.min(lines.length-1, Math.floor(S.speakSecs/S.speakEst*lines.length));
      lines.forEach(function(l,i){ l.classList.toggle("active", i===ai); });
    }
  }
  function syncPlayerScreen() {
    var big = $("[data-toggle-now]"); if (big) big.innerHTML = (S.now&&S.now.playing)?I.pause:I.play;
  }

  /* ================= SEARCH ================= */
  function fuzzy(hay, q) {
    hay = hay.toLowerCase(); q = q.toLowerCase().trim(); if (!q) return 0;
    if (hay.indexOf(q) >= 0) return 3;
    var toks = q.split(/\s+/), score = 0;
    toks.forEach(function(tk){
      if (tk.length < 2) return;
      if (hay.indexOf(tk) >= 0) { score += 1; return; }
      var i=0; for (var j=0;j<hay.length&&i<tk.length;j++){ if(hay[j]===tk[i]) i++; }
      if (i/tk.length > 0.8) score += 0.6;
    });
    return score;
  }
  function hi(text, q) {
    q = q.trim(); if (!q) return text;
    var toks = q.split(/\s+/).filter(function(t){ return t.length>1; });
    var out = text;
    toks.forEach(function(tk){
      try { out = out.replace(new RegExp("("+tk.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig"), "<mark>$1</mark>"); } catch(e){}
    });
    return out;
  }
  function renderSearch() {
    $("#v-search").innerHTML =
      '<div class="search-head">' +
        '<div class="status on-dark" style="padding:0 2px"><span>9:41</span><span>LTE&nbsp;&nbsp;<span class="batt"></span></span></div>' +
        '<div class="search-field" id="sfield">'+I.search+
          '<input id="sinput" type="text" placeholder="Search a name, exhibit, or place…" autocomplete="off" aria-label="Search">' +
        '</div>' +
        '<div class="recent" id="recent">'+RECENT_SEARCHES.map(function(r){ return '<button class="rc" data-q="'+r+'">'+r+'</button>'; }).join("")+'</div>' +
      '</div>' +
      '<div class="search-results" id="sresults"></div>';
    doSearch("");
    var inp = $("#sinput"), f = $("#sfield");
    inp.addEventListener("focus", function(){ f.classList.add("focus"); });
    inp.addEventListener("blur", function(){ f.classList.remove("focus"); });
    inp.addEventListener("input", function(){ doSearch(inp.value); });
  }
  function doSearch(q) {
    S.query = q;
    var host = $("#sresults"); if (!host) return;
    $("#recent").style.display = q.trim() ? "none" : "flex";
    var rows = SEARCH_INDEX;
    if (q.trim()) {
      rows = rows.map(function(r){ return { r:r, s:fuzzy(r.terms+" "+r.label, q) }; })
        .filter(function(o){ return o.s>0; }).sort(function(a,b){ return b.s-a.s; }).map(function(o){ return o.r; });
    }
    if (!rows.length) {
      host.innerHTML = '<div class="empty-search"><div class="disp">No results for “'+q+'”.</div>' +
        '<div style="font-size:13px;color:var(--text-2)">Try a name at Sapper Grove, or a museum exhibit.</div>' +
        '<div class="sugg">'+SUGGESTED.map(function(s){ return '<button class="rc" data-q="'+s+'">'+s+'</button>'; }).join("")+'</div></div>';
      return;
    }
    var groups = {};
    rows.forEach(function(r){ (groups[r.group] = groups[r.group] || []).push(r); });
    var order = ["People · Sapper Grove","Museum Exhibits","Places","Tours"];
    host.innerHTML = order.filter(function(g){ return groups[g]; }).map(function(g){
      return '<div class="result-group"><div class="gh"><span class="t">'+g+'</span><span class="n">'+groups[g].length+'</span></div>' +
        groups[g].map(function(r){
          var target = r.poi ? 'data-poi="'+r.poi+'"' : 'data-viewtour="'+r.tour+'"';
          return '<div class="result" '+target+'><h4>'+hi(r.label,q)+'</h4><div class="s">'+hi(r.sub,q)+'</div>' +
            (r.close ? '<span class="cm">Close match</span>' : '') + '</div>';
        }).join("") + '</div>';
    }).join("");
  }

  /* ================= NEAR ME ================= */
  function renderNear() {
    var rows = POIS.map(function(p){ return { p:p, d:miles(FLW.here, p.coords), b:bearing(FLW.here, p.coords) }; })
      .sort(function(a,b){ return a.d-b.d; });
    $("#v-near").innerHTML =
      '<div class="near-view">' +
        '<span class="kick on-light">You are here</span>' +
        '<h2 class="disp">Near Me</h2>' +
        '<div class="mono" style="font-size:11px;color:var(--text-2);letter-spacing:.1em">SORTED BY DISTANCE · ±12 M</div>' +
        '<div class="near-map"><div class="grid"></div><div class="youdot"></div><div class="youpill">You are here · '+FLW.hereLabel+'</div></div>' +
        rows.map(function(o){
          return '<div class="near-stop" data-poi="'+o.p.id+'">' +
            '<div class="bearing"><span style="display:inline-block;transform:rotate('+Math.round(o.b)+'deg)">'+I.near+'</span></div>' +
            '<div class="info"><h4>'+o.p.title+'</h4><div class="m">STOP '+o.p.n+' · '+o.p.category.toUpperCase()+'</div></div>' +
            '<div class="dist"><b>'+fmtDist(o.d)+'</b><span class="c">'+cardinal(o.b)+'</span></div></div>';
        }).join("") +
        '<div class="fallback"><b>Not where you expected?</b><p>Choose your area manually — the full tour works without location.</p>' +
          '<button class="btn btn-outline-dark btn-block" data-prime>Choose your current area</button></div>' +
        '<div class="demo-note" style="margin-top:16px">Location is optional and processed on your device. Devis is not designed to receive or store it. Tap “Choose your current area” to see the privacy prompt this demo would show before requesting location.</div>' +
      '</div>';
  }

  /* ================= PRIMING ================= */
  function showPrime() {
    $("#prime").classList.add("active");
  }
  function hidePrime(){ $("#prime").classList.remove("active"); }

  /* ================= GEOFENCE + DRIVING SIM ================= */
  function startSim() {
    go("map"); setTimeout(function(){ ensureMap(); }, 40);
    S.simIdx = 0;
    if (S.simTimer) clearInterval(S.simTimer);
    $("#drive-progress").style.display = "flex";
    stepSim();
    S.simTimer = setInterval(stepSim, 4500);
  }
  function stepSim() {
    var t = TOUR_BY_ID[S.activeTour];
    if (S.simIdx >= t.stops.length) { stopSim(); return; }
    var p = POI_BY_ID[t.stops[S.simIdx]];
    selectPoi(p.id);
    if (S.map && S.mapReady) S.map.easeTo({ center:p.coords, zoom:15, duration:800 });
    // drive card
    var next = t.stops[S.simIdx+1] ? POI_BY_ID[t.stops[S.simIdx+1]] : null;
    var dc = $("#drive-card"); dc.classList.add("show");
    var streets = ["S. Dakota Ave","Missouri Ave","Constitution Ave","Illinois Ave","Nebraska Ave"];
    dc.innerHTML =
      '<div class="top"><span class="kick on-light">STOP '+(S.simIdx+1)+' OF '+t.stopCount+'</span>' +
        '<span class="recalc'+(S.simIdx%3===1?" on":"")+'">RECALCULATING…</span></div>' +
      '<div class="guide"><svg class="chev" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7 1.5-1.5L10 12l6.5-5.5z"/></svg>' +
        '<div><div class="dist">'+(0.3+S.simIdx*0.1).toFixed(1)+' mi</div>' +
        '<div class="instr">Turn left on '+streets[S.simIdx%streets.length]+'</div></div></div>' +
      '<div class="divider"></div>' +
      '<div class="next"><span class="ns disp">'+(next?next.title:"Final stop")+'</span>' +
        '<span class="eta">ETA 9:'+(46+S.simIdx)+' · '+(2+S.simIdx)+' MIN</span></div>';
    $("#drive-progress").innerHTML =
      '<span class="pchip">'+(S.simIdx+1)+'/'+t.stopCount+' COMPLETE</span><span class="pchip">'+t.drive+' TOTAL</span>';
    // arrival card + autoplay
    showArrival(p);
    if (S.now) startNarration(p.id);   // if narration was unlocked, autoplay
    S.simIdx++;
  }
  function stopSim() {
    if (S.simTimer){ clearInterval(S.simTimer); S.simTimer=null; }
    $("#drive-card").classList.remove("show");
    $("#drive-progress").style.display = "none";
    $("#arrival").classList.remove("show");
  }
  function showArrival(p) {
    var a = $("#arrival");
    a.innerHTML =
      '<button class="dismiss" data-arrival-close aria-label="Dismiss">'+I.close+'</button>' +
      '<span class="kick on-light">You\'ve arrived</span>' +
      '<div class="row"><div class="ph '+striped(p)+'" '+bg(p)+'></div>' +
        '<div><h3>'+p.title+'</h3><div class="m">'+p.duration+' · transcript available</div></div></div>' +
      '<div class="a-actions"><button class="btn btn-primary" data-play="'+p.id+'">'+I.play+' Play narration</button>' +
        '<button class="btn btn-outline" data-poi="'+p.id+'">Details</button></div>';
    a.classList.add("show");
    syncPlayIcons();
  }

  /* ================= MODALS ================= */
  function openModal(kind, arg) {
    var body = $("#modal-body");
    if (kind === "menu") {
      body.innerHTML = modalHead("Menu") +
        '<p class="note">The Engineer Post — a self-guided tour of Fort Leonard Wood. No account, no download, no personal data collected.</p>' +
        menuItem("tours","Home &amp; Tours") + menuItem("map","Interactive Map") + menuItem("search","Search") + menuItem("near","Near Me") +
        '<button class="menu-item" data-report=""><span>Report an issue</span><span class="ar">'+I.chevron+'</span></button>' +
        '<button class="menu-item" data-share><span>Share this tour</span><span class="ar">'+I.chevron+'</span></button>';
    } else if (kind === "report") {
      var p = arg ? POI_BY_ID[arg] : null;
      body.innerHTML = modalHead("Report an issue") +
        '<p class="note">No name, email, or account is collected — only your message and which stop it came from.</p>' +
        (p ? '<div class="ctx-card"><div class="th" '+bg(p)+'></div><div><b>Stop '+p.n+' · '+p.title+'</b><div class="m">'+p.address+'</div></div></div>' : '') +
        '<div class="issue-chips">'+["Wrong location","Factual error","Broken media","Other"].map(function(c,i){ return '<button class="ic'+(i===0?" active":"")+'" data-issue>'+c+'</button>'; }).join("")+'</div>' +
        '<textarea id="rtext" maxlength="600" placeholder="Describe the issue…"></textarea>' +
        '<div class="cc" id="rcc">Free text only · 0 of 600 characters</div>' +
        '<button class="btn btn-dark btn-block" data-send-report>Send report</button>';
    } else if (kind === "share") {
      body.innerHTML = modalHead("Share this tour") +
        '<p class="note">Anyone can open the tour instantly — no app, no login.</p>' +
        '<div class="qr-wrap">'+qrSVG()+'<div class="qr-cap">tour.leonardwood.army.mil <span style="opacity:.6">(illustrative)</span></div></div>' +
        '<button class="btn btn-primary btn-block" style="margin-top:14px" data-close>Done</button>';
    }
    $("#mask").classList.add("show");
    var ta = $("#rtext"); if (ta) ta.addEventListener("input", function(){ $("#rcc").textContent = "Free text only · "+ta.value.length+" of 600 characters"; });
  }
  function modalHead(t){ return '<div class="mh"><h3>'+t+'</h3><button class="dismiss" data-close aria-label="Close">'+I.close+'</button></div>'; }
  function menuItem(v,l){ return '<button class="menu-item" data-menu="'+v+'"><span>'+l+'</span><span class="ar">'+I.chevron+'</span></button>'; }
  function closeModal(){ $("#mask").classList.remove("show"); }
  function qrSVG() {
    var n=13, seed=[], v=7; for(var i=0;i<n*n;i++){ v=(v*1103515245+12345)&0x7fffffff; seed.push((v>>8)&1); }
    var g=""; for(var y=0;y<n;y++)for(var x=0;x<n;x++){ if(seed[y*n+x]) g+='<rect x="'+(x*10)+'" y="'+(y*10)+'" width="10" height="10"/>'; }
    return '<svg width="150" height="150" viewBox="0 0 130 130" fill="#221F20"><rect width="130" height="130" fill="#fff"/>'+g+
      '<rect x="0" y="0" width="34" height="34" fill="#fff"/><rect x="4" y="4" width="26" height="26" fill="none" stroke="#221F20" stroke-width="7"/>'+
      '<rect x="96" y="0" width="34" height="34" fill="#fff"/><rect x="100" y="4" width="26" height="26" fill="none" stroke="#221F20" stroke-width="7"/>'+
      '<rect x="0" y="96" width="34" height="34" fill="#fff"/><rect x="4" y="100" width="26" height="26" fill="none" stroke="#221F20" stroke-width="7"/></svg>';
  }
  function toast(msg) {
    var a = $("#arrival");
    a.innerHTML = '<span class="kick on-light">Thank you</span><h3 style="margin:6px 0 0">'+msg+'</h3>';
    a.classList.add("show"); clearTimeout(a._t); a._t = setTimeout(function(){ a.classList.remove("show"); }, 3200);
  }

  /* ================= EVENT DELEGATION ================= */
  document.addEventListener("click", function(e) {
    var t = e.target.closest("[data-tour],[data-viewtour],[data-poi],[data-go],[data-starttour],[data-play],[data-openplayer],[data-intro],[data-share],[data-report],[data-menu],[data-close],[data-ext],[data-drive],[data-prime],[data-collapse],[data-toggle-now],[data-seek],[data-next],[data-speed],[data-q],[data-issue],[data-send-report],[data-arrival-close],[data-tline],[data-mtour],[data-filter],[data-maplist],[data-sheet-cycle]");
    if (!t) return;
    var d = t.dataset;

    if ("close" in d) return closeModal();
    if (d.menu) { closeModal(); return go(d.menu); }
    if (d.go) { if(d.go==="map"&&S.activeStop) S.sheetPoi=S.activeStop; return go(d.go); }
    if (d.viewtour) { closeModal(); S.activeTour=d.viewtour; S.sheetPoi=TOUR_BY_ID[d.viewtour].stops[0]; if(S.map) drawTour(); return go("map"); }
    if (d.tour) return renderDetail(d.tour);
    if (d.poi) { closeModal(); $("#arrival").classList.remove("show"); return renderPOI(d.poi); }
    if (d.starttour) { S.activeTour=d.starttour; S.now={id:TOUR_BY_ID[d.starttour].stops[0],playing:false}; startNarration(TOUR_BY_ID[d.starttour].stops[0]); return renderPOI(TOUR_BY_ID[d.starttour].stops[0]); }
    if (d.play) { startNarration(d.play); return; }
    if (d.openplayer) return openPlayer(d.openplayer);
    if ("intro" in d) { startNarration("__intro"); return openPlayer("__intro"); }
    if ("share" in d) { closeModal(); return openModal("share"); }
    if ("report" in d) { closeModal(); return openModal("report", d.report||null); }
    if (d.ext !== undefined) { e.preventDefault(); if(confirm("This opens an external website:\n"+d.ext+"\n\nExternal sites have their own privacy practices. Continue?")) window.open(d.ext,"_blank","noopener"); return; }
    if (d.drive) { return startSim(); }
    if ("prime" in d) { return showPrime(); }
    if ("collapse" in d) { return go(S.activeStop?"poi":"tours"); }
    if ("toggleNow" in d) return toggleNow();
    if (d.seek) { S.speakSecs = Math.max(0, Math.min(S.speakEst, S.speakSecs + (+d.seek))); return; }
    if ("next" in d) { nextStop(); return; }
    if ("speed" in d) { cycleSpeed(t); return; }
    if (d.q) { go("search"); setTimeout(function(){ var i=$("#sinput"); if(i){ i.value=d.q.replace(/^(.)(.*)$/,function(_,a,b){return a+b.toLowerCase();}); doSearch(i.value);} },40); return; }
    if ("issue" in d) { $$("#modal-body .ic").forEach(function(c){ c.classList.remove("active"); }); t.classList.add("active"); return; }
    if ("sendReport" in d) { closeModal(); return toast("Your note was routed to the content team."); }
    if ("arrivalClose" in d) { return $("#arrival").classList.remove("show"); }
    if (d.tline) { if(S.speakEst){ S.speakSecs = (+d.tline)/$$("#v-player .line").length*S.speakEst; } return; }
    if (d.filter) { S.filter=d.filter; $$("[data-filter]").forEach(function(b){ b.classList.toggle("active", b===t); }); drawTour(); return; }
    if (d.mtour) { S.activeTour=d.mtour; S.sheetPoi=TOUR_BY_ID[d.mtour].stops[0]; $$("[data-mtour]").forEach(function(b){ b.classList.toggle("active",b===t); }); drawTour(); return; }
    if (d.maplist) { S.mapMode=d.maplist; $$("[data-maplist]").forEach(function(b){ b.classList.toggle("active",b===t); }); $("#map-list").classList.toggle("active", d.maplist==="list"); return; }
    if ("sheetCycle" in d) { S.sheetState = S.sheetState==="peek"?"half":S.sheetState==="half"?"full":"peek"; renderSheet(); return; }
  });

  function nextStop() {
    var t = TOUR_BY_ID[S.activeTour];
    var id = S.now ? S.now.id : S.activeStop;
    var idx = t.stops.indexOf(id);
    if (idx>=0 && idx < t.stops.length-1) { var nx=t.stops[idx+1]; startNarration(nx); openPlayer(nx); }
  }
  var speeds=[1,1.25,1.5,0.8];
  function cycleSpeed(btn){ var cur=parseFloat(btn.textContent); var i=(speeds.indexOf(cur)+1)%speeds.length; btn.textContent=speeds[i].toFixed(speeds[i]%1?2:1).replace(/0$/,'')+"×"; if(window.speechSynthesis){} }

  /* ================= INIT ================= */
  function init() {
    renderLanding(); renderSearch(); renderNear();
    // tab bar
    $$(".tabbar button").forEach(function(b){ b.addEventListener("click", function(){ go(b.dataset.view); }); });
    // mini player
    $("#mini").addEventListener("click", function(e){ if(e.target.closest("#mini-play")){ toggleNow(); } else { openPlayer(); } });
    // sheet grab cycle
    $("#sheet-grab").addEventListener("click", function(){ S.sheetState = S.sheetState==="peek"?"half":S.sheetState==="half"?"full":"peek"; renderSheet(); });
    // prime buttons
    $("#prime-enable").addEventListener("click", function(){ S.locationPermission="granted"; hidePrime(); renderNear(); go("near"); });
    $("#prime-cancel").addEventListener("click", function(){ S.locationPermission="denied"; hidePrime(); });
    // demo device toggle
    $$(".demo-bar [data-device]").forEach(function(b){ b.addEventListener("click", function(){
      var m=b.dataset.device; $("#stage").className = "stage "+(m==="desktop"?"desktop":(m==="android"?"android":"ios"));
      $$(".demo-bar [data-device]").forEach(function(x){ x.classList.toggle("active",x===b); });
      if(S.map) setTimeout(function(){ S.map.resize(); },320);
    }); });
    $("#demo-share").addEventListener("click", function(){ openModal("share"); });
    $("#mask").addEventListener("click", function(e){ if(e.target.id==="mask") closeModal(); });
    go("tours");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
