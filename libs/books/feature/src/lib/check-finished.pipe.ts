import { Pipe, PipeTransform } from '@angular/core';
import { STRING_CONSTANTS } from './constants/common-constants';

@Pipe({
  name: 'checkFinished'
})
export class CheckFinishedPipe implements PipeTransform {

  transform(id: string, finishedReadingListIds: string[]): string {
   if(finishedReadingListIds.includes(id)){
     return STRING_CONSTANTS.FINISHED;
   }
   else{
     return STRING_CONSTANTS.WANT_TO_READ;
   } 
  }
}
