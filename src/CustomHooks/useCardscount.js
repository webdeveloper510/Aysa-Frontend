import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useCardscount() {
  const [todaysVisitors, setTodaysVisitors] = useState(0);
  const [todaysSearchedProducts, setTodaysSearchedProducts] = useState(0);

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

        const today = new Date().toISOString().split("T")[0];

        const count = await axios.get(
          `${process.env.REACT_APP_API_URL}/get-visitor/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTodaysVisitors(count.data.total_visit_count);

        setTodaysSearchedProducts(res?.data?.data?.length || 0);
      } catch (err) {
        console.error(err);
      }

      try {
        const count = await axios.get(
          `${process.env.REACT_APP_API_URL}/get-visitor/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTodaysVisitors(count.data.total_visit_count);
      } catch (err) {
        console.error("Error fetching visitors:", err);
      }
    }

    getData();
  }, []);

  return { todaysSearchedProducts, todaysVisitors };
}
