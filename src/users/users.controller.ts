import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JsonApiErrorResponseDto } from '../common/dtos/json-api-error.dto';
import { JsonApiGetUserDetailsDto, UserDto } from './dtos/user.dto';
import { RequestUser } from '../common/decorators/request-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Get(':userId')
  async getMyDetails(
    @Param('userId') userId: string,
    @RequestUser() user: UserDto,
  ): Promise<JsonApiGetUserDetailsDto | JsonApiErrorResponseDto> {
    return this.usersService.getUserDetails(userId, user);
  }
}
