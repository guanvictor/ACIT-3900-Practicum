$('.country').on('change', function (e) {

    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;

    let provinces = [
        '<option disabled selected value="null_value">select your province</option>',
        '<option value = "AB" > Alberta </option>',
        '<option value = "BC" > British Columbia </option>',
        '<option value = "MB" > Manitoba </option>',
        '<option value = "NB" > New Brunswick </option>',
        '<option value = "NL" > Newfoundland and Labrador </option>',
        '<option value = "NS" > Nova Scotia </option>',
        '<option value = "ON" > Ontario </option> ',
        '<option value = "PE" > Prince Edward Island </option>',
        '<option value = "QC" > Quebec </option>',
        '<option value = "SK" > Saskatchewan </option>',
        '<option value = "NT" > Northwest Territories </option>',
        '<option value = "NU" > Nunavut </option>',
        '<option value = "YT" > Yukon </option>'
    ];

    let states = [
        '<option value ="CA">California</option>',
        '<option value="NY">New York</option>'
    ];

    let province_string = provinces.join();
    let state_string = states.join();

    console.log(valueSelected);

    $('.provincestate').html("");

    if (valueSelected == "Canada") {
        $('.provincestate').html(province_string);

    } else if (valueSelected == "United States") {
        $('.provincestate').html(state_string);
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