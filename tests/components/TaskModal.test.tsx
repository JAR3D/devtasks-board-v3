import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import TaskModal from '@/app/tasks/ui/TaskModal';
import type { ITaskDTO } from '@/lib/types/taskTypes';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TaskModal', () => {
  it('does not render when closed', () => {
    render(
      <TaskModal
        open={false}
        mode="create"
        task={null}
        onClose={jest.fn()}
        onSaved={jest.fn()}
      />,
    );
    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
  });

  it('shows error when title is empty', async () => {
    render(
      <TaskModal
        open
        mode="create"
        task={null}
        onClose={jest.fn()}
        onSaved={jest.fn()}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  it('submits create payload', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { _id: '1', title: 'New', status: 'BACKLOG', priority: 'MEDIUM' },
    } as never);

    const onSaved = jest.fn();
    const onClose = jest.fn();

    render(
      <TaskModal
        open
        mode="create"
        task={null}
        onClose={onClose}
        onSaved={onSaved}
      />,
    );

    await userEvent.type(screen.getByLabelText(/title/i), 'New');
    await userEvent.type(screen.getByLabelText(/tags/i), 'a, b');

    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(mockedAxios.post).toHaveBeenCalledWith('api/tasks', {
      title: 'New',
      description: '',
      status: 'BACKLOG',
      priority: 'MEDIUM',
      tags: ['a', 'b'],
    });

    expect(onSaved).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('submits edit payload', async () => {
    mockedAxios.patch.mockResolvedValue({
      data: { _id: '1', title: 'Edit', status: 'DONE', priority: 'HIGH' },
    } as never);

    const task: ITaskDTO = {
      _id: '1',
      title: 'Edit',
      description: '',
      status: 'DONE',
      priority: 'HIGH',
      tags: [],
    };

    render(
      <TaskModal
        open
        mode="edit"
        task={task}
        onClose={jest.fn()}
        onSaved={jest.fn()}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(mockedAxios.patch).toHaveBeenCalledWith('/api/tasks/1', {
      title: 'Edit',
      description: '',
      status: 'DONE',
      priority: 'HIGH',
      tags: [],
    });
  });
});
