import { Form, Steps, message } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import {
  Button,
  Card,
  FormItem,
  Row,
  TextArea,
  Title,
} from '../../../components';
import apiInstance from '../../../services/api';
import {
  education,
  industry,
  jobTypes,
  locations,
} from '../Listing/filtersTypes';

import {
  ArrayField,
  CascaderField,
  DatePickerField,
  InputField,
  InputNumberField,
  RadioField,
  SelectField,
} from './Fields';
import './form.css';

const { Step } = Steps;

const UploadForm = props => {
  const {
    jobListing = {},
    submitMessage,
    formHeading,
    requestMethod,
    requestApi,
    uploadSuccess,
  } = props;

  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (jobListing && Object.keys(jobListing).length > 0) {
      form.setFieldsValue(jobListing);
      setFormData(jobListing);
    }
  }, [jobListing, form]);

  const steps = [
    {
      title: 'Basic Info',
      description: 'Job title, company & type',
      icon: '📋',
      fields: ['title', 'company', 'jobType', 'industry'],
    },
    {
      title: 'Details',
      description: 'Salary, location & description',
      icon: '💼',
      fields: ['salary', 'address', 'description'],
    },
    {
      title: 'Requirements',
      description: 'Skills & responsibilities',
      icon: '⚡',
      fields: ['qualifications.skills', 'responsibilities', 'requirements'],
    },
    {
      title: 'Qualifications',
      description: 'Education & experience',
      icon: '🎓',
      fields: [
        'qualifications.education',
        'qualifications.minExperience',
        'qualifications.maxExperience',
      ],
    },
    {
      title: 'Final Details',
      description: 'Deadline & contact info',
      icon: '✅',
      fields: ['applicationDeadline', 'contactEmail', 'applicationLink'],
    },
  ];

  const validateCurrentStep = async () => {
    try {
      const fieldsToValidate = steps[currentStep].fields;
      await form.validateFields(fieldsToValidate);
      return true;
    } catch (errorInfo) {
      message.error('Please fill in all required fields before proceeding.');
      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      const formValues = form.getFieldsValue();
      setFormData(prevData => ({ ...prevData, ...formValues }));
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const onFinish = async () => {
    setIsSubmitting(true);
    // Get all form values, not just the current step
    const allFormValues = form.getFieldsValue();
    const submitData = { ...formData, ...allFormValues };

    if (submitData.address) {
      submitData.address = {
        state: submitData.address[0],
        city: submitData.address[1],
      };
    }

    // eslint-disable-next-line no-underscore-dangle
    delete submitData._id;
    delete submitData.createdAt;
    delete submitData.updatedAt;

    const options = {
      method: requestMethod,
      url: requestApi,
      data: submitData,
    };

    try {
      await apiInstance.request(options);
      message.success('Job listing created successfully!');
      uploadSuccess();
    } catch (error) {
      message.error('Failed to create job listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='step-content'>
            <div className='step-header'>
              <h3>Basic Information</h3>
              <p>
                Let's start with the essential details about your job opening
              </p>
            </div>
            <div className='form-fields'>
              <InputField
                name='title'
                label='Job Title'
                placeholder='e.g. Senior Frontend Developer'
                required
              />
              <InputField
                name='company'
                label='Company Name'
                placeholder='e.g. TechCorp Inc.'
                required
              />
              <Row gutter={24}>
                <SelectField
                  name='jobType'
                  label='Job Type'
                  options={jobTypes}
                  placeholder='Select job type'
                  required
                />
                <SelectField
                  name='industry'
                  label='Industry'
                  options={industry}
                  placeholder='Select industry'
                  required
                />
              </Row>
            </div>
          </div>
        );

      case 1:
        return (
          <div className='step-content'>
            <div className='step-header'>
              <h3>Job Details</h3>
              <p>Provide compensation and location information</p>
            </div>
            <div className='form-fields'>
              <InputNumberField
                name='salary'
                label='Annual Salary'
                placeholder='Enter amount'
                prefix='₹'
                suffix='per year'
              />
              <CascaderField
                name='address'
                label='Office Location'
                options={locations}
                placeholder='Select state and city'
              />
              <FormItem
                name='description'
                label='Job Description'
                required
                rules={[
                  {
                    required: true,
                    message: 'Please enter job description',
                  },
                ]}
              >
                <TextArea
                  placeholder='Describe the role, responsibilities, and what makes this opportunity exciting...'
                  rows={6}
                />
              </FormItem>
            </div>
          </div>
        );

      case 2:
        return (
          <div className='step-content'>
            <div className='step-header'>
              <h3>Requirements & Responsibilities</h3>
              <p>Define what you're looking for in candidates</p>
            </div>
            <div className='form-fields'>
              <ArrayField
                name={['qualifications', 'skills']}
                label='Required Skills'
                text='Add skill'
                placeholder='e.g. React, Node.js, Python'
              />
              <ArrayField
                name='responsibilities'
                label='Key Responsibilities'
                text='Add responsibility'
                placeholder='e.g. Develop and maintain web applications'
              />
              <ArrayField
                name='requirements'
                label='Additional Requirements'
                text='Add requirement'
                placeholder="e.g. Bachelor's degree in Computer Science"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className='step-content'>
            <div className='step-header'>
              <h3>Qualifications</h3>
              <p>Specify education and experience requirements</p>
            </div>
            <div className='form-fields'>
              <SelectField
                name={['qualifications', 'education']}
                label='Minimum Education'
                options={education}
                placeholder='Select education level'
              />
              <InputNumberField
                name={['qualifications', 'minExperience']}
                label='Minimum Experience'
                placeholder='Years'
                suffix='years'
              />
              <InputNumberField
                name={['qualifications', 'maxExperience']}
                label='Maximum Experience'
                placeholder='Years'
                suffix='years'
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className='step-content'>
            <div className='step-header'>
              <h3>Application Details</h3>
              <p>Set deadline and contact information</p>
            </div>
            <div className='form-fields'>
              <DatePickerField
                name='applicationDeadline'
                label='Application Deadline'
                placeholder='Select deadline date'
                required
              />
              <RadioField name='isRemote' label='Is Remote' required />
              <InputField
                name='contactEmail'
                label='Contact Email'
                placeholder='hr@company.com'
                type='email'
                required
              />
              <InputField
                name='applicationLink'
                label='Application Link'
                placeholder='https://company.com/careers/apply'
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepStatus = index => {
    if (index < currentStep) return 'finish';
    if (index === currentStep) return 'process';
    return 'wait';
  };

  return (
    <div className='modern-upload-form'>
      <div className='form-header'>
        <Title level={2} className='form-title'>
          {formHeading}
        </Title>
        <p className='form-subtitle'>
          Create an attractive job listing in just a few steps
        </p>
      </div>

      <div className='steps-container'>
        <Steps current={currentStep} className='custom-steps'>
          {steps.map((step, index) => (
            <Step
              key={`current-step-${step?.title}`}
              title={
                <div className='step-title'>
                  <span className='step-icon'>{step.icon}</span>
                  <div>
                    <div className='step-name'>{step.title}</div>
                    <div className='step-desc'>{step.description}</div>
                  </div>
                </div>
              }
              status={getStepStatus(index)}
            />
          ))}
        </Steps>
      </div>

      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        className='modern-form'
        scrollToFirstError
      >
        <Card className='step-card'>{renderStepContent()}</Card>

        <div className='form-navigation'>
          {currentStep > 0 && (
            <Button onClick={prevStep} size='large' className='prev-btn'>
              Previous
            </Button>
          )}

          <div className='nav-right'>
            {currentStep < steps.length - 1 ? (
              <Button
                type='primary'
                onClick={nextStep}
                size='large'
                className='next-btn'
              >
                Next Step
              </Button>
            ) : (
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                loading={isSubmitting}
                className='submit-btn'
              >
                {isSubmitting ? 'Creating...' : submitMessage}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

UploadForm.propTypes = {
  jobListing: PropTypes.shape({
    title: PropTypes.string,
    company: PropTypes.string,
    jobType: PropTypes.string,
    industry: PropTypes.string,
    salary: PropTypes.number,
    address: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    qualifications: PropTypes.shape({
      skills: PropTypes.arrayOf(PropTypes.string),
      education: PropTypes.string,
      minExperience: PropTypes.number,
      maxExperience: PropTypes.number,
    }),
    applicationDeadline: PropTypes.objectOf(PropTypes.Date || PropTypes.string),
    contactEmail: PropTypes.string,
    applicationLink: PropTypes.string,
  }),
  submitMessage: PropTypes.string.isRequired,
  formHeading: PropTypes.string.isRequired,
  requestMethod: PropTypes.string.isRequired,
  requestApi: PropTypes.string.isRequired,
  uploadSuccess: PropTypes.func.isRequired,
};

export default UploadForm;
