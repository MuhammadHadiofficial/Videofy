import React from "react";
import { Button } from "../../button";
import { Link } from "lucide-react";
import { toast } from "sonner";

type Props = {
  videoId: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
};

const CopyLink = ({ videoId, className, variant }: Props) => {
  const onCopyClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}`
    );
    return toast("Copied", {
      description: "Link Copied Succesfully",
    });
  };
  return (
    <Button variant={variant} onClick={onCopyClipboard} className={className}>
      <Link size={20} className="text-[#a4a4a4]" />
    </Button>
  );
};

export default CopyLink;
