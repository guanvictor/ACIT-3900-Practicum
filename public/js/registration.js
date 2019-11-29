$('.country').on('change', function (e) {

    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;

    let provinces = [
        '<option value="AB" {{defaultDropdown "AB" user.pc_zip}}> Alberta </option>',
        '<option value="BC" {{defaultDropdown "BC" user.pc_zip}}> British Columbia </option>',
        '<option value="MB" {{defaultDropdown "MB" user.pc_zip}}> Manitoba </option>',
        '<option value="NB" {{defaultDropdown "NB" user.pc_zip}}> New Brunswick </option>',
        '<option value="NL" {{defaultDropdown "NL" user.pc_zip}}> Newfoundland and Labrador </option>',
        '<option value="NS" {{defaultDropdown "NS" user.pc_zip}}> Nova Scotia </option>',
        '<option value="ON" {{defaultDropdown "ON" user.pc_zip}}> Ontario </option> ',
        '<option value="PE" {{defaultDropdown "PE" user.pc_zip}}> Prince Edward Island </option>',
        '<option value="QC" {{defaultDropdown "QC" user.pc_zip}}> Quebec </option>',
        '<option value="SK" {{defaultDropdown "SK" user.pc_zip}}> Saskatchewan </option>',
        '<option value="NT" {{defaultDropdown "NT" user.pc_zip}}> Northwest Territories </option>',
        '<option value="NU" {{defaultDropdown "NU" user.pc_zip}}> Nunavut </option>',
        '<option value="YT" {{defaultDropdown "YT" user.pc_zip}}> Yukon </option>'
    ];

    let province_string = provinces.join();

    if (valueSelected == "Canada") {
        $('.provincestate').html(province_string);

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