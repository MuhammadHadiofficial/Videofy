import {z} from 'zod';

export const workspaceSchema = z.object({
    name: z.string().min(1,{message:"Workspace name is required"}),
});

export  const moveVideoSchema=z.object({
    folder_id:z.string().optional(),
    workspace_id:z.string()
})