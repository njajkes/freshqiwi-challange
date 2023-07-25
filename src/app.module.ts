import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrencyRatesCommand } from './app.command';

@Module({
  imports: [],
  providers: [AppService, CurrencyRatesCommand],
})
export class AppModule {}
