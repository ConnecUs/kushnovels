
import { Chapter, Scene } from "@/types";

interface ExportOptions {
  includeChapterTitle: boolean;
  includeSceneTitles: boolean;
  addPageBreaks: boolean;
  formatType: "plain" | "markdown";
}

// Format chapter content for export
export const formatChapterForExport = (
  chapter: Chapter,
  options: ExportOptions = {
    includeChapterTitle: true,
    includeSceneTitles: true,
    addPageBreaks: false,
    formatType: "plain",
  }
): string => {
  const { includeChapterTitle, includeSceneTitles, addPageBreaks, formatType } = options;
  
  let formattedText = "";
  
  // Add chapter title
  if (includeChapterTitle) {
    if (formatType === "markdown") {
      formattedText += `# ${chapter.title}\n\n`;
    } else {
      formattedText += `${chapter.title}\n\n`;
    }
  }
  
  // Add each scene
  chapter.scenes.forEach((scene, index) => {
    // Add scene title if option is enabled
    if (includeSceneTitles) {
      if (formatType === "markdown") {
        formattedText += `## ${scene.title}\n\n`;
      } else {
        formattedText += `${scene.title}\n\n`;
      }
    }
    
    // Add scene content
    formattedText += `${scene.content}\n\n`;
    
    // Add page break between scenes if not the last scene
    if (addPageBreaks && index < chapter.scenes.length - 1) {
      if (formatType === "markdown") {
        formattedText += `---\n\n`;
      } else {
        formattedText += `\n\n----------\n\n`;
      }
    }
  });
  
  return formattedText;
};

// Format multiple chapters for export
export const formatProjectForExport = (
  chapters: Chapter[],
  options: ExportOptions = {
    includeChapterTitle: true,
    includeSceneTitles: true,
    addPageBreaks: true,
    formatType: "plain",
  }
): string => {
  let formattedText = "";
  
  chapters.forEach((chapter, index) => {
    formattedText += formatChapterForExport(chapter, options);
    
    // Add page break between chapters if not the last chapter
    if (options.addPageBreaks && index < chapters.length - 1) {
      if (options.formatType === "markdown") {
        formattedText += `\n\n---\n\n`;
      } else {
        formattedText += `\n\n==========\n\n`;
      }
    }
  });
  
  return formattedText;
};

// Export a single scene as text
export const exportScene = (scene: Scene, fileName?: string): void => {
  const blob = new Blob([scene.content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || `${scene.title}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// Export a single chapter with its scenes
export const exportChapter = (
  chapter: Chapter,
  options: ExportOptions,
  fileName?: string
): void => {
  const formattedText = formatChapterForExport(chapter, options);
  const fileExtension = options.formatType === "markdown" ? "md" : "txt";
  
  const blob = new Blob([formattedText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || `${chapter.title}.${fileExtension}`;
  a.click();
  URL.revokeObjectURL(url);
};

// Export multiple chapters as a complete story
export const exportProject = (
  chapters: Chapter[],
  projectTitle: string,
  options: ExportOptions
): void => {
  const formattedText = formatProjectForExport(chapters, options);
  const fileExtension = options.formatType === "markdown" ? "md" : "txt";
  
  const blob = new Blob([formattedText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectTitle}.${fileExtension}`;
  a.click();
  URL.revokeObjectURL(url);
};
