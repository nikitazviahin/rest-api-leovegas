import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { JsonApiGetUserDetailsDto, UserDto } from '../dtos/user.dto';
import { JsonApiErrorResponseDto } from '../../common/dtos/json-api-error.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUser: UserDto = {
    _id: new ObjectId(),
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.USER,
    access_token: 'some-token',
    password: 'Qwerty123',
  };

  const mockUsersService = {
    getUserDetails: jest.fn().mockResolvedValue({
      data: {
        type: 'users',
        id: mockUser._id.toString(),
        attributes: mockUser,
      },
    } as JsonApiGetUserDetailsDto),
    deleteUser: jest
      .fn()
      .mockResolvedValue({ data: null, meta: { message: 'User deleted' } }),
    updateUserDetails: jest.fn().mockResolvedValue({
      data: {
        type: 'users',
        id: mockUser._id.toString(),
        attributes: mockUser,
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should return user details', async () => {
    const result = await usersController.getUserDetails(
      mockUser._id.toString(),
      mockUser,
    );
    expect(result).toEqual({
      data: {
        type: 'users',
        id: mockUser._id.toString(),
        attributes: mockUser,
      },
    });
    expect(usersService.getUserDetails).toHaveBeenCalledWith(
      mockUser._id.toString(),
      mockUser,
    );
  });

  it('should return an error if user not found', async () => {
    mockUsersService.getUserDetails.mockResolvedValueOnce({
      errors: [{ status: '404', title: 'Not Found', detail: 'User not found' }],
    } as JsonApiErrorResponseDto);

    const result = await usersController.getUserDetails('invalid-id', mockUser);
    expect(result).toEqual({
      errors: [{ status: '404', title: 'Not Found', detail: 'User not found' }],
    });
  });

  it('should delete a user', async () => {
    const result = await usersController.deleteUser(mockUser._id.toString());
    expect(result).toEqual({ data: null, meta: { message: 'User deleted' } });
    expect(usersService.deleteUser).toHaveBeenCalledWith(
      mockUser._id.toString(),
    );
  });

  it('should update user details', async () => {
    const updateDto = { name: 'Updated Name' };
    const result = await usersController.updateUserDetails(
      mockUser._id.toString(),
      updateDto,
      mockUser,
    );
    expect(result).toEqual({
      data: {
        type: 'users',
        id: mockUser._id.toString(),
        attributes: mockUser,
      },
    });
    expect(usersService.updateUserDetails).toHaveBeenCalledWith(
      mockUser._id.toString(),
      updateDto,
      mockUser,
    );
  });
});
