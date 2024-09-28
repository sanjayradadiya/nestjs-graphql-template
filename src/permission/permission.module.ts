import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionResolver } from './permission.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { RoleModule } from 'src/role/role.module';
import { Role } from '../role/entities/role.entity';
import { Modules } from 'src/module/module.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role]), RoleModule, Modules],
  providers: [PermissionResolver, PermissionService],
})
export class PermissionModule {}
