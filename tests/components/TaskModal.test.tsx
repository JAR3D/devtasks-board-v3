import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TaskModal from '@/app/tasks/ui/TaskModal';

import tasksReducer from '@/lib/store/slices/tasksSlice';
import tasksUiReducer from '@/lib/store/slices/tasksUISlice';
import {
  createTaskFormAction,
  updateTaskFormAction,
} from '@/app/tasks/actions/taskActions';

import type { ReactElement } from 'react';
import type { ITaskDTO } from '@/lib/types/taskTypes';

jest.mock('@/app/tasks/actions/taskActions', () => ({
  createTaskFormAction: jest.fn(),
  updateTaskFormAction: jest.fn(),
}));

const mockedCreate = createTaskFormAction as jest.Mock;
const mockedUpdate = updateTaskFormAction as jest.Mock;

const makeStore = () =>
  configureStore({
    reducer: {
      tasks: tasksReducer,
      tasksUi: tasksUiReducer,
    },
  });

const renderWithStore = (ui: ReactElement) => {
  const store = makeStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('TaskModal', () => {
  beforeEach(() => {
    mockedCreate.mockReset();
    mockedUpdate.mockReset();
  });

  it('does not render when closed', () => {
    renderWithStore(
      <TaskModal open={false} mode="create" task={null} onClose={jest.fn()} />,
    );
    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
  });

  it('shows error when title is empty', async () => {
    mockedCreate.mockResolvedValue({ ok: false, error: 'title is required' });

    renderWithStore(
      <TaskModal open mode="create" task={null} onClose={jest.fn()} />,
    );

    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  it('submits create payload', async () => {
    mockedCreate.mockResolvedValue({
      ok: true,
      task: {
        _id: '1',
        title: 'New',
        description: '',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        tags: [],
      },
    });

    const onClose = jest.fn();

    renderWithStore(
      <TaskModal open mode="create" task={null} onClose={onClose} />,
    );

    await userEvent.type(screen.getByLabelText(/title/i), 'New');
    await userEvent.type(screen.getByLabelText(/tags/i), 'a, b');

    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(mockedCreate).toHaveBeenCalled();
    const formData = mockedCreate.mock.calls[0][1] as FormData;
    expect(formData.get('title')).toBe('New');
    expect(formData.get('tags')).toBe('a, b');

    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('submits edit payload', async () => {
    mockedUpdate.mockResolvedValue({
      ok: true,
      task: {
        _id: '1',
        title: 'New',
        description: '',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        tags: [],
      },
    });

    const task: ITaskDTO = {
      _id: '1',
      title: 'Edit',
      description: '',
      status: 'DONE',
      priority: 'HIGH',
      tags: [],
    };

    renderWithStore(
      <TaskModal open mode="edit" task={task} onClose={jest.fn()} />,
    );

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    const formData = mockedUpdate.mock.calls[0][1] as FormData;
    expect(formData.get('id')).toBe('1');
  });
});
