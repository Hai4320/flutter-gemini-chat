
import React from "react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-start mb-4 animate-fade-in">
      <div className="bg-white dark:bg-gemini-darkPurple/20 p-4 rounded-2xl rounded-bl-none border border-gemini-purple/20 shadow-sm">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-gemini-purple animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-gemini-purple animate-pulse delay-150"></div>
          <div className="w-2 h-2 rounded-full bg-gemini-purple animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
