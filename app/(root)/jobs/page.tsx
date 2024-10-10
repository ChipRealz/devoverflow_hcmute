import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { JobFilters,  } from "@/constants/filters";

export default async function Collection() {

  return (
    <>
        <h1 className="h1-bold text-dark100_light900">Find Jobs</h1> 

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar 
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for jobs"
          otherClasses="flex-1"
        />

        <Filter
          filters={JobFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>


      <div className="mt-10 flex w-full flex-col gap-6">
         <NoResult 
            title="There’s no jobs to show"
            description="No jobs found right now, but don't worry! New opportunities are posted regularly. Please check back soon."
            link="/"
            linkTitle="Back to DevOverflow"
          />
      </div>
    </>
  )
}