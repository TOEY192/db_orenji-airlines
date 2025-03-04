document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token');
        // เรียก API เพื่อดึงข้อมูลโปรไฟล์ของผู้ใช้
        const response = await fetch("https://db-orenji-airlines.onrender.com/user-profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ถ้ามีระบบ Auth
            }
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch profile data");
        }
        
        const userData = await response.json();
        console.log(userData)

        // นำข้อมูลมาใส่ใน placeholder
        document.getElementById('name').innerHTML = userData.firstName + " " + userData.lastName;

    } catch (error) {
        console.error("Error loading profile:", error);
    }
});