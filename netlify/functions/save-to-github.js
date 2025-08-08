const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // التحقق من أن الطلب هو POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // استخراج البيانات من الطلب
        const { filename, data } = JSON.parse(event.body);
        
        if (!filename || !data) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing filename or data' })
            };
        }

        // إعدادات GitHub
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_OWNER = 'kinanmjeed88';
        const GITHUB_REPO = 'techtouch0';
        const GITHUB_BRANCH = 'searchidf';
        
        if (!GITHUB_TOKEN) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'GitHub token not configured' })
            };
        }

        // الحصول على SHA الحالي للملف
        const getFileUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/${filename}?ref=${GITHUB_BRANCH}`;
        
        let currentSha = null;
        try {
            const getResponse = await fetch(getFileUrl, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                currentSha = fileData.sha;
            }
        } catch (error) {
            console.log('File does not exist, will create new file');
        }

        // تحويل البيانات إلى base64
        const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');

        // إعداد بيانات الطلب
        const updateData = {
            message: `Update ${filename} via web interface`,
            content: content,
            branch: GITHUB_BRANCH
        };

        // إضافة SHA إذا كان الملف موجوداً
        if (currentSha) {
            updateData.sha = currentSha;
        }

        // تحديث الملف على GitHub
        const updateUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/${filename}`;
        
        const updateResponse = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.text();
            console.error('GitHub API Error:', errorData);
            return {
                statusCode: updateResponse.status,
                body: JSON.stringify({ 
                    error: 'Failed to update file on GitHub',
                    details: errorData
                })
            };
        }

        const result = await updateResponse.json();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ 
                success: true, 
                message: 'File updated successfully',
                commit: result.commit
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};

