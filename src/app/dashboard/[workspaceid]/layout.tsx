import { getNotifications, onAuthenticateUser } from '@/actions/user'
import { getAllUserVideos, getWorkSpaceFolders, getWorkSpaces, verifyAccessTokenToWorkspace } from '@/actions/workspace'
import { verifyToken } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import Sidebar from '@/components/ui/global/sidebar'
import GlobalHeader from '@/components/ui/global/global-header'
type Props = {
  params: {
    workspaceid: string
  },
  children: React.ReactNode
}

const Layout = async ({ params: { workspaceid }, children }: Props) => {
  const auth = await onAuthenticateUser()
  
  if (!auth.user?.workspace) redirect('/auth/sign-in')
  if (!auth.user?.workspace.length) redirect('/auth/sign-in')
  const hasAccess = await verifyAccessTokenToWorkspace(workspaceid)
  if (hasAccess.status !== 200) redirect(auth.user?.workspace[0].id)
  if (!hasAccess.data?.workspace) return null
  const query = new QueryClient()
  await query.prefetchQuery({
    queryKey: ["workspace-folders",

    ],
    queryFn: () => getWorkSpaceFolders(workspaceid)
  })
  await query.prefetchQuery({
    queryKey: ["user-videos",

    ],
    queryFn: () => getAllUserVideos(workspaceid)
  })
  await query.prefetchQuery({
    queryKey: ["user-workspaces",

    ],
    queryFn: () => getWorkSpaces()
  })
  await query.prefetchQuery({
    queryKey: ["user-notifications", ,

    ],
    queryFn: () => getNotifications()
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceid} />
        <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          <GlobalHeader workspace={hasAccess.data?.workspace} />
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Layout