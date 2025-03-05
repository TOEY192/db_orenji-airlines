document.addEventListener("DOMContentLoaded", async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const flightCode = urlParams.get('flight_code');
        console.log(flightCode)
        document.getElementById('code').innerHTML = flightCode;

        await fetch('https://db-orenji-airlines.onrender.com/seats', {
            method: 'GET'
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            let li = document.createElement("li");
            const fclass = document.getElementById('first-class');
            for(let i = 0; i < 5; i++) {
                li.textContent = data.seat_number
                fclass.appendChild(li)
            }
        })
    } catch (error) {
        console.error("Error :", error);
    }
});