import { FcGoogle } from "react-icons/fc";
import './App.css'
import TaskForm from "./components/TaskForm/TaskForm";
import Tasks from "./components/Tasks/Tasks";
import { useState } from "react";

function App() {
  const [newTask, setNewTask] = useState({})

  const setEditingTask = (task) => {
    setNewTask({...task, edit:true})
  }
  const user = true;
  if(!user) {
    return(
      <div className='loginPage'>
            <h2>Login to Get Into!</h2>
            <button> <FcGoogle /> Sign In With Google</button>
      </div>
    )
  }
  return (
    <div>
      <div>
        <TaskForm UpdateTask={{...newTask}} />
        <Tasks setEditingTask={setEditingTask} />
      </div>
    </div>
  )
}

export default App
