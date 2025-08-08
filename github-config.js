// إعدادات GitHub للمشروع
const GITHUB_CONFIG = {
    owner: 'kinanmjeed88',
    repo: 'techtouch0',
    branch: 'searchidf',
    dataPath: 'data/',
    
    // روابط البيانات المباشرة من GitHub
    getDataUrl: function(filename) {
        return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${this.dataPath}${filename}`;
    },
    
    // رابط API لتحديث الملفات
    getApiUrl: function(filename) {
        return `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dataPath}${filename}`;
    }
};

// دالة لجلب البيانات من GitHub
async function fetchFromGitHub(filename) {
    try {
        const response = await fetch(GITHUB_CONFIG.getDataUrl(filename));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${filename} from GitHub:`, error);
        return null;
    }
}

// دالة لحفظ البيانات إلى GitHub (تتطلب دالة Netlify)
async function saveToGitHub(filename, data) {
    try {
        // إرسال البيانات إلى دالة Netlify التي ستتولى الحفظ
        const response = await fetch('/.netlify/functions/save-to-github', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: filename,
                data: data
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error saving ${filename} to GitHub:`, error);
        throw error;
    }
}

