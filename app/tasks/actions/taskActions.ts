'use server';

import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { Task } from '@/lib/models/Task';
import { getAuthFromCookies } from '@/lib/authServer';
import type { ITaskDTO, TStatus, TPriority } from '@/lib/types/taskTypes';
import type { AuthTokenPayload } from '@/lib/auth';

type TaskPayload = {
  title: string;
  description: string;
  status: TStatus;
  priority: TPriority;
  tags: string[];
};

type TaskResult = { ok: true; task: ITaskDTO } | { ok: false; error: string };
type DeleteResult = { ok: true } | { ok: false; error: string };

const toTaskDto = (task: {
  _id: mongoose.Types.ObjectId | string;
  title: string;
  description?: string | null;
  status: TStatus;
  priority: TPriority;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}): ITaskDTO => ({
  _id: task._id.toString(),
  title: task.title,
  description: task.description ?? '',
  status: task.status,
  priority: task.priority,
  tags: task.tags ?? [],
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});

const requireAuth = async (): Promise<
  { ok: false; error: string } | AuthTokenPayload
> => {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return { ok: false, error: 'unauthorized' };
  }
  return auth;
};

const createTaskAction = async (payload: TaskPayload): Promise<TaskResult> => {
  const auth = await requireAuth();

  if ('ok' in auth) {
    const authErrorObject = auth;
    return authErrorObject;
  }

  await connectToDatabase();

  const title = String(payload.title ?? '').trim();
  if (!title) {
    return { ok: false, error: 'title is required' };
  }

  const task = await Task.create({
    title,
    description: payload.description ?? '',
    status: payload.status ?? 'BACKLOG',
    priority: payload.priority ?? 'MEDIUM',
    tags: payload.tags ?? [],
    userId: auth.userId,
  });

  return { ok: true, task: toTaskDto(task) };
};

const updateTaskAction = async (
  id: string,
  payload: TaskPayload,
): Promise<TaskResult> => {
  const auth = await requireAuth();

  if ('ok' in auth) {
    const authErrorObject = auth;
    return authErrorObject;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, error: 'invalid id' };
  }

  await connectToDatabase();

  const updates: Partial<TaskPayload> = {
    ...(payload.title && { title: payload.title.trim() }),
    ...(payload.description !== undefined && {
      description: payload.description,
    }),
    ...(payload.status && { status: payload.status }),
    ...(payload.priority && { priority: payload.priority }),
    ...(payload.tags && { tags: payload.tags }),
  };

  const updatedTask = await Task.findOneAndUpdate(
    { _id: id, userId: auth.userId },
    updates,
    { new: true },
  );

  if (!updatedTask) {
    return { ok: false, error: 'task not found' };
  }

  return { ok: true, task: toTaskDto(updatedTask) };
};

export const deleteTaskAction = async (id: string): Promise<DeleteResult> => {
  const auth = await requireAuth();

  if ('ok' in auth) {
    const authErrorObject = auth;
    return authErrorObject;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, error: 'invalid id' };
  }

  await connectToDatabase();

  const deletedTask = await Task.findOneAndDelete({
    _id: id,
    userId: auth.userId,
  });
  if (!deletedTask) {
    return { ok: false, error: 'task not found' };
  }

  return { ok: true };
};

type TaskActionState =
  | { ok: true; task: ITaskDTO }
  | { ok: false; error: string };

const parseTaskFormData = (formData: FormData) => {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();

  const status = String(formData.get('status') ?? 'BACKLOG') as TStatus;
  const priority = String(formData.get('priority') ?? 'MEDIUM') as TPriority;

  const tagsRaw = String(formData.get('tags') ?? '');
  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return { title, description, status, priority, tags };
};

export const createTaskFormAction = async (
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> => {
  const payload = parseTaskFormData(formData);
  return createTaskAction(payload);
};

export const updateTaskFormAction = async (
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> => {
  const id = String(formData.get('id') ?? '');
  const payload = parseTaskFormData(formData);
  return updateTaskAction(id, payload);
};
