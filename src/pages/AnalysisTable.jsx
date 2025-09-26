import axios from "axios";
import { useEffect, useState } from "react";

const AnalysisTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/count-value?date=${year}-${month}-${day}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }

    getData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="text-center py-3 px-4">Brand Name</th>
              <th className="text-center py-3 px-4">Name</th>
              <th className="text-center py-3 px-4">Tab Type</th>
              <th className="text-center py-3 px-4">Search Count</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-center">{item.brand_name}</td>
                  <td className="py-2 px-4 text-center">{item.product_name}</td>
                  <td className="py-2 px-4 text-center capitalize">
                    {item.tab_type}
                  </td>
                  <td className="py-2 px-4 text-center">{item.search_count}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisTable;
