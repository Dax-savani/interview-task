import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function AdminPrivateRoute() {
    const localStorData = JSON.parse(localStorage.getItem("user"));
    let [isauthentication, setIsAuthentication] = useState(localStorData && localStorData.role =="ADMIN" ? true : false);


    return <>{isauthentication ? <Outlet /> : <Navigate to="/sign-in" />}</>;
}

export default AdminPrivateRoute;
