import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const FileUpload = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadCategories, setuploadCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/get-data-files`
        );
        setuploadCategories(res?.data?.files || []);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    })();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      toast.info("Please upload a valid CSV file.");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedCategory) {
      toast.info("Please select a file category.");
      return;
    }
    if (!selectedFile) {
      toast.info(`Please select a CSV file for ${selectedCategory}`);
      return;
    }

    const formData = new FormData();
    const tabType =
      selectedCategory === "profit_margin.csv"
        ? "profit"
        : selectedCategory === "Tax_Avoidance.csv"
        ? "tax"
        : selectedCategory === "Phone_Tablet.csv"
        ? "phone"
        : selectedCategory === "Website.csv"
        ? "desktop"
        : "";
    formData.append("tab_type", tabType);
    formData.append("file", selectedFile);

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/train-model`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("File uploaded successfully!");
      setSelectedFile(null);
      setSelectedCategory("");
    } catch (error) {
      toast.error("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md hover:shadow-lg transition flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          File Upload
        </h1>

        {/* Dropdown for selecting category */}
        <label className="text-gray-700 mb-2 font-medium">
          Select File Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Choose Category</option>
          {uploadCategories.map((category) => (
            <option key={category.filename} value={category.filename}>
              {category.filename.split(".")[0]}
            </option>
          ))}
        </select>

        {/* File input */}
        <label className="text-gray-700 mb-2 font-medium">
          Select CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mb-2 text-sm text-gray-600"
        />
        {selectedFile && (
          <p className="text-gray-600 mb-4">
            Selected File: {selectedFile.name}
          </p>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mt-auto ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Upload className="w-5 h-5" />
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
