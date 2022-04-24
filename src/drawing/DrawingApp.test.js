import {render, screen} from '@testing-library/react';

import DrawingApp from './DrawingApp';

test('renders', () => {
	render(<DrawingApp />);

	const colorLabel = screen.getByText(/Color:/);
	expect(colorLabel).toBeInTheDocument();

	const sizeLabel = screen.getByText(/Size:/);
	expect(sizeLabel).toBeInTheDocument();
});
