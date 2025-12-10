import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-screen min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
