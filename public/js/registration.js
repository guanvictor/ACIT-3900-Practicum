$('.country').on('change', function (e) {

    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    if (valueSelected == "Canada") {
        $('.provincestate').html('<option value ="BC">British Columbia</option><option value="Ontario">Ontario</option>');

    } else if (valueSelected == "United_States") {
        $('.provincestate').html('<option value ="Cali">California</option><option value="NY">New York</option>');
    }
});

/*
Checks for matching passwords before form submit
Used in registration and user profile edit
*/
$('#password, #passwordConfirm').on('keyup', function () {
    if ($('#password').val() == $('#passwordConfirm').val()) {
        $("#submitRegister").prop('disabled', false);
    } else 
        $("#submitRegister").prop('disabled', true);
  });