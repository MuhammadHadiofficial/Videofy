"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import Loader from "../loader";
import FolderDuotone from "@/icons/folder-duotone";
import { useMutationData, useMutationDataState } from "@/hooks/useMutationData";
import { renameFolder } from "@/actions/workspace";
import { Input } from "../../input";

type Props = {
  name?: string;
  id: string;
  optimistic?: boolean;
  count?: number;
};

const Folder = ({ name, id, optimistic, count }: Props) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const folderCardRef = React.useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [onRename, setOnRename] = React.useState(false);
  const Rename = () => setOnRename(true);
  const Renamed = () => setOnRename(false);
  const { mutate, isPending } = useMutationData(
    ["rename-folder"],
    (data: { name: string }) => renameFolder(id, data.name),
    "workspace-folders",
    Renamed
  );
  const { latestVariables } = useMutationDataState("rename-folders");
  const handleFolderClick = () => {
    router.push(`${pathname}/folder/${id}`);
  };
  const handleNameDoubleClick = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    Rename();
  };
  const updateFolderName = (e: React.FocusEvent<HTMLInputElement>) => {
    if (inputRef.current && folderCardRef.current) {
      if (inputRef.current) {
        if (inputRef.current.value) {
          mutate({ name: inputRef.current.value, id });
        } else Renamed();
      }
    }
  };
  return (
    <div
      ref={folderCardRef}
      onDoubleClick={handleFolderClick}
      className={cn(
        optimistic && "opacity-60",
        "flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg  border-[1px]"
      )}
    >
      <Loader state={isPending}>
        <div className="flex flex-col gap[1px]">
          {onRename ? (
            <Input
              placeholder={name}
              onBlur={(e) => updateFolderName(e)}
              autoFocus
              ref={inputRef}
              className="border-none underline  text-base w-full outline-none text-neutral-300 bg-transparent p-0"
            />
          ) : (
            <p
              className="text-neutral-300"
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={handleNameDoubleClick}
            >
              {" "}
              {latestVariables &&
              latestVariables.status === "pending" &&
              latestVariables.variables.id === id
                ? latestVariables.variables.name
                : name}
            </p>
          )}

          <span className="text-sm text-neutral-500">{count || 0} videos</span>
        </div>
      </Loader>
      <FolderDuotone />
    </div>
  );
};

export default Folder;
