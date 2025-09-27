import { useEffect } from "react";

type VideoSource = {
  src: string;
  type?: string;
  crossOrigin?: "" | "anonymous" | "use-credentials";
};

const preloadedSources = new Set<string>();

/**
 * Preloads a set of videos ahead of time so that playback starts immediately when rendered.
 * It leverages <link rel="preload" /> hints plus an off-DOM HTMLVideoElement to warm the cache.
 */
export function useVideoPreload(sources: VideoSource[]) {
  useEffect(() => {
    if (typeof document === "undefined" || sources.length === 0) {
      return;
    }

    const seen = new Set<string>();
    const linkElements: HTMLLinkElement[] = [];
    const videoElements: HTMLVideoElement[] = [];

    const newlyAdded: string[] = [];

    sources.forEach(({ src, type, crossOrigin }) => {
      if (!src || seen.has(src)) {
        return;
      }
      seen.add(src);

      const cacheKey = `${src}|${type ?? ""}|${crossOrigin ?? ""}`;
      const alreadyPreloaded = preloadedSources.has(cacheKey);

      if (alreadyPreloaded) {
        return;
      }

      preloadedSources.add(cacheKey);
      newlyAdded.push(cacheKey);

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = src;
      if (type) {
        link.type = type;
      }
      if (crossOrigin) {
        link.crossOrigin = crossOrigin;
      }
      document.head.appendChild(link);
      linkElements.push(link);

      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      if (crossOrigin) {
        video.crossOrigin = crossOrigin;
      }

      const sourceElement = document.createElement("source");
      sourceElement.src = src;
      if (type) {
        sourceElement.type = type;
      }

      video.appendChild(sourceElement);
      video.load();
      videoElements.push(video);
    });

    return () => {
      linkElements.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
      videoElements.forEach((video) => {
        video.pause();
        while (video.firstChild) {
          video.removeChild(video.firstChild);
        }
      });
      newlyAdded.forEach((key) => preloadedSources.delete(key));
    };
  }, [sources]);
}
