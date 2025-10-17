import axios from "axios";
import { useEffect, useState } from "react";

export function useCardscount() {
  const [totalVisitors, settotalVisitors] = useState(0);
  const [todaysVisitors, setTodaysVisitors] = useState(0);
  const [TodaysProfitSearch, setTodaysProfitSearch] = useState(0);
  const [TodaysTaxSearch, setTodaysTaxSearch] = useState(0);
  const [TodaysCeoSearch, setTodaysCeoSearch] = useState(0);
  const [TotalSearch, setTotalSearch] = useState(0);

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
        setTodaysVisitors(count.data.total_todays_visit_counts);
        settotalVisitors(count.data.total_visit_count);
        setTodaysProfitSearch(res?.data?.data?.profit?.search_count || 0);
        setTodaysTaxSearch(res?.data?.data?.tax?.search_count || 0);
        setTodaysCeoSearch(res?.data?.data["ceo-worker"]?.search_count || 0);
        setTotalSearch(
          (res?.data?.data?.profit?.search_count || 0) +
            (res?.data?.data?.tax?.search_count || 0) +
            (res?.data?.data["ceo-worker"]?.search_count || 0)
        );
      } catch (err) {
        console.error(err);
      }
    }

    getData();
  }, []);

  return {
    TodaysProfitSearch,
    TodaysTaxSearch,
    TodaysCeoSearch,
    todaysVisitors,
    totalVisitors,
    TotalSearch,
  };
}
