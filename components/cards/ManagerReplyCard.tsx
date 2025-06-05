import Link from "next/link";
import Metric from "../shared/Metric";
import { getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import ManagerDeleteAction from "../shared/ManagerDeleteAction";
import ParseHTML from "../shared/ParseHTML";

interface Props {
  clerkId?: string | null;
  _id: string;
  content: string;
  answer: {
    _id: string;
    question: {
      _id: string;
      title: string;
    };
  };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  createdAt: Date;
}

const ManagerReplyCard = ({
  clerkId,
  _id,
  content,
  answer,
  author,
  createdAt,
}: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${answer.question._id}/#${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {answer.question.title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          <ManagerDeleteAction type="Reply" itemId={JSON.stringify(_id)} />
        </SignedIn>
      </div>

      <div className="mt-4">
        <ParseHTML data={content} />
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user avatar"
          value={author.name}
          title={` • replied ${getTimestamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />
      </div>
    </div>
  );
};

export default ManagerReplyCard; 