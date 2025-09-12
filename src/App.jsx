import { useState } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './components/routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google'; // ✅ Add this line

function App() {
  return (
    <GoogleOAuthProvider clientId="1049518124716-atn96t7ghgcj9hfagsbebmkbia66uggd.apps.googleusercontent.com"> {/* ✅ Wrap your app here */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;