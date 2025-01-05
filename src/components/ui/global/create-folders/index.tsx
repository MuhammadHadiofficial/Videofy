import React from 'react'
import { Button } from '../../button'
import FolderPlusDuotine from '@/icons/folder-plus-duotone'
import { useCreateFolder } from '@/hooks/useCreateFolder'

type Props = {
    workspaceid: string
}

const CreateFolder = ({workspaceid}: Props) => {
  const {onCreateFolder,isPending} = useCreateFolder(workspaceid)
  return (
    <Button onClick={onCreateFolder} className='bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounder-2xl'>
      <FolderPlusDuotine />
      Create a folder</Button>
  )
}

export default CreateFolder