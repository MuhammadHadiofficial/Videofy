import { UseMutateFunction } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z, { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
export const useZodForm = (
  schema: ZodSchema,
  mutation: UseMutateFunction,
  defaultValues?: any
) => {
  const {register,watch,reset,handleSubmit,formState:{
    errors
  }} = useForm<z.infer<typeof schema>>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onFormSubmit=handleSubmit(async(values)=>{
    return mutation({...values});
  })
  return {
    register,
    watch,
    reset,
    onFormSubmit,
    errors
  };
};

export default useZodForm;
