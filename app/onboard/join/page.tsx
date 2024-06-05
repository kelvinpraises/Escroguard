"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { joinSwap } from "@/api/action";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/Form";
import Input from "@/components/atoms/Input";
import SubmitButton from "@/components/molecules/SubmitButton";

const formSchema = z.object({
  swapId: z.string().min(5, "Swap id must be at least 5 characters."),
});

const initialState = {
  message: "",
};

const JoinSwap = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      swapId: "",
    },
  });

  const [_state, formAction] = useFormState(joinSwap, initialState);

  useEffect(() => {
    const subscription = form.watch(() => form.handleSubmit(() => {})());
    return () => subscription.unsubscribe();
  }, [form.handleSubmit, form.watch]);

  return (
    <div className="max-w-[450px] w-full p-8 flex flex-col gap-8">
      <p className="text-white text-5xl">Join Swap</p>
      <Form {...form}>
        <form
          action={async (formData: FormData) => {
            const valid = await form.trigger();
            if (!valid) return;
            return formAction(formData);
          }}
          className="flex flex-col gap-8"
        >
          <FormField
            control={form.control}
            name="swapId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Swap ID</FormLabel>
                <FormControl>
                  <Input id="swapId" placeholder="" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton>Request Swap Access</SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default JoinSwap;
