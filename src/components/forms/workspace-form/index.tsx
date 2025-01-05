import { Button } from '@/components/ui/button';
import FormGenerator from '@/components/ui/global/form-generator';
import { useCreateWorkspace } from '@/hooks/useCreateWorkspace';
import React from 'react'

type Props = {}

const WorkspaceForm = (props: Props) => {
    const {errors,onFormSubmit,register,isPending}=useCreateWorkspace();
  return (
    <form onSubmit={onFormSubmit} className='flex flex-col gap-y-4'>
      <FormGenerator
      name='name'
      label='Workspace Name'
      placeholder='Workspace Name'
      type='text'
      inputType='input'
      errors={errors}
      register={register}
      />
      <Button className='text-sm w-full mt-2' type='submit' disabled={isPending}>
        Create Workspace</Button>
      </form>
  )
}

export default WorkspaceForm