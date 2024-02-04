const postTitleInput = document.getElementById(`post-title-input`);
const postContentInput = document.getElementById(`post-content-input`);
const editPostButton = document.getElementById(`edit-post-button`);
const deletePostButton = document.getElementById(`delete-post-button`);
let postData;
let wantedId;

const renderPost = () => {
    // get post id
    const wantedData = localStorage.getItem(`wantedUserPostId`);
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
            console.error('Unable to fetch posts data', error);           
    });
};

// update post when button is pressed
editPostButton.addEventListener(`click`, () => {
    if(postTitleInput.value == ``){
        alert(`Post title cannot be blank`);
        return
    } else if (postContentInput.value == ``){
        alert(`Post content cannot be blank`);
        return
    } else {
        fetch(`/api/post/edit/${wantedId}`, {
            method: `PUT`,
            body: JSON.stringify(
                {
                    title: postTitleInput.value,
                    content: postContentInput.value
                }
            ),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            location.replace(`/dashboard`);
        });
    }
},);

// delete post when button is pressed
deletePostButton.addEventListener(`click`, () => {
    fetch(`/api/post/delete/${wantedId}`, {
        method: `DELETE`,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        location.replace(`/dashboard`);
    });
});

renderPost();