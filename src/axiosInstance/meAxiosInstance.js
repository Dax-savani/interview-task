import axios from "axios";

const meInstance = axios.create({
    baseURL: "https://interview-task-be-u1e1.onrender.com/v1",
    headers: {
        "Content-Type": "application/json",
    },
});
meInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user")); // Adjust as needed
        const token = user?.token?.refreshToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default meInstance;