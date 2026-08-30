let tasks = [
  { id: 1, title: "Learn Express", description: "Week 1 task", completed: false },
  { id: 2, title: "Build CRUD", description: "For internship", completed: false }
];
let currentId = 3;

exports.getAllTasks = () => tasks;
exports.getTaskById = (id) => tasks.find(t => t.id === parseInt(id));
exports.createTask = (taskData) => {
  const newTask = { id: currentId++, completed: false, ...taskData };
  tasks.push(newTask);
  return newTask;
};
exports.updateTask = (id, data) => {
  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) return null;
  Object.assign(task, data);
  return task;
};
exports.deleteTask = (id) => {
  const index = tasks.findIndex(t => t.id === parseInt(id));
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
};