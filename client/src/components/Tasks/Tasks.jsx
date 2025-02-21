import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../provider/AuthProvider";
import "./Tasks.css";
import DropArea from "../DropArea/DropArea";

const Tasks = ({ setEditingTask, tasksAll }) => {
    const [tasks, setTasks] = useState([]);
    const { user } = useContext(AuthContext);
    const [activeCard, setActiveCard] = useState(null);

    useEffect(() => {
        if(tasksAll){
            setTasks(tasksAll)
        }
    }, [tasksAll])

    const onDrop = async (status, targetId) => {
        if (activeCard === null || activeCard === undefined) return;
    
        const taskToMoveIndex = tasks.findIndex((task) => task._id === activeCard);
        let targetIndex = targetId === 0 ? -1 : tasks.findIndex((task) => task._id === targetId);
    
        if (taskToMoveIndex > targetIndex) {
            targetIndex += 1;
        }
    
        console.log(taskToMoveIndex, targetIndex)
        let updatedTasks = [...tasks];
    
        const [movedTask] = updatedTasks.splice(taskToMoveIndex, 1);
        movedTask.category = status;
    
        updatedTasks.splice(targetIndex, 0, movedTask);
    
        updatedTasks = updatedTasks.map((task, index) => ({ ...task, order: index }));
    
        setTasks([...updatedTasks]);
    
        try {
            await axios.put("https://server-xi-red-55.vercel.app/reorder", {
                email: user.email,
                reorderedTasks: updatedTasks,
            });
        } catch (error) {
            console.error("Error saving new order:", error.response?.data || error);
        }
    };
    

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://server-xi-red-55.vercel.app/tasks/${id}`);
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };



      const handleEdit = (task) => {
        setEditingTask(task);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {["To-Do", "In Progress", "Done"].map((category) => (
                    <div key={category} className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[200px]">
                        <h3 className="text-xl font-bold mb-2 text-center">{category}</h3>
                        <DropArea onDrop={() => onDrop(category, 0)} />
                        <ul>
                            {tasks.length > 0 && tasks
                                .filter((task) => task.category === category)
                                .map((task) => (
                                    <>
                                        <li key={task._id} draggable onDragStart={() => setActiveCard(task._id)}
                                            onDragEnd={() => setActiveCard(null)}
                                            className="bg-white p-3 rounded shadow mb-2 flex justify-between items-center task_card">
                                            <div>
                                                <h4 className="font-bold">{task.title}</h4>
                                                <p className="text-gray-600 text-sm">{task.description}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                                    onClick={() => handleEdit(task)}>
                                                    Edit
                                                </button>
                                                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                                                    onClick={() => handleDelete(task._id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                        <DropArea onDrop={() => onDrop(category, task._id)} />
                                    </>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Tasks;
