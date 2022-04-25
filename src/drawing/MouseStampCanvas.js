// @flow strict

import {useEffect, useRef} from 'react';

import getCanvasRenderingContext from '../util/getCanvasRenderingContext';

import drawStampToCanvas from './drawStampToCanvas';

type Props = $ReadOnly<{
	dpr: number,
	mouseMoveCoordinates: ?[number, number],
	onPointerDown: (ev: SyntheticMouseEvent<HTMLCanvasElement>) => mixed,
	showPreview: boolean,
	stampCanvasImageData: ?ImageData,
	stampColor: string,
	stampSize: number,
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
		if (
			props.showPreview &&
			props.mouseMoveCoordinates &&
			props.stampCanvasImageData
		) {
			drawStampToCanvas(
				ctx,
				props.stampCanvasImageData,
				props.mouseMoveCoordinates[0],
				props.mouseMoveCoordinates[1],
				props.stampSize,
				props.stampColor
			);
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}, [
		props.dpr,
		props.stampCanvasImageData,
		props.mouseMoveCoordinates,
		props.showPreview,
		props.stampColor,
		props.stampSize,
	]);

	return (
		<canvas
			className="fullscreen absolute"
			ref={canvasRef}
			width={props.windowWidth * props.dpr}
			height={props.windowHeight * props.dpr}
			style={{
				width: props.windowWidth,
				height: props.windowHeight,
			}}
			onPointerDown={props.onPointerDown}
		/>
	);
}
