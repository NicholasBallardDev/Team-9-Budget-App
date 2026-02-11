import { useState, useEffect, useRef } from "react";

const FUEL_TYPES = [
  { id: "U91", label: "Unleaded 91", short: "U91" },
  { id: "P95", label: "Premium 95", short: "P95" },
  { id: "P98", label: "Premium 98", short: "P98" },
  { id: "E10", label: "Ethanol E10", short: "E10" },
  { id: "DL", label: "Diesel", short: "DSL" },
  { id: "LPG", label: "LPG", short: "LPG" },
];

const MOCK_FUEL_STATIONS = [
  { id: 1, name: "United Petroleum", address: "123 Pacific Hwy, Chatswood NSW 2067", lat: -33.7969, lng: 151.1832, brand: "United",
    prices: { U91: 1.629, P95: 1.729, P98: 1.829, E10: 1.589, DL: 1.799, LPG: 0.949 } },
  { id: 2, name: "BP Mosman", address: "456 Military Rd, Mosman NSW 2088", lat: -33.8295, lng: 151.2440, brand: "BP",
    prices: { U91: 1.649, P95: 1.749, P98: 1.849, E10: 1.609, DL: 1.819, LPG: null } },
  { id: 3, name: "Shell Neutral Bay", address: "789 Military Rd, Neutral Bay NSW 2089", lat: -33.8340, lng: 151.2170, brand: "Shell",
    prices: { U91: 1.679, P95: 1.769, P98: 1.879, E10: null, DL: 1.839, LPG: 0.979 } },
  { id: 4, name: "7-Eleven Crows Nest", address: "12 Falcon St, Crows Nest NSW 2065", lat: -33.8265, lng: 151.2035, brand: "7-Eleven",
    prices: { U91: 1.659, P95: 1.759, P98: 1.859, E10: 1.619, DL: 1.809, LPG: null } },
  { id: 5, name: "Caltex Artarmon", address: "90 Reserve Rd, Artarmon NSW 2064", lat: -33.8120, lng: 151.1860, brand: "Caltex",
    prices: { U91: 1.699, P95: 1.789, P98: 1.899, E10: 1.649, DL: 1.859, LPG: 0.999 } },
  { id: 6, name: "Metro Petroleum", address: "34 Pacific Hwy, St Leonards NSW 2065", lat: -33.8230, lng: 151.1945, brand: "Metro",
    prices: { U91: 1.619, P95: 1.719, P98: 1.809, E10: 1.579, DL: 1.779, LPG: 0.929 } },
];

const MOCK_STORES = {
  coles: [
    { id: "c1", name: "Coles Chatswood", address: "1 Anderson St, Chatswood NSW 2067", lat: -33.7960, lng: 151.1830, distance: 1.2 },
    { id: "c2", name: "Coles St Leonards", address: "100 Pacific Hwy, St Leonards NSW 2065", lat: -33.8230, lng: 151.1940, distance: 2.4 },
  ],
  woolworths: [
    { id: "w1", name: "Woolworths Chatswood", address: "Victoria Ave, Chatswood NSW 2067", lat: -33.7955, lng: 151.1815, distance: 0.9 },
    { id: "w2", name: "Woolworths Neutral Bay", address: "Military Rd, Neutral Bay NSW 2089", lat: -33.8345, lng: 151.2175, distance: 3.1 },
  ],
};

const MOCK_GROCERY_ITEMS = {
  milk: { name: "Full Cream Milk 2L", coles: { price: 3.10, unit: "each", brand: "Coles" }, woolworths: { price: 3.30, unit: "each", brand: "Woolworths" } },
  bread: { name: "White Bread Loaf 700g", coles: { price: 3.50, unit: "each", brand: "Coles" }, woolworths: { price: 3.20, unit: "each", brand: "Woolworths" } },
  eggs: { name: "Free Range Eggs 12pk", coles: { price: 6.50, unit: "each", brand: "Coles" }, woolworths: { price: 6.00, unit: "each", brand: "Woolworths" } },
  banana: { name: "Bananas per kg", coles: { price: 3.90, unit: "per kg", brand: "Coles" }, woolworths: { price: 4.20, unit: "per kg", brand: "Woolworths" } },
  chicken: { name: "Chicken Breast 500g", coles: { price: 8.50, unit: "each", brand: "Coles" }, woolworths: { price: 9.00, unit: "each", brand: "Woolworths" } },
  rice: { name: "White Rice 1kg", coles: { price: 2.80, unit: "each", brand: "Coles" }, woolworths: { price: 2.60, unit: "each", brand: "Woolworths" } },
  pasta: { name: "Penne Pasta 500g", coles: { price: 1.90, unit: "each", brand: "Coles" }, woolworths: { price: 1.70, unit: "each", brand: "Woolworths" } },
  cheese: { name: "Tasty Cheese Block 500g", coles: { price: 6.00, unit: "each", brand: "Coles" }, woolworths: { price: 6.50, unit: "each", brand: "Woolworths" } },
  tomato: { name: "Tomatoes per kg", coles: { price: 5.50, unit: "per kg", brand: "Coles" }, woolworths: { price: 5.00, unit: "per kg", brand: "Woolworths" } },
  yoghurt: { name: "Greek Yoghurt 1kg", coles: { price: 5.80, unit: "each", brand: "Coles" }, woolworths: { price: 5.50, unit: "each", brand: "Woolworths" } },
  coffee: { name: "Instant Coffee 200g", coles: { price: 10.00, unit: "each", brand: "Coles" }, woolworths: { price: 9.50, unit: "each", brand: "Woolworths" } },
  cereal: { name: "Weet-Bix 750g", coles: { price: 4.80, unit: "each", brand: "Coles" }, woolworths: { price: 4.60, unit: "each", brand: "Woolworths" } },
};

const BrandColor = ({ brand }) => {
  const colors = {
    United: "#e63946", BP: "#009639", Shell: "#fbbb21",
    "7-Eleven": "#f05a28", Caltex: "#e31937", Metro: "#1a73e8",
  };
  return (
    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: colors[brand] || "#888", flexShrink: 0 }} />
  );
};

const PriceTag = ({ price, isLowest }) => (
  <span style={{
    fontFamily: "'DM Mono', monospace",
    fontSize: 20,
    fontWeight: 700,
    color: isLowest ? "#16a34a" : "#374151",
    backgroundColor: isLowest ? "#dcfce7" : "transparent",
    padding: isLowest ? "2px 10px" : "2px 0",
    borderRadius: 8,
  }}>
    ${price.toFixed(2)}
  </span>
);

/* ─── NSW Postcode → Suburb name lookup ─── */
const POSTCODE_SUBURBS = {
  "2000": "Sydney CBD", "2001": "Sydney", "2006": "University of Sydney", "2007": "Ultimo",
  "2008": "Chippendale", "2009": "Pyrmont", "2010": "Surry Hills", "2011": "Potts Point",
  "2015": "Alexandria", "2016": "Redfern", "2017": "Waterloo", "2018": "Rosebery",
  "2019": "Botany", "2020": "Mascot", "2021": "Paddington", "2022": "Bondi Junction",
  "2023": "Bellevue Hill", "2024": "Waverley", "2025": "Woollahra", "2026": "Bondi",
  "2027": "Darling Point", "2028": "Double Bay", "2029": "Rose Bay", "2030": "Vaucluse",
  "2031": "Clovelly", "2032": "Kingsford", "2033": "Kensington", "2034": "Coogee",
  "2035": "Maroubra", "2036": "La Perouse", "2037": "Glebe", "2038": "Annandale",
  "2039": "Rozelle", "2040": "Leichhardt", "2041": "Balmain", "2042": "Newtown",
  "2043": "Erskineville", "2044": "St Peters", "2045": "Haberfield", "2046": "Five Dock",
  "2047": "Drummoyne", "2048": "Stanmore", "2049": "Petersham", "2050": "Camperdown",
  "2060": "North Sydney", "2061": "Milsons Point", "2062": "Cammeray",
  "2063": "Northbridge", "2064": "Artarmon", "2065": "Crows Nest", "2066": "Lane Cove",
  "2067": "Chatswood", "2068": "Willoughby", "2069": "Roseville", "2070": "Lindfield",
  "2071": "Killara", "2072": "Gordon", "2073": "Pymble", "2074": "Turramurra",
  "2075": "Wahroonga", "2076": "Normanhurst", "2077": "Hornsby", "2078": "Asquith",
  "2079": "Mount Colah", "2080": "Mount Kuring-gai", "2085": "Belrose",
  "2086": "Frenchs Forest", "2087": "Forestville", "2088": "Mosman",
  "2089": "Neutral Bay", "2090": "Cremorne", "2093": "Manly", "2095": "Manly",
  "2096": "Curl Curl", "2097": "Collaroy", "2099": "Dee Why", "2100": "Brookvale",
  "2101": "Narrabeen", "2102": "Warriewood", "2103": "Mona Vale", "2104": "Bayview",
  "2105": "Church Point", "2106": "Newport", "2107": "Avalon", "2108": "Palm Beach",
  "2110": "Hunters Hill", "2111": "Gladesville", "2112": "Ryde", "2113": "Macquarie Park",
  "2114": "Eastwood", "2115": "Ermington", "2116": "Rydalmere", "2117": "Dundas",
  "2118": "Carlingford", "2119": "Beecroft", "2120": "Thornleigh", "2121": "Epping",
  "2122": "Marsfield", "2125": "West Pennant Hills", "2126": "Cherrybrook",
  "2127": "Newington", "2128": "Silverwater", "2130": "Summer Hill",
  "2131": "Ashfield", "2132": "Croydon", "2133": "Croydon Park", "2134": "Burwood",
  "2135": "Strathfield", "2136": "Burwood Heights", "2137": "Concord",
  "2138": "Rhodes", "2140": "Homebush", "2141": "Lidcombe", "2142": "Granville",
  "2143": "Birrong", "2144": "Auburn", "2145": "Westmead", "2146": "Old Toongabbie",
  "2147": "Seven Hills", "2148": "Blacktown", "2150": "Parramatta",
  "2151": "North Parramatta", "2152": "Northmead", "2153": "Baulkham Hills",
  "2154": "Castle Hill", "2155": "Kellyville", "2160": "Merrylands",
  "2161": "Guildford", "2162": "Chester Hill", "2163": "Villawood",
  "2164": "Smithfield", "2165": "Fairfield", "2166": "Cabramatta",
  "2167": "Glenfield", "2168": "Ashcroft", "2170": "Liverpool",
  "2171": "Cecil Hills", "2175": "Horningsea Park", "2176": "Abbotsbury",
  "2190": "Greenacre", "2191": "Belfield", "2192": "Belmore",
  "2193": "Canterbury", "2194": "Campsie", "2195": "Lakemba",
  "2196": "Punchbowl", "2197": "Bass Hill", "2198": "Georges Hall",
  "2199": "Yagoona", "2200": "Bankstown", "2205": "Arncliffe",
  "2206": "Tempe", "2207": "Rockdale", "2208": "Kingsgrove",
  "2209": "Beverly Hills", "2210": "Hurstville", "2211": "Padstow",
  "2212": "Revesby", "2213": "East Hills", "2214": "Milperra",
  "2216": "Kogarah", "2217": "Monterey", "2218": "Allawah",
  "2219": "Sans Souci", "2220": "Hurstville", "2221": "Blakehurst",
  "2222": "Sylvania", "2223": "Mortdale", "2224": "Sylvania Waters",
  "2225": "Oyster Bay", "2226": "Jannali", "2227": "Gymea",
  "2228": "Miranda", "2229": "Caringbah", "2230": "Cronulla",
  "2231": "Bundeena", "2232": "Sutherland", "2233": "Engadine",
  "2234": "Menai", "2250": "Gosford", "2251": "Avoca Beach",
  "2256": "Woy Woy", "2257": "Umina Beach", "2258": "Ourimbah",
  "2259": "Wyong", "2260": "Terrigal", "2261": "The Entrance",
  "2262": "Toukley", "2263": "Lake Munmorah", "2264": "Morisset",
  "2265": "Cooranbong", "2280": "Belmont", "2281": "Swansea",
  "2282": "Warners Bay", "2283": "Toronto", "2284": "Argenton",
  "2285": "Charlestown", "2286": "Whitebridge", "2287": "Birmingham Gardens",
  "2289": "Adamstown", "2290": "Bennetts Green", "2291": "Merewether",
  "2292": "Broadmeadow", "2293": "Maryville", "2294": "Stockton",
  "2295": "Fern Bay", "2296": "Islington", "2297": "Tighes Hill",
  "2298": "Waratah", "2299": "Lambton", "2300": "Newcastle",
  "2302": "Newcastle West", "2303": "Hamilton", "2304": "Mayfield",
  "2305": "New Lambton", "2500": "Wollongong", "2502": "Warrawong",
  "2505": "Port Kembla", "2508": "Helensburgh", "2515": "Stanwell Park",
  "2516": "Thirroul", "2517": "Austinmer", "2518": "Coledale",
  "2519": "Woonona", "2525": "Figtree", "2526": "Unanderra",
  "2527": "Albion Park", "2528": "Shellharbour", "2529": "Dapto",
  "2530": "Horsley", "2540": "Nowra", "2541": "Bomaderry",
  "2560": "Campbelltown", "2565": "Ingleburn", "2566": "Minto",
  "2567": "Camden", "2570": "Camden South", "2745": "Mulgoa",
  "2747": "Kingswood", "2748": "Orchard Hills", "2749": "Cranebrook",
  "2750": "Penrith", "2756": "Windsor", "2759": "Erskine Park",
  "2760": "St Marys", "2761": "Plumpton", "2762": "Schofields",
  "2763": "Quakers Hill", "2765": "Marsden Park", "2766": "Rooty Hill",
  "2767": "Doonside", "2768": "Glenwood", "2769": "The Ponds",
  "2770": "Mount Druitt",
};

const getSuburbName = (postcode) => {
  const cleaned = postcode.trim();
  return POSTCODE_SUBURBS[cleaned] || cleaned;
};

/* ─── Fuel map visual ─── */
const FuelMapPlaceholder = ({ stations, suburb }) => {
  const suburbName = getSuburbName(suburb);
  return (
    <div style={{
      width: "100%",
      height: 280,
      borderRadius: 16,
      background: "linear-gradient(135deg, #0c1220 0%, #162032 40%, #1a3a52 70%, #1e5068 100%)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    }}>
      {/* Topographic line effect */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: `
        repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 18px, rgba(255,255,255,0.3) 18px, transparent 19px)
      `, backgroundSize: "60px 60px" }} />
      {/* Scattered dots like map markers */}
      {stations.slice(0, 6).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 8, height: 8, borderRadius: "50%",
          background: i === 0 ? "#4ade80" : "rgba(255,255,255,0.2)",
          boxShadow: i === 0 ? "0 0 12px rgba(74,222,128,0.6)" : "none",
          top: `${25 + Math.sin(i * 1.8) * 22}%`,
          left: `${15 + i * 13}%`,
          animation: i === 0 ? "pulse 2s ease infinite" : "none",
        }} />
      ))}
      <div style={{ textAlign: "center", zIndex: 1, color: "white" }}>
        <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Fuel Stations Near</div>
        <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginTop: 6, letterSpacing: -0.5 }}>{suburbName}</div>
        <div style={{ fontSize: 13, opacity: 0.35, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>NSW {suburb}</div>
        <div style={{ marginTop: 14, display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {stations.slice(0, 6).map((s, i) => (
            <div key={i} style={{
              background: i === 0 ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.08)",
              border: i === 0 ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "3px 10px",
              fontSize: 10,
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "'DM Mono', monospace",
            }}>
              <BrandColor brand={s.brand} />
              {s.brand}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Store map visual ─── */
const StoreMapPlaceholder = ({ closestColes, closestWoolies, suburb }) => {
  const suburbName = getSuburbName(suburb);
  return (
    <div style={{
      width: "100%",
      height: 260,
      borderRadius: 16,
      background: "linear-gradient(145deg, #fefce8 0%, #fef9c3 30%, #fde68a 70%, #fcd34d 100%)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    }}>
      {/* Subtle grid pattern */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: `
        linear-gradient(rgba(120,53,15,0.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(120,53,15,0.4) 1px, transparent 1px)
      `, backgroundSize: "32px 32px" }} />
      {/* Location pin decorations */}
      <div style={{ position: "absolute", top: "18%", left: "22%", fontSize: 22, opacity: 0.15 }}>📍</div>
      <div style={{ position: "absolute", top: "55%", right: "18%", fontSize: 18, opacity: 0.12 }}>📍</div>
      <div style={{ position: "absolute", bottom: "20%", left: "35%", fontSize: 14, opacity: 0.1 }}>📍</div>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 11, opacity: 0.45, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", color: "#78350f" }}>Supermarkets Near</div>
        <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginTop: 6, color: "#451a03", letterSpacing: -0.5 }}>{suburbName}</div>
        <div style={{ fontSize: 13, opacity: 0.35, fontFamily: "'DM Mono', monospace", color: "#78350f", marginTop: 2 }}>NSW {suburb}</div>
        <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
          <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "10px 18px", minWidth: 130, border: "1px solid rgba(220,38,38,0.15)" }}>
            <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>COLES</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", fontFamily: "'Outfit', sans-serif", marginTop: 3 }}>{closestColes?.name?.replace("Coles ", "")}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{closestColes?.distance} km</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "10px 18px", minWidth: 130, border: "1px solid rgba(22,163,74,0.15)" }}>
            <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>WOOLWORTHS</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", fontFamily: "'Outfit', sans-serif", marginTop: 3 }}>{closestWoolies?.name?.replace("Woolworths ", "")}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{closestWoolies?.distance} km</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Savie() {
  const [suburb, setSuburb] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fuelStations, setFuelStations] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState("U91");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const groceryRef = useRef(null);

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ── n8n webhook URLs — replace with your actual n8n webhook URLs ──
  const N8N_WEBHOOK_URL = "https://djwol.app.n8n.cloud/webhook-test/savie-chat";
  const N8N_FUEL_WEBHOOK_URL = "https://djwol.app.n8n.cloud/webhook-test/af8c1ba0-921e-470c-976c-4a7128540320";

  // Fetch fuel prices from n8n (which calls NSW FuelCheck API)
  const fetchFuelPrices = async (postcode, fuelType) => {
    try {
      const res = await fetch(N8N_FUEL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode, fueltype: fuelType }),
      });
      const data = await res.json();

      // Map the NSW FuelCheck API response into our app format
      if (data.stations && data.prices) {
        const stationMap = {};
        data.stations.forEach(s => {
          stationMap[s.code] = {
            id: s.code,
            name: s.name,
            address: s.address,
            lat: s.location?.latitude,
            lng: s.location?.longitude,
            brand: s.brand,
            distance: s.location?.distance,
          };
        });
        const results = data.prices
          .filter(p => stationMap[p.stationcode])
          .map(p => ({
            ...stationMap[p.stationcode],
            price: p.price / 10, // API returns in tenths of cents → convert to $/L
            lastUpdated: p.lastupdated,
          }))
          .sort((a, b) => a.price - b.price);

        if (results.length > 0) return results;
      }
    } catch (err) {
      console.log("n8n fuel webhook not available, using mock data");
    }

    // Fallback to mock data
    return MOCK_FUEL_STATIONS
      .filter(s => s.prices[fuelType] != null)
      .map(s => ({ ...s, price: s.prices[fuelType] }))
      .sort((a, b) => a.price - b.price);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatLoading]);

  // Welcome message when chat opens
  useEffect(() => {
    if (chatOpen && chatMessages.length === 0) {
      setChatMessages([{
        role: "assistant",
        content: suburb
          ? `G'day! 👋 I'm Savie, your cost-of-living assistant. I can see you're looking at prices near **${suburb}**. Ask me anything — cheapest fuel, grocery deals, savings tips, or bill comparisons!`
          : "G'day! 👋 I'm Savie, your cost-of-living assistant. Enter your suburb above first, then ask me about fuel prices, grocery deals, or ways to save!"
      }]);
    }
  }, [chatOpen]);

  // Send message to n8n
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          suburb: suburb || null,
          fuelType: selectedFuel,
          context: {
            fuelStations: fuelStations.slice(0, 3),
            closestColes: MOCK_STORES.coles[0],
            closestWoolies: MOCK_STORES.woolworths[0],
          }
        }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply || data.output || data.message || "Sorry, I couldn't process that. Try again!"
      }]);
    } catch (err) {
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Couldn't reach the Savie agent. Make sure your n8n webhook is running and the URL is configured in the code."
      }]);
    }
    setChatLoading(false);
  };

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const handleSuburbSubmit = async () => {
    if (!suburb.trim()) return;
    setLoading(true);
    const results = await fetchFuelPrices(suburb.trim(), selectedFuel);
    setFuelStations(results);
    setSubmitted(true);
    setLoading(false);
  };

  // Re-fetch when fuel type changes after initial search
  useEffect(() => {
    if (!submitted) return;
    let cancelled = false;
    (async () => {
      const results = await fetchFuelPrices(suburb.trim(), selectedFuel);
      if (!cancelled) setFuelStations(results);
    })();
    return () => { cancelled = true; };
  }, [selectedFuel, submitted]);

  const handleGrocerySearch = () => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase().trim();
    const results = Object.entries(MOCK_GROCERY_ITEMS)
      .filter(([key, val]) => key.includes(query) || val.name.toLowerCase().includes(query))
      .map(([key, val]) => val);
    setSearchResults(results);
  };

  const lowestFuel = fuelStations.length > 0 ? fuelStations[0].price : null;
  const highestFuel = fuelStations.length > 0 ? fuelStations[fuelStations.length - 1].price : null;
  const closestColes = MOCK_STORES.coles[0];
  const closestWoolies = MOCK_STORES.woolworths[0];
  const closerStore = closestColes.distance <= closestWoolies.distance ? { ...closestColes, chain: "Coles" } : { ...closestWoolies, chain: "Woolworths" };

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9", fontFamily: "'Outfit', sans-serif", WebkitFontSmoothing: "antialiased" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* ─── HEADER ─── */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        backgroundColor: "rgba(250,250,249,0.85)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        padding: isMobile ? "12px 16px" : "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: isMobile ? 32 : 36,
            height: isMobile ? 32 : 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #16a34a, #0ea5e9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: isMobile ? 16 : 18,
            fontWeight: 800,
          }}>S</div>
          <span style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#111827", letterSpacing: -0.5 }}>savie</span>
        </div>
        <div style={{ fontSize: isMobile ? 10 : 12, color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>MVP Prototype</div>
      </header>

      {/* ─── HERO / SUBURB INPUT ─── */}
      <section style={{
        padding: isMobile ? "32px 16px 24px" : "48px 24px 32px",
        maxWidth: 640,
        margin: "0 auto",
        opacity: heroVisible ? 1 : 0,
        transform: heroVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s ease",
      }}>
        <h1 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: "#111827", lineHeight: 1.15, letterSpacing: -1, margin: 0 }}>
          Stop overpaying on<br />
          <span style={{ background: "linear-gradient(135deg, #16a34a, #0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            everyday essentials.
          </span>
        </h1>
        <p style={{ color: "#6b7280", fontSize: isMobile ? 14 : 16, marginTop: 12, lineHeight: 1.5 }}>
          Find the cheapest fuel and groceries near you in seconds. Enter your NSW postcode to get started.
        </p>

        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 10,
          marginTop: 24,
          padding: 6,
          background: "white",
          borderRadius: 14,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
        }}>
          <input
            type="text"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSuburbSubmit()}
            placeholder="Enter NSW postcode e.g. 2065, 2000..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "14px 16px",
              fontSize: 15,
              fontFamily: "'Outfit', sans-serif",
              color: "#111827",
              background: "transparent",
              borderRadius: 10,
              minWidth: 0,
            }}
          />
          <button
            onClick={handleSuburbSubmit}
            disabled={loading}
            style={{
              padding: isMobile ? "14px 28px" : "12px 28px",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #16a34a, #0ea5e9)",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              fontFamily: "'Outfit', sans-serif",
              transition: "transform 0.15s ease",
              width: isMobile ? "100%" : "auto",
            }}
            onMouseDown={(e) => { if (!loading) e.currentTarget.style.transform = "scale(0.96)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            onTouchStart={(e) => { if (!loading) e.currentTarget.style.transform = "scale(0.96)"; }}
            onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {loading ? "Searching..." : "Find Savings"}
          </button>
        </div>
      </section>

      {/* ─── FUEL PRICES SECTION ─── */}
      {submitted && (
        <section style={{
          padding: isMobile ? "0 16px 48px" : "0 24px 48px",
          maxWidth: 640,
          margin: "0 auto",
          animation: "fadeInUp 0.5s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>⛽ Cheapest Fuel</h2>
            <span style={{ fontSize: 13, color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>near {suburb}</span>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "'DM Mono', monospace",
              padding: "2px 8px",
              borderRadius: 6,
              background: fuelStations[0]?.lastUpdated ? "#dcfce7" : "#fef3c7",
              color: fuelStations[0]?.lastUpdated ? "#15803d" : "#92400e",
            }}>
              {fuelStations[0]?.lastUpdated ? "● LIVE — NSW FuelCheck" : "● DEMO DATA"}
            </span>
          </div>

          {/* Fuel type selector */}
          <div style={{
            display: "flex",
            gap: 6,
            marginBottom: 20,
            overflowX: "auto",
            paddingBottom: 4,
            WebkitOverflowScrolling: "touch",
          }}>
            {FUEL_TYPES.map(ft => (
              <button
                key={ft.id}
                onClick={() => setSelectedFuel(ft.id)}
                style={{
                  padding: "8px 16px",
                  background: selectedFuel === ft.id
                    ? "linear-gradient(135deg, #16a34a, #0ea5e9)"
                    : "white",
                  color: selectedFuel === ft.id ? "white" : "#4b5563",
                  border: selectedFuel === ft.id ? "none" : "1px solid #e5e7eb",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Mono', monospace",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  boxShadow: selectedFuel === ft.id ? "0 2px 8px rgba(22,163,74,0.25)" : "none",
                  flexShrink: 0,
                }}
              >
                {ft.short}
              </button>
            ))}
          </div>

          <FuelMapPlaceholder stations={fuelStations} suburb={suburb} />

          {/* Recommendation card */}
          <div style={{
            background: "linear-gradient(135deg, #dcfce7, #d1fae5)",
            borderRadius: 14,
            padding: isMobile ? "14px 16px" : "16px 20px",
            marginBottom: 16,
            border: "1px solid #86efac",
          }}>
            <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: "#15803d", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Mono', monospace" }}>
              💡 Savie Recommends — {FUEL_TYPES.find(f => f.id === selectedFuel)?.label}
            </div>
            <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: "#14532d", marginTop: 6 }}>
              Fill up at <strong>{fuelStations[0]?.name}</strong> — saving you up to <strong>${((highestFuel - lowestFuel) * 50).toFixed(2)}</strong> on a 50L tank.
            </div>
            <div style={{ fontSize: isMobile ? 12 : 13, color: "#166534", marginTop: 4 }}>{fuelStations[0]?.address}</div>
          </div>

          {/* Station list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {fuelStations.map((station, i) => (
              <div key={station.id} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                background: "white",
                borderRadius: 12,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                border: i === 0 ? "2px solid #86efac" : "1px solid rgba(0,0,0,0.04)",
                transition: "transform 0.15s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: i === 0 ? "#dcfce7" : "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: i === 0 ? "#16a34a" : "#6b7280",
                    fontFamily: "'DM Mono', monospace",
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{station.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{station.address}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <PriceTag price={station.price} isLowest={i === 0} />
                  <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>per litre</div>
                </div>
              </div>
            ))}
          </div>

          {/* ─── STORE FINDER SECTION ─── */}
          <div style={{ marginTop: 56 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>🛒 Nearest Supermarket</h2>
            </div>

            <StoreMapPlaceholder closestColes={closestColes} closestWoolies={closestWoolies} suburb={suburb} />

            {/* Closer store recommendation */}
            <div style={{
              background: "white",
              borderRadius: 14,
              padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#0ea5e9", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Mono', monospace" }}>
                📍 Closest to you
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginTop: 8 }}>
                {closerStore.name}
              </div>
              <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{closerStore.address}</div>
              <div style={{
                display: "inline-block",
                marginTop: 10,
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Mono', monospace",
                background: closerStore.chain === "Woolworths" ? "#dcfce7" : "#fee2e2",
                color: closerStore.chain === "Woolworths" ? "#16a34a" : "#dc2626",
              }}>
                {closerStore.distance} km away
              </div>
            </div>

            {/* Both stores comparison */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
              <div style={{
                background: "white",
                borderRadius: 12,
                padding: "16px",
                border: closerStore.chain === "Coles" ? "2px solid #ef4444" : "1px solid rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", fontFamily: "'DM Mono', monospace" }}>COLES</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginTop: 6 }}>{closestColes.name}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{closestColes.address}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginTop: 8, fontFamily: "'DM Mono', monospace" }}>{closestColes.distance} km</div>
              </div>
              <div style={{
                background: "white",
                borderRadius: 12,
                padding: "16px",
                border: closerStore.chain === "Woolworths" ? "2px solid #16a34a" : "1px solid rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", fontFamily: "'DM Mono', monospace" }}>WOOLWORTHS</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginTop: 6 }}>{closestWoolies.name}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{closestWoolies.address}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginTop: 8, fontFamily: "'DM Mono', monospace" }}>{closestWoolies.distance} km</div>
              </div>
            </div>
          </div>

          {/* ─── GROCERY COMPARISON SECTION ─── */}
          <div style={{ marginTop: 56 }} ref={groceryRef}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>🔍 Price Compare</h2>
            </div>
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 0, marginBottom: 16 }}>
              Search for a grocery item to compare prices between Coles and Woolworths.
            </p>

            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 10,
              padding: 6,
              background: "white",
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
              marginBottom: 16,
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGrocerySearch()}
                placeholder="Try: milk, bread, eggs, banana, chicken..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "14px 16px",
                  fontSize: 15,
                  fontFamily: "'Outfit', sans-serif",
                  color: "#111827",
                  background: "transparent",
                  borderRadius: 10,
                  minWidth: 0,
                }}
              />
              <button
                onClick={handleGrocerySearch}
                style={{
                  padding: isMobile ? "14px 24px" : "12px 24px",
                  background: "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  transition: "transform 0.15s ease",
                  width: isMobile ? "100%" : "auto",
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
                onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                Compare
              </button>
            </div>

            {/* Quick search tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {["milk", "bread", "eggs", "banana", "chicken", "rice", "coffee", "cheese"].map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    const results = Object.entries(MOCK_GROCERY_ITEMS)
                      .filter(([key]) => key === tag)
                      .map(([, val]) => val);
                    setSearchResults(results);
                  }}
                  style={{
                    padding: "6px 14px",
                    background: searchQuery === tag ? "#111827" : "#f3f4f6",
                    color: searchQuery === tag ? "white" : "#4b5563",
                    border: "none",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Results */}
            {searchResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {searchResults.map((item, i) => {
                  const cheaper = item.coles.price < item.woolworths.price ? "coles" : item.coles.price > item.woolworths.price ? "woolworths" : "tie";
                  const saving = Math.abs(item.coles.price - item.woolworths.price).toFixed(2);
                  return (
                    <div key={i} style={{
                      background: "white",
                      borderRadius: 14,
                      padding: "20px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                      border: "1px solid rgba(0,0,0,0.04)",
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 14 }}>{item.name}</div>
                      <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: isMobile ? "1fr" : "1fr auto 1fr", 
                        gap: 12, 
                        alignItems: "center" 
                      }}>
                        {/* Coles */}
                        <div style={{
                          textAlign: "center",
                          padding: "12px",
                          borderRadius: 10,
                          background: cheaper === "coles" ? "#fef2f2" : "#f9fafb",
                          border: cheaper === "coles" ? "2px solid #ef4444" : "1px solid #e5e7eb",
                        }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", fontFamily: "'DM Mono', monospace" }}>COLES</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
                            ${item.coles.price.toFixed(2)}
                          </div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{item.coles.unit}</div>
                          {cheaper === "coles" && (
                            <div style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
                              ✓ CHEAPER
                            </div>
                          )}
                        </div>

                        {/* VS divider */}
                        {!isMobile && (
                          <div style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#d1d5db",
                            fontFamily: "'DM Mono', monospace",
                          }}>VS</div>
                        )}

                        {/* Woolworths */}
                        <div style={{
                          textAlign: "center",
                          padding: "12px",
                          borderRadius: 10,
                          background: cheaper === "woolworths" ? "#f0fdf4" : "#f9fafb",
                          border: cheaper === "woolworths" ? "2px solid #16a34a" : "1px solid #e5e7eb",
                        }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", fontFamily: "'DM Mono', monospace" }}>WOOLWORTHS</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
                            ${item.woolworths.price.toFixed(2)}
                          </div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{item.woolworths.unit}</div>
                          {cheaper === "woolworths" && (
                            <div style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
                              ✓ CHEAPER
                            </div>
                          )}
                        </div>
                      </div>

                      {cheaper !== "tie" && (
                        <div style={{
                          marginTop: 14,
                          padding: "8px 14px",
                          background: "#f0fdf4",
                          borderRadius: 8,
                          fontSize: 13,
                          color: "#15803d",
                          fontWeight: 500,
                          textAlign: "center",
                        }}>
                          Save <strong>${saving}</strong> by buying at <strong>{cheaper === "coles" ? "Coles" : "Woolworths"}</strong>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {searchResults.length === 0 && searchQuery && (
              <div style={{
                textAlign: "center",
                padding: "32px 20px",
                color: "#9ca3af",
                fontSize: 14,
              }}>
                No results found. Try searching for common items like milk, bread, or eggs.
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            paddingBottom: 40,
          }}>
            <div style={{ fontSize: 13, color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>
              savie MVP • NSW fuel data via FuelCheck API 🇦🇺
            </div>
            <div style={{ fontSize: 11, color: "#d1d5db", marginTop: 6 }}>
              Fuel prices from NSW Government FuelCheck. Grocery data simulated — real APIs via n8n.
            </div>
          </div>
        </section>
      )}

      {/* ─── CHATBOT FAB + PANEL ─── */}
      {submitted && (
        <>
          {/* Floating action button */}
          {!chatOpen && (
            <button
              onClick={() => setChatOpen(true)}
              style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                width: 60,
                height: 60,
                borderRadius: 18,
                background: "linear-gradient(135deg, #16a34a, #0ea5e9)",
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(22,163,74,0.35), 0 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                zIndex: 1000,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(22,163,74,0.45), 0 4px 12px rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(22,163,74,0.35), 0 2px 8px rgba(0,0,0,0.1)"; }}
              title="Chat with Savie"
            >
              💬
            </button>
          )}

          {/* Chat panel */}
          {chatOpen && (
            <div style={{
              position: "fixed",
              bottom: isMobile ? 0 : 24,
              right: isMobile ? 0 : 24,
              left: isMobile ? 0 : "auto",
              width: isMobile ? "100%" : 380,
              maxWidth: isMobile ? "100%" : "calc(100vw - 48px)",
              height: isMobile ? "100vh" : 520,
              maxHeight: isMobile ? "100vh" : "calc(100vh - 100px)",
              borderRadius: isMobile ? 0 : 20,
              background: "white",
              boxShadow: "0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 1000,
              animation: "chatSlideUp 0.3s ease both",
            }}>
              {/* Chat header */}
              <div style={{
                padding: "16px 20px",
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #16a34a, #0ea5e9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 16,
                    fontWeight: 800,
                  }}>S</div>
                  <div>
                    <div style={{ color: "white", fontSize: 15, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>Savie Agent</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}></span>
                      powered by n8n
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "rgba(255,255,255,0.7)",
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                >✕</button>
              </div>

              {/* Location context bar */}
              {suburb && (
                <div style={{
                  padding: "8px 20px",
                  background: "#f0fdf4",
                  borderBottom: "1px solid #dcfce7",
                  fontSize: 12,
                  color: "#15803d",
                  fontFamily: "'DM Mono', monospace",
                  flexShrink: 0,
                }}>
                  📍 Context: {suburb} · {FUEL_TYPES.find(f => f.id === selectedFuel)?.label}
                </div>
              )}

              {/* Messages area */}
              <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 16px 8px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    animation: "fadeInUp 0.25s ease both",
                  }}>
                    <div style={{
                      maxWidth: "82%",
                      padding: "10px 14px",
                      borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      background: msg.role === "user"
                        ? "linear-gradient(135deg, #16a34a, #0ea5e9)"
                        : "#f3f4f6",
                      color: msg.role === "user" ? "white" : "#1f2937",
                      fontSize: 14,
                      lineHeight: 1.5,
                      fontFamily: "'Outfit', sans-serif",
                      wordBreak: "break-word",
                    }}>
                      {msg.content.split("**").map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {chatLoading && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{
                      padding: "12px 18px",
                      borderRadius: "14px 14px 14px 4px",
                      background: "#f3f4f6",
                      display: "flex",
                      gap: 5,
                      alignItems: "center",
                    }}>
                      {[0, 1, 2].map(d => (
                        <span key={d} style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#9ca3af",
                          animation: `typingDot 1.2s ease infinite ${d * 0.2}s`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick prompts */}
              {chatMessages.length <= 1 && (
                <div style={{
                  padding: "0 16px 8px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  flexShrink: 0,
                }}>
                  {[
                    "Where's the cheapest fuel?",
                    "Compare milk prices",
                    "How can I save on groceries?",
                    "Best energy plan for me?",
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setChatInput(prompt);
                        setTimeout(() => {
                          setChatInput("");
                          setChatMessages(prev => [...prev, { role: "user", content: prompt }]);
                          setChatLoading(true);
                          fetch(N8N_WEBHOOK_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ message: prompt, suburb, fuelType: selectedFuel, context: { fuelStations: fuelStations.slice(0, 3) } }),
                          })
                            .then(r => r.json())
                            .then(data => {
                              setChatMessages(prev => [...prev, { role: "assistant", content: data.reply || data.output || data.message || "Hmm, try again!" }]);
                              setChatLoading(false);
                            })
                            .catch(() => {
                              setChatMessages(prev => [...prev, { role: "assistant", content: "⚠️ Couldn't reach the Savie agent. Check your n8n webhook." }]);
                              setChatLoading(false);
                            });
                        }, 50);
                      }}
                      style={{
                        padding: "6px 12px",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: 20,
                        fontSize: 12,
                        color: "#374151",
                        cursor: "pointer",
                        fontFamily: "'Outfit', sans-serif",
                        transition: "all 0.15s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                    >{prompt}</button>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div style={{
                padding: "12px 16px",
                borderTop: "1px solid #f3f4f6",
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexShrink: 0,
                background: "white",
              }}>
                <input
                  ref={chatInputRef}
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !chatLoading && sendChatMessage()}
                  placeholder="Ask Savie anything..."
                  disabled={chatLoading}
                  style={{
                    flex: 1,
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: "11px 14px",
                    fontSize: 14,
                    fontFamily: "'Outfit', sans-serif",
                    color: "#111827",
                    outline: "none",
                    transition: "border-color 0.15s",
                    background: chatLoading ? "#f9fafb" : "white",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "#16a34a"}
                  onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: chatLoading || !chatInput.trim() ? "#e5e7eb" : "linear-gradient(135deg, #16a34a, #0ea5e9)",
                    border: "none",
                    color: "white",
                    fontSize: 18,
                    cursor: chatLoading || !chatInput.trim() ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                >↑</button>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.5); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
        * { 
          box-sizing: border-box; 
          -webkit-tap-highlight-color: transparent;
        }
        input::placeholder { color: #9ca3af; }
        input, button, textarea {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        /* Smooth scrolling for all browsers */
        html {
          scroll-behavior: smooth;
        }
        /* Better text rendering */
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        /* Fix for iOS Safari bottom bar */
        @supports (-webkit-touch-callout: none) {
          .chat-panel-mobile {
            height: -webkit-fill-available;
          }
        }
      `}</style>
    </div>
  );
}
