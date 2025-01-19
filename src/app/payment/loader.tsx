import { Spinner } from "@/components/ui/global/loader/spinner";
import React from "react";

const Loader = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <Spinner />
    </div>
  );
};

export default Loader;
