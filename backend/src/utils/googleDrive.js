/**
 * Converts a Google Drive sharing/viewing link to a direct image URL.
 * Supports:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://docs.google.com/file/d/FILE_ID/edit
 * 
 * @param {string} url The Google Drive URL
 * @returns {string} The direct download URL or the original URL if no ID is found
 */
export const getDirectDriveUrl = (url) => {
    if (!url || !url.includes('drive.google.com') && !url.includes('docs.google.com')) {
        return url;
    }

    try {
        let fileId = '';

        // Pattern 1: /file/d/FILE_ID/
        const fileDPattern = /\/file\/d\/([a-zA-Z0-9_-]+)/;
        const match1 = url.match(fileDPattern);
        if (match1 && match1[1]) {
            fileId = match1[1];
        } else {
            // Pattern 2: id=FILE_ID
            const idPattern = /[?&]id=([a-zA-Z0-9_-]+)/;
            const match2 = url.match(idPattern);
            if (match2 && match2[1]) {
                fileId = match2[1];
            }
        }

        if (fileId) {
            return `https://lh3.googleusercontent.com/u/0/d/${fileId}`;
            // Alternative: `https://drive.google.com/uc?export=view&id=${fileId}`
            // lh3.googleusercontent.com is often more reliable for <img> tags
        }
    } catch (error) {
        console.error('Error parsing Drive URL:', error);
    }

    return url;
};
