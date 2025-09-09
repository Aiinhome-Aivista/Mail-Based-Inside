// import React, { useState } from "react";

// const Dashboard = () => {
//   const [activeSection, setActiveSection] = useState("urgent");

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       {/* Header */}
//       <header className="bg-indigo-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
//         <h1 className="text-xl font-semibold">Agentic AI Dashboard</h1>
//         <div className="flex items-center space-x-4">
//           <span className="font-medium">Welcome, User</span>
//           <button className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100">
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Main Section */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside className="w-64 bg-white shadow-md p-4">
//           <nav className="space-y-2">
//             <button
//               onClick={() => setActiveSection("urgent")}
//               className={`w-full text-left px-4 py-2 rounded ${
//                 activeSection === "urgent"
//                   ? "bg-indigo-600 text-white"
//                   : "hover:bg-indigo-100"
//               }`}
//             >
//               Urgent Emails
//             </button>
//             <button
//               onClick={() => setActiveSection("bills")}
//               className={`w-full text-left px-4 py-2 rounded ${
//                 activeSection === "bills"
//                   ? "bg-indigo-600 text-white"
//                   : "hover:bg-indigo-100"
//               }`}
//             >
//               Upcoming Bills
//             </button>
//           </nav>
//         </aside>

//         {/* Content Area */}
//         <main className="flex-1 p-6">
//           {activeSection === "urgent" && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-4">Urgent Emails</h2>
//               <p className="text-gray-700">
//                 This section will display the list of emails needing your immediate attention.
//               </p>
//             </div>
//           )}
//           {activeSection === "bills" && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-4">Upcoming Bills</h2>
//               <p className="text-gray-700">
//                 This section will display upcoming bills, insurance premiums, and alerts.
//               </p>
//             </div>
//           )}
//         </main>
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white text-center py-3">
//         © 2025 Agentic AI Assistant | Powered by Mistral LLM
//       </footer>
//     </div>
//   );
// };

// export default Dashboard;
// import React, { useState } from "react";

// const Dashboard = () => {
//   const [activeSection, setActiveSection] = useState("dashboard");

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       {/* Header */}
//       <header className="bg-indigo-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
//         <h1 className="text-xl font-semibold">Agentic AI Dashboard</h1>
//         <div className="flex items-center space-x-4">
//           <span className="font-medium">Welcome, User</span>
//           <button className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100">
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Main Section */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside className="w-64 bg-white shadow-md p-4">
//           <nav className="space-y-2">
//             <button
//               onClick={() => setActiveSection("dashboard")}
//               className={`w-full text-left px-4 py-2 rounded ${
//                 activeSection === "dashboard"
//                   ? "bg-indigo-600 text-white"
//                   : "hover:bg-indigo-100"
//               }`}
//             >
//               Dashboard
//             </button>
//             <button
//               onClick={() => setActiveSection("urgent")}
//               className={`w-full text-left px-4 py-2 rounded ${
//                 activeSection === "urgent"
//                   ? "bg-indigo-600 text-white"
//                   : "hover:bg-indigo-100"
//               }`}
//             >
//               Urgent Emails
//             </button>
//             <button
//               onClick={() => setActiveSection("bills")}
//               className={`w-full text-left px-4 py-2 rounded ${
//                 activeSection === "bills"
//                   ? "bg-indigo-600 text-white"
//                   : "hover:bg-indigo-100"
//               }`}
//             >
//               Upcoming Bills
//             </button>
//           </nav>
//         </aside>

//         {/* Content Area */}
//         <main className="flex-1 p-6">
//           {activeSection === "dashboard" && (
//             <div className="space-y-6">
//               {/* Top Cards */}
//               <div className="grid grid-cols-4 gap-4">
//                 <div className="bg-purple-500 text-white p-4 rounded-lg shadow-lg">
//                   <h3 className="text-2xl font-bold">8</h3>
//                   <p>Total Emails</p>
//                 </div>
//                 <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
//                   <h3 className="text-2xl font-bold">2</h3>
//                   <p>Urgent Emails</p>
//                 </div>
//                 <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-lg">
//                   <h3 className="text-2xl font-bold">3</h3>
//                   <p>Financial Alerts</p>
//                 </div>
//                 <div className="bg-cyan-500 text-white p-4 rounded-lg shadow-lg">
//                   <h3 className="text-2xl font-bold">4</h3>
//                   <p>Action Required</p>
//                 </div>
//               </div>

//               {/* Bottom Cards */}
//               <div className="grid grid-cols-2 gap-4">
//                 {/* Urgent Emails */}
//                 <div className="bg-white rounded-lg p-4 shadow-lg">
//                   <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
//                     🔥 Urgent Emails
//                     <span className="ml-auto bg-red-600 text-white px-2 py-0.5 rounded text-xs">
//                       2
//                     </span>
//                   </h2>
//                   <div className="space-y-3">
//                     <div className="p-3 bg-gray-100 rounded">
//                       <p className="font-medium text-indigo-600">
//                         Urgent: Server Downtime Alert - Action Required
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         From: alerts@techcorp.com
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         2025-09-04 09:13
//                       </p>
//                     </div>
//                     <div className="p-3 bg-gray-100 rounded">
//                       <p className="font-medium text-indigo-600">
//                         Urgent: Account Security Alert
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         From: security@paypal.com
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         2025-09-03 09:13
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Financial Alerts */}
//                 <div className="bg-white rounded-lg p-4 shadow-lg">
//                   <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
//                     💲 Financial Alerts
//                     <span className="ml-auto bg-yellow-600 text-white px-2 py-0.5 rounded text-xs">
//                       3
//                     </span>
//                   </h2>
//                   <div className="space-y-3">
//                     <div className="p-3 bg-gray-100 rounded">
//                       <p className="font-medium text-yellow-600">Bill Due</p>
//                       <p className="text-xs text-gray-500">
//                         Amount: $145.67 | Due: 2025-09-12
//                       </p>
//                     </div>
//                     <div className="p-3 bg-gray-100 rounded">
//                       <p className="font-medium text-yellow-600">Payment Due</p>
//                       <p className="text-xs text-gray-500">
//                         Amount: $180.50 | Due: 2025-09-08
//                       </p>
//                     </div>
//                     <div className="p-3 bg-gray-100 rounded">
//                       <p className="font-medium text-yellow-600">Payment Due</p>
//                       <p className="text-xs text-gray-500">
//                         Amount: $2450.00 | Due: 2025-09-06
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeSection === "urgent" && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-4">Urgent Emails</h2>
//               <p className="text-gray-700">
//                 This section will display the list of emails needing your immediate attention.
//               </p>
//             </div>
//           )}

//           {activeSection === "bills" && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-4">Upcoming Bills</h2>
//               <p className="text-gray-700">
//                 This section will display upcoming bills, insurance premiums, and alerts.
//               </p>
//             </div>
//           )}
//         </main>
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white text-center py-3">
//         © 2025 Agentic AI Assistant | Powered by Mistral LLM
//       </footer>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from "react";

// const categoryStyles = {
//   Urgent: { bg: "bg-red-500", icon: "🔥" },
//   Promotion: { bg: "bg-yellow-500", icon: "🏷️" },
//   Subscription: { bg: "bg-green-500", icon: "📬" },
//   Social: { bg: "bg-blue-500", icon: "👥" },
//   Financial: { bg: "bg-purple-500", icon: "💲" },
//   Unknown: { bg: "bg-gray-500", icon: "📂" },
// };

// const Dashboard = () => {
//   const [activeSection, setActiveSection] = useState("dashboard");
//   const [userName, setUserName] = useState("User");
//   const [dashboardData, setDashboardData] = useState(null);

//   useEffect(() => {
//     const storedData = sessionStorage.getItem("userData");
//     const userPassword = sessionStorage.getItem("userPassword");

//     if (storedData && userPassword) {
//       const parsedData = JSON.parse(storedData);
//       const userEmail = parsedData?.email;

//       if (parsedData?.username) setUserName(parsedData.username);

//       if (userEmail && userPassword) {
//         fetch("http://122.163.121.176:3006/analyze-mails", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: userEmail, password: userPassword }),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             console.log("Fetched dashboard data:", data);
//             setDashboardData(data);
//             if (data?.username) setUserName(data.username);
//           })
//           .catch((err) => console.error("API Error:", err));
//       }
//     }
//   }, []);

//   const categoryCounts = dashboardData?.summary?.category_counts || {};
//   const categories = Object.keys(categoryCounts).length
//     ? Object.keys(categoryCounts)
//     : ["Urgent", "Promotion", "Subscription", "Social", "Financial", "Unknown"];

//   const emailsByCategory = categories.reduce((acc, category) => {
//     acc[category] =
//       dashboardData?.emails?.filter(
//         (e) => e.category?.toLowerCase() === category.toLowerCase()
//       ) || [];
//     return acc;
//   }, {});

//   const totalEmails = Object.values(categoryCounts).reduce(
//     (sum, count) => sum + count,
//     0
//   );

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Header (Fixed) */}
//       <header className="fixed top-0 left-0 w-full bg-indigo-600 text-white py-4 px-6 flex justify-between items-center shadow-md z-50">
//         <h1 className="text-xl font-semibold">Agentic AI Dashboard</h1>
//         <div className="flex items-center space-x-4">
//           <span className="font-medium">Welcome, {userName}</span>
//           <button className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100">
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex pt-20 pb-16">
//         {/* Sidebar */}
//         <aside className="w-64 bg-white shadow-md p-4 fixed top-16 bottom-16 overflow-y-auto">
//           <nav className="space-y-2">
//             <button
//               onClick={() => setActiveSection("dashboard")}
//               className={`w-full text-left px-4 py-2 rounded ${
//                 activeSection === "dashboard"
//                   ? "bg-indigo-600 text-white"
//                   : "hover:bg-indigo-100"
//               }`}
//             >
//               Dashboard
//             </button>
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setActiveSection(cat.toLowerCase())}
//                 className={`w-full text-left px-4 py-2 rounded ${
//                   activeSection === cat.toLowerCase()
//                     ? "bg-indigo-600 text-white"
//                     : "hover:bg-indigo-100"
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </nav>
//         </aside>

//         {/* Main Section */}
//         <main className="flex-1 ml-64 p-6 overflow-y-auto">
//           {activeSection === "dashboard" && (
//             <div className="space-y-6">
//               {/* Top Cards */}
//               <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                 {/* Total Emails */}
//                 <div className="bg-indigo-700 text-white p-4 rounded-lg shadow-lg text-center">
//                   <div className="text-2xl">📧</div>
//                   <h3 className="text-2xl font-bold mt-1">{totalEmails}</h3>
//                   <p>Total Emails</p>
//                 </div>

//                 {categories.map((cat) => {
//                   const style = categoryStyles[cat] || categoryStyles.Unknown;
//                   return (
//                     <div
//                       key={cat}
//                       className={`${style.bg} text-white p-4 rounded-lg shadow-lg text-center`}
//                     >
//                       <div className="text-2xl">{style.icon}</div>
//                       <h3 className="text-2xl font-bold mt-1">
//                         {categoryCounts[cat] ?? 0}
//                       </h3>
//                       <p className="capitalize">{cat}</p>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Bottom Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {categories.map((cat) => {
//                   const style = categoryStyles[cat] || categoryStyles.Unknown;
//                   const emails = emailsByCategory[cat];
//                   return (
//                     <div
//                       key={cat}
//                       className="bg-white rounded-lg p-4 shadow-lg"
//                     >
//                       <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
//                         <span>{style.icon}</span> {cat}
//                         <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">
//                           {emails?.length || 0}
//                         </span>
//                       </h2>
//                       <div className="space-y-2">
//                         {emails?.length > 0 ? (
//                           emails.slice(0, 5).map((email) => (
//                             <div
//                               key={email.id}
//                               className="p-2 bg-gray-100 rounded text-sm"
//                             >
//                               <p className="font-medium text-indigo-600">
//                                 {email.subject}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 From: {email.from}
//                               </p>
//                             </div>
//                           ))
//                         ) : (
//                           <p className="text-gray-500 text-sm">
//                             No results found
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Individual Category View */}
//           {categories.map(
//             (cat) =>
//               activeSection === cat.toLowerCase() && (
//                 <div key={cat}>
//                   <h2 className="text-2xl font-semibold mb-4">
//                     {categoryStyles[cat]?.icon} {cat} Emails
//                   </h2>
//                   {emailsByCategory[cat]?.length === 0 ? (
//                     <p className="text-gray-700">No results found.</p>
//                   ) : (
//                     emailsByCategory[cat].map((email) => (
//                       <div
//                         key={email.id}
//                         className="p-3 mb-2 bg-gray-100 rounded"
//                       >
//                         <p className="font-medium text-indigo-600">
//                           {email.subject}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           From: {email.from}
//                         </p>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )
//           )}
//         </main>
//       </div>

//       {/* Footer (Fixed) */}
//       <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white text-center py-3 z-50">
//         © 2025 Agentic AI Assistant
//       </footer>
//     </div>
//   );
// };

// export default Dashboard;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";

const defaultCategoryStyles = {
  Insurance: { bg: "bg-blue-500", icon: "🛡️" },
  Healthcare: { bg: "bg-green-500", icon: "🏥" },
  "EMI Alert": { bg: "bg-purple-500", icon: "💳" },
  Promotion: { bg: "bg-yellow-500", icon: "🏷️" },
  Garbage: { bg: "bg-gray-400", icon: "🗑️" },
  Unknown: { bg: "bg-gray-500", icon: "📂" },
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userName, setUserName] = useState("User");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const storedData = sessionStorage.getItem("userData");
    const userPassword = sessionStorage.getItem("userPassword");

    if (storedData && userPassword) {
      const parsedData = JSON.parse(storedData);
      const userEmail = parsedData?.email;

      if (parsedData?.username) setUserName(parsedData.username);

      if (userEmail && userPassword) {
        setLoading(true);
        fetch("http://122.163.121.176:3006/analyze-mails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, password: userPassword }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Fetched dashboard data:", data);
            setDashboardData(data);
            setLoading(false);
            if (data?.username) setUserName(data.username);
          })
          .catch((err) => console.error("API Error:", err))
          .finally(() => setLoading(false));
      }
    }
  }, []);

  const categoryCounts = dashboardData?.summary?.category_counts || {};
  const totalEmails = dashboardData?.summary?.total_email_count || 0;
  const garbageCount = dashboardData?.summary?.garbage_count || 0;
  const dueItems = dashboardData?.summary?.upcoming_due_items || [];

  // Add garbage as a separate category
  const categories = [...Object.keys(categoryCounts), "Garbage"];

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

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session
    navigate("/"); // Redirect to login page
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-indigo-600 text-white py-4 px-6 flex justify-between items-center shadow-md z-50">
        <h1 className="text-xl font-semibold">Agentic AI Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">Welcome, {userName}</span>
          <button className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="flex pt-20 pb-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4 fixed top-16 bottom-16 overflow-y-auto">
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
        <main className="flex-1 ml-64 p-6 overflow-y-auto">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Top Summary Cards */}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="bg-indigo-700 text-white p-4 rounded-lg shadow-lg text-center">
                  <div className="text-2xl">📧</div>
                  <h3 className="text-2xl font-bold mt-1">{totalEmails}</h3>
                  <p>Total Emails</p>
                </div>

                {categories.map((cat) => {
                  const style = defaultCategoryStyles[cat] || defaultCategoryStyles.Unknown;
                  const count =
                    cat === "Garbage" ? garbageCount : categoryCounts[cat] ?? 0;
                  return (
                    <div
                      key={cat}
                      className={`${style.bg} text-white p-4 rounded-lg shadow-lg text-center`}
                    >
                      <div className="text-2xl">{style.icon}</div>
                      <h3 className="text-2xl font-bold mt-1">{count}</h3>
                      <p className="capitalize">{cat}</p>
                    </div>
                  );
                })}
              </div>

              {/* Upcoming Due Items */}
              {dueItems?.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Upcoming Due Items</h2>
                  <ul className="space-y-2">
                    {dueItems.map((item) => (
                      <li key={item.id} className="p-2 bg-yellow-100 rounded text-sm">
                        <p className="font-medium text-indigo-600">{item.subject}</p>
                        <p className="text-xs text-gray-600">Due: {item.due_date}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Category Emails Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const style = defaultCategoryStyles[cat] || defaultCategoryStyles.Unknown;
                  const emails = emailsByCategory[cat];
                  return (
                    <div key={cat} className="bg-white rounded-lg p-4 shadow-lg">
                      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                        <span>{style.icon}</span> {cat}
                        <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">
                          {emails?.length || 0}
                        </span>
                      </h2>
                      <div className="space-y-2">
                        {emails?.length > 0 ? (
                          emails.slice(0, 5).map((email) => (
                            <div key={email.id} className="p-2 bg-gray-100 rounded text-sm">
                              <p className="font-medium text-indigo-600">{email.subject}</p>
                              <p className="text-xs text-gray-500">From: {email.from}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No results found</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category-wise Full View */}
          {categories.map(
            (cat) =>
              activeSection === cat.toLowerCase() && (
                <div key={cat}>
                  <h2 className="text-2xl font-semibold mb-4">
                    {defaultCategoryStyles[cat]?.icon} {cat} Emails
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






