import React from 'react';
import {Navigate, Routes, Route} from "react-router-dom";
import SignIn from "../pages/sign-in/SignIn";
import SignUp from "../pages/sign-up/SIgnUp";
import Home from "../pages/home/Home";

const PrivateRoute = ({children}) => {
    const isAuthenticated = !!localStorage.getItem('authToken');
    return isAuthenticated ? children : <Navigate to="/signin" replace/>;
};

function App(props) {

    return (
        <>
            <Routes>
                <Route path="/sign-in" element={<SignIn/>}/>
                <Route path="/sign-up" element={<SignUp/>}/>
                <PrivateRoute>
                    <Route
                        path="/"
                        element={
                            <Home/>
                        }
                    />
                </PrivateRoute>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </>
    );
}

export default App;