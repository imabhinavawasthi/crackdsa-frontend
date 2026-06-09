"use client";

import React from "react";
import NotesTab from "./NotesTab";

interface ProblemNotesProps {
  slug: string;
  itemId: string;
  onStateChange?: (state: { notes: any[] }) => void;
}

const ProblemNotes: React.FC<ProblemNotesProps> = ({ slug, itemId, onStateChange }) => {
  return (
    <div className="w-full">
      <NotesTab
        courseId="dsa-bootcamp-recordings"
        itemId={itemId}
        assetType="problem"
        onNotesChange={(newNotes) => {
          if (onStateChange) onStateChange({ notes: newNotes });
        }}
      />
    </div>
  );
};

export default ProblemNotes;
