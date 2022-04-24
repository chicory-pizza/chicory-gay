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

	const [stampColor, setStampColor] = useState('#333333');
	const [stampSize, setStampSize] = useState(10);

	const {currentState, dispatch, canUndo, canRedo} = useUndoRedoReducer(
		reducer,
		{stamps: []}
	);

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
	function onPointerDown(ev: SyntheticMouseEvent<HTMLCanvasElement>) {
		if (!mouseMoveCoordinates) {
			return;
		}

		dispatch({
			type: 'newStamp',
			stamp: {
				color: stampColor,
				size: stampSize,
				x: mouseMoveCoordinates[0],
				y: mouseMoveCoordinates[1],
			},
		});
	}

	return (
		<div
			className="fullscreen absolute"
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
		>
			<Toolbar
				canRedo={canRedo}
				canUndo={canUndo}
				dispatch={dispatch}
				color={stampColor}
				onColorChange={setStampColor}
				onSizeChange={setStampSize}
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
				onPointerDown={onPointerDown}
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
