import { render, screen, fireEvent } from '@testing-library/react';
import { RevealCard } from '@/components/RevealCard';

describe('RevealCard', () => {
  it('renders nothing when visible is false', () => {
    const { container } = render(
      <RevealCard
        visible={false}
        onTryAnother={() => {}}
        input=""
        onInputChange={() => {}}
        onSubmit={() => {}}
        onInputKeyDown={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the input and secondary action when visible', () => {
    render(
      <RevealCard
        visible={true}
        onTryAnother={() => {}}
        input=""
        onInputChange={() => {}}
        onSubmit={() => {}}
        onInputKeyDown={() => {}}
      />
    );
    expect(screen.getByText(/Pick a different scenario/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type a follow-up/)).toBeInTheDocument();
  });

  it('calls onTryAnother when the secondary button is clicked', () => {
    const onTryAnother = vi.fn();
    render(
      <RevealCard
        visible={true}
        onTryAnother={onTryAnother}
        input=""
        onInputChange={() => {}}
        onSubmit={() => {}}
        onInputKeyDown={() => {}}
      />
    );
    fireEvent.click(screen.getByText(/Pick a different scenario/));
    expect(onTryAnother).toHaveBeenCalledOnce();
  });

  it('submits the input when enter is pressed', () => {
    const onSubmit = vi.fn();
    render(
      <RevealCard
        visible={true}
        onTryAnother={() => {}}
        input="Hello"
        onInputChange={() => {}}
        onSubmit={onSubmit}
        onInputKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSubmit();
          }
        }}
      />
    );
    fireEvent.keyDown(screen.getByPlaceholderText(/Type a follow-up/), { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
