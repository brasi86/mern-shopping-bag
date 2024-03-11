import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  SignInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      formData.email === "" ||
      formData.password === ""
    ) {
      return dispatch(signInFailure("Inserisci tutti i campi"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        navigate("/");
        dispatch(SignInSuccess(data));
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
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
            La tua shopping bag online. Entra con le tue credenziali o con
            Google.
          </p>
        </div>
        <div className="right-side | flex-1">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-sm mx-auto"
          >
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
            <Button type="submit" gradientDuoTone="purpleToBlue">
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className=" pl-3">Attendi...</span>
                </>
              ) : (
                "Entra"
              )}
            </Button>
            <OAuth />
          </form>
          <div className=" flex gap-2 text-sm mt-5 justify-center">
            <span>Non hai un account?</span>
            <Link className=" text-blue-500" to="/sign-up">
              Registrati
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
