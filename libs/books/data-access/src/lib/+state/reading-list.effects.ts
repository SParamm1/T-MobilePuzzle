import { Injectable, OnDestroy } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { fetch, optimisticUpdate } from '@nrwl/angular';
import * as ReadingListActions from './reading-list.actions';
import { HttpClient } from '@angular/common/http';
import {
  ReadingListItem,
  SnackbarAddMessage,
  SnackbarRemoveMessage,
  SnackbarAction,
  SnackbarOptions
} from '@tmo/shared/models';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ReadingListEffects implements OnInitEffects, OnDestroy {
  addSnackbarRef;
  removeSnackbarRef;
  addSnackbarSubscription;
  removeSnackbarSubscription;

  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.loadReadingList),
      fetch({
        run: () => {
          return this.http
            .get<ReadingListItem[]>('/api/reading-list')
            .pipe(
              map(data =>
                ReadingListActions.loadReadingListSuccess({ list: data })
              )
            );
        },
        onError: (action, error) => {
          console.error('Error', error);
          return ReadingListActions.loadReadingListError({ error });
        }
      })
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      optimisticUpdate({
        run: ({ book, withUndo }) => {
          if (withUndo) {
            this.addSnackbarRef = this.snackbar.open(
              SnackbarAddMessage,
              SnackbarAction,
              SnackbarOptions
            );
            this.addSnackbarSubscription = this.addSnackbarRef.onAction().subscribe(() => {
              const { id, ...rest } = book;
              this.store.dispatch(
                ReadingListActions.removeFromReadingList({
                  item: { bookId: id, ...rest },
                  withUndo: false
                })
              );
            });
          }
          return this.http.post('/api/reading-list', book).pipe(
            map(() =>
              ReadingListActions.confirmedAddToReadingList({
                book
              })
            )
          );
        },
        undoAction: ({ book }) => {
          this.addSnackbarRef.dismiss();
          return ReadingListActions.failedAddToReadingList({
            book
          });
        }
      })
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      optimisticUpdate({
        run: ({ item, withUndo }) => {
          if (withUndo) {
            this.removeSnackbarRef = this.snackbar.open(
              SnackbarRemoveMessage,
              SnackbarAction,
              SnackbarOptions
            );
            this.removeSnackbarSubscription = this.removeSnackbarRef.onAction().subscribe(() => {
              const { bookId, ...rest } = item;
              this.store.dispatch(
                ReadingListActions.addToReadingList({
                  book: { id: bookId, ...rest },
                  withUndo: false
                })
              );
            });
          }
          return this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
            map(() =>
              ReadingListActions.confirmedRemoveFromReadingList({
                item
              })
            )
          );
        },
        undoAction: ({ item }) => {
          this.removeSnackbarRef.dismiss();
          return ReadingListActions.failedRemoveFromReadingList({
            item
          });
        }
      })
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.loadReadingList();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store,
    private snackbar: MatSnackBar
  ) {}

  ngOnDestroy() {
    this.addSnackbarSubscription.unsubscribe();
    this.removeSnackbarSubscription.unsubscribe();
  }
}
