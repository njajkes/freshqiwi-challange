import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DOMParser } from '@xmldom/xmldom';

@Injectable()
export class AppService {
  private parseDate(date: string) {
    const parsedDateString = new Date(date).toISOString().split('T')[0];

    const formatedDate = new Date(parsedDateString)
      .toLocaleDateString('ru-RU')
      .replaceAll('.', '/');

    return formatedDate;
  }

  private async getRates(date: string) {
    const parsedDateString = this.parseDate(date);

    const { data } = await axios.get<string>(
      `http://www.cbr.ru/scripts/XML_daily.asp?date_req=${parsedDateString}`,
      {
        headers: {
          Accept: 'application/xml',
        },
      },
    );

    return data;
  }

  private parseXML(xml: string) {
    return new DOMParser().parseFromString(xml, 'application/xml')
      .documentElement;
  }

  private parseTree(root: HTMLElement) {
    const children = Array.from(root.childNodes);
    const map: Record<string, { value: string; name: string }> = {};

    children.map((el) => {
      let charcode: string;
      let value: string;
      let name: string;
      Array.from(el.childNodes).forEach((key: any) => {
        if (key.nodeName.toLocaleLowerCase() === 'charcode') {
          charcode = key.firstChild.data;
        }
        if (key.nodeName.toLocaleLowerCase() === 'value') {
          value = key.firstChild.data;
        }
        if (key.nodeName.toLocaleLowerCase() === 'name') {
          name = key.firstChild.data;
        }
      });
      map[charcode] = { value, name };
    });

    return map;
  }

  private formatCurrency(code: string, name: string, value: string) {
    return `${code} (${name}): ${value}`;
  }

  async getCurrencyRate(code: string, date: string) {
    const data = await this.getRates(date);
    let codesMap: ReturnType<typeof this.parseTree>;
    try {
      const dataDomTree = this.parseXML(data);
      codesMap = this.parseTree(dataDomTree);
    } catch (e) {
      throw new Error('Incorrect input');
    }

    const result = codesMap[code];

    if (!result) {
      throw new Error('No data w/ this code at that date');
    }

    return this.formatCurrency(code, result.name, result.value);
  }
}
