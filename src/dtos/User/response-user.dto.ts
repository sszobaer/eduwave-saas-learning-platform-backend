export class UserResponseDto {
  user_id: number;
  full_name: string;
  profile_img: string;
  role: {
    role_id: number;
    role_name: string;
  };
}
