import { useState } from "react";
import FormToDo from "./components/form";
import ListToDo from "./components/List";
import "./css/container.css";

export interface TaskProps {
  _id: string;
  description: string;
  check: boolean;
}

function App() {
  const [taskToEdit, setTaskToEdit] = useState<TaskProps | null>(null);
  return (
    <div className="container">
      <div className="card">
        <FormToDo taskToEdit={taskToEdit} />
        <ListToDo onEditTask={task => setTaskToEdit(task)} />
      </div>
    </div>
  );
}
export default App;
