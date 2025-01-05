"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// import {db} from

export const onAuthenticateUser = async () => {
    try {
      const user = await currentUser()
      if (!user) {
        return { status: 403 }
      }
  
      const userExist = await client.user.findUnique({
        where: {
          clerkid: user.id,
        },
        include: {
          workspace: {
            where: {
              User: {
                clerkid: user.id,
              },
            },
          },
        },
      })
      if (userExist) {
        return { status: 200, user: userExist }
      }
      
      const newUser = await client.user.create({
        data: {
          clerkid: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstname: user.firstName,
          lastname: user.lastName,
          image: user.imageUrl,
          studio: {
            create: {},
          },
          subscription: {
            create: {},
          },
          workspace: {
            create: {
              name: `${user.firstName}'s Workspace`,
              type: 'PERSONAL',
            },
          },
        },
        include: {
          workspace: {
            where: {
              User: {
                clerkid: user.id,
              },
            },
          },
          subscription: {
            select: {
              plan: true,
            },
          },
        },
      })
      if (newUser) {
        return { status: 201, user: newUser }
      }
      return { status: 400 }
    } catch (error) {
      console.log('🔴 ERROR'+error)
      return { status: 500 }
    }
  }



  export const getNotifications = async () => {
    try {
      const user = await currentUser()
      if (!user) return { status: 404 }
      const notifications = await client.user.findUnique({
        where: {
          clerkid: user.id,
        },
        select: {
          notification: true,
          _count: {
            select: {
              notification: true,
            },
          },
        },
      })
  
      if (notifications && notifications.notification.length > 0)
        return { status: 200, data: notifications }
      return { status: 404, data: [] }
    } catch (error) {
      return { status: 400, data: [] }
    }
  }
  export const searchUsers=async (query: string) => {
    try{
      const user = currentUser();
if(!user) return {status:404}
const workspaces = await client.user.findMany({
where:{
  OR:[
    {
      firstname:{
        contains:query,
        mode:"insensitive"
      },
      lastname:{
        contains:query,
        mode:"insensitive"
      },
      email:{
        contains:query,
        mode:"insensitive"
      },
      NOT:[{clerkid:user.id}]
    }
  ]
},
select:{
  id:true,
  firstname:true,
  lastname:true,
  email:true,
  image:true,
  subscription:{
    select:{
      plan:true
    }
  }
}
})
if(workspaces && workspaces.length){
  return{
    status:200,
    data:{
      workspaces:workspaces
    }
  }
}
return{
  status:404,
  data:[]
}

    }

    catch(error){
      return {
        status: 500,
      }
    }
  }