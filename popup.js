document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    const imageContainer = document.querySelector('.image-container');

    downloadBtn.addEventListener('click', async function() {
        try {
            // Disable button and show loading state
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Scanning...';
            
            // Clear previous results
            imageContainer.innerHTML = '';
            
            // Get the current active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Execute content script to find images
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: findAllImages
            });
            
            const images = results[0].result;
            
            if (images.length === 0) {
                showStatus('No images found on this page.');
                resetButton();
                return;
            }
            
            // Show images found
            showImageResults(images);
            
            // Start download process
            downloadBtn.textContent = 'Creating Zip...';
            
            // Send to background script for processing
            chrome.runtime.sendMessage({
                action: 'downloadImages',
                images: images,
                domain: new URL(tab.url).hostname.replace('www.', '')
            });
            
        } catch (error) {
            console.error('Error:', error);
            showStatus('Error: ' + error.message);
            resetButton();
        }
    });
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'downloadProgress') {
            downloadBtn.textContent = `Processing... ${message.completed}/${message.total}`;
        } else if (message.action === 'downloadComplete') {
            showStatus('✅ Zip file downloaded successfully!');
            resetButton();
        } else if (message.action === 'downloadError') {
            showStatus('❌ Error: ' + message.error);
            resetButton();
        }
    });
    
    function showImageResults(images) {
        // Categorize images
        const categories = images.reduce((acc, img) => {
            const category = getSizeCategory(img.width, img.height);
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
        
        imageContainer.innerHTML = `
            <div class="results">
                <h3>Found ${images.length} images:</h3>
                <div class="categories">
                    ${Object.entries(categories).map(([cat, count]) => 
                        `<div class="category-item">
                            <span class="category-name">${cat}:</span>
                            <span class="category-count">${count}</span>
                        </div>`
                    ).join('')}
                </div>
                <p class="folder-info">Will be organized as: domain/date/size/</p>
            </div>
        `;
    }
    
    function showStatus(message) {
        imageContainer.innerHTML = `<div class="status">${message}</div>`;
    }
    
    function resetButton() {
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download Images';
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
});

// Function that will be injected into the webpage
function findAllImages() {
    const images = [];
    
    
    const imgElements = document.querySelectorAll('img');
    imgElements.forEach((img, index) => {
        if (img.src && img.src.startsWith('http')) {
            images.push({
                url: img.src,
                alt: img.alt || `image_${index + 1}`,
                width: img.naturalWidth || img.width || 0,
                height: img.naturalHeight || img.height || 0
            });
        }
    });
    
    // Find background images
    const allElements = document.querySelectorAll('*');
    allElements.forEach((element, index) => {
        const style = window.getComputedStyle(element);
        const bgImage = style.backgroundImage;
        
        if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
            const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
            if (urlMatch && urlMatch[1] && urlMatch[1].startsWith('http')) {
                images.push({
                    url: urlMatch[1],
                    alt: `background_image_${index + 1}`,
                    width: 0, 
                    height: 0
                });
            }
        }
    });
    
    
    const uniqueImages = images.filter((img, index, self) => 
        index === self.findIndex(i => i.url === img.url)
    );
    
    return uniqueImages;
}