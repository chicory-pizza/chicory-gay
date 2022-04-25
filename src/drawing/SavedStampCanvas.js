// @flow strict

import {useEffect, useRef} from 'react';

import getCanvasRenderingContext from '../util/getCanvasRenderingContext';

import drawStampToCanvas from './drawStampToCanvas';
import type {StampType} from './StampType';

type Props = $ReadOnly<{
	dpr: number,
	stamps: $ReadOnlyArray<StampType>,
	stampCanvasImageData: ?ImageData,
	windowHeight: number,
	windowWidth: number,
}>;

export default function SavedStampCanvas(props: Props): React$Node {
	const canvasRef = useRef<?HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const ctx = getCanvasRenderingContext(canvas);
		ctx.scale(props.dpr, props.dpr);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (props.stampCanvasImageData && props.stamps.length) {
			for (let i = 0; i < props.stamps.length; i += 1) {
				drawStampToCanvas(
					ctx,
					props.stampCanvasImageData,
					props.stamps[i].centerOffsetX + props.windowWidth / 2,
					props.stamps[i].centerOffsetY + props.windowHeight / 2,
					props.stamps[i].size,
					props.stamps[i].color
				);
			}
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}, [
		props.dpr,
		props.stampCanvasImageData,
		props.windowWidth,
		props.windowHeight,
		props.stamps,
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
		/>
	);
}
