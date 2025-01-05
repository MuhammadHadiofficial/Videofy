import { onAuthenticateUser } from '@/actions/user'
import { Spinner } from '@/components/ui/global/loader/spinner'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const AuthLoading = async (props: Props) => {
   
  return (
    <div className='flex h-screen w-full justify-center items-center justify-center'>
        <Spinner/>
    </div>
  )
}

export default AuthLoading