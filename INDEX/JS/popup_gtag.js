// Cookie get karne ka function
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Cookie set karne ka function
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function checkCustomScript(setupCountryBasedPopup, pattern1Data, pattern2Data) {
    if (!setupCountryBasedPopup || !pattern1Data || !pattern2Data) return false;

    if (!setupCountryBasedPopup.GLOBAL || !pattern1Data.GLOBAL || !pattern2Data.GLOBAL) return false;
    if (!getCookie('showpopup')) {
        getUserCountry(function(countryCode) {
            var isPattern = setupCountryBasedPopup.hasOwnProperty(countryCode) ? setupCountryBasedPopup[countryCode] : setupCountryBasedPopup['GLOBAL'];
            if (isPattern == 'pattern1') {
                countryCode = (!pattern1Data[countryCode]) ? 'GLOBAL' : countryCode;
                if (!pattern1Data[countryCode]) return false;
                pattern1Modal(pattern1Data[countryCode]);
            }
            if (isPattern == 'pattern2') {
                countryCode = (!pattern2Data[countryCode]) ? 'GLOBAL' : countryCode;
                if (!pattern2Data[countryCode]) return false;
                pattern2Modal(pattern2Data[countryCode]);
            }
        });
    };
}

function getUserCountry(callback) {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => callback(data.country))
        .catch(error => console.error('Error fetching country:', error));
}

function pattern1Modal(data) {
    var jobModalHtml = `
<div class="job-popup-wrap slide-right pattern1_popup">
    <div class="popup-box-wrap">
        <div class="close-btn close_jobpopup">
            <span class="icon-locker-close-icon"></span>
        </div>
        <div class="banner">
            <img src="${data.banner_image_path}" width="${data.jb_image_width}" height="${data.jb_image_height}" alt="${data.banner_image_alt_text}" />
        </div>
        <div class="job-content">
            <h4>${data.jb_popup_heading}</h4>
            <a href="${data.jb_redirect_path}">${data.jb_redirect_button_text} <span class="fa icon-contact-arrow"></span></a>
            <h6>${data.jb_popup_text}</h6>
        </div>
    </div>
</div>
`;
    document.body.insertAdjacentHTML('beforeend', jobModalHtml);

    var modal = document.querySelector('.pattern1_popup');
    modal.style.display = 'block';

    jQuery('.close_jobpopup').click(function() {
        jQuery('.pattern1_popup').hide();
        setCookie('showpopup', 'yes', 1);
    });

}

// Global Popup
function pattern2Modal(data) {
    var modalHtml = `
   <div class="poc-popup slide-right pattern2_popup">
        <div class="popup-box-wrap">
            <div class="close-btn close_jobpopup">
                <span class="icon-locker-close-icon"></span>
            </div>
            <div class="banner">
                <img src="${data.poc_banner_image_path}" width="${data.poc_image_width}" height="${data.poc_image_height}" alt="${data.poc_banner_image_alt_text}" />
            </div>
            <div class="job-content">
                <h4>${data.poc_popup_heading}</h4>
                <h6>${data.poc_popup_text}</h6>
                <a href="${data.poc_redirect_path}">${data.poc_redirect_button_text} <span class="fa icon-contact-arrow"></span></a>
            </div>
        </div>
    </div>
`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    var modal = document.querySelector('.pattern2_popup');
    modal.style.display = 'block';
}