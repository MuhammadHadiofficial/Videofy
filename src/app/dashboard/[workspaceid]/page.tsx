"use client"
import CreateFolder from '@/components/ui/global/create-folders'
import CreateWorkSpace from '@/components/ui/global/create-workspace'
import Folders from '@/components/ui/global/folders'
import Videos from '@/components/ui/global/videos'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'
import { useParams } from 'next/navigation'
import React from 'react'

type Props = {
  params:{
    workspaceid:string
  }
}

const WorkSpace = (props: Props) => {
  const params=useParams()
  return (
    <div>
      <Tabs defaultValue='videos' className='mt-6'>
<div className="flex w-full justify-between items-center">
  <TabsList className='bg-transparent gap-2 pl-0'>
    <TabsTrigger className='p-[13px] rounded-full data-[state=active]:bg-[#252525]' value='videos'>Videos</TabsTrigger>
    <TabsTrigger className='p-[13px] rounded-full data-[state=active]:bg-[#252525]' value="archive">Archive</TabsTrigger>
 
  </TabsList>
  <div className="flex gap-x-3">
  <CreateWorkSpace/>
  <CreateFolder workspaceid={params?.workspaceid}/>
</div>
</div>
<section className='py-3'>
<TabsContent value='videos'>
  <Folders workspaceid={params?.workspaceid}/>
  <Videos workspaceId={params?.workspaceid}     videosKey={"user-videos"} />
  </TabsContent>
</section>
      </Tabs>
      
    </div>
  )
}

export default WorkSpace