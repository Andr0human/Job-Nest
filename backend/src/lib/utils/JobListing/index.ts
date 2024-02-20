/* eslint-disable no-console */

import { CsvWriter } from 'csv-writer/src/lib/csv-writer';
import { ObjectMap } from 'csv-writer/src/lib/lang/object';
import IJobListing from '../../../module/job/entities/IJobListing';
import generateFakeJobListing from './generator';
import getCsvWriter from './writer';

/**
 * Generate csv records (simplified)
 * Will throw javascript heap memory error on record_size ~ 1M

    // Create records
    const records: IJobListing[] = Array.from({ length }, () => generateFakeJobListing());

    // Save to cs file
    await csvWriter.writeRecords(records);
* */

const generateRecords = async (
    csvWriter: any,
    length: number,
): Promise<void> => {
    // Create records
    const records: IJobListing[] = Array.from({ length }, () => generateFakeJobListing());

    // Save to csv file
    await csvWriter.writeRecords(records);
};

// Generate csv records using batch-process
const generateCsv = async (
    csvPath: string,
    totalRecords: number,
    batchSize: number,
): Promise<void> => {
    console.time('generateData');

    const csvWriter: CsvWriter<ObjectMap<any>> = getCsvWriter(csvPath);
    let recordsGenerated: number = 0;

    /* eslint-disable no-await-in-loop */
    while (recordsGenerated < totalRecords) {
        const length: number = Math.min(batchSize, totalRecords - recordsGenerated);

        await generateRecords(csvWriter, length);

        recordsGenerated += length;
        console.log(`${recordsGenerated} job listings created!`);
    }

    console.timeEnd('generateData');
};

(async (): Promise<void> => {
    if (process.argv.length < 3) {
        return;
    }

    if (process.argv[2] !== 'run') {
        return;
    }

    const numberOfJobListings: number = parseInt(process.argv[3] ?? '20', 10);
    const csvName: string = process.argv[4] ?? 'job_listing';

    const csvPath: string = `../../../../public/data/${csvName}.csv`;
    const batchSize: number = 25000;

    await generateCsv(csvPath, numberOfJobListings, batchSize);
})();

export default generateCsv;
