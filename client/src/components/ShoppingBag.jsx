import { Alert, Button, Table, TextInput } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";

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
      setAllTasks([...allTasks, data]);
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
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 max-w-lg mx-auto px-1"
      >
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
      <div className="table-auto overflow-x-scroll  max-w-4xl md:mx-auto scrollbar py-5 px-1">
        {allTasks && allTasks?.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head className="">
                <Table.HeadCell>Data</Table.HeadCell>
                <Table.HeadCell>Articolo</Table.HeadCell>
                <Table.HeadCell className="text-center">
                  Completato
                </Table.HeadCell>
                <Table.HeadCell className="text-center">
                  <span>Modifica</span>
                </Table.HeadCell>
                <Table.HeadCell className="text-center">Elimina</Table.HeadCell>
              </Table.Head>
              {allTasks.map((task, index) => (
                <Table.Body key={index}>
                  <Table.Row>
                    <Table.Cell>
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className=" font-bold">{task.task}</Table.Cell>
                    <Table.Cell>
                      <IoCloseCircle className=" text-red-600 w-5 h-5 mx-auto" />
                    </Table.Cell>
                    <Table.Cell>
                      <FaRegEdit className="w-5 h-5 mx-auto" />
                    </Table.Cell>
                    <Table.Cell>
                      <MdDeleteForever className="w-5 h-5 flex mx-auto" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </>
        ) : (
          <p>Non hai inserito alcun articolo</p>
        )}
      </div>
    </div>
  );
}
