import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ModuleService } from './module.service';
import { Module } from './entities/module.entity';
import { CreateModuleInput } from './dto/create-module.input';
import { UpdateModuleInput } from './dto/update-module.input';

@Resolver(() => Module)
export class ModulesResolver {
  constructor(private readonly modulesService: ModuleService) {}

  @Mutation(() => Module)
  createModule(@Args('input') createModuleInput: CreateModuleInput) {
    return this.modulesService.create(createModuleInput);
  }

  @Query(() => [Module], { name: 'modules' })
  findAll() {
    return this.modulesService.findAll();
  }

  @Query(() => Module, { name: 'moduleById' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.modulesService.findOneById(id);
  }

  @Mutation(() => Module)
  updateModule(@Args('input') updateModuleInput: UpdateModuleInput) {
    return this.modulesService.update(updateModuleInput);
  }

  @Mutation(() => Module)
  removeModule(@Args('id', { type: () => String }) id: string) {
    return this.modulesService.remove(id);
  }
}
