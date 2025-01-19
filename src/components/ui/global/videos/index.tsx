"use client";
import { getAllUserVideos } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import VideoRecorderDuotone from "@/icons/video-recorder-duotone";
import { cn } from "@/lib/utils";
import { VideosProps } from "@/types/index.types";
import React from "react";
import VideoCard from "./video-card";

type Props = {
  folderId: string;
  videosKey: string;
  workspaceId: string;
};

const Videos = ({ folderId, videosKey, workspaceId }: Props) => {
  //   WIP:add video logic
  const { data: videoData } = useQueryData([videosKey], () =>
    getAllUserVideos(folderId)
  );
  const { status: videoStatus, data: videos } = videoData as VideosProps;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between ">
        <div className="gap-4 flex items-center">
          <VideoRecorderDuotone />
          <h2 className="text-[#8d8d8d] text-xl">Videos</h2>
        </div>
      </div>
      <section
        className={cn(
          videoStatus !== 200
            ? "p-5"
            : "grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        )}
      >
        {videoStatus === 200 ? (
          videos &&
          videos.videos.map((video) => (
            <VideoCard key={video.id} workspaceId={workspaceId} {...video} />
          ))
        ) : (
          <p className="text-[8d8d8d]">No videos in workspace</p>
        )}
      </section>
    </div>
  );
};

export default Videos;
