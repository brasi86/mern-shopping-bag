import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashSpese() {
  const { currentUser } = useSelector((state) => state.user);
  const [spese, setSpese] = useState([]);

  useEffect(() => {
    const getSpese = async () => {
      const res = await fetch(
        `/api/spesa/getSpese?userId=${currentUser._id}&nucleo=${currentUser.nucleo}`
      );

      const data = await res.json();
      if (res.ok) {
        console.log(data);
      }
    };

    getSpese();
  }, [currentUser._id, currentUser.nucleo]);

  return <div>DashSpese</div>;
}
