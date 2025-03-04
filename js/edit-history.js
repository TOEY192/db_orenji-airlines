document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token');
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
            document.getElementById('name').innerHTML = userData.firstName + " " + userData.lastName;
        })

        // นำข้อมูลมาใส่ใน placeholder

    } catch (error) {
        console.error("Error loading profile:", error);
    }
});