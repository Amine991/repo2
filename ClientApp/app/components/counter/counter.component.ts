import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CounterService } from '../services/counter.service';

@Component({
    selector: 'counter',
    templateUrl: './counter.component.html'
})
export class CounterComponent implements OnInit, OnDestroy {

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

    public incrementCounter() {
        // Increase the count
        this.Counter++;

        // Set the new count
        // and update any subscribed clients
        this._CounterService.setCount(this.Counter);
    }

    ngOnDestroy(): void {
        // Important - Unsubscribe from any subscriptions
        this.CounterSubscription.unsubscribe();
    }
}
