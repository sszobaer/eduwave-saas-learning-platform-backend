import { Body, Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "src/guards/auth.guard";
import { UserService } from "src/services/user.service";

interface RequestWithUser extends Request {
    user: { sub: number; role: string };
}
@Controller('user')
export class UserController {
    authService: any;
    constructor(private readonly UserService: UserService) { }

    @Get('me')
    @UseGuards(AuthGuard)
    async getMe(@Req() req: RequestWithUser) {
        return this.UserService.findOne(req.user.sub);
    }
}