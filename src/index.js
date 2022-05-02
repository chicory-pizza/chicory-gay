// @flow strict

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import DrawingApp from './drawing/DrawingApp';
import './index.css';
import ErrorBoundary from './ErrorBoundary';
import {paintdogConsoleText} from './util/paintdogConsoleText';

// Start
console.log(paintdogConsoleText);

const container = document.getElementById('root');
if (container == null) {
	throw new Error('App root container is missing');
}

const root = createRoot(container);
root.render(
	<StrictMode>
		<ErrorBoundary>
			<DrawingApp />
		</ErrorBoundary>
	</StrictMode>
);
