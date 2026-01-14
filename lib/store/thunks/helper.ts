import axios from 'axios';

export const getRequestErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string };
    return data?.error ?? error.message ?? 'Request failed';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Request failed';
};
