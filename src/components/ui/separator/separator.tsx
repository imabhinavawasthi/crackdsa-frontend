import React from "react";

interface SeparatorProps {
  className?: string;
}

const Separator: React.FC<SeparatorProps> = ({ className = "" }) => (
  <div
    className={`h-4 w-px bg-gray-200 dark:bg-gray-800 hidden lg:block mx-1 ${className}`}
  />
);

export default Separator;
