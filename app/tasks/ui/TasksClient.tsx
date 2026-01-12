'use client';

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Tasks from './Tasks';
import Filters from './Filters';
import TaskModal from './TaskModal';
import ConfirmDialog from './ConfirmDialog';

import { setTasks, saveTask, removeTask } from '@/lib/store/slices/tasksSlice';
import {
  setStatusFilter,
  setPriorityFilter,
  setSearch,
  openCreate,
  openEdit,
  openDeleteConfirm,
  closeTaskModal,
  closeDeleteConfirm,
} from '@/lib/store/slices/tasksUISlice';
import { selectGroupedByStatus } from '@/lib/store/selectors/tasksSelectors';

import type { ChangeEvent } from 'react';
import type { ITaskDTO, TStatus, TPriority } from '@/lib/types/taskTypes';

interface ITasksClient {
  initialTasks: ITaskDTO[];
}

const TasksClient = ({ initialTasks }: ITasksClient) => {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector((state) => state.tasks);

  const {
    statusFilter,
    priorityFilter,
    search,
    taskModalMode,
    selectedTask,
    taskModalOpen,
    confirmDialogOpen,
    taskToDelete,
  } = useAppSelector((state) => state.tasksUi);

  const groupedByStatus = useAppSelector(selectGroupedByStatus);

  const handleOnStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setStatusFilter(e.target.value as TStatus | 'ALL'));
  };

  const handleOnPriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPriorityFilter(e.target.value as TPriority | 'ALL'));
  };

  const handleOnSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  const onOpenEdit = (task: ITaskDTO) => {
    dispatch(openEdit(task));
  };

  const onSaved = (savedTask: ITaskDTO) => {
    dispatch(saveTask(savedTask));
  };

  const onOpenCreate = () => {
    dispatch(openCreate());
  };

  const onAskDelete = (task: ITaskDTO) => {
    dispatch(openDeleteConfirm(task));
  };

  const confirmDelete = async () => {
    // TODO: create action creator for this

    if (!taskToDelete) {
      return;
    }
    const id = taskToDelete._id;

    const prev = tasks;
    dispatch(removeTask(id));

    try {
      const response = await axios.delete(`/api/tasks/${id}`);

      if (!response.data.ok) {
        throw new Error('Delete failed');
      }
    } catch {
      dispatch(setTasks(prev));
    } finally {
      dispatch(closeDeleteConfirm());
    }
  };

  useEffect(() => {
    dispatch(setTasks(initialTasks));
  }, [initialTasks, dispatch]);

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

        <Button onClick={onOpenCreate}>+ New Task</Button>
      </Header>

      <Filters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        search={search}
        handleOnStatusChange={handleOnStatusChange}
        handleOnPriorityChange={handleOnPriorityChange}
        handleOnSearchChange={handleOnSearchChange}
      />

      <Tasks
        groupedByStatus={groupedByStatus}
        onEditClick={onOpenEdit}
        onDelete={onAskDelete}
      />

      <TaskModal
        open={taskModalOpen}
        mode={taskModalMode}
        task={selectedTask}
        onClose={() => dispatch(closeTaskModal())}
        onSaved={onSaved}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete task?"
        message={`This will permanently delete "${taskToDelete?.title ?? ''}".`}
        onClose={() => dispatch(closeDeleteConfirm())}
        onConfirm={confirmDelete}
      />
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
