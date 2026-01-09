import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TStatus, TPriority, ITaskDTO } from '@/lib/types/taskTypes';

type TTasksUiState = {
  statusFilter: TStatus | 'ALL';
  priorityFilter: TPriority | 'ALL';
  search: string;
  taskModalOpen: boolean;
  taskModalMode: 'create' | 'edit';
  selectedTask: ITaskDTO | null;
  confirmDialogOpen: boolean;
  taskToDelete: ITaskDTO | null;
};

const initialState: TTasksUiState = {
  statusFilter: 'ALL',
  priorityFilter: 'ALL',
  search: '',
  taskModalOpen: false,
  taskModalMode: 'create',
  selectedTask: null,
  confirmDialogOpen: false,
  taskToDelete: null,
};

const tasksUiSlice = createSlice({
  name: 'tasksUi',
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<TStatus | 'ALL'>) {
      state.statusFilter = action.payload;
    },
    setPriorityFilter(state, action: PayloadAction<TPriority | 'ALL'>) {
      state.priorityFilter = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    openCreate(state) {
      state.taskModalMode = 'create';
      state.selectedTask = null;
      state.taskModalOpen = true;
    },
    openEdit(state, action: PayloadAction<ITaskDTO>) {
      state.taskModalMode = 'edit';
      state.selectedTask = action.payload;
      state.taskModalOpen = true;
    },
    closeTaskModal(state) {
      state.taskModalOpen = false;
      state.selectedTask = null;
    },
    openDeleteConfirm(state, action: PayloadAction<ITaskDTO>) {
      state.taskToDelete = action.payload;
      state.confirmDialogOpen = true;
    },
    closeDeleteConfirm(state) {
      state.confirmDialogOpen = false;
      state.taskToDelete = null;
    },
  },
});

export const {
  setStatusFilter,
  setPriorityFilter,
  setSearch,
  openCreate,
  openEdit,
  closeTaskModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} = tasksUiSlice.actions;

export default tasksUiSlice.reducer;
