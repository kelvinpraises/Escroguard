"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createSwap } from "@/api/action";
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
  swapName: z.string().min(3, {
    message: "Swap name must be at least 2 characters.",
  }),

  swapFee: z
    .number({ invalid_type_error: "Swap fees must be a valid number." })
    .min(0, { message: "Swap fees too low." }),
});

const initialState = {
  message: "",
};

const CreateSwap = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      swapName: "",
      swapFee: 0,
    },
  });

  const [_state, formAction] = useFormState(createSwap, initialState);

  useEffect(() => {
    const subscription = form.watch(() => form.handleSubmit(() => {})());
    return () => subscription.unsubscribe();
  }, [form.handleSubmit, form.watch]);

  return (
    <div className="max-w-[450px] w-full">
      <div className="p-8 flex flex-col gap-8">
        <p className="text-white text-5xl">Create Swap</p>
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
              name="swapName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Swap name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="swapFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Swap fee</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      type="number"
                      {...field}
                      {...form.register("swapFee", { valueAsNumber: true })}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton>Create Private Swap</SubmitButton>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateSwap;
