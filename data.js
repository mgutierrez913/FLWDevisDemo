/* =====================================================================
   Fort Leonard Wood Digital Tour — DEMO DATA
   ---------------------------------------------------------------------
   NOTE: This is DEMONSTRATION content only. Per the SOW, all historical
   narratives, imagery, audio, names, coordinates, and interpretive
   content are provided and approved by Fort Leonard Wood. The entries
   below are NOTIONAL placeholders used to show how the platform works.
   Coordinates are approximate and for illustration.
   ===================================================================== */

const FLW = {
  center: [-92.1370, 37.7115], // notional main-post center [lon, lat]
  defaultZoom: 13.4
};

/* ---- Points of Interest -------------------------------------------- */
/* Each POI lives in a structured content model (not in code), matching
   the Technical Volume: title, category, coords, geofence radius,
   history, media, narration, keywords, people, exhibits, accessibility. */

const POIS = [
  {
    id: "sapper-grove",
    n: 1,
    title: "Sapper Grove",
    subtitle: "Memorial & Historic Site",
    category: "Memorial",
    coords: [-92.1435, 37.7120],
    geofence: 150,
    short: "Dedicated to the Soldiers of the Engineer Regiment who have served our nation with honor and distinction.",
    history: "Sapper Grove is dedicated to the men and women of the U.S. Army Engineer Regiment. The grove honors their service, sacrifice, and legacy of building strength and protecting our nation. Interpretive markers along the walk trace the Regiment's history from its founding through modern combat engineering operations.",
    media: [
      { type: "image", label: "Sapper Grove Memorial Arch" },
      { type: "video", label: "Engineer Regiment: A Legacy of Service (2:14)", link: "https://www.youtube.com/results?search_query=US+Army+Engineer+Regiment" }
    ],
    narration: "Welcome to Sapper Grove. This memorial is dedicated to the men and women of the United States Army Engineer Regiment. As you walk the grove, interpretive markers trace the Regiment's history of building strength and protecting the nation.",
    keywords: ["sapper", "grove", "memorial", "engineer regiment", "arch", "honor"],
    people: [
      { name: "SFC (Notional) J. Alvarez", unit: "Engineer Regiment", note: "Memorial marker — demonstration entry" },
      { name: "SPC (Notional) D. Whitfield", unit: "20th Engineer Bn", note: "Memorial marker — demonstration entry" },
      { name: "SSG (Notional) M. O'Neil", unit: "Engineer Regiment", note: "Memorial marker — demonstration entry" }
    ],
    tours: ["history", "engineer"],
    parking: "Visitor parking adjacent to the grove entrance.",
    accessibility: "Paved, level walking path. Benches available. Audio narration and text alternative provided."
  },
  {
    id: "engineer-museum",
    n: 2,
    title: "U.S. Army Engineer Museum",
    subtitle: "John B. Mahaffey Museum Complex",
    category: "Museum",
    coords: [-92.1290, 37.7075],
    geofence: 180,
    short: "Home to the history of Army Engineers, Military Police, and Chemical Corps at the Maneuver Support Center of Excellence.",
    history: "The John B. Mahaffey Museum Complex preserves and presents the heritage of the Army's Engineer, Military Police, and Chemical Corps regiments. Galleries feature historic bridging and construction equipment, wartime engineering, and the evolution of maneuver support. The complex is a primary stop on the installation's history tour.",
    media: [
      { type: "image", label: "Museum Complex Entrance" },
      { type: "video", label: "Inside the Engineer Museum (walkthrough)", link: "https://www.youtube.com/results?search_query=US+Army+Engineer+Museum+Fort+Leonard+Wood" }
    ],
    narration: "You have arrived at the John B. Mahaffey Museum Complex, home to the U.S. Army Engineer Museum. Inside, galleries present historic bridging equipment, wartime engineering, and the heritage of the Engineer, Military Police, and Chemical Corps regiments.",
    keywords: ["museum", "mahaffey", "engineer museum", "exhibit", "gallery", "chemical corps", "military police"],
    exhibits: [
      { exhibit: "Historic Bridging Gallery", gallery: "Engineer Hall", artifact: "Bailey bridge section", period: "WWII" },
      { exhibit: "Construction Equipment Yard", gallery: "Outdoor Park", artifact: "Vintage bulldozer & grader", period: "Cold War" },
      { exhibit: "Chemical Corps Exhibit", gallery: "CBRN Wing", artifact: "Protective equipment display", period: "Modern" },
      { exhibit: "Military Police Heritage", gallery: "MP Wing", artifact: "Historic MP gear & vehicles", period: "20th Century" }
    ],
    tours: ["history", "engineer"],
    parking: "Free visitor lot at the museum entrance.",
    accessibility: "Step-free entrance, accessible restrooms, wide gallery aisles. Seated rest points throughout."
  },
  {
    id: "historic-district",
    n: 3,
    title: "Main Post Historic District",
    subtitle: "WWII-Era Cantonment",
    category: "Historic Site",
    coords: [-92.1360, 37.7145],
    geofence: 160,
    short: "Surviving World War II mobilization buildings that tell the story of the fort's rapid 1940s expansion.",
    history: "Established in 1940 and named for General of the Armies John J. Pershing's contemporary, Fort Leonard Wood expanded rapidly to train Soldiers for World War II. The Main Post Historic District preserves representative mobilization-era structures, illustrating the scale and speed of the wartime buildup and the fort's enduring role in training generations of Soldiers.",
    media: [
      { type: "image", label: "WWII Mobilization Buildings" }
    ],
    narration: "This is the Main Post Historic District. The buildings around you date to the fort's rapid expansion in the early 1940s, when Fort Leonard Wood trained Soldiers for service in World War Two.",
    keywords: ["historic district", "wwii", "world war 2", "mobilization", "main post", "1940s", "cantonment"],
    tours: ["history"],
    parking: "Street parking along the historic loop.",
    accessibility: "Sidewalk route with curb cuts. Text-based tour directions available."
  },
  {
    id: "memorial-grove",
    n: 4,
    title: "Memorial Grove",
    subtitle: "Veterans Memorial",
    category: "Memorial",
    coords: [-92.1400, 37.7165],
    geofence: 140,
    short: "A quiet grove and memorial walk honoring those who served and sacrificed.",
    history: "Memorial Grove provides a place of reflection honoring Soldiers and units connected to Fort Leonard Wood. Dedicated trees and markers commemorate service and sacrifice across the fort's history.",
    media: [
      { type: "image", label: "Memorial Grove Walk" }
    ],
    narration: "Welcome to Memorial Grove, a place of reflection honoring the Soldiers and units connected to Fort Leonard Wood. Take a moment as you walk the memorial path.",
    keywords: ["memorial grove", "veterans", "reflection", "dedicated trees"],
    tours: ["history", "engineer"],
    parking: "Small lot at the grove entrance.",
    accessibility: "Level gravel and paved path. Benches available."
  },
  {
    id: "iron-mike",
    n: 5,
    title: "MSCoE Plaza & Regimental Walk",
    subtitle: "Maneuver Support Center of Excellence",
    category: "Historic Site",
    coords: [-92.1330, 37.7110],
    geofence: 150,
    short: "The ceremonial heart of the Maneuver Support Center of Excellence and its regimental heritage.",
    history: "The MSCoE Plaza and Regimental Walk mark the ceremonial center of the Maneuver Support Center of Excellence, which trains and educates the Army's Engineer, Military Police, and Chemical Corps. Monuments and markers along the walk recognize regimental history and distinguished service.",
    media: [
      { type: "image", label: "Regimental Walk Monuments" }
    ],
    narration: "You are at the M-S-CoE Plaza and Regimental Walk, the ceremonial center of the Maneuver Support Center of Excellence. Monuments here recognize the Engineer, Military Police, and Chemical Corps regiments.",
    keywords: ["mscoe", "plaza", "regimental walk", "maneuver support", "monument", "iron mike"],
    tours: ["engineer"],
    parking: "Visitor parking near the headquarters.",
    accessibility: "Paved plaza, fully step-free. Seating available."
  },
  {
    id: "nutter-field-house",
    n: 6,
    title: "Nutter Field House",
    subtitle: "Historic Athletic & Ceremony Venue",
    category: "Historic Site",
    coords: [-92.1310, 37.7130],
    geofence: 150,
    short: "A long-standing venue for graduations, ceremonies, and athletics on the installation.",
    history: "Nutter Field House has served generations of Soldiers as a venue for graduations, ceremonies, and athletics. For many trainees and families, it marks the culmination of initial military training at Fort Leonard Wood.",
    media: [
      { type: "image", label: "Nutter Field House" }
    ],
    narration: "This is Nutter Field House, a long-standing venue for graduations, ceremonies, and athletics. For many Soldiers and their families, it marks the culmination of training at Fort Leonard Wood.",
    keywords: ["nutter", "field house", "graduation", "ceremony", "athletics"],
    tours: ["history"],
    parking: "Large event lot adjacent.",
    accessibility: "Accessible entrances and seating; step-free route from lot."
  },
  {
    id: "visitor-center",
    n: 7,
    title: "Visitor Control Center",
    subtitle: "Start Here — Access & Orientation",
    category: "Visitor Support",
    coords: [-92.1480, 37.7060],
    geofence: 200,
    short: "Orientation, maps, and access information for visitors arriving at the installation.",
    history: "The Visitor Control Center is the recommended starting point for guests. Here visitors can orient themselves, pick up printed information, and confirm access requirements before beginning a tour.",
    media: [
      { type: "image", label: "Visitor Control Center" }
    ],
    narration: "Welcome to Fort Leonard Wood. The Visitor Control Center is your starting point. Please confirm any access requirements here before beginning your tour.",
    keywords: ["visitor center", "orientation", "access", "gate", "start", "parking"],
    tours: ["history", "engineer"],
    parking: "Designated visitor parking on site.",
    accessibility: "Fully accessible facility with step-free access and accessible parking."
  }
];

/* ---- Tours (single application framework, min. two tours) ---------- */
const TOURS = [
  {
    id: "history",
    title: "Fort Leonard Wood History Tour",
    subtitle: "The story of the installation, from 1940 to today",
    stops: ["visitor-center", "sapper-grove", "historic-district", "memorial-grove", "engineer-museum", "nutter-field-house"],
    distance: "6.4 mi",
    duration: "45 min",
    color: "#1b3b5f"
  },
  {
    id: "engineer",
    title: "Engineer Regiment & Memorials Tour",
    subtitle: "Honoring the heritage of the Army Engineer Regiment",
    stops: ["visitor-center", "sapper-grove", "iron-mike", "engineer-museum", "memorial-grove"],
    distance: "4.9 mi",
    duration: "35 min",
    color: "#2f8f86"
  }
];

/* Helper lookups */
const POI_BY_ID = Object.fromEntries(POIS.map(p => [p.id, p]));
const TOUR_BY_ID = Object.fromEntries(TOURS.map(t => [t.id, t]));

/* ---- Flattened search index (person names, exhibits, POIs) --------- */
/* Demonstrates the SOW's specialized search: name searches at Sapper
   Grove and queries for specific museum displays. */
const SEARCH_INDEX = (() => {
  const rows = [];
  POIS.forEach(p => {
    rows.push({
      kind: "Place",
      label: p.title,
      sub: p.subtitle,
      poi: p.id,
      terms: [p.title, p.subtitle, p.category, ...(p.keywords || [])].join(" ").toLowerCase()
    });
    (p.people || []).forEach(person => {
      rows.push({
        kind: "Person / Memorial",
        label: person.name,
        sub: `${person.unit} · ${p.title}`,
        poi: p.id,
        terms: `${person.name} ${person.unit} ${p.title}`.toLowerCase()
      });
    });
    (p.exhibits || []).forEach(ex => {
      rows.push({
        kind: "Museum Exhibit",
        label: ex.exhibit,
        sub: `${ex.gallery} · ${ex.artifact} · ${ex.period}`,
        poi: p.id,
        terms: `${ex.exhibit} ${ex.gallery} ${ex.artifact} ${ex.period}`.toLowerCase()
      });
    });
  });
  return rows;
})();
