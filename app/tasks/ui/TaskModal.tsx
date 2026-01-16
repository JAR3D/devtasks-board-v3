'use client';

import React, { useState, useEffect, useActionState } from 'react';
import styled from 'styled-components';

import Modal from './Modal';

import { useAppDispatch } from '@/lib/store/hooks';
import {
  createTaskFormAction,
  updateTaskFormAction,
} from '@/app/tasks/actions/taskActions';
import { upsertTask } from '@/lib/store/slices/tasksSlice';

import type { ITaskDTO } from '@/lib/types/taskTypes';

interface ITaskModal {
  mode: 'create' | 'edit';
  task: ITaskDTO | null;
  onClose: () => void;
}

const TaskModal = ({ mode, task, onClose }: ITaskModal) => {
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string | null>(null);

  const [createState, createAction] = useActionState(createTaskFormAction, {
    ok: false,
    error: '',
  });
  const [updateState, updateAction] = useActionState(updateTaskFormAction, {
    ok: false,
    error: '',
  });

  const isEdit = mode === 'edit';

  const action = mode === 'create' ? createAction : updateAction;
  const state = mode === 'create' ? createState : updateState;

  // Derived values to keep useEffect deps stable and avoid accessing union-only fields (ok true/false).
  const taskResult = state.ok ? state.task : null;
  const errorMessage = state.ok ? '' : state.error;

  useEffect(() => {
    if (taskResult) {
      dispatch(upsertTask(taskResult));
      onClose();
    }
  }, [taskResult, dispatch, onClose]);

  useEffect(() => {
    if (errorMessage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(errorMessage);
    }
  }, [errorMessage]);

  return (
    <Modal
      title={mode === 'create' ? 'New Task' : 'Edit Task'}
      onClose={onClose}
    >
      <Form action={action}>
        <DivRow>
          <Label htmlFor="inputTitleId">Title</Label>
          <Input
            id="inputTitleId"
            name="title"
            defaultValue={isEdit ? (task?.title ?? '') : ''}
          />
        </DivRow>

        <DivRow>
          <Label htmlFor="textareaDescriptionId">Description</Label>
          <Textarea
            id="textareaDescriptionId"
            name="description"
            defaultValue={isEdit ? (task?.description ?? '') : ''}
          />
        </DivRow>

        <DivTwoCols>
          <DivRow>
            <Label htmlFor="selectStatusId">Status</Label>
            <Select
              id="selectStatusId"
              name="status"
              defaultValue={isEdit ? (task?.status ?? 'BACKLOG') : 'BACKLOG'}
            >
              <option value="BACKLOG">Backlog</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </Select>
          </DivRow>

          <DivRow>
            <Label htmlFor="selectPriorityId">Priority</Label>
            <Select
              id="selectPriorityId"
              name="priority"
              defaultValue={isEdit ? (task?.priority ?? 'MEDIUM') : 'MEDIUM'}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </DivRow>
        </DivTwoCols>

        <DivRow>
          <Label htmlFor="inputTagsId">Tags (comma-separated)</Label>
          <Input
            id="inputTagsId"
            name="tags"
            defaultValue={isEdit ? (task?.tags?.join(', ') ?? '') : ''}
          />
        </DivRow>

        {mode === 'edit' && (
          <input type="hidden" name="id" value={task?._id ?? ''} />
        )}

        {error && <PError>{error}</PError>}

        <DivActions>
          <Button type="button" onClick={onClose} $variant="ghost">
            Cancel
          </Button>
          <Button type="submit" $variant="primary">
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DivActions>
      </Form>
    </Modal>
  );
};

export default TaskModal;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DivRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.75rem;
  color: #cbd5e1;
`;

const Input = styled.input`
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  padding: 0.55rem 0.65rem;
  outline: none;

  &:focus {
    border-color: rgba(16, 185, 129, 0.7);
  }
`;

const Textarea = styled.textarea`
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  padding: 0.55rem 0.65rem;
  outline: none;
  min-height: 110px;
  resize: vertical;

  &:focus {
    border-color: rgba(16, 185, 129, 0.7);
  }
`;

const Select = styled.select`
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  padding: 0.55rem 0.65rem;
  outline: none;

  &:focus {
    border-color: rgba(16, 185, 129, 0.7);
  }
`;

const DivTwoCols = styled.div`
  display: flex;
  gap: 0.75rem;

  & > div {
    flex: 1;
  }
`;

const PError = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #fca5a5;
`;

const DivActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.25rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  border-radius: 0.5rem;
  border: 1px solid
    ${({ $variant }) => ($variant === 'primary' ? '#10b981' : '#334155')};
  background: ${({ $variant }) =>
    $variant === 'primary' ? '#10b981' : '#0f172a'};
  color: ${({ $variant }) => ($variant === 'primary' ? '#020617' : '#e2e8f0')};
  padding: 0.55rem 0.75rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    filter: brightness(1.07);
  }
`;
