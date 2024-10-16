"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { signUpSchema } from "../../../../schema/signUpSchema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
interface SignUpFormData {
  displayName: string;
  username: string;
  email: string;
  password: string;
  currency: string;
}
const SignUp = () => {
  const router = useRouter();
  const methods = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });
  const { toast } = useToast();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await axios.post("/api/user/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/sign-in");
    }
    /* eslint-disable */
     catch (error: any) {
      console.log("error in submitting to sign up", error.message);
    }
    /* eslint-disable */
  };

  return (
    <div className="bg-gray-900 h-screen w-full flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center text-white">Sign Up</h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {/* Display Name Field */}
            <FormField
              control={methods.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Display Name</FormLabel>
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your display name"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username Field */}
            <FormField
              control={methods.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Username</FormLabel>
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your username"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={methods.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email</FormLabel>
                  <input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={methods.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Password</FormLabel>
                  <input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency Field */}
            <FormField
              control={methods.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">
                    Preferred Currency
                  </FormLabel>
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. USD, PKR, INR"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              disabled={methods.formState.isSubmitting}
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign Up
            </Button>
            <div className="section text-center text-white">
              <p>
                Already on MyFinance?{" "}
                <Link href={"/sign-in"} className="text-blue-600 font-bold">
                  {" "}
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default SignUp;
