import { IsEnum, IsNotEmpty, IsString, MaxLength} from 'class-validator';
import { Role } from '../../Utils/user-role.enum';


export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @IsEnum(Role, { message: 'Role must be one of: admin, teacher, student' })
    role_name: Role;
}
