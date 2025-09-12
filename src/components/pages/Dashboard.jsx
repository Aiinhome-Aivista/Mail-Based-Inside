import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import ChatPanel from "../common/ChatPanel";

// Extended style map including gradient themes for fresh look
const defaultCategoryStyles = {
  Insurance: { icon: "🛡️", gradient: "from-blue-500 via-sky-500 to-cyan-500" },
  Healthcare: { icon: "🏥", gradient: "from-emerald-500 via-teal-500 to-green-500" },
  "EMI Alert": { icon: "💳", gradient: "from-purple-500 via-fuchsia-500 to-pink-500" },
  Promotion: { icon: "🏷️", gradient: "from-amber-400 via-orange-500 to-red-400" },
  Garbage: { icon: "🗑️", gradient: "from-gray-400 via-gray-500 to-gray-600" },
  Unknown: { icon: "📂", gradient: "from-slate-500 via-slate-600 to-neutral-600" },
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userName, setUserName] = useState("User");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTopic, setChatTopic] = useState(null); // { key, label, icon, count }
  const [chatInsights, setChatInsights] = useState([]);
  const [userCreds, setUserCreds] = useState({ email: "", password: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false); // collapsed by default

  const navigate = useNavigate();
  // Guard ref to avoid duplicate fetch in React 18 StrictMode (dev) double invoke
  const initialFetchDoneRef = useRef(false);
  useEffect(() => {
    if (initialFetchDoneRef.current) return; // prevent second StrictMode run
    const storedData = sessionStorage.getItem("userData");
    const userPassword = sessionStorage.getItem("userPassword");
    if (!storedData) return;
    const parsedData = JSON.parse(storedData);
    const userEmail = parsedData?.email;
    const accessToken = parsedData?.access_token; // present for Google login response

    // Prefer explicit name fields from Google login (name) then username then email
    if (parsedData?.name) setUserName(parsedData.name);
    else if (parsedData?.username) setUserName(parsedData.username);
    else if (userEmail) setUserName(userEmail.split('@')[0]);

    setUserCreds({ email: userEmail || "", password: userPassword || "" });

    // Determine auth mode: password-based (legacy) or Google token-based
    if (!userEmail) return;
    const payload = userPassword
      ? { email: userEmail, password: userPassword }
      : { email: userEmail, access_token: accessToken };

  setLoading(true);
  initialFetchDoneRef.current = true;
    fetch("http://122.163.121.176:3006/readmails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched dashboard data:", data);
        setDashboardData(data);
        if (data?.username) setUserName(data.username);
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // const categoryCounts = dashboardData?.summary?.category_counts || {};
  // const totalEmails = dashboardData?.summary?.total_email_count || 0;
  // const garbageCount = dashboardData?.summary?.garbage_count || 0;
  // const dueItems = dashboardData?.summary?.upcoming_due_items || [];

 const categoryCounts = dashboardData?.category_counts || {};
 const totalEmails = dashboardData?.total_email_count || 0;
 const garbageCount = 0;
 const dueItems = [];

  // Add garbage as a separate category
  // const categories = [...Object.keys(categoryCounts), "Garbage"];
  const categories = Object.keys(categoryCounts);

  // Build an extended style map so that any category not predefined gets a unique gradient
  const categoryStyleMap = useMemo(() => {
    const map = { ...defaultCategoryStyles };
    const dynamicPalette = [
      "from-rose-500 via-pink-500 to-fuchsia-500",
      "from-indigo-500 via-blue-500 to-cyan-500",
      "from-teal-500 via-emerald-500 to-green-500",
      "from-amber-500 via-orange-500 to-red-500",
      "from-sky-500 via-cyan-500 to-teal-500",
      "from-purple-500 via-violet-500 to-indigo-500",
      "from-lime-500 via-green-500 to-emerald-500",
      "from-stone-500 via-zinc-500 to-neutral-600",
    ];
    let paletteIndex = 0;
    categories.forEach((cat) => {
      if (!map[cat]) {
        map[cat] = {
          icon: "📁",
            // Assign next gradient ensuring different look for each missing category
          gradient: dynamicPalette[paletteIndex % dynamicPalette.length],
        };
        paletteIndex++;
      }
    });
    return map;
  }, [categories]);

  const emailsByCategory = categories.reduce((acc, category) => {
    if (category === "Garbage") {
      acc[category] =
        dashboardData?.emails?.filter((e) => e.is_garbage) || [];
    } else {
      acc[category] =
        dashboardData?.emails?.filter(
          (e) => e.category?.toLowerCase() === category.toLowerCase()
        ) || [];
    }
    return acc;
  }, {});

  // Helpers to open chat with context
  const openChatForTotal = () => {
    const topSenders = (dashboardData?.summary?.top_senders || []).slice(0, 3);
    const insights = [
      `${totalEmails} total messages`,
      ...topSenders.map((s) => `Top sender: ${s.sender || s.name || s}`),
      dueItems?.length ? `${dueItems.length} upcoming due items` : "No due items detected",
    ];
    setChatTopic({ key: "all", label: "All Emails", icon: "📧", count: totalEmails, gradient: "from-indigo-600 via-violet-600 to-fuchsia-500" });
    setChatInsights(insights.filter(Boolean));
    setChatOpen(true);
  };

  const openChatForCategory = async (cat) => {
    const emails = emailsByCategory[cat] || [];
    // simple frequency map for senders
    const senderCounts = emails.reduce((acc, e) => {
      const k = e.from || e.sender || "Unknown";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    const topSender = Object.entries(senderCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 1)
      .map(([name, count]) => `${name} (${count})`)[0];
    const soonestDue = emails
      .filter((e) => e.due_date)
      .map((e) => e.due_date)
      .sort()[0];
  const style = categoryStyleMap[cat] || categoryStyleMap.Unknown;
    const count = cat === "Garbage" ? garbageCount : categoryCounts[cat] || emails.length;
  let insights = [
      `${count} messages in ${cat}`,
      topSender ? `Top sender: ${topSender}` : null,
      soonestDue ? `Soonest due: ${soonestDue}` : null,
    ];
  setChatTopic({ key: cat.toLowerCase(), label: cat, icon: style.icon, count, gradient: style.gradient || "from-slate-500 to-slate-600" });
    setChatInsights(insights.filter(Boolean));
    setChatOpen(true);
  };

  // Keep open chat panel's count in sync if data refresh changes counts
  useEffect(() => {
    if (!chatOpen || !chatTopic) return;
    // Recalculate count based on latest dashboardData
    if (chatTopic.key === 'all') {
      const newTotal = dashboardData?.total_email_count || 0;
      if (chatTopic.count !== newTotal) {
        setChatTopic(prev => prev ? { ...prev, count: newTotal } : prev);
      }
    } else {
      // match category by label (original label stored in chatTopic.label)
      const catLabel = chatTopic.label;
      if (catLabel) {
        const newCount = categoryCounts[catLabel] ?? emailsByCategory[catLabel]?.length ?? 0;
        if (typeof newCount === 'number' && chatTopic.count !== newCount) {
          setChatTopic(prev => prev ? { ...prev, count: newCount } : prev);
        }
      }
    }
  }, [dashboardData, categoryCounts, emailsByCategory, chatOpen, chatTopic]);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session
    navigate("/"); // Redirect to login page
  };

  // Reload mails trigger: calls readmails then refreshes analyze-mails; shows Loader during the process
  const handleReload = async () => {
    try {
      const storedData = JSON.parse(sessionStorage.getItem("userData") || "{}");
      const email = userCreds.email || storedData.email || "";
      const password = userCreds.password || sessionStorage.getItem("userPassword") || "";
      const accessToken = storedData.access_token;
      if (!email) {
        console.warn("Missing email for reload");
        return;
      }
      const payload = password ? { email, password } : { email, access_token: accessToken };
      setLoading(true);
      const res = await fetch("http://122.163.121.176:3006/readmails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // body: JSON.stringify({email,password}),
      });
      const data = await res.json().catch(() => (null));
      if (data) {
        setDashboardData(data);
        if (data?.username) setUserName(data.username);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-indigo-600 text-white py-4 px-4 sm:px-6 flex justify-between items-center shadow-md z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            aria-label={sidebarOpen ? "Collapse navigation" : "Expand navigation"}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-indigo-500/60 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
          >
            <span className="text-lg">{sidebarOpen ? '✕' : '☰'}</span>
          </button>
            <h1 className="text-xl font-semibold whitespace-nowrap">Agentic AI Dashboard</h1>
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-medium">Welcome, {userName}</span>
          <button
            onClick={handleReload}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/10 hover:bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            title="Reload mails"
            aria-label="Reload mails"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
            >
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <polyline points="21 3 21 9 15 9" />
            </svg>
          </button>
          <button className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="flex pt-20 pb-16">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 bottom-16 overflow-y-auto bg-white shadow-md border-r border-gray-100 p-4 transition-all duration-300 z-40
            ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}
          `}
          aria-hidden={!sidebarOpen}
        >
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`w-full text-left px-4 py-2 rounded ${activeSection === "dashboard"
                ? "bg-indigo-600 text-white"
                : "hover:bg-indigo-100"
                }`}
            >
              Dashboard
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveSection(cat.toLowerCase())}
                className={`w-full text-left px-4 py-2 rounded ${activeSection === cat.toLowerCase()
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-indigo-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Section */}
        <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>        
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Top Summary Cards */}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div
                  className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white p-4 rounded-xl shadow-lg text-center select-none"
                >
                  <div className="text-2xl">📧</div>
                  <h3 className="text-2xl font-bold mt-1">{totalEmails}</h3>
                  <p>Total Emails</p>
                </div>

                {categories.map((cat) => {
                  const style = categoryStyleMap[cat] || categoryStyleMap.Unknown;
                  const count =
                    cat === "Garbage" ? garbageCount : categoryCounts[cat] ?? 0;
                  return (
                    <div
                      key={cat}
                      className={`bg-gradient-to-br ${style.gradient || 'from-slate-500 to-slate-600'} text-white p-4 rounded-xl shadow-lg text-center cursor-pointer hover:brightness-110 transition`}
                      onClick={() => openChatForCategory(cat)}
                      role="button"
                      aria-label={`Open chat for ${cat}`}
                    >
                      <div className="text-2xl">{style.icon}</div>
                      <h3 className="text-2xl font-bold mt-1">{count}</h3>
                      <p className="capitalize">{cat}</p>
                    </div>
                  );
                })}
              </div>

              {/* Inline Chat Panel (opens below the cards) */}
              {chatOpen && (
                <ChatPanel
                  open={chatOpen}
                  onClose={() => setChatOpen(false)}
                  topic={chatTopic}
                  // insights={chatInsights}
                  email={userCreds.email}
                  password={userCreds.password}
                  category={chatTopic?.key !== "all" ? chatTopic?.label : undefined}
                  headerGradient={chatTopic?.gradient}
                />
              )}

              {/* Lower preview cards intentionally hidden per requirement */}
            </div>
          )}

          {/* Category-wise Full View */}
          {categories.map(
            (cat) =>
              activeSection === cat.toLowerCase() && (
                <div key={cat}>
                  <h2 className="text-2xl font-semibold mb-4">
                    {categoryStyleMap[cat]?.icon} {cat} Emails
                  </h2>
                  {emailsByCategory[cat]?.length === 0 ? (
                    <p className="text-gray-700">No results found.</p>
                  ) : (
                    emailsByCategory[cat].map((email) => (
                      <div key={email.id} className="p-3 mb-2 bg-gray-100 rounded">
                        <p className="font-medium text-indigo-600">{email.subject}</p>
                        <p className="text-xs text-gray-500">From: {email.from}</p>
                        {email.due_date && (
                          <p className="text-xs text-red-500">Due: {email.due_date}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )
          )}
        </main>
      </div>
      <Loader show={loading} />
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white text-center py-3 z-50">
        © 2025 Agentic AI Assistant
      </footer>
    </div>
  );
};

export default Dashboard;






