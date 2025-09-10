import React, { useMemo, useRef, useState, useEffect } from "react";

// Static chat panel UI for Mail Insights assistant
// Props:
// - open: boolean to control visibility
// - onClose: function to close panel
// - topic: { key: string, label: string, icon?: string, count?: number } | null
// - insights: optional array of strings to show as quick facts
// New props: email, password, category (string) used for API calls
function ChatPanel({ open, onClose, topic, insights = [], email, password, category }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    const label = topic?.label || "your emails";
    return [
      {
        id: "m1",
        role: "assistant",
        text:
          `Hello! I\'m your Mail Insights assistant. I\'ve loaded context for ${label}.`,
      },
      {
        id: "m2",
        role: "user",
        text: "Give me a quick overview.",
      },
    ];
  });
  const [sending, setSending] = useState(false);
  const [loadingOverview, setLoadingOverview] = useState(false);

  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Helper to format insights response into readable text
  const formatOverview = (data) => {
    try {
      if (!data) return "No insights available.";
      // Per requirement: bind 'insights' key only; handle string or array
      if (typeof data?.insights === "string" && data.insights.trim().length) {
        return data.insights;
      }
      if (Array.isArray(data?.insights)) {
        const items = data.insights.filter((x) => typeof x === "string");
        if (items.length) return `Insights\n• ${items.join("\n• ")}`;
      }
      // Fallback: accept a root array of strings if server returns that shape
      if (Array.isArray(data)) {
        const items = data.filter((x) => typeof x === "string");
        if (items.length) return `Insights\n• ${items.join("\n• ")}`;
      }
      return "No insights available.";
    } catch {
      return "No insights available.";
    }
  };

  useEffect(() => {
    // Reset starter thread when topic changes
    const label = topic?.label || "your emails";
    setMessages([
      // {
      //   id: "m1",
      //   role: "assistant",
      //   text: `Hello! I\'m your Mail Insights assistant. I\'ve loaded context for ${label}.`,
      // },
      // {
      //   id: "m2",
      //   role: "user",
      //   text: "Give me a quick overview.",
      // },
    ]);

    // After the quick overview request, fetch category insights if possible
    const shouldFetch = Boolean(email && password && category);
    if (!shouldFetch) return;

    const typingId = `ov-${Date.now()}`;
    setLoadingOverview(true);
    setMessages((prev) => [
      ...prev,
      { id: typingId, role: "assistant", text: "Fetching insights…" },
    ]);

    (async () => {
      try {
        const res = await fetch("http://122.163.121.176:3006/category-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, category }),
        });
        const data = await res.json().catch(() => ({}));
        const text = formatOverview(data);
        setMessages((prev) => prev.map((m) => (m.id === typingId ? { ...m, text } : m)));
      } catch (e) {
        setMessages((prev) =>
          prev.map((m) => (m.id === typingId ? { ...m, text: "I couldn\'t load insights right now. Please try again." } : m))
        );
      } finally {
        setLoadingOverview(false);
      }
    })();
  }, [topic?.key, email, password, category]);

  const headerTitle = useMemo(() => {
    const icon = topic?.icon || "💬";
    const label = topic?.label || "Mail Insights";
    return (
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold">Chat with Mail Insights</span>
        <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
          {label}
        </span>
        {typeof topic?.count === "number" && (
          <span className="ml-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
            {topic.count} items
          </span>
        )}
      </div>
    );
  }, [topic]);

  if (!open) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    const userMsg = { id: `u-${Date.now()}`, role: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // If missing creds or category, show static reply
    if (!email || !password || !category) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now() + 1}`,
          role: "assistant",
          text:
            !category
              ? "Please select a category card (e.g., Healthcare, Insurance) to start a conversation. The Total Emails card is informational only."
              : "I can't reach the server because credentials seem missing. Please log in again.",
        },
      ]);
      return;
    }

    // Add typing indicator
    const typingId = `t-${Date.now() + 2}`;
    setMessages((prev) => [
      ...prev,
      { id: typingId, role: "assistant", text: "Thinking…" },
    ]);
    setSending(true);
    try {
      const res = await fetch("http://122.163.121.176:3006/chat-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, category, question: userText }),
      });
      const data = await res.json().catch(() => ({}));
      // Per requirement: bind 'answer' key specifically
      let answer =
        typeof data?.answer === "string" && data.answer.trim().length
          ? data.answer
          : "Sorry, I couldn't parse a response.";
      // Replace typing with real answer
      setMessages((prev) =>
        prev.map((m) => (m.id === typingId ? { ...m, text: answer } : m))
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                ...m,
                text:
                  "Request failed. Please try again. If this persists, there may be a network or server issue.",
              }
            : m
        )
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        {headerTitle}
        <button
          onClick={onClose}
          className="text-white/90 hover:text-white focus:outline-none"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Insights chips */}
      {insights?.length > 0 && (
        <div className="px-4 sm:px-5 pt-3 pb-1 flex flex-wrap gap-2">
          {insights.map((chip, idx) => (
            <span
              key={idx}
              className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-3 py-1"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="px-4 sm:px-5 py-4 max-h-80 overflow-y-auto space-y-3 bg-gray-50">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] sm:max-w-[70%] px-3 py-2 rounded-lg text-sm shadow whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="px-4 sm:px-5 py-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Ask about summaries, due dates, senders, or actions..."
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            disabled={!input.trim() || sending}
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
        {category ? (
          <p className="mt-2 text-[11px] text-gray-500">Connected to Mail Insights • Category: {category}</p>
        ) : null}
      </div>
    </section>
  );
}

export default ChatPanel;
