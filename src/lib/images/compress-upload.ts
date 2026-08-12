const MAX_SOURCE_FILE_SIZE = 15 * 1024 * 1024;
const WEBP_TYPE = "image/webp";

export type CompressImageOptions = {
  maxBytes?: number;
  maxHeight: number;
  maxWidth: number;
  quality?: number;
};

type DrawableImage = {
  cleanup: () => void;
  height: number;
  source: CanvasImageSource;
  width: number;
};

function safeBaseName(fileName: string) {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "") || "imagem";
  return withoutExtension
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "imagem";
}

function canvasToWebp(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Este navegador não conseguiu converter a imagem para WebP."));
    }, WEBP_TYPE, quality);
  });
}

async function loadDrawableImage(file: File): Promise<DrawableImage> {
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(file);
    return {
      cleanup: () => bitmap.close(),
      height: bitmap.height,
      source: bitmap,
      width: bitmap.width,
    };
  }

  const objectUrl = URL.createObjectURL(file);
  let image: HTMLImageElement;
  try {
    image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Não foi possível abrir esta imagem."));
      element.src = objectUrl;
    });
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }

  return {
    cleanup: () => URL.revokeObjectURL(objectUrl),
    height: image.naturalHeight,
    source: image,
    width: image.naturalWidth,
  };
}

export async function compressImageForUpload(
  file: File,
  {
    maxBytes = 2 * 1024 * 1024,
    maxHeight,
    maxWidth,
    quality = 0.84,
  }: CompressImageOptions,
) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecione um arquivo de imagem válido.");
  }
  if (file.size > MAX_SOURCE_FILE_SIZE) {
    throw new Error("A imagem original deve ter no máximo 15 MB.");
  }

  const drawable = await loadDrawableImage(file);

  try {
    if (!drawable.width || !drawable.height) {
      throw new Error("A imagem selecionada não possui dimensões válidas.");
    }

    const initialScale = Math.min(
      1,
      maxWidth / drawable.width,
      maxHeight / drawable.height,
    );
    let width = Math.max(1, Math.round(drawable.width * initialScale));
    let height = Math.max(1, Math.round(drawable.height * initialScale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Não foi possível preparar a imagem para envio.");

    let blob: Blob | null = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(drawable.source, 0, 0, width, height);
      blob = await canvasToWebp(canvas, Math.max(0.58, quality - attempt * 0.07));

      if (blob.size <= maxBytes) break;
      width = Math.max(1, Math.round(width * 0.84));
      height = Math.max(1, Math.round(height * 0.84));
    }

    if (!blob || blob.size > maxBytes) {
      throw new Error("Não foi possível reduzir a imagem para menos de 2 MB.");
    }

    return new File([blob], `${safeBaseName(file.name)}.webp`, {
      lastModified: Date.now(),
      type: WEBP_TYPE,
    });
  } finally {
    drawable.cleanup();
  }
}
