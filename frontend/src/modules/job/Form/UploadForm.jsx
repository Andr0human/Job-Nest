import { Form } from "antd";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import {
  Button,
  Divider,
  FormItem,
  Row,
  TextArea,
  Title,
} from "../../../components";
import apiInstance from "../../../services/api";
import {
  education,
  industry,
  jobTypes,
  locations,
} from "../Listing/filtersTypes";
import {
  ArrayField,
  CascaderField,
  DatePickerField,
  InputField,
  InputNumberField,
  RadioField,
  SelectField,
} from "./Fields";
import "./form.css";

const UploadForm = (props) => {
  const {
    jobListing,
    submitMessage,
    formHeading,
    requestMethod,
    requestApi,
    uploadSuccess,
    ...rest
  } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(jobListing);
  }, [form, jobListing]);

  const onFinish = async (values) => {
    const formData = { ...values, ...rest };

    if (formData.address) {
      formData.address = { state: values.address[0], city: values.address[1] };
    }

    const options = {
      method: requestMethod,
      url: requestApi,
      data: formData,
    };

    try {
      await apiInstance.request(options);

      uploadSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="upload-form-section">
      <div className="upload-form-container">
        <Form
          form={form}
          layout="vertical"
          aria-label={`${formHeading}-form`}
          name={formHeading}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Divider orientation="left" orientationMargin={20}>
            <Title level={5}>Job Details</Title>
          </Divider>
          <InputField name="title" label="Title" />
          <InputField name="company" label="Company" />

          <Row gutter={32}>
            <SelectField name="jobType" label="Job Type" options={jobTypes} />
            <SelectField name="industry" label="Industry" options={industry} />
          </Row>

          <Row gutter={32}>
            <InputNumberField
              name="salary"
              label="Salary"
              placeholder="Salary amount"
              prefix="₹"
              suffix="annually"
            />

            <CascaderField
              name="address"
              label="Office Address"
              options={locations}
            />
          </Row>

          <FormItem name="description" label="Description">
            <TextArea placeholder="Enter job description..." />
          </FormItem>

          <ArrayField
            name={["qualifications", "skills"]}
            label="Skills Required"
            text="Add skill"
          />
          <ArrayField
            name="responsibilities"
            label="Responsibilities"
            text="Add responsibility"
          />
          <ArrayField
            name="requirements"
            label="Requirements"
            text="Add requirement"
          />

          <Divider orientation="left" orientationMargin={20}>
            <Title level={5}>Qualifications</Title>
          </Divider>
          <SelectField
            name={["qualifications", "education"]}
            label="Education"
            options={education}
          />
          <Row gutter={32}>
            <InputNumberField
              name={["qualifications", "minExperience"]}
              label="Min Experience"
              placeholder="Min experience needed(years)"
            />
            <InputNumberField
              name={["qualifications", "maxExperience"]}
              label="Max Experience"
              placeholder="Max experience needed(years)"
            />
          </Row>

          <Divider orientation="left" orientationMargin={20}>
            <Title level={5}>Additional Information</Title>
          </Divider>
          <DatePickerField
            name="applicationDeadline"
            label="Application Deadline"
          />
          <RadioField />
          <InputField name="contactEmail" label="Contact Email" />
          <InputField name="applicationLink" label="Application Link" />

          <FormItem className="form-submit-btn">
            <Button type="primary" htmlType="submit">
              {submitMessage}
            </Button>
          </FormItem>
        </Form>
      </div>
    </section>
  );
};

UploadForm.propTypes = {
  jobListing: PropTypes.object,
  submitMessage: PropTypes.string.isRequired,
  formHeading: PropTypes.string.isRequired,
  requestMethod: PropTypes.string.isRequired,
  requestApi: PropTypes.string.isRequired,
  uploadSuccess: PropTypes.func.isRequired,
};

export default UploadForm;
