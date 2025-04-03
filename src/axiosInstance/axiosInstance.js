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
        let user = JSON.parse(localStorage.getItem("user"));
        let accessToken = user?.token?.accessToken;

        config.headers.Authorization = `Bearer ${accessToken}`;

        const tokenExpiry = user?.token?.expiresAt;
        const now = Date.now();

        if (tokenExpiry && now >= tokenExpiry) {
            accessToken = await refreshAccessToken();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
