import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsLatitude,
  IsLongitude,
  ValidateIf,
} from 'class-validator';
import { Match } from '@decorators';

export class ProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(50, { message: 'Full name cannot exceed 50 characters' })
  name: string;

  @ValidateIf((obj) => obj.password !== undefined && obj.password !== '')
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(20, { message: 'Password cannot exceed 20 characters' })
  @Matches(/(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Password must contain at least one letter and one number',
  })
  password?: string;

  @ValidateIf((obj) => obj.confirmPassword !== undefined && obj.confirmPassword !== '')
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword?: string;

  @IsOptional()
  @IsLatitude({ message: 'Latitude must be a valid coordinate' })
  latitude?: number;

  @IsOptional()
  @IsLongitude({ message: 'Longitude must be a valid coordinate' })
  longitude?: number;

  @IsString()
  @IsNotEmpty({ message: 'Timezone is required' })
  timezone: string;
}
