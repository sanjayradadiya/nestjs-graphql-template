import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';

@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Mutation(() => Permission)
  createPermission(
    @Args('input') createPermissionInput: CreatePermissionInput,
  ) {
    return this.permissionService.create(createPermissionInput);
  }

  @Query(() => [Permission], { name: 'permissions' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Query(() => Permission, { name: 'permission' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.permissionService.findOne(id);
  }

  @Mutation(() => Permission)
  updatePermission(
    @Args('input') updatePermissionInput: UpdatePermissionInput,
  ) {
    return this.permissionService.update(updatePermissionInput);
  }

  @Mutation(() => Permission)
  removePermission(@Args('id', { type: () => Int }) id: number) {
    return this.permissionService.remove(id);
  }
}
