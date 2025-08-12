// إعدادات GitHub للمشروع
const GITHUB_CONFIG = {
    owner: 'kinanmjeed88',
    repo: 'techtouch0',
    branch: 'main',
    dataPath: 'data/',
    
    // روابط البيانات المباشرة من GitHub
    getDataUrl: function(filename) {
        return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${this.dataPath}${filename}`;
    },
    
    // رابط API لتحديث الملفات
    getApiUrl: function(filename) {
        return `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dataPath}${filename}`;
    },
    
    // رابط API للحصول على قائمة الملفات في مجلد
    getFolderUrl: function(folderPath) {
        return `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dataPath}${folderPath}`;
    }
};

// دالة لجلب البيانات من GitHub (JSON)
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

// دالة لجلب ملف Markdown من GitHub
async function fetchMarkdownFromGitHub(filepath) {
    try {
        const response = await fetch(GITHUB_CONFIG.getDataUrl(filepath));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error fetching ${filepath} from GitHub:`, error);
        return null;
    }
}

// دالة لجلب قائمة الملفات من مجلد على GitHub
async function fetchFolderContents(folderPath) {
    try {
        const response = await fetch(GITHUB_CONFIG.getFolderUrl(folderPath));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching folder ${folderPath} from GitHub:`, error);
        return [];
    }
}

// دالة لتحليل Front Matter من ملف Markdown
function parseFrontMatter(markdownContent) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdownContent.match(frontMatterRegex);
    
    if (!match) {
        return { frontMatter: {}, content: markdownContent };
    }
    
    const frontMatterText = match[1];
    const content = match[2];
    
    // تحليل YAML بسيط
    const frontMatter = {};
    const lines = frontMatterText.split('\n');
    
    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // إزالة علامات الاقتباس إذا وجدت
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            frontMatter[key] = value;
        }
    }
    
    return { frontMatter, content };
}

// دالة لجلب جميع المنشورات من GitHub
async function fetchAllPosts() {
    try {
        const files = await fetchFolderContents('posts');
        const posts = [];
        
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const markdownContent = await fetchMarkdownFromGitHub(`posts/${file.name}`);
                if (markdownContent) {
                    const { frontMatter, content } = parseFrontMatter(markdownContent);
                    posts.push({
                        id: file.name.replace('.md', ''),
                        title: frontMatter.title || 'بدون عنوان',
                        content: content.trim(),
                        date: frontMatter.date || new Date().toISOString(),
                        category: frontMatter.category || 'عام',
                        image: frontMatter.image || '',
                        filename: file.name
                    });
                }
            }
        }
        
        // ترتيب المنشورات حسب التاريخ (الأحدث أولاً)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

// دالة لجلب جميع عناصر القوائم المنسدلة من GitHub
async function fetchAllDropdowns() {
    try {
        const files = await fetchFolderContents('dropdowns');
        const dropdowns = {
            movies: [],
            sports: [],
            videos: [],
            misc: []
        };
        
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const markdownContent = await fetchMarkdownFromGitHub(`dropdowns/${file.name}`);
                if (markdownContent) {
                    const { frontMatter } = parseFrontMatter(markdownContent);
                    const item = {
                        id: file.name.replace('.md', ''),
                        title: frontMatter.title || 'بدون عنوان',
                        url: frontMatter.url || '#',
                        icon: frontMatter.icon || '🔗',
                        category: frontMatter.category || 'misc',
                        filename: file.name
                    };
                    
                    if (dropdowns[item.category]) {
                        dropdowns[item.category].push(item);
                    } else {
                        dropdowns.misc.push(item);
                    }
                }
            }
        }
        
        return dropdowns;
    } catch (error) {
        console.error('Error fetching dropdowns:', error);
        return { movies: [], sports: [], videos: [], misc: [] };
    }
}

// دالة لجلب إعدادات الإعلانات من GitHub
async function fetchAdSettings() {
    try {
        const markdownContent = await fetchMarkdownFromGitHub('settings/advertisements.md');
        if (markdownContent) {
            const { frontMatter } = parseFrontMatter(markdownContent);
            return {
                adText: frontMatter.adText || 'مرحباً بكم في TechTouch - موقعكم المفضل للتقنية!',
                adEnabled: frontMatter.adEnabled !== false
            };
        }
        return {
            adText: 'مرحباً بكم في TechTouch - موقعكم المفضل للتقنية!',
            adEnabled: true
        };
    } catch (error) {
        console.error('Error fetching ad settings:', error);
        return {
            adText: 'مرحباً بكم في TechTouch - موقعكم المفضل للتقنية!',
            adEnabled: true
        };
    }
}

// دالة لجلب قنوات التليجرام من GitHub
async function fetchTelegramChannels() {
    try {
        const files = await fetchFolderContents('telegram');
        const channels = [];
        
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const markdownContent = await fetchMarkdownFromGitHub(`telegram/${file.name}`);
                if (markdownContent) {
                    const { frontMatter } = parseFrontMatter(markdownContent);
                    channels.push({
                        id: file.name.replace('.md', ''),
                        title: frontMatter.title || 'بدون عنوان',
                        description: frontMatter.description || '',
                        icon: frontMatter.icon || 'fas fa-link',
                        url: frontMatter.url || '#',
                        order: parseInt(frontMatter.order) || 999,
                        filename: file.name
                    });
                }
            }
        }
        
        // ترتيب القنوات حسب الترتيب المحدد
        channels.sort((a, b) => a.order - b.order);
        return channels;
    } catch (error) {
        console.error('Error fetching telegram channels:', error);
        return [];
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

