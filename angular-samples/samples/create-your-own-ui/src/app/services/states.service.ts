import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { getInitialStates, States } from '@cloudflare/realtimekit-ui';
import { CustomStates } from '../types';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  private statesSubject = new BehaviorSubject<States>(getInitialStates());
  public states$: Observable<States> = this.statesSubject.asObservable();

  get states(): States {
    return this.statesSubject.value;
  }

  setStates(states: States): void {
    this.statesSubject.next(states);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CustomStatesService {
  private customStatesSubject = new BehaviorSubject<CustomStates>({});
  public customStates$: Observable<CustomStates> = this.customStatesSubject.asObservable();

  get customStates(): CustomStates {
    return this.customStatesSubject.value;
  }

  setCustomStates(states: CustomStates): void {
    this.customStatesSubject.next(states);
  }
}
