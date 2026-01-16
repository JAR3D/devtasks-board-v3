import { redirect } from 'next/navigation';

import { getAuthFromCookies } from '@/lib/authServer';
import TasksClient from './ui/TasksClient';
import { connectToDatabase } from '@/lib/db';
import { Task } from '@/lib/models/Task';

const TasksPage = async () => {
  const auth = await getAuthFromCookies();

  if (!auth) {
    redirect('/');
  }

  await connectToDatabase();

  const tasks = await Task.find({ userId: auth.userId })
    .sort({ createdAt: -1 })
    .lean();

  const safeTasks = tasks.map((task) => {
    return {
      _id: task._id.toString(),
      title: task.title,
      status: task.status,
      priority: task.priority,
      tags: task.tags,
      description: task.description ?? '',
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  });

  return <TasksClient initialTasks={safeTasks} />;
};

export default TasksPage;
