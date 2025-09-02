import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
            } else {
                setIsAuthenticated(true);

                try {

                    const res = await axios.get("https://api.the-aysa.com/auth-check", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (res.status === 202) {
                        setIsLoading(false);
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem("token");
                        navigate("/login", { replace: true });
                    }


                } catch (error) {
                    alert("something is up with server")
                    localStorage.removeItem("token");

                }
            }
        }

        checkAuth()
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center">
                    {/* Spinner */}
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-700 text-lg font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {isAuthenticated ? <Outlet /> : <Navigate to={"/login"} replace />}
        </div>
    );
};

export default ProtectedRoutes;
