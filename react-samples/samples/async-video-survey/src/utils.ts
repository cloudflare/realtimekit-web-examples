export function getElapsedDuration(date: Date) {
  return Math.floor((Date.now() - date.getTime()) / 1000);
}

export function getBrightness(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let brightness = 0;
  for (let i = 0; i < data.length; i += 4) {
    brightness +=
      (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
  }
  brightness /= data.length / 4;
  return brightness;
}
