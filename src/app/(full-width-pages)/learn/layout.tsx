import React from "react";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-[80vh] w-full">{children}</div>;
}
