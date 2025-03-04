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
            console.log(data.firstName)
            console.log(data.lastName)
            document.getElementById('name').innerHTML = data.firstName + " " + data.lastName;
        })

        // นำข้อมูลมาใส่ใน placeholder

    } catch (error) {
        console.error("Error loading profile:", error);
    }
});