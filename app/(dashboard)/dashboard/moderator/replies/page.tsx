/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getManagerReplies } from "@/lib/actions/reply.action";
import ManagerReplyCard from "@/components/cards/ManagerReplyCard";
import { ManagerRepliesFilters } from "@/constants/filters";
import Filter from "@/components/shared/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import NoResult from "@/components/shared/NoResult";

export default async function RepliesPage({
  searchParams,
}: {
  searchParams: { q: string; filter: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const result = await getManagerReplies();

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Replies</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/dashboard/moderator/replies"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search replies..."
          otherClasses="flex-1"
        />

        <Filter
          filters={ManagerRepliesFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.replies.length > 0 ? (
          result.replies.map((reply: any) => (
            <ManagerReplyCard
              key={reply._id}
              clerkId={userId}
              _id={reply._id}
              content={reply.content}
              answer={reply.answer}
              author={reply.author}
              createdAt={reply.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="No replies found"
            description="Be the first to break the silence! 🚀 Ask a question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
