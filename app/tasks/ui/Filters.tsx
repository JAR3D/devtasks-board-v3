import styled from 'styled-components';

import type { ChangeEventHandler } from 'react';
import type { TStatus, TPriority } from '@/lib/types/taskTypes';

interface IFilters {
  statusFilter: TStatus | 'ALL';
  priorityFilter: TPriority | 'ALL';
  search: string;
  handleOnStatusChange: ChangeEventHandler<HTMLSelectElement>;
  handleOnPriorityChange: ChangeEventHandler<HTMLSelectElement>;
  handleOnSearchChange: ChangeEventHandler<HTMLInputElement>;
}

const Filters = ({
  statusFilter,
  priorityFilter,
  search,
  handleOnStatusChange,
  handleOnPriorityChange,
  handleOnSearchChange,
}: IFilters) => {
  return (
    <Section>
      <Div>
        <Select value={statusFilter} onChange={handleOnStatusChange}>
          <option value="ALL">All Statuses</option>
          <option value="BACKLOG">Backlog</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>

        <Select value={priorityFilter} onChange={handleOnPriorityChange}>
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="Medium">Medium</option>
          <option value="HIGH">High</option>
        </Select>
      </Div>

      <Input
        placeholder="Search by title or descrition"
        value={search}
        onChange={handleOnSearchChange}
      />
    </Section>
  );
};

export default Filters;

const Section = styled.section`
  margin-bottom: 1.5rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Div = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Select = styled.select`
  border-radius: 0.25rem;
  border: 1px solid #334155;
  background-color: #0f172a;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: #cbd5e1;
`;

const Input = styled.input`
  width: 100%;
  max-width: 20rem;
  border-radius: 0.25rem;
  border: 1px solid #334155;
  background-color: #0f172a;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
`;
