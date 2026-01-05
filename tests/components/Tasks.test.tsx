import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tasks from '@/app/tasks/ui/Tasks';
import type { TStatus, ITaskDTO } from '@/lib/types/taskTypes';

const groupedByStatus: Record<TStatus, ITaskDTO[]> = {
  BACKLOG: [
    {
      _id: '1',
      title: 'Alpha',
      description: '',
      status: 'BACKLOG',
      priority: 'LOW',
      tags: [],
    },
  ],
  IN_PROGRESS: [],
  DONE: [],
};

describe('Tasks', () => {
  it('renders groups and empty states', () => {
    render(
      <Tasks
        groupedByStatus={groupedByStatus}
        onEditClick={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText(/backlog \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/in progress \(0\)/i)).toBeInTheDocument();
    expect(screen.getByText(/done \(0\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/no tasks in this column/i)).toHaveLength(2);
  });

  it('calls edit and delete handlers', async () => {
    const onEditClick = jest.fn();
    const onDelete = jest.fn();

    render(
      <Tasks
        groupedByStatus={groupedByStatus}
        onEditClick={onEditClick}
        onDelete={onDelete}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEditClick).toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalled();
  });
});
