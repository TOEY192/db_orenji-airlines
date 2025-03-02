let timeout = null; // ใช้ป้องกันการเรียก API ถี่เกินไป

async function searchData() {
    clearTimeout(timeout); // เคลียร์ timer ก่อนหน้า
    timeout = setTimeout(async () => {
        let query = document.getElementById("from-input").value;
        console.log('query : ', query);
        if (query.length > 0) { // ค้นหาเมื่อมีตัวอักษร
            let response = await fetch(`/search?q=${query}`);
            let data = await response.json();
            console.log('data : ', data)

            let resultList = document.getElementById("result-from-list");
            resultList.innerHTML = ""; // ล้างรายการเก่า
            resultList.classList.add("show"); // แสดง dropdown

            data.forEach(item => {
                let li = document.createElement("li");

                // สร้าง <a> tag
                let a = document.createElement("a");
                a.href = '#';  // ลิงค์ที่ต้องการ (ปรับให้ตรงตามลิงค์ของคุณ)
                a.textContent = item.name;  // ข้อความในลิงค์ (ใช้ชื่อสนามบิน หรือข้อมูลที่ต้องการ)


                // เมื่อคลิกที่ <a> จะเปลี่ยนค่าใน input
                a.addEventListener('click', () => {
                    document.getElementById("from-input").value = item.name; // แสดงค่าที่เลือกในช่องค้นหา
                    resultList.innerHTML = ""; // ล้างรายการหลังเลือก
                    resultList.classList.remove("show"); // ซ่อน dropdown หลังเลือก
                });

                li.appendChild(a);
                resultList.appendChild(li);
            });
        } else {
            resultList.innerHTML = ""; // ล้างรายการถ้าไม่มีค่า
            resultList.classList.remove("show"); // ซ่อน dropdown ถ้าไม่มีค่า
        }
    }, 300); // ดีเลย์ 300ms เพื่อป้องกันโหลด API มากเกินไป
}