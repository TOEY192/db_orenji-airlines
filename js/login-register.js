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

openEditInfoModal = () => {
    document.getElementById('edit-info-Modal').style.display = "block";
    setTimeout(() => {
        document.getElementById("edit-info-Modal").style.opacity = 1;
        document.querySelector("#edit-info-Modal .modal-content").style.opacity = 1;
    }, 10);
}

function closeEditInfoModal() {
    document.getElementById("edit-info-Modal").style.opacity = 0;
    document.querySelector("#edit-info-Modal .modal-content").style.opacity = 0;
    setTimeout(() => {
        document.getElementById("edit-info-Modal").style.display = "none";
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

let isLoggedIn = false;

// ดักจับการ submit ฟอร์ม
document.getElementById('login-container').addEventListener('submit', function (event) {
    event.preventDefault();  // ป้องกันการ submit ฟอร์มตามปกติ

    // รับค่าจากฟอร์ม
    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;

    // ส่งข้อมูลไปยัง API ด้วย fetch
    fetch('https://db-orenji-airlines.onrender.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // ระบุว่าเรากำลังส่งข้อมูลในรูปแบบ JSON
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => response.json())  // รับผลลัพธ์เป็น JSON
        .then(data => {
            console.log('Server Response:', data);  // แสดงผลตอบรับจาก API
            if (data.message === 'Invalid email or password') {
                alert('Invalid email or password');
            } else {
                console.log('Login successful:', data);  // เมื่อข้อมูลถูกต้อง
                alert('Login successful!');
                onLoginSuccess();
                closeLoginModal();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error Login');
        });
});

// ดักจับการ submit ฟอร์ม
document.getElementById('register-container').addEventListener('submit', function (event) {
    event.preventDefault();  // ป้องกันการ submit ฟอร์มตามปกติ

    // รับค่าจากฟอร์ม
    const username = document.getElementById('username-register').value;
    const email = document.getElementById('email-register').value;
    const password = document.getElementById('password-register').value;

    // ส่งข้อมูลไปยัง API ด้วย fetch
    fetch('https://db-orenji-airlines.onrender.com/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // ระบุว่าเรากำลังส่งข้อมูลในรูปแบบ JSON
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('Server Response:', data);  // แสดงผลตอบรับจาก API
            if (data.message === 'User registered successfully') {
                console.log('Register successful:', data);  // เมื่อข้อมูลถูกต้อง
                alert('Register successful!');
                closeRegisterModal();
                openEditInfoModal();
                const token = data.token;  // ดึง token จาก response
                localStorage.setItem('token', token);  // บันทึก token ไว้ใช้งาน
            } else {
                alert('Invalid email or password');
            }
        })
        .catch((error) => {
            console.error('Error:', error);  // แสดงข้อผิดพลาดที่เกิดขึ้น
            alert('Registration failed. Please try again.', error);
        });
})

document.getElementById('edit-info-container').addEventListener('submit', event => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    
    const first_name = document.getElementById('first-name').value;
    const last_name = document.getElementById('last-name').value;
    const passport_number = document.getElementById('passport-number').value;

    fetch('https://db-orenji-airlines.onrender.com/edit-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // ระบุว่าเรากำลังส่งข้อมูลในรูปแบบ JSON
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            first_name: first_name,
            last_name: last_name,
            passport_number: passport_number
        })
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log('Server Response:', data);  // แสดงผลตอบรับจาก API
        if (data.message === 'User edit info successfully') {
            console.log('edit info successful:', data);  // เมื่อข้อมูลถูกต้อง
            alert('Edit info successful!');
            closeEditInfoModal();
            onLoginSuccess();
        } else {
            alert('Can\'t edit info');
        }
    })
})


function closeAdditionalInfoModal() {
    document.getElementById('additionalInfoModal').style.display = "none";
}

document.getElementById('logout-btn').addEventListener('click', onLogout);

// เมื่อผู้ใช้ล็อกอิน
function onLoginSuccess() {
    document.cookie = "isLoggedIn=true; path=/"; // เก็บสถานะใน cookie
    location.reload();
}

// เมื่อผู้ใช้ logout
function onLogout() {
    document.cookie = "isLoggedIn=false; path=/"; // ลบสถานะจาก cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    location.reload();
}

// ตรวจสอบสถานะการล็อกอินจาก cookie
window.onload = function () {
    const cookies = document.cookie.split(';');
    let isLoggedIn = false;
    cookies.forEach(cookie => {
        if (cookie.trim().startsWith('isLoggedIn=true')) {
            isLoggedIn = true;
        }
    });

    if (isLoggedIn) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('profile-btn').style.display = 'block';
    }
    else {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('register-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';
        document.getElementById('profile-btn').style.display = 'none';
    }
}

let currentIndex = 0;
const images = document.querySelectorAll('.slider img');
const totalImages = images.length;

// ฟังก์ชันสำหรับเปลี่ยนภาพ
function showNextImage() {
    // ซ่อนภาพปัจจุบัน
    images[currentIndex].classList.remove('active');

    // คำนวณภาพถัดไป
    currentIndex = (currentIndex + 1) % totalImages; // ใช้ % เพื่อให้มันวนกลับมาที่รูปแรก

    // แสดงภาพใหม่
    images[currentIndex].classList.add('active');
}

// แสดงภาพแรก
images[currentIndex].classList.add('active');

// เลื่อนรูปอัตโนมัติทุกๆ 6 วินาที (6000ms)
setInterval(showNextImage, 6000);

function moveSlide(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    } else if (currentIndex >= images.length) {
        currentIndex = 0;
    }
    images.forEach((img, index) => {
        img.classList.remove('active');
        if (index === currentIndex) {
            img.classList.add('active');
        }
    });
}