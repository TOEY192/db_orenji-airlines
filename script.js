function openRegisterModal() {
    document.getElementById("registerModal").style.display = "block";
    setTimeout(() => {
        document.getElementById("registerModal").style.opacity = 1;
        document.querySelector("#registerModal .modal-content").style.opacity = 1;
    }, 10);
}

function closeRegisterModal() {
    document.getElementById("registerModal").style.opacity = 0;
    document.querySelector("#registerModal .modal-content").style.opacity = 0;
    setTimeout(() => {
        document.getElementById("registerModal").style.display = "none";
    }, 500);
}

function openLoginModal() {
    document.getElementById("loginModal").style.display = "block";
    setTimeout(() => {
        document.getElementById("loginModal").style.opacity = 1;
        document.querySelector("#loginModal .modal-content").style.opacity = 1;
    }, 10);
}

function closeLoginModal() {
    document.getElementById("loginModal").style.opacity = 0;
    document.querySelector("#loginModal .modal-content").style.opacity = 0;
    setTimeout(() => {
        document.getElementById("loginModal").style.display = "none";
    }, 500);
}