import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { CreateRoleInput } from './dto/create-role.input';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { UpdateRoleInput } from './dto/update-role.input';
import { GqlJwtAuthGuard } from 'src/auth/gql-jwt-auth.guard';
import {
  Permissions,
  PermissionsGuard,
} from 'src/common/guards/permission.gaurd';
import { CreateRolePayload } from './payloads/createRole.payload';
import { UpdateRolePayload } from './payloads/updateRole.payload';
import { RoleFilters } from './filters/role.filters';
import { EntityEnum } from 'src/module/enums/module.enum';
import { AllowedPermissionActionsEnum } from 'src/permission/enums/allowedPermissionActions.enum';
import { DeleteRolePayload } from './payloads/deleteRole.payload';

@Resolver(() => Role)
@UseGuards(GqlJwtAuthGuard, PermissionsGuard)
@UseInterceptors(new LoggingInterceptor())
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  @Query(() => [Role], { name: 'roles' })
  roles(
    @Args('filters', { nullable: true, defaultValue: {} })
    filters: RoleFilters,
  ): Promise<Role[]> {
    return this.roleService.findAll(filters);
  }

  @Mutation(() => CreateRolePayload, { name: 'createRole' })
  @Permissions(AllowedPermissionActionsEnum.ACCESS, EntityEnum.PERMISSIONS)
  createRole(@Args('input') createRoleInput: CreateRoleInput) {
    return this.roleService.create(createRoleInput);
  }

  @Mutation(() => UpdateRolePayload, { name: 'updateRole' })
  @Permissions(AllowedPermissionActionsEnum.ACCESS, EntityEnum.PERMISSIONS)
  updateRole(@Args('input') updateRoleDto: UpdateRoleInput) {
    return this.roleService.update(updateRoleDto);
  }

  @Mutation(() => DeleteRolePayload)
  @Permissions(AllowedPermissionActionsEnum.ACCESS, EntityEnum.PERMISSIONS)
  removeRole(@Args('id', { type: () => String }) id: string) {
    return this.roleService.remove(id);
  }
}
