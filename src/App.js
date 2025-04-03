import React, {useContext, useEffect} from 'react';
import {Navigate, Routes, Route} from "react-router-dom";
import SignIn from "./pages/sign-in/SignIn";
import SignUp from "./pages/sign-up/SIgnUp";
import Home from "./pages/home/Home";
import PrivateRoute from "./components/auth/PrivateRoute";
import {Toaster} from "react-hot-toast";
import AdminPrivateRoute from "./components/auth/AdminPrivateRoute";
import Admin from "./pages/admin/Admin";
import {UserContext} from "./index";
import axios from "axios";

function App(props) {
    const user = useContext(UserContext)
    const me = async () => {
        try {

            const res = await axios.post(`https://interview-task-be-u1e1.onrender.com/v1/auth/refresh`, {refreshToken: user?.token?.refreshToken})
            if (res.status == 200) {
                const newTokens = { ...user, token: res.data };
                localStorage.setItem("user", JSON.stringify(newTokens))
                console.log(res.data)
            }
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        if (user?.email) {
            me()
        }
    }, []);
    return (
        <>
            <Toaster position="top-center" reverseOrder={false}/>
            <Routes>
                <Route path="/sign-in" element={<SignIn/>}/>
                <Route path="/sign-up" element={<SignUp/>}/>
                <Route element={<PrivateRoute/>}>
                    <Route
                        path="/"
                        element={
                            <Home/>
                        }
                    />
                </Route>
                <Route element={<AdminPrivateRoute/>}>
                    <Route
                        path="/admin"
                        element={
                            <Admin/>
                        }
                    />
                </Route>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </>
    );
}

export default App;