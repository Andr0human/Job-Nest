export const badRequestError = {
  message: 'Request failed with status code 401',
  name: 'AxiosError',
  code: 'ERR_BAD_REQUEST',
};

export const userNotFoundError = {
  message: 'Request failed with status code 404',
  name: 'AxiosError',
  code: 'ERR_BAD_REQUEST',
  response: {
    data: {
      status: false,
      message: 'no user found for current email!',
      error: [],
    },
  },
};

export const mockUser = {
  data: {
    status: true,
    message: 'User found!',
    data: {
      _id: '6678364ba5f4628e16c68771',
      email: 'test@email.com',
    },
  },
  status: 200,
};

export const successfulLogin = {
  data: {
    status: true,
    message: 'user login successfully!',
    data: {
      token: 'mock-token',
      existingUser: [],
    },
  },
  status: 200,
};

export const userAlreadyExistError = {
  message: 'Request failed with status code 409',
  name: 'AxiosError',
  code: 'ERR_BAD_REQUEST',
  response: {
    data: {
      status: false,
      message: 'User already exists!',
      error: {
        name: 'Test-User',
        email: 'test@email.com',
        password: 'test@123',
      },
    },
    status: 409,
  },
};

export const badRequestError2 = {
  response: {
    data: {
      status: false,
      message: 'new user validation failed!',
      error: {
        details: [
          { message: '"name" length must be at least 3 characters long' },
          { message: 'Password must be at least 8 characters long' },
        ],
      },
    },
  },
};

export const profileData = {
  data: {
    status: true,
    message: 'User found successfully!',
    data: {
      _id: '66784a7ea5f4628e16c68829',
      name: 'Test-User',
      email: 'test@email.com',
      skills: ['S-1', 'S-2'],
      domains: [],
      achievements: ['A-1', 'A-2'],
      createdAt: '2024-06-23T16:17:02.525Z',
      updatedAt: '2024-06-23T16:17:02.599Z',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
    },
  },
};

export const bulkUploadRecords = {
  data: {
    status: true,
    message: 'upload history found!',
    data: {
      total: 10,
      data: [
        {
          _id: 'id-1',
          status: 'running',
          time: 1122,
          filename: 'Test File - 1',
          entriesCompleted: 0,
          totalEntries: 0,
        },
        {
          _id: 'id-2',
          status: 'running',
          time: 1122,
          filename: 'Test File - 2',
          entriesCompleted: 0,
          totalEntries: 0,
        },
      ],
    },
  },
};

export const bulkUploadRecordDetail = {
  data: {
    status: true,
    message: 'upload history found successfully.',
    data: {
      _id: 'id-1',
      status: 'completed',
      time: 1122,
      filename: 'Test File - 1',
      successfulEntries: 10,
      failedEntries: 0,
      entriesCompleted: 10,
      totalEntries: 10,
      createdAt: '2024-06-23T16:45:08.501Z',
      updatedAt: '2024-06-23T16:45:08.501Z',
    },
  },
};

export const jobsData = {
  data: {
    status: true,
    message: 'Job listing found!',
    data: {
      total: 2,
      count: 2,
      data: [
        {
          address: {
            city: 'Test City - 1',
          },
          _id: 'id-1',
          title: 'Test Title - 1',
          company: 'Test Company 1',
        },
        {
          address: {
            city: 'Test City - 2',
          },
          _id: 'id-2',
          title: 'Test Title - 2',
          company: 'Test Company 2',
        },
      ],
    },
  },
  status: 200,
};

export const jobDetail = {
  data: {
    status: true,
    message: 'Job found successfully.',
    data: {
      address: {
        city: 'Test City - 1',
      },
      qualifications: {
        education: 'B. Tech',
        skills: ['C', 'C++', 'Python'],
      },
      _id: 'id-1',
      title: 'Test Title - 1',
      company: 'Test Company',
      jobType: 'Full-time',
      industry: 'Computer Software',
      requirements: ['RQ-1', 'RQ-2', 'RQ-3'],
      responsibilities: ['RS-1', 'RS-2', 'RS-3'],
      applicationDeadline: '2024-06-23T14:00:11.861Z',
      isRemote: true,
      contactEmail: 'test@company.com',
      applicationLink: 'web.test-company.com',
      createdAt: '2024-06-23T14:00:11.870Z',
      updatedAt: '2024-06-23T14:00:11.870Z',
    },
  },
};
