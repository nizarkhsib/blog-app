
// import { Injector } from '@angular/core';
// import { Observable } from 'rxjs';
// import { BackendService } from '../services/backend.service';
// import { ServiceLocator } from '../services/service-locator';
// import { ApiConfiguration } from './api-configurations';
// import { Constructor } from './constructor.interface';

// export class DataReader<T> {

//   // protected apiConfiguration: ApiConfiguration;
//   protected ressourceUrl: string;
//   protected options: any;
//   protected t: T | undefined;
//   protected ctr: Constructor<T>;
//   constructor(apiConfiguration: ApiConfiguration, ctr: Constructor<T>) {
//     // setTimeout(() => this._httpAuthBackendService = ServiceLocator.injector.get(BackendService));
//     // console.log('_httpAuthBackendService', this._httpAuthBackendService);
//     this.ressourceUrl = apiConfiguration.url;
//     this.options = apiConfiguration.options;
//     this.ctr = ctr;
//   }

//   assignToInstance = <T>(
//     source: string,
//     object: T
//   ): T => Object.assign(object, JSON.parse(source))

//   getAll(): Observable<T[]> {
//     return new Observable<T[]>(observer => {
//       ServiceLocator.injector.get(this.ressourceUrl, this.options)
//         .subscribe(
//           (res: T[]) => {
//             observer.next(
//               res.map(e => this.assignToInstance<T>(JSON.stringify(e), new this.ctr()))
//             );
//           },
//           (error: any) => {
//             observer.error(error);
//           },
//           () => {
//             observer.complete();
//           }
//         );
//     });
//   }

//   getOne(id: number): Observable<T> {
//     return new Observable<T>(observer => {
//       ServiceLocator.injector.get(BackendService).getOne(this.ressourceUrl + '/' + id, this.options)
//         .subscribe(
//           (res: T) => {
//             observer.next(this.assignToInstance<T>(JSON.stringify(res), new this.ctr()));
//           },
//           (error) => {
//             observer.error(error);
//           },
//           () => {
//             observer.complete();
//           }
//         );
//     });
//   }

//   getBySpecificId(key: string, value: number): Observable<T[]> {
//     return new Observable<T[]>(observer => {
//       ServiceLocator.injector.get(this.ressourceUrl + '/' + key + '/' + value, this.options)
//         .subscribe(
//           (res: T[]) => {
//             observer.next(
//               res.map(e => this.assignToInstance<T>(JSON.stringify(e), new this.ctr()))
//             );
//           },
//           (error: any) => {
//             observer.error(error);
//           },
//           () => {
//             observer.complete();
//           }
//         );
//     });
//   }
// }
