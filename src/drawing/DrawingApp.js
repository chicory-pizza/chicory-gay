// @flow strict

import {useCallback, useState} from 'react';

import styles from './DrawingApp.module.css';

export default function DrawingApp(): React$Node {
	const [mouseMoveCoordinates, setMouseMoveCoordinates] =
		useState<?[number, number]>(null);

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

	return (
		<div
			className={styles.fullscreen}
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
		>
			{mouseMoveCoordinates != null ? (
				<>
					{mouseMoveCoordinates[0]}, {mouseMoveCoordinates[1]}
				</>
			) : null}
		</div>
	);
}
