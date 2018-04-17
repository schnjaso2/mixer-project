import { Injectable } from '@angular/core';

@Injectable()
export class VisualsService
{
  public canvasWidth: number;

  public renderWaveForm(audioBuffer: AudioBuffer, canvas: HTMLCanvasElement)
  {
    const canvasContext = canvas.getContext('2d');
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const step = Math.ceil(sampleRate / 100);
    const songLength = channelData.length / step;

    // ____________________________________________________Pre Render Canvas
    const render = document.createElement('canvas');
    this.canvasWidth = render.width = canvas.width = songLength;
    render.height = canvas.height;
    const renderContext = render.getContext('2d');
    const amplitude = render.height / 2;

    for (let i = 0; i < songLength; i++)
    {
      let min = 1.5;
      let max = -1.5;
      let datum;
      for (let j = 0; j < step; j++)
      {
        datum = channelData[(i * step) + j];
        if (datum < min)
        {
          min = datum;
        }
        if (datum > max)
        {
          max = datum;
        }
      }

      // renderContext.fillStyle = `rgb(${Math.abs(max) * 255}, ${127}, ${127})`;
      renderContext.fillStyle = '#f39c12';
      renderContext.fillRect(i, (1 + min) * amplitude, 1, Math.max(1, (max - min) * amplitude));
    }
    canvasContext.drawImage(render, 0, 0);
  }
}
