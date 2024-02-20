import IJobListing from '../module/job/entities/IJobListing';
import JobType from '../module/job/entities/JobType';

const jobListingData: IJobListing[] = [
    {
        title: 'Data Scientist',
        company: 'Google',
        jobType: JobType.PartTime,
        industry: 'Data Science',
        salary: 927810,
        applicationDeadline: new Date('2024-02-01'),
        contactEmail: 'google@gmail.com',
        applicationLink: 'google@jobs.com',
        isRemote: true,
    },
    {
        title: 'Frontend Developer',
        company: 'Microsoft',
        jobType: JobType.Temporary,
        industry: 'Web Development',
        salary: 1234600,
        applicationDeadline: new Date('2024-02-15'),
        contactEmail: 'microsoft@gmail.com',
        applicationLink: 'microsoft@jobs.com',
        isRemote: false,
    },
    {
        title: 'UX Designer',
        company: 'Apple',
        jobType: JobType.Contract,
        industry: 'Design',
        salary: 556042,
        applicationDeadline: new Date('2024-01-20'),
        contactEmail: 'apple@gmail.com',
        applicationLink: 'apple@jobs.com',
        isRemote: true,
    },
    {
        title: 'Network Engineer',
        company: 'Cisco',
        jobType: JobType.FullTime,
        industry: 'Networking',
        salary: 3298700,
        applicationDeadline: new Date('2024-03-01'),
        contactEmail: 'cisco@gmail.com',
        applicationLink: 'cisco@jobs.com',
        isRemote: false,
    },
    {
        title: 'DevOps Engineer',
        company: 'IBM',
        jobType: JobType.FullTime,
        industry: 'DevOps',
        salary: 1650000,
        applicationDeadline: new Date('2024-02-10'),
        contactEmail: 'ibm@gmail.com',
        applicationLink: 'ibm@jobs.com',
        isRemote: true,
    },
];

export default jobListingData;
