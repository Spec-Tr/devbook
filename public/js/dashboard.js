const postContainer = document.querySelector('.post-container');
const newPostButton = document.getElementById('new-post-button');
const addPostForm = document.getElementById('add-post-form');
const dashboardPage = document.getElementById('dashboard-page');
const addPostButton = document.getElementById('add-post-button');
let allUserPosts;
let posts;
let clickedId;

// get all the logged user's post 
fetch('api/post/logged/posts')
    .then(response => response.json())
    .then(data => {
        allUserPosts = data;
        console.log(allUserPosts);
        renderPosts();
    })
    .catch(error => {
        console.error('Cannto fetch post data', error);
    });

const renderPosts = () => {
    for (let post of allUserPosts) {
        // Get the post date
        const date = post.createdAt.slice(0, 10);
        console.log(date);
        // Create & append the outer div with class "post"
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.setAttribute('id', `${post.id}`);
        postContainer.appendChild(postDiv);
        // Create & append the inner div with class "post-header"
        const postHeaderDiv = document.createElement('div');
        postHeaderDiv.classList.add('post-header');
        postDiv.appendChild(postHeaderDiv);
        // Create & append the h3 element with class "post-title" and set its text content
        const postTitle = document.createElement('h3');
        postTitle.classList.add('post-title');
        postTitle.textContent = `${post.title}`;
        postHeaderDiv.appendChild(postTitle);
        // Create & append the p element for the "Posted by" text
        const postInfo = document.createElement('p');
        postInfo.classList.add('post-info');
        postInfo.textContent = `Posted by ${post.User.username} on ${date}`;
        postHeaderDiv.appendChild(postInfo);
        // Create & append the p element with class "post-content" and set its text content
        const postContent = document.createElement('p');
        postContent.classList.add('post-content');
        postContent.textContent = `${post.content}`;
        postDiv.appendChild(postContent);
    }
    posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        post.addEventListener('click', event => {
            if (event.target.parentNode.className === 'post-header') {
                clickedId = event.target.parentNode.parentNode.id;
                displayPost(clickedId);
            } else {
                clickedId = event.target.parentNode.id;
                displayPost(clickedId);
            }
        });
    });
};

const displayPost = (id) => {
    if (id == '') {
        return;
    } else {
        localStorage.setItem('wantedUserPostId', id);
        location.replace(`/singleUserPost/${id}`);
    }
};

newPostButton.addEventListener('click', () => {
    dashboardPage.style.display = 'none';
    addPostForm.style.display = 'block';
});

addPostButton.addEventListener('click', (event) => {
    event.preventDefault();

    // create post with the form info
    // check that the form was filled completely
    const postTitleInput = document.getElementById('post-title-input');
    const postContentInput = document.getElementById('post-content-input');
    if (postTitleInput.value == '') {
        alert('Title cannot be empty');
        return;
    } else if (postContentInput.value == '') {
        alert('Content cannot be empty');
        return;
    } else {
        fetch('/api/post/', {
            method: 'POST',
            body: JSON.stringify({
                title: postTitleInput.value,
                content: postContentInput.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                location.reload();
            } else {
                console.log('Error');
            }
        });
    }
});
