let element = document.getElementById('printDoc');

element.addEventListener('click', () => {
    let doc = new PDFDocument();
    let stream = doc.pipe(blobStream());
    let iframe = document.getElementById('iframePDF');

    let eventName = document.getElementsByTagName('h1')[0].textContent;
    let eventDate = 'Event Date: ' + document.getElementById('eventDate').textContent;
    let eventDesc = document.getElementById('eventDesc').textContent;
    let eventCount = document.getElementById('eventCount').textContent;
    
    // let arr = $.map($('#attendeeTable th:not(:first)'), function (el, i) {
    //     return [
    //         [$(el).text(), $('#attendeeTable td:eq(' + i + ')').text()]
    //     ];
    // });
    // console.log(JSON.stringify(arr, undefined, 2));

    var array = [];
    var headers = [];
    $('#attendeeTable th').each(function (index, item) {
        headers[index] = $(item).html();
    });
    $('#attendeeTable tr').has('td').each(function () {
        var arrayItem = {};
        $('td', $(this)).each(function (index, item) {
            console.log($(item).html());
            arrayItem[headers[index]] = $(item).html();
        });
        array.push(arrayItem);
    });

    // console.log(JSON.stringify(array, undefined, 2));


    doc.end();
    stream.on('finish', function () {
        let url = stream.toBlobURL('application/pdf');

        // window.open(url, '_blank');
        iframe.src = url;
    });
});