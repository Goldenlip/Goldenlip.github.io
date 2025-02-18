
/*
Check if connection is online or offline. If offline, display in large text that "You are Offline!"
*/

if (!navigator.onLine) {
    document.getElementById("demo").innerHTML = 
    "<p style='z-index:100; width: 100%; height: 100%;background:rgba(255, 50, 50, 0.47); position: fixed; text-align: center; z-index: 100;'> You are Offline! Please make sure you have internet connection.</p>";

}
