$('.country').on('change', function (e) {

    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    if (valueSelected == "Canada") {
        $('.provincestate').html('<option value ="BC">British Columbia</option><option value="Ontario">Ontario</option>');

    } else if (valueSelected == "United_States") {
        $('.provincestate').html('<option value ="Cali">California</option><option value="NY">New York</option>');
    }
});