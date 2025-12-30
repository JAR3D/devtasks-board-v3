'use client';

import { useState, useMemo } from 'react';
import styled from 'styled-components';

import type { ITaskDTO, TStatus, TPriority } from '@/lib/types/taskTypes';

interface ITasksClient {
  initialTasks: ITaskDTO[];
}

const TasksClient = ({ initialTasks }: ITasksClient) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [statusFilter, setStatusFilter] = useState<TStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TPriority | 'ALL'>(
    'ALL',
  );
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== 'ALL' && task.status !== statusFilter) {
        return false;
      }

      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) {
        return false;
      }

      const text =
        `${task.title} ${task.description ?? ''}`.toLocaleLowerCase();
      if (search && !text.includes(search.toLocaleLowerCase())) {
        return false;
      }

      return true;
    });
  }, [statusFilter, priorityFilter, search, tasks]);

  const groupedByStatus = useMemo(() => {
    const groups: Record<TStatus, ITaskDTO[]> = {
      BACKLOG: [],
      IN_PROGRESS: [],
      DONE: [],
    };

    for (const task of filteredTasks) {
      groups[task.status].push(task);
    }

    return groups;
  }, [filteredTasks]);

  return (
    <Main>
      <Header>
        <div>
          <H1>DevTasks Board</H1>
          <P>
            Simple full-stack task board built with Next.js, MongoDB and
            TypeScript.
          </P>
        </div>

        <Button onClick={() => {}}>+ New Task</Button>
      </Header>
    </Main>
  );
};

export default TasksClient;

const Main = styled.main`
  min-height: 100vh;
  padding: 1.5rem;
  background-color: #020617;
  color: #f1f5f9;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const H1 = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
`;

const P = styled.p`
  color: #94a3b8;
`;

const Button = styled.button`
  border-radius: 0.25rem;
  background-color: #10b981;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #020617;
  align-self: flex-start;

  &:hover {
    background-color: #34d399;
  }
`;
