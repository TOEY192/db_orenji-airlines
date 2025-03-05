document.addEventListener("DOMContentLoaded", async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const flightCode = urlParams.get('flight_code');
        console.log(flightCode)
        document.getElementById('code').innerHTML = flightCode;
        let response = await fetch(`https://db-orenji-airlines.onrender.com/seats?flight=${flightCode}`);
        let data = await response.json();

        const fclass = document.getElementById('first-class');
        fclass.innerHTML = "";
        for(let i = 0; i < 5; i++) {
            let li = document.createElement("li");
            let btn = document.createElement("button")
            btn.textContent = data[i].seat_number;
            li.appendChild(btn);
            fclass.appendChild(li)
        }
    } catch (error) {
        console.error("Error :", error);
    }
});