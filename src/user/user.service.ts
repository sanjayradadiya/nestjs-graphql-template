import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { UserStatusEnum } from '../types/user/user';
import { UserValidatorsHelperClass } from './helpers/user.validator';
import { PasswordManagerHelperClass } from './helpers/passwordManager.helper';
import { Role } from '../role/entities/role.entity';
import {
  FirebaseInput,
  ResetPasswordInput,
  UpdateUserInput,
} from './dto/update-user.input';
import { ConfigService } from '@nestjs/config';
import { UserFilleter } from './dto/filter-user';
import { SetPasswordInput } from './types/user.interface';
import { UserList } from './types/userList';
import { map, flatMap, uniq, isEmpty } from 'lodash';
import { NotificationService } from '../notification/notification.service';
import { NotificationList } from './payloads/notifications.payload';
import { MarkReadPayload } from './payloads/markRead.payload';

@Injectable()
export class UserService {
  private defaultValue = {
    email:"super.admin.test456@yopmail.com",
    roleIds:["b23cba54-a68d-48a6-97a3-f2aaddab67fc"],
    status: UserStatusEnum.ACTIVE,
    password: "Admin@1234",
    firstName: 'Super',
    lastName: 'Admin',
    mobileNumber: '1234567890',
    dob: '1995-12-17',
    joiningDate: '2021-12-17',
  };
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private mailService: MailService,
    private userValidatorsHelper: UserValidatorsHelperClass,
    private passwordManagerHelper: PasswordManagerHelperClass,
    private service: ConfigService,
    private notificationService: NotificationService,
  ) {
    this.initializeBaseUrl();
    this.createDefaultValue();
  }

  base_url: string;
  async initializeBaseUrl() {
    this.base_url = await this.service.get('FRONT_END_BASE_URL');
  }

  private async createDefaultValue() {
    const defaultValue = await this.userRepository.findOne({where: {email: this.defaultValue.email}});
    const roleId = await this.rolesRepository.findOne({where: {role_type: 'super admin'}});
    this.defaultValue.roleIds = [`${roleId?.id}`]

    if (defaultValue?.email !== this.defaultValue.email) {
      return this.create(this.defaultValue);
    }
  }

  async create(createUserInput: CreateUserInput) {
    const user: User = new User();

    const encryptedPassword = await this.passwordManagerHelper.encryptPassword(
      createUserInput.password || 'Welcome@1234',
    );

    const roles = await this.rolesRepository.find({
      where: { id: In(createUserInput.roleIds) },
    });
    user.firstName = createUserInput.firstName;
    user.lastName = createUserInput.lastName;
    user.email = createUserInput.email;
    user.dob = createUserInput.dob;
    user.joiningDate = createUserInput.joiningDate;
    user.mobileNumber = createUserInput.mobileNumber;
    user.password = encryptedPassword;
    user.roles = roles;
    user.status = createUserInput.status;
    
    return this.userRepository
      .save(user)
      .then(async () => {
        // await this.mailService.sendInvitationLink(user);
        return {
          valid: true,
          message: 'The new employee has been successfully added.',
        };
      })
      .catch((error) => {
        console.log('check error ===>', error);
        return {
          valid: false,
          message:
            error.code === 'ER_DUP_ENTRY'
              ? 'The employee is already a member of the Nest backend graphql template.'
              : 'Something went to wrong.',
        };
      });
  }

  async addUser(CreateUserInput: CreateUserInput) {
    const user: User = new User();
    user.firstName = CreateUserInput.firstName;
    user.lastName = CreateUserInput.lastName;
    user.email = CreateUserInput.email;
    user.password = CreateUserInput.password;
    user.dob = CreateUserInput.dob;
    user.joiningDate = CreateUserInput.joiningDate;
    // user.roles = CreateUserInput.roleIds;
    await this.mailService.sendInvitationLink(user);
  }

  async verifyEmail(req, res) {
    try {
      // Assuming req.token contains the correct token value
      const token = req.token;

      // Validate the set password input
      await this.userValidatorsHelper.validateSetPasswordInput(req);
      const activeAccountRedirectUrl = `${this.base_url}/activate-account?token=${token}`;

      // Redirect to the activate-account page
      return res.redirect(301, activeAccountRedirectUrl);
    } catch (error) {
      // Handle validation errors or other errors appropriately
      console.error('Error during email verification:', error);
      // You might want to redirect to an error page or do something else here
      return res.status(500).send('Internal Server Error');
    }
  }

  async setPassword(req: SetPasswordInput) {
    try {
      const { password } = req;

      const user = await this.userValidatorsHelper.validateSetPasswordInput(
        req,
      );
      const encryptedPassword =
        await this.passwordManagerHelper.encryptPassword(password);
      const result = await this.setUserPassword(user?.id, encryptedPassword);
      await this.userRepository.update(user.id, {
        firstName: req.firstName,
        lastName: req.lastName,
      });

      return result;
    } catch (error) {
      console.log('error ===>', error);
    }
  }

  async setUserPassword(userId, password) {
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          password,
          updatedAt: new Date().toISOString(),
          status: UserStatusEnum.ACTIVE,
        })
        .where('id = :id', { id: userId })
        .execute();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(resetPasswordInput: ResetPasswordInput) {
    const response = { message: '', valid: false };
    const user = await this.userRepository.findOne({
      where: { email: resetPasswordInput.email },
    });
    if (user) {
      const checkOldPasswordValid =
        await this.passwordManagerHelper.comparePassword({
          password: resetPasswordInput.oldPassword,
          user,
        });
      if (checkOldPasswordValid) {
        try {
          const encryptedPassword =
            await this.passwordManagerHelper.encryptPassword(
              resetPasswordInput.newPassword,
            );
          const result = await this.setUserPassword(user.id, encryptedPassword);
          if (result) {
            response.message = 'Password changed successfully!';
            response.valid = true;
          }
        } catch (error) {
          console.log('check error ===>', error);
          response.message = 'Something went to wrong';
        }
      } else {
        response.message = 'The old password does not match.';
      }
    } else {
      response.message = "User does'n exist";
    }
    return response;
  }
  
  async findAll(filter?: Partial<UserFilleter>): Promise<UserList> {
    const { pageNumber, pageSize, searchString = '' } = filter;
    const status = UserStatusEnum[filter.status];
    console.log('user Filter =>', filter);

    delete filter.pageNumber;
    delete filter.pageSize;
    delete filter.searchString;

    let whereCondition: any = { ...filter, status: status };
    if (searchString && searchString.length > 0) {
      whereCondition = [
        { ...whereCondition, firstName: Like(`%${searchString}%`) },
        { ...whereCondition, lastName: Like(`%${searchString}%`) },
      ];
    }
    const usersList = await this.userRepository.find({
      where: whereCondition,
      order: {
        firstName: 'ASC',
      },
      relations: ['roles'],
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = (
      await this.userRepository.find({
        where: whereCondition,
        relations: ['roles'],
      })
    ).length;

    return {
      data: usersList,
      pageNumber: pageNumber,
      totalCount: totalCount,
    };
  }

  getAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { status: UserStatusEnum.ACTIVE },
      relations: ['roles'],
    });
  }

  async findCurrentUser(id: string): Promise<User> {
    const userData = await this.userRepository.findOne({
      where: { id },
      relations: {
        roles: {
          permission: {
            module: true,
          },
        }
      },
    });
    const isSuperAdmin = userData.roles.find(
      (roles) => roles.role_type === 'Super Admin',
    );
    const permissionArray = userData.roles.map((r) => r.permission);
    const permissionNames = flatMap(permissionArray, (innerArray) => {
      return map(innerArray, (permission) => ({
        ...permission,
        subject: permission?.module?.module,
      }));
    });
    const modules = flatMap(permissionArray, (innerArray) => {
      return map(innerArray, (permission) => permission.module.module);
    });

    const uniqModule = uniq(modules);
    userData.permissions = permissionNames;
    userData.modules = uniqModule;
    userData.isSuperAdmin = isEmpty(isSuperAdmin);
    return userData;
  }

  async findOne(filter?: Partial<UserFilleter>) {
    return await this.userRepository.findOne({
      where: {
        ...filter,
      },
      relations: ['roles'],
    });
  }

  async findOneById(id: string) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['roles', 'roles.permission', 'roles.permission.module'],
    });
  }

  async update(
    updateUserInput: UpdateUserInput,
    currentUserId: string,
    isProfile: boolean,
  ) {
    try {
      const oldUserData = await this.findOne({
        id: isProfile ? currentUserId : updateUserInput.id,
      });
      const {
        firstName,
        lastName,
        mobileNumber,
        location,
        description,
        dob,
        joiningDate,
      } = updateUserInput;
      const user: User = new User();
      if (firstName) {
        oldUserData.firstName = firstName;
      }
      if (lastName) {
        oldUserData.lastName = lastName;
      }
      if (mobileNumber) {
        oldUserData.mobileNumber = mobileNumber;
      }
      if (location) {
        oldUserData.location = location;
      }

      if (dob) {
        oldUserData.dob = dob;
      }

      if (joiningDate) {
        oldUserData.joiningDate = joiningDate;
      }

      if (description) {
        oldUserData.description = description;
      }

      if (updateUserInput.roleIds?.length) {
        const roles = await this.rolesRepository.find({
          where: { id: In(updateUserInput.roleIds) },
        });

        oldUserData.roles = roles;
      }
      if (updateUserInput.email !== oldUserData.email) {
        oldUserData.email = updateUserInput.email;
      }
      return await this.userRepository.save({
        ...oldUserData,
        ...user,
      });
    } catch (error) {
      console.log('error', error);
    }
  }

  async remove(id: string) {
    try {
      const valid = true;
      await this.userRepository.update(id, {
        status: UserStatusEnum.DELETED,
      });
      return { message: 'The employee has been successfully deleted.', valid };
    } catch (error) {
      console.log(error);
      return { message: 'Something went to wrong.', valid: false };
    }
  }

  /**
   * This api is used to update user details
   *
   * @param id
   * @param user
   */
  updateUser(id: string, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  /**
   * This api is used to save user
   *
   * @param user
   */
  saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  /**
   * This api is used to get user details by email
   *
   * @param email
   */
  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  /**
   * This api is used to get user details
   *
   * @param id
   * @param relations
   */
  findUserById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        roles: {
          permission: true,
        },
      },
    });
  }

  async setFirebaseToken(user: User, token: FirebaseInput) {
    const { token: firebaseToken } = token;
    try {
      await this.userRepository.update(user.id, { firebaseToken });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async loginStatus(userId: string, isLogin: boolean) {
    try {
      await this.userRepository.update(userId, { isLogin });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  loginUsers() {
    return this.userRepository.find({ where: { isLogin: true } });
  }

  async revert(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      await this.userRepository.update(id, {
        status: UserStatusEnum.EMAIL_NOT_VERIFIED,
      });
      await this.mailService.sendInvitationLink(user);
      return {
        message: 'The employee has been reverted successfully.',
        success: true,
      };
    } catch (error) {
      console.log(error);
      return { message: error, success: false };
    }
  }

  async superAdminList() {
    const usersList = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where('role.role_type = :roleType', { roleType: 'Super Admin' })
      .andWhere('user.status = :status', { status: UserStatusEnum.ACTIVE })
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.firebaseToken',
      ])
      .getMany();

    return usersList;
  }

  async notificationList(userId): Promise<NotificationList> {
    const notifications = await this.notificationService.findNotifications(
      userId,
    );
    return notifications;
  }

  async markReadNotification(data, userId): Promise<MarkReadPayload> {
    const { notificationIds, markAll } = data;
    const notifications = await this.notificationService.readNotifications(
      notificationIds,
      userId,
      markAll,
    );
    return notifications;
  }
}
