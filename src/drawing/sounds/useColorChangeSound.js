// @flow strict

import {useState} from 'react';
// $FlowFixMe[untyped-import]
import useSound from 'use-sound';

import soundFile from './paint_color_change.mp3';

export default function useColorChangeSound(): () => void {
	const [sequence, setSequence] = useState(1);

	const [play] = useSound(soundFile, {
		volume: 0.1,
		sprite: {
			'1': [0, 500],
			'2': [1000, 500],
			'3': [2000, 500],
			'4': [3000, 500],
		},
	});

	return () => {
		play({id: sequence.toString()});

		if (sequence < 4) {
			setSequence(sequence + 1);
		} else {
			setSequence(1);
		}
	};
}
