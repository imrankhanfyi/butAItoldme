import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScenarioCards } from '@/components/ScenarioCards';
import { SCENARIOS } from '@/lib/scenarios';

const featured = SCENARIOS.find((s) => s.featured) ?? SCENARIOS[0];
const others = SCENARIOS.filter((s) => s.id !== featured.id);
const hiddenCount = others.length - 3;

describe('ScenarioCards', () => {
  it('has role="group" with aria-label', () => {
    render(<ScenarioCards onSelect={vi.fn()} />);
    expect(screen.getByRole('group', { name: 'Scenario options' })).toBeTruthy();
  });

  it('renders the featured card with "Start here" label and its title', () => {
    render(<ScenarioCards onSelect={vi.fn()} />);
    expect(screen.getByText('Start here')).toBeTruthy();
    expect(screen.getByText(featured.title)).toBeTruthy();
  });

  it('renders the new default-scenarios label when primary scenarios are provided', () => {
    render(
      <ScenarioCards
        onSelect={vi.fn()}
        primaryScenarioIds={[featured.id, others[0].id]}
      />
    );
    expect(screen.getByText('Default scenarios')).toBeTruthy();
    expect(screen.getByText(featured.title)).toBeTruthy();
    expect(screen.getByText(others[0].title)).toBeTruthy();
  });

  it('renders exactly 3 secondary cards initially', () => {
    render(<ScenarioCards onSelect={vi.fn()} />);
    // The first 3 non-featured scenario titles should be visible
    for (const scenario of others.slice(0, 3)) {
      expect(screen.getByText(scenario.title)).toBeTruthy();
    }
  });

  it('does not render hidden scenarios initially', () => {
    render(<ScenarioCards onSelect={vi.fn()} />);
    for (const scenario of others.slice(3)) {
      expect(screen.queryByText(scenario.title)).toBeNull();
    }
  });

  it(`renders "+${hiddenCount} more scenarios" show-more button`, () => {
    render(<ScenarioCards onSelect={vi.fn()} />);
    expect(screen.getByText(`+${hiddenCount} more scenarios`)).toBeTruthy();
  });

  it('reveals all remaining scenarios when show-more is clicked', () => {
    render(<ScenarioCards onSelect={vi.fn()} />);
    fireEvent.click(screen.getByText(`+${hiddenCount} more scenarios`));
    for (const scenario of others) {
      expect(screen.getByText(scenario.title)).toBeTruthy();
    }
    // Show-more button should be gone
    expect(screen.queryByText(`+${hiddenCount} more scenarios`)).toBeNull();
  });

  it('calls onSelect with the featured scenario when featured card is clicked', () => {
    const onSelect = vi.fn();
    render(<ScenarioCards onSelect={onSelect} />);
    fireEvent.click(screen.getByText(featured.title));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect.mock.calls[0][0]).toEqual(featured);
  });

  it('calls onSelect with the correct scenario when a secondary card is clicked', () => {
    const onSelect = vi.fn();
    render(<ScenarioCards onSelect={onSelect} />);
    const secondaryScenario = others[0];
    fireEvent.click(screen.getByText(secondaryScenario.title));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect.mock.calls[0][0]).toEqual(secondaryScenario);
  });

  it('shows the selected scenario state when selectedScenarioId is provided', () => {
    render(
      <ScenarioCards
        onSelect={vi.fn()}
        primaryScenarioIds={[featured.id, others[0].id]}
        selectedScenarioId={featured.id}
      />
    );
    const featuredButton = screen.getByText(featured.title).closest('button');
    expect(featuredButton?.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('Selected')).toBeTruthy();
  });
});
