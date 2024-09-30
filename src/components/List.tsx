import { useCallback, useEffect, useState } from "react";
import { TaskProps } from "../App";
import "../css/list.css";
import axios from "axios";

interface ListToDoProps {
  onEditTask: (task: TaskProps) => void;
}

const ListToDo = ({ onEditTask }: ListToDoProps): JSX.Element => {
  const [listTodo, setListTodo] = useState<TaskProps[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("https://todo-api-78c5.onrender.com/task");
        setListTodo(res.data.tasks);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTasks();
  }, []);

  const handleCheckChange = useCallback((id: string) => {
    setListTodo(prevList => {
      const updatedList = prevList.map(task => {
        if (task._id === id) {
          const updatedTask = { ...task, checked: !task.checked };
          axios
            .put(`https://todo-api-78c5.onrender.com/task/${id}`, {
              checked: updatedTask.checked,
            })
            .then(res => {
              console.log(res.data.message);
            })
            .catch(err => console.log(err));
          return updatedTask;
        }
        return task;
      });
      return updatedList;
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    axios
      .delete(`https://todo-api-78c5.onrender.com/task/${id}`)
      .then(res => {
        alert(res.data.message);
        setListTodo(prevList => prevList.filter(task => task._id !== id));
      })
      .catch(err => console.log(err));
  }, []);

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
        {listTodo.map(task => {
          return (
            <tr key={task._id}>
              <td className="checkbox">
                <input
                  type="checkbox"
                  checked={task.checked}
                  onChange={() => handleCheckChange(task._id)}
                />
              </td>
              <td className="description">{task.description}</td>
              <td className="actions">
                <button
                  className="button-edit"
                  onClick={() => onEditTask(task)}
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
          );
        })}
      </tbody>
    </table>
  );
};

export default ListToDo;
