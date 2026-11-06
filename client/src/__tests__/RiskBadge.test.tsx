import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiskBadge } from '../components/common/RiskBadge';

describe('RiskBadge Component', () => {
  it('renders Low Risk badge correctly', () => {
    render(<RiskBadge level="Low" />);
    expect(screen.getByText('Low Risk')).toBeDefined();
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('renders High Danger badge correctly', () => {
    render(<RiskBadge level="High" />);
    expect(screen.getByText('High Danger')).toBeDefined();
  });

  it('renders Elevated badge correctly', () => {
    render(<RiskBadge level="Elevated" />);
    expect(screen.getByText('Elevated Risk')).toBeDefined();
  });

  it('renders Watch badge correctly', () => {
    render(<RiskBadge level="Watch" />);
    expect(screen.getByText('Watch')).toBeDefined();
  });
});

