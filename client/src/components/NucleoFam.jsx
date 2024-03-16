import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";

export default function NucleoFam() {
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
  const [updateNucleoSuccess, setUpdateNucleoSuccess] = useState(null);
  const [usersNucleo, setUsersNucleo] = useState([]);
  const [infoNucleo, setInfoNucleo] = useState(currentUser.nucleo);
  const [loading, setLoading] = useState(false);

  /* const handleChange = (e) => {
    setFormData({
      ...formData,
      searchUser: e.target.value,
      userId: currentUser._id,
    });
  };

  const handleSubmit = async (e) => {
    setUpdateNucleoSuccess(null);
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
 */

  const copyToClipboard = () => {
    setErrorMessage(null);
    setInfoNucleo(infoNucleo);
    navigator.clipboard
      .writeText(infoNucleo)
      .then(() => {
        console.log("Testo copiato negli appunti: ", infoNucleo);
      })
      .catch((error) => {
        console.error(
          "Errore durante la copia del testo negli appunti: ",
          error
        );
        alert(
          "Si è verificato un errore durante la copia del testo negli appunti."
        );
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/user/getusers?nucleo=${currentUser.nucleo}`
        );
        const data = await res.json();

        if (res.ok) {
          setUsersNucleo(data.users);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser.nucleo]);

  const handleChangeNucleo = async (e) => {
    e.preventDefault();
    setInfoNucleo(e.target.value);
  };

  const handleNucleo = async (e) => {
    setErrorMessage(null);
    e.preventDefault();

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${infoNucleo}`, {
        method: "POST",
      });

      const data = await res.json();
      dispatch(updateSuccess(data));
      setUpdateNucleoSuccess("Aggiornato nucleo famigliare con successo.");

      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return setErrorMessage(data.message);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="text-center text-3xl mb-4">Nucleo famigliare</h2>

      <div className="flex justify-center gap-10 flex-wrap-reverse">
        {/* <form
          onSubmit={handleSubmit}
          className="flex gap-2 w-full md:max-w-md lg:max-w-sm"
        >
          <TextInput
            onChange={handleChange}
            className=" w-full"
            placeholder="Cerca utente"
          />
          <Button type="submit">Cerca</Button>
        </form> */}
        <form
          onSubmit={handleNucleo}
          className="flex gap-2 w-full md:max-w-md lg:max-w-sm"
        >
          <TextInput
            onChange={handleChangeNucleo}
            className=" w-full"
            type="text"
            value={infoNucleo}
          />
          <Button type="submit">Salva</Button>
          <Button onClick={copyToClipboard} type="button">
            Copia
          </Button>
        </form>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner color="gray" className="w-12 h-12" />
        </div>
      ) : (
        <>
          {usersNucleo &&
            usersNucleo?.length > 0 &&
            usersNucleo.map((user, index) => (
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
                    Nome utente:{" "}
                    <span className="font-bold">
                      {currentUser.username === user.username
                        ? `${user.username} (Tuo profilo)`
                        : user.username}
                    </span>
                  </p>
                  <p className="font-normal">Email: {user.email}</p>
                </div>

                <Button>Rimuovi</Button>
              </div>
            ))}
        </>
      )}

      {errorMessage && (
        <Alert color="failure" className="mt-5 max-w-xl mx-auto">
          {errorMessage}
        </Alert>
      )}
      {updateNucleoSuccess && (
        <Alert color="success" className="mt-5 max-w-xl mx-auto">
          {updateNucleoSuccess}
        </Alert>
      )}
    </div>
  );
}
