import { THEME_BUTTON_IMAGES, THEME_BACKGROUND_IMAGES, UI_ICON_IMAGES } from '../../generated/asset-manifest';

export const resolveAssetUrl = (path: string, baseUrl = import.meta.env.BASE_URL): string => `${baseUrl}${path}`;

// Held for the page's lifetime: once an unreferenced Image is garbage-collected the browser can drop
// the loaded image too, and the next stylesheet that uses it (a modal opening) waits on the service
// worker or a revalidation request, since public/ images are served with max-age=0.
const preloadedImages: HTMLImageElement[] = [];

/** Preloads images by URL path and keeps them loaded for later stylesheet and <img> requests. */
const preloadImages = (imagePaths: readonly string[]): void => {
  imagePaths.forEach((path) => {
    const img = new Image();
    img.src = resolveAssetUrl(path);
    preloadedImages.push(img);
  });
};

/**
 * Preloads all theme-related assets (buttons, backgrounds) on app startup.
 * This prevents visible loading delays when switching themes.
 */
export const preloadThemeAssets = (): void => {
  preloadImages(THEME_BUTTON_IMAGES);
  preloadImages(THEME_BACKGROUND_IMAGES);
};

/** Preloads the UI icons, including the flag sprite only lazily loaded views reference. */
export const preloadUiIcons = (): void => {
  preloadImages(UI_ICON_IMAGES);
};

/** Runs the callback in requestIdleCallback (1500 ms timeout) when available, else after 500 ms. */
export const scheduleIdlePreload = (callback: () => void): void => {
  if (typeof globalThis === 'undefined') {
    callback();
    return;
  }

  const requestIdle = (
    globalThis as typeof globalThis & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    }
  ).requestIdleCallback;

  if (typeof requestIdle === 'function') {
    requestIdle(() => callback(), { timeout: 1500 });
    return;
  }

  globalThis.setTimeout(callback, 500);
};
