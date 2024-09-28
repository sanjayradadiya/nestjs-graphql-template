import { Injectable } from '@nestjs/common';
import { CreateModuleInput } from './dto/create-module.input';
import { UpdateModuleInput } from './dto/update-module.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { EntityEnum } from './enums/module.enum';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  async create(createModuleInput: CreateModuleInput) {
    return await this.moduleRepository.save({
      module: createModuleInput.module,
    });
  }

  async findAll() {
    return await this.moduleRepository.find();
  }

  async findOne(module: EntityEnum) {
    return await this.moduleRepository.findOne({ where: { module } });
  }

  async findOneById(id: string) {
    return await this.moduleRepository.findOne({ where: { id } });
  }

  async update(updateModuleInput: UpdateModuleInput) {
    await this.moduleRepository.update(updateModuleInput.id, {
      module: updateModuleInput.module,
    });
    return this.moduleRepository.findOne({
      where: { id: updateModuleInput.id },
    });
  }

  async remove(id: string) {
    return await this.moduleRepository.delete(id);
  }
}
