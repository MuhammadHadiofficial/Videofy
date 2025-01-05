import { getAllUserVideos, getFolderInfo } from '@/actions/workspace'
import { dehydrate, hydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'
import FolderInfo from './folder-info'

type Props = {
  params: {
    folderId: string,
    workspaceid: string
  }
}

const FolderDetails =async ({ params: { folderId, workspaceid } }: Props) => {
  console.log(folderId,workspaceid)
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
  </HydrationBoundary>
  )
}

export default FolderDetails