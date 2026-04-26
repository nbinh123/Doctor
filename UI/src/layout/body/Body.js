import React from "react"

import AuthPage from "./pages/login/Login";

import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from "react";
import CarDealership from "./pages/introduce/Introduce";
import CarDetailPage from "./pages/detail/Detail";
import ScrollToTop from "../scroll/ScrollOnTop";
import UserProfilePage from "./pages/user/User";
import PaymentPage from "./pages/payment/Payment";

function Body({toast, socket}) {
    return (
        <div>
            <ScrollToTop/>
            <Routes>
                <Route path="/authPage/:type" element={<AuthPage toast={(type, message) => toast(type, message)} />} />
                {/* <Route path="/authPage" element={<SignIn/>}/> */}
                <Route path="/detail/:id" element={<CarDetailPage/>}/>
                <Route path="/payment/:id" element={<PaymentPage/>}/>
                <Route path="/user" element={<UserProfilePage/>}/>
                <Route path="/" element={<CarDealership/>}/>
            </Routes>
        </div>
    );
}

export default Body;



function RequireAuth({ children }) {

    const location = useLocation();
    const [change, setChange] = useState(false)

    return !localStorage.getItem("accessToken") ? (
        <Navigate to="/authPage" replace state={{ path: location.pathname }} />
    ) : (
        children
    );
}