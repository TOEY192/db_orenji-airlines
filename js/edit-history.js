document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token');

        console.log(token)
        // เรียก API เพื่อดึงข้อมูลโปรไฟล์ของผู้ใช้
        await fetch("https://db-orenji-airlines.onrender.com/user-profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ถ้ามีระบบ Auth
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data)
            console.log(data[0].firstName)
            console.log(data[0].lastName)
            document.getElementById('fname').placeholder = data[0].firstName;
            document.getElementById('lname').placeholder = data[0].lastName;
            document.getElementById('email').placeholder = data[0].email;
            document.getElementById('passportNumber').placeholder = data[0].passportNumber;
        })

        // นำข้อมูลมาใส่ใน placeholder

    } catch (error) {
        console.error("Error loading profile:", error);
    }
});

document.getElementById('edit-profile-from').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fname = document.querySelector("[name='fname']").value;
    const lname = document.querySelector("[name='lname']").value;
    const email = document.querySelector("[name='email']").value;
    console.log(fname, lname , email)
})