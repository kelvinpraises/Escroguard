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
import { RPCError, RPCErrorCode, magicClient } from "@/services/magic/magicClient";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

const EmailLogin = () => {
  const [_, setUser] = useContext(UserContext);
  const [disabled, setDisabled] = useState(false);

  async function handleLoginWithEmail(email: string) {
    try {
      setDisabled(true);
      if (!magicClient) {
        throw new Error("Magic instance is not available");
      }

      let didToken = await magicClient.auth.loginWithMagicLink({
        email,
        redirectURI: new URL("/callback", window.location.origin).href, // optional redirect back to your app after magic link is clicked
        // showUI: false
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
        let data = await res.json();
        setUser(data.user);
      }

      setDisabled(false);
    } catch (error) {
      setDisabled(false);
      console.log(error);
      if (error instanceof RPCError) {
        switch (error.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
          case RPCErrorCode.MagicLinkExpired:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            // Handle errors accordingly :)
            break;
        }
      }
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
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
