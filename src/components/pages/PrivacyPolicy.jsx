import React from 'react';

const POLICY_URL = 'https://www.freeprivacypolicy.com/live/cb02e14c-0ccd-45e0-a2be-d12900cf4fc1';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-indigo-600 text-white px-4 py-3 shadow flex items-center justify-between">
        <h1 className="text-lg font-semibold">Privacy Policy</h1>
        <a href="/" className="text-sm underline hover:no-underline">Back to Login</a>
      </header>
      <div className="flex-1 overflow-hidden">
        <iframe
          title="Privacy Policy"
          src={POLICY_URL}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
      <footer className="bg-gray-800 text-white text-center py-3 text-xs">
        © {new Date().getFullYear()} Agentic AI Assistant
      </footer>
    </div>
  );
}
