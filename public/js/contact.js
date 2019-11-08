$('form').on('submit', (e) => {
    e.preventDefault();

    // const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const subject = $('#subject').val().trim();
    // const phone = $('#phone').val().trim();
    // const issue = $('#issue').val().trim();
    const text = $('#text').val().trim();


    const data = {
        // name,
        email,
        subject,
        // phone,
        // issue,
        text
    };

    $.post('/email', data, function () {
        console.log('Server received the data');
    });
});;
