import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCounts = 0;
  constructor(private spinnerService: NgxSpinnerService) {

  }

busy(){
  this.busyRequestCounts++;
  this.spinnerService.show(undefined, {
    type:'timer',
    bdColor:'rgb(255,255,255,0.7)',
    color:'#333333'
  });
}
 idle(){
   this.busyRequestCounts--;
   if(this.busyRequestCounts<=0){
     this.busyRequestCounts=0;
     this.spinnerService.hide();
   }
 }
}

