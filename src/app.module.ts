import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrencyRatesCommand } from './currency-rate.command';

@Module({
  imports: [],
  providers: [AppService, CurrencyRatesCommand],
})
export class AppModule {}
