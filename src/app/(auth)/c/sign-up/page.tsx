"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { clientSignUpSchema } from "@/schemas/clientSignUpSchema";
import { serviceSignUpSchema } from "@/schemas/serviceSignUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const { toast } = useToast();

  const router = useRouter();

  const clientForm = useForm<z.infer<typeof clientSignUpSchema>>({
    resolver: zodResolver(clientSignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullname: "",
      phone: "",
      role: "client",
    },
  });

  const checkUsernameUnique = async () => {
    if (username) {
      setIsCheckingUsername(true);
      setUsernameMessage("");
    }
    try {
      const response = await axios.get(
        `/api/check-username-unique?username=${username}`
      );
      setUsernameMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setUsernameMessage(
        axiosError.response?.data.message ?? "Error checking username uniqueness"
      );
    } finally {
      setIsCheckingUsername(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      checkUsernameUnique();
    }, 500);
  }, [username]);

  const onClientFormSubmit = async (
    data: z.infer<typeof clientSignUpSchema>
  ) => {
    setIsSubmitting(true);
    data.role = "client";
    console.log(data);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = (await error) as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed to verify user",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg sm:max-w-md p-6 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join AutoResQ
          </h1>
          <p className="mb-6 text-base sm:text-lg">
            Sign up to find mechanics who can assist you with your vehicle needs.
          </p>
        </div>

        <div>
          <FormProvider {...clientForm}>
            <form
              onSubmit={clientForm.handleSubmit(onClientFormSubmit)}
              className="space-y-6"
            >
              <FormField
                control={clientForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          setUsername(e.currentTarget.value);
                          field.onChange(e);
                        }}
                        className="p-3 border rounded-md w-full"
                      />
                    </FormControl>

                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`text-sm ${
                          usernameMessage === "Username is available"
                            ? "text-green-700"
                            : "text-red-500"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={clientForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email: </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email"
                        {...field}
                        className="p-3 border rounded-md w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={clientForm.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name: </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="fullname"
                        {...field}
                        className="p-3 border rounded-md w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={clientForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password: </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        {...field}
                        className="p-3 border rounded-md w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={clientForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone No: </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="phone"
                        {...field}
                        className="p-3 border rounded-md w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Submitting
                  </>
                ) : (
                  <>Submit</>
                )}
              </Button>
            </form>
          </FormProvider>
        </div>
        <div className="text-center mt-6">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
