import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

const Tasks = () => {
    const [tasks, setTasks] = useState([]);

    // Fetch tasks from API
    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:3000/tasks");
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks(); // Fetch initial tasks

        // Listen for real-time updates
        socket.on("task-updated", () => {
            fetchTasks(); // Refetch tasks when an update occurs
        });

        return () => {
            socket.off("task-updated"); // Cleanup on unmount
        };
    }, []);
    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {['To-Do', 'In Progress', 'Done'].map((category) => (
                    <div key={category} className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[200px]">
                    <h3 className="text-xl font-bold mb-2 text-center">{category}</h3>
                    <ul>
                        {tasks.length > 0 &&
                            tasks.filter(task => task.category === category).map(task => (
                                <li key={task._id} className="bg-white p-3 rounded shadow mb-2 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold">{task.title}</h4>
                                        <p className="text-gray-600 text-sm">{task.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                            onClick={() => handleEdit(task)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                                            onClick={() => handleDelete(task._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>                
                ))}
            </div>
        </div>
    );
};

export default Tasks;
