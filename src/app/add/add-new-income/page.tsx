"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form"; // Ensure this import is correct
import { incomeSchema } from "../../../../schema/incomeSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const Page = () => {
  const { toast } = useToast();

  // Initialize form with useForm
  const form = useForm<z.infer<typeof incomeSchema>>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      source: "",
      amount: "",
      currency: "usd",
    },
  });

  // Destructure reset and formState from form
  const { reset, formState: { errors, isSubmitting } } = form;
  /* eslint-disable */
  const onSubmit = async (data: any) => {
    console.log(data); 
    try {
      const response = await axios.post("/api/income/addincome", data);
      toast({
        title: "Income Added",
        description: "New income has been added!",
      });
      reset(); // Reset the form fields to default values after successful submission
    } catch (error: any) {
      console.error(error); // Log the error for debugging
      toast({
        title: "Error Occurred",
        description:
          error.response?.data?.message ||
          "Failed to add income. Please try again.", // Display error message
      });
    }
  };
/* eslint-disable */
  return (
    <div className="bg-dark-gray text-white min-h-screen py-10">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Source</FormLabel>
              <FormControl>
                <Input placeholder="Job, Freelance" className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring focus:ring-blue-500" {...field} />
              </FormControl>
              {errors.source && (
                <span className="text-red-500">{errors.source.message}</span>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="$$" className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring focus:ring-blue-500" {...field} />
              </FormControl>
              {errors.amount && (
                <span className="text-red-500">{errors.amount.message}</span>
              )}
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-[180px] bg-gray-700 text-white border border-gray-600">
                      <SelectValue placeholder="Select an option" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                      <SelectGroup>
                        <SelectLabel>Currency</SelectLabel>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="eur">EUR</SelectItem>
                        <SelectItem value="pkr">PKR</SelectItem>
                        <SelectItem value="inr">INR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        <Button type="submit" className="bg-blue-800 text-white hover:bg-slate-700" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
    </div>
  );
  
};

export default Page;
