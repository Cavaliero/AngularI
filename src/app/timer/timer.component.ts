import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TimerService } from './timer.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  providers: [TimerService],
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerComponent implements OnInit, OnDestroy {

  @Output() onComplete = new EventEmitter<void>();
  @Input() init:number = 20;
  //Para evitar memory leaks
  private countdownEndSubscription: Subscription = null;
  private countdownSubscription: Subscription = null;
  private countdown: number = 0;

  get  progress(){
    console.log('getting progress');
    return (this.init-(this.countdown))/this.init*100;
  }

  constructor(public timer: TimerService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.timer.restartCountdown(this.init);

    //No devuelve valor, anuncia que ha acabado la cuenta. Devuelve un Observable
    this.countdownEndSubscription = this.timer.countdownEnd$.subscribe(() => {
      this.onComplete.emit();
    });
    this.countdownSubscription = this.timer.countdown$.subscribe(
      (data) => {
        this.countdown = data;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy():void{
    this.timer.destroy();
    this.countdownEndSubscription.unsubscribe();
    this.countdownSubscription.unsubscribe();
  }

}
