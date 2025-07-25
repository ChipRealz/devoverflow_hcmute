/* eslint-disable @typescript-eslint/no-unused-vars */
import AnswerTab from '@/components/shared/AnswerTab'
import approvedClerkIds from '@/components/shared/approvedClerkIds'
import ProfileLink from '@/components/shared/ProfileLink'
import QuestionTab from '@/components/shared/QuestionTab'
import Stats from '@/components/shared/Stats'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getUserInfo } from '@/lib/actions/user.action'
import { getJoinedDate } from '@/lib/utils'
import { URLProps } from '@/types'
import { SignedIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ActivityLog from '@/components/shared/ActivityLog'

const Profile = async ({ params, searchParams}: URLProps) => {
  const { userId : clerkId} = auth();
  const userInfo = await getUserInfo({userId: params.id})
  return (
    <>
    <div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
        <div className='flex flex-col items-start gap-4 lg:flex-row'>
          <Image
          src={userInfo?.user.picture}
          alt='profile picture'
          height={150}
          width={150}
          className='rounded-full object-cover'/>
          <div className='mt-3'>
            <h2 className="h2-bold text-dark100_light900 flex items-center gap-2">
              {userInfo.user.name}
              {approvedClerkIds.includes(userInfo.user.clerkId) && (
                  <Image 
                    src="/assets/icons/quality.png" 
                    alt="Verify Icon" 
                    height={25} 
                    width={25} 
                  />
                )}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo.user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo.user.portfolioWebsite && (
                <ProfileLink 
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.portfolioWebsite}
                  title="Portfolio"
                />
              )}

              {userInfo.user.location && (
                <ProfileLink 
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo.user.location}
                />
              )}

                <ProfileLink 
                  imgUrl="/assets/icons/calendar.svg"
                  title={getJoinedDate(userInfo.user.joinedAt)}
                />
            </div>

              {userInfo.user.bio && (
                <p className="paragraph-regular text-dark400_light800 mt-8">{userInfo.user.bio}</p>
              )}
          </div>
        </div>
        <div className='flex justify-end max-sm:w-full sm:mt-3'>
        <SignedIn>
            {clerkId === userInfo.user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
    </div>

    <Stats
      reputation={userInfo.user.reputation}
      totalAnswers={userInfo.totalAnswers}
      totalQuestions={userInfo.totalQuestions}
      badgeCounts = {userInfo.badgeCounts}
     /> 

    <div className='mt-10 flex gap-10'>
      <Tabs defaultValue='top-post' className='flex-1'>
      <TabsList className='background-light800_dark400 min-h-[42px] p-1'>
        <TabsTrigger value="top-posts" className='tab'>Top Posts</TabsTrigger>
        <TabsTrigger value="answers" className='tab'>Answers</TabsTrigger>
        <TabsTrigger value="activity" className='tab'>Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="top-posts" className='mt-5 flex w-full
      flex-col gap-5'>
            <QuestionTab
            searchParams ={searchParams}
            userId={userInfo.user._id}
            clerkId ={clerkId} />
      </TabsContent>
      <TabsContent value="answers" className='mt-2 flex w-full
      flex-col gap-4'>
            <AnswerTab
            searchParams ={searchParams}
            userId={userInfo.user._id}
            clerkId ={clerkId} 
            />
      </TabsContent>
      <TabsContent value="activity" className='mt-2 flex w-full
      flex-col gap-4'>
            <ActivityLog userId={userInfo.user._id.toString()} />
      </TabsContent>
      </Tabs>
    </div>
    </>
  )
}

export default Profile