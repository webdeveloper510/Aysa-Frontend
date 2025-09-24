import { Link } from "react-router-dom";

const DashBoard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1 - Analyse Searched Data */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Analyse Searched Data
          </h2>
          <p className="text-gray-600 mb-4">
            Get insights into the most recent search queries, track trends, and
            analyze user interactions effectively.
          </p>
          <Link
            to={"/dashboard/table"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Analysis
          </Link>
        </div>

        {/* Card 2 - File Handling */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            File Handling
          </h2>
          <p className="text-gray-600 mb-4">
            Upload, manage, and download files seamlessly with our integrated
            file handling system.
          </p>
          <Link
            to={"/dashboard/fileManipulation"}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Manage Files
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
