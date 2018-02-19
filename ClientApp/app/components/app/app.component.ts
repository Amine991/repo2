import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from 'primeng/primeng';
import { CounterService } from '../services/counter.service';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    CounterSubscription: Subscription;
    Counter: number;

   constructor(private _CounterService: CounterService) { }

   ngOnInit() {
       // Subscribe to the Counter service
       this.CounterSubscription = this._CounterService.getCount().subscribe(
           (count: number) => {
               this.Counter = count;
           });        
   }

   ngOnDestroy(): void {
       // Important - Unsubscribe from any subscriptions
       this.CounterSubscription.unsubscribe();
   }
}
