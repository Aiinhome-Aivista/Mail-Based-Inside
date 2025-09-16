import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
// Removed GoogleLogin component for custom styled button
// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode'; // (Not used currently)

import Loader from '../common/Loader';
import { requestAndRegisterFcmToken } from '../../utils/fcm';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID = "1049518124716-atn96t7ghgcj9hfagsbebmkbia66uggd.apps.googleusercontent.com";

  // ------------------------------
  // Regular Email/Password Login
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showWarn('Email and Password are required');
      return;
    }

    const payload = { email,password};

    try {
      setLoading(true);
      const response = await fetch("http://122.163.121.176:3006/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data?.user) {
        sessionStorage.setItem("userData", JSON.stringify(data.user));
        sessionStorage.setItem("userPassword", password);
        setLoading(false);
        showSuccess('Successfully Logged In');
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        setLoading(false);
        showError(data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      showError(error?.message || 'Something went wrong');
    }
  };

  const handleGoogleLoginSuccess = () => {
    if (!(window.google && window.google.accounts && window.google.accounts.oauth2)) {
      showError("Google API not loaded");
      return;
    }
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly',
      prompt: 'consent',
      callback: async (response) => {
        const accessToken = response.access_token;
        if (!accessToken) {
          showError("No access token received");
          return;
        }
        setLoading(true);
        try {
          const loginRes = await fetch("http://122.163.121.176:3006/api/google-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: accessToken }),
          });
          const loginData = await loginRes.json();
          console.log("Google login response:", loginData);
          if (!loginRes.ok || loginData?.status !== 'Google login successful') {
            showError(loginData?.error || loginData?.status || 'Google login failed');
            setLoading(false);
            return;
          }
          // Persist full response so Dashboard can use access_token & name
          sessionStorage.setItem("userData", JSON.stringify(loginData));
          showSuccess(loginData.status || 'Google login successful');
          // Register FCM token immediately after login (don't wait for refresh)
          const email = loginData?.email || loginData?.user?.email;
          if (email) {
            requestAndRegisterFcmToken(email);
          }
          // Navigate; Dashboard effect will trigger readmails with access token
          setTimeout(() => navigate('/dashboard'), 1200);
        } catch (err) {
          console.error('Google login error', err);
          showError('Google login failed');
          setLoading(false);
        }
      },
    });
    tokenClient.requestAccessToken();
  };


  const handleGoogleLoginError = () => {
    showError("Google Login failed");
  };

  const showSuccess = (msg) => toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  const showWarn = (msg) => toast.current.show({ severity: 'warn', summary: 'Warning', detail: msg, life: 3000 });
  const showError = (msg) => toast.current.show({ severity: 'error', summary: 'Error', detail: msg, life: 3000 });

  const handleFocus = (field) => setIsFocused({ ...isFocused, [field]: true });
  const handleBlur = (field) => setIsFocused({ ...isFocused, [field]: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 overflow-x-hidden">
      <Toast ref={toast} />
      <div className="w-full max-w-md mx-auto my-auto">
        <div className="fixed top-0 left-0 right-0 h-1/2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-b-[60%] -z-10"></div>

        <div className="relative bg-white/95 rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-white/30 mx-4">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-6 pt-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Agentic Email Assistant</h1>
            <p className="text-gray-600 text-sm">Welcome back! Sign in to manage your emails efficiently</p>
          </div>

          {/* Email/Password Login */}
          {/* <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative mb-6">
              <FloatLabel>
                <InputText
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
                <label htmlFor="email" className={`transition-all duration-300 ${isFocused.email || email ? 'text-xs text-blue-500' : 'text-sm text-gray-500'} font-medium`}>
                  Email Address
                </label>
              </FloatLabel>
            </div>

            <div className="relative mb-6">
              <FloatLabel>
                <InputText
                  id="password"
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
                <label htmlFor="password" className={`transition-all duration-300 ${isFocused.password || password ? 'text-xs text-blue-500' : 'text-sm text-gray-500'} font-medium`}>
                  Password
                </label>
              </FloatLabel>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </form> */}

          {/* Divider */}
          {/* <div className="my-6 flex items-center justify-center text-gray-400">
            <span className="px-2">or</span>
          </div> */}

          {/* Google Login Button (Custom Styled) */}
          <div className="mt-2">
            <button
              type="button"
              onClick={handleGoogleLoginSuccess}
              disabled={loading}
              className="w-full  hover:from-blue-600 hover:to-purple-700 group relative overflow-hidden flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center w-6 h-6 bg-white rounded-sm shadow-sm">
                {/* Google G Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="w-4 h-4">
                  <path fill="#EA4335" d="M533.5 278.4c0-17.4-1.6-34-4.7-50.2H272v95.1h147.3c-6.4 34.5-25.7 63.7-54.8 83.2v68h88.4c51.7-47.6 80.6-117.8 80.6-196.1z" />
                  <path fill="#34A853" d="M272 544.3c73.9 0 135.9-24.5 181.2-66.8l-88.4-68c-24.5 16.5-55.8 26-92.8 26-71.3 0-131.8-48.1-153.4-112.7H27.6v70.8c45 89.2 137.4 150.7 244.4 150.7z" />
                  <path fill="#4A90E2" d="M118.6 322.8c-10.8-32.5-10.8-67.9 0-100.4V151.6H27.6c-36.5 72.5-36.5 158.6 0 231.1l91-59.9z" />
                  <path fill="#FBBC05" d="M272 107.7c39.9-.6 78.2 14 107.4 40.8l80-80C407.9 24.6 344.4-.8 272 0 165 0 72.6 61.5 27.6 150.7l91 70.8C140.2 155.8 200.7 107.7 272 107.7z" />
                </svg>
              </span>
              <span className="font-medium tracking-wide">Sign in with Google</span>
              {loading && (
                <span className="absolute right-4 inline-flex h-5 w-5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          </div>
        </div>

        <div className="fixed -bottom-24 -left-24 w-48 h-48 bg-blue-200/30 rounded-full -z-10"></div>
        <div className="fixed -top-16 -right-16 w-32 h-32 bg-purple-300/20 rounded-full -z-10"></div>
      </div>
      <Loader show={loading} />
    </div>
  );
}

export default Login;
