import IUser from '../module/user/entities/IUser';

const randomPassword = (): string => Math.random().toString(36).slice(-8);

const userData: IUser[] = [
    {
        name: 'JohnDoe123',
        email: 'john.doe@example.com',
        password: randomPassword(),
        dateOfBirth: '1985-05-10T10:30:00.000Z',
        phoneNumber: '555-1234',
        skills: ['C', 'C++'],
    },
    {
        name: 'AliceSmith',
        email: 'alice.smith@example.com',
        password: randomPassword(),
        dateOfBirth: '1990-08-22T08:15:00.000Z',
        phoneNumber: '555-5678',
        skills: ['Java', 'Python'],
    },
    {
        name: 'EmmaJohnson',
        email: 'emma.johnson@example.com',
        password: randomPassword(),
        dateOfBirth: '1988-12-05T15:45:00.000Z',
        phoneNumber: '555-8765',
        skills: ['MongoDb', 'Atlas'],
    },
    {
        name: 'RobertMiller',
        email: 'robert.miller@example.com',
        password: randomPassword(),
        dateOfBirth: '1982-07-18T12:00:00.000Z',
        phoneNumber: '555-4321',
        skills: ['JavaScript', 'TypeScript'],
    },
    {
        name: 'SophieBrown',
        email: 'sophie.brown@example.com',
        password: randomPassword(),
        dateOfBirth: '1993-03-28T09:20:00.000Z',
        phoneNumber: '555-9876',
        skills: ['C#', 'Java'],
    },
    {
        name: 'DavidJones',
        email: 'david.jones@example.com',
        password: randomPassword(),
        dateOfBirth: '1987-09-15T14:10:00.000Z',
        phoneNumber: '555-3456',
        skills: ['Machine Learning'],
    },
];

export default userData;
