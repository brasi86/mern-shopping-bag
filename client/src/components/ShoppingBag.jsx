import { Alert, Button, Table, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { RiCheckboxCircleFill } from "react-icons/ri";
import moment from "moment";
import "moment/locale/it";

export default function ShoppingBag() {
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState(null);
  const [allTasks, setAllTasks] = useState(null);
  const [totaleTasks, setTotaleAllTasks] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [prevValue, setPrevValue] = useState("");
  const [prevTasks, setPrevTasks] = useState([]);

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
      const res = await fetch(
        `/api/task/addtask?userId=${currentUser._id}&nucleo=${currentUser.nucleo}`,
        {
          method: "POST",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setAllTasks([data, ...allTasks]);
      setTotaleAllTasks((prev) => prev + 1);
      setPrevTasks([data, ...allTasks]);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/task/gettasks?userId=${currentUser._id}&nucleo=${currentUser.nucleo}`
        );

        const data = await res.json();

        if (res.ok) {
          setAllTasks(data.allTasks);
          setPrevTasks(data.allTasks);
          setTotaleAllTasks(data.totalTasks);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    moment.locale("it");
  }, [currentUser._id, currentUser.nucleo]);

  const handleDelete = async (task) => {
    try {
      await fetch(
        `/api/task/deleteTasks?userId=${currentUser._id}&nucleo=${currentUser.nucleo}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify(task),
        }
      );

      setAllTasks(allTasks.filter((t) => t !== task));
      setPrevTasks(allTasks.filter((t) => t !== task));
      setTotaleAllTasks((prev) => prev - 1);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (task, index) => {
    setEditedValue(task.task);
    setEditingRow(index);
    setPrevValue(task.task);
  };

  const handleInputChange = (e) => {
    setEditedValue(e.target.value);
  };

  const handleSaveUpdateTask = async () => {
    const updatedTasks = [...allTasks];
    updatedTasks[editingRow].task = editedValue;

    try {
      const res = await fetch(
        `/api/task/updateTasks?userId=${currentUser._id}&nucleo=${currentUser.nucleo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify(updatedTasks[editingRow]),
        }
      );

      const data = await res.json();

      if (data.success === false) {
        if (prevValue === editedValue) {
          return setEditingRow(null);
        }
        updatedTasks[editingRow].task = prevValue;
        return setErrorMessage(data.message);
      }

      setAllTasks(updatedTasks);
      setEditingRow(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCompleteTask = async (index) => {
    const toggleComplete = [...allTasks];

    const res = await fetch(
      `/api/task/completeTasks?userId=${currentUser._id}&nucleo=${currentUser.nucleo}`,
      {
        method: "PUT",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(toggleComplete[index]),
      }
    );

    const data = await res.json();

    if (data.success === false) {
      return setErrorMessage(data.message);
    }

    toggleComplete[index] = {
      ...toggleComplete[index],
      complete: !toggleComplete[index].complete,
    };

    setAllTasks(toggleComplete);
    setPrevTasks(toggleComplete);
  };

  const handleCloseEdit = () => {
    if (errorMessage) {
      setErrorMessage(null);
      setEditingRow(null);
      setEditedValue(prevValue);
    }

    setEditingRow(null);
  };

  const filterTask = async (e) => {
    const datatype = e.currentTarget.dataset.type;

    switch (datatype) {
      case "complete":
        setAllTasks(prevTasks.filter((prev) => prev.complete));
        break;
      case "uncomplete":
        setAllTasks(prevTasks.filter((prev) => !prev.complete));
        break;
      default:
        setAllTasks(prevTasks.filter((prev) => prev));
        break;
    }
  };

  const closeList = () => {
    console.log("close");
  };

  return (
    <div className="px-4 space-y-5 max-w-4xl mx-auto ">
      <h2 className="text-center text-3xl mb-4">Shopping Bag</h2>
      <form onSubmit={handleSubmit} className="flex max-w-lg mx-auto gap-2">
        <TextInput
          onChange={handleChange}
          className="w-full"
          placeholder="Inserisci Articolo"
        />
        <Button type="submit">Aggiungi</Button>
      </form>
      {errorMessage && (
        <Alert className="mt-2  mx-auto" color="failure">
          {errorMessage}
        </Alert>
      )}
      <div className="flex justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          Tot. Articoli:
          <span className="border px-3 py-1">{totaleTasks && totaleTasks}</span>
        </div>
        <div className="flex gap-2 mx-auto md:mx-0">
          <Button
            data-type="complete"
            onClick={filterTask}
            type="button"
            className=""
            color="green"
          >
            Complete ({prevTasks?.filter((task) => task.complete).length})
          </Button>
          <Button
            data-type="uncomplete"
            onClick={filterTask}
            type="button"
            color="red"
            className="w-fit"
          >
            Non complete ({prevTasks?.filter((task) => !task.complete).length})
          </Button>
          <Button
            data-type="all"
            onClick={filterTask}
            type="button"
            color="blue"
          >
            Tutte
          </Button>
        </div>
      </div>
      <div className="table-auto overflow-x-scroll p-1 scrollbar ">
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
                  <Table.Row
                    className={
                      task.complete
                        ? "bg-green-400 text-black hover:bg-green-400 dark:hover:bg-green-400"
                        : ""
                    }
                  >
                    <Table.Cell>{moment(task.createdAt).fromNow()}</Table.Cell>
                    {editingRow === index ? (
                      <Table.Cell className=" font-bold">
                        <TextInput
                          type="text"
                          value={editedValue}
                          onChange={handleInputChange}
                        />
                      </Table.Cell>
                    ) : (
                      <Table.Cell className=" font-bold">
                        {task.task}
                      </Table.Cell>
                    )}

                    <Table.Cell onClick={() => handleCompleteTask(index)}>
                      {task.complete ? (
                        <RiCheckboxCircleFill className=" text-green-800 w-5 h-5 mx-auto" />
                      ) : (
                        <IoCloseCircle className=" text-red-600 w-5 h-5 mx-auto" />
                      )}
                    </Table.Cell>

                    {editingRow === index ? (
                      <Table.Cell className="cursor-pointer flex gap-2 justify-center">
                        <Button onClick={handleSaveUpdateTask}>
                          <TiTick />
                        </Button>
                        <Button onClick={() => handleCloseEdit(task)}>
                          <IoMdClose />
                        </Button>
                      </Table.Cell>
                    ) : (
                      <Table.Cell
                        className="cursor-pointer"
                        onClick={() => handleEdit(task, index)}
                      >
                        <FaRegEdit className="w-5 h-5 mx-auto" />
                      </Table.Cell>
                    )}

                    <Table.Cell
                      className=" cursor-pointer"
                      onClick={() => handleDelete(task)}
                    >
                      <MdDeleteForever className="w-5 h-5 flex mx-auto text-red-600" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            <div className="mt-5 flex items-center justify-end">
              <div className="flex items-center gap-6">
                <p className="ml-auto">Hai concluso la spesa?</p>
                <Button
                  onClick={closeList}
                  gradientDuoTone="greenToBlue"
                  className="ml-auto"
                >
                  Chiudi lista
                </Button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center">Non hai inserito alcun articolo</p>
        )}
      </div>
    </div>
  );
}
