import { Button, TextInput } from "flowbite-react";

export default function NucleoFam() {
  return (
    <div>
      <h2 className="text-center text-3xl mb-4">Nucleo famigliare</h2>
      <form className="flex gap-2 max-w-lg mx-auto px-1">
        <TextInput className="flex-1" placeholder="Inserisci Articolo" />
        <Button type="submit">Aggiungi</Button>
      </form>
    </div>
  );
}
