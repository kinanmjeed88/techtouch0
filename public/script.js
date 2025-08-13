// تحميل المحتوى عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded, initializing...");
    // تحميل المحتوى بشكل فوري
    requestAnimationFrame(() => {
        loadContent();
        setupEventListeners();
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
    games: { title: "الألعاب", icon: "gamepad" },
    sports: { title: "الرياضة", icon: "futbol" }
};

// بيانات المنشورات - سيتم تحميلها من GitHub
let posts = [];

// بيانات قنوات التليجرام - سيتم تحميلها من GitHub
let telegramChannels = [];

// إعدادات الإعلان - سيتم تحميلها من GitHub
let adSettings = {
    adText: 'مرحباً بكم في TechTouch - موقعكم المفضل للتقنية!',
    adEnabled: true
};

// متغيرات التصفح
let currentPage = 1;
const postsPerPage = 10;

// تحميل البيانات من GitHub
async function loadDataFromGitHub() {
    try {
        console.log("Loading data from GitHub...");
        
        // تحميل المنشورات من ملفات Markdown
        posts = await fetchAllPosts();
        console.log("Posts loaded:", posts.length);
        
        // تحميل قنوات التليجرام من ملفات Markdown
        telegramChannels = await fetchTelegramChannels();
        console.log("Telegram channels loaded:", telegramChannels.length);
        
        // تحميل إعدادات الإعلان
        adSettings = await fetchAdSettings();
        console.log("Ad settings loaded:", adSettings);
        
        return true;
    } catch (error) {
        console.error("Error loading data from GitHub:", error);
        // في حالة الفشل، استخدم البيانات المحلية كبديل
        loadLocalData();
        return false;
    }
}

// تحميل البيانات المحلية كبديل
function loadLocalData() {
    console.log("Loading local data as fallback...");
    
    // تحميل المنشورات من localStorage
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
        try {
            posts = JSON.parse(savedPosts);
        } catch (error) {
            console.error("Error parsing saved posts:", error);
            posts = [];
        }
    }
    
    // تحميل إعدادات الإعلان من localStorage
    const savedAdText = localStorage.getItem("adText");
    if (savedAdText) {
        adSettings.adText = savedAdText;
    }
}

// دالة تحميل المحتوى الرئيسية
async function loadContent() {
    console.log("Starting content load...");
    
    // تحميل البيانات من GitHub أولاً
    const githubSuccess = await loadDataFromGitHub();
    
    if (!githubSuccess) {
        console.log("GitHub loading failed, using local data");
    }
    
    // عرض المحتوى
    displayContent();
    updateAdText();
}

// عرض المحتوى
function displayContent() {
    // عرض المنشورات لكل قسم
    displaySectionPosts('posts', 1);
    displaySectionPosts('games', 1);
    displaySectionPosts('sports', 1);
}

// تحديث نص الإعلان
function updateAdText() {
    const adElement = document.getElementById("ad-text");
    if (adElement && adSettings.adEnabled) {
        adElement.textContent = adSettings.adText;
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // إضافة تأثيرات التفاعل للبطاقات
    const cards = document.querySelectorAll(".post-card, .telegram-section");
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
    const newPost = {
        id: Date.now(),
        title: title,
        date: date || new Date().toISOString().split('T')[0],
        content: content,
        link: link,
        imageUrl: imageUrl,
        telegramLink: telegramLink,
        category: category,
        timestamp: Date.now()
    };

    // إضافة المنشور في بداية المصفوفة
    posts.unshift(newPost);
    
    // حفظ البيانات إلى GitHub
    saveToGitHub('posts.json', posts)
        .then(() => {
            alert("تم إضافة المنشور بنجاح!");
            
            // مسح النموذج
            document.getElementById("post-title").value = "";
            document.getElementById("post-date").value = "";
            document.getElementById("post-content").value = "";
            document.getElementById("post-link").value = "";
            document.getElementById("post-image-file").value = "";
            document.getElementById("telegram-link").value = "";
            document.getElementById("post-category").value = "";
            
            // إخفاء معاينة الصورة
            const imagePreview = document.getElementById("image-preview");
            if (imagePreview) {
                imagePreview.classList.add("hidden");
            }

            updateStats();
        })
        .catch((error) => {
            console.error('Error saving post:', error);
            alert("حدث خطأ أثناء حفظ المنشور. سيتم حفظه محلياً كنسخة احتياطية.");
            
            // حفظ احتياطي في localStorage
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
            const imagePreview = document.getElementById("image-preview");
            if (imagePreview) {
                imagePreview.classList.add("hidden");
            }

            updateStats();
        });
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
                { name: "Netflix", url: "https://netflix.com" },
                { name: "Disney+", url: "https://disneyplus.com" },
                { name: "Amazon Prime", url: "https://primevideo.com" },
                { name: "Shahid", url: "https://shahid.mbc.net" }
            ]
        },
        sports: {
            title: "تطبيقات رياضية",
            items: [
                { name: "ESPN", url: "https://espn.com" },
                { name: "beIN Sports", url: "https://beinsports.com" },
                { name: "KooraLive", url: "https://kooralive.tv" },
                { name: "Yalla Shoot", url: "https://yallashoot.com" }
            ]
        },
        video: {
            title: "تصميم الفيديو",
            items: [
                { name: "Adobe Premiere", url: "https://adobe.com/premiere" },
                { name: "Final Cut Pro", url: "https://apple.com/final-cut-pro" },
                { name: "DaVinci Resolve", url: "https://blackmagicdesign.com" },
                { name: "Canva Video", url: "https://canva.com" }
            ]
        },
        misc: {
            title: "قسم المتفرقات",
            items: [
                { name: "أدوات مفيدة", url: "#" },
                { name: "مواقع تعليمية", url: "#" },
                { name: "تطبيقات عامة", url: "#" },
                { name: "موارد مجانية", url: "#" }
            ]
        }
    };
    
    const data = contentData[type];
    if (!data) return;
    
    titleElement.textContent = data.title;
    listElement.innerHTML = "";
    
    data.items.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.className = "flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors cursor-pointer";
        itemElement.innerHTML = `
            <span class="font-medium text-gray-800">${item.name}</span>
            <i class="fas fa-external-link-alt text-gray-500"></i>
        `;
        itemElement.onclick = () => window.open(item.url, '_blank');
        listElement.appendChild(itemElement);
    });
    
    contentArea.classList.remove("hidden");
}

function hideSubContent() {
    document.getElementById("sub-content-area").classList.add("hidden");
}

// العودة للصفحة الرئيسية
function goHome() {
    window.location.href = "index.html";
}

// فتح الشريط الجانبي
function openSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("overlay").classList.add("active");
}

// إغلاق الشريط الجانبي
function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("active");
}

// تهيئة القوائم المنسدلة
function initializeDropdowns() {
    const dropdownCards = document.querySelectorAll(".dropdown-card");
    
    dropdownCards.forEach(card => {
        card.addEventListener("click", function() {
            const dropdownType = this.getAttribute("data-dropdown");
            const headerText = this.querySelector(".dropdown-header").textContent;
            
            if (dropdownType && dropdownData[dropdownType]) {
                openDropdownModal(dropdownType, headerText);
            }
        });
    });
}

// فتح النافذة المنبثقة للقائمة المنسدلة
function openDropdownModal(dropdownType, title) {
    updateDropdownData(); // تحديث البيانات من localStorage
    
    const modal = document.getElementById("dropdown-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalList = document.getElementById("modal-list");
    
    if (!modal || !modalTitle || !modalList) {
        console.error("Modal elements not found");
        return;
    }
    
    modalTitle.textContent = title;
    modalList.innerHTML = "";
    
    const items = dropdownData[dropdownType] || [];
    if (items.length > 0) {
        items.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "flex items-center p-3 bg-white/90 rounded-lg hover:bg-white cursor-pointer transition-all duration-200 hover:transform hover:scale-105";
            itemDiv.innerHTML = `
                <span class="text-2xl mr-4">${item.icon}</span>
                <span class="font-medium text-gray-800 flex-1">${item.text}</span>
                <i class="fas fa-external-link-alt text-gray-500"></i>
            `;
            
            itemDiv.addEventListener("click", function() {
                window.open(item.url, "_blank");
                modal.style.display = "none";
            });
            
            modalList.appendChild(itemDiv);
        });
    } else {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "text-center p-6 text-white";
        emptyDiv.innerHTML = `
            <i class="fas fa-inbox text-4xl mb-3 opacity-50"></i>
            <p class="text-lg">لا توجد عناصر في هذا القسم</p>
        `;
        modalList.appendChild(emptyDiv);
    }
    
    modal.style.display = "block";
}

// إغلاق النافذة المنبثقة
function closeDropdownModal() {
    const modal = document.getElementById("dropdown-modal");
    if (modal) {
        modal.style.display = "none";
    }
}

// إغلاق النافذة المنبثقة عند النقر خارجها
document.addEventListener("click", function(event) {
    const modal = document.getElementById("dropdown-modal");
    
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// إضافة الأنماط للنافذة المنبثقة
const modalStyles = `
<style>
.modal {
    display: none;
    position: fixed;
    z-index: 2000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
}

.modal-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 5% auto;
    padding: 30px;
    border-radius: 20px;
    width: 90%;
    max-width: 800px;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.close-button {
    color: white;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    position: absolute;
    top: 15px;
    right: 25px;
    transition: color 0.3s ease;
}

.close-button:hover {
    color: #ffeb3b;
}

.modal h2 {
    color: white;
    text-align: center;
    margin-bottom: 30px;
    font-size: 2rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.modal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
}

.modal-item {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.modal-item:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 1);
}

.modal-item-icon {
    font-size: 2rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    color: white;
    flex-shrink: 0;
}

.modal-item-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    flex: 1;
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        margin: 10% auto;
        padding: 20px;
    }
    
    .modal-grid {
        grid-template-columns: 1fr;
    }
}
</style>
`;

document.head.insertAdjacentHTML("beforeend", modalStyles);

// تحميل محتوى صفحة القسم
function loadSectionContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    
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




// فتح وإغلاق القائمة الجانبية
function openSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("overlay").classList.add("active");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("active");
}




// التنقل إلى قسم
function goToSection(category) {
    window.location.href = `section.html?category=${category}`;
}

// التنقل إلى منشور
function goToPost(id) {
    window.location.href = `post.html?id=${id}`;
}


