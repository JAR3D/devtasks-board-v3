import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/lib/store/slices/authSlice';
import AuthLanding from '@/app/ui/AuthLanding';

import type { ReactElement } from 'react';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

const renderWithStore = (ui: ReactElement) => {
  const store = makeStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('AuthLanding', () => {
  beforeEach(() => {
    push.mockClear();
    mockedAxios.post.mockReset();
  });

  it('shows confirm password only in register mode', async () => {
    renderWithStore(<AuthLanding />);

    expect(
      screen.queryByLabelText(/confirm password/i),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('submits login and redirects', async () => {
    mockedAxios.post.mockResolvedValue({ data: { ok: true } } as never);

    renderWithStore(<AuthLanding />);

    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
    await userEvent.type(screen.getByLabelText(/password/i), '123456');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/api/auth/login',
      { email: 'a@b.com', password: '123456' },
      { withCredentials: true },
    );

    await waitFor(() => expect(push).toHaveBeenCalledWith('/tasks'));
  });

  it('shows validation error when passwords do not match', async () => {
    renderWithStore(<AuthLanding />);

    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), '123456');
    await userEvent.type(screen.getByLabelText(/confirm password/i), '1234567');

    await userEvent.click(
      screen.getByRole('button', { name: /create account/i }),
    );

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
