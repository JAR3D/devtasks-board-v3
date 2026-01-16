import { NextResponse } from 'next/server';

import { getAuthFromCookies } from '@/lib/authServer';
import { connectToDatabase } from '@/lib/db';
import { Task } from '@/lib/models/Task';

export const GET = async () => {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const tasks = await Task.find({ userId: auth.userId })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(tasks);
};

export const POST = async (req: Request) => {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const body = await req.json();

  if (!body.title || typeof body.title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  const task = await Task.create({
    title: body.title,
    description: body.description ?? '',
    status: body.status ?? 'BACKLOG',
    priority: body.priority ?? 'MEDIUM',
    tags: body.tags ?? [],
    userId: auth.userId,
  });

  return NextResponse.json(task, { status: 201 });
};
