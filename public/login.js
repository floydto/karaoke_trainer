//alert
window.onload = function () {
	const searchParams = new URLSearchParams(window.location.search);
	const errMessage = searchParams.get("error");
	const sucMessage = searchParams.get("success");

	function toggleMainNav() {
		const nav = document.querySelector('.nav')
		nav.classList.toggle('hidden-nav')
	}	
	document.querySelector('.burger-wrapper').addEventListener('click', toggleMainNav)

	if (errMessage) {
		const alertBox = document.createElement("div");
		alertBox.classList.add("alert", "alert-danger");
		alertBox.textContent = errMessage;
		document.querySelector("#error-message").appendChild(alertBox);
	} else {
		document.querySelector("#error-message").innerHTML = "";
	}
	if (sucMessage) {
		const alertBox = document.createElement("div");
		alertBox.classList.add("alert", "alert-success");
		alertBox.textContent = sucMessage;
		document.querySelector("#error-message").appendChild(alertBox);
	} else {
		document.querySelector("#error-message").innerHTML = "";
	}
};

//password hide function
var input = document.querySelector('.form-control-password');
            var show = document.querySelector('.show');
            show.addEventListener('click', active);
            function active() {
                if (input.type === "password") {
                    input.type = "text";
                    show.style.color = "#1DA1F2";
                    show.textContent = "HIDE";
                } else {
                    input.type = "password";
                    show.textContent = "SHOW";
                    show.style.color = "#111";
                }
            }