/**
 * @jest-environment node
 */
import { GET, PATCH, DELETE } from '@/app/api/tasks/[id]/route';

import { Task as MockedTask } from '@/lib/models/Task';

jest.mock('@/lib/db', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('@/lib/models/Task', () => ({
  Task: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock('@/lib/authServer', () => ({
  getAuthFromCookies: jest.fn().mockResolvedValue({
    userId: 'test',
    email: 'test@example.com',
  }),
}));

describe('GET /api/tasks/:id', () => {
  it('returns 400 for invalid id', async () => {
    const res = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'bad' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 404 when not found', async () => {
    (MockedTask.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const res = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: '507f1f77bcf86cd799439011' }),
    });
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/tasks/:id', () => {
  it('returns 400 for invalid id', async () => {
    const res = await PATCH(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'bad' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns updated task', async () => {
    (MockedTask.findByIdAndUpdate as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: '1', title: 'Updated' }),
    });

    const req = new Request('http://localhost', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated' }),
    });

    const res = await PATCH(req, {
      params: Promise.resolve({ id: '507f1f77bcf86cd799439011' }),
    });
    const data = await res.json();
    expect(data.title).toBe('Updated');
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('returns 404 when not found', async () => {
    (MockedTask.findByIdAndDelete as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const res = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: '507f1f77bcf86cd799439011' }),
    });

    expect(res.status).toBe(404);
  });

  it('returns ok', async () => {
    (MockedTask.findByIdAndDelete as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: '1' }),
    });

    const res = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: '507f1f77bcf86cd799439011' }),
    });

    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
