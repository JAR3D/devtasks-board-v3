import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TasksClient from '@/app/tasks/ui/TasksClient';

import tasksReducer from '@/lib/store/slices/tasksSlice';
import tasksUiReducer from '@/lib/store/slices/tasksUISlice';
import { logoutAction } from '@/app/actions/authActions';
import { deleteTaskAction } from '@/app/tasks/actions/taskActions';

import type { ReactElement } from 'react';
import type { ITaskDTO } from '@/lib/types/taskTypes';

jest.mock('@/app/actions/authActions', () => ({
  logoutAction: jest.fn(),
}));

jest.mock('@/app/tasks/actions/taskActions', () => ({
  deleteTaskAction: jest.fn(),
}));

const mockedLogout = logoutAction as jest.Mock;
const mockedDelete = deleteTaskAction as jest.Mock;

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
    mockedLogout.mockResolvedValue({ ok: true });

    renderWithStore(<TasksClient initialTasks={tasks} />);

    await userEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockedLogout).toHaveBeenCalled();
    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
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
    mockedDelete.mockResolvedValue({ ok: true });

    renderWithStore(<TasksClient initialTasks={tasks} />);
    await userEvent.click(
      screen.getAllByRole('button', { name: /delete/i })[0],
    );

    expect(screen.getByText(/delete task\?/i)).toBeInTheDocument();

    const confirmDialogActions = screen.getByTestId('confirmDialogActions');

    await userEvent.click(
      within(confirmDialogActions).getByRole('button', { name: /delete/i }),
    );

    expect(mockedDelete).toHaveBeenCalledWith('1');
  });
});
