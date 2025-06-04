import { getAnswers } from '@/lib/actions/answer.action';
import { getReplies } from '@/lib/actions/reply.action';
import React from 'react'
import Filter from './Filter';
import { AnswerFilters } from '@/constants/filters';
import Link from 'next/link';
import Image from 'next/image';
import { getTimestamp } from '@/lib/utils';
import ParseHTML from './ParseHTML';
import Votes from './Votes';
import Pagination from './Pagination';
import ReplySection from './ReplySection';

interface Props {
    questionId: string;
    userId: string;
    totalAnswers: number;
    page?: number;
    filter?: string;
}

const AllAnswers = async ({questionId, userId, totalAnswers, page, filter} :Props) => {
    const answer = await getAnswers({
        questionId,
        page: page ? +page : 1,
        sortBy: filter
    });

    return (
    <div className="mt-11">
        <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

        <Filter filters={AnswerFilters}/>
        </div>
        
        <div>
            {answer.answers.map(async (answer) => {
                const replies = await getReplies(answer._id.toString());
                // Convert replies to plain objects
                const serializedReplies = replies.map(reply => ({
                    _id: reply._id.toString(),
                    content: reply.content,
                    author: {
                        _id: reply.author._id.toString(),
                        clerkId: reply.author.clerkId,
                        name: reply.author.name,
                        picture: reply.author.picture
                    },
                    createdAt: reply.createdAt
                }));

                return (
                    <article key={answer._id}
                    className='light-border border-b py-10'>
                        <div className="flex items-center justify-between">
                            <div>
                            <Link href={`/profile/${answer.author.clerkId}`} className="flex flex-1 items-start gap-1 sm:items-center">
                                <Image
                                    src={answer.author.picture}
                                    width={18}
                                    height={18}
                                    alt="profile"
                                    className="rounded-full object-cover max-sm:mt-0.5"
                                />
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <p className="body-semibold text-dark300_light700">
                                    {answer.author.name}
                                    </p>

                                    <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                                    answered { " " }
                                    {getTimestamp(answer.createdAt)}
                                    </p>
                                </div>
                            </Link>
                                <div className='flex justify-end'> 
                                </div>
                            </div>
                            <Votes
                                type="Answer"
                                itemId={JSON.stringify(answer._id)}
                                userId={userId ? JSON.stringify(userId): ""}
                                upvotes={answer.upvotes.length}
                                hasupVoted={userId ? answer.upvotes.includes(userId): false}
                                downvotes={answer.downvotes.length}
                                hasdownVoted={userId ? answer.downvotes.includes(userId): false}
                            />
                        </div>
                        <ParseHTML data={answer.content}/>
                        
                        {/* Replies Section */}
                        <div className="mt-6">
                            <ReplySection 
                                answerId={answer._id.toString()} 
                                authorId={userId.toString()} 
                                replies={serializedReplies}
                                userId={userId.toString()}
                                answerAuthor={{
                                    name: answer.author.name,
                                    picture: answer.author.picture
                                }}
                            />
                        </div>
                    </article>
                );
            })}
        </div>

        <div className="mt-9 w-full">
            <Pagination
                pageNumber={page ? +page : 1}
                isNext={answer.isNextAnswer}
            />
        </div>
    </div>
    )
}

export default AllAnswers;