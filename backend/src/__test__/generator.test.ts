import fs from 'fs';
import generateCsv from '../lib/utils/JobListing';

describe('Random data generator test', () => {
    test('generator test', async () => {
        const uniqueSuffix: string = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const csvPath: string = `./public/data/file-${uniqueSuffix}.csv`;

        await generateCsv(csvPath, 10, 1000);

        const doesCsvExist: boolean = fs.existsSync(csvPath);
        expect(doesCsvExist).toBe(true);

        fs.unlinkSync(csvPath);
    });
});
