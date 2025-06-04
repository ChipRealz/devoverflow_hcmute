"use client"

import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { useTheme } from '@/context/ThemeProvider'
import { Button } from '../ui/button'
import { createReply } from '@/lib/actions/reply.action'
import { usePathname } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

const ReplySchema = z.object({
  reply: z.string().min(10, "Reply must be at least 10 characters long"),
})

interface Props {
  answerId: string;
  authorId: string;
}

const Reply = ({ answerId, authorId }: Props) => {
  const pathname = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mode } = useTheme()
  const editorRef = React.useRef(null)

  const form = useForm<z.infer<typeof ReplySchema>>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      reply: ''
    }
  })

  const handleCreateReply = async (values: z.infer<typeof ReplySchema>) => {
    console.log('Reply content:', values.reply);
    if (!authorId) {
      return toast({
        title: "Please log in",
        description: "You must be logged in to submit a reply",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(true);

    try {
      await createReply({
        content: values.reply,
        author: authorId,
        answer: answerId,
        path: pathname,
      });

      form.reset();

      if(editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent('');
      }

      return toast({
        title: 'Reply Submitted',
        description: 'Your reply has been submitted successfully',
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">Write your reply</h4>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateReply)} className="mt-6 flex w-full flex-col gap-10">
          <FormField
            control={form.control}
            name="reply"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
                        'insertdatetime', 'media', 'table'
                      ],
                      toolbar: 'undo redo | ' +
                        'codesample | bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: mode === 'dark' ? 'dark' : 'light',
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Reply'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default Reply 