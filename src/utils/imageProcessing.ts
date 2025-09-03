// Image processing utilities for better quality uploads

const MAX_IMAGE_DIMENSION = 4096; // Increased for much better quality
const JPEG_QUALITY = 0.98; // Very high quality JPEG compression
const PNG_QUALITY = 1.0; // Maximum PNG quality

/**
 * Resize image while maintaining aspect ratio and quality
 */
function resizeImageWithQuality(
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D, 
  image: HTMLImageElement,
  maxDimension: number = MAX_IMAGE_DIMENSION
): boolean {
  let width = image.naturalWidth;
  let height = image.naturalHeight;
  
  // Only resize if image is larger than max dimension
  if (width > maxDimension || height > maxDimension) {
    const aspectRatio = width / height;
    
    if (width > height) {
      width = maxDimension;
      height = Math.round(maxDimension / aspectRatio);
    } else {
      height = maxDimension;
      width = Math.round(maxDimension * aspectRatio);
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Use high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Use bicubic interpolation for better quality
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }
  
  // Original size
  canvas.width = width;
  canvas.height = height;
  ctx.imageSmoothingEnabled = false; // Preserve original quality
  ctx.drawImage(image, 0, 0);
  return false;
}

/**
 * Process uploaded image for better quality
 */
export const processImageFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check file size (limit to 50MB for quality)
    if (file.size > 50 * 1024 * 1024) {
      reject(new Error('File size too large. Please use images smaller than 50MB.'));
      return;
    }
    
    // Handle GIFs specially - preserve animation by returning original file as data URL
    if (file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result as string;
        console.log('GIF processed: preserved animation, original size');
        resolve(dataURL);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read GIF file'));
      };
      reader.readAsDataURL(file);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not create canvas context'));
          return;
        }
        
        // Process the image with high quality settings
        const wasResized = resizeImageWithQuality(canvas, ctx, img);
        
        // Determine output format based on input
        const isTransparent = file.type === 'image/png' || file.type === 'image/webp';
        const outputFormat = isTransparent ? 'image/png' : 'image/jpeg';
        const quality = isTransparent ? PNG_QUALITY : JPEG_QUALITY;
        
        // Convert to high-quality data URL
        const dataURL = canvas.toDataURL(outputFormat, quality);
        
        console.log(`Image processed: ${wasResized ? 'resized to' : 'kept at'} ${canvas.width}x${canvas.height}, format: ${outputFormat}, quality: ${quality}`);
        
        resolve(dataURL);
        
        // Cleanup
        URL.revokeObjectURL(img.src);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Load image with object URL for better memory management
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create thumbnail with high quality
 */
export const createHighQualityThumbnail = async (
  file: File, 
  maxSize: number = 400
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Handle GIFs specially - preserve animation for thumbnails too
    if (file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result as string;
        console.log('GIF thumbnail: preserved animation');
        resolve(dataURL);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read GIF file for thumbnail'));
      };
      reader.readAsDataURL(file);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not create canvas context'));
          return;
        }
        
        // Always resize for thumbnails but maintain quality
        resizeImageWithQuality(canvas, ctx, img, maxSize);
        
        // Use PNG for thumbnails to maintain quality
        const dataURL = canvas.toDataURL('image/png', PNG_QUALITY);
        
        resolve(dataURL);
        URL.revokeObjectURL(img.src);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for thumbnail'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Enhance image sharpness
 */
export const sharpenImage = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Simple sharpening kernel
  const kernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ];
  
  const newData = new Uint8ClampedArray(data);
  
  for (let y = 1; y < canvas.height - 1; y++) {
    for (let x = 1; x < canvas.width - 1; x++) {
      for (let c = 0; c < 3; c++) { // RGB channels only
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixel = ((y + ky) * canvas.width + (x + kx)) * 4 + c;
            sum += data[pixel] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        const pixel = (y * canvas.width + x) * 4 + c;
        newData[pixel] = Math.max(0, Math.min(255, sum));
      }
    }
  }
  
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

/**
 * Load image from file
 */
export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};