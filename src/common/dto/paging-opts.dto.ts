import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class PagingOptsDto {
  /** @default 1 */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number;

  /** @default 15 */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  pageSize?: number;

  constructor() {
    this.page = 1;
    this.pageSize = 15;
  }
}
