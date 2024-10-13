"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { budgetSchema } from "../../../../schema/addBudgetSchema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddNewBudget() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
  });
  const {
    formState: { errors, isSubmitting },
    setError,
  } = form;

  async function onSubmit(data: z.infer<typeof budgetSchema>) {
    const formattedData = {
      ...data,
      amount: Number(data.amount), // Ensure amount is a number
      startDate:
        data.startDate instanceof Date
          ? format(data.startDate, "yyyy-MM-dd")
          : data.startDate,
      endDate:
        data.endDate instanceof Date
          ? format(data.endDate, "yyyy-MM-dd")
          : data.endDate,
    };
    try {
      const response = await axios.post("/api/budget/addbudget", formattedData);
      if (response.data.success) {
        toast({
          title: `${data.category} is added as a new budget`,
        });
        router.replace("/"); 
      } else {
        toast({
          title: `Error adding budget`,
          description: response.data.message || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
      if (error.response?.data?.errors) {
        Object.keys(error.response.data.errors).forEach((key) => {
          setError(key as any, {
            type: "manual",
            message: error.response.data.errors[key].message,
          });
        });
      }
      toast({
        title: `Error adding budget`,
        description: message,
      });
    }
  }

  return (
    <div className="bg-dark-gray text-white min-h-screen py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 mx-auto space-y-6 p-6 bg-gray-900 rounded-lg shadow-md">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="food, rent"
                    className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Currency */}
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

          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-[240px] pl-3 text-left font-normal bg-gray-700 text-white border border-gray-600 ${!field.value ? 'text-gray-400' : ''}`}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Select Start Date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-[240px] pl-3 text-left font-normal bg-gray-700 text-white border border-gray-600 ${!field.value ? 'text-gray-400' : ''}`}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Select End Date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="bg-blue-800 text-white hover:bg-slate-700">
            {isSubmitting ? "Adding new budget..." : "Add new budget"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
