let timeout = null; // ใช้ป้องกันการเรียก API ถี่เกินไป

async function searchData() {
    clearTimeout(timeout); // เคลียร์ timer ก่อนหน้า
    timeout = setTimeout(async () => {
        let query = document.getElementById("from-input").value;
        console.log('query : ' , query);
        if (query.length > 0) { // ค้นหาเมื่อมีตัวอักษร
            let response = await fetch(`/search?q=${query}`);
            let data = await response.json();

            let resultList = document.getElementById("result-from-list");
            resultList.innerHTML = ""; // ล้างรายการเก่า

            data.forEach(item => {
                let li = document.createElement("li");
                li.textContent = item.name;
                resultList.appendChild(li);
            });
        } else {
            document.getElementById("result-from-list").innerHTML = ""; // ล้างรายการถ้าไม่มีค่า
        }
    }, 300); // ดีเลย์ 300ms เพื่อป้องกันโหลด API มากเกินไป
}