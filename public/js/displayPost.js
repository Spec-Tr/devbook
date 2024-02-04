const postTitle = document.querySelector('.post-title');
const postInfo = document.querySelector('.post-info');
const postContent = document.querySelector('.post-content');
const addCommentButton = document.getElementById('add-comment-button');
const addCommentForm = document.getElementById('add-comment-form');
const submitComment = document.getElementById('submit-comment');
const commentInput = document.getElementById('comment-input');
let postData;

const renderPost = async () => {
    try {
        const wantedData = localStorage.getItem('wantedPostId');
        const wantedId = JSON.parse(wantedData);
        postData = await fetchPostData(wantedId);
        console.log(postData);
        renderPostDetails(postData);
        renderComments(postData);
    } catch (error) {
        console.error('Error rendering post:', error);
    }
};

const fetchPostData = async (postId) => {
    const response = await fetch(`http://localhost:3000/api/post/find/${postId}`);
    if (!response.ok) {
        throw new Error(`Unable to fetch post data: ${response.status}`);
    }
    return response.json();
};

const renderPostDetails = (post) => {
    const date = post.createdAt.slice(0, 10);  
    postTitle.textContent = post.title;
    postInfo.textContent = `Posted by ${post.User.username} on ${date}`;
    postContent.textContent = post.content;
};

const renderComments = (comments) => {
    const commentContainer = document.querySelector('.comment-container');
    for (let comment of comments.Comments) {
        const date = comment.createdAt.slice(0, 10); 
        const commentText = document.createElement('p');
        commentText.innerHTML = `${comment.content} <br><br> -- ${comment.author}  -- ${date}`;
        commentContainer.appendChild(commentText);
    }
};

addCommentButton.addEventListener('click', () => {
    addCommentForm.style.display = 'block';
});

submitComment.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const wantedData = localStorage.getItem('wantedPostId');
        const wantedId = JSON.parse(wantedData);
        await submitNewComment(wantedId);
        location.reload();
    } catch (error) {
        console.error('Error posting comment:', error);
    }
});

const submitNewComment = async (postId) => {
    const response = await fetch(`/api/comment/create/${postId}`, {
        method: 'POST',
        body: JSON.stringify({ content: commentInput.value }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error(`Unable to post comment: ${response.status}`);
    }
};
