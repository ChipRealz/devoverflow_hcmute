'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@/context/ThemeProvider';
import Link from 'next/link';

interface Activity {
  _id: string;
  actionType: 'upvote' | 'downvote' | 'remove_upvote' | 'remove_downvote' | 'save' | 'unsave' | 'post' | 'answer';
  targetType: 'question' | 'answer';
  targetId: string;
  targetContent: string;
  createdAt: string;
}

interface ActivityLogProps {
  userId: string;
}

export default function ActivityLog({ userId }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { mode } = useTheme();

  const fetchActivities = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/activity?page=${pageNum}&limit=10`);
      const data = await response.json();
      setActivities(data.activities);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(page);
  }, [page]);

  const getActivityDescription = (activity: Activity) => {
    switch (activity.actionType) {
      case 'upvote':
        return `You upvoted a ${activity.targetType}`;
      case 'downvote':
        return `You downvoted a ${activity.targetType}`;
      case 'remove_upvote':
        return `You removed upvote from a ${activity.targetType}`;
      case 'remove_downvote':
        return `You removed downvote from a ${activity.targetType}`;
      case 'save':
        return `You saved a question`;
      case 'unsave':
        return `You unsaved a question`;
      case 'post':
        return `You posted a new question`;
      case 'answer':
        return `You answered a question`;
      default:
        return 'You performed an action';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="h2-bold text-dark100_light900">Activity Log</h2>
      {activities.length === 0 ? (
        <p className="paragraph-regular text-dark400_light800">No activities found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="card-wrapper rounded-[10px] p-6 sm:px-8 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="sm:h3-semibold base-semibold text-dark200_light900">
                    {getActivityDescription(activity)}
                  </span>
                  <span className="text-sm text-dark400_light700">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <Link
                  href={`/question/${activity.targetId}`}
                  className="mt-1 h3-semibold text-primary-500 hover:underline line-clamp-1"
                >
                  {activity.targetContent}
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="paragraph-medium text-dark400_light800 px-4 py-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 