import { IBase } from '../../../lib/base';
import JobType from './JobType';

interface IJobListing extends IBase {
  title: string;
  company: string;
  logo?: string;
  address?: { city: string, state: string };
  jobType?: JobType;
  industry: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  qualifications?: {
    education: string;
    minExperience: number;
    maxExperience: number;
    skills: string[];
  };
  salary?: number;
  applicationDeadline: Date;
  isRemote: boolean;
  contactEmail: string;
  applicationLink: string;
}

export default IJobListing;
