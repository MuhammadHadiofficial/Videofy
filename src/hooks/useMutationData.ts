import { MutationFunction, MutationKey, useMutation, useMutationState, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutationData = (
    mutationKey:MutationKey,
    mutationFn:MutationFunction<any,any>,
    queryKey?:string,
    onSuccess?:()=>void,
) => {
    const client= useQueryClient();
  const {mutate,isPending}=  useMutation({
        mutationKey,
        mutationFn,
        onSuccess:(data)=>{
            if(data.status===200) onSuccess?.();
             return toast(data.status===200?"Success":"Error",{
                description:data?.data,
             })
            
        },
        onSettled:async ()=>{
            return await client.invalidateQueries({queryKey})
        }
    })
  return {
   mutate,
   isPending
  };
};
// Get updated data returned after the mutation triggered server actions we did and return that data
export const useMutationDataState=(mutationKey:MutationKey)=>{
    const data=useMutationState({
      filters:{mutationKey},
      select:(mutation)=>{
        return {
            variables:mutation.state.variables as any,
            status:mutation.state.status,
        }
      }  
    })
    const latestVariables=data[data.length-1]
    return {latestVariables}
}