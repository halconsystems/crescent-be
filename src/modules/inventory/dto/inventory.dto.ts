import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class InventoryIdParamDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}

export class CreateStoreDto {
  @ApiProperty({ example: 'Warehouse A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  storeName: string;

  @ApiPropertyOptional({ example: 'Karachi' })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  location?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateStoreDto extends CreateStoreDto {}

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  categoryName: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCategoryDto extends CreateCategoryDto {}

export class CreateGroupDto {
  @ApiProperty({ example: 'Laptops' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  groupName: string;

  @ApiPropertyOptional({ example: 'Portable computers group' })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateGroupDto extends CreateGroupDto {}

export class CreateVendorDto {
  @ApiProperty({ example: 'ABC Supplies' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  vendorName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  contactPerson?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  address?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateVendorDto extends CreateVendorDto {}

export class CreateItemDto {
  @ApiProperty({ example: 'LAP-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  sku: string;

  @ApiProperty({ example: 'Laptop Core i7' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  itemName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  groupId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  defaultStoreId?: number;

  @ApiPropertyOptional({ example: 'pcs' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  uom?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  reorderLevel?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateItemDto extends CreateItemDto {}

export class InventoryLineDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  itemId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  qty: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  note?: string;
}

export class CreatePurchaseRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  storeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  remarks?: string;

  @ApiProperty({ type: [InventoryLineDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InventoryLineDto)
  lines: InventoryLineDto[];
}

export class UpdatePurchaseRequestDto extends CreatePurchaseRequestDto {}

export class ApproveRejectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  reason?: string;
}

export class CreatePurchaseOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  purchaseRequestId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vendorId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  storeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  remarks?: string;

  @ApiProperty({ type: [InventoryLineDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InventoryLineDto)
  lines: InventoryLineDto[];
}

export class UpdatePurchaseOrderDto extends CreatePurchaseOrderDto {}

export class CreateGrnDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  purchaseOrderId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  storeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  remarks?: string;

  @ApiProperty({ type: [InventoryLineDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InventoryLineDto)
  lines: InventoryLineDto[];
}

export class UpdateGrnDto extends CreateGrnDto {}

export class CreateIssuanceDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  storeId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  issuedTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  remarks?: string;

  @ApiProperty({ type: [InventoryLineDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InventoryLineDto)
  lines: InventoryLineDto[];
}

export class UpdateIssuanceDto extends CreateIssuanceDto {}

export class CreateReturnDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  storeId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  sourceReference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  remarks?: string;

  @ApiProperty({ type: [InventoryLineDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InventoryLineDto)
  lines: InventoryLineDto[];
}

export class UpdateReturnDto extends CreateReturnDto {}

export class CreateTransferDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  fromStoreId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  toStoreId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  remarks?: string;

  @ApiProperty({ type: [InventoryLineDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InventoryLineDto)
  lines: InventoryLineDto[];
}

export class UpdateTransferDto extends CreateTransferDto {}

export class InventoryCardQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  item_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  store_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date_to?: string;
}

export class ReportQueryDto extends InventoryCardQueryDto {}

export class DropdownQueryDto {
  @ApiPropertyOptional({ example: 'stores,items,vendors,categories' })
  @IsOptional()
  @IsString()
  resources?: string;
}

export class GuardSearchQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  service_no?: string;
}

export class BulkItemsDto {
  @ApiProperty({ type: [CreateItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items: CreateItemDto[];
}

export class BulkIssuanceDto {
  @ApiProperty({ type: [CreateIssuanceDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateIssuanceDto)
  issuances: CreateIssuanceDto[];
}

export class DateRangeQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date_to?: string;
}

export class InventoryStatusPatchDto {
  @ApiProperty({ enum: ['DRAFT', 'APPROVED', 'REJECTED', 'CONFIRMED'] })
  @IsString()
  @IsIn(['DRAFT', 'APPROVED', 'REJECTED', 'CONFIRMED'])
  status: 'DRAFT' | 'APPROVED' | 'REJECTED' | 'CONFIRMED';
}
