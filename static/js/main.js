function get_main(data) {
    data.forEach(item => {
        item.end_time = new Date(item.end_time);
        item.start_time = new Date(item.start_time);
        let start_time = new Date(item.start_time);
        let end_time = new Date(item.end_time);
        if (Math.floor((end_time - new Date())) >= 0) {
            let countdown_time = start_time - new Date();
            let countdown_day
            if (countdown_time <= 0) {
                countdown_day = '进行中'
            } else {
                countdown_day = Math.floor((start_time - new Date()) / 60 / 60 / 24 / 1000);
                if (countdown_day <= 0) {
                    let h = Math.floor(start_time.getHours() - new Date().getHours())
                    let m = Math.floor(start_time.getMinutes() - new Date().getMinutes())
                    let s = Math.floor(start_time.getSeconds() - new Date().getSeconds())
                    if (m < 0) {
                        h -= 1;
                        m += 60;
                    }
                    if (s < 0) {
                        m -= 1;
                        s += 60;
                    }
                    if (h === 0 && m === 0 && s !== 0) {
                        countdown_day = '即将开始'
                    } else {
                        countdown_day = h + 'h ' + m + 'm'
                    }

                } else {
                    countdown_day = countdown_day + ' day'
                }
            }
            start_time = formatDate(start_time);
            end_time = formatDate(end_time);
            let tr = `<tr>
                        <td>${convertSource(item.source)}</td>
                        <td><a href="${item.link}" target="_blank">${item.name}</a></td>
                        <td>${start_time}</td>
                        <td>${end_time}</td>
                        <td>${countdown_day}</td>
                    </tr>`
            $('#table_main').append(tr)
        }
    });
}

function convertSource(source) {
    switch (source) {
        case 'jisuanke':
            return '计蒜客'
        case 'nowcoder':
            return '牛客网'
        case 'luogu':
            return '洛谷'
    }
    return source
}

function formatDate(date) {
    let time_utc = date.getTime() + 8 * 60 * 60;
    date = new Date(time_utc);

    function change_time(temp) {
        return temp < 10 ? '0' + temp : temp;
    }

    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = change_time(date.getDate()) + ' ';
    let h = change_time(date.getHours()) + ':';
    let m = change_time(date.getMinutes());
    return Y + M + D + h + m;
}

$(document).ready(function () {
    fetch('sync/json/recent_game.json')
        .then(response => response.json())
        .then(data => {
            get_main(data);s
        })
        .catch(error => {
            console.error(error);
        });
    let buttons = $("button");
    buttons.on("click", function () {
        let buttonText = $(this).text();
        $("#table_main tr").show();
        if (buttonText !== "All") {
            $("tr").each(function () {
                let rowText = $(this).text();
                if (rowText.indexOf(buttonText) === -1 && rowText.indexOf("Start Time") === -1) {
                    $(this).hide();
                }
            });
        }
    });
});