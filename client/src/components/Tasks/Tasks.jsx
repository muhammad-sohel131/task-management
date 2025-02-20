import { useState } from "react";

const Tasks = () => {
    const [tasks, setTasks] = useState([])
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {['To-Do', 'In Progress', 'Done'].map((category) => (
          <div key={category} className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2 text-center">{category}</h3>
            <ul>
              {tasks.length > 0 && tasks.filter(task => task.category === category).map((task, index) => (
                <li key={index} className="bg-white p-3 rounded shadow mb-2">
                  <h4 className="font-bold">{task.title}</h4>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
