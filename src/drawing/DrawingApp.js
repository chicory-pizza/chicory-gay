// @flow strict

import {useCallback, useEffect, useState} from 'react';

import MouseStampCanvas from './MouseStampCanvas';
import SavedStampCanvas from './SavedStampCanvas';
import type {StampType} from './StampType';
import Toolbar from './Toolbar';
import useDrawStampImage from './useDrawStampImage';

export default function DrawingApp(): React$Node {
	const [mouseMoveCoordinates, setMouseMoveCoordinates] =
		useState<?[number, number]>(null);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	const stampCanvasImageData = useDrawStampImage();

	const [stamps, setStamps] = useState<Array<StampType>>([]);
	const [stampColor, setStampColor] = useState('#333333');
	const [stampSize, setStampSize] = useState(10);

	// Mouse movement
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
		(ev: SyntheticMouseEvent<HTMLDivElement>) => {
			setMouseMoveCoordinates(null);
		},
		[setMouseMoveCoordinates]
	);

	// Canvas resize
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

	// Stamping
	const onPointerDown = useCallback(
		(ev: SyntheticMouseEvent<HTMLDivElement>) => {
			if (!mouseMoveCoordinates) {
				return;
			}

			setStamps([
				...stamps,
				{
					color: stampColor,
					size: stampSize,
					x: mouseMoveCoordinates[0],
					y: mouseMoveCoordinates[1],
				},
			]);
		},
		[mouseMoveCoordinates, stampColor, stampSize, stamps]
	);

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			className="fullscreen absolute"
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
			onPointerDown={onPointerDown}
		>
			<Toolbar
				color={stampColor}
				onColorChange={setStampColor}
				onSizeChange={setStampSize}
				size={stampSize}
			/>

			<SavedStampCanvas
				dpr={dpr}
				stamps={stamps}
				stampCanvasImageData={stampCanvasImageData}
				windowHeight={windowHeight}
				windowWidth={windowWidth}
			/>

			<MouseStampCanvas
				dpr={dpr}
				mouseMoveCoordinates={mouseMoveCoordinates}
				stampCanvasImageData={stampCanvasImageData}
				stampColor={stampColor}
				stampSize={stampSize}
				windowHeight={windowHeight}
				windowWidth={windowWidth}
			/>
		</div>
	);
}
