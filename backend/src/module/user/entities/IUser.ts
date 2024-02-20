import { type IBase } from '../../../lib/base';

interface IUser extends IBase {
    name: string;
    email: string;
    password: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    phoneNumber?: string;

    summary?: string,
    skills?: string[],
    domains?: string[],
    achievements?: string[],
    resume?: Buffer
}

export default IUser;
