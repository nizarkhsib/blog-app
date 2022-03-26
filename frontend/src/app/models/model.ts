// import { ApiConfiguration } from "../shared/rest-orm/api-configurations";
// import { Entity } from "../shared/rest-orm/entity";
// import { RestModelRead } from "../shared/rest-orm/rest-model-reader";

// export const apiName = 'localhost:3000/article';

// export interface IArticle {
//   _id: string;
//   name: string;
//   description: string;
//   content: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export class Article extends Entity<Article> {

//   _id!: string;
//   name!: string;
//   description!: string;
//   content!: string;
//   createdAt!: Date;
//   updatedAt!: Date;

//   constructor(obj?: IArticle) {
//     super('api/test/all', obj);
//   }

//   // public get getLastname(): string {
//   //     return this.lastname;
//   // }

//   // public get getFirstname(): string {
//   //     return this.firstname;
//   // }

//   // public get getFullName(): string {
//   //     return this.firstname + ' ' + this.lastname;
//   // }

//   static get getReader() {
//     return new RestModelRead<Article>(new ApiConfiguration(apiName), Article);
//   }

//   static getOne(id: number) {
//     return this.getReader.getOne(id);
//   }

//   static getAll() {
//     return this.getReader.getAll();
//   }

//   static getBySpecificId(key: string, value: number) {
//     return this.getReader.getBySpecificId(key, value);
//   }

//   getId(): string {
//     return this._id;
//   }

// }
