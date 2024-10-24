// import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
// import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
// import { JobFilters } from "@/constants/filters";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Overflow | Jobs",
  description: "Tags on Dev Overflow",
};

interface Job {
  job_id: string;
  employer_name: string;
  employer_logo?: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_publisher: string;
  job_employment_type: string;
  job_is_remote: boolean;
  job_posted_at_timestamp: number;
  job_offer_expiration_timestamp: number;
  job_required_experience: {
    required_experience_in_months: number;
  };
  job_description: string;
  job_benefits?: string[];
  job_apply_link: string;
  job_title: string;
}

export default async function Jobs() {
  const url =
    "https://jsearch.p.rapidapi.com/search?query=Node.js%20developer%20in%20New-York%2C%20USA&page=1&num_pages=1&date_posted=all";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f9dd055560msh19f8a0462b834dep16e693jsn04e287ec0c64",
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };

  let jobs: Job[] = [];

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    jobs = result.data; // Assuming the API returns jobs under `data`
    console.log(jobs); // Log the jobs data
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 dark:text-white">IT Jobs for HCMUTE Students</h1>
  
      {/* 
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for jobs"
          otherClasses="flex-1"
        />
  
        <Filter filters={JobFilters} otherClasses="min-h-[56px] sm:min-w-[170px]" />
      </div> 
      */}
      {/* // Can't make the search bar and filter available to use at the moment. */}
  
      <div className="mt-10 flex w-full flex-col gap-6">
        {jobs.length > 0 ? (
          jobs.map((job: any, index: number) => (
            <div
              key={index}
              className="border p-4 rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <h2 className="text-lg font-semibold dark:text-white">{job.job_title}</h2>
              <p className="dark:text-gray-300">
                <strong>Company:</strong> {job.employer_name}
              </p>
              {job.employer_logo && (
                <img src={job.employer_logo} alt="Company Logo" className="w-20 h-20" />
              )}
              <p className="dark:text-gray-300">
                <strong>Location:</strong> {job.job_city}, {job.job_state}, {job.job_country}
              </p>
              <p className="dark:text-gray-300">
                <strong>Publisher:</strong> {job.job_publisher}
              </p>
              <p className="dark:text-gray-300">
                <strong>Employment Type:</strong> {job.job_employment_type}
              </p>
              <p className="dark:text-gray-300">
                <strong>Remote:</strong> {job.job_is_remote ? 'Yes' : 'No'}
              </p>
              <p className="dark:text-gray-300">
                <strong>Posted At:</strong> {new Date(job.job_posted_at_timestamp * 1000).toLocaleDateString()}
              </p>
              <p className="dark:text-gray-300">
                <strong>Expiration Date:</strong> {new Date(job.job_offer_expiration_timestamp * 1000).toLocaleDateString()}
              </p>
              <p className="dark:text-gray-300">
                <strong>Experience Required:</strong> {job.job_required_experience.required_experience_in_months} months
              </p>
              <p className="dark:text-gray-300">
                <strong>Job Description:</strong> {job.job_description}
              </p>
              {job.job_benefits && (
                <p className="dark:text-gray-300">
                  <strong>Benefits:</strong> {job.job_benefits.join(', ')}
                </p>
              )}
              <p className="text-primary-500 dark:text-blue-400">
                <strong>Apply Here:</strong>{' '}
                <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer">
                  Apply Now
                </a>
              </p>
            </div>
          ))
        ) : (
          <NoResult
            title="There’s no jobs to show"
            description="No jobs found right now, but don't worry! New opportunities are posted regularly. Please check back soon."
            link="/"
            linkTitle="Back to DevOverflow"
          />
        )}
      </div>
    </>
  );
}
// This is the beta test for Find Jobs, the page is still under development. The page will be updated with more features and improvements in the future. Stay tuned!
// It will be developed in the future to imporve the user experience and add more features. Stay tuned!