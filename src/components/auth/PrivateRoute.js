import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
    const localStorData = JSON.parse(localStorage.getItem("user"));
    let [isauthentication, setIsAuthentication] = useState(localStorData && localStorData.email ? true : false);


    return <>{isauthentication ? <Outlet /> : <Navigate to="/sign-in" />}</>;
}

export default PrivateRoute;
