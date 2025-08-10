# TechTouch Website

موقع TechTouch مع نظام تخزين البيانات على GitHub.
اختبار

## الميزات الجديدة

- **تخزين البيانات على GitHub**: جميع المنشورات وعناصر القوائم المنسدلة تُحفظ في ملفات JSON على GitHub
- **مشاركة عالمية**: المحتوى المنشور يظهر لجميع الزوار من أي جهاز
- **نسخ احتياطية تلقائية**: GitHub يحفظ تاريخ كامل لجميع التغييرات
- **أمان محسن**: استخدام دوال Netlify لحماية مفتاح GitHub API

## هيكل المشروع

```
techtouch0/
├── index.html              # الصفحة الرئيسية
├── admin.html              # لوحة التحكم
├── section.html            # صفحة عرض الأقسام
├── script.js               # الكود الرئيسي
├── github-config.js        # إعدادات GitHub
├── data/                   # مجلد البيانات
│   ├── posts.json          # ملف المنشورات
│   └── dropdowns.json      # ملف القوائم المنسدلة
├── netlify/
│   └── functions/
│       └── save-to-github.js  # دالة Netlify للحفظ
└── package.json            # إعدادات Node.js
```

## إعداد Netlify

لتفعيل الحفظ على GitHub، تحتاج إلى إعداد متغير بيئة في Netlify:

### 1. إنشاء Personal Access Token على GitHub

1. اذهب إلى GitHub Settings > Developer settings > Personal access tokens
2. انقر على "Generate new token"
3. اختر الصلاحيات التالية:
   - `repo` (للوصول إلى المستودعات)
   - `contents:write` (للكتابة في الملفات)
4. انسخ الرمز المميز (Token)

### 2. إعداد متغير البيئة في Netlify

1. اذهب إلى لوحة تحكم Netlify
2. اختر موقعك
3. اذهب إلى Site settings > Environment variables
4. أضف متغير جديد:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: الرمز المميز الذي نسخته من GitHub

### 3. إعادة نشر الموقع

بعد إضافة متغير البيئة، قم بإعادة نشر الموقع لتفعيل التغييرات.

## كيفية العمل

### قراءة البيانات
- يتم تحميل البيانات من ملفات JSON على GitHub مباشرة
- في حالة فشل التحميل، يتم استخدام البيانات المحفوظة محلياً كبديل

### حفظ البيانات
- عند إضافة منشور أو عنصر قائمة منسدلة، يتم إرسال البيانات إلى دالة Netlify
- دالة Netlify تستخدم GitHub API لتحديث الملفات
- في حالة فشل الحفظ، يتم الحفظ محلياً كنسخة احتياطية

## الملفات المهمة

### `github-config.js`
يحتوي على إعدادات GitHub والدوال المساعدة:
- `fetchFromGitHub()`: لجلب البيانات من GitHub
- `saveToGitHub()`: لحفظ البيانات عبر دالة Netlify

### `netlify/functions/save-to-github.js`
دالة Netlify التي تتولى الحفظ الآمن إلى GitHub باستخدام GitHub API.

### `data/posts.json`
ملف JSON يحتوي على جميع المنشورات بالتنسيق التالي:
```json
[
  {
    "id": 1,
    "title": "عنوان المنشور",
    "date": "2025-08-06",
    "content": "محتوى المنشور",
    "link": "رابط التحميل",
    "imageUrl": "رابط الصورة",
    "telegramLink": "رابط تليجرام",
    "category": "posts"
  }
]
```

### `data/dropdowns.json`
ملف JSON يحتوي على عناصر القوائم المنسدلة:
```json
{
  "movies": [
    {
      "icon": "🎬",
      "text": "اسم التطبيق",
      "url": "رابط التطبيق"
    }
  ],
  "sports": [...],
  "video": [...],
  "misc": [...]
}
```

## استكشاف الأخطاء

### المحتوى لا يظهر
- تأكد من أن ملفات JSON موجودة في مجلد `data/`
- تحقق من وحدة التحكم في المتصفح للأخطاء
- تأكد من أن الفرع المحدد في `github-config.js` صحيح

### فشل الحفظ
- تأكد من أن `GITHUB_TOKEN` مُعرف في Netlify
- تحقق من صلاحيات الرمز المميز على GitHub
- تأكد من أن اسم المستودع والمالك صحيحان في `github-config.js`

## الدعم

للحصول على المساعدة أو الإبلاغ عن مشاكل، يرجى فتح issue في المستودع على GitHub.

