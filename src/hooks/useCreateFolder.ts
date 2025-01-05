import { createFolder } from "@/actions/workspace"
import { useMutationData } from "./useMutationData"
import { useQueryClient } from "@tanstack/react-query"

export const useCreateFolder = (workSpaceid:string) => {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutationData(
    ['create-folder'],
    ({ name }: { name: string }) => createFolder(workSpaceid),
   'workspace-folders',
  )
  const onCreateFolder = () => mutate({ name, id:"optimistic_id" })

  return { onCreateFolder, isPending }
}