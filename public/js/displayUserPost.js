let postData;
const postTitleInput = document.getElementById('post-title-input');
const postContentInput = document.getElementById('post-content-input');
const editPostButton = document.getElementById('edit-post-button');
const deletePostButton = document.getElementById('delete-post-button');
let wantedId;

const renderPost = () => {
    // get post id
    const wantedData = localStorage.getItem('wantedUserPostId');
    wantedId = JSON.parse(wantedData);
    // get post data
    fetch(`http://localhost:3000/api/post/find/${wantedId}`)
        .then(response => response.json())
        .then(data => {
            postData = data;
            console.log(postData);
            postTitleInput.value = postData.title;
            postContentInput.value = postData.content;
        })
        .catch(error => {
            console.error('Error trying to fetch posts data', error);
        });
};

// edit post button
editPostButton.addEventListener('click', () => {
    if (postTitleInput.value == '') {
        alert('Please fill in the title input');
        return;
    } else if (postContentInput.value == '') {
        alert('Please fill in the content input');
        return;
    } else {
        fetch(`/api/post/edit/${wantedId}`, {
            method: 'PUT',
            body: JSON.stringify(
                {
                    title: postTitleInput.value,
                    content: postContentInput.value
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            location.replace('/dashboard');
        });
    }
});

// delete post button
deletePostButton.addEventListener('click', () => {
    fetch(`/api/post/delete/${wantedId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        location.replace('/dashboard');
    });
});

renderPost();
