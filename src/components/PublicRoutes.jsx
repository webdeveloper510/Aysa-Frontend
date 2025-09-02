// import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoutes = () => {
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setisLoading(false);
            setisAuthenticated(false);
        } else {
            setisAuthenticated(true);
            setisLoading(false)
        }
    }, [])

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
        <div>{isAuthenticated ? <Navigate to={"/dashboard"} replace /> : <Outlet />}</div>
    )
}

export default PublicRoutes