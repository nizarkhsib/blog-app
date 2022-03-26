// import { Observable } from 'rxjs';
// import { ResourceService } from '../services/backend.service';
// import { ServiceLocator } from '../services/service-locator';

// export interface RestCRUD<T> {
//   post(): Observable<T>;
//   put(): Observable<T>;
//   delete(id: number): Observable<T>;
// }

// export abstract class Entity<T> implements RestCRUD<T> {

//   url: string;
//   options: any;
//   t: T | undefined;

//   constructor(url: string, obj: any) {
//     this.url = url;
//     for (const key in obj) {
//       if (key in this) {
//         obj[key] = obj[key];
//       }
//     }
//   }

//   assignToInstance = <T>(
//     source: string,
//     object: this
//   ): T => Object.assign(object, JSON.parse(source))

//   /**
//    *
//    * @returns Observable<T>
//    */
//   public post() {
//     return new Observable<T>(observer => {
//       ServiceLocator.injector.get(BackendService)
//         .post(this.url, this)
//         .subscribe(
//           (res: T) => {
//             observer.next(this.assignToInstance<T>(JSON.stringify(res), this));
//           },
//           (error) => {
//             observer.error(error);
//           },
//           () => {
//             observer.complete();
//           });
//     });
//   }

//   /**
//    *
//    * @returns Observable<T>
//    */
//   public put() {
//     return new Observable<T>(observer => {
//       ServiceLocator.injector.get(BackendService)
//         .update(this.url + '/' + this.getId(), this)
//         .subscribe(
//           (res: T) => {
//             observer.next(this.assignToInstance<T>(JSON.stringify(res), this));
//           },
//           (error: any) => {
//             observer.error(error);
//           },
//           () => {
//             observer.complete();
//           });
//     });
//   }

//   /**
//    *
//    * @returns Observable<T>
//    */
//   public delete() {
//     return new Observable<T>(observer => {
//       ServiceLocator.injector.get(BackendService)
//         .delete(this.url + '/' + this.getId())
//         .subscribe(
//           (res: T) => {
//             observer.next(this.assignToInstance<T>(JSON.stringify(res), this));
//           },
//           (error: any) => {
//             observer.error(error);
//           },
//           () => {
//             observer.complete();
//           });
//     });
//   }

//   abstract getId(): any;

// }
