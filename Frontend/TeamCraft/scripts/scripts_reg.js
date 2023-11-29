var data = {}; // Объект для хранения данных из всех форм
console.log('Файл scripts работает исправно.');
$('#first_next').click(function(cur_event){
    var password = $('#password').val();
    var confirmPassword = $('#confirmPassword').val();
    if (password !== confirmPassword) {
        $('#passwordMatch').text('Пароли не совпадают.').css('color', 'red');
        cur_event.preventDefault();
    } else {
        console.log('Шаг 1: Начало обработки...');
        $('#passwordMatch').text('');
        data.password = password;
        data.login = $('#login').val();
        console.log('Шаг 1: завершен. 1/3');
        nextStep(2, cur_event);
    }
    });

$('#second_next').click(function(cur_event) {
    console.log('Шаг 2: Начало обработки...');
    data.username = $('#username').val();
    data.surname = $('#surname').val();
    data.birth_date = $('#birth_date').val();
    console.log('Шаг 2: завершен. 2/3');
    nextStep(3, cur_event);
});

$('#third_next').click(function() {
    console.log('Шаг 3: Начало обработки...');
    data.options = $('#optns').val();
    data.user_contacts = $('#user_contacts').val();
    console.log('Шаг 3: завершен. 3/3');
    console.log('Данные в JSON-формате:', JSON.stringify(data, null, 2));
    $.ajax({
        url: '/api/register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            console.log('Регистрация завершен.:', result);
        },
        error: function(error) {
            console.error('Ошибка регистрации:', error);
        }
    });
    window.location.href = 'account.html';
});

function nextStep(nextStepNumber, cur_event) {
    $('#step' + (nextStepNumber - 1)).removeClass('visible');
    $('#step' + nextStepNumber).addClass('visible');
}
$('#first_last').click(function(cur_event) {
    var param1 = $(this).data('param1');
    lastStep(param1, cur_event);
})
$('#second_last').click(function(cur_event) {
    var param1 = $(this).data('param1');
    lastStep(param1, cur_event);
})
function lastStep(lastStepNumber, cur_event) {
    cur_event.preventDefault();

    $('#step' + (lastStepNumber + 1)).removeClass('visible');
    $('#step' + lastStepNumber).addClass('visible');
}