import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/lib/store/store';
import type { ITaskDTO, TStatus } from '@/lib/types/taskTypes';

const selectTasks = (state: RootState) => state.tasks;
const selectStatusFilter = (state: RootState) => state.tasksUi.statusFilter;
const selectPriorityFilter = (state: RootState) => state.tasksUi.priorityFilter;
const selectSearch = (state: RootState) => state.tasksUi.search;

export const selectFilteredTasks = createSelector(
  [selectTasks, selectStatusFilter, selectPriorityFilter, selectSearch],
  (tasks, statusFilter, priorityFilter, search) => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return tasks.filter((task) => {
      if (statusFilter !== 'ALL' && task.status !== statusFilter) {
        return false;
      }

      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) {
        return false;
      }

      if (normalizedSearch) {
        const text =
          `${task.title} ${task.description ?? ''}`.toLocaleLowerCase();
        if (!text.includes(normalizedSearch)) {
          return false;
        }
      }

      return true;
    });
  },
);

export const selectGroupedByStatus = createSelector(
  [selectFilteredTasks],
  (filteredTasks) => {
    const groups: Record<TStatus, ITaskDTO[]> = {
      BACKLOG: [],
      IN_PROGRESS: [],
      DONE: [],
    };

    for (const task of filteredTasks) {
      groups[task.status].push(task);
    }

    return groups;
  },
);
