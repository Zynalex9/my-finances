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
import { expenseSchema } from "../../../../schema/addExpense";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const page = () => {
  const [resBudget, setResBudget] = useState<any[]>([]);
  const [budgetID, setBudgetID] = useState("");
  const form = useForm({
    resolver: zodResolver(expenseSchema),
    // defaultValues:{
    //   budgetId: "ABC"
    // }
  });
  const {
    reset,
    formState: { isSubmitting },
  } = form;

  const { toast } = useToast();
  async function onSubmit(data: any) {
    try {
      const { category } = data;

      const normalizedCategory = category.toLowerCase();

      const singleBudget = await axios.get(
        `/api/budget/getbudget?category=${normalizedCategory}` // Use normalized category
      );

      if (singleBudget.status === 200) {
        setResBudget(singleBudget.data);
        const newBudgetID = singleBudget.data.budget._id;
        setBudgetID(newBudgetID); // Update the state with the actual budget ID

        const reqData = {
          budgetId: newBudgetID, // Now this will be the actual budget ID
          ...data,
          category: normalizedCategory, // Send normalized category to the server
        };
        console.log("reqData", reqData);
        const expenseRequest = await axios.post(
          "/api/expense/addexpense",
          reqData
        );

        if (expenseRequest.data.success) {
          toast({
            title: "Success!",
            description: "Expense added successfully!",
          });
          reset();
        } else {
          toast({
            title: "Error",
            description:
              expenseRequest.data.message ||
              "An error occurred during submission.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: singleBudget.data.message || "Could not fetch budget.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error fetching or adding expense:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className=" bg-dark-gray text-white min-h-screen py-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-md"
        >
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn"
                    className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-gray-400"></FormDescription>
                <FormMessage className="text-red-500" />
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
                  <Input
                    type="number"
                    placeholder="shadcn"
                    className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-gray-400"></FormDescription>
                <FormMessage className="text-red-500" />
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
                    className="bg-gray-700 text-white border border-gray-600"
                  >
                    <SelectTrigger className="w-[180px] bg-gray-700 text-white border border-gray-600">
                      <SelectValue
                        placeholder="Select an option"
                        className="text-white"
                      />
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn"
                    className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-gray-400"></FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="spendingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal bg-gray-700 text-white border border-gray-600",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select Spending Date</span>
                        )}
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
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-blue-800 text-white hover:bg-slate-700"
            disabled={isSubmitting}
          >
            {
              isSubmitting ? " Adding new expense... " : "Add new expense"
            }
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default page;
