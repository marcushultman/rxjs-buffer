import { from, Observable, ObservableInput, OperatorFunction, Subscription } from 'rxjs';

export function buffer<T, O>(
  accumulator: (acc: O, value: T) => [O, ObservableInput<O>],
  seed: O,
): OperatorFunction<T, O> {
  let innerSub: Subscription | undefined;
  return (source: Observable<T>) =>
    new Observable((subscriber) => {
      let state = seed;
      const outerSub = source.subscribe({
        next(value) {
          let out: ObservableInput<O>;
          innerSub?.unsubscribe();
          try {
            [state, out] = accumulator(state, value);
            innerSub = from(out).subscribe({
              next: (value) => subscriber.next(value),
              error: (value) => subscriber.error(value),
            });
          } catch (error) {
            subscriber.error(error);
          }
        },
        error(error) {
          innerSub?.unsubscribe();
          subscriber.error(error);
        },
        complete() {
          innerSub?.unsubscribe();
          subscriber.next(state);
          subscriber.complete();
        },
      });
      return () => {
        innerSub?.unsubscribe();
        outerSub.unsubscribe();
      };
    });
}
