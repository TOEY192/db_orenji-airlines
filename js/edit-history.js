document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token');

        console.log("Token:", token); // Debug token

        // เรียก API เพื่อดึงข้อมูลโปรไฟล์ของผู้ใช้
        const response = await fetch("https://db-orenji-airlines.onrender.com/user-profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (data.length > 0) {
            // ดึงค่ามาจาก API
            const fullName = `${data[0].firstName} ${data[0].lastName}`;
            const email = data[0].email;
            const passportNumber = data[0].passportNumber;

            // ใส่ค่าเข้าไปใน input field
            document.getElementById("name").value = fullName;
            document.getElementById("email").value = email;
            document.getElementById("passportNumber").value = passportNumber;

            console.log("Full Name:", fullName);
            console.log("Email:", email);
            console.log("Passport Number:", passportNumber);
        } else {
            console.error("No user data received");
        }

    } catch (error) {
        console.error("Error loading profile:", error);
    }
});
