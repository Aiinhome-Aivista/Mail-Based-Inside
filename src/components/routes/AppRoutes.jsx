import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import PrivacyPolicy from '../pages/PrivacyPolicy'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        </Routes>
    )
}

export default AppRoutes
