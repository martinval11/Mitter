import Nav from './Nav';
import { render, screen } from '@testing-library/react';

describe('<Nav />', () => {
  test('Renders correctly', () => {
    render(<Nav />);

    const getText = screen.getByText(/Nav/i);
    expect(getText).toBeInTheDocument();
  });
});
