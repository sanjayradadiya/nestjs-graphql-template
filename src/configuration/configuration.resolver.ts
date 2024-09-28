import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ConfigurationService } from './configuration.service';
import { Configuration } from './entities/configuration.entity';
import {
  CreateConfigurationInput,
  CreateConfigurationResponse,
} from './dto/create-configuration.input';
import { UpdateConfigurationInput } from './dto/update-configuration.input';
import { MutationResponse } from 'src/payloads/mutationResponse';
import { TestMailConfigurationInput } from './dto/test-configuration.input';

@Resolver(() => Configuration)
export class ConfigurationResolver {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Mutation(() => CreateConfigurationResponse)
  createConfiguration(
    @Args('createConfigurationInput')
    createConfigurationInput: CreateConfigurationInput,
  ) {
    return this.configurationService.create(createConfigurationInput);
  }

  @Query(() => [Configuration], { name: 'configurations' })
  findAll() {
    return this.configurationService.findAll();
  }

  @Query(() => Configuration, { name: 'configuration' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.configurationService.findOne(id);
  }

  @Mutation(() => MutationResponse)
  updateConfiguration(
    @Args('updateConfigurationInput')
    updateConfigurationInput: UpdateConfigurationInput,
  ) {
    return this.configurationService.update(
      updateConfigurationInput.id,
      updateConfigurationInput,
    );
  }

  @Mutation(() => MutationResponse)
  removeConfiguration(@Args('id', { type: () => String }) id: string) {
    return this.configurationService.remove(id);
  }

  @Mutation(() => MutationResponse, { name: 'testMailConfiguration' })
  async testMailConfiguration(
    @Args('testMailConfigurationInput')
    testMailConfigurationInput: TestMailConfigurationInput,
  ) {
    return this.configurationService.testEmail(testMailConfigurationInput);
  }
}
