import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";

export const UserContext = createContext()
const localStorData = JSON.parse(localStorage.getItem("user"));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <UserContext.Provider value={localStorData}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </UserContext.Provider>
    </React.StrictMode>
);

