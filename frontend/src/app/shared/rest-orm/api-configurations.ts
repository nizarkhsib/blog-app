export class ApiConfiguration {
  url: string;
  options: any;

  constructor(
    url: string, options?: any
  ) {
    this.url = url;
    this.options = options;
  }
}
