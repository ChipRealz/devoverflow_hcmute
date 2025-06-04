import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getTimestamp } from '@/lib/utils'
import ParseHTML from './ParseHTML'
import { SignedIn } from '@clerk/nextjs'
import EditDeleteAction from './EditDeleteAction'

interface Props {
  replies: any[];
  userId: string;
  answerAuthor: {
    name: string;
    picture: string;
  };
}

const AllReplies = ({ replies, userId, answerAuthor }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {replies.map((reply) => (
        <div key={reply._id} className="pl-2">
          <article className="bg-white dark:bg-dark-700 rounded-lg shadow-sm border border-gray-100 dark:border-dark-400 p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <Link href={`/profile/${reply.author.clerkId}`} className="flex flex-1 items-start gap-2 sm:items-center">
                  <Image
                    src={reply.author.picture}
                    width={22}
                    height={22}
                    alt="profile"
                    className="rounded-full object-cover max-sm:mt-0.5 border border-gray-200 dark:border-dark-400"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-semibold text-dark300_light700">
                      {reply.author.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-0.5 mt-0.5 line-clamp-1">
                      replied to {answerAuthor.name}'s answer · {getTimestamp(reply.createdAt)}
                    </span>
                  </div>
                </Link>
              </div>
              <SignedIn>
                {userId === reply.author._id.toString() && (
                  <EditDeleteAction
                    type="Reply"
                    itemId={JSON.stringify(reply._id)}
                  />
                )}
              </SignedIn>
            </div>
            <div className="text-sm text-dark400_light800 leading-relaxed">
              <ParseHTML data={reply.content} />
            </div>
          </article>
        </div>
      ))}
    </div>
  )
}

export default AllReplies 