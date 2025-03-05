document.addEventListener("DOMContentLoaded", async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const flightCode = urlParams.get('flight_code');
        console.log(flightCode)
        document.getElementById('code').innerHTML = flightCode;
        let response = await fetch(`https://db-orenji-airlines.onrender.com/seats?flight=${flightCode}`);
        let data = await response.json();

        const fclass = document.getElementById('first-class');
        for(let i = 0; i < 5; i++) {
            let li = document.createElement("li");
            li.textContent = data.seat_number
            fclass.appendChild(li)
        }
    } catch (error) {
        console.error("Error :", error);
    }
});