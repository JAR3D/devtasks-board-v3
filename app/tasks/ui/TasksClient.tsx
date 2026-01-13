'use client';

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { useEffect } from 'react';
import styled from 'styled-components';

import Tasks from './Tasks';
import Filters from './Filters';
import TaskModal from './TaskModal';
import ConfirmDialog from './ConfirmDialog';

import { setTasks } from '@/lib/store/slices/tasksSlice';
import {
  setStatusFilter,
  setPriorityFilter,
  setSearch,
  openCreate,
  openEdit,
  openDeleteConfirm,
  closeTaskModal,
  closeDeleteConfirm,
  setDeleteError,
  clearDeleteError,
} from '@/lib/store/slices/tasksUISlice';
import { selectGroupedByStatus } from '@/lib/store/selectors/tasksSelectors';
import { deleteTask } from '@/lib/store/thunks/tasksThunks';

import type { ChangeEvent } from 'react';
import type { ITaskDTO, TStatus, TPriority } from '@/lib/types/taskTypes';

interface ITasksClient {
  initialTasks: ITaskDTO[];
}

const TasksClient = ({ initialTasks }: ITasksClient) => {
  const dispatch = useAppDispatch();

  const {
    statusFilter,
    priorityFilter,
    search,
    taskModalMode,
    selectedTask,
    taskModalOpen,
    confirmDialogOpen,
    taskToDelete,
    deleteError,
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

  const onOpenCreate = () => {
    dispatch(openCreate());
  };

  const onAskDelete = (task: ITaskDTO) => {
    dispatch(openDeleteConfirm(task));
  };

  const confirmDelete = async () => {
    if (!taskToDelete) {
      return;
    }

    dispatch(clearDeleteError());

    try {
      await dispatch(deleteTask(taskToDelete._id)).unwrap();
      dispatch(clearDeleteError());
      dispatch(closeDeleteConfirm());
    } catch {
      dispatch(
        setDeleteError(
          'it was not possible to delete the task. Please try again.',
        ),
      );
    }
  };

  const onCloseConfirmDialog = () => {
    dispatch(closeDeleteConfirm());
    dispatch(clearDeleteError());
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
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete task?"
        message={`This will permanently delete "${taskToDelete?.title ?? ''}".`}
        onClose={onCloseConfirmDialog}
        onConfirm={confirmDelete}
        error={deleteError}
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
