let postContainer = document.querySelector('.post-container');
let allPosts;
let posts;
let clickedId;

// get all the post in the db
fetch('api/post')
    .then(response => response.json())
    .then(data => {
        allPosts = data;
        console.log(allPosts);
        renderPosts();
    })
    .catch(error => {
        console.error('Unable to fetch posts:', error);
    });

const renderPosts = () => {
    for (let post of allPosts) {
        // Get the post date
        const date = new Intl.DateTimeFormat('en-US').format(new Date(post.createdAt));

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

    postContainer.addEventListener('click', event => {
        const post = event.target.closest('.post');
        if (post) {
            clickedId = post.id;
            displayPost(clickedId);
        }
    });
};

const displayPost = (id) => {
    if (id === '') {
        return;
    } else {
        localStorage.setItem('wantedPostId', id);
        location.replace(`/singlePost/${id}`);
    }
};
