import { BaseRepository } from '../../../lib/base';
import type ICountry from '../entities/ICountry';
import countryModel from './model';

class CountryRepository extends BaseRepository<ICountry> {
    constructor() {
        super(countryModel);
    }

    seed = async (country: ICountry): Promise<void> => {
        const existingCountry: ICountry | null = await this.getByName(country.name);

        if (!existingCountry) {
            await this.createOne(country);
        }
    };

    // Get all countries
    getAll = async (): Promise<ICountry[] | null> => {
        const result: ICountry[] | null = await this.findAll();
        return result;
    };

    // Get a country by its name
    getByName = async (name: string): Promise<ICountry | null> => {
        const result: ICountry | null = await this.model.findOne({ name });
        return result;
    };
}

export default CountryRepository;
