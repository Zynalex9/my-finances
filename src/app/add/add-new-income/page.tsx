"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form"; // Ensure this import is correct
import { incomeSchema } from "../../../../schema/incomeSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import axios, { AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";

const Page = () => {
  const [reqData, setReqData] = useState<AxiosResponse>();
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
  const onSubmit = async (data: any) => {
    console.log(data); // Handle form submission
    try {
      const response = await axios.post("/api/income/addincome", data);
      console.log(response);
      setReqData(response);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <FormControl>
                <Input placeholder="Job, Freelance" {...field} />
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
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="$$" {...field} />
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
                <Input placeholder="usd, eur, pkr, inr" {...field} />
              </FormControl>
              {errors.currency && (
                <span className="text-red-500">{errors.currency.message}</span>
              )}
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default Page;
