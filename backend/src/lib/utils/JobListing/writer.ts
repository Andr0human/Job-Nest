import { createObjectCsvWriter } from 'csv-writer';
import { CsvWriter } from 'csv-writer/src/lib/csv-writer';
import { ObjectMap } from 'csv-writer/src/lib/lang/object';

const getCsvWriter = (csvPath: string): CsvWriter<ObjectMap<any>> => createObjectCsvWriter({
    path: csvPath,
    header: [
        { id: 'title', title: 'title' },
        { id: 'company', title: 'company' },
        { id: 'logo', title: 'logo' },
        { id: 'address.city', title: 'address.city' },
        { id: 'address.state', title: 'address.state' },
        { id: 'jobType', title: 'jobType' },
        { id: 'industry', title: 'industry' },
        { id: 'description', title: 'description' },
        { id: 'requirements', title: 'requirements' },
        { id: 'responsibilities', title: 'responsibilities' },
        { id: 'qualifications.education', title: 'qualifications.education' },
        { id: 'qualifications.minExperience', title: 'qualifications.minExperience' },
        { id: 'qualifications.maxExperience', title: 'qualifications.maxExperience' },
        { id: 'qualifications.skills', title: 'qualifications.skills' },
        { id: 'salary', title: 'salary' },
        { id: 'applicationDeadline', title: 'applicationDeadline' },
        { id: 'isRemote', title: 'isRemote' },
        { id: 'contactEmail', title: 'contactEmail' },
        { id: 'applicationLink', title: 'applicationLink' },
    ],
    headerIdDelimiter: '.',
});

export default getCsvWriter;
