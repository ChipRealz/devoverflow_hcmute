"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteReply } from "@/lib/actions/reply.action";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface Props {
  type: string;
  itemId: string;
}

const ManagerDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      if(type === 'Question') {
        // Delete question
        await deleteQuestion({ 
          questionId: JSON.parse(itemId), 
          path: pathname 
        });
      } else if(type === 'Answer') {
        // Delete answer
        await deleteAnswer({ 
          answerId: JSON.parse(itemId), 
          path: pathname 
        });
      } else if(type === 'Reply') {
        // Delete reply
        await deleteReply(JSON.parse(itemId));
      }
      
      return toast({
        title: `${type} deleted`,
        variant: 'destructive'
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      return toast({
        title: `Error deleting ${type}`,
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3 max-sm:w-full">
        <Image 
          src="/assets/icons/trash.svg"
          alt="Delete"
          width={15}
          height={15}
          className="cursor-pointer object-contain"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        type={type}
      />
    </>
  );
};

export default ManagerDeleteAction;