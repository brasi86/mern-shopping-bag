import { Button, Table, TextInput } from "flowbite-react";
import PropTypes from "prop-types";

import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { RiCheckboxCircleFill } from "react-icons/ri";
import ReactTimeAgo from "react-time-ago";

export default function TasksTable({
  tasks,
  filter,
  editing,
  inputChange,
  complete,
  update,
  deleted,
  edit,
  closeEdit,
  editValue,
  updatePiece,
}) {
  return (
    <div className="table-auto overflow-x-scroll p-1 scrollbar ">
      {tasks && tasks?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Data</Table.HeadCell>
              <Table.HeadCell>Articolo</Table.HeadCell>
              <Table.HeadCell>Num. Pezzi</Table.HeadCell>
              <Table.HeadCell className="text-center">
                Completato
              </Table.HeadCell>
              <Table.HeadCell className="text-center">
                <span>Modifica</span>
              </Table.HeadCell>
              <Table.HeadCell className="text-center">Elimina</Table.HeadCell>
            </Table.Head>
            {tasks
              .filter((task) => {
                if (filter === "complete") {
                  return task.complete;
                } else if (filter === "incomplete") {
                  return !task.complete;
                } else {
                  return true;
                }
              })
              .map((task, index) => (
                <Table.Body key={index}>
                  <Table.Row
                    className={
                      task.complete
                        ? "bg-green-400 text-black hover:bg-green-400 dark:hover:bg-green-400"
                        : ""
                    }
                  >
                    <Table.Cell className=" min-w-32">
                      <ReactTimeAgo date={Date.parse(task.createdAt)} />
                    </Table.Cell>
                    {editing === index ? (
                      <Table.Cell className=" font-bold">
                        <TextInput
                          type="text"
                          value={editValue}
                          onChange={inputChange}
                        />
                      </Table.Cell>
                    ) : (
                      <Table.Cell className=" font-bold">
                        {task.task}
                      </Table.Cell>
                    )}

                    <Table.Cell>
                      <TextInput
                        value={task.pezzi}
                        className="w-12"
                        onChange={(e) => updatePiece(e, task._id)}
                      />
                    </Table.Cell>

                    <Table.Cell onClick={() => complete(task)}>
                      {task.complete ? (
                        <RiCheckboxCircleFill className=" text-green-800 w-5 h-5 mx-auto" />
                      ) : (
                        <IoCloseCircle className=" text-red-600 w-5 h-5 mx-auto" />
                      )}
                    </Table.Cell>

                    {editing === index ? (
                      <Table.Cell className="cursor-pointer flex gap-2 justify-center">
                        <Button onClick={update}>
                          <TiTick />
                        </Button>
                        <Button onClick={() => closeEdit(task)}>
                          <IoMdClose />
                        </Button>
                      </Table.Cell>
                    ) : (
                      <Table.Cell
                        className="cursor-pointer"
                        onClick={() => edit(task, index)}
                      >
                        <FaRegEdit className="w-5 h-5 mx-auto" />
                      </Table.Cell>
                    )}

                    <Table.Cell
                      className=" cursor-pointer"
                      onClick={() => deleted(task)}
                    >
                      <MdDeleteForever className="w-5 h-5 flex mx-auto text-red-600" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </>
      ) : (
        <p className="text-center">
          Non hai inserito alcun articolo. Inserisci il tuo primo articolo.
        </p>
      )}
    </div>
  );
}

TasksTable.propTypes = {
  tasks: PropTypes.array,
  filter: PropTypes.string,
  editing: PropTypes.number,
  inputChange: PropTypes.func,
  complete: PropTypes.func,
  update: PropTypes.func,
  deleted: PropTypes.func,
  edit: PropTypes.func,
  closeEdit: PropTypes.func,
  editValue: PropTypes.string,
  updatePiece: PropTypes.func,
};
