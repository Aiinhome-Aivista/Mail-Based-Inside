// import React, { useRef, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { FloatLabel } from 'primereact/floatlabel';
// import { InputText } from 'primereact/inputtext';
// import Loader from '../common/Loader';
// import { Toast } from 'primereact/toast';

// function Login() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [isFocused, setIsFocused] = useState({ email: false, password: false })
//   const navigate = useNavigate()
//   const toast = useRef(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       showWarn('Email and Password are required');
//       return;
//     }
//     // Example payload (replace with state if needed)
//     const payload = {
//       email: email,
//       password: password,
//     };

//     try {
//       setLoading(true);
//       const response = await fetch("http://122.163.121.176:3006/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       // if (!response.ok) {
//       //   throw new Error("Login failed");
//       // }

//       const data = await response.json();
//       console.log('object', data)
//       if (response.ok && data?.user) {
//         // Store response in localStorage
//         sessionStorage.setItem("userData", JSON.stringify(data.user));
//         sessionStorage.setItem("userPassword", password);
//         // Navigate to dashboard if login is successful
//         setLoading(false);
//         showSuccess('Successfully Logged In');
//         setTimeout(() => {
//           navigate('/dashboard');
//         }, 1200);
//       } else {
//         setLoading(false);
//         showError(data.message);
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       showError(error?.message || 'Something went wrong');
//     }
//   };
//   const showSuccess = (data) => {
//     toast.current.show({ severity: 'success', summary: 'Success', detail: data, life: 3000 });
//   }

//   const showWarn = (data) => {
//     toast.current.show({ severity: 'warn', summary: 'Warning', detail: data, life: 3000 });
//   }

//   const showError = (data) => {
//     toast.current.show({ severity: 'error', summary: 'Error', detail: data, life: 3000 });
//   }
//   const handleFocus = (field) => {
//     setIsFocused({ ...isFocused, [field]: true })
//   }

//   const handleBlur = (field) => {
//     setIsFocused({ ...isFocused, [field]: false })
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 overflow-x-hidden">
//       <Toast ref={toast} />
//       <div className="w-full max-w-md mx-auto my-auto">
//         {/* Animated background elements - positioned to not cause scrolling */}
//         <div className="fixed top-0 left-0 right-0 h-1/2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-b-[60%] -z-10"></div>

//         <div className="relative bg-white/95 rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-white/30 mx-4">
//           {/* Decorative elements */}
//           <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
//             <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//             </div>
//           </div>

//           <div className="text-center mb-6 pt-8">
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Agentic Email Assistant</h1>
//             <p className="text-gray-600 text-sm">Welcome back! Sign in to manage your emails efficiently</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="relative mb-6">
//               <FloatLabel>
//                 <InputText
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   onFocus={() => handleFocus('email')}
//                   onBlur={() => handleBlur('email')}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
//                 />
//                 <label
//                   htmlFor="email"
//                   className={`transition-all duration-300 ${isFocused.email || email ? 'text-xs text-blue-500' : 'text-sm text-gray-500'} font-medium`}
//                 >
//                   Email Address
//                 </label>
//               </FloatLabel>
//             </div>
//             <div className="relative mb-6">
//               <FloatLabel>
//                 <InputText
//                   id="password"
//                   type='password'
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   onFocus={() => handleFocus('password')}
//                   onBlur={() => handleBlur('password')}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
//                 />
//                 <label
//                   htmlFor="password"
//                   className={`transition-all duration-300 ${isFocused.password || password ? 'text-xs text-blue-500' : 'text-sm text-gray-500'} font-medium`}
//                 >
//                   Password
//                 </label>
//               </FloatLabel>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
//             >
//               Login
//             </button>
//           </form>
//         </div>

//         {/* Background decorative circles - positioned fixed to avoid scrolling */}
//         <div className="fixed -bottom-24 -left-24 w-48 h-48 bg-blue-200/30 rounded-full -z-10"></div>
//         <div className="fixed -top-16 -right-16 w-32 h-32 bg-purple-300/20 rounded-full -z-10"></div>
//       </div>
//       <Loader show={loading} />
//     </div>
//   )
// }

// export default Login


import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { GoogleLogin } from '@react-oauth/google'; // ✅ Import GoogleLogin
import { jwtDecode } from 'jwt-decode'; // ✅ Correct way

import Loader from '../common/Loader';

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

    const payload = {
      email,
      password,
    };

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

  // ------------------------------
  // Google Login Handler
  // ------------------------------
  // const handleGoogleLoginSuccess = async (credentialResponse) => {
  //   const token = credentialResponse?.credential;

  //   if (!token) {
  //     showError("Google token not found");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const res = await fetch("http://localhost:3006/api/google-login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ token }),
  //     });

  //     const data = await res.json();
  //     if (res.ok && data?.email) {
  //       sessionStorage.setItem("userData", JSON.stringify(data));
  //       showSuccess("Google Login Successful");
  //       setTimeout(() => navigate("/dashboard"), 1200);
  //     } else {
  //       showError(data?.error || "Google Login failed");
  //     }

  //   } catch (err) {
  //     console.error("Google login error:", err);
  //     showError("Google Login error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleGoogleLoginSuccess = () => {
  //   const tokenClient = window.google.accounts.oauth2.initTokenClient({
  //     client_id: GOOGLE_CLIENT_ID,
  //     scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly',
  //     prompt: 'consent',  // forces re-consent to ensure fresh token
  //     callback: async (response) => {
  //       const accessToken = response.access_token;
  
  //       if (!accessToken) {
  //         alert("No access token received.");
  //         return;
  //       }
  
  //       console.log("Access Token:", accessToken);
  
  //       try {
  //         const res = await fetch("http://localhost:3006/api/google-login", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             access_token: accessToken  // ✅ correctly named for backend
  //           }),
  //         });
  
  //         const data = await res.json();
  //         console.log("Google login response:", data);
  
  //         if (res.ok && data?.email) {
  //           sessionStorage.setItem("userData", JSON.stringify(data));
  //           navigate("/dashboard");
  //         } else {
  //           alert("Login failed: " + (data?.error || "Unknown error"));
  //         }
  //       } catch (err) {
  //         console.error("Google login error", err);
  //         alert("Google login failed");
  //       }
  //     },
  //   });
  
  //   tokenClient.requestAccessToken();
  // };
  
  const handleGoogleLoginSuccess = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly',
      prompt: 'consent',
      callback: async (response) => {
        const accessToken = response.access_token;
  
        if (!accessToken) {
          alert("No access token received.");
          return;
        }
  
        console.log("Access Token:", accessToken);
  
        try {
          // Step 1: Login via Google
          const loginRes = await fetch("http://localhost:3006/api/google-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: accessToken,
            }),
          });
  
          const loginData = await loginRes.json();
          console.log("Google login response:", loginData);
  
          if (!loginRes.ok || !loginData?.email) {
            alert("Login failed: " + (loginData?.error || "Unknown error"));
            return;
          }
  
          // Save user info in session
          sessionStorage.setItem("userData", JSON.stringify(loginData));
  
          // ✅ Step 2: Fetch & store emails after login
          const readRes = await fetch("http://localhost:3006/readmails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: accessToken, // send again
              email: loginData.email,    // send user email for DB linkage
            }),
          });
  
          const readData = await readRes.json();
          console.log("Read Mail Response:", readData);
  
          if (!readRes.ok) {
            alert("Error fetching emails: " + (readData?.error || "Unknown error"));
            return;
          }
  
          // ✅ Everything successful
          navigate("/dashboard");
  
        } catch (err) {
          console.error("Google login error", err);
          alert("Google login failed");
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center justify-center text-gray-400">
            <span className="px-2">or</span>
          </div>

          {/* Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              width="100%"
              useOneTap
            />
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
