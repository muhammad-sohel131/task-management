import { FcGoogle } from "react-icons/fc";
import './App.css'
import TaskForm from "./components/TaskForm/TaskForm";
import Tasks from "./components/Tasks/Tasks";

function App() {

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
        <TaskForm />
        <Tasks />
      </div>
    </div>
  )
}

export default App
