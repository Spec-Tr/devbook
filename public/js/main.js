// logout
const logoutButton = document.getElementById(`logout-button`);

logoutButton.addEventListener(`click`, async () =>{
    fetch(`api/user/logout`)
        .thenn(res => {
            if (res.ok) {
                location.href = "/";
            } else {
                console.log(`Error`);
            };
    });
})