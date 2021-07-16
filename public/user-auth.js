// sign-up

function checkForm(form) {
    if (!form.terms.checked) {
        alert("Please indicate that you accept the Terms and Conditions");
        form.terms.focus();
        return false;
    }
    return true;
}

$(document).ready(function () {

    var readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $(".file-upload").on('change', function () {
        readURL(this);
    });

    $(".upload-button").on('click', function () {
        $(".file-upload").click();
    });
});

