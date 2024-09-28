import { ModuleService } from './module.service';
import { ModulesResolver } from './module.resolver';
import { Module as moduleRepo } from './entities/module.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([moduleRepo])],
  providers: [ModulesResolver, ModuleService],
  exports: [ModuleService],
})
export class Modules {}
