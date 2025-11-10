export interface GalleryItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export enum ProcessingStage {
  STARTING,
  ANALYZING_PROMPT,
  PREPARING_COMMAND,
  GENERATING_IMAGE,
  GENERATING_VIDEO,
  ENHANCING_VIDEO,
  DONE,
}

export interface GenerationCallbacks {
    onStageChange: (stage: ProcessingStage, data?: any) => void;
}
