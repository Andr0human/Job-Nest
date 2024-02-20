import { faker } from '@faker-js/faker';
import academicDegrees from './education';
import industryOptions from './industry';
import JobType from '../../../module/job/entities/JobType';
import IJobListing from '../../../module/job/entities/IJobListing';

// Generate fake JobListing data using @faker-js/faker
const generateFakeJobListing = (): IJobListing => {
    const minExperience: number = faker.number.int({ min: 0, max: 10 });
    const maxExperience: number = faker.number.int({ min: minExperience, max: 15 });

    return {
        title: faker.person.jobTitle(),
        company: faker.company.name(),
        logo: faker.image.dataUri({ type: 'svg-base64' }),
        address: {
            city: faker.location.city(),
            state: faker.location.state(),
        },
        jobType: faker.helpers.enumValue(JobType),
        industry: faker.helpers.arrayElement(industryOptions),
        description: faker.lorem.paragraph(),
        requirements: faker.lorem.sentences(3).split('. '),
        responsibilities: faker.lorem.sentences(3).split('. '),
        qualifications: {
            education: faker.helpers.arrayElement(academicDegrees),
            minExperience,
            maxExperience,
            skills: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
        },
        salary: faker.number.int({ min: 200000, max: 5000000 }),
        applicationDeadline: faker.date.future(),
        isRemote: faker.helpers.arrayElement([true, false]),
        contactEmail: faker.internet.email(),
        applicationLink: faker.internet.url(),
    };
};

export default generateFakeJobListing;
