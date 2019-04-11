import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numToPx'
})
export class NumToPxPipe implements PipeTransform
{

  transform(value: number): string
  {
    return `${value}px`;
  }

}
