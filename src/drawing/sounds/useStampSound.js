// @flow strict

import {useState} from 'react';
// $FlowFixMe[untyped-import]
import useSound from 'use-sound';

import soundFile from './paint_stamp.mp3';

const ORIGINAL_SEQUENCE = ['1', '2', '3', '4', '5', '6', '7'];

function shuffleArray(array: Array<string>): Array<string> {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array;
}

export default function useStampSound(): () => void {
	const [sequence, setSequence] = useState(
		shuffleArray([...ORIGINAL_SEQUENCE])
	);

	const [play] = useSound(soundFile, {
		volume: 0.2,
		sprite: {
			'1': [0, 500],
			'2': [1000, 500],
			'3': [2000, 500],
			'4': [3000, 500],
			'5': [4000, 500],
			'6': [5000, 500],
			'7': [6000, 500],
		},
	});

	return () => {
		const id = sequence[0];
		if (sequence.length <= 1) {
			setSequence(shuffleArray([...ORIGINAL_SEQUENCE]));
		} else {
			setSequence(sequence.slice(1));
		}

		play({id});
	};
}
