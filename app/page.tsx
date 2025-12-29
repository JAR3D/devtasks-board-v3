'use client';

import Link from 'next/link';
import styled from 'styled-components';

export default function Home() {
  return (
    <Main>
      <Div>
        <H1>Hello World</H1>
        <P>
          A simple full-stack task board built with Next.js, MongoDB and
          TypeScript
        </P>
        <CustomLink href="/tasks">View Tasks</CustomLink>
      </Div>
    </Main>
  );
}

const Main = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Div = styled.div`
  text-align: center;

  & > * + * {
    margin-top: 1rem;
  }
`;

const H1 = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
`;

const P = styled.p`
  color: #6b7280;
`;

const CustomLink = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: #2563eb;
  color: #ffffff;
  display: inline-block;

  &:hover {
    background-color: #1d4ed8;
  }
`;
