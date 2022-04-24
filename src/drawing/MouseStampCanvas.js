// @flow strict

import {useEffect, useRef} from 'react';

import getCanvasRenderingContext from '../util/getCanvasRenderingContext';

type Props = $ReadOnly<{
	dpr: number,
	drawStampCanvasImageData: ?ImageData,
	mouseMoveCoordinates: ?[number, number],
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
		if (props.mouseMoveCoordinates && props.drawStampCanvasImageData) {
			const [mouseX, mouseY] = props.mouseMoveCoordinates;
			const {data, width, height} = props.drawStampCanvasImageData;

			const offsetX = Math.floor((width / 2) * props.stampSize);
			const offsetY = Math.floor((height / 2) * props.stampSize);

			for (let y = 0; y < height; y += 1) {
				for (let x = 0; x < width; x += 1) {
					const dataPosition = (y * width + x) * 4;

					// white only
					if (
						data[dataPosition] !== 255 &&
						data[dataPosition + 1] !== 255 &&
						data[dataPosition + 2] !== 255 &&
						data[dataPosition + 3] !== 255
					) {
						continue;
					}

					ctx.fillStyle = props.stampColor;
					ctx.fillRect(
						mouseX - offsetX + x * props.stampSize,
						mouseY - offsetY + y * props.stampSize,
						props.stampSize,
						props.stampSize
					);
				}
			}
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}, [
		props.dpr,
		props.drawStampCanvasImageData,
		props.mouseMoveCoordinates,
		props.stampColor,
		props.stampSize,
	]);

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
