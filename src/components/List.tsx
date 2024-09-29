import { useEffect, useState } from "react";
import { TaskProps } from "../App";
import "../css/list.css";
import axios from "axios";

interface ListToDoProps {
  onEditTask: (task: TaskProps) => void; // prop para comunicar a tarefa que será editada
}

const ListToDo = ({ onEditTask }: ListToDoProps): JSX.Element => {
  const [listTodo, setListTodo] = useState<TaskProps[]>([]);

  useEffect(() => {
    axios.get("https://todo-api-78c5.onrender.com/task").then(
      res => {
        setListTodo(res.data.tasks);
      },
      error => {
        console.log(error);
      }
    );
  }, [listTodo]);

  function handleCheckChange(id: string) {
    const updatedList = listTodo.map(task =>
      task._id === id ? { ...task, check: !task.check } : task
    );
    setListTodo(updatedList);
  }

  function handleDelete(id: string) {
    axios.delete(`https://todo-api-78c5.onrender.com/task/${id}`).then(
      res => {
        alert(res.data.message);
        listTodo.filter(item => item._id !== id);
      },
      error => {
        console.log(error);
      }
    );
    const updatedList = listTodo.filter(task => task._id !== id);
    setListTodo(updatedList);
  }

  return (
    <table className="table-list">
      <thead>
        <tr>
          <th className="checkbox">Check</th>
          <th className="description">Task</th>
          <th className="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        {listTodo.map(task => (
          <tr key={task._id}>
            <td className="checkbox">
              <input
                type="checkbox"
                checked={task.check}
                onChange={() => handleCheckChange(task._id)}
              />
            </td>
            <td className="description">{task.description}</td>
            <td className="actions">
              <button
                className="button-edit"
                onClick={() => onEditTask(task)} // Passa a tarefa a ser editada para o componente pai
              >
                Edit
              </button>
              <button
                className="button-delete"
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListToDo;
