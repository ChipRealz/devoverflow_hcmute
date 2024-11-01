import ManagerAnswerCard from '@/components/cards/ManagerAnswerCard';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { ManagerAnswersFilters } from '@/constants/filters';
import { getManagerAnswers } from '@/lib/actions/answer.action';
import { SearchParamsProps } from '@/types'
import React from 'react'

const page = async ({searchParams}: SearchParamsProps) => {
  const result = await getManagerAnswers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  })
  return (
    <>
    <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Manage All Answers</h1> 
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
      <LocalSearchbar 
          route="/dashboard/moderator/answers"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for answers"
          otherClasses="flex-1"
        />
        <Filter
          filters={ManagerAnswersFilters  }
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.answers.length > 0 ?
          result.answers.map((answer) => (
            <ManagerAnswerCard
              key={answer._id}
              _id={answer._id}
              question={answer.question}
              author={answer.author}
              downvotes={answer.downvotes}
              createdAt={answer.createdAt}
              />
          ))
          : <NoResult 
          title="There’s no question to show"
          description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
          link="/dashboard/moderator"
          linkTitle="Back to dashboard"
        /> }
      </div>
    </>
  )
}

export default page