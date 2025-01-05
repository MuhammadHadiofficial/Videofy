import { Dialog } from '@radix-ui/react-dialog'
import React from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../dialog'

type Props = {
    children: React.ReactNode,
    trigger: React.ReactNode,
    className?: string
    title?: string
    description?: string
}

const Modal = ({ children, trigger, className, title, description }: Props) => {
    return (
        <Dialog>
            <DialogTrigger asChild className={className}>
                {trigger}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>

                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default Modal