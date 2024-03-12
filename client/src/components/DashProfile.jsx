import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg p-6 mx-auto w-full text-center">
      <h1 className=" my-7 text-4xl">Impostazioni profilo</h1>
      <form className="flex flex-col gap-4">
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
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Cambia password"
        />
        <Button
          className=" max-w-fit mx-auto"
          type="submit"
          gradientDuoTone="purpleToBlue"
        >
          Aggiorna dati
        </Button>
      </form>
    </div>
  );
}
