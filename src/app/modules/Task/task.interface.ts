export type ITask = {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
};

export type ITaskFilterRequest = {
  status?: string;
  priority?: string;
};
