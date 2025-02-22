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
import { useToast } from "@/hooks/use-toast";
import { serviceSignUpSchema } from "@/schemas/serviceSignUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { LoaderPinwheel } from "lucide-react";
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

  const serviceForm = useForm<z.infer<typeof serviceSignUpSchema>>({
    resolver: zodResolver(serviceSignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullname: "",
      phone: "",
      role: "service",
      rating: 0,
      enterpriseName: "",
      enterpriseAddress: "",
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
        axiosError.response?.data.message ??
          "Error checking username uniqueness"
      );
    } finally {
      setIsCheckingUsername(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkUsernameUnique();
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const onServiceFormSubmit = async (
    data: z.infer<typeof serviceSignUpSchema>
  ) => {
    setIsSubmitting(true);
    data.role = "service";
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
      <div className="w-full max-w-2xl p-6 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-4">
            Join AutoResQ
          </h1>
          <p className="mb-4 text-base sm:text-lg">
            Sign up to offer your services as a mechanic and assist clients in
            need of help.
          </p>
        </div>

        <div>
          <FormProvider {...serviceForm}>
            <form
              onSubmit={serviceForm.handleSubmit(onServiceFormSubmit)}
              className="space-y-6"
            >
              <FormField
                control={serviceForm.control}
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

                    {isCheckingUsername && <LoaderPinwheel className="animate-spin" />}
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
                control={serviceForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                control={serviceForm.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
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
                control={serviceForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
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
                control={serviceForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone No</FormLabel>
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
              <FormField
                control={serviceForm.control}
                name="enterpriseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enterprise Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enterprise name"
                        {...field}
                        className="p-3 border rounded-md w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="enterpriseAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enterprise Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enterprise address"
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
                    <LoaderPinwheel className="animate-spin" />
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
          <p className="text-sm sm:text-base">
            Already a member?{' '}
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
