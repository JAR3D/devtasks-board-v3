import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Task } from '@/lib/models/Task';
import mongoose from 'mongoose';

interface IParams {
  params: { id: string };
}

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const GET = async (req: Request, { params }: IParams) => {
  await connectToDatabase();
  const { id } = params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  const task = await Task.findById(id).lean();
  if (!task) {
    return NextResponse.json({ error: 'task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
};

export const PATCH = async (req: Request, { params }: IParams) => {
  await connectToDatabase();
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  const body = await req.json();

  const updatedTask = await Task.findByIdAndUpdate(
    id,
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
  await connectToDatabase();
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  const deletedTask = await Task.findByIdAndDelete(id).lean();
  if (!deletedTask) {
    return NextResponse.json({ error: 'task not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
};
