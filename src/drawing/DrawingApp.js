// @flow strict

import {useCallback, useEffect, useState} from 'react';

import MouseStampCanvas from './MouseStampCanvas';
import useDrawStampImage from './useDrawStampImage';

export default function DrawingApp(): React$Node {
	const [mouseMoveCoordinates, setMouseMoveCoordinates] =
		useState<?[number, number]>(null);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	const drawStampCanvasImageData = useDrawStampImage();

	const onMouseMove = useCallback(
		(ev: SyntheticMouseEvent<HTMLDivElement>) => {
			const rect = ev.currentTarget.getBoundingClientRect();

			setMouseMoveCoordinates([
				parseInt(ev.clientX - rect.left, 10),
				parseInt(ev.clientY - rect.top, 10),
			]);
		},
		[setMouseMoveCoordinates]
	);

	const onMouseLeave = useCallback(
		(ev: SyntheticMouseEvent<>) => {
			setMouseMoveCoordinates(null);
		},
		[setMouseMoveCoordinates]
	);

	function onWindowResize() {
		setWindowWidth(window.innerWidth);
		setWindowHeight(window.innerHeight);
	}

	useEffect(() => {
		window.addEventListener('resize', onWindowResize);

		return () => {
			window.removeEventListener('resize', onWindowResize);
		};
	});

	const dpr = window.devicePixelRatio || 1;

	return (
		<div
			className="fullscreen absolute"
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
		>
			{/* {mouseMoveCoordinates != null ? (
				<>
					{mouseMoveCoordinates[0]}, {mouseMoveCoordinates[1]}
				</>
			) : null} */}

			<MouseStampCanvas
				dpr={dpr}
				drawStampCanvasImageData={drawStampCanvasImageData}
				mouseMoveCoordinates={mouseMoveCoordinates}
				windowHeight={windowHeight}
				windowWidth={windowWidth}
			/>
		</div>
	);
}
