'use client'
import React from "react";
import { useForm } from "react-hook-form";

const TestForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("example")} placeholder="Type something" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default TestForm;
