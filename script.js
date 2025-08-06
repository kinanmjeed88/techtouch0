document.addEventListener(\'DOMContentLoaded\', () => {
    loadContent();
    setupEventListeners();
});

const sectionsData = {
    posts: { title: \'المنشورات\', icon: \'file-text\' },
    apps: { title: \'التطبيقات\', icon: \'smartphone\' },
    games: { title: \'الألعاب\', icon: \'gamepad\' },
    movies: { title: \'الأفلام\', icon: \'film\' },
    tutorials: { title: \'الشروحات\', icon: \'book\' },
    ai: { title: \'الذكاء الاصطناعي\', icon: \'cpu\' }
};

let posts = JSON.parse(localStorage.getItem(\'posts\')) || [
    {
        id: 1,
        title: \'أول منشور تجريبي\',
        date: \'2025-08-06\',
        content: \'هذا هو المحتوى التجريبي لأول منشور. يمكن تعديله من لوحة التحكم.\',
        link: \'#\',
        category: \'posts\'
    },
    {
        id: 2,
        title: \'تطبيق تجريبي جديد\',
        date: \'2025-08-05\',
        content: \'هذا هو المحتوى التجريبي لتطبيق جديد. يمكن تعديله من لوحة التحكم.\',
        link: \'#\',
        category: \'apps\'
    },
    {
        id: 3,
        title: \'لعبة تجريبية ممتعة\',
        date: \'2025-08-04\',
        content: \'هذا هو المحتوى التجريبي للعبة جديدة. يمكن تعديله من لوحة التحكم.\',
        link: \'#\',
        category: \'games\'
    }
];
let adText = localStorage.getItem(\'adText\') || \'إعلان تجريبي: خصم 50% على جميع التطبيقات هذا الأسبوع!\';
let currentPage = 1;
const postsPerPage = 10;

function loadContent() {
    const path = window.location.pathname;

    if (path.includes(\'admin.html\')) {
        loadAdminContent();
    } else if (path.includes(\'section.html\')) {
        loadSectionContent();
    } else if (path.includes(\'post.html\')) {
        loadPostContent();
    } else {
        loadHomePageContent();
    }
    updateAdBar();
}

function setupEventListeners() {
    const drawerToggle = document.getElementById(\'drawer-toggle\');
    if (drawerToggle) {
        drawerToggle.addEventListener(\'change\', () => {
            document.body.classList.toggle(\'drawer-open\', drawerToggle.checked);
        });
    }
}

function updateAdBar() {
    const adElement = document.getElementById(\'ad-text\');
    if (adElement) {
        adElement.textContent = adText;
    }
}

function loadHomePageContent() {
    const sectionsContainer = document.getElementById(\'sections-container\');
    if (!sectionsContainer) return;

    sectionsContainer.innerHTML = \'\';
    Object.keys(sectionsData).forEach(key => {
        const section = sectionsData[key];
        const sectionPosts = posts.filter(p => p.category === key);
        const latestPost = sectionPosts.length > 0 ? sectionPosts[0] : null;

        const card = document.createElement(\'div\');
        card.className = \'bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition duration-300 hover:scale-105\';
        card.onclick = () => goToSection(key);
        card.innerHTML = `
            <div class="flex items-center mb-4">
                <div class="text-blue-600 text-2xl ml-2">${getIconHtml(section.icon)}</div>
                <h2 class="text-xl font-bold text-blue-600">${section.title}</h2>
            </div>
            ${latestPost ? `
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">آخر منشور: ${latestPost.title}</p>
                <p class="text-xs text-gray-500 dark:text-gray-500">${latestPost.date}</p>
            ` : \'<p class="text-sm text-gray-500">لا توجد منشورات بعد.</p>\'}
            <div class="mt-4 text-right">
                <button class="text-blue-600 hover:underline text-sm">الدخول لجميع المنشورات</button>
            </div>
        `;
        sectionsContainer.appendChild(card);
    });
}

function getIconHtml(iconName) {
    // This is a placeholder. In a real app, you might use an icon library like Font Awesome.
    // For now, we'll just return a generic icon or an empty string.
    switch(iconName) {
        case \'file-text\': return \'<i class="fa-solid fa-file-lines"></i>\';
        case \'smartphone\': return \'<i class="fa-solid fa-mobile-screen-button"></i>\';
        case \'gamepad\': return \'<i class="fa-solid fa-gamepad"></i>\';
        case \'film\': return \'<i class="fa-solid fa-film"></i>\';
        case \'book\': return \'<i class="fa-solid fa-book"></i>\';
        case \'cpu\': return \'<i class="fa-solid fa-microchip"></i>\';
        default: return \'<i class="fa-solid fa-star"></i>\';
    }
}

function loadAdminContent() {
    document.getElementById(\'ad-input\').value = adText;
}

function updateAd() {
    const newAdText = document.getElementById(\'ad-input\').value;
    if (newAdText) {
        adText = newAdText;
        localStorage.setItem(\'adText\', adText);
        updateAdBar();
        alert(\'تم تحديث الإعلان بنجاح!\');
    } else {
        alert(\'الرجاء إدخال نص الإعلان.\');
    }
}

function addPost() {
    const title = document.getElementById(\'post-title\').value;
    const date = document.getElementById(\'post-date\').value;
    const content = document.getElementById(\'post-content\').value;
    const link = document.getElementById(\'post-link\').value;
    const category = document.getElementById(\'post-category\').value;

    if (!title || !date || !content || !category) {
        alert(\'الرجاء ملء جميع الحقول المطلوبة (باستثناء رابط التحميل).\');
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
    localStorage.setItem(\'posts\', JSON.stringify(posts));
    alert(\'تم نشر المنشور بنجاح!\');
    // Clear form
    document.getElementById(\'post-title\').value = \'\';
    document.getElementById(\'post-date\').value = \'\';
    document.getElementById(\'post-content\').value = \'\';
    document.getElementById(\'post-link\').value = \'\';
    document.getElementById(\'post-category\').value = \'\';
}

function loadSectionContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get(\'category\');
    if (!category) {
        document.getElementById(\'section-title\').textContent = \'القسم غير موجود\';
        return;
    }

    document.getElementById(\'section-title\').textContent = sectionsData[category] ? sectionsData[category].title : \'القسم\';

    displayPosts(category);
}

function displayPosts(category) {
    const postsContainer = document.getElementById(\'posts-container\');
    if (!postsContainer) return;

    const filteredPosts = posts.filter(p => p.category === category);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = filteredPosts.slice(start, end);

    postsContainer.innerHTML = \'\';
    if (paginatedPosts.length === 0) {
        postsContainer.innerHTML = \'<p class="text-center text-gray-500">لا توجد منشورات في هذا القسم بعد.</p>\';
        return;
    }

    paginatedPosts.forEach(post => {
        const postCard = document.createElement(\'div\');
        postCard.className = \'bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition duration-300 hover:scale-105\';
        postCard.onclick = () => goToPost(post.id);
        postCard.innerHTML = `
            <h2 class="text-xl font-bold text-blue-600 mb-2">${post.title}</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${post.date}</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">${post.content.substring(0, 100)}...</p>
            <div class="mt-4 text-right">
                <button class="text-blue-600 hover:underline text-sm">قراءة المزيد</button>
            </div>
        `;
        postsContainer.appendChild(postCard);
    });

    // Enable/disable pagination buttons
    const prevBtn = document.querySelector(\'button[onclick="prevPage()" ]\');
    const nextBtn = document.querySelector(\'button[onclick="nextPage()" ]\');
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

function nextPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get(\'category\');
    const filteredPosts = posts.filter(p => p.category === category);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPosts(category);
    }
}

function prevPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get(\'category\');
    if (currentPage > 1) {
        currentPage--;
        displayPosts(category);
    }
}

function loadPostContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get(\'id\'));
    const post = posts.find(p => p.id === postId);

    if (!post) {
        document.getElementById(\'post-title-bar\').textContent = \'المنشور غير موجود\';
        return;
    }

    document.getElementById(\'post-title-bar\').textContent = post.title;
    document.getElementById(\'post-meta\').textContent = `${post.date} | ${sectionsData[post.category].title}`;
    document.getElementById(\'post-content\').textContent = post.content;

    const downloadBtn = document.getElementById(\'download-btn\');
    if (post.link) {
        downloadBtn.href = post.link;
        downloadBtn.classList.remove(\'hidden\');
    } else {
        downloadBtn.classList.add(\'hidden\');
    }
}

function goToSection(category) {
    window.location.href = `section.html?category=${category}`;
}

function goToPost(id) {
    window.location.href = `post.html?id=${id}`;
}

function goHome() {
    window.location.href = \'index.html\';
}


