import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CounterService } from '../services/counter.service';

import {
    ButtonModule,
    GrowlModule,
    Message
} from 'primeng/primeng';

@Component({
    selector: 'counter',
    templateUrl: './prime.component.html'
})
export class PrimeComponent implements OnInit, OnDestroy {
    public msgs: Message[] = [];

    CounterSubscription: Subscription;
    Counter: number;

    constructor(private _CounterService: CounterService) { }

    ngOnInit() {
        // Subscribe to the Counter service
        this.CounterSubscription = this._CounterService.getCount().subscribe(
            (count: number) => {
                this.Counter = count;
            });

        this.msgs = [];
    }

    public incrementCounter() {
        // Increase the count
        this.Counter++;

        // Set the new count
        // and update any subscribed clients
        this._CounterService.setCount(this.Counter);

        this.msgs.push(
            {
                severity: 'info',
                summary: 'Info Message',
                detail: this.Counter.toString()
            });
    }

    ngOnDestroy(): void {
        // Important - Unsubscribe from any subscriptions
        this.CounterSubscription.unsubscribe();
    }
}
