import { CommandRunner, Option, Command } from 'nest-commander';
import { AppService } from './app.service';

interface CurrencyRatesOptions {
  code: string;
  date: string;
}

@Command({
  name: 'currency_rates',
})
export class CurrencyRatesCommand extends CommandRunner {
  constructor(private readonly appService: AppService) {
    super();
  }
  async run(_: string[], options: CurrencyRatesOptions) {
    try {
      console.log(
        await this.appService.getCurrencyRate(options.code, options.date),
      );
    } catch (e) {
      console.error('Error: ', e.message);
    }
  }
  @Option({
    flags: '-c, --code [number]',
    defaultValue: 'USD',
    name: 'Code',
  })
  parseCode(code: string) {
    return code;
  }
  @Option({
    flags: '-d, --date [string]',
    defaultValue: new Date().toLocaleDateString('ja-JP').replaceAll('/', '-'),
    name: 'Date',
  })
  parseDate(date: string) {
    return date;
  }
}
