import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches, IsOptional, IsLatitude, IsLongitude
} from "class-validator";
import { Match } from '../decorators/match.decorator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(50, { message: 'Full name cannot exceed 50 characters' })
  name: string;

  @IsNotEmpty({ message: 'Username is required' })
  @MaxLength(50, { message: 'Username cannot exceed 50 characters' })
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(20, { message: 'Password cannot exceed 20 characters' })
  @Matches(/(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('password', {
    message: 'Passwords do not match',
  })
  confirmPassword: string;

  @IsLatitude({ message: 'Latitude must be a valid coordinate' })
  latitude: number;

  @IsLongitude({ message: 'Longitude must be a valid coordinate' })
  longitude: number;

  @IsNotEmpty({ message: 'Timezone is required' })
  timezone: string;
}
