import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// See: BehaviorSubject vs Observable?
// https://stackoverflow.com/questions/39494058/behaviorsubject-vs-observable
 
@Injectable()
export class CounterService {
    private _count = new BehaviorSubject<number>(0);
 
    setCount(paramCount: number) {
        this._count.next(paramCount);
    }
 
    getCount(): Observable<number> {
        return this._count.asObservable();
    }
}