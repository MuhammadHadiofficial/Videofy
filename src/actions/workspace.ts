"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const verifyAccessTokenToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };
    const isUserInWorSpace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerkid: user.id,
            },
          },
          {
            members: {
              every: {
                User: {
                  clerkid: user.id,
                },
              },
            },
          },
        ],
      },
    });
    return {
      status: 200,
      data: {
        workspace: isUserInWorSpace,
      },
    };
  } catch (error) {
    return {
      status: 403,
      data: {
        workspace: null,
      },
    };
  }
};

export const getWorkSpaceFolders = async (workspaceId: string) => {
  try {
    const isFolders = await client.folder.findMany({
      where: {
        workSpaceId: workspaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (isFolders && isFolders.length) {
      return {
        status: 200,
        data: isFolders,
      };
    } else {
      return {
        status: 404,
        data: [],
      };
    }
  } catch (error) {
    return {
      status: 403,
      data: [],
    };
  }
};

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const videos = await client.video.findMany({
      where: {
        OR: [
          {
            workSpaceId,
          },
          {
            folderId: workSpaceId,
          },
        ],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (videos && videos.length) {
      return {
        status: 200,
        data: {
          videos: videos,
        },
      };
    } else {
      return {
        status: 404,
      };
    }
  } catch (error) {
    return {
      status: 400,
    };
  }
};
export const getWorkSpaces = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

    const workspaces = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (workspaces) {
      return { status: 200, data: workspaces };
    }
  } catch (error) {
    return { status: 400 };
  }
};

export const createWorkspace = async (name: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const authorized = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (authorized?.subscription?.plan === "PRO") {
      const workspace = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          workspace: {
            create: {
              name: name,
              type: "PERSONAL",
            },
          },
        },
      });
      if (workspace) {
        return { status: 200, data: workspace };
      }
      return {
        status: 400,
        data: "you are not authorized to create workspace",
      };
    }
  } catch (error) {
    return { status: 400 };
  }
};

export const renameFolder = async (folderId: string, name: string) => {
  try {
    const folder = await client.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: name,
      },
    });
    if (folder) {
      return { status: 200, data: folder };
    }
    return { status: 400, data: "Folder does not exist" };
  } catch (error) {
    return { status: 400, data: error.message };
  }
};

export const createFolder = async (workspaceId: string) => {
  try {
    const isNewFolder = await client.workSpace.update({
      where: {
        id: workspaceId,
      },
      data: {
        folders: {
          create: {
            name: "New Folder",
          },
        },
      },
    });
    if (isNewFolder) {
      return { status: 200, data: "New Folder created" };
    }
    return { status: 400, data: "Could not create folder" };
  } catch (error) {
    return { status: 400, data: "oops something went wrong" };
  }
};

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await client.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,

        _count: {
          select: {
            videos: true,
          },
        },
      },
    });
    if (folder) {
      return { status: 200, data: folder };
    }
    return { status: 400, data: "Folder does not exist" };
  } catch (error) {
    return { status: 400, data: "oops something went wrong" };
  }
};

export const moveVideoLocation = async (
  videoId: string,
  workspaceId: string,
  folderId: string
) => {
  try {
    const location = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        folderId: folderId || null,
        workSpaceId: workspaceId,
      },
    });
    if (location) return { status: 200, data: "Folder Changed Successfully" };
    return { status: 404, data: "Workspace/folder not found" };
  } catch (error) {
    return { status: 404, data: "Workspace/folder not found" };
  }
};

export const getPreviewVideo = async (videoId: string) => {
  const user = await currentUser();
  if (!user) return { status: 400, data: "User not found" };
  try {
    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        createdAt: true,
        source: true,
        description: true,
        processing: true,
        views: true,
        summery: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
            clerkid: true,
            trial: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });
    console.log('video',video)
    if (!video) return { status: 404, data: "Video not found" };
    return {
      status: 200,
      data: video,
      author: user.id === video.User?.clerkid ? true : false,
    };
  } catch (e) {
    return { status: 404, data: "Video not found" };
  }
};
