import { useMutationData } from '@/hooks/useMutationData'
import { useSearch } from '@/hooks/useSearch'
import React from 'react'
import { Input } from '../../input'
import { Skeleton } from '../../skeleton'
import { Avatar } from '../../avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { User } from 'lucide-react'
import { Button } from '../../button'
import Loader from '../loader'

type Props = {
  workspaceId: string
}

const Search = ({workspaceId}: Props) => {
  const {isFetching,onSearchQuery,onUser,query} =useSearch("get-users", "USERS")
  // WIP: Wire up sending invites
  // const {mutate,isPending}=useMutationData(['invite-members'],(data:{recieverId:string,email:string})=>{

  // });
  return (
    <div className='flex flex-col gap-y-5'>
      <Input onChange={onSearchQuery} value={query} className='bg-tranparent border-2 outline-none' placeholder='Serach for your user' type='text'></Input>
      {
        isFetching ? <div className="flex flex-col gap-y-2">
          <Skeleton className='w-full h-10 rounded-xl' />
        </div>
        : !onUser?.length ? <p className='text-center text-sm text-[#a4a4a4]'>No user found</p> : <div className='flex flex-col gap-y-2'>
         {
          onUser?.map((user)=>(
            <div key={user.id} className='flex items-center gap-x-3  border-2 w-full p-3 rounded-xl'>
           <Avatar>
            <AvatarImage/>
            <AvatarFallback>
              <User/>
            </AvatarFallback>
           </Avatar>
           <div className="flex flex-col items-start">
            <h3 className="text-bold text-lg capitalize">{user.firstName} {user.lastName}</h3>
            <p className="text-xs lowercase bg-white px-2 rounded-lg text-[#1e1e1e]">{user.subscription?.plan}</p>
           </div>
            <div className="flex-1 flex flex-end items-center">
              <Button onClick={()=>{}} variant={"default"} className='w-5/12 font-bold'><Loader state={true} color='#000'>Invite User</Loader></Button>
            </div>
            </div>

          ))
         }
          </div>
      }
    </div>
  )
}

export default Search