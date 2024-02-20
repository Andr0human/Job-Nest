import { type IBase } from '../../../lib/base';

interface ICountry extends IBase {
  name: string;
  code: string;
  continent: string;
  capital: string;
  population: number;
  language: string;
}

export default ICountry;
