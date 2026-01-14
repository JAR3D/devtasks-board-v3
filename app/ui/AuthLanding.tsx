'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

type Mode = 'login' | 'register';

const AuthLanding = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === 'register';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegister && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

      await axios.post(
        endpoint,
        { email: email.trim(), password },
        { withCredentials: true },
      );

      router.push('/tasks');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { error?: string })?.error ??
          'Something went wrong.';
        setError(message);
      } else {
        setError('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main>
      <DivShell>
        <DivHero>
          <SpanBadge>DevTasks Board</SpanBadge>
          <H1Title>Ship tasks, not excuses.</H1Title>
          <PLead>
            Organize backlog, priorities and progress in a simple board, fast
            and straight to the point.
          </PLead>
          <UlHighlights>
            <li>Board by status</li>
            <li>Filters and search</li>
            <li>Complete CRUD</li>
          </UlHighlights>
        </DivHero>

        <DivCard>
          <DivTabs>
            <ButtonTab
              $active={mode === 'login'}
              onClick={() => setMode('login')}
            >
              Login
            </ButtonTab>
            <ButtonTab
              $active={mode === 'register'}
              onClick={() => setMode('register')}
            >
              Register
            </ButtonTab>
          </DivTabs>

          <Form onSubmit={onSubmit}>
            <DivField>
              <Label htmlFor="inputEmailId">Email</Label>
              <Input
                id="inputEmailId"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </DivField>

            <DivField>
              <Label htmlFor="inputPasswordId">Password</Label>
              <Input
                id="inputPasswordId"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </DivField>

            {isRegister && (
              <DivField>
                <Label htmlFor="inputConfirmPasswordId">Confirm password</Label>
                <Input
                  id="inputConfirmPasswordId"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </DivField>
            )}

            {error && <PError>{error}</PError>}

            <ButtonSubmit type="submit" disabled={loading}>
              {loading
                ? 'Please wait...'
                : isRegister
                  ? 'Create account'
                  : 'Sign in'}
            </ButtonSubmit>
          </Form>
        </DivCard>
      </DivShell>
    </Main>
  );
};

export default AuthLanding;

const Main = styled.main`
  --bg: #020617;
  --panel: #0f172a;
  --border: #1e293b;
  --text: #f1f5f9;
  --muted: #94a3b8;
  --accent: #10b981;

  min-height: 100vh;
  background:
    radial-gradient(
      1200px 600px at 10% -10%,
      rgba(16, 185, 129, 0.12),
      transparent
    ),
    radial-gradient(
      800px 400px at 90% 10%,
      rgba(56, 189, 248, 0.1),
      transparent
    ),
    var(--bg);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const DivShell = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 960px) {
    flex-direction: row;
    align-items: center;
  }
`;

const DivHero = styled.div`
  flex: 1.3;
`;

const SpanBadge = styled.span`
  display: inline-block;
  border: 1px solid var(--border);
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--muted);
`;

const H1Title = styled.h1`
  margin: 1rem 0 0.5rem;
  font-size: 2.5rem;
  line-height: 1.1;
`;

const PLead = styled.p`
  color: var(--muted);
  margin-bottom: 1.25rem;
`;

const UlHighlights = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  li {
    color: var(--muted);
  }
`;

const DivCard = styled.div`
  flex: 0.7;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(2, 6, 23, 0.5);
`;

const DivTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ButtonTab = styled.button<{ $active?: boolean }>`
  flex: 1;
  border: 1px solid
    ${({ $active }) => ($active ? 'var(--accent)' : 'var(--border)')};
  background: ${({ $active }) =>
    $active ? 'rgba(16,185,129,0.15)' : 'transparent'};
  color: ${({ $active }) => ($active ? '#eafff7' : 'var(--muted)')};
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const Form = styled.form`
  display: grid;
  gap: 0.75rem;
`;

const DivField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Label = styled.label`
  font-size: 0.75rem;
  color: var(--muted);
`;

const Input = styled.input`
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: #0b1220;
  color: var(--text);
  padding: 0.6rem 0.7rem;
`;

const PError = styled.p`
  color: #fca5a5;
  font-size: 0.85rem;
  margin: 0;
`;

const ButtonSubmit = styled.button`
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  background: var(--accent);
  color: #052e1a;
  font-weight: 700;
  padding: 0.6rem 0.8rem;
  cursor: pointer;

  &:hover {
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
