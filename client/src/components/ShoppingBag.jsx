import {
  Alert,
  Button,
  Label,
  Modal,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdEuro } from "react-icons/md";
import { AiTwotoneEuro } from "react-icons/ai";
import { Link } from "react-router-dom";
import { SlLocationPin } from "react-icons/sl";
import TasksTable from "./TasksTable";
import { FaCartArrowDown } from "react-icons/fa";

export default function ShoppingBag() {
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [totaleTasks, setTotaleAllTasks] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [prevValue, setPrevValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formSpesa, setFormSpesa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState(null);
  const [alertCloseList, setAlertCloseList] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      task: e.target.value,
      userId: currentUser._id,
      pezzi: 1,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    e.target[0].value = "";

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
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/task/gettasks?userId=${currentUser._id}&nucleo=${currentUser.nucleo}`
        );

        const data = await res.json();

        if (res.ok) {
          setAllTasks(data.allTasks);
          setTotaleAllTasks(data.totalTasks);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
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
    setErrorMessage("");
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

  const updatePiece = async (e, taskId) => {
    const updatedTasks = allTasks?.map((t) =>
      t._id === taskId ? { ...t, pezzi: e.target.value } : t
    );

    if (updatedTasks.length > 0) {
      setAllTasks(updatedTasks);
    }

    const updatePiece = {
      _id: taskId,
      pezzi: e.target.value,
    };

    try {
      const res = await fetch(
        `/api/task/updateTasks?userId=${currentUser._id}&nucleo=${currentUser.nucleo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify(updatePiece),
        }
      );

      const data = await res.json();

      if (data.success === false) {
        return setErrorMessage(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCompleteTask = async (tasks) => {
    setErrorMessage("");

    const updatedTasks = allTasks.map((task) =>
      task._id === tasks._id ? { ...task, complete: !task.complete } : task
    );

    setAllTasks(updatedTasks);
    try {
      const res = await fetch(
        `/api/task/completeTasks?userId=${currentUser._id}&nucleo=${currentUser.nucleo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify(tasks),
        }
      );

      const data = await res.json();

      if (data.success === false) {
        return setErrorMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseEdit = () => {
    if (errorMessage) {
      setErrorMessage(null);
      setEditingRow(null);
      setEditedValue(prevValue);
    }

    setEditingRow(null);
  };

  const filterTask = (e) => {
    const datatype = e.currentTarget.dataset.type;

    switch (datatype) {
      case "complete":
        setFilterType("complete");
        break;
      case "uncomplete":
        setFilterType("incomplete");
        break;
      default:
        setFilterType(null);
        break;
    }
  };

  const modalShow = () => {
    setError(false);
    setShowModal(true);
    setErrorMessage("");

    setFormSpesa({
      ...formSpesa,
      pezzi: allTasks?.filter((task) => task.complete).length,
    });

    if (allTasks.length === 0) {
      setErrorMessage("La lista della spesa è vuota.");
      return setShowModal(false);
    }

    if (allTasks?.filter((task) => task.complete).length === 0) {
      setErrorMessage("Nessun articolo nel carrello confermato.");
      return setShowModal(false);
    }
  };

  const closeList = async (e) => {
    e.preventDefault();

    if (allTasks.length === 0) {
      return;
    }

    try {
      const res = await fetch(
        `/api/spesa/addspesa?nucleo=${currentUser.nucleo}`,
        {
          method: "POST",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify(formSpesa),
        }
      );

      if (res.ok) {
        setAllTasks(allTasks.filter((t) => !t.complete));
        setAlertCloseList(true);
        setShowModal(false);
        setError(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <div className="px-4 space-y-5 max-w-4xl mx-auto ">
      <h2 className="text-center text-3xl mb-4">Carrello della spesa</h2>
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
            Complete ({allTasks?.filter((task) => task.complete).length})
          </Button>
          <Button
            data-type="uncomplete"
            onClick={filterTask}
            type="button"
            color="red"
            className="w-fit"
          >
            Non complete ({allTasks?.filter((task) => !task.complete).length})
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
      <TasksTable
        tasks={allTasks}
        filter={filterType}
        editing={editingRow}
        inputChange={handleInputChange}
        complete={handleCompleteTask}
        update={handleSaveUpdateTask}
        deleted={handleDelete}
        edit={handleEdit}
        closeEdit={handleCloseEdit}
        editValue={editedValue}
        updatePiece={updatePiece}
      />
      <div className="mt-5 flex items-center justify-end">
        <div className="flex items-center gap-6">
          <p className="ml-auto">Hai concluso la spesa?</p>
          <Button
            onClick={modalShow}
            gradientDuoTone="greenToBlue"
            className="ml-auto"
          >
            Chiudi lista
          </Button>
        </div>
      </div>
      {alertCloseList && (
        <Alert color="success">
          Spasa aggiunta alla lista delle spese.
          <Link to="/dashboard?tab=spese"> Vai alle spese</Link>
        </Alert>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header className="w-full mx-auto">
          <p className="">Chiudi Lista</p>
        </Modal.Header>
        <Modal.Body>
          <AiTwotoneEuro className=" w-16 h-16 mx-auto text-red-500 mb-5" />
          <div className=" text-center flex flex-col gap-4">
            <h3>Inserisci importo e luogo della tua spesa</h3>

            <form
              onSubmit={closeList}
              className="flex flex-col gap-4 text-left"
            >
              <div className="max-w-xs mx-auto">
                <Label>Num articoli nel carrello:</Label>
                <TextInput
                  value={allTasks?.filter((task) => task.complete).length}
                  rightIcon={FaCartArrowDown}
                  readOnly
                />
              </div>
              <div className="max-w-xs mx-auto">
                <Label>Importo:</Label>
                <TextInput
                  onChange={(e) =>
                    setFormSpesa({ ...formSpesa, importo: e.target.value })
                  }
                  rightIcon={MdEuro}
                />
              </div>
              <div className="max-w-xs mx-auto">
                <Label>Supermercato:</Label>
                <TextInput
                  onChange={(e) =>
                    setFormSpesa({ ...formSpesa, luogo: e.target.value })
                  }
                  className=" max-w-xs mx-auto"
                  rightIcon={SlLocationPin}
                />
              </div>
              <div className="flex gap-2 justify-center">
                <Button type="submit">Aggiungi alle spese</Button>
                <Button onClick={() => setShowModal(false)} color="success">
                  Torna indietro
                </Button>
              </div>
            </form>
          </div>
          {error && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
