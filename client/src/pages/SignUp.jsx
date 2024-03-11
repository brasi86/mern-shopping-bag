import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Inserisci tutti i campi.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }

      if (res.ok) {
        navigate("/sign-in");
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 mb-10 flex-1">
      <div className="wrapper | px-4 max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-6">
        <div className="left-side | flex-1  text-center md:text-left">
          <Link to="/" className="text-4xl font-semibold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-lg text-white">
              Shopping
            </span>
            Bag
          </Link>
          <p className="text-center md:text-left mt-6">
            La tua shopping bag online. Puoi registrarti con la tua mail e
            password oppure con Google.
          </p>
        </div>
        <div className="right-side | flex-1">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-sm mx-auto"
          >
            <div className="username | space-y-1">
              <Label value="Nome utente" />
              <TextInput
                onChange={handleChange}
                type="text"
                placeholder="Inserisci il tuo nome utente"
                id="username"
              />
            </div>
            <div className="email | space-y-1">
              <Label value="Email" />
              <TextInput
                onChange={handleChange}
                type="email"
                placeholder="Inserisci la tua mail"
                id="email"
              />
            </div>
            <div className="password | space-y-1">
              <Label value="Password" />
              <TextInput
                onChange={handleChange}
                type="password"
                placeholder="Inserisci la tua password"
                id="password"
              />
            </div>
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className=" pl-3">Attendi...</span>
                </>
              ) : (
                "Registrati"
              )}
            </Button>
            <OAuth />
          </form>
          <div className=" flex gap-2 text-sm mt-5 justify-center">
            <span>Hai già un account?</span>
            <Link className=" text-blue-500" to="/sign-in">
              Log In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5 max-w-sm mx-auto border" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
