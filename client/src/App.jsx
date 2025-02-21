import { FcGoogle } from "react-icons/fc";
import './App.css'
import TaskForm from "./components/TaskForm/TaskForm";
import Tasks from "./components/Tasks/Tasks";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function App() {
  const [newTask, setNewTask] = useState({})
  const [tasks, setTasks] = useState([])
  const { user, googleSignIn, loading, logOut } = useContext(AuthContext)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const result = await axios.get(`https://server-xi-red-55.vercel.app/tasks/${user.email}`);;
      return result.data
    },
  });

  const fetchAgain = () => {
    refetch();
    setNewTask({})
    setTasks(data)
  }

  useEffect(() => {
    setTasks(data)
  },[data])

  const setEditingTask = (task) => {
    setNewTask({ ...task, edit: true })
  }

  const login = async () => {
    try {
      const res = await googleSignIn();
      const email = res.user.email
      const displayName = res.user.displayName
      const data = await axios.post("http://localhost:3000/users", { email, displayName })
      console.log(data)
    } catch (err) {
      console.log(err)
    }

  }
 
  if (loading) return <h2>Loading....</h2>

  if (!user) {
    return (
      <div className='loginPage'>
        <h2>Login to Get Into!</h2>
       <button onClick={login}> <FcGoogle /> Sign In With Google</button>
      </div>
    )
  }
  return (
    <div>
      <div>
        <header className="bg-blue-500 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            {/* Title */}
            <h1 className="text-xl font-bold">My Dashboard</h1>

            {/* Logout Button */}
            <button
              onClick={logOut}
              className="bg-white text-blue-500 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </header>
        <TaskForm UpdateTask={{ ...newTask }} refetch={fetchAgain}/>
        <Tasks setEditingTask={setEditingTask} tasksAll={tasks}/>
      </div>
    </div>
  )
}

export default App
