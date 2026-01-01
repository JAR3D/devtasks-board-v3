'use client';

import { useEffect } from 'react';
import styled from 'styled-components';

interface IModal {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ title, onClose, children }: IModal) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <DivOverlay onMouseDown={onClose}>
      <DivModalContainer onMouseDown={(e) => e.stopPropagation()}>
        <Header>
          <H2>{title}</H2>
          <Button onClick={onClose}>x</Button>
        </Header>
        {children}
      </DivModalContainer>
    </DivOverlay>
  );
};

export default Modal;

const DivOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const DivModalContainer = styled.div`
  width: min(720px, calc(100vw - 24px));
  border-radius: 0.75rem;
  border: 1px solid #1e293b;
  background: #0b1220;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);
  padding: 1rem;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const H2 = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
`;

const Button = styled.button`
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  padding: 0.35rem 0.55rem;
  cursor: pointer;

  &:hover {
    background: #111c33;
  }
`;
