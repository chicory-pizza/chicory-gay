// @flow strict

import styles from './Toolbar.module.css';

type Props = $ReadOnly<{
	color: string,
	onColorChange: (newColor: string) => mixed,
	onSizeChange: (newSize: number) => mixed,
	size: number,
}>;

export default function Toolbar(props: Props): React$Node {
	return (
		<div className={styles.toolbar}>
			<label>
				Color:&nbsp;
				<input
					type="color"
					onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
						props.onColorChange(ev.currentTarget.value);
					}}
					value={props.color}
				/>
			</label>
			<label>
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
		</div>
	);
}
