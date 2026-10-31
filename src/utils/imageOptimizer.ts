/**
 * Client-side image optimizer for device uploads.
 * Automatically scales down massive camera photos (e.g. 12MP-48MP smartphone photos)
 * while preserving high-definition luxury detail and aspect ratio.
 */
export async function optimizeDeviceImage(
  file: File,
  maxDimension = 2000,
  quality = 0.88
): Promise<{ name: string; base64: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    // If SVG or gif or small non-image, read directly
    if (file.type.includes('svg') || file.type.includes('gif')) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve({
          name: file.name,
          base64,
          sizeKb: Math.round(file.size / 1024)
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate scaled dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if 2d context fails
          const rawBase64 = e.target?.result as string;
          resolve({
            name: file.name,
            base64: rawBase64,
            sizeKb: Math.round(file.size / 1024)
          });
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to dataUrl
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const base64 = canvas.toDataURL(mimeType, quality);
        const sizeKb = Math.round((base64.length * 0.75) / 1024);

        resolve({
          name: file.name,
          base64,
          sizeKb
        });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
