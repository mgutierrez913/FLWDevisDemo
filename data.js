/* =====================================================================
   Fort Leonard Wood Digital Tour — "The Engineer Post"
   Demo data model. Recreates the "Monument" design direction.
   ---------------------------------------------------------------------
   DEMONSTRATION content. Per the SOW, all history, imagery, audio,
   names, and coordinates are provided/approved by Fort Leonard Wood.
   Entries below are NOTIONAL placeholders. Names in the Sapper Grove
   memorial index are fictional and labeled accordingly. Coordinates are
   approximate, for illustration of the platform only.
   ===================================================================== */

const FLW = {
  center: [-92.1330, 37.7105],
  defaultZoom: 14,
  here: [-92.1455, 37.7075],          // notional "you are here" (near the gate)
  hereLabel: "MAIN POST"
};

/* ---- Points of interest / stops ------------------------------------ */
const POIS = [
  {
    id: "visitor-center", n: 1,
    title: "Visitor Center & Post Gate",
    address: "Visitor Control Center · Main Gate",
    category: "General History", cat: "history",
    coords: [-92.1470, 37.7068], geofence: 180,
    photo: "uploads/visitor_control_center.png",
    caption: "Visitor Control Center, Fort Leonard Wood.",
    teaser: "Where every arrival began.",
    interpretive: [
      "Every Soldier's story here starts at the gate. The Visitor Control Center is the front door to the installation and the recommended first stop on the tour.",
      "From the earliest days of the post, arrivals passed a checkpoint much like this one before continuing to Main Post. Confirm any access requirements here before beginning."
    ],
    narrator: "POST HISTORIAN", duration: "2:38",
    narration: "Welcome to Fort Leonard Wood. You are standing at the front door of the installation. From the earliest days of the post in 1940, new arrivals passed a checkpoint before continuing on to Main Post. Take a moment to orient yourself before the tour begins.",
    transcript: [
      "Welcome to Fort Leonard Wood. You are standing at the front door of the installation.",
      "From the earliest days of the post in 1940, new arrivals passed a checkpoint before continuing on to Main Post.",
      "Take a moment to orient yourself before the tour begins."
    ],
    keywords: ["visitor", "gate", "control center", "arrival", "start", "main gate"],
    parking: "Designated visitor parking on site.",
    access: "Fully accessible; step-free access and accessible parking."
  },
  {
    id: "engineer-museum", n: 2,
    title: "U.S. Army Engineer Museum",
    address: "Mahaffey Museum Complex · 14296 S. Dakota Ave.",
    category: "Museum", cat: "museum",
    coords: [-92.1288, 37.7069], geofence: 180,
    photo: "uploads/us_army_engineer_museum.png",
    caption: "John B. Mahaffey Museum Complex.",
    teaser: "Preserving our heritage, building our future.",
    interpretive: [
      "The John B. Mahaffey Museum Complex preserves the heritage of the Army's Engineer, Military Police, and Chemical Corps regiments.",
      "Galleries feature historic bridging and construction equipment, wartime engineering, and the outdoor Museum Vehicle Park. Search the museum index to find a specific exhibit or artifact."
    ],
    narrator: "MUSEUM CURATOR", duration: "3:51",
    narration: "You have arrived at the John B. Mahaffey Museum Complex, home to the U.S. Army Engineer Museum. Inside, galleries present historic bridging equipment, wartime engineering, and the heritage of the Engineer, Military Police, and Chemical Corps regiments. Outside, the vehicle park displays equipment spanning decades of Army history.",
    transcript: [
      "You have arrived at the John B. Mahaffey Museum Complex, home to the U.S. Army Engineer Museum.",
      "Inside, galleries present historic bridging equipment, wartime engineering, and the heritage of the Engineer, Military Police, and Chemical Corps regiments.",
      "Outside, the vehicle park displays equipment spanning decades of Army history."
    ],
    exhibits: [
      { name: "Harrison Bridge Model", gallery: "Gallery 2", artifact: "Scale model", period: "1944" },
      { name: "Historic Bridging Gallery", gallery: "Engineer Hall", artifact: "Bailey bridge section", period: "WWII" },
      { name: "Museum Vehicle Park", gallery: "Outdoor Park", artifact: "Construction & tactical vehicles", period: "Cold War" },
      { name: "Chemical Corps Exhibit", gallery: "CBRN Wing", artifact: "Protective equipment", period: "Modern" }
    ],
    keywords: ["museum", "mahaffey", "engineer museum", "exhibit", "gallery", "bridging", "vehicle park", "chemical", "military police"],
    parking: "Free visitor lot at the museum entrance.",
    access: "Step-free entrance, accessible restrooms, wide gallery aisles."
  },
  {
    id: "sapper-grove", n: 3,
    title: "Sapper Grove",
    address: "Memorial Grove · S. Dakota Ave.",
    category: "Memorial", cat: "memorial",
    coords: [-92.1352, 37.7101], geofence: 150,
    photo: "uploads/sapper_grove.png",
    caption: "Dedication ceremony, 1999. FLW Public Affairs.",
    teaser: "Sapper Memorial Grove sits within Memorial Grove on S. Dakota Ave., alongside Chemical Grove and the MP Regimental Walkway.",
    interpretive: [
      "Sapper Memorial Grove is part of Memorial Grove, a short walk from the John B. Mahaffey Museum Complex at 14296 S. Dakota Avenue. Granite benches, dedicated bricks, and trees carry the names of engineer soldiers who gave their lives in service.",
      "The grove honors the U.S. Army Engineer Regiment and its legacy of building strength and protecting the nation."
    ],
    narrator: "POST HISTORIAN", duration: "4:22",
    narration: "The grove you are standing in was dedicated in the spring of 1999. Each stone carries a single name, a rank, and a unit — the engineer soldiers of this post who died in service to the country. Families come here to make rubbings. If you are searching for a name, the index in Search gives the row and marker for every soldier honored here.",
    transcript: [
      "The grove you are standing in was dedicated in the spring of 1999.",
      "Each stone carries a single name, a rank, and a unit — the engineer soldiers of this post who died in service to the country.",
      "Families come here to make rubbings.",
      "If you are searching for a name, the index in Search gives the row and marker for every soldier honored here."
    ],
    gallery: [
      { cap: "Memorial arch and pavilion" },
      { cap: "Dedicated bricks along the walk" }
    ],
    people: [
      { rank: "SSG", name: "Marcus Harrison", unit: "577th Engineer Battalion", row: "Row C, marker 14" },
      { rank: "SPC", name: "Ellis Harrison", unit: "20th Engineer Brigade", row: "Row A, marker 3" },
      { rank: "1LT", name: "Dale Harrison-Webb", unit: "35th Engineer Regiment", row: "Row D, marker 9", close: true }
    ],
    keywords: ["sapper", "grove", "memorial", "engineer regiment", "honor", "names"],
    parking: "Visitor parking adjacent to the grove entrance.",
    access: "Paved, level path. Benches available. Narration and text alternative provided."
  },
  {
    id: "wwii-bldgs", n: 4,
    title: "WWII Mobilization Bldgs",
    address: "Fort Leonard Wood Museum",
    category: "General History", cat: "history",
    coords: [-92.1378, 37.7132], geofence: 160,
    photo: null,
    caption: "1941 mobilization-era cantonment (archival).",
    teaser: "Surviving World War II mobilization buildings from the fort's rapid 1940s buildup.",
    interpretive: [
      "Established in 1940, Fort Leonard Wood expanded at extraordinary speed to train Soldiers for World War II. These mobilization-era buildings illustrate the scale of that wartime buildup.",
      "Preserved as the Fort Leonard Wood Museum, they show how quickly a training post rose from the Missouri Ozarks."
    ],
    narrator: "POST HISTORIAN", duration: "3:10",
    narration: "The buildings around you date to the fort's rapid expansion in the early 1940s. When the nation mobilized for World War Two, an entire cantonment of wooden structures rose here in a matter of months to train and house Soldiers bound for war.",
    transcript: [
      "The buildings around you date to the fort's rapid expansion in the early 1940s.",
      "When the nation mobilized for World War Two, an entire cantonment of wooden structures rose here in a matter of months.",
      "They trained and housed Soldiers bound for war."
    ],
    keywords: ["wwii", "world war 2", "mobilization", "cantonment", "1941", "museum buildings"],
    parking: "Street parking along the historic loop.",
    access: "Sidewalk route with curb cuts; text-based tour directions available."
  },
  {
    id: "memorial-grove", n: 5,
    title: "Memorial Grove",
    address: "Sapper Grove · Chemical Grove · MP Walkway",
    category: "Memorial", cat: "memorial",
    coords: [-92.1360, 37.7118], geofence: 150,
    photo: null,
    caption: "Memorial Grove walk (imagery to be provided by FLW).",
    teaser: "A place of reflection joining the Engineer, Chemical, and Military Police memorials.",
    interpretive: [
      "Memorial Grove brings together the Sapper Memorial Grove, the Chemical Corps Grove, and the Military Police Regimental Walkway.",
      "Dedicated trees and markers commemorate the service and sacrifice of the regiments trained at Fort Leonard Wood."
    ],
    narrator: "POST HISTORIAN", duration: "2:55",
    narration: "Memorial Grove is a place of reflection. It joins three memorials — the Sapper Grove of the Engineer Regiment, the Chemical Corps Grove, and the Military Police Regimental Walkway. Dedicated trees and markers honor the regiments trained at this post.",
    transcript: [
      "Memorial Grove is a place of reflection.",
      "It joins three memorials — the Sapper Grove of the Engineer Regiment, the Chemical Corps Grove, and the Military Police Regimental Walkway.",
      "Dedicated trees and markers honor the regiments trained at this post."
    ],
    keywords: ["memorial grove", "chemical grove", "mp walkway", "regimental", "reflection"],
    parking: "Small lot at the grove entrance.",
    access: "Level paved and gravel path; benches available."
  },
  {
    id: "nutter-field-house", n: 6,
    title: "Nutter Field House",
    address: "Fort Leonard Wood",
    category: "General History", cat: "history",
    coords: [-92.1305, 37.7126], geofence: 150,
    photo: "uploads/nutter_field_house.png",
    caption: "Nutter Field House, Fort Leonard Wood.",
    teaser: "For generations of Soldiers, the site of graduation and the end of training.",
    interpretive: [
      "Nutter Field House has served generations of Soldiers as a venue for graduations, ceremonies, and athletics.",
      "For many trainees and their families, it marks the culmination of initial military training at Fort Leonard Wood."
    ],
    narrator: "POST HISTORIAN", duration: "2:20",
    narration: "This is Nutter Field House. For generations of Soldiers, this building has hosted graduations, ceremonies, and athletics. For many, walking across this floor marked the end of training and the beginning of an Army career.",
    transcript: [
      "This is Nutter Field House.",
      "For generations of Soldiers, this building has hosted graduations, ceremonies, and athletics.",
      "For many, walking across this floor marked the end of training and the beginning of an Army career."
    ],
    keywords: ["nutter", "field house", "graduation", "ceremony", "athletics"],
    parking: "Large event lot adjacent.",
    access: "Accessible entrances and seating; step-free route from lot."
  },
  {
    id: "harrison-hall", n: 7,
    title: "Harrison Hall",
    address: "Nebraska Ave.",
    category: "General History", cat: "history",
    coords: [-92.1410, 37.7095], geofence: 150,
    photo: null,
    caption: "Harrison Hall (imagery to be provided by FLW).",
    teaser: "A Main Post landmark named for a distinguished engineer officer.",
    interpretive: [
      "Harrison Hall stands on Nebraska Avenue as part of the Main Post landscape.",
      "Buildings across the post carry the names of Soldiers who shaped the Engineer Regiment's history."
    ],
    narrator: "POST HISTORIAN", duration: "2:05",
    narration: "Harrison Hall stands here on Nebraska Avenue. Across Fort Leonard Wood, buildings carry the names of Soldiers who shaped the history of the Engineer Regiment.",
    transcript: [
      "Harrison Hall stands here on Nebraska Avenue.",
      "Across Fort Leonard Wood, buildings carry the names of Soldiers who shaped the history of the Engineer Regiment."
    ],
    keywords: ["harrison hall", "nebraska", "building", "main post"],
    parking: "Street parking on Nebraska Ave.",
    access: "Accessible entrance; step-free route."
  },
  {
    id: "vehicle-park", n: 8,
    title: "Museum Vehicle Park",
    address: "Mahaffey Museum Complex",
    category: "Museum", cat: "museum",
    coords: [-92.1296, 37.7080], geofence: 150,
    photo: null,
    caption: "Outdoor vehicle park (imagery to be provided by FLW).",
    teaser: "An open-air display of engineer and tactical vehicles spanning decades.",
    interpretive: [
      "The outdoor Museum Vehicle Park displays construction equipment and tactical vehicles used by Army engineers across the twentieth century.",
      "It complements the indoor galleries of the Mahaffey Museum Complex."
    ],
    narrator: "MUSEUM CURATOR", duration: "2:40",
    narration: "Around you is the Museum Vehicle Park, an open-air display of the equipment Army engineers have operated across the last century — from wartime bulldozers to tactical trucks and bridging rigs.",
    transcript: [
      "Around you is the Museum Vehicle Park, an open-air display of engineer equipment.",
      "It spans the last century — from wartime bulldozers to tactical trucks and bridging rigs."
    ],
    keywords: ["vehicle park", "vehicles", "equipment", "outdoor", "bulldozer", "bridging"],
    parking: "Museum visitor lot.",
    access: "Paved pathways; step-free viewing."
  }
];

const POI_BY_ID = Object.fromEntries(POIS.map(p => [p.id, p]));

/* ---- Tours --------------------------------------------------------- */
const TOURS = [
  {
    id: "founding", num: "TOUR ONE",
    title: "Founding & Growth, 1940–45",
    category: "GENERAL HISTORY", cat: "history",
    desc: "Twelve stops from the first survey stakes to wartime expansion. Drive between stops; each takes five to ten minutes on foot.",
    caption: "One tap unlocks audio for all twelve stops.",
    stops: ["visitor-center", "engineer-museum", "sapper-grove", "wwii-bldgs", "memorial-grove", "nutter-field-house", "harrison-hall"],
    stopCount: 12, mins: "55 MIN", drive: "6.4 MI",
    hero: "uploads/visitor_control_center.png"
  },
  {
    id: "regiment", num: "TOUR TWO",
    title: "Memorials & the Regiment",
    category: "MEMORIALS", cat: "memorial",
    desc: "A commemorative route through the groves and monuments that honor the Engineer, Chemical, and Military Police regiments trained here.",
    caption: "One tap unlocks audio for every stop on the route.",
    stops: ["sapper-grove", "memorial-grove", "vehicle-park", "engineer-museum"],
    stopCount: 9, mins: "40 MIN", drive: "4.9 MI",
    hero: "uploads/sapper_grove.png"
  }
];
const TOUR_BY_ID = Object.fromEntries(TOURS.map(t => [t.id, t]));

/* ---- Intro narration (landing) ------------------------------------- */
const INTRO = {
  duration: "2:14",
  narration: "Since 1940, this ground has trained more than four million Soldiers. Two tours trace that record — its memorials, its museums, and the mobilization blocks that rose here for the Second World War. Choose a tour to begin. No account, no download — just tap and go.",
  transcript: [
    "Since 1940, this ground has trained more than four million Soldiers.",
    "Two tours trace that record — its memorials, its museums, and the mobilization blocks that rose here for the Second World War.",
    "Choose a tour to begin. No account, no download — just tap and go."
  ]
};

/* ---- Search index -------------------------------------------------- */
/* Specialized search from the SOW: names at Sapper Grove, museum displays */
const RECENT_SEARCHES = ["5TH ENGINEERS", "VIETNAM", "MUSEUM"];
const SUGGESTED = ["ENGINEER REGIMENT", "WWII", "CHEMICAL CORPS", "MILITARY POLICE", "1940s"];

const SEARCH_INDEX = (() => {
  const rows = [];
  POIS.forEach(p => {
    const tour = TOURS.find(t => t.stops.includes(p.id));
    rows.push({
      group: "Places", kind: "place",
      label: p.title, sub: `Stop ${p.n}${tour ? " · " + tour.title.split(",")[0] : ""}`,
      poi: p.id, terms: [p.title, p.address, p.category, ...(p.keywords || [])].join(" ").toLowerCase()
    });
    (p.people || []).forEach(person => rows.push({
      group: "People · Sapper Grove", kind: "person",
      label: `${person.rank} ${person.name}`, sub: `${person.unit} · ${person.row}`,
      close: !!person.close, poi: p.id,
      terms: `${person.rank} ${person.name} ${person.unit}`.toLowerCase()
    }));
    (p.exhibits || []).forEach(ex => rows.push({
      group: "Museum Exhibits", kind: "exhibit",
      label: ex.name, sub: `${ex.gallery} · ${ex.artifact} · ${ex.period}`,
      poi: p.id, terms: `${ex.name} ${ex.gallery} ${ex.artifact} ${ex.period}`.toLowerCase()
    }));
  });
  TOURS.forEach(t => rows.push({
    group: "Tours", kind: "tour",
    label: t.title, sub: `${t.stopCount} stops · ${t.category}`,
    tour: t.id, terms: `${t.title} ${t.category}`.toLowerCase()
  }));
  return rows;
})();
