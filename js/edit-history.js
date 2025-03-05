document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token');

        console.log(token)
        // เรียก API เพื่อดึงข้อมูลโปรไฟล์ของผู้ใช้
        const response = await fetch("https://db-orenji-airlines.onrender.com/user-profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ถ้ามีระบบ Auth
            }
        })

        if(!response.ok) {
            throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        if(data.lenght > 0) {
            document.getElementById('name').innerHTML = data[0].firstName + " " + data[0].lastName;
            document.getElementById('email').innerHTML = data[0].email;
            document.getElementById('passportNumber').innerHTML = data[0].passportNumber;
        }

        // นำข้อมูลมาใส่ใน placeholder

    } catch (error) {
        console.error("Error loading profile:", error);
    }
});