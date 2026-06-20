export interface SheetJSONProblem {
  problem_id: string;
}

export interface SheetJSONStep {
  id: string;
  title: string;
  pattern_id: string;
  problems: SheetJSONProblem[];
}

export interface SheetJSONTopic {
  id: string;
  title: string;
  steps: SheetJSONStep[];
}

export interface SheetJSON {
  topics: SheetJSONTopic[];
}

export type ExternalLink = {
  title: string;
  url: string;
};
