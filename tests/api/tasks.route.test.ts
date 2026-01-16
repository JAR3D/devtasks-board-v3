/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/tasks/route';

import { Task as MockedTask } from '@/lib/models/Task';

jest.mock('@/lib/db', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('@/lib/models/Task', () => ({
  Task: {
    find: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('@/lib/authServer', () => ({
  getAuthFromCookies: jest.fn().mockResolvedValue({
    userId: 'test',
    email: 'test@example.com',
  }),
}));

describe('GET /api/tasks', () => {
  it('returns tasks', async () => {
    const lean = jest.fn().mockResolvedValue([{ _id: '1' }]);
    (MockedTask.find as jest.Mock).mockReturnValue({
      sort: jest.fn(() => ({ lean })),
    });

    const res = await GET();
    const data = await res.json();
    expect(data).toEqual([{ _id: '1' }]);
  });
});

describe('POST /api/tasks', () => {
  it('validates title', async () => {
    const req = new Request('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: '' }),
    });

    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe('title is required');
  });

  it('creates task', async () => {
    (MockedTask.create as jest.Mock).mockResolvedValue({
      _id: '1',
      title: 'foo',
    });

    const req = new Request('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'foo' }),
    });

    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data._id).toBe('1');
  });
});
