import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/app/tasks/ui/Modal';

describe('Modal', () => {
  it('calls onClose on Escape', () => {
    const onClose = jest.fn();
    render(
      <Modal title="Test" onClose={onClose}>
        <div>Content</div>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose on overlay click', () => {
    const onClose = jest.fn();
    render(
      <Modal title="Test" onClose={onClose}>
        <div>Content</div>
      </Modal>,
    );

    const overlay = screen.getByTestId('divOverlay');
    fireEvent.mouseDown(overlay);
    expect(onClose).toHaveBeenCalled();
  });
});
