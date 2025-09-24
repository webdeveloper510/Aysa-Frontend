import React from "react";
import { Download, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const FileManipulation = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        File Manipulation
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1 - Download Files */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Download Files
            </h2>
            <p className="text-gray-600">
              Quickly download processed or stored files directly to your
              device.
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Link to={"/dashboard/fileManipulation/download"}>
                {" "}
                Download Files
              </Link>
            </button>
          </div>
        </div>

        {/* Card 2 - Manipulate Uploaded Files */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Manipulate Uploaded Files
            </h2>
            <p className="text-gray-600">
              Upload your files and apply transformations like rename, parse, or
              restructure content.
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <Link to={"/dashboard/fileManipulation/upload"}>
                {" "}
                Upload & Manipulate
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManipulation;
