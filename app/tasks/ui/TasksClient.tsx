'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import Tasks from './Tasks';
import Filters from './Filters';
import TaskModal from './TaskModal';
import ConfirmDialog from './ConfirmDialog';

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setTasks, removeTask } from '@/lib/store/slices/tasksSlice';
import { setLoggedOut } from '@/lib/store/slices/authSlice';
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
import { logoutAction } from '@/app/actions/authActions';
import { deleteTaskAction } from '../actions/taskActions';

import type { ChangeEvent } from 'react';
import type { ITaskDTO, TStatus, TPriority } from '@/lib/types/taskTypes';

interface ITasksClient {
  initialTasks: ITaskDTO[];
}

const TasksClient = ({ initialTasks }: ITasksClient) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

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
      const result = await deleteTaskAction(taskToDelete._id);

      if (!result.ok) {
        dispatch(setDeleteError(result.error));
        return;
      }

      dispatch(removeTask(taskToDelete._id));
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

  const onLogout = async () => {
    setLogoutError(null);
    setLogoutLoading(true);

    try {
      const result = await logoutAction();

      if (!result.ok) {
        setLogoutError(result.error);
        return;
      }

      dispatch(setLoggedOut());
      router.push('/');
    } catch {
      setLogoutError('Unable to log out. Please try again.');
    } finally {
      setLogoutLoading(false);
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

        <DivHeaderActionsContainer>
          <DivHeaderActions>
            <Button onClick={onOpenCreate}>+ New Task</Button>
            <ButtonSecondary onClick={onLogout} disabled={logoutLoading}>
              {logoutLoading ? 'Signing out...' : 'Logout'}
            </ButtonSecondary>
          </DivHeaderActions>

          {logoutError && <PError>{logoutError}</PError>}
        </DivHeaderActionsContainer>
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

      {taskModalOpen && (
        <TaskModal
          mode={taskModalMode}
          task={selectedTask}
          onClose={() => dispatch(closeTaskModal())}
        />
      )}

      {confirmDialogOpen && (
        <ConfirmDialog
          title="Delete task?"
          message={`This will permanently delete "${taskToDelete?.title ?? ''}".`}
          onClose={onCloseConfirmDialog}
          onConfirm={confirmDelete}
          error={deleteError}
        />
      )}
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

const DivHeaderActionsContainer = styled.div``;

const DivHeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const H1 = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
`;

const P = styled.p`
  color: #94a3b8;
`;

const PError = styled.p`
  color: #fca5a5;
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
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

const ButtonSecondary = styled.button`
  border-radius: 0.25rem;
  border: 1px solid #334155;
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
