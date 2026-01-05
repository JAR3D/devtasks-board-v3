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
  onEditClick: (task: ITaskDTO) => void;
  onDelete: (task: ITaskDTO) => void;
}

const Tasks = ({ groupedByStatus, onEditClick, onDelete }: ITasks) => {
  return (
    <Section>
      {(Object.keys(statusLabels) as TStatus[]).map((status) => (
        <DivStatusContainer key={status}>
          <H2>
            {statusLabels[status]} ({groupedByStatus[status].length})
          </H2>

          <Div>
            {groupedByStatus[status].map((task) => (
              <Article key={task._id}>
                <Header>
                  <H3>{task.title}</H3>

                  <DivArticle>
                    <Span>{priorityLabels[task.priority]}</Span>
                    <Button onClick={() => onEditClick(task)}>Edit</Button>
                    <Button $danger onClick={() => onDelete(task)}>
                      Delete
                    </Button>
                  </DivArticle>
                </Header>

                {task.description && (
                  <PDescription>{task.description}</PDescription>
                )}

                {task.tags && task.tags.length > 0 && (
                  <DivTags>
                    {task.tags.map((tag) => (
                      <SpanTag key={tag}>#{tag}</SpanTag>
                    ))}
                  </DivTags>
                )}
              </Article>
            ))}

            {groupedByStatus[status].length === 0 && (
              <PStatus>No tasks in this column.</PStatus>
            )}
          </Div>
        </DivStatusContainer>
      ))}
    </Section>
  );
};

export default Tasks;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const DivStatusContainer = styled.div`
  flex: 1;
  border-radius: 0.75rem;
  border: 1px solid #1e293b;
  background-color: rgba(15, 23, 42, 0.6);
  padding: 0.75rem;
`;

const H2 = styled.h2`
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  color: #cbd5e1;
`;

const H3 = styled.h3`
  font-weight: 500;
`;

const Article = styled.article`
  border-radius: 0.5rem;
  border: 1px solid #1e293b;
  background-color: #0f172a;
  padding: 0.75rem;
  font-size: 0.875rem;

  &:hover {
    border-color: rgba(16, 185, 129, 0.6);
  }
`;

const Span = styled.span`
  border-radius: 100%;
  background-color: #1e293b;
  padding: 0.125rem 0.5rem;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: #cbd5e1;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Header = styled.header`
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
`;

const DivArticle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const Button = styled.button<{ $danger?: boolean }>`
  border-radius: 0.4rem;
  border: 1px solid ${({ $danger }) => ($danger ? '#ef4444' : '#334155')};
  background: ${({ $danger }) => ($danger ? 'rgba(239,68,68,0.1)' : '#0f172a')};
  color: ${({ $danger }) => ($danger ? '#fca5a5' : '#e2e8f0')};
  padding: 0.25rem 0.45rem;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }
`;

const PDescription = styled.p`
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  color: #94a3b8;
`;

const DivTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const SpanTag = styled.span`
  border-radius: 100%;
  background-color: #1e293b;
  padding: 0.125rem 0.5rem;
  font-size: 10px;
  color: #cbd5e1;
`;

const PStatus = styled.p`
  font-size: 0.75rem;
  font-style: italic;
  color: #64748b;
`;
