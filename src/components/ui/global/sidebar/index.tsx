"use client"
import Image from 'next/image'
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from '../../select'
import { usePathname, useRouter } from 'next/navigation'
import { SelectTrigger } from '@radix-ui/react-select'
import { useQuery } from '@tanstack/react-query'
import { useQueryData } from '@/hooks/useQueryData'
import { WorkspaceProps, NotificationProps } from '@/types/index.types'
import { Separator } from '../../separator'
import { getWorkSpaces } from '@/actions/workspace'
import Modal from '../modal'
import { Menu, PlusCircle } from 'lucide-react'
import WorkSpaceSearch from '../search'
import Search from '../search'
import { MENU_ITEMS } from '@/ constants'
import SidebarItem from './sidebar-item'
import { getNotifications } from '@/actions/user'
import WorkSpacePlaceholder from './workspace-placeholder'
import GlobalCard from '../global-card'
import { Button } from '../../button'
import Loader from '../loader'
import { Sheet, SheetContent, SheetTrigger } from '../../sheet'
import InfoBar from '../info-bar'

type Props = {
  activeWorkspaceId: string
}

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter()
  const pathname = usePathname();

  const menu_items = MENU_ITEMS(activeWorkspaceId)
  const { data, isFetched } = useQueryData(
    ["user-workspaces",], getWorkSpaces,
  )

  const { data: notifications } = useQueryData(
    ['user-notifications'],
    getNotifications
  )
  const { data: workspace } = data as WorkspaceProps
  // fix if notifications is undefined
  const { data: count } = notifications ?? { data: undefined } as NotificationProps;


  const onChangeActiveWorkspace = (workspaceId: string) => {
    router.push(`/dashboard/${workspaceId}`)
  }
  const currentWorkspace = workspace?.workspace?.find((workspace) => workspace.id === activeWorkspaceId)
  const Sidebar=(   <div className='bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden'>

    <div className='bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0'>
      <Image src={"/opal-logo.svg"} width={40} height={40} alt="Opal Logo" />
      <p className='text-2xl'>Opal</p>
    </div>
    <Select
      defaultValue={activeWorkspaceId}
      onValueChange={onChangeActiveWorkspace}>
      <SelectTrigger className='mt-16 text-neutral-400 bg-transparent'>
        <SelectValue placeholder="Select a workspace"></SelectValue>
      </SelectTrigger>
      <SelectContent className='bg-[] backdrop-blur-xl'>
        <SelectGroup>
          <SelectLabel>
            Workspaces
          </SelectLabel>
          <Separator />
          {
            workspace.workspace && workspace.workspace.map((workspace) => {
              return (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              )
            })
          }
          {
            workspace.members.length > 0 && workspace.members.map((member) => {
              return (
                <SelectItem key={member.WorkSpace.id} value={member.WorkSpace.id}>
                  {member.WorkSpace.name}
                </SelectItem>
              )
            })
          }
        </SelectGroup>
      </SelectContent>
    </Select>
    {
      currentWorkspace?.type === "PUBLIC" && currentWorkspace?.subscription?.plan === "PRO" && <Modal title='Invite To Workspace' trigger={
        <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90  hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
          <PlusCircle
            size={15}
            className="text-neutral-800/90 fill-neutral-500"
          />
          <span className="text-neutral-400 font-semibold text-xs">
            Invite To Workspace
          </span>
        </span>
      }
        title="Invite To Workspace"
        description="Invite other users to your workspace"
      >
        <Search workspaceId={activeWorkspaceId} />
      </Modal>
    }
    <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>
    <nav className='w-full'>
      <ul>
        {
          menu_items.map((item) => <SidebarItem href={item.href} icon={item.icon} selected={pathname === item.href}
            title={item.title}
            key={item.title}
            notifications={
              (item.title === "Notifications" &&
                count?._count && count._count.notifications) || 0

            }
          ></SidebarItem>)
        }
      </ul>
    </nav>
    <Separator className='w-4/5' />
    <p className="w-full font-bold mt-4 text-[#9D9D9D">
      Workspaces
    </p>
    <nav className="w-full">
      <ul className="h-[150px] overflow-auto overflow-hidden-x-hidden fade-layer">
        {
          workspace?.workspace?.filter((workspace) => workspace.type !== "PERSONAL").map((workspace, index) => (
            <SidebarItem
              key={index}
              href={`/dashboard/${workspace.id}`}
              title={workspace.name}
              notifications={0}
              icon={
                <WorkSpacePlaceholder>
                  {workspace.name.charAt(0).toUpperCase()}
                </WorkSpacePlaceholder>
              }
            />
          ))
        }
        {
          workspace?.members.map((workspace, index) => (
            <SidebarItem
              key={index}
              href={`/dashboard/${workspace.WorkSpace.id}`}
              title={workspace.WorkSpace.name}
              notifications={0}
              icon={
                <WorkSpacePlaceholder>
                  {workspace.WorkSpace.name.charAt(0).toUpperCase()}
                </WorkSpacePlaceholder>
              }
            />
          ))
        }
        {

          workspace?.workspace.length === 0 &&
          workspace.members.length === 0 && <div className="w-full h-full flex justify-center items-center">
            <p className="text-[#9D9D9D] font-medium text-sm">{
              workspace.subscription?.plan === "FREE" ? "Upgrade to the pro plan to create more workspaces." : "No workspaces."
            }</p>
          </div>
        }
      </ul>
    </nav>
    <Separator className='w-4/5' />
    {
      workspace.subscription?.plan === "FREE" && (
        <GlobalCard
          title='Upgrade to Pro'
          description='Unlock AI features like transcription, AI summary, and more.'
          footer={
            <Button className='text-sm w-full'>
              <Loader color='#fff' state={false}>Upgrade</Loader>
            </Button>
          }
        >

        </GlobalCard>
      )
    }
  </div>)
  return (
 <div className="full">
  <InfoBar/>
  <div className="md:hidden fixed my-4">
    <Sheet>
      <SheetTrigger asChild className='ml-2'>
        <Button variant={"ghost"} className='mt-[2px]'>
          <Menu/>
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className='p-0 w-fit h-full'>
    {Sidebar}
    </SheetContent>
    </Sheet>

  </div>
  <div className="md:block hidden h-full">{Sidebar}</div>
 </div>
  )
}

export default Sidebar