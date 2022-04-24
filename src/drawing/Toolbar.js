// @flow strict

import styles from './Toolbar.module.css';

type Props = $ReadOnly<{
	color: string,
	onColorChange: (newColor: string) => mixed,
}>;

export default function Toolbar(props: Props): React$Node {
	return (
		<div className={styles.toolbar}>
			Color:&nbsp;
			<input
				type="color"
				onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
					props.onColorChange(ev.currentTarget.value);
				}}
				value={props.color}
			/>
		</div>
	);
}
