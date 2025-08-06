document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    loadContent();
    setupEventListeners();
});

const sectionsData = {
    posts: { title: 'المنشورات', icon: 'file-text' },
    apps: { title: 'التطبيقات', icon: 'smartphone' },
    games: { title: 'الألعاب', icon: 'gamepad' },
    movies: { title: 'الأفلام', icon: 'film' },
    tutorials: { title: 'الشروحات', icon: 'book' },
    ai: { title: 'الذكاء الاصطناعي', icon: 'cpu' }
};

let posts = JSON.parse(localStorage.getItem('posts')) || [];
let adText = localStorage.getItem('adText') || 'هنا نص الإعلان...';
let currentPage = 1;
const postsPerPage = 10;

function loadContent() {
    const path = window.location.pathname;

    if (path.includes('admin.html')) {
        loadAdminContent();
    } else if (path.includes('section.html')) {
        loadSectionContent();
    } else if (path.includes('post.html')) {
        loadPostContent();
    } else {
        loadHomePageContent();
    }
    updateAdBar();
}

function setupEventListeners() {
    const drawerToggle = document.getElementById('drawer-toggle');
    if (drawerToggle) {
        drawerToggle.addEventListener('change', () => {
            document.body.classList.toggle('drawer-open', drawerToggle.checked);
        });
    }
}

function updateAdBar() {
    const adElement = document.getElementById('ad-text');
    if (adElement) {
        adElement.textContent = adText;
    }
}

function loadHomePageContent() {
    const sectionsContainer = document.getElementById('sections-container');
    if (!sectionsContainer) return;

    sectionsContainer.innerHTML = '';
    Object.keys(sectionsData).forEach(key => {
        const section = sectionsData[key];
        const sectionPosts = posts.filter(p => p.category === key);
        const latestPost = sectionPosts.length > 0 ? sectionPosts[0] : null;

        const card = document.createElement('div');
        card.className = 'card bg-base-100 shadow-xl cursor-pointer transform transition duration-300 hover:scale-105';
        card.onclick = () => goToSection(key);
        card.innerHTML = `
            <div class="card-body">
                <h2 class="card-title text-blue-600"><i data-feather="${section.icon}"></i> ${section.title}</h2>
                ${latestPost ? `
                    <p class="text-sm text-gray-600 dark:text-gray-400">آخر منشور: ${latestPost.title}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500">${latestPost.date}</p>
                ` : '<p class="text-sm text-gray-500">لا توجد منشورات بعد.</p>'}
                <div class="card-actions justify-end">
                    <button class="btn btn-sm btn-outline btn-primary">الدخول لجميع المنشورات</button>
                </div>
            </div>
        `;
        sectionsContainer.appendChild(card);
    });
    feather.replace();
}

function loadAdminContent() {
    document.getElementById('ad-input').value = adText;
}

function updateAd() {
    const newAdText = document.getElementById('ad-input').value;
    if (newAdText) {
        adText = newAdText;
        localStorage.setItem('adText', adText);
        updateAdBar();
        alert('تم تحديث الإعلان بنجاح!');
    } else {
        alert('الرجاء إدخال نص الإعلان.');
    }
}

function addPost() {
    const title = document.getElementById('post-title').value;
    const date = document.getElementById('post-date').value;
    const content = document.getElementById('post-content').value;
    const link = document.getElementById('post-link').value;
    const category = document.getElementById('post-category').value;

    if (!title || !date || !content || !category) {
        alert('الرجاء ملء جميع الحقول المطلوبة (باستثناء رابط التحميل).');
        return;
    }

    const newPost = {
        id: Date.now(),
        title,
        date,
        content,
        link,
        category
    };

    posts.unshift(newPost); // Add to the beginning
    localStorage.setItem('posts', JSON.stringify(posts));
    alert('تم نشر المنشور بنجاح!');
    // Clear form
    document.getElementById('post-title').value = '';
    document.getElementById('post-date').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('post-link').value = '';
    document.getElementById('post-category').value = '';
}

function loadSectionContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (!category) {
        document.getElementById('section-title').textContent = 'القسم غير موجود';
        return;
    }

    document.getElementById('section-title').textContent = sectionsData[category] ? sectionsData[category].title : 'القسم';

    displayPosts(category);
}

function displayPosts(category) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    const filteredPosts = posts.filter(p => p.category === category);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = filteredPosts.slice(start, end);

    postsContainer.innerHTML = '';
    if (paginatedPosts.length === 0) {
        postsContainer.innerHTML = '<p class="text-center text-gray-500">لا توجد منشورات في هذا القسم بعد.</p>';
        return;
    }

    paginatedPosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'card bg-base-100 shadow-xl cursor-pointer transform transition duration-300 hover:scale-105';
        postCard.onclick = () => goToPost(post.id);
        postCard.innerHTML = `
            <div class="card-body">
                <h2 class="card-title text-blue-600">${post.title}</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">${post.date}</p>
                <p class="text-sm text-gray-500 dark:text-gray-500">${post.content.substring(0, 100)}...</p>
                <div class="card-actions justify-end">
                    <button class="btn btn-sm btn-outline btn-primary">قراءة المزيد</button>
                </div>
            </div>
        `;
        postsContainer.appendChild(postCard);
    });

    // Enable/disable pagination buttons
    document.querySelector('.flex.justify-between button:first-child').disabled = currentPage === 1;
    document.querySelector('.flex.justify-between button:last-child').disabled = currentPage === totalPages;
}

function nextPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const filteredPosts = posts.filter(p => p.category === category);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPosts(category);
    }
}

function prevPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (currentPage > 1) {
        currentPage--;
        displayPosts(category);
    }
}

function loadPostContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    const post = posts.find(p => p.id === postId);

    if (!post) {
        document.getElementById('post-title-bar').textContent = 'المنشور غير موجود';
        return;
    }

    document.getElementById('post-title-bar').textContent = post.title;
    document.getElementById('post-meta').textContent = `${post.date} | ${sectionsData[post.category].title}`;
    document.getElementById('post-content').textContent = post.content;

    const downloadBtn = document.getElementById('download-btn');
    if (post.link) {
        downloadBtn.href = post.link;
        downloadBtn.classList.remove('hidden');
    } else {
        downloadBtn.classList.add('hidden');
    }
}

function goToSection(category) {
    window.location.href = `section.html?category=${category}`;
}

function goToPost(id) {
    window.location.href = `post.html?id=${id}`;
}

function goHome() {
    window.location.href = 'index.html';
}

// Dark Mode Toggle (if needed, can be integrated with DaisyUI theme toggle)
// const themeToggle = document.getElementById('theme-toggle');
// if (themeToggle) {
//     themeToggle.addEventListener('click', () => {
//         document.documentElement.classList.toggle('dark');
//     });
// }


