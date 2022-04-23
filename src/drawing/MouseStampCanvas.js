// @flow strict

import {useEffect, useRef} from 'react';

import getCanvasRenderingContext from '../util/getCanvasRenderingContext';

type Props = $ReadOnly<{
	dpr: number,
	drawStampImg: HTMLImageElement,
	mouseMoveCoordinates: ?[number, number],
	windowHeight: number,
	windowWidth: number,
}>;

export default function MouseStampCanvas(props: Props): React$Node {
	const canvasRef = useRef<?HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const ctx = getCanvasRenderingContext(canvas);
		ctx.scale(props.dpr, props.dpr);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (props.mouseMoveCoordinates) {
			ctx.drawImage(
				props.drawStampImg,
				props.mouseMoveCoordinates[0] - props.drawStampImg.width / 2,
				props.mouseMoveCoordinates[1] - props.drawStampImg.height / 2
			);
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}, [props.mouseMoveCoordinates, props.dpr, props.drawStampImg]);

	return (
		<canvas
			className="fullscreen"
			ref={canvasRef}
			width={props.windowWidth * props.dpr}
			height={props.windowHeight * props.dpr}
			style={{
				width: props.windowWidth,
				height: props.windowHeight,
			}}
		/>
	);
}
