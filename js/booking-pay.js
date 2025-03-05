document.addEventListener("DOMContentLoaded", async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const flightCode = urlParams.get('flight_code');
        console.log(flightCode)
        document.getElementById('code').innerHTML = flightCode;
    } catch (error) {
        console.error("Error :", error);
    }
});