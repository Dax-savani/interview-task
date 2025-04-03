import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://interview-task-be-u1e1.onrender.com/v1",
    headers: {
        "Content-Type": "application/json",
    },
});


const refreshAccessToken = async () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const refreshToken = user?.token?.refreshToken;

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const res = await axios.post("/auth/refresh", { refreshToken });

        if (res.status === 200) {
            const newUser = { ...user, token: res.data };
            localStorage.setItem("user", JSON.stringify(newUser));
            return res.data.accessToken;
        }
    } catch (error) {
        console.error("Token refresh failed", error);
        localStorage.removeItem("user");
        window.location.href = "/login";
        return null;
    }
};


axiosInstance.interceptors.request.use(
    async (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const accessToken = user?.token?.accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data?.message === "Invalid token" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
