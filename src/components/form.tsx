import { useState, useEffect } from "react";
import "../css/form.css";

import axios from "axios";
import { TaskProps } from "../App";

interface FormToDoProps {
  taskToEdit: TaskProps | null;
}

const FormToDo = ({ taskToEdit }: FormToDoProps): JSX.Element => {
  const [task, setTask] = useState<TaskProps | undefined>(undefined);

  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit);
    }
  }, [taskToEdit]);

  const handleAddTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setTask(prevTask => {
      if (prevTask) {
        return { ...prevTask, description: newValue };
      }

      return { description: newValue, checked: false, _id: "" };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task && task._id) {
      axios
        .put(`https://todo-api-78c5.onrender.com/task/${task?._id}`, {
          description: task?.description,
        })
        .then(res => {
          if (res.data.description) {
            alert(res.data.message);
            setTask(undefined);
            return;
          }
        })
        .catch(err => {
          console.error("Erro ao atualizar tarefa:", err);
        });
    } else {
      axios
        .post(`https://todo-api-78c5.onrender.com/task`, {
          description: task?.description,
        })
        .then(res => {
          if (res.data) {
            setTask(undefined);
            alert("Criado com sucesso");
            return;
          }
        });
    }
    if (task?._id) {
      localStorage.setItem("task", JSON.stringify(task));
    } else {
      console.log("Nenhuma tarefa definida");
    }
  };
  const clearTask = () => {
    localStorage.removeItem("task");
    setTask(undefined);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task"
        onChange={handleAddTask}
        value={task?.description ?? ""}
      />
      <button type="submit">{task?._id ? "Editar" : "Criar"}</button>
      {task && (
        <button type="button" onClick={clearTask}>
          Limpar
        </button>
      )}
    </form>
  );
};

export default FormToDo;
