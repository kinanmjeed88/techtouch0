
// تحميل المحتوى عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded, initializing...");
    // تحميل المحتوى بشكل فوري
    requestAnimationFrame(() => {
        loadContent();
        setupEventListeners();
        initializeDropdowns();
        updateProfilePic(); // تحديث الصورة الشخصية
    });
});

// تحديث الصورة الشخصية في الشريط العلوي
function updateProfilePic() {
    const profilePicDisplay = document.getElementById("profile-pic-display");
    if (profilePicDisplay) {
        const savedProfilePic = localStorage.getItem("profilePic");
        if (savedProfilePic) {
            profilePicDisplay.src = savedProfilePic;
        }
    }
}

// بيانات الأقسام
const sectionsData = {
    posts: { title: "المنشورات", icon: "file-lines" },
    apps: { title: "التطبيقات", icon: "mobile-screen-button" },
    games: { title: "الألعاب", icon: "gamepad" },
    movies: { title: "الأفلام", icon: "film" },
    tutorials: { title: "الشروحات", icon: "book" },
    ai: { title: "الذكاء الاصطناعي", icon: "microchip" }
};

// بيانات المنشورات
let posts = JSON.parse(localStorage.getItem("posts")) || [
    {
        id: 1,
        title: "أول منشور تجريبي",
        date: "2025-08-06",
        content: "هذا هو المحتوى التجريبي لأول منشور. يمكن تعديله من لوحة التحكم.",
        link: "#",
        imageUrl: "",
        telegramLink: "",
        category: "posts"
    },
    {
        id: 2,
        title: "تطبيق تجريبي جديد",
        date: "2025-08-05",
        content: "هذا هو المحتوى التجريبي لتطبيق جديد. يمكن تعديله من لوحة التحكم.",
        link: "#",
        imageUrl: "",
        telegramLink: "",
        category: "apps"
    },
    {
        id: 3,
        title: "لعبة تجريبية ممتعة",
        date: "2025-08-04",
        content: "هذا هو المحتوى التجريبي للعبة جديدة. يمكن تعديله من لوحة التحكم.",
        link: "#",
        imageUrl: "",
        telegramLink: "",
        category: "games"
    },
    {
        id: 4,
        title: "سينمانا الاسود",
        date: "2025-08-03",
        content: "تطبيق سينمانا الأسود لمشاهدة الأفلام والمسلسلات.",
        link: "#",
        imageUrl: "",
        telegramLink: "",
        category: "movies"
    }
];

// نص الإعلان
let adText = localStorage.getItem("adText") || "مرحباً بكم في TechTouch - موقعكم المفضل للتقنية!";

// متغيرات التصفح
let currentPage = 1;
const postsPerPage = 10;

// بيانات القوائم المنسدلة
const dropdownData = {
    movies: [
        { icon: "🎬", text: "Cinemana X ايرثلنك", url: "https://t.me/techtouch7/173" },
        { icon: "🎭", text: "CEE أفلام", url: "https://t.me/techtouch7/174" },
        { icon: "📽️", text: "Monveibox أفلام", url: "https://t.me/techtouch7/2070" },
        { icon: "🎪", text: "سينمانا", url: "https://t.me/techtouch7/1668" },
        { icon: "🍿", text: "نتفلكس محاني", url: "https://t.me/techtouch7/2676" },
        { icon: "📺", text: "سيمو دراما", url: "https://t.me/techtouch7/211?single" }
    ],
    sports: [
        { icon: "📺", text: "MixFlix tv", url: "https://t.me/techtouch7/1450" },
        { icon: "📺", text: "دراما لايف tv", url: "https://t.me/techtouch7/1686" },
        { icon: "⚽", text: "الأسطورة tv", url: "https://t.me/techtouch7/2367?single" },
        { icon: "🏀", text: "ياسين tv", url: "https://t.me/techtouch7/136" },
        { icon: "🏈", text: "BlackUltra", url: "https://t.me/techtouch7/2719" },
        { icon: "🎾", text: "ZAIN LIVE", url: "https://t.me/techtouch7/1992" }
    ],
    video: [
        { icon: "✂️", text: "Viva cut بديل كاب كات", url: "https://t.me/techtouch7/2975?single" },
        { icon: "🎨", text: "CapCut اصدار 2", url: "https://t.me/techtouch7/3250" },
        { icon: "🎬", text: "CapCut اصدار 1", url: "https://t.me/techtouch7/3287" }
    ],
    misc: [
        { icon: "📱", text: "MYTV الأندرويد", url: "https://t.me/techtouch7/204" },
        { icon: "📲", text: "MYTV الآيفون", url: "https://t.me/techtouch7/1041" },
        { icon: "📺", text: "شبكتي tv للشاشات", url: "https://t.me/techtouch7/1556" },
        { icon: "📱", text: "شبكتي tv للهاتف", url: "https://t.me/techtouch7/1818" },
        { icon: "🖥️", text: "المنصة X للشاشات", url: "https://t.me/techtouch7/1639" },
        { icon: "📲", text: "المنصة X للهاتف", url: "https://t.me/techtouch7/1533" }
    ]
};

// تحميل المحتوى حسب الصفحة
function loadContent() {
    console.log("loadContent called");
    const path = window.location.pathname;

    if (path.includes("admin.html")) {
        // Admin page logic is now handled directly in admin.html script block
    } else if (path.includes("section.html")) {
        loadSectionContent();
    } else if (path.includes("post.html")) {
        loadPostContent();
    } else {
        loadHomePageContent();
    }
    updateAdBar();
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // إضافة تأثيرات التفاعل للبطاقات
    const cards = document.querySelectorAll(".main-card, .sub-card, .dropdown-card");
    cards.forEach(card => {
        card.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-3px) scale(1.02)";
        });
        
        card.addEventListener("mouseleave", function() {
            this.style.transform = "translateY(0) scale(1)";
        });
    });
}

// تحديث شريط الإعلان
function updateAdBar() {
    const adElement = document.getElementById("ad-text");
    if (adElement) {
        adElement.textContent = adText;
    }
}

// تحميل محتوى الصفحة الرئيسية
function loadHomePageContent() {
    console.log("loadHomePageContent called");
    updateLatestPosts();
}

// تحديث آخر المنشورات في البطاقات
function updateLatestPosts() {
    // استخدام fragment لتحسين الأداء
    const fragment = document.createDocumentFragment();
    
    Object.keys(sectionsData).forEach(category => {
        const categoryPosts = posts.filter(p => p.category === category);
        const latestPost = categoryPosts.length > 0 ? categoryPosts[0] : null;
        const element = document.getElementById(`${category}-latest`);
        
        if (element) {
            if (latestPost) {
                element.textContent = `آخر منشور: ${latestPost.title}`;
            } else {
                element.textContent = `لا توجد منشورات بعد`;
            }
        }
    });
}

// تحديث الإعلان (وظيفة لوحة التحكم)
function updateAd() {
    const newAdText = document.getElementById("ad-input").value;
    if (newAdText) {
        adText = newAdText;
        localStorage.setItem("adText", adText);
        updateAdBar();
        alert("تم تحديث الإعلان بنجاح!");
    } else {
        alert("يرجى إدخال نص الإعلان!");
    }
}

// إضافة منشور جديد
function addPost() {
    const title = document.getElementById("post-title").value.trim();
    const date = document.getElementById("post-date").value;
    const content = document.getElementById("post-content").value.trim();
    const link = document.getElementById("post-link").value.trim();
    const imageFile = document.getElementById("post-image-file").files[0];
    const telegramLink = document.getElementById("telegram-link").value.trim();
    const category = document.getElementById("post-category").value;

    if (!title || !content || !category) {
        alert("يرجى ملء جميع الحقول المطلوبة!");
        return;
    }

    // معالجة الصورة إذا تم رفعها
    let imageUrl = "";
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUrl = e.target.result;
            savePost(title, date, content, link, imageUrl, telegramLink, category);
        };
        reader.readAsDataURL(imageFile);
    } else {
        savePost(title, date, content, link, imageUrl, telegramLink, category);
    }
}

function savePost(title, date, content, link, imageUrl, telegramLink, category) {
    // استخدام نفس هيكل البيانات المستخدم في admin.html
    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    
    const newPost = {
        id: Date.now(),
        title: title,
        date: date || new Date().toISOString().split("T")[0],
        content: content,
        link: link,
        imageUrl: imageUrl,
        telegramLink: telegramLink,
        category: category,
        timestamp: Date.now()
    };

    // إضافة المنشور في بداية المصفوفة
    posts.unshift(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));

    // مسح النموذج
    document.getElementById("post-title").value = "";
    document.getElementById("post-date").value = "";
    document.getElementById("post-content").value = "";
    document.getElementById("post-link").value = "";
    document.getElementById("post-image-file").value = "";
    document.getElementById("telegram-link").value = "";
    document.getElementById("post-category").value = "";
    
    // إخفاء معاينة الصورة
    document.getElementById("image-preview").classList.add("hidden");

    alert("تم إضافة المنشور بنجاح!");
    updateStats();
}

// عرض المنشورات حسب القسم
function displayPosts(category) {
    if (!category) {
        const titleElement = document.getElementById("section-title");
        if (titleElement) titleElement.textContent = "القسم غير موجود";
        return;
    }

    const titleElement = document.getElementById("section-title");
    if (titleElement) {
        titleElement.textContent = sectionsData[category] ? sectionsData[category].title : "القسم";
    }

    displayPosts(category);
}

// عرض المنشورات
function displayPosts(category) {
    const postsContainer = document.getElementById("posts-container");
    const emptyState = document.getElementById("empty-state");
    const paginationContainer = document.getElementById("pagination-container");
    
    if (!postsContainer) return;

    const filteredPosts = posts.filter(p => p.category === category);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = filteredPosts.slice(start, end);

    postsContainer.innerHTML = "";
    
    if (paginatedPosts.length === 0) {
        emptyState.classList.remove("hidden");
        paginationContainer.classList.add("hidden");
        return;
    } else {
        emptyState.classList.add("hidden");
        paginationContainer.classList.remove("hidden");
    }

    paginatedPosts.forEach(post => {
        const postCard = document.createElement("div");
        postCard.className = "post-card";
        postCard.onclick = () => goToPost(post.id);
        
        // تحديد أيقونة القسم
        const sectionIcons = {
            posts: "file-lines",
            apps: "mobile-screen-button",
            games: "gamepad",
            movies: "film",
            tutorials: "book",
            ai: "microchip"
        };
        
        const sectionColors = {
            posts: "blue",
            apps: "green",
            games: "purple",
            movies: "red",
            tutorials: "orange",
            ai: "cyan"
        };
        
        const icon = sectionIcons[post.category] || "star";
        const color = sectionColors[post.category] || "gray";
        
        postCard.innerHTML = `
            <div class="flex items-start mb-4">
                <div class="text-2xl text-${color}-600 ml-3">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="flex-1">
                    <h2 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">${post.title}</h2>
                    <div class="flex items-center text-sm text-gray-500 mb-3">
                        <i class="fas fa-calendar-alt ml-1"></i>
                        <span>${post.date}</span>
                    </div>
                </div>
            </div>
            <p class="text-sm text-gray-600 mb-4 line-clamp-3">${post.content.substring(0, 150)}${post.content.length > 150 ? "..." : ""}</p>
            <div class="flex justify-between items-center">
                <button class="text-${color}-600 hover:text-${color}-700 font-medium text-sm transition-colors">
                    <i class="fas fa-arrow-left ml-1"></i>
                    قراءة المزيد
                </button>
                ${post.link && post.link !== "#" ? `
                    <div class="text-green-600">
                        <i class="fas fa-download"></i>
                    </div>
                ` : ""}
            </div>
        `;
        postsContainer.appendChild(postCard);
    });

    // تحديث أزرار التصفح
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

// الصفحة التالية
function nextPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const filteredPosts = posts.filter(p => p.category === category);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPosts(category);
    }
}

// الصفحة السابقة
function prevPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    if (currentPage > 1) {
        currentPage--;
        displayPosts(category);
    }
}

// تحميل محتوى المنشور
function loadPostContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get("id"));
    const post = posts.find(p => p.id === postId);

    if (!post) {
        const titleElement = document.getElementById("post-title-bar");
        if (titleElement) titleElement.textContent = "المنشور غير موجود";
        return;
    }

    const titleElement = document.getElementById("post-title-bar");
    const metaElement = document.getElementById("post-meta");
    const contentElement = document.getElementById("post-content");
    const imageElement = document.getElementById("post-image");
    const downloadBtn = document.getElementById("download-btn");
    const telegramBtn = document.getElementById("telegram-btn");

    if (titleElement) titleElement.textContent = post.title;
    if (metaElement) metaElement.textContent = `${post.date} | ${sectionsData[post.category].title}`;
    if (contentElement) contentElement.textContent = post.content;

    if (imageElement) {
        if (post.imageUrl) {
            imageElement.src = post.imageUrl;
            imageElement.classList.remove("hidden");
        } else {
            imageElement.classList.add("hidden");
        }
    }

    if (downloadBtn) {
        if (post.link && post.link !== "#") {
            downloadBtn.href = post.link;
            downloadBtn.classList.remove("hidden");
        } else {
            downloadBtn.classList.add("hidden");
        }
    }

    if (telegramBtn) {
        if (post.telegramLink) {
            telegramBtn.href = post.telegramLink;
            telegramBtn.classList.remove("hidden");
        } else {
            telegramBtn.classList.add("hidden");
        }
    }
}

// التنقل إلى قسم
function goToSection(category) {
    window.location.href = `section.html?category=${category}`;
}

// التنقل إلى منشور
function goToPost(id) {
    window.location.href = `post.html?id=${id}`;
}

// إضافة دوال عرض المحتوى في نفس الصفحة
function showSubContent(type) {
    const contentArea = document.getElementById("sub-content-area");
    const titleElement = document.getElementById("sub-content-title");
    const listElement = document.getElementById("sub-content-list");
    
    // بيانات المحتوى لكل قسم
    const contentData = {
        movies: {
            title: "تطبيقات الأفلام",
            items: [
                { icon: "🎬", text: "Cinemana X ايرثلنك", url: "https://t.me/techtouch7/173" },
                { icon: "🎭", text: "CEE أفلام", url: "https://t.me/techtouch7/174" },
                { icon: "📽️", text: "Monveibox أفلام", url: "https://t.me/techtouch7/2070" },
                { icon: "🎪", text: "سينمانا", url: "https://t.me/techtouch7/1668" },
                { icon: "🍿", text: "نتفلكس محاني", url: "https://t.me/techtouch7/2676" },
                { icon: "📺", text: "سيمو دراما", url: "https://t.me/techtouch7/211?single" }
            ]
        },
        sports: {
            title: "تطبيقات رياضية",
            items: [
                { icon: "📺", text: "MixFlix tv", url: "https://t.me/techtouch7/1450" },
                { icon: "📺", text: "دراما لايف tv", url: "https://t.me/techtouch7/1686" },
                { icon: "⚽", text: "الأسطورة tv", url: "https://t.me/techtouch7/2367?single" },
                { icon: "🏀", text: "ياسين tv", url: "https://t.me/techtouch7/136" },
                { icon: "🏈", text: "BlackUltra", url: "https://t.me/techtouch7/2719" },
                { icon: "🎾", text: "ZAIN LIVE", url: "https://t.me/techtouch7/1992" }
            ]
        },
        video: {
            title: "تصميم الفيديو",
            items: [
                { icon: "✂️", text: "Viva cut بديل كاب كات", url: "https://t.me/techtouch7/2975?single" },
                { icon: "🎨", text: "CapCut اصدار 2", url: "https://t.me/techtouch7/3250" },
                { icon: "🎬", text: "CapCut اصدار 1", url: "https://t.me/techtouch7/3287" }
            ]
        },
        misc: {
            title: "قسم المتفرقات",
            items: [
                { icon: "📱", text: "MYTV الأندرويد", url: "https://t.me/techtouch7/204" },
                { icon: "📲", text: "MYTV الآيفون", url: "https://t.me/techtouch7/1041" },
                { icon: "📺", text: "شبكتي tv للشاشات", url: "https://t.me/techtouch7/1556" },
                { icon: "📱", text: "شبكتي tv للهاتف", url: "https://t.me/techtouch7/1818" },
                { icon: "🖥️", text: "المنصة X للشاشات", url: "https://t.me/techtouch7/1639" },
                { icon: "📲", text: "المنصة X للهاتف", url: "https://t.me/techtouch7/1533" }
            ]
        }
    };
    
    const data = contentData[type];
    if (!data) return;
    
    titleElement.textContent = data.title;
    listElement.innerHTML = "";
    
    data.items.forEach(item => {
        const itemDiv = document.createElement("a");
        itemDiv.href = item.url;
        itemDiv.target = "_blank"; // Open in new tab
        itemDiv.className = "modal-item";
        itemDiv.innerHTML = `
            <span class="icon">${item.icon}</span>
            <span>${item.text}</span>
        `;
        listElement.appendChild(itemDiv);
    });

    contentArea.classList.remove("hidden");
}

function openDropdownModal(type, title) {
    const modal = document.getElementById("dropdownModal");
    const modalTitle = document.getElementById("dropdownModalTitle");
    const modalList = document.getElementById("dropdownModalList");

    modalTitle.textContent = title;
    modalList.innerHTML = "";

    const data = dropdownData[type];
    if (data) {
        data.forEach(item => {
            const itemDiv = document.createElement("a");
            itemDiv.href = item.url;
            itemDiv.target = "_blank";
            itemDiv.className = "modal-item";
            itemDiv.innerHTML = `
                <span class="icon">${item.icon}</span>
                <span>${item.text}</span>
            `;
            modalList.appendChild(itemDiv);
        });
    }

    modal.classList.add("active");
}

function closeDropdownModal() {
    const modal = document.getElementById("dropdownModal");
    modal.classList.remove("active");
}

function initializeDropdowns() {
    // No specific initialization needed here as onclick is directly on the cards
}


