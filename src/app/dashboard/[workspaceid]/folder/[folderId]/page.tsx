import { getAllUserVideos, getFolderInfo } from '@/actions/workspace'
import { dehydrate, hydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'
import FolderInfo from './folder-info'
import Videos from '@/components/ui/global/videos'

type Props = {
  params: {
    folderId: string,
    workspaceid: string
  }
}

const FolderDetails =async ({ params: { folderId, workspaceid } }: Props) => {
 
  const query= new QueryClient()

  await query.prefetchQuery({
   queryKey: ['folder-videos'],
   queryFn: () => getAllUserVideos(folderId),
  })
  await query.prefetchQuery({
    queryKey: ['folder-info'],
    queryFn: () => getFolderInfo(folderId),
  })
  return (
  <HydrationBoundary state={dehydrate(query)} >
    <FolderInfo folderId={folderId} />
    <Videos
     folderId={folderId}
    videosKey={"folder-videos"}
    workspaceId={workspaceid}
    />
  </HydrationBoundary>
  )
}

export default FolderDetails