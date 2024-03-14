import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import ShoppingBag from "../components/ShoppingBag";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <div className="left-side md:min-w-56">
        <DashSidebar />
      </div>
      <div className="right-side w-full dark:bg-[#1e1e1e]">
        <div className=" px-4 py-6 ">
          {tab === "profile" && <DashProfile />}
          {tab === "shoppingbag" && <ShoppingBag />}
        </div>
      </div>
    </div>
  );
}
