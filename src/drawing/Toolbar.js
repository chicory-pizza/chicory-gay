// @flow strict

import type {UndoReducerAction} from '../util/useUndoRedoReducer';

import styles from './Toolbar.module.css';

type Props = $ReadOnly<{
	canRedo: boolean,
	canUndo: boolean,
	color: string,
	dispatch: (action: UndoReducerAction) => void,
	onColorChange: (newColor: string) => mixed,
	onSizeChange: (newSize: number) => mixed,
	showControls: boolean,
	size: number,
}>;

export default function Toolbar(props: Props): React$Node {
	function undo(
		ev:
			| SyntheticMouseEvent<HTMLButtonElement>
			| SyntheticTouchEvent<HTMLButtonElement>
	) {
		ev.preventDefault();
		props.dispatch({type: 'undo'});
	}

	function redo(
		ev:
			| SyntheticMouseEvent<HTMLButtonElement>
			| SyntheticTouchEvent<HTMLButtonElement>
	) {
		ev.preventDefault();
		props.dispatch({type: 'redo'});
	}

	return (
		<div
			className={
				styles.toolbar +
				' ' +
				(!props.showControls ? styles.toolbarInactive : '')
			}
		>
			<label className={styles.space}>
				Color:&nbsp;
				<input
					type="color"
					onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
						props.onColorChange(ev.currentTarget.value);
					}}
					value={props.color}
				/>
			</label>

			<label className={styles.space}>
				Size:&nbsp;
				<input
					className={styles.sizeRange}
					type="range"
					onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
						props.onSizeChange(parseInt(ev.currentTarget.value, 10));
					}}
					value={props.size}
					min="1"
					max="20"
				/>
			</label>

			<button
				className={styles.space}
				disabled={!props.canUndo}
				type="button"
				onClick={undo}
				onTouchEnd={undo}
			>
				Undo
			</button>

			<button
				disabled={!props.canRedo}
				type="button"
				onClick={redo}
				onTouchEnd={redo}
			>
				Redo
			</button>
		</div>
	);
}
