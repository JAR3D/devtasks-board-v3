'use client';

import styled from 'styled-components';

import type { TStatus, ITaskDTO } from '@/lib/types/taskTypes';

const statusLabels = {
  BACKLOG: 'Backlog',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const priorityLabels = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

interface ITasks {
  groupedByStatus: Record<TStatus, ITaskDTO[]>;
}

const Tasks = ({ groupedByStatus }: ITasks) => {
  return (
    <Section>
      {(Object.keys(statusLabels) as TStatus[]).map((status) => (
        <div key={status}>
          <h2>
            {statusLabels[status]} ({groupedByStatus[status].length})
          </h2>
        </div>
      ))}
    </Section>
  );
};

export default Tasks;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & > div {
    flex: 1;
    border-radius: 0.75rem;
    border: 1px solid #1e293b;
    background-color: rgba(15, 23, 42, 0.6);
    padding: 0.75rem;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;
