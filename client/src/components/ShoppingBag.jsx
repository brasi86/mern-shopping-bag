import { Alert, Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function ShoppingBag() {
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState(null);
  const [allTasks, setAllTasks] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, task: e.target.value, userId: currentUser._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    e.target[0].value = "";
    setFormData({});

    if (!formData || !formData.task) {
      return setErrorMessage("Non hai inserito un articolo.");
    }

    try {
      const res = await fetch("/api/task/addtask", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        return setErrorMessage(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useState(() => {
    fetch(`/api/task/gettasks?userId=${currentUser._id}`)
      .then((response) => response.json())
      .then((data) => setAllTasks(data.allTasks))
      .catch((err) => console.log(err));
  }, [currentUser._id]);

  return (
    <div>
      <h2 className="text-center text-3xl mb-4">Shopping Bag</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-lg mx-auto">
        <TextInput
          onChange={handleChange}
          className="flex-1"
          placeholder="Inserisci Articolo"
        />
        <Button type="submit">Aggiungi</Button>
      </form>
      {errorMessage && (
        <Alert className="mt-2" color="failure">
          {errorMessage}
        </Alert>
      )}
      <div>
        <ul>
          {allTasks && allTasks?.length > 0
            ? allTasks.map((task, index) => <li key={index}> {task.task} </li>)
            : "Non hai inserito alcun articolo"}
        </ul>
      </div>
    </div>
  );
}
