"use client"
import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { AnswerSchema } from '@/lib/validiations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { useTheme } from '@/context/ThemeProvider'
import { Button } from '../ui/button'
import Image from 'next/image'
import { createAnswer } from '@/lib/actions/answer.action'
import { usePathname } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

interface Props {
    question: string;
    questionId: string;
    authorId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Answer = ({question, questionId, authorId}: Props) => {
    const pathname = usePathname()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmittingAI, setIsSubmittingAI] = useState(false)
    const {mode} = useTheme()
    const editorRef = React.useRef(null)
    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {
            answer: ''
        }
    })
    const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
        if (!authorId) {
        return toast({
          title: "Please log in",
          description: "You must be logged in to submit an answer",
          variant: "destructive",
        });
      }
      
      setIsSubmitting(true);
  
      try {
        await createAnswer({
          content: values.answer,
          author: JSON.parse(authorId),
          question: JSON.parse(questionId),
          path: pathname,
        });
  
        form.reset();
  
        if(editorRef.current) {
          
          const editor = editorRef.current as any;
  
          editor.setContent('');
        }

        return toast({
          title: 'Answer Submitted',
          description: 'Your answer has been submitted successfully',
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false)
      }
    }
  
    const generateAIAnswer = async () => {
      if (!authorId) {
        return toast({
          title: 'Please log in',
          description: 'You must be logged in to perform this action '
        })
      }
    
      // Check if question is available
      if (!question) {
        console.log('question is:', question); // Debugging step
        return;
      }
    
      setIsSubmittingAI(true);
    
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question }), // Send the question in the body
        });
    
        const aiAnswer = await response.json();
    
        if (aiAnswer.reply) {
    
          const formattedAnswer = aiAnswer.reply.replace(/\n/g, '<br />');
    
          if (editorRef.current) {
            
            const editor = editorRef.current as any;
            editor.setContent(formattedAnswer);
          }
        } else {
          alert('No reply from AI');
        }
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setIsSubmittingAI(false);
      }
    };
    
  
    return (
    <div>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
            <h4 className="paragraph-semibold text-dark400_light800">Write your answer for this question.</h4>
        
            <Button className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
        onClick={generateAIAnswer}
        >
          {isSubmittingAI ? (
            <>
            Generating...
            </>
          ) : (
            <>
              <Image 
                src="/assets/icons/stars.svg"
                alt="star"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
              </>
            )}
        </Button>
        </div>
    <Form {...form}>
        <form
        className="mt-6 flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateAnswer)}>
            <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormControl className="mt-3.5">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                onInit={(_evt, editor) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  editorRef.current = editor
                }}
                onBlur={field.onBlur}
                onEditorChange={(content) => field.onChange(content)}

                init={{
                    height: 350,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                    'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
                    'insertdatetime', 'media', 'table'
                  ],
                  toolbar: 
                  'undo redo | ' + 'blocks |' +
                  'codesample | bold italic forecolor | alignleft aligncenter |' +
                  'alignright alignjustify | bullist numlist',
                  content_style: 'body { font-family:Inter; font-size:16px }',
                  skin: mode ==='dark' ? 'oxide-dark' : 'oxide',
                  content_css: mode === 'dark' ? 'dark': 'light',
                  }}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className='flex justify-end'>
          <Button
          type='submit'
          className="primary-gradient w-fit text-white"
          disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
        </form>
    </Form>
    </div>
  )
}

export default Answer