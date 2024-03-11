import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className=" min-h-screen mt-20">
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
            passaword oppure con Google.
          </p>
        </div>
        <div className="right-side | flex-1">
          <form className="flex flex-col gap-4 max-w-sm mx-auto">
            <div className="username | space-y-1">
              <Label value="Nome utente" />
              <TextInput
                type="text"
                placeholder="Inserisci il tuo nome utente"
                id="username"
              />
            </div>
            <div className="email | space-y-1">
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="Inserisci la tua mail"
                id="email"
              />
            </div>
            <div className="password | space-y-1">
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Inserisci la tua password"
                id="password"
              />
            </div>
            <Button gradientDuoTone="purpleToBlue">Registrati</Button>
          </form>
          <div className=" flex gap-2 text-sm mt-5 justify-center">
            <span>Hai già un account?</span>
            <Link className=" text-blue-500" to="/sign-in">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
