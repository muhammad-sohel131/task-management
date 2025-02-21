import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../provider/AuthProvider";

const TaskForm = ({ UpdateTask, refetch }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState("To-Do");
  const [update, setUpdate] = useState(false)

  const {user} = useContext(AuthContext);
  

  // Sync state when UpdateTask changes
  useEffect(() => {
    if (UpdateTask.edit) {
      setTitle(UpdateTask.title || '');
      setDescription(UpdateTask.description || '');
      setCategory(UpdateTask.category || 'To-Do');
      console.log(UpdateTask)
      console.log("use")
      setUpdate(true)
    }else{
      setUpdate(false)
    }
  }, [UpdateTask]); 

  const addTask = async (task) => {
    try {
      const response = await axios.post("https://server-xi-red-55.vercel.app/tasks", task);
      console.log("Task added successfully:", response.data);
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error.message);
    }
  };

  const updateTask = async (task) => {
    try {
      const response = await axios.put(`https://server-xi-red-55.vercel.app/tasks/${UpdateTask._id}`, task);
      console.log("Task Updated successfully:", response.data);
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const newTask = { title, description, category, authEmail: user.email };

    if(update){
        await updateTask({...newTask});
        setUpdate(false)
    }else {
        await addTask(newTask)
    }
    setTitle("");
    setDescription("");
    setCategory("To-Do");

    refetch()
    setUpdate(false)
    console.log(UpdateTask)
    console.log(update)
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {update ? "Edit Task" : "Add Task"}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            maxLength={50}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            maxLength={200}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          {update ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm; 