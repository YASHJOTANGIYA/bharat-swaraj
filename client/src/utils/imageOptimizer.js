/**
 * Optimizes image URLs for faster loading, smaller byte size, and modern formats (WebP/AVIF).
 * Automatically applies Cloudinary transformations (f_auto, q_auto, width limits).
 */
export const optimizeImageUrl = (url, width = 600) => {
    if (!url || typeof url !== 'string') return url;

    // Cloudinary optimization
    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
        // If already has transformation parameters, avoid duplicating
        if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto') || url.includes('/upload/w_')) {
            return url;
        }
        return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
    }

    // Unsplash optimization
    if (url.includes('images.unsplash.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}auto=format&fit=crop&w=${width}&q=80`;
    }

    return url;
};
