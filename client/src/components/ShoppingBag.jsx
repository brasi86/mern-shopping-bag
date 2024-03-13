import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function ShoppingBag() {
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    setFormData({ ...formData, complete: false });

    e.preventDefault();
  };
  console.log(formData);

  return (
    <div>
      <h2 className="text-center text-3xl mb-4">Shopping Bag</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-lg mx-auto">
        <TextInput
          onChange={(e) => setFormData({ ...formData, task: e.target.value })}
          className="flex-1"
          placeholder="Inserisci Articolo"
        />
        <Button type="submit">Aggiungi</Button>
      </form>
    </div>
  );
}
