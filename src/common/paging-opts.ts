export class PagingOpts {
  /** @default 1 */
  page: number;
  /** @default 15 */
  pageSize: number;

  constructor() {
    this.page = 1;
    this.pageSize = 15;
  }
}
