import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from '@/app/tasks/ui/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('calls onClose and onConfirm', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    render(
      <ConfirmDialog
        title="Title"
        message="Message"
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onConfirm).toHaveBeenCalled();
  });
});
