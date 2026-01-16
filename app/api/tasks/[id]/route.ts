import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import { connectToDatabase } from '@/lib/db';
import { Task } from '@/lib/models/Task';
import { getAuthFromCookies } from '@/lib/authServer';

interface IParams {
  params: Promise<{ id: string }>;
}

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const GET = async (req: Request, { params }: IParams) => {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  const task = await Task.findOne({ _id: id, userId: auth.userId }).lean();
  if (!task) {
    return NextResponse.json({ error: 'task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
};

export const PATCH = async (req: Request, { params }: IParams) => {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  const body = await req.json();

  const updatedTask = await Task.findOneAndUpdate(
    { _id: id, userId: auth.userId },
    {
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.status && { status: body.status }),
      ...(body.priority && { priority: body.priority }),
      ...(body.tags && { tags: body.tags }),
    },
    { new: true },
  ).lean();

  if (!updatedTask) {
    return NextResponse.json({ error: 'task not found' }, { status: 404 });
  }

  return NextResponse.json(updatedTask);
};

export const DELETE = async (req: Request, { params }: IParams) => {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  const deletedTask = await Task.findOneAndDelete({
    _id: id,
    userId: auth.userId,
  }).lean();
  if (!deletedTask) {
    return NextResponse.json({ error: 'task not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
};
