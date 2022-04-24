// @flow strict

export default function drawStampToCanvas(
	ctx: CanvasRenderingContext2D,
	stampData: ImageData,
	stampX: number,
	stampY: number,
	stampSize: number,
	stampColor: string
) {
	const {data, width, height} = stampData;

	const offsetX = Math.floor((width / 2) * stampSize);
	const offsetY = Math.floor((height / 2) * stampSize);

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

			ctx.fillStyle = stampColor;
			ctx.fillRect(
				stampX - offsetX + x * stampSize,
				stampY - offsetY + y * stampSize,
				stampSize,
				stampSize
			);
		}
	}
}
