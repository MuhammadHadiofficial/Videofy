import FolderDuotone from "@/icons/folder-duotone";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import React from "react";
import Folder from "./folder";
import { useQueryData } from "@/hooks/useQueryData";
import { getWorkSpaceFolders } from "@/actions/workspace";
import { useMutationDataState } from "@/hooks/useMutationData";
import { useDispatch } from "react-redux";
import { FOLDERS } from "@/redux/slices/folders";

type Props = {
  workspaceid?: string;
};

export type FoldersProps = {
  status: number;
  data: ({
    _count: {
      videos: number;
    };
  } & {
    id: string;
    name: string;
    createdAt: Date;
    workSpaceId: string | null;
  })[];
};

const Folders = ({ workspaceid }: Props) => {
  const dispatch=useDispatch()
  const { data, isFetched } = useQueryData(["workspace-folders"], () =>
    getWorkSpaceFolders(workspaceid)
  );
  const { latestVariables } = useMutationDataState(["create-folder"]);

  const { data: folders, status } = data as FoldersProps;
  if (isFetched && folders) {
    console.log("dispatch",folders)
    dispatch(FOLDERS({folders:folders}))
  }


  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FolderDuotone />
          <h2 className="text-[#BDBDBD text-xl">Folders</h2>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[#BDBDBD] text-sm">See all</p>
          <ArrowRight color="#BDBDBD" />
        </div>
      </div>
      <section
        className={cn(
          status !== 200 && "justify-center",
          "flex items-center gap-4 overflow-x-auto w-full"
        )}
      >
        {status !== 200 ? (
          <p>No folders in workspace</p>
        ) : (
          <>
            {latestVariables && latestVariables.status === "pending" && (
              <Folder
                optimistic
                name={latestVariables.variables.name}
                count={10}
                id={latestVariables.variables.id}
              />
            )}
          </>
        )}
        {folders &&
          folders.map((folder) => (
            <Folder
              key={folder.id}
              name={folder.name}
              count={folder._count.videos}
              id={folder.id}
            />
          ))}
      </section>
    </div>
  );
};

export default Folders;
