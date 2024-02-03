// logout
const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
    fetch('api/user/logout')
        .then(res => {
            if (res.ok) {
                location.href = '/';
            } else {
                console.log('Error');
            }
        });
});
