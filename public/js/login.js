const loginForm = document.querySelector('#login-form');
const newUserForm = document.querySelector('#new-user-form');
const changeForm = document.getElementById('change-form');

newUserForm.style.display = 'none';

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const userObj = {
        username: document.querySelector('#username-input').value,
        password: document.querySelector('#password-input').value
    };
    loginUser(userObj);
});

const loginUser = async (userObj) => {
    fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify(userObj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.ok) {
            location.href = '/';
        } else {
            alert('Invalid Credentials');
        }
    });
};

newUserForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (document.querySelector('#new-username').value == '') {
        alert('Please fill in the username input');
        return;
    } else if (document.querySelector('#new-password').value == '') {
        alert('Please fill in the password input');
        return;
    } else {
        const userObj = {
            username: document.querySelector('#new-username').value,
            password: document.querySelector('#new-password').value
        };
        createUser(userObj);
    }
});

const createUser = async (userObj) => {
    fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify(userObj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.ok) {
            location.reload();
        }
    });
};

// change form when clicked
changeForm.addEventListener('click', () => {
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'flex';
        newUserForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        newUserForm.style.display = 'flex';
        changeForm.innerText = 'Login';
    }
});
