// create-user.dto.ts
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UserRole } from '../../Utils/user-role.enum';


export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)

    @IsEnum(UserRole, { message: 'Role must be one of: admin, teacher, student' })
    role_name: UserRole;
}
