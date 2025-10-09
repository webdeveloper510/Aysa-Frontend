import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-center px-4">
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-4">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-400 mb-8 max-w-md">
        The page you’re looking for doesn’t exist or has been moved. Don’t worry
        — let’s get you back on track.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
