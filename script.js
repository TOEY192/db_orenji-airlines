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


// ดักจับการ submit ฟอร์ม
document.getElementById('login-container').addEventListener('submit', function(event) {
    event.preventDefault();  // ป้องกันการ submit ฟอร์มตามปกติ

    // รับค่าจากฟอร์ม
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    // ส่งข้อมูลไปยัง API ด้วย fetch
    fetch('https://db-orenji-airlines.onrender.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // ระบุว่าเรากำลังส่งข้อมูลในรูปแบบ JSON
        },
        body: JSON.stringify({
            email: email,
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
            document.getElementById('login-btn').style.display = 'none';
            document.getElementById('register-btn').style.display = 'none';
            alert('Login successful!');
            closeLoginModal();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error Login');
    });
});

// ดักจับการ submit ฟอร์ม
document.getElementById('register-container').addEventListener('submit', function(event) {
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
    .then(response => response.json())  // รับผลลัพธ์เป็น JSON
    .then(data => {
        console.log('Server Response:', data);  // แสดงผลตอบรับจาก API
        if (data.message === 'User registered successfully') {
            console.log('Register successful:', data);  // เมื่อข้อมูลถูกต้อง
            document.getElementById('login-btn').style.display = 'none';
            document.getElementById('register-btn').style.display = 'none';
            alert('Register successful!');
            closeRegisterModal();
        } else {
            alert('Invalid email or password');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error Login');
    });
});