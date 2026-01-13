'use client';

import styled from 'styled-components';
import Modal from './Modal';

interface IConfirmDialog {
  open: boolean;
  title: string;
  message: string;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  message,
  error,
  onConfirm,
  onClose,
}: IConfirmDialog) => {
  if (!open) {
    return null;
  }

  return (
    <Modal title={title} onClose={onClose}>
      <P>{message}</P>
      {error && <PError>{error}</PError>}
      <DivActions data-testid="confirmDialogActions">
        <Button $variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button $variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </DivActions>
    </Modal>
  );
};

export default ConfirmDialog;

const P = styled.p`
  margin: 0 0 0.75rem 0;
  color: #e2e8f0;
  font-size: 0.9rem;
`;

const PError = styled.p`
  margin: 0 0 0.75rem 0;
  color: #ef4444;
  font-size: 0.9rem;
`;

const DivActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
`;

const Button = styled.button<{ $variant?: 'danger' | 'ghost' }>`
  border-radius: 0.5rem;
  border: 1px solid
    ${({ $variant }) => ($variant === 'danger' ? '#ef4444' : '#334155')};
  background: ${({ $variant }) =>
    $variant === 'danger' ? '#ef4444' : '#0f172a'};
  color: ${({ $variant }) => ($variant === 'danger' ? '#020617' : '#e2e8f0')};
  padding: 0.55rem 0.75rem;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    filter: brightness(1.07);
  }
`;
