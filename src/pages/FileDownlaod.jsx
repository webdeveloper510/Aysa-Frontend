import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import axios from "axios";

const FileDownload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [supportedFiles, setsupportedFiles] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/get-data-files`
        );
        setsupportedFiles(res?.data?.files || []);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    })();
  }, []);

  const handleDownload = async () => {
    if (!selectedFile) {
      alert("Please select a file to download.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(selectedFile.file_url, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", selectedFile.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert(`❌ Failed to download ${selectedFile.filename}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md hover:shadow-lg transition flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          File Download
        </h1>

        {/* Dropdown for selecting file */}
        <label className="text-gray-700 mb-2 font-medium">Select File</label>
        <select
          value={selectedFile?.filename || ""}
          onChange={(e) => {
            const fileObj = supportedFiles.find(
              (f) => f.filename === e.target.value
            );
            setSelectedFile(fileObj);
          }}
          className="mb-6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose File</option>
          {supportedFiles.map((file) => (
            <option key={file.filename} value={file.filename}>
              {file.filename}
            </option>
          ))}
        </select>

        <button
          onClick={handleDownload}
          disabled={loading || !selectedFile}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition mt-auto ${
            loading || !selectedFile
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Download className="w-5 h-5" />
          {loading ? "Downloading..." : "Download CSV"}
        </button>
      </div>
    </div>
  );
};

export default FileDownload;
