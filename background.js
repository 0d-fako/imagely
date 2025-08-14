
// Import JSZip from CDN
importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');

// Listen for messages from popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'downloadImages') {
        await processImagesAndCreateZip(message.images, message.domain, sender.tab.id);
    }
});

async function processImagesAndCreateZip(images, domain, tabId) {
    try {
        // Initialize zip
        const zip = new JSZip();
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        let completed = 0;
        let successful = 0;
        
        // Send initial progress
        await sendMessageToTab(tabId, {
            action: 'downloadProgress',
            completed: 0,
            total: images.length
        });
        
        // Process each image
        for (const image of images) {
            try {
                // Fetch the image
                const response = await fetch(image.url);
                
                if (!response.ok) {
                    console.warn(`Failed to fetch ${image.url}: ${response.status}`);
                    completed++;
                    continue;
                }
                
                const blob = await response.blob();
                
                // Determine size category and file info
                const sizeCategory = getSizeCategory(image.width, image.height);
                const extension = getFileExtension(image.url);
                const sanitizedName = sanitizeFilename(image.alt) || 'image';
                const filename = `${sanitizedName}_${image.width}x${image.height}.${extension}`;
                
                // Create folder path: domain/date/size/filename
                const folderPath = `${domain}/${today}/${sizeCategory}/${filename}`;
                
                // Add to zip
                zip.file(folderPath, blob);
                successful++;
                
                // Update progress
                completed++;
                await sendMessageToTab(tabId, {
                    action: 'downloadProgress',
                    completed: completed,
                    total: images.length
                });
                
                // Small delay to prevent overwhelming
                await sleep(50);
                
            } catch (error) {
                console.error(`Error processing image ${image.url}:`, error);
                completed++;
            }
        }
        
        if (successful === 0) {
            throw new Error('No images could be downloaded');
        }
        
        // Generate zip file
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        
        // Create download
        const url = URL.createObjectURL(zipBlob);
        const zipFilename = `${domain}_images_${today}.zip`;
        
        await chrome.downloads.download({
            url: url,
            filename: zipFilename,
            saveAs: false
        });
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        // Send completion message
        await sendMessageToTab(tabId, {
            action: 'downloadComplete',
            successful: successful,
            total: images.length
        });
        
    } catch (error) {
        console.error('Download error:', error);
        await sendMessageToTab(tabId, {
            action: 'downloadError',
            error: error.message
        });
    }
}

function getSizeCategory(width, height) {
    const maxDimension = Math.max(width, height);
    
    if (maxDimension < 200) {
        return 'thumbnail';
    } else if (maxDimension < 800) {
        return 'small';
    } else if (maxDimension <= 1920) {
        return 'medium';
    } else {
        return 'large';
    }
}

function getFileExtension(url) {
    try {
        const pathname = new URL(url).pathname;
        let extension = pathname.split('.').pop().toLowerCase();
        
        // Validate extension
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
        if (!validExtensions.includes(extension)) {
            extension = 'jpg'; // Default fallback
        }
        
        return extension;
    } catch {
        return 'jpg';
    }
}

function sanitizeFilename(filename) {
    if (!filename) return '';
    
    return filename
        .replace(/[<>:"/\\|?*]/g, '_')        // Replace invalid chars
        .replace(/\s+/g, '_')                 // Replace spaces
        .replace(/_{2,}/g, '_')               // Remove multiple underscores
        .slice(0, 30)                         // Limit length
        .replace(/^_+|_+$/g, '');             // Remove leading/trailing underscores
}

async function sendMessageToTab(tabId, message) {
    try {
        await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
        // Tab might be closed or unavailable
        console.warn('Could not send message to tab:', error);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}