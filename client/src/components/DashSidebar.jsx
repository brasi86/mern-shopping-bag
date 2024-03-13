import { Sidebar } from "flowbite-react";
import { HiUser } from "react-icons/hi";
import { CiLogout } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutSucces } from "../redux/user/userSlice";
import { MdDashboard } from "react-icons/md";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/user/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(logoutSucces(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full">
      <Sidebar.ItemGroup className="">
        <Link to="/dashboard?tab=dash">
          <Sidebar.Item as="div" active={tab === "dash"} icon={MdDashboard}>
            Dashboard
          </Sidebar.Item>
        </Link>
        <Link to="/dashboard?tab=shoppingbag">
          <Sidebar.Item
            as="div"
            active={tab === "shoppingbag"}
            icon={FaShoppingBag}
          >
            Shopping Bag
          </Sidebar.Item>
        </Link>
      </Sidebar.ItemGroup>
      <Sidebar.ItemGroup>
        <Link to="/dashboard?tab=profile">
          <Sidebar.Item as="div" active={tab === "profile"} icon={HiUser}>
            Profilo
          </Sidebar.Item>
        </Link>
        <Link onClick={handleLogout}>
          <Sidebar.Item as="div" icon={CiLogout}>
            Log Out
          </Sidebar.Item>
        </Link>
      </Sidebar.ItemGroup>
    </Sidebar>
  );
}
