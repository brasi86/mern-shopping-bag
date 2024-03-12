import { Alert, Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/userSlice";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdateUserSuccess(null);
    setUpdateUserError(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Non hai modificato nessun campo");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profilo aggiornato con successo");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  return (
    <div className="max-w-lg p-6 mx-auto w-full text-center">
      <h1 className=" my-7 text-4xl">Impostazioni profilo</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className=" w-32 h-32 self-center">
          <img
            className="rounded-full w-full object-cover"
            src={currentUser.profilePicture}
            alt="userPic"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Cambia password"
          onChange={handleChange}
        />
        <Button
          className=" max-w-fit mx-auto"
          type="submit"
          gradientDuoTone="purpleToBlue"
        >
          Aggiorna dati
        </Button>
        {updateUserSuccess && (
          <Alert color="success">{updateUserSuccess}</Alert>
        )}
        {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
      </form>
    </div>
  );
}
