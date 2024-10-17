"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define the schema for the form validation
const FormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    formState: {isSubmitting },
    setError,
  } = form;
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await axios.post("/api/user/sign-in", data);
      router.replace("/");
      toast({
        title: "Logged in successfully",
        description: `Welcome back ${data.email}`,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Check if the error has a response and handle accordingly
        const errorMessage = error.response.data.message;

        if (errorMessage === "User not found. Invalid email") {
          setError("email", { type: "manual", message: errorMessage });
        } else if (errorMessage === "Invalid Password") {
          setError("password", { type: "manual", message: errorMessage });
        }
      }
    }
  }

  return (
    <div className="bg-gray-900 h-screen w-full flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center text-white">
          Log In
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@mail.com"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Enter the email associated with your account.
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Enter your account password.
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 py-2"
            >
              {isSubmitting ? "Processing...." : "Sign in"}
            </Button>
            <div className="section text-center text-white">
              <p>
                First time on MyFinance? <Link href={"/sign-up"} className="text-blue-600 font-bold"> Sign Up</Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
