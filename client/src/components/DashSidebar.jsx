import { Sidebar } from "flowbite-react";
import { HiUser } from "react-icons/hi";
import { CiLogout } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";

export default function DashSidebar() {
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
    <Sidebar className="w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup className=" space-y-2">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item as="div" active={tab === "profile"} icon={HiUser}>
              Profilo
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
          <Sidebar.Item icon={CiLogout}>Log Out</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
