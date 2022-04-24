// @flow strict

import {useEffect, useState} from 'react';

import getCanvasRenderingContext from '../util/getCanvasRenderingContext';

import templateImg from './draw_stamp.png';

export default function useDrawStampImage(): ?ImageData {
	const [drawStampCanvasImageData, setDrawStampCanvasImageData] =
		useState<?ImageData>(null);

	useEffect(() => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;

			const ctx = getCanvasRenderingContext(canvas);
			ctx.drawImage(img, 0, 0);

			setDrawStampCanvasImageData(
				ctx.getImageData(0, 0, canvas.width, canvas.height)
			);
		};
		img.src = templateImg;
	}, []);

	return drawStampCanvasImageData;
}
