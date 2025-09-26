import { Link } from "react-router-dom";
import { Users, ShoppingCart } from "lucide-react";
import { useCardscount } from "../CustomHooks/useCardscount";

const DashBoard = () => {
  const { todaysSearchedProducts, todaysVisitors } = useCardscount();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Existing two cards */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Analyse Searched Data
          </h2>
          <p className="text-gray-600 mb-6">
            Get insights into the most recent search queries, track trends, and
            analyze user interactions effectively.
          </p>
          <Link
            to={"/dashboard/table"}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Analysis
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            File Handling
          </h2>
          <p className="text-gray-600 mb-6">
            Upload, manage, and download files seamlessly with our integrated
            file handling system.
          </p>
          <Link
            to={"/dashboard/fileManipulation"}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Manage Files
          </Link>
        </div>
      </div>

      {/* Today's Visitors & Today's Searched Products */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        {/* Today's Visitors */}
        <div className="w-40 h-40 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition text-white">
          <Users className="w-10 h-10 mb-2" />
          <p className="text-sm font-medium">Today's Visitors</p>
          <p className="text-2xl font-bold">{todaysVisitors}</p>
        </div>

        {/* Today's Searched Products */}
        <div className="w-40 h-40 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition text-white">
          <ShoppingCart className="w-10 h-10 mb-2" />
          <p className="text-sm font-medium">Today's Searched Products</p>
          <p className="text-2xl font-bold">{todaysSearchedProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
