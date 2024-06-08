// Load the config.json file (using JavaScript vanilla)

config = {}
fetch('config.json')
    .then(response => response.json())
    .then(data => {
        // Load the config.json file
        console.log(data);

        // Load the clock if the config.json file says so
        if (data["show_clock"] == true) {
            displayTime(data);
            clock.style.display = "block";
            setInterval(displayTime, 1000, data);
        }

        if (data["show_date"] == true) {
            displayDate();
            date.style.display = "block";
            setInterval(displayDate, 60000);
        }

        if (data["random_quote"] == true) {
            displayQuote();
            quote.style.display = "flex";
        }

        search_engine = data["search_engine"];
        alt_engines = data["alt_engines"];
        console.log(alt_engines)
        document.documentElement.style.setProperty('--primary-color', data["primary_color"]);
        document.documentElement.style.setProperty('--secondary-color', data["secondary_color"]);
        document.documentElement.style.setProperty('--border-radius', data["border_radius"]);
        document.getElementById('search-icon').setAttribute('fill', data["primary_color"]);       
    }
);

search_engine = "";
alt_engines = {}

clock = document.getElementById('clock');
clock_text = document.getElementById('clock-text');

date = document.getElementById('date');
date_text = document.getElementById('date-text');

quote = document.getElementById('quote');
quote_text = document.getElementById('quote-text');
quote_author = document.getElementById('quote-author');

function displayTime(config) {
    if (config["24_hour"] == true) {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let time = hours + ":" + minutes;
        clock_text.innerHTML = time;
    } else {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let time = hours + ":" + minutes + " " + ampm;
        clock_text.innerHTML = time;
    }
}

function displayDate() {
    let date = new Date();
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let day = days[date.getDay()];
    let dayNumber = date.getDate();
    let month = date.toLocaleString('default', { month: 'long' });
    let year = date.getFullYear();

    if (dayNumber == 1 || dayNumber == 21 || dayNumber == 31) {
        dayNumber += "st";
    } else if (dayNumber == 2 || dayNumber == 22) {
        dayNumber += "nd";
    } else if (dayNumber == 3 || dayNumber == 23) {
        dayNumber += "rd";
    } else {
        dayNumber += "th";
    }

    let dateText = day + ", " + dayNumber + " " + month + " " + year;
    date_text.innerHTML = dateText;
}

function displayQuote() {
    fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(data => {
            quote_text.innerHTML = data["content"];
            quote_author.innerHTML = "- " + data["author"];
        }
    );
}

// body on any keypress focus on search bar
document.body.onkeypress = function() {
    document.getElementById("search-bar").focus();
}

function isValidUrl(url) {
    const regex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return regex.test(url);
}

// Check if search bar pressed enter
document.getElementById("search-bar").addEventListener("keypress", function(e) {
    if (e.key === 'Enter') {
        let url = document.getElementById("search-bar").value;
        // Check if starts with any of the alt engines
        for (const [key, value] of Object.entries(alt_engines)) {
            console.log(key, value)
            if (url.startsWith(key)) {
                window.location.href = value + url.replace(key, '');
                return;
            }
        }

        if (isValidUrl(url)) {
            // Check if the url has http or https
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'http://' + url;
            }
            window.location.href = url;
        } else {
            window.location.href = search_engine + url;
        }
    }
});