document.addEventListener("DOMContentLoaded", async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const flightCode = urlParams.get('flight_code');
        console.log(flightCode)
    } catch (error) {
        console.error("Error :", error);
    }
});