import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onEdit, onDelete }) => {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id ?? task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};

export default TaskList;
