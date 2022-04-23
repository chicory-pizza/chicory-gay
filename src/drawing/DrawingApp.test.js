import {render, screen} from '@testing-library/react';

import DrawingApp from './DrawingApp';

test('renders', () => {
	render(<DrawingApp />);

	const linkElement = screen.getByText(/Hello world/i);
	expect(linkElement).toBeInTheDocument();
});
