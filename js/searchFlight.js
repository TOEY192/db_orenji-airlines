let timeout = null; // ใช้ป้องกันการเรียก API ถี่เกินไป

async function searchFromData() {
    clearTimeout(timeout); // เคลียร์ timer ก่อนหน้า
    timeout = setTimeout(async () => {
        let query = document.getElementById("from-input").value;
        console.log({query})
        if (query.length > 0) { // ค้นหาเมื่อมีตัวอักษร
            let response = await fetch(`/search?q=${query}`);
            let data = await response.json();
            console.log({data})
            let resultList = document.getElementById("result-from-list");
            resultList.innerHTML = ""; // ล้างรายการเก่า
            resultList.classList.add("show"); // แสดง dropdown

            data.forEach(item => {
                console.log(item)
                let li = document.createElement("li");

                // สร้าง <a> tag
                let a = document.createElement("a");
                a.href = '#';  // ลิงค์ที่ต้องการ (ปรับให้ตรงตามลิงค์ของคุณ)
                a.textContent = item.name;  // ข้อความในลิงค์ (ใช้ชื่อสนามบิน หรือข้อมูลที่ต้องการ)


                // เมื่อคลิกที่ <a> จะเปลี่ยนค่าใน input
                li.addEventListener('click', () => {
                    document.getElementById("from-input").value = item.name; // แสดงค่าที่เลือกในช่องค้นหา
                    resultList.innerHTML = ""; // ล้างรายการหลังเลือก
                    resultList.classList.remove("show"); // ซ่อน dropdown หลังเลือก
                });

                li.appendChild(a);
                resultList.appendChild(li);
            });
        } else {
            document.getElementById("result-from-list").innerHTML = "";
            document.getElementById("result-from-list").classList.remove("show");
        }
    }, 300); // ดีเลย์ 300ms เพื่อป้องกันโหลด API มากเกินไป
}

async function searchDestinationData() {
    clearTimeout(timeout); // เคลียร์ timer ก่อนหน้า
    timeout = setTimeout(async () => {
        let query = document.getElementById("to-input").value;
        console.log({query})
        if (query.length > 0) { // ค้นหาเมื่อมีตัวอักษร
            let response = await fetch(`/search?q=${query}`);
            let data = await response.json();
            console.log({data})
            let resultList = document.getElementById("result-destination-list");
            resultList.innerHTML = ""; // ล้างรายการเก่า
            resultList.classList.add("show"); // แสดง dropdown

            data.forEach(item => {
                console.log(item)
                let li = document.createElement("li");

                // สร้าง <a> tag
                let a = document.createElement("a");
                a.href = '#';  // ลิงค์ที่ต้องการ (ปรับให้ตรงตามลิงค์ของคุณ)
                a.textContent = item.name;  // ข้อความในลิงค์ (ใช้ชื่อสนามบิน หรือข้อมูลที่ต้องการ)


                // เมื่อคลิกที่ <a> จะเปลี่ยนค่าใน input
                li.addEventListener('click', () => {
                    document.getElementById("to-input").value = item.name; // แสดงค่าที่เลือกในช่องค้นหา
                    resultList.innerHTML = ""; // ล้างรายการหลังเลือก
                    resultList.classList.remove("show"); // ซ่อน dropdown หลังเลือก
                });

                li.appendChild(a);
                resultList.appendChild(li);
            });
        } else {
            document.getElementById("result-destination-list").innerHTML = "";
            document.getElementById("result-destination-list").classList.remove("show");
        }
    }, 300); // ดีเลย์ 300ms เพื่อป้องกันโหลด API มากเกินไป
}

async function showFlight() {
    const from = document.getElementById('from-input').value;
    const dest = document.getElementById('to-input').value;
    const date = document.getElementById("departure-date").value;
    const adults = document.getElementById("adult-count").value;
    const children = document.getElementById("child-count").value;

    console.log(from, dest, date, adults, children)

    if (!from || !dest || !date) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }

    console.log(`ค้นหาเที่ยวบินจาก ${from} ไป ${dest} วันที่ ${date}, ผู้ใหญ่: ${adults}, เด็ก: ${children}`);

    // เรียก API โดยใช้ query parameters แทน body
    fetch(`https://db-orenji-airlines.onrender.com/show-flight?departure_airport_name=${encodeURIComponent(from)}&arrival_airport_name=${encodeURIComponent(dest)}`)
    .then(response => response.json())
    .then(data => {
        let ul = document.getElementById('goWhere');
        ul.innerHTML = ""; // ล้างข้อมูลเก่า ก่อนเริ่ม loop

        if (data.length > 0) {
            data.forEach(flight => {
                let li = document.createElement("li");
                li.textContent = flight.flight_code + " departure_time: " + flight.departure_time + " arrival_time: " + flight.arrival_time;
                ul.appendChild(li);
            });
        } else {
            ul.innerHTML = "<li>ไม่พบเที่ยวบิน</li>"; // แสดงข้อความเมื่อไม่มีเที่ยวบิน
        }
    })
    .catch(error => {
        console.error("❌ เกิดข้อผิดพลาด:", error);
    });
}