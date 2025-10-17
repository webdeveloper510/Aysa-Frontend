import { Link } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  Briefcase,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useCardscount } from "../CustomHooks/useCardscount";

const DashBoard = () => {
  const {
    TodaysProfitSearch,
    TodaysTaxSearch,
    TodaysCeoSearch,
    todaysVisitors,
    totalVisitors,
    TotalSearch,
  } = useCardscount();
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
      <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center items-center">
        {/* Total Visitors */}
        <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex flex-col items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 text-white">
          <Users className="w-10 h-10 mb-2 text-blue-100" />
          <p className="text-sm font-medium">Total Visitors</p>
          <p className="text-2xl font-bold">{totalVisitors}</p>
        </div>

        {/* Today's Visitors */}
        <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex flex-col items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 text-white">
          <Users className="w-10 h-10 mb-2 text-blue-100" />
          <p className="text-sm font-medium">Today's Visitors</p>
          <p className="text-2xl font-bold">{todaysVisitors}</p>
        </div>

        {/* Today's Profit Margin Search */}
        <div className="w-40 h-40 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex flex-col items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 text-white">
          <TrendingUp className="w-10 h-10 mb-2 text-emerald-100" />
          <p className="text-sm font-medium text-center px-2">
            Today's Profit Margin Search
          </p>
          <p className="text-2xl font-bold">{TodaysProfitSearch}</p>
        </div>

        {/* Today's Pay Gap Search */}
        <div className="w-40 h-40 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full flex flex-col items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 text-white">
          <Briefcase className="w-10 h-10 mb-2 text-amber-100" />
          <p className="text-sm font-medium text-center px-2">
            Today's Pay Gap Search
          </p>
          <p className="text-2xl font-bold">{TodaysCeoSearch}</p>
        </div>

        {/* Today's Tax Avoidance Search */}
        <div className="w-40 h-40 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex flex-col items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 text-white">
          <DollarSign className="w-10 h-10 mb-2 text-rose-100" />
          <p className="text-sm font-medium text-center px-2">
            Today's Tax Avoidance Search
          </p>
          <p className="text-2xl font-bold">{TodaysTaxSearch}</p>
        </div>

        {/* Today's Total Searches */}
        <div className="w-40 h-40 bg-gradient-to-br from-purple-400 to-violet-600 rounded-full flex flex-col items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 text-white">
          <ShoppingCart className="w-10 h-10 mb-2 text-purple-100" />
          <p className="text-sm font-medium text-center px-2">
            Today's Total Searches
          </p>
          <p className="text-2xl font-bold">{TotalSearch}</p>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
