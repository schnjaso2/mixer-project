import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeMmss'
})
export class TimeMmssPipe implements PipeTransform
{

  transform(seconds)
  {
    seconds = Math.floor(seconds);
    const minutesFormatted = Math.floor(seconds / 60);
    const secondsFormatted = Math.floor(seconds - minutesFormatted * 60);

    const minuteString = minutesFormatted < 10 ? `0${minutesFormatted}` : `${minutesFormatted}`;
    const secondString = secondsFormatted < 10 ? `0${secondsFormatted}` : `${secondsFormatted}`;

    return `${minuteString}:${secondString}`;
  }

}
