/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from 'react'
import Reply from '../forms/Reply'
import AllReplies from './AllReplies'

interface Props {
  answerId: string;
  authorId: string;
  replies: any[];
  userId: string;
  answerAuthor: {
    name: string;
    picture: string;
  };
}

const ReplySection = ({ answerId, authorId, replies, userId, answerAuthor }: Props) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(true)

  return (
    <div className="mt-8 pl-4">
      <div className="flex flex-col gap-4">
        {replies.length > 0 && (
          <div className="mb-2 flex items-center gap-0.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Replies ({replies.length})
            </span>
            <button
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline bg-transparent border-none px-1 py-0 focus:outline-none"
              onClick={() => setShowReplies((prev) => !prev)}
              type="button"
            >
              {showReplies ? 'Hide Replies' : 'Show Replies'}
            </button>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline bg-transparent border-none px-0 py-0 focus:outline-none"
              type="button"
            >
              <img
                src="/assets/icons/reply.svg"
                alt="reply"
                width={13}
                height={13}
                className="invert-colors"
              />
              {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
          </div>
        )}
        {showReplies && replies.length > 0 && (
          <AllReplies 
            replies={replies} 
            userId={userId} 
            answerAuthor={answerAuthor}
          />
        )}
        {replies.length === 0 && (
          <div className="mb-2 flex items-center gap-0.5">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline bg-transparent border-none px-0 py-0 focus:outline-none"
              type="button"
            >
              <img
                src="/assets/icons/reply.svg"
                alt="reply"
                width={13}
                height={13}
                className="invert-colors"
              />
              {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
          </div>
        )}
        {showReplyForm && (
          <div className="mt-2">
            <Reply 
              answerId={answerId} 
              authorId={authorId} 
            />
            <button
              className="mt-2 text-xs text-primary-500 hover:underline bg-transparent border-none p-0 focus:outline-none"
              onClick={() => setShowReplyForm(false)}
              type="button"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReplySection 