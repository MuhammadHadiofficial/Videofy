import React from 'react'
import { Spinner } from './spinner'
import { cn } from '@/lib/utils'

type Props = {
    state:boolean
    children:React.ReactNode
    className?:string
    color?:string
}

const Loader = ({state, children, className, color}:Props) => {
  return state? <div className={cn(className)}><Spinner/></div> : <div className={className}>{children}</div>
}

export default Loader