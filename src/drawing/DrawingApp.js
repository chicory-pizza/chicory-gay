// @flow strict

import {useCallback, useEffect, useState} from 'react';

import useUndoRedoReducer from '../util/useUndoRedoReducer';
import type {UndoReducerAction} from '../util/useUndoRedoReducer';

import MouseStampCanvas from './MouseStampCanvas';
import SavedStampCanvas from './SavedStampCanvas';
import type {StampType} from './StampType';
import Toolbar from './Toolbar';
import useDrawStampImage from './useDrawStampImage';

type ReducerState = $ReadOnly<{
	stamps: $ReadOnlyArray<StampType>,
}>;

type ReducerAction = UndoReducerAction | {type: 'newStamp', stamp: StampType};

function reducer(state: ReducerState, action: ReducerAction): ReducerState {
	switch (action.type) {
		case 'newStamp':
			return {
				...state,
				stamps: state.stamps.concat(action.stamp),
			};

		default:
			throw new Error('Unknown reducer action ' + action.type);
	}
}

export default function DrawingApp(): React$Node {
	const [mouseMoveCoordinates, setMouseMoveCoordinates] =
		useState<?[number, number]>(null);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	const stampCanvasImageData = useDrawStampImage();

	const [drawingActive, setDrawingActive] = useState(false);
	const [stampColor, setStampColor] = useState('#333333');
	const [stampSize, setStampSize] = useState(10);

	const {currentState, dispatch, canUndo, canRedo} = useUndoRedoReducer(
		reducer,
		{stamps: []}
	);

	// Mouse movement for stamp preview
	// We don't want this for touch though
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

	// Color change
	const onWheel = useCallback(
		(ev: SyntheticWheelEvent<HTMLDivElement>) => {
			let newColor = '';
			for (let i = 1; i <= 6; i += 1) {
				newColor += (~~(Math.random() * 16)).toString(16);
			}

			setStampColor('#' + newColor);
		},
		[setStampColor]
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
	function onPointerDown(ev: SyntheticPointerEvent<HTMLCanvasElement>) {
		// Always get the current pointer position
		const rect = ev.currentTarget.getBoundingClientRect();

		const x = parseInt(ev.clientX - rect.left, 10);
		const y = parseInt(ev.clientY - rect.top, 10);

		let newStampSize = stampSize;
		if (!drawingActive) {
			// Original image is 1280x1280
			// Auto-set the stamp size on first use
			newStampSize = Math.round((windowHeight / 1280) * 10);
			setStampSize(newStampSize);

			setDrawingActive(true);
		}

		dispatch({
			type: 'newStamp',
			stamp: {
				centerOffsetX: x - windowWidth / 2,
				centerOffsetY: y - windowHeight / 2,
				color: stampColor,
				size: newStampSize,
			},
		});

		setMouseMoveCoordinates(null);
	}

	return (
		<div
			className="fullscreen absolute"
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
			onWheel={onWheel}
		>
			<Toolbar
				canRedo={canRedo}
				canUndo={canUndo}
				dispatch={dispatch}
				color={stampColor}
				onColorChange={setStampColor}
				onSizeChange={setStampSize}
				showControls={drawingActive}
				size={stampSize}
			/>

			<SavedStampCanvas
				dpr={dpr}
				stamps={currentState.stamps}
				stampCanvasImageData={stampCanvasImageData}
				windowHeight={windowHeight}
				windowWidth={windowWidth}
			/>

			<MouseStampCanvas
				dpr={dpr}
				mouseMoveCoordinates={mouseMoveCoordinates}
				onPointerDown={onPointerDown}
				showPreview={drawingActive}
				stampCanvasImageData={stampCanvasImageData}
				stampColor={stampColor}
				stampSize={stampSize}
				windowHeight={windowHeight}
				windowWidth={windowWidth}
			/>
		</div>
	);
}
