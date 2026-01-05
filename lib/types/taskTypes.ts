export type TStatus = 'BACKLOG' | 'IN_PROGRESS' | 'DONE';
export type TPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ITaskDTO {
  title: string;
  description: string;
  status: TStatus;
  priority: TPriority;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  _id: string;
}
