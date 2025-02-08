import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JsonApiErrorResponseDto } from '../common/dtos/json-api-error.dto';
import { JsonApiGetUserDetailsDto, UserDto } from './dtos/user.dto';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JsonApiGetAllUsersDetailsDto } from './dtos/get-users.dto';
import { UpdateUserByAdminDto } from './dtos/update-user-by-admin.dto';
import { JsonApiResponseDto } from '../common/dtos/json-api.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async getAllUsers(): Promise<
    JsonApiGetAllUsersDetailsDto | JsonApiErrorResponseDto
  > {
    return this.usersService.getAllUsers();
  }

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('/admin/:userId')
  async updateUserByAdmin(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserByAdminDto,
  ): Promise<JsonApiGetUserDetailsDto | JsonApiErrorResponseDto> {
    return this.usersService.updateUserByAdmin(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':userId')
  async deleteUser(
    @Param('userId') userId: string,
  ): Promise<JsonApiResponseDto<null> | JsonApiErrorResponseDto> {
    return this.usersService.deleteUser(userId);
  }
}
