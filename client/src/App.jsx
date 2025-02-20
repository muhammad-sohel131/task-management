import { FcGoogle } from "react-icons/fc";
import './App.css'
import TaskForm from "./components/TaskForm/TaskForm";
import Tasks from "./components/Tasks/Tasks";
import { useContext, useState } from "react";
import { AuthContext } from "./provider/AuthProvider";

function App() {
  const [newTask, setNewTask] = useState({})
  const { user, googleSignIn, loading} = useContext(AuthContext)

  const setEditingTask = (task) => {
    setNewTask({...task, edit:true})
  }

  const login = async() => {
    const res = await googleSignIn();
    console.log(res);
  }

  if(loading) return <h2>Loading....</h2>

  if(!user) {
    return(
      <div className='loginPage'>
            <h2>Login to Get Into!</h2>
            <button onClick={login}> <FcGoogle /> Sign In With Google</button>
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
