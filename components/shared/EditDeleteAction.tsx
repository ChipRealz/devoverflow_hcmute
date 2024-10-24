"use client";

import { toast } from "@/hooks/use-toast";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`)
    return toast({
      title: 'Edit Question',
      variant: 'default'
    })
  };

  const handleDelete = async () => {
    if(type === 'Question') {
      // Delete question
      await deleteQuestion({ 
        questionId: JSON.parse(itemId), 
        path: pathname 
      })
    } else if(type === 'Answer') {
      // Delete answer
      await deleteAnswer({ 
        answerId: JSON.parse(itemId), 
        path: pathname 
      })
    }
    return toast({
      title: `${type} deleted`,
      variant: 'destructive'
    })
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === 'Question' && (
        <Image 
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={15}
          height={15}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

        <Image 
          src="/assets/icons/trash.svg"
          alt="Delete"
          width={15}
          height={15}
          className="cursor-pointer object-contain"
          onClick={handleDelete}
        />
    </div>
  )
}

export default EditDeleteAction