import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  DescriptionItem,
  Descriptions,
  ErrorPage,
  List,
  ListItem,
  Paragraph,
  Tag,
  Text,
  Title,
} from "../../../components";
import apiInstance from "../../../services/api";
import "./view.css";

const View = () => {
  const { jobId } = useParams();
  const [jobListing, setJobListing] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiInstance.get(`/jobs/${jobId}`);
        const jobData = response.data?.data;

        if (jobData.address) {
          jobData.address = `${jobData.address.city}, ${jobData.address.state}`;
        }

        setJobListing(jobData);
      } catch (error) {
        setNotFound(true);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [jobId]);

  if (notFound) {
    return <ErrorPage />;
  }

  return (
    <div className="view-container">
      <Card
        title={`${jobListing.title} (${jobListing.company})`}
        extra={
          <img
            src={jobListing.logo}
            alt={`${jobListing.title} Logo`}
            style={{ maxHeight: 50 }}
          />
        }
        style={{ borderRadius: 12 }}
        className="view-card"
      >
        <Descriptions bordered column={2}>
          <DescriptionItem label="Job Type" className="view-text">
            {jobListing.jobType}
          </DescriptionItem>
          <DescriptionItem label="Industry" className="view-text">
            {jobListing.industry}
          </DescriptionItem>
          <DescriptionItem label="Salary" className="view-text">
            {`₹ ${jobListing.salary} lpa`}
          </DescriptionItem>
          <DescriptionItem label="Location" className="view-text">
            {jobListing.address}
          </DescriptionItem>
          <DescriptionItem label="Remote" className="view-text">
            {jobListing.isRemote ? "Yes" : "No"}
          </DescriptionItem>
          <DescriptionItem label="Application Deadline" className="view-text">
            {dayjs(jobListing.applicationDeadline).format("Do MMMM, YYYY")}
          </DescriptionItem>
        </Descriptions>

        <Title level={3}>Job Description</Title>
        <Paragraph className="view-text">{jobListing.description}</Paragraph>

        <Title level={3}>Qualifications</Title>
        <Descriptions bordered column={2}>
          <DescriptionItem label="Min Education" className="view-text">
            {jobListing.qualifications?.education}
          </DescriptionItem>
          <DescriptionItem label="Skills" className="view-text">
            {jobListing.qualifications?.skills?.map((skill) => (
              <Tag className="view-text" key={`${skill}`}>
                {skill}
              </Tag>
            ))}
          </DescriptionItem>
          <DescriptionItem label="Min Experience" className="view-text">
            {jobListing.qualifications?.minExperience} years
          </DescriptionItem>
          <DescriptionItem label="Max Experience" className="view-text">
            {jobListing.qualifications?.maxExperience} years
          </DescriptionItem>
        </Descriptions>

        {jobListing.requirements?.length > 0 && (
          <>
            <Title level={3}>Requirements</Title>
            <List
              dataSource={jobListing.requirements}
              renderItem={(requirement) => (
                <ListItem className="hover-highlight">
                  <Text className="view-text">{requirement}</Text>
                </ListItem>
              )}
            />
          </>
        )}

        {jobListing.responsibilities?.length > 0 && (
          <>
            <Title level={3}>Responsibilities</Title>
            <List
              dataSource={jobListing.responsibilities}
              renderItem={(responsibility) => (
                <ListItem className="hover-highlight">
                  <Text className="view-text">{responsibility}</Text>
                </ListItem>
              )}
            />
          </>
        )}

        <Title level={3}>Contact Information</Title>
        <Paragraph className="view-text">
          Email: {jobListing.contactEmail}
        </Paragraph>

        <Title level={3}>Apply Now</Title>
        {jobListing.applicationLink ? (
          <Link to={jobListing.applicationLink} className="view-text">
            Apply Here
          </Link>
        ) : (
          <Paragraph className="view-text">
            No application link provided.
          </Paragraph>
        )}
      </Card>
    </div>
  );
};

export default View;
