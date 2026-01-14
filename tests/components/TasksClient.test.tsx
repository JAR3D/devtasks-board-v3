import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import TasksClient from '@/app/tasks/ui/TasksClient';

import tasksReducer from '@/lib/store/slices/tasksSlice';
import tasksUiReducer from '@/lib/store/slices/tasksUISlice';

import type { ReactElement } from 'react';
import type { ITaskDTO } from '@/lib/types/taskTypes';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const tasks: ITaskDTO[] = [
  {
    _id: '1',
    title: 'Foo',
    description: 'first',
    status: 'BACKLOG',
    priority: 'LOW',
    tags: ['one'],
  },
  {
    _id: '2',
    title: 'Bar',
    description: 'second',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    tags: [],
  },
];

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

describe('TasksClient', () => {
  beforeEach(() => {
    push.mockClear();
  });

  it('logs out and redirects', async () => {
    mockedAxios.post.mockResolvedValue({ data: { ok: true } } as never);

    renderWithStore(<TasksClient initialTasks={tasks} />);

    await userEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/api/auth/logout',
      {},
      { withCredentials: true },
    );
    expect(push).toHaveBeenCalledWith('/');
  });

  it('filters by status and priority', async () => {
    renderWithStore(<TasksClient initialTasks={tasks} />);

    const selectStatus = screen.getByRole('combobox', { name: /status/i });
    await userEvent.selectOptions(selectStatus, 'BACKLOG');

    expect(screen.getByText('Foo')).toBeInTheDocument();
    expect(screen.queryByText('Bar')).not.toBeInTheDocument();

    const selectPriority = screen.getByRole('combobox', { name: /priority/i });
    await userEvent.selectOptions(selectPriority, 'HIGH');

    expect(screen.queryByText('Foo')).not.toBeInTheDocument();
  });

  it('filters by search', async () => {
    renderWithStore(<TasksClient initialTasks={tasks} />);

    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, 'bar');

    expect(screen.getByText('Bar')).toBeInTheDocument();
    expect(screen.queryByText('Foo')).not.toBeInTheDocument();
  });

  it('opens create modal', async () => {
    renderWithStore(<TasksClient initialTasks={tasks} />);
    await userEvent.click(screen.getByRole('button', { name: /\+ new task/i }));
    const createButton = screen.getByRole('button', { name: /create/i });
    expect(createButton).toBeInTheDocument();
  });

  it('asks confirm on delete and calls API', async () => {
    mockedAxios.delete.mockResolvedValue({ data: { ok: true } } as never);

    renderWithStore(<TasksClient initialTasks={tasks} />);
    await userEvent.click(
      screen.getAllByRole('button', { name: /delete/i })[0],
    );

    expect(screen.getByText(/delete task\?/i)).toBeInTheDocument();

    const confirmDialogActions = screen.getByTestId('confirmDialogActions');

    await userEvent.click(
      within(confirmDialogActions).getByRole('button', { name: /delete/i }),
    );
    await waitFor(() =>
      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/tasks/1'),
    );
  });
});
