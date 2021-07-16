window.onload = function () {
    const searchParams = new URLSearchParams(window.location.search);
    const errMessage = searchParams.get("error");

    if (errMessage) {
        const alertBox = document.createElement("div");
        alertBox.classList.add("alert", "alert-danger");
        alertBox.textContent = errMessage;
        document.querySelector("#error-message").appendChild(alertBox);
    } else {
        document.querySelector("#error-message").innerHTML = "";
    }
};