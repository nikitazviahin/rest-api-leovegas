import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JsonApiErrorResponseDto } from '../common/dtos/json-api-error.dto';
import { JsonApiGetUserDetailsDto, UserDto } from './dtos/user.dto';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Get(':userId')
  async getUserDetails(
    @Param('userId') userId: string,
    @RequestUser() user: UserDto,
  ): Promise<JsonApiGetUserDetailsDto | JsonApiErrorResponseDto> {
    return this.usersService.getUserDetails(userId, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Put(':userId')
  async updateUserDetails(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
    @RequestUser() user: UserDto,
  ): Promise<JsonApiGetUserDetailsDto | JsonApiErrorResponseDto> {
    return this.usersService.updateUserDetails(userId, dto, user);
  }
}
