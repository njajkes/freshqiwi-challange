#!/usr/bin/env node
import { AppModule } from './app.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  CommandFactory.run(AppModule);
}
bootstrap();
