/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Modal from './Modal';

import { useAppDispatch } from '@/lib/store/hooks';
import { createTask, updateTask } from '@/lib/store/thunks/tasksThunks';

import type { ITaskDTO, TStatus, TPriority } from '@/lib/types/taskTypes';

interface ITaskModal {
  mode: 'create' | 'edit';
  task: ITaskDTO | null;
  open: boolean;
  onClose: () => void;
}

const TaskModal = ({ mode, task, open, onClose }: ITaskModal) => {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TStatus>('BACKLOG');
  const [priority, setPriority] = useState<TPriority>('MEDIUM');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (!payload.title) {
      setError('Title is required.');
      return;
    }

    try {
      if (mode === 'create') {
        await dispatch(createTask(payload)).unwrap();
      } else {
        await dispatch(
          updateTask({ id: task?._id as string, data: payload }),
        ).unwrap();
      }

      onClose();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      setError(message);
    }
  };

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setStatus(task?.status ?? 'BACKLOG');
    setPriority(task?.priority ?? 'MEDIUM');
    setTags((task?.tags ?? []).join(', '));
  }, [open, task]);

  if (!open) return null;

  return (
    <Modal
      title={mode === 'create' ? 'New Task' : 'Edit Task'}
      onClose={onClose}
    >
      <Form onSubmit={onSubmit}>
        <DivRow>
          <Label htmlFor="inputTitleId">Title</Label>
          <Input
            id="inputTitleId"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DivRow>

        <DivRow>
          <Label htmlFor="textareaDescriptionId">Description</Label>
          <Textarea
            id="textareaDescriptionId"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DivRow>

        <DivTwoCols>
          <DivRow>
            <Label htmlFor="selectStatusId">Status</Label>
            <Select
              id="selectStatusId"
              value={status}
              onChange={(e) => setStatus(e.target.value as TStatus)}
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
              value={priority}
              onChange={(e) => setPriority(e.target.value as TPriority)}
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
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </DivRow>

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
