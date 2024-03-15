import { Alert, Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function NucleoFam() {
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchUsers, setSearchUsers] = useState([]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      searchUser: e.target.value,
      userId: currentUser._id,
    });
  };

  const handleSubmit = async (e) => {
    setErrorMessage(null);
    e.preventDefault();

    if (!formData.searchUser || formData.searchUser === "") {
      return setErrorMessage("Non hai inserito alcun utente.");
    }

    try {
      const res = await fetch("/api/user/getusers", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setSearchUsers(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h2 className="text-center text-3xl mb-4">Nucleo famigliare</h2>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 max-w-lg mx-auto px-1"
      >
        <TextInput
          onChange={handleChange}
          className="flex-1"
          placeholder="Cerca utente"
        />
        <Button type="submit">Cerca</Button>
      </form>
      {searchUsers &&
        searchUsers?.length > 0 &&
        searchUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between max-w-lg mx-auto  mt-5"
          >
            <div className="hidden md:block ">
              <img
                className="w-24 h-24 rounded-full"
                src={user.profilePicture}
                alt="userimg"
              />
            </div>
            <div className="text">
              <p className="">
                Nome utente: <span className="font-bold">{user.username}</span>
              </p>
              <p className="font-normal">Email: {user.email}</p>
            </div>

            <Button>Aggiungi</Button>
          </div>
        ))}

      {errorMessage && (
        <Alert color="failure" className="mt-5">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}
