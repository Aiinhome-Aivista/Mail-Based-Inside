import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  const [loadingMessage, setLoadingMessage] = useState('Loading dashboard…');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTopic, setChatTopic] = useState(null); // { key, label, icon, count }
  const [chatInsights, setChatInsights] = useState([]);
  // Persist chat sessions per topic key (e.g., 'all', 'insurance') across navigation
  const [chatSessions, setChatSessions] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chatSessions');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [userCreds, setUserCreds] = useState({ email: "", password: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false); // collapsed by default
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryMails, setCategoryMails] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [activeCategoryMail, setActiveCategoryMail] = useState(null);
  const [mailLoadingId, setMailLoadingId] = useState(null);
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [modalMail, setModalMail] = useState(null);
  // In-app notifications
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = JSON.parse(sessionStorage.getItem('inAppNotifications') || '[]');
      return Array.isArray(raw) ? raw.map(n => ({ read: false, ...n })) : [];
    } catch { return []; }
  });
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navigate = useNavigate();
  // Guard ref to avoid duplicate fetch in React 18 StrictMode (dev) double invoke
  const initialFetchDoneRef = useRef(false);
  const remindersSentRef = useRef(false); // ensure /send-reminders called only once per mount
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
    setLoadingMessage('Loading dashboard…');
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

  // Listen for foreground FCM notifications
  useEffect(() => {
    function handleIncoming(e) {
      setNotifications(prev => {
        const next = [e.detail, ...prev].slice(0, 20);
        try { sessionStorage.setItem('inAppNotifications', JSON.stringify(next)); } catch { }
        return next;
      });
    }
    window.addEventListener('fcm-notification', handleIncoming);
    return () => window.removeEventListener('fcm-notification', handleIncoming);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    if (!notifOpen) return;
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  const toggleRead = (id) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: !n.read } : n);
      try { sessionStorage.setItem('inAppNotifications', JSON.stringify(next)); } catch { }
      return next;
    });
  };

  // After initial dashboard load completes (loading false, data present), trigger reminders
  useEffect(() => {
    let retryTimer;
    const attempt = (triesLeft) => {
      if (remindersSentRef.current) return;
      if (loading) { // wait for loading false
        retryTimer = setTimeout(() => attempt(triesLeft), 400);
        return;
      }
      if (!initialFetchDoneRef.current || !dashboardData) { // still not initial data
        if (triesLeft > 0) retryTimer = setTimeout(() => attempt(triesLeft - 1), 500);
        return;
      }
      const email = userCreds.email || (() => {
        try {
          const stored = JSON.parse(sessionStorage.getItem('userData') || '{}');
          return stored?.email || stored?.user?.email || '';
        } catch { return ''; }
      })();
      if (!email) {
        if (triesLeft > 0) retryTimer = setTimeout(() => attempt(triesLeft - 1), 600);
        return;
      }
      // Ensure FCM token exists (some flows may still be generating)
      const fcmToken = sessionStorage.getItem('fcmToken');
      if (!fcmToken && triesLeft > 0) {
        retryTimer = setTimeout(() => attempt(triesLeft - 1), 700);
        return;
      }
      remindersSentRef.current = true;
      console.log('Calling send-reminders with email', email, 'and fcmToken present?', !!fcmToken);
      fetch('http://122.163.121.176:3006/send-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email })
      }).then(async r => {
        const text = await r.text();
        let parsed;
        try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
        if (!r.ok) throw new Error('send-reminders failed: ' + (parsed?.message || r.status));
        console.log('send-reminders success:', parsed);
      }).catch(err => {
        console.warn('send-reminders error:', err);
      });
    };
    attempt(5);
    return () => clearTimeout(retryTimer);
  }, [loading, dashboardData, userCreds.email]);

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

  const handleChatMessagesChange = (topicKey, msgs) => {
    setChatSessions(prev => {
      const next = { ...prev, [topicKey]: msgs };
      try { sessionStorage.setItem('chatSessions', JSON.stringify(next)); } catch {/* ignore */ }
      return next;
    });
  };

  // Stable callback passed to ChatPanel to avoid re-triggering its persistence effect every render
  const persistChatMessages = useCallback((msgs) => {
    if (!chatTopic?.key) return;
    handleChatMessagesChange(chatTopic.key, msgs);
  }, [chatTopic?.key]);

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
      setLoadingMessage('Refreshing mails…');
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

  const fetchCategoryMails = (category) => {
    if (!userCreds.email) return;
    // Use global loader instead of inline spinner
    setLoading(true);
    setLoadingMessage(`Loading ${category} mails…`);
    setCategoryError("");
    setCategoryMails([]);
    setActiveCategoryMail(null);
    fetch('http://122.163.121.176:3006/get_mails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userCreds.email, category })
    })
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch category mails');
        return r.json();
      })
      .then(data => {
        const mails = Array.isArray(data) ? data : (data?.mails || data?.emails || []);
        setCategoryMails(mails);
      })
      .catch(err => {
        console.error('Category fetch error:', err);
        setCategoryError(err.message || 'Error fetching mails');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle selecting a mail card (stores active mail & brief loading state)
  const handleSelectCategoryMail = (mail, idx) => {
    setMailLoadingId(idx);
    setActiveCategoryMail(mail);
    // simulate tiny delay for loader feedback; clear quickly
    setTimeout(() => setMailLoadingId(null), 150);
  };

  const openMailModal = (mail) => {
    setModalMail(mail);
    setMailModalOpen(true);
  };
  const closeMailModal = () => {
    setMailModalOpen(false);
    setModalMail(null);
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
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/10 hover:bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 relative"
              aria-label="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 17h5l-1.4-1.4A2 2 0 0117 14.2V11a5 5 0 00-9.33-2.5M9 21h6m-9-4h12" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] leading-none px-1.5 py-0.5 rounded-full font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white text-gray-800 shadow-lg rounded-lg border border-gray-200 z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-indigo-600 text-white rounded-t-lg">
                  <span className="font-medium text-sm">Notifications</span>
                  <button onClick={() => { setNotifications([]); sessionStorage.removeItem('inAppNotifications'); }} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded">Clear</button>
                </div>
                {notifications.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">No notifications yet.</div>
                )}
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-2 border-b last:border-b-0 text-sm transition ${!n.read ? 'hover:bg-gray-50' : 'opacity-60 hover:opacity-70'}`}>
                    <div className="flex items-start gap-2">
                      <img src={n.icon || '/src/assets/3DAvatar.png'} alt="icon" className="w-8 h-8 rounded-full object-cover bg-indigo-100 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-gray-800 truncate" title={n.title}>{n.title}</p>
                          <button
                            onClick={() => toggleRead(n.id)}
                            className={`text-xs rounded px-1.5 py-0.5 border ${n.read ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'}`}
                            title={n.read ? 'Mark unread' : 'Mark read'}
                          >
                            {n.read ? '✔✔' : '✔'}
                          </button>
                        </div>
                        {n.body && <p className="text-gray-600 text-xs line-clamp-2 whitespace-pre-wrap">{n.body}</p>}
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(n.receivedAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                onClick={() => {
                  setActiveSection(cat.toLowerCase());
                  setSelectedCategory(cat);
                  fetchCategoryMails(cat); // always fetch on click
                }}
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
                  topicKey={chatTopic?.key}
                  messagesProp={chatTopic?.key ? chatSessions[chatTopic.key] : undefined}
                  onMessagesChange={persistChatMessages}
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

          {/* Removed legacy category-wise full view (now replaced by sidebar-driven fetch rendering below) */}

          {activeSection !== 'dashboard' && selectedCategory && activeSection === selectedCategory.toLowerCase() && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold">{categoryStyleMap[selectedCategory]?.icon} {selectedCategory} Emails</h2>
                <button onClick={() => { setSelectedCategory(''); setActiveSection('dashboard'); }} className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700">← Back to Dashboard</button>
              </div>
              {categoryLoading && (
                <div className="flex items-center gap-2 text-sm text-indigo-600 mb-3">
                  <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  Loading {selectedCategory} mails…
                </div>
              )}
              {categoryError && !categoryLoading && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{categoryError}</div>
              )}
              {/* {!categoryLoading && !categoryError && categoryMails.length === 0 && (
                <p className="text-gray-600 text-sm">No mails found for {selectedCategory}.</p>
              )} */}
              {categoryMails.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryMails.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => { handleSelectCategoryMail(m, idx); openMailModal(m); }}
                      className={`relative text-left bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition ${activeCategoryMail === m ? 'ring-2 ring-indigo-400' : ''}`}
                    >
                      <p className="text-sm font-semibold text-indigo-600 truncate" title={m.subject}>{m.subject || 'No Subject'}</p>
                      <p className="text-[11px] text-gray-500 truncate" title={m.sender}>{m.sender || m.from || 'Unknown sender'}</p>
                      <p className="mt-1 text-[12px] line-clamp-3 text-gray-600 whitespace-pre-wrap">{(m.body || '').replace(/\r\n/g, ' ').slice(0, 160) + (m.body && m.body.length > 160 ? '…' : '')}</p>
                      {mailLoadingId === idx && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                          <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {/* Inline selected mail preview removed per request; modal handles full view */}
            </div>
          )}
        </main>
      </div>

      {mailModalOpen && modalMail && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col">
            <div className="flex items-start justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-xl">
              <div className="pr-6">
                <h3 className="text-lg font-semibold text-white break-words">{modalMail.subject || 'No Subject'}</h3>
                <p className="text-xs text-indigo-100 mt-1"><span className="font-medium">From:</span> {modalMail.sender || modalMail.from || 'Unknown'}{modalMail.to && <span className="ml-2"><span className="font-medium">To:</span> {Array.isArray(modalMail.to) ? modalMail.to.join(', ') : modalMail.to}</span>}</p>
              </div>
              <button onClick={closeMailModal} className="text-white/80 hover:text-white inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40" aria-label="Close mail dialog">✕</button>
            </div>
            <div className="overflow-y-auto px-6 py-4 space-y-4 text-sm leading-relaxed">
              {modalMail.date && (
                <p className="text-xs text-gray-500">Received: {modalMail.date}</p>
              )}
              <div className="whitespace-pre-wrap font-normal text-gray-800 selection:bg-indigo-200/60">
                {(modalMail.body || '').trim() || 'No body provided.'}
              </div>
              {modalMail.attachments?.length > 0 && (
                <div className="pt-2 border-t">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Attachments</h4>
                  <ul className="space-y-1">
                    {modalMail.attachments.map((a, i) => (
                      <li key={i} className="text-xs flex items-center gap-2 text-indigo-600">
                        <span>📎</span>
                        <span>{a.filename || a.name || 'Attachment'}</span>
                        {a.url && <a href={a.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Open</a>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={closeMailModal}
                className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Loader show={loading} message={loadingMessage} />
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white text-center py-3 z-50 text-sm flex flex-col sm:flex-row items-center justify-center gap-2">
        <span>© 2025 Agentic AI Assistant</span>
        <button
          onClick={() => navigate('/privacy-policy')}
          className="underline hover:no-underline text-indigo-300 hover:text-indigo-200"
        >Privacy Policy</button>
      </footer>
    </div>
  );
};

export default Dashboard;






