import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export class ReqLoginUser {
  @IsNotEmpty({ message: "parameter email should not be empty" })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "parameter password should not be empty" })
  @IsString({ message: "parameter password should be string" })
  password: string;
}

export class ReqRegisterUser extends ReqLoginUser {
  @IsString({ message: "parameter firstName should be string" })
  @IsNotEmpty({ message: "parameter firstName is needed" })
  firstName: string;

  @IsString({ message: "parameter lastName should be string" })
  @IsNotEmpty({ message: "parameter lastName is needed" })
  lastName: string;
}
