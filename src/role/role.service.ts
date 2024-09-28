import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleInput } from './dto/create-role.input';
import { Role } from './entities/role.entity';
import { UpdateRoleInput } from './dto/update-role.input';
import { Permission } from '../permission/entities/permission.entity';
import { CreateRolePayload } from './payloads/createRole.payload';

@Injectable()
export class RoleService {
  private defaultValue = {
    role_type:"super admin"
  };

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    this.createDefaultValue()
  }

  private async createDefaultValue() {
    const defaultValue = await this.roleRepository.findOne({where: {role_type: this.defaultValue.role_type}});
    if (defaultValue?.role_type !== this.defaultValue.role_type) {
      return this.roleRepository.save(this.defaultValue);
    }
    return;
  }

  async create(createRoleDto: CreateRoleInput): Promise<CreateRolePayload> {
    try {
      await this.roleRepository.save({ role_type: createRoleDto.role_type });
      return {
        reason: null,
        success: true,
      };
    } catch (error) {
      return {
        reason:
          error.code === 'ER_DUP_ENTRY' ? 'This role is already exist.' : error,
        success: false,
      };
    }
  }

  async getRoleByIds(ids: Array<Role>) {
    return await this.roleRepository.find({ where: { id: In(ids) } });
  }

  findAllUser() {
    return this.roleRepository.find({ relations: ['users'] });
  }

  async findAll(filters?: any) {
    const where = {};
    if (filters?.id) {
      where['id'] = filters.id;
    }
    if (filters?.role_type) {
      where['role_type'] = filters.role_type;
    }
    if (filters?.status) {
      where['status'] = filters.status;
    }

    const roles = await this.roleRepository.find({
      where,
      relations: {
        permission: {
          module: true,
        },
      },
    });
    const _roles = roles?.map((role) => {
      const permissions = role?.permission?.map((permission) => ({
        ...permission,
        subject: permission?.module?.module,
      }));
      return {
        ...role,
        permission: permissions,
      };
    });
    return _roles;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  async update(updateRoleDto: UpdateRoleInput): Promise<CreateRolePayload> {
    try {
      const role = await this.roleRepository.findOne({
        relations: { permission: true },
        where: { id: updateRoleDto.id },
      });

      // if permission is available in updateRoleDto
      if (updateRoleDto.permissionIds) {
        const permission = await this.permissionRepository.find({
          where: { id: In(updateRoleDto.permissionIds) },
        });
        role.permission = permission;
      }

      // update role_type
      role.role_type = updateRoleDto.role_type || role.role_type;
      await this.roleRepository.save(role);
      return { success: true, role };
    } catch (error) {
      return {
        reason: error,
        success: false,
      };
    }
  }

  async remove(id: string) {
    try {
      await this.roleRepository.delete(id);
      return {
        message: 'The role has been successfully deleted.',
        success: true,
      };
    } catch (error) {
      return {
        message: error,
        success: false,
      };
    }
  }
}
