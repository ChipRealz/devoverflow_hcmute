/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { QuestionsSchema } from "@/lib/validiations";
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { createQuestion, editQuestion } from '@/lib/actions/question.action';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeProvider';
import { toast } from '@/hooks/use-toast';


interface Props {
  type? :string;
  mongoUserId: string;
  questionDetails?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Question = ({type, mongoUserId, questionDetails }: Props) => {
  const {mode} = useTheme()
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const parsedQuestionDetails = questionDetails ? JSON.parse(questionDetails) : {};

  
  const groupedTags = parsedQuestionDetails.tags ? parsedQuestionDetails.tags.map((tag: any) => tag.name) : [];

  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedQuestionDetails.title || '',
      explanation: parsedQuestionDetails.content || '',
      tags: groupedTags || [],
    },
  })
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    if (!recaptchaToken) {
      toast({ title: 'Please complete the reCAPTCHA', description: 'reCAPTCHA verification is required.' });
      return;
    }
  
    // Verify the reCAPTCHA token with the server
    const recaptchaResponse = await fetch('/api/googlerecaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: recaptchaToken }),
    });
  
    const recaptchaResult = await recaptchaResponse.json();
  
    if (!recaptchaResult.success) {
      toast({ title: 'reCAPTCHA failed', description: recaptchaResult.message });
      setRecaptchaToken(null); // Reset token if needed
      return;
    }
    setIsSubmitting(true);
    
    try {
      if(type === 'Edit') {
        await editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.explanation,
          path: pathname,
        })
        router.push(`/question/${parsedQuestionDetails._id}`);
        return toast({
          title: 'Question edited successfully',
          description: 'Your question has been successfully edited',
        });
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });
        router.push('/');
        return toast({
          title: 'Question posted successfully',
          description: 'Your question has been successfully posted',
        });
      }
      
    } catch (error) {
      
    } finally {
      setIsSubmitting(false);
      setRecaptchaToken(null); 
    }
  }

  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if(tagValue !== '') {
        if(tagValue.length > 30) {
          return form.setError('tags', {
            type: 'required',
            message: 'Tag must be less than 30 characters.'
          })
        }

        if(!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue]);
          tagInput.value = ''
          form.clearErrors('tags');
        }
      } else {
        form.trigger();
      }
    }
  }

  
  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);

    form.setValue('tags', newTags);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">Question Title <span className="text-primary-500">*</span></FormLabel>
              <FormControl className="mt-3.5">
                <Input 
                className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                {...field} />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">Detailed explanation of your problem <span className="text-primary-500">*</span></FormLabel>
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
                initialValue={parsedQuestionDetails.content || ''}
                init={{
                    height: 350,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                    'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
                    'insertdatetime', 'media', 'table'
                  ],
                  toolbar: 
                  'undo redo | blocks |' +
                  'codesample | bold italic forecolor | alignleft aligncenter |' +
                  'alignright alignjustify | bullist numlist |  link  | copy paste | preview ', 
                  content_style: 'body { font-family:Inter; font-size:16px }',
                  skin: mode ==='dark' ? 'oxide-dark' : 'oxide',
                  content_css: mode === 'dark' ? 'dark': 'light',
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags
                <span
                  className="
              text-primary-500"
                >
                  *
                </span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                  disabled={type === 'Edit'}
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />

                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: string) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() => type !== 'Edit' ? handleTagRemove(tag, field) :
                            () => {}
                          }
                        >
                          {tag}
                          { type !== 'Edit' && (<Image
                            src="/assets/icons/close.svg"
                            alt="Close icon"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0 dark:invert"
                          />)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 4 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
         <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string}
          onChange={setRecaptchaToken}
        />
        <Button type="submit" className="primary-gradient w-fit !text-light-900" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              {type === 'Edit' ? 'Editing...' : 'Posting...' }
            </>
          ) : (
            <>
              {type === 'Edit' ? 'Edit Question' : 'Ask a Question'}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;