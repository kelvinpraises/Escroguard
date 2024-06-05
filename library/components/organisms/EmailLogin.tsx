"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/atoms/Button";
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
import { UserContext } from "@/providers/userAuthData";
import { magic } from "@/services/magic";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

const EmailLogin = () => {
  const [user, setUser] = useContext(UserContext);
  const [disabled, setDisabled] = useState(false);

  async function handleLoginWithEmail(email: string) {
    try {
      setDisabled(true); // disable login button to prevent multiple emails from being triggered

      if (!magic) {
        throw new Error("Magic instance is not available");
      }

      // Trigger Magic link to be sent to user
      let didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL("/callback", window.location.origin).href, // optional redirect back to your app after magic link is clicked
      });

      // Validate didToken with server
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
      });

      if (res.status === 200) {
        // Set the UserContext to the now logged in user
        let userMetadata = await magic.user.getMetadata();
        setUser(userMetadata);
      }

      setDisabled(false); // re-enable login button - button might be active when logged out
    } catch (error) {
      setDisabled(false); // re-enable login button - user may have requested to edit their email
      console.log(error);
    }
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    handleLoginWithEmail(values.email);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                A personal email to receive a magic sign-in link.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={disabled} type="submit">
          Send Magic Link
        </Button>
      </form>
    </Form>
  );
};

export default EmailLogin;
