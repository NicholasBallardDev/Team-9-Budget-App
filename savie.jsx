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

const N8N_WEBHOOK_URL = "https://your-n8n-instance.com/webhook/savie";

export default function SavieApp() {
  // Onboarding form state
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({
    goalType: "",
    ageBracket: "",
    income: "",
    postcode: "",
    categories: []
  });
  const [categoryExpenses, setCategoryExpenses] = useState({});
  const [showExpenseInput, setShowExpenseInput] = useState(false);

  const totalQuestions = 5;

  // Main app state
  const [currentPage, setCurrentPage] = useState("home"); // home, fuel, groceries, goals

  // Navigation for onboarding
  const nextQuestion = () => {
    // Validate current question before proceeding
    if (currentQuestion === 0 && !formData.goalType) {
      alert("Please select an option");
      return;
    }
    if (currentQuestion === 1 && !formData.ageBracket) {
      alert("Please select your age bracket");
      return;
    }
    if (currentQuestion === 2 && !formData.income) {
      alert("Please select your income bracket");
      return;
    }
    if (currentQuestion === 3 && !formData.postcode) {
      alert("Please enter your postcode");
      return;
    }
    
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFormSubmit();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Main app state
  const [selectedFuel, setSelectedFuel] = useState("U91");
  const [selectedGroceryItem, setSelectedGroceryItem] = useState("milk");
  const [suburb, setSuburb] = useState("");

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatMessagesRef = useRef(null);
  const chatInputRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle form submission
  const handleFormSubmit = async () => {
    // Check if all selected categories have expense amounts
    const missingExpenses = formData.categories.filter(cat => !categoryExpenses[cat]);
    if (missingExpenses.length > 0) {
      alert("Please enter expense amounts for all selected categories");
      return;
    }

    // Prepare data for N8N
    const onboardingData = {
      goalType: formData.goalType,
      ageBracket: formData.ageBracket,
      income: formData.income,
      postcode: formData.postcode,
      categories: formData.categories.map(cat => ({
        name: cat,
        monthlyExpense: categoryExpenses[cat]
      }))
    };

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "onboarding", data: onboardingData })
      });

      if (response.ok) {
        // Store postcode for suburb lookup
        setSuburb(`Postcode ${formData.postcode}`);
        setIsOnboarding(false);
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // For development, allow proceeding even if N8N fails
      setSuburb(`Postcode ${formData.postcode}`);
      setIsOnboarding(false);
    }
  };

  // Handle category selection
  const toggleCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  // Handle expense input
  const handleExpenseChange = (category, value) => {
    setCategoryExpenses(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Send chat message
  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setChatLoading(true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chat",
          message: userMessage,
          context: {
            suburb,
            currentPage,
            selectedFuel,
            selectedGroceryItem
          }
        })
      });

      const data = await response.json();
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply || data.output || data.message || "I'm here to help!"
      }]);
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Couldn't reach SmartSave. Please try again."
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Fuel stations sorted by price
  const fuelStations = MOCK_FUEL_STATIONS
    .map(station => ({
      ...station,
      selectedPrice: station.prices[selectedFuel]
    }))
    .filter(station => station.selectedPrice !== null)
    .sort((a, b) => a.selectedPrice - b.selectedPrice);

  const lowestFuelPrice = fuelStations.length > 0 ? fuelStations[0].selectedPrice : null;

  // Grocery comparison
  const selectedItem = MOCK_GROCERY_ITEMS[selectedGroceryItem];
  const colesPrice = selectedItem.coles.price;
  const woolworthsPrice = selectedItem.woolworths.price;
  const bestStore = colesPrice <= woolworthsPrice ? "coles" : "woolworths";

  // Chat FAB button (only on home, fuel, groceries pages)
  const ChatFAB = () => {
    if (currentPage === "goals") return null;

    return (
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: "fixed",
          bottom: 90,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: chatOpen ? "#ef4444" : "linear-gradient(135deg, #16a34a, #0ea5e9)",
          border: "none",
          color: "white",
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s",
        }}
      >
        {chatOpen ? "✕" : "💬"}
      </button>
    );
  };

  // Chat panel
  const ChatPanel = () => {
    if (!chatOpen || currentPage === "goals") return null;

    return (
      <div style={{
        position: "fixed",
        bottom: 80,
        right: 20,
        width: "calc(100% - 40px)",
        maxWidth: 400,
        height: 500,
        background: "white",
        borderRadius: 20,
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        zIndex: 998,
        overflow: "hidden",
        animation: "chatSlideUp 0.3s ease-out",
      }}>
        {/* Chat header */}
        <div style={{
          padding: "16px 20px",
          background: "linear-gradient(135deg, #16a34a, #0ea5e9)",
          color: "white",
          fontFamily: "'Outfit', sans-serif",
          fontSize: 18,
          fontWeight: 600,
          borderRadius: "20px 20px 0 0",
        }}>
          SmartSave Assistant
        </div>

        {/* Messages */}
        <div ref={chatMessagesRef} style={{
          flex: 1,
          padding: 16,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
          {chatMessages.length === 0 && (
            <div style={{
              textAlign: "center",
              color: "#9ca3af",
              fontSize: 14,
              fontFamily: "'Outfit', sans-serif",
              marginTop: 20,
            }}>
              👋 Hi! Ask me about saving money, finding deals, or managing your budget.
            </div>
          )}

          {chatMessages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              padding: "10px 14px",
              borderRadius: 16,
              background: msg.role === "user" ? "#16a34a" : "#f3f4f6",
              color: msg.role === "user" ? "white" : "#111827",
              fontSize: 14,
              fontFamily: "'Outfit', sans-serif",
              lineHeight: 1.5,
            }}>
              {msg.content}
            </div>
          ))}

          {chatLoading && (
            <div style={{
              alignSelf: "flex-start",
              padding: "10px 14px",
              borderRadius: 16,
              background: "#f3f4f6",
              display: "flex",
              gap: 4,
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#9ca3af",
                  animation: "typingDot 1.4s infinite",
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}>
          <input
            ref={chatInputRef}
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendChatMessage()}
            placeholder="Ask anything..."
            disabled={chatLoading}
            style={{
              flex: 1,
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "11px 14px",
              fontSize: 14,
              fontFamily: "'Outfit', sans-serif",
              outline: "none",
            }}
          />
          <button
            onClick={sendChatMessage}
            disabled={chatLoading || !chatInput.trim()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: chatLoading || !chatInput.trim() ? "#e5e7eb" : "#16a34a",
              border: "none",
              color: "white",
              fontSize: 18,
              cursor: chatLoading || !chatInput.trim() ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ↑
          </button>
        </div>
      </div>
    );
  };

  // Bottom navigation
  const BottomNav = () => (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: 70,
      background: "white",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      zIndex: 900,
    }}>
      <button
        onClick={() => setCurrentPage("home")}
        style={{
          flex: 1,
          height: "100%",
          border: "none",
          background: "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          cursor: "pointer",
          color: currentPage === "home" || currentPage === "fuel" || currentPage === "groceries" ? "#16a34a" : "#9ca3af",
          fontFamily: "'Outfit', sans-serif",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <div style={{ fontSize: 24 }}>🏠</div>
        Home
      </button>
      <button
        onClick={() => setCurrentPage("goals")}
        style={{
          flex: 1,
          height: "100%",
          border: "none",
          background: "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          cursor: "pointer",
          color: currentPage === "goals" ? "#16a34a" : "#9ca3af",
          fontFamily: "'Outfit', sans-serif",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <div style={{ fontSize: 24 }}>🎯</div>
        Goals
      </button>
    </div>
  );

  // ONBOARDING PAGE
  if (isOnboarding) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f5f5f0",
        padding: "0",
        fontFamily: "'Outfit', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          background: "white",
          borderBottom: "1px solid #e5e7eb",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #16a34a, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 18,
            }}>
              SS
            </div>
            <h1 style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#1a1a1a",
              margin: 0,
            }}>
              SmartSave
            </h1>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          padding: "24px 24px 16px",
          background: "white",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}>
            <span style={{
              fontSize: 14,
              color: "#6b7280",
              fontWeight: 500,
            }}>
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span style={{
              fontSize: 14,
              color: "#16a34a",
              fontWeight: 700,
            }}>
              {currentQuestion + 1}/{totalQuestions}
            </span>
          </div>
          <div style={{
            width: "100%",
            height: 8,
            background: "#e5e7eb",
            borderRadius: 10,
            overflow: "hidden",
          }}>
            <div style={{
              width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, #16a34a, #0ea5e9)",
              transition: "width 0.3s ease",
              borderRadius: 10,
            }} />
          </div>
        </div>

        {/* Question content */}
        <div style={{
          flex: 1,
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Question 0: Goal Type */}
          {currentQuestion === 0 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <h2 style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 12,
                lineHeight: 1.2,
              }}>
                What's your primary goal?
              </h2>
              <p style={{
                fontSize: 16,
                color: "#6b7280",
                marginBottom: 40,
              }}>
                Choose the option that best describes what you want to achieve
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {["Budgeting", "Saving"].map(option => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, goalType: option.toLowerCase() })}
                    style={{
                      padding: "24px 24px",
                      borderRadius: 16,
                      border: formData.goalType === option.toLowerCase() ? "3px solid #16a34a" : "2px solid #e5e7eb",
                      background: formData.goalType === option.toLowerCase() ? "#f0fdf4" : "white",
                      color: "#1a1a1a",
                      fontSize: 18,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "left",
                      boxShadow: formData.goalType === option.toLowerCase() ? "0 4px 12px rgba(22, 163, 74, 0.15)" : "none",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 1: Age Bracket */}
          {currentQuestion === 1 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <h2 style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 12,
                lineHeight: 1.2,
              }}>
                What's your age bracket?
              </h2>
              <p style={{
                fontSize: 16,
                color: "#6b7280",
                marginBottom: 40,
              }}>
                This helps us personalize your savings recommendations
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {["18-25", "26-35", "36-50", "50+"].map(option => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, ageBracket: option })}
                    style={{
                      padding: "24px 20px",
                      borderRadius: 16,
                      border: formData.ageBracket === option ? "3px solid #16a34a" : "2px solid #e5e7eb",
                      background: formData.ageBracket === option ? "#f0fdf4" : "white",
                      color: "#1a1a1a",
                      fontSize: 18,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: formData.ageBracket === option ? "0 4px 12px rgba(22, 163, 74, 0.15)" : "none",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 2: Income */}
          {currentQuestion === 2 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <h2 style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 12,
                lineHeight: 1.2,
              }}>
                What's your annual income?
              </h2>
              <p style={{
                fontSize: 16,
                color: "#6b7280",
                marginBottom: 40,
              }}>
                Select the range that best matches your current income
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {["<$40k", "$40k-$70k", "$70k-$100k", "$100k+"].map(option => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, income: option })}
                    style={{
                      padding: "24px 20px",
                      borderRadius: 16,
                      border: formData.income === option ? "3px solid #16a34a" : "2px solid #e5e7eb",
                      background: formData.income === option ? "#f0fdf4" : "white",
                      color: "#1a1a1a",
                      fontSize: 18,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: formData.income === option ? "0 4px 12px rgba(22, 163, 74, 0.15)" : "none",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 3: Postcode */}
          {currentQuestion === 3 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <h2 style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 12,
                lineHeight: 1.2,
              }}>
                What's your postcode?
              </h2>
              <p style={{
                fontSize: 16,
                color: "#6b7280",
                marginBottom: 40,
              }}>
                We'll use this to find the best deals near you
              </p>

              <input
                type="number"
                value={formData.postcode}
                onChange={e => setFormData({ ...formData, postcode: e.target.value })}
                placeholder="e.g. 2065"
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  borderRadius: 16,
                  border: "2px solid #e5e7eb",
                  fontSize: 18,
                  outline: "none",
                  transition: "border-color 0.2s",
                  background: "white",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = "#16a34a"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
          )}

          {/* Question 4: Categories + Expenses */}
          {currentQuestion === 4 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <h2 style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 12,
                lineHeight: 1.2,
              }}>
                Select your expense categories
              </h2>
              <p style={{
                fontSize: 16,
                color: "#6b7280",
                marginBottom: 40,
              }}>
                Choose the categories where you spend money each month
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                {["Utilities", "Rent", "Entertainment", "Groceries", "Shopping"].map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    style={{
                      padding: "20px 16px",
                      borderRadius: 16,
                      border: formData.categories.includes(category) ? "3px solid #16a34a" : "2px solid #e5e7eb",
                      background: formData.categories.includes(category) ? "#f0fdf4" : "white",
                      color: "#1a1a1a",
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: formData.categories.includes(category) ? "0 4px 12px rgba(22, 163, 74, 0.15)" : "none",
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Expense inputs for selected categories */}
              {formData.categories.length > 0 && (
                <div style={{
                  padding: 24,
                  background: "white",
                  borderRadius: 16,
                  border: "2px solid #e5e7eb",
                }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#1a1a1a" }}>
                    Monthly expenses
                  </h3>
                  {formData.categories.map(category => (
                    <div key={category} style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 14, color: "#6b7280", marginBottom: 8, fontWeight: 500 }}>
                        {category}
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{
                          position: "absolute",
                          left: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 18,
                          color: "#6b7280",
                          fontWeight: 600,
                        }}>$</span>
                        <input
                          type="number"
                          value={categoryExpenses[category] || ""}
                          onChange={e => handleExpenseChange(category, e.target.value)}
                          placeholder="0"
                          style={{
                            width: "100%",
                            padding: "14px 16px 14px 32px",
                            borderRadius: 12,
                            border: "1px solid #e5e7eb",
                            fontSize: 16,
                            outline: "none",
                            fontFamily: "'Outfit', sans-serif",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{
          padding: "20px 24px 32px",
          background: "white",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: 12,
        }}>
          {currentQuestion > 0 && (
            <button
              onClick={previousQuestion}
              style={{
                flex: 1,
                padding: "16px 24px",
                borderRadius: 12,
                border: "2px solid #e5e7eb",
                background: "white",
                color: "#6b7280",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={nextQuestion}
            style={{
              flex: currentQuestion > 0 ? 2 : 1,
              padding: "16px 24px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #16a34a, #0ea5e9)",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            {currentQuestion === totalQuestions - 1 ? "Get Started →" : "Continue →"}
          </button>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}</style>
      </div>
    );
  }

  // MAIN APP
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f9fafb",
      paddingBottom: 80,
      fontFamily: "'Outfit', sans-serif",
    }}>
      {/* HOME PAGE */}
      {currentPage === "home" && (
        <div style={{ padding: "24px 20px" }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            background: "linear-gradient(135deg, #16a34a, #0ea5e9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}>
            SmartSave
          </h1>
          <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 14 }}>
            {suburb} • Find the best deals near you
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Fuel button */}
            <button
              onClick={() => setCurrentPage("fuel")}
              style={{
                padding: "24px 20px",
                borderRadius: 16,
                border: "none",
                background: "linear-gradient(135deg, #fef3c7, #fed7aa)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}
            >
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 12,
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}>
                ⛽
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  Fuel Prices
                </h3>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                  Find the cheapest fuel near you
                </p>
              </div>
              <div style={{ fontSize: 24, color: "#6b7280" }}>→</div>
            </button>

            {/* Groceries button */}
            <button
              onClick={() => setCurrentPage("groceries")}
              style={{
                padding: "24px 20px",
                borderRadius: 16,
                border: "none",
                background: "linear-gradient(135deg, #dcfce7, #bfdbfe)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}
            >
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 12,
                background: "linear-gradient(135deg, #16a34a, #0ea5e9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}>
                🛒
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  Groceries
                </h3>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                  Compare Coles vs Woolworths prices
                </p>
              </div>
              <div style={{ fontSize: 24, color: "#6b7280" }}>→</div>
            </button>
          </div>
        </div>
      )}

      {/* FUEL PAGE */}
      {currentPage === "fuel" && (
        <div style={{ paddingBottom: 0 }}>
          {/* Header section */}
          <div style={{
            padding: "20px 24px",
            background: "white",
            borderBottom: "1px solid #e5e7eb",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}>
              <button
                onClick={() => setCurrentPage("home")}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  color: "#6b7280",
                  fontSize: 18,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ←
              </button>
              <div>
                <h2 style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  margin: 0,
                }}>
                  ⛽ Cheapest Fuel
                </h2>
                <p style={{
                  fontSize: 13,
                  color: "#9ca3af",
                  margin: "2px 0 0 0",
                }}>
                  near {suburb}
                  <span style={{
                    marginLeft: 8,
                    padding: "2px 8px",
                    background: "#fef3c7",
                    color: "#92400e",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    ● DEMO DATA
                  </span>
                </p>
              </div>
            </div>

            {/* Fuel type selector */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }}>
              {FUEL_TYPES.map(fuel => (
                <button
                  key={fuel.id}
                  onClick={() => setSelectedFuel(fuel.id)}
                  style={{
                    padding: "10px 8px",
                    borderRadius: 10,
                    border: "none",
                    background: selectedFuel === fuel.id ? "#14b8a6" : "#f3f4f6",
                    color: selectedFuel === fuel.id ? "white" : "#6b7280",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {fuel.short}
                </button>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div style={{
            height: 280,
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "white",
          }}>
            {/* Decorative dots */}
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                left: `${20 + (i * 7)}%`,
                top: `${30 + Math.sin(i) * 20}%`,
              }} />
            ))}

            <div style={{
              textAlign: "center",
              zIndex: 1,
            }}>
              <div style={{
                fontSize: 11,
                letterSpacing: 2,
                color: "#94a3b8",
                marginBottom: 8,
                fontWeight: 600,
              }}>
                FUEL STATIONS NEAR
              </div>
              <div style={{
                fontSize: 32,
                fontWeight: 700,
                marginBottom: 4,
              }}>
                Crows Nest
              </div>
              <div style={{
                fontSize: 13,
                color: "#94a3b8",
              }}>
                NSW 2065
              </div>
            </div>

            {/* Brand legend */}
            <div style={{
              position: "absolute",
              bottom: 16,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
              padding: "0 16px",
            }}>
              {["Metro", "United", "BP", "7-Eleven", "Shell", "Caltex"].map(brand => (
                <div key={brand} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  <BrandColor brand={brand} />
                  {brand}
                </div>
              ))}
            </div>
          </div>

          {/* SmartSave recommendation */}
          {fuelStations.length > 0 && (
            <div style={{
              margin: "16px 16px 0",
              padding: 16,
              background: "linear-gradient(135deg, #dcfce7, #d1fae5)",
              borderRadius: 16,
              border: "2px solid #16a34a",
            }}>
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}>
                <div style={{
                  fontSize: 20,
                  marginTop: 2,
                }}>💡</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 12,
                    color: "#166534",
                    fontWeight: 700,
                    marginBottom: 4,
                    letterSpacing: 0.5,
                  }}>
                    SMARTSAVE RECOMMENDS — {FUEL_TYPES.find(f => f.id === selectedFuel)?.label.toUpperCase()}
                  </div>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    marginBottom: 4,
                  }}>
                    Fill up at {fuelStations[0].name} — saving you up to ${(fuelStations[fuelStations.length - 1]?.selectedPrice - fuelStations[0].selectedPrice).toFixed(2)} on a 50L tank.
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: "#166534",
                  }}>
                    {fuelStations[0].address}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fuel stations list */}
          <div style={{ padding: "16px 16px 100px" }}>
            {fuelStations.map((station, idx) => (
              <div key={station.id} style={{
                marginBottom: 12,
                padding: 16,
                background: "white",
                borderRadius: 16,
                border: idx === 0 ? "3px solid #16a34a" : "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                gap: 12,
                boxShadow: idx === 0 ? "0 4px 12px rgba(22, 163, 74, 0.15)" : "none",
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#6b7280",
                  flexShrink: 0,
                }}>
                  {idx + 1}
                </div>
                <BrandColor brand={station.brand} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#1a1a1a",
                    marginBottom: 2,
                  }}>
                    {station.name}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {station.address}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 22,
                    fontWeight: 700,
                    color: idx === 0 ? "#16a34a" : "#1a1a1a",
                  }}>
                    ${station.selectedPrice.toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: "#9ca3af",
                    marginTop: 2,
                  }}>
                    per litre
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GROCERIES PAGE */}
      {currentPage === "groceries" && (
        <div style={{ paddingBottom: 0 }}>
          {/* Header */}
          <div style={{
            padding: "20px 24px",
            background: "white",
            borderBottom: "1px solid #e5e7eb",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <button
                onClick={() => setCurrentPage("home")}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  color: "#6b7280",
                  fontSize: 18,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ←
              </button>
              <div>
                <h2 style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  margin: 0,
                }}>
                  🛒 Nearest Supermarket
                </h2>
              </div>
            </div>
          </div>

          {/* Map placeholder with store cards */}
          <div style={{
            height: 280,
            background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fde68a 100%)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 20,
          }}>
            {/* Decorative map pins */}
            {[
              { left: "20%", top: "25%", color: "#dc2626" },
              { left: "65%", top: "30%", color: "#16a34a" },
              { left: "45%", top: "55%", color: "#f59e0b" },
            ].map((pin, i) => (
              <div key={i} style={{
                position: "absolute",
                left: pin.left,
                top: pin.top,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: pin.color,
                boxShadow: `0 0 0 8px ${pin.color}33`,
              }} />
            ))}

            <div style={{
              textAlign: "center",
              zIndex: 1,
              marginBottom: 24,
            }}>
              <div style={{
                fontSize: 11,
                letterSpacing: 2,
                color: "#92400e",
                marginBottom: 8,
                fontWeight: 600,
              }}>
                SUPERMARKETS NEAR
              </div>
              <div style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 4,
              }}>
                Crows Nest
              </div>
              <div style={{
                fontSize: 13,
                color: "#92400e",
              }}>
                NSW 2065
              </div>
            </div>

            {/* Store cards overlay */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              width: "100%",
              maxWidth: 400,
              zIndex: 2,
            }}>
              <div style={{
                padding: 16,
                background: "white",
                borderRadius: 12,
                border: "2px solid #dc2626",
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: 11,
                  color: "#dc2626",
                  fontWeight: 700,
                  marginBottom: 4,
                  letterSpacing: 0.5,
                }}>
                  COLES
                </div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginBottom: 2,
                }}>
                  Chatswood
                </div>
                <div style={{
                  fontSize: 13,
                  color: "#6b7280",
                }}>
                  1.2 km
                </div>
              </div>

              <div style={{
                padding: 16,
                background: "white",
                borderRadius: 12,
                border: "2px solid #16a34a",
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: 11,
                  color: "#16a34a",
                  fontWeight: 700,
                  marginBottom: 4,
                  letterSpacing: 0.5,
                }}>
                  WOOLWORTHS
                </div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginBottom: 2,
                }}>
                  Chatswood
                </div>
                <div style={{
                  fontSize: 13,
                  color: "#6b7280",
                }}>
                  0.9 km
                </div>
              </div>
            </div>
          </div>

          {/* Closest to you */}
          <div style={{
            margin: "16px 16px 0",
            padding: 16,
            background: "white",
            borderRadius: 16,
            border: "2px solid #16a34a",
          }}>
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}>
              <div style={{ fontSize: 20 }}>📍</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 12,
                  color: "#16a34a",
                  fontWeight: 700,
                  marginBottom: 4,
                  letterSpacing: 0.5,
                }}>
                  CLOSEST TO YOU
                </div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginBottom: 2,
                }}>
                  Woolworths Chatswood
                </div>
                <div style={{
                  fontSize: 13,
                  color: "#6b7280",
                  marginBottom: 8,
                }}>
                  Victoria Ave, Chatswood NSW 2067
                </div>
                <div style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  background: "#dcfce7",
                  color: "#166534",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  0.9 km away
                </div>
              </div>
            </div>
          </div>

          {/* Store details */}
          <div style={{
            padding: "16px 16px 0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}>
            {/* Coles */}
            <div style={{
              padding: 16,
              background: "white",
              borderRadius: 16,
              border: "2px solid #e5e7eb",
            }}>
              <div style={{
                fontSize: 11,
                color: "#dc2626",
                fontWeight: 700,
                marginBottom: 8,
                letterSpacing: 0.5,
              }}>
                COLES
              </div>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 4,
              }}>
                Coles Chatswood
              </div>
              <div style={{
                fontSize: 12,
                color: "#6b7280",
                marginBottom: 12,
                lineHeight: 1.4,
              }}>
                1 Anderson St, Chatswood NSW 2067
              </div>
              <div style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#1a1a1a",
              }}>
                1.2 km
              </div>
            </div>

            {/* Woolworths */}
            <div style={{
              padding: 16,
              background: "#dcfce7",
              borderRadius: 16,
              border: "2px solid #16a34a",
            }}>
              <div style={{
                fontSize: 11,
                color: "#16a34a",
                fontWeight: 700,
                marginBottom: 8,
                letterSpacing: 0.5,
              }}>
                WOOLWORTHS
              </div>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 4,
              }}>
                Woolworths Chatswood
              </div>
              <div style={{
                fontSize: 12,
                color: "#166534",
                marginBottom: 12,
                lineHeight: 1.4,
              }}>
                Victoria Ave, Chatswood NSW 2067
              </div>
              <div style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#16a34a",
              }}>
                0.9 km
              </div>
            </div>
          </div>

          {/* Price Compare */}
          <div style={{ padding: "16px 16px 100px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 20 }}>🔍</div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#1a1a1a",
                margin: 0,
              }}>
                Price Compare
              </h3>
            </div>

            <p style={{
              fontSize: 14,
              color: "#6b7280",
              marginBottom: 16,
            }}>
              Search for a grocery item to compare prices between Coles and Woolworths.
            </p>

            {/* Search input */}
            <div style={{
              display: "flex",
              gap: 8,
              marginBottom: 16,
            }}>
              <select
                value={selectedGroceryItem}
                onChange={e => setSelectedGroceryItem(e.target.value)}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: 15,
                  outline: "none",
                  background: "white",
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {Object.entries(MOCK_GROCERY_ITEMS).map(([key, item]) => (
                  <option key={key} value={key}>{item.name}</option>
                ))}
              </select>
              <button
                style={{
                  padding: "14px 24px",
                  borderRadius: 12,
                  border: "none",
                  background: "#1a1a1a",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Compare
              </button>
            </div>

            {/* Quick picks */}
            <div style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 24,
            }}>
              {["milk", "bread", "eggs", "banana", "chicken", "rice", "coffee", "cheese"].map(item => (
                <button
                  key={item}
                  onClick={() => setSelectedGroceryItem(item)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: selectedGroceryItem === item ? "2px solid #1a1a1a" : "1px solid #e5e7eb",
                    background: selectedGroceryItem === item ? "#f3f4f6" : "white",
                    color: "#1a1a1a",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Price comparison result */}
            <div style={{
              padding: 20,
              background: "white",
              borderRadius: 16,
              border: "2px solid #e5e7eb",
            }}>
              <h4 style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 16,
              }}>
                {selectedItem.name}
              </h4>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}>
                {/* Coles */}
                <div style={{
                  padding: 16,
                  background: bestStore === "coles" ? "#fee2e2" : "#f9fafb",
                  borderRadius: 12,
                  border: bestStore === "coles" ? "2px solid #dc2626" : "1px solid #e5e7eb",
                }}>
                  <div style={{
                    fontSize: 11,
                    color: "#dc2626",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}>
                    COLES
                  </div>
                  <div style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: bestStore === "coles" ? "#dc2626" : "#1a1a1a",
                    marginBottom: 4,
                  }}>
                    ${colesPrice.toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: "#6b7280",
                  }}>
                    {selectedItem.coles.unit}
                  </div>
                </div>

                {/* Woolworths */}
                <div style={{
                  padding: 16,
                  background: bestStore === "woolworths" ? "#dcfce7" : "#f9fafb",
                  borderRadius: 12,
                  border: bestStore === "woolworths" ? "2px solid #16a34a" : "1px solid #e5e7eb",
                }}>
                  <div style={{
                    fontSize: 11,
                    color: "#16a34a",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}>
                    WOOLWORTHS
                  </div>
                  <div style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: bestStore === "woolworths" ? "#16a34a" : "#1a1a1a",
                    marginBottom: 4,
                  }}>
                    ${woolworthsPrice.toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: "#6b7280",
                  }}>
                    {selectedItem.woolworths.unit}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GOALS PAGE (Empty for now) */}
      {currentPage === "goals" && (
        <div style={{
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 150px)",
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎯</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
            Goals Dashboard
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center" }}>
            Coming soon! Track your savings goals here.
          </p>
        </div>
      )}

      {/* Chat components */}
      <ChatFAB />
      <ChatPanel />

      {/* Bottom navigation */}
      <BottomNav />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
