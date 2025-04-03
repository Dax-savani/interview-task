import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://interview-task-be-u1e1.onrender.com/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the token dynamically
axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user")); // Adjust as needed
        const token = user?.token?.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;

