document.getElementById('photo-idea').addEventListener('change', function() {
    document.getElementById('photo-count').disabled = !this.checked;
});

document.getElementById('submit').addEventListener('click', async function() {
    var topic = document.getElementById('topic').value;
    var length = document.getElementById('length').value;
    var keyword = document.getElementById('keyword').value;
    var audience = document.getElementById('audience').value;
    var photoIdea = document.getElementById('photo-idea').checked;
    var photoCount = photoIdea ? document.getElementById('photo-count').value : 0;
    
    // Show loading message and progress bar
    document.getElementById('submit').innerText = 'Generating...';
    document.getElementById('output').innerText = '';
    document.getElementById('progress-bar').style.display = 'block';
    document.getElementById('progress-bar-status').style.width = '50%';

    try {
        const response = await fetch('/generate-blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic, length, keyword, audience, photoIdea, photoCount }),
        });

        if (!response.ok) {
            throw new Error('Server responded with an error');
        }

        const data = await response.json();
        document.getElementById('output').innerText = data.result;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').innerText = 'Error: Could not generate blog post.';
    } finally {
        // Hide progress bar and reset button text
        document.getElementById('progress-bar').style.display = 'none';
        document.getElementById('progress-bar-status').style.width = '0%';
        document.getElementById('submit').innerText = '블로그 글 생성 (Generate Blog Post)';
    }
});
