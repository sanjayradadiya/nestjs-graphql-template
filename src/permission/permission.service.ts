import { Injectable } from '@nestjs/common';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { ModuleService } from 'src/module/module.service';

@Injectable()
export class PermissionService {

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly moduleService: ModuleService,
  ) {}
  async create(createPermissionInput: CreatePermissionInput) {
    // const roles = await this.roleRepository.find({
    //   where: {
    //     id: In(createPermissionInput.roleIds),
    //   },
    // });

    const module = await this.moduleService.findOne(
      createPermissionInput.module,
    );

    // permission.module = module;
    // permission.role = roles;
    return await this.permissionRepository.save({
      label: createPermissionInput.label,
      key: createPermissionInput.key,
      action: createPermissionInput.action,
      module,
    });
  }

  async findAll() {
    const subquery = this.permissionRepository
      .createQueryBuilder('sub')
      .select('DISTINCT(sub.moduleId)')
      .getQuery();

    const data = await this.permissionRepository
      .createQueryBuilder('permission')
      .leftJoinAndSelect('permission.module', 'module')
      .where(`module.id IN (${subquery})`)
      .getMany();

    const permissionArray = data?.map((permission) => ({
      ...permission,
      subject: permission?.module?.module,
    }));

    return permissionArray;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  async update(updatePermissionInput: UpdatePermissionInput) {
    const module = await this.moduleService.findOne(
      updatePermissionInput.module,
    );
    await this.permissionRepository.update(updatePermissionInput.id, {
      label: updatePermissionInput.label,
      module,
    });
    return this.permissionRepository.findOne({
      where: { id: updatePermissionInput.id },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
