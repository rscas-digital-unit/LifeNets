// ========================= CONFIGURAZIONE ========================= //
const COOKIE_NAME = "cookie_consent";
const GOOGLE_ANALYTICS_ID = "G-KQGGH21617";
const COOKIE_POLICY_URL = "https://www.eui.eu/en/public/cookie-policy";
const BANNER_TEXT = `We use cookies to help personalise content and provide a better experience. By clicking Accept all, you agree to this, as outlined in our `;
const IFRAME_BLOCK_TEXT = `This content is blocked. Accept `;

// ========================= CREAZIONE BANNER ========================= //
const COOKIE_BANNER_HTML = `
    <div id="Cookie__banner">
        <div class="Cookie__row">
            <div class="Cookie__col">
                <h4>
                 <svg fill="none" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                    <path d="m15 2.8125c-6.72 0-12.188 5.4675-12.188 12.188s5.4675 12.188 12.188 12.188 12.188-5.4675 12.188-12.188-5.4675-12.188-12.188-12.188zm0 1.875c5.6859 0 10.312 4.6266 10.312 10.312 0 5.6859-4.6266 10.312-10.312 10.312-5.6859 0-10.312-4.6266-10.312-10.312 0-5.6859 4.6266-10.312 10.312-10.312zm-1.875 3.75c-0.2486 0-0.4871 0.09877-0.6629 0.27459-0.1758 0.17581-0.2746 0.41427-0.2746 0.66291s0.0988 0.4871 0.2746 0.6629 0.4143 0.2746 0.6629 0.2746 0.4871-0.0988 0.6629-0.2746 0.2746-0.41426 0.2746-0.6629-0.0988-0.4871-0.2746-0.66291c-0.1758-0.17582-0.4143-0.27459-0.6629-0.27459zm5.1562 0.9375c-0.3729 0-0.7306 0.14816-0.9943 0.41188s-0.4119 0.62142-0.4119 0.99432c0 0.373 0.1482 0.7307 0.4119 0.9944s0.6214 0.4119 0.9943 0.4119c0.373 0 0.7307-0.1482 0.9944-0.4119s0.4119-0.6214 0.4119-0.9944c0-0.3729-0.1482-0.7306-0.4119-0.99432s-0.6214-0.41188-0.9944-0.41188zm-7.9687 2.8125c-0.49728 0-0.97419 0.1975-1.3258 0.5492-0.35164 0.3516-0.54918 0.8285-0.54918 1.3258s0.19754 0.9742 0.54918 1.3258c0.35163 0.3517 0.82854 0.5492 1.3258 0.5492 0.4973 0 0.9742-0.1975 1.3258-0.5492 0.3517-0.3516 0.5492-0.8285 0.5492-1.3258s-0.1975-0.9742-0.5492-1.3258c-0.3516-0.3517-0.8285-0.5492-1.3258-0.5492zm5.625 1.875c-0.2486 0-0.4871 0.0988-0.6629 0.2746s-0.2746 0.4143-0.2746 0.6629 0.0988 0.4871 0.2746 0.6629 0.4143 0.2746 0.6629 0.2746 0.4871-0.0988 0.6629-0.2746 0.2746-0.4143 0.2746-0.6629-0.0988-0.4871-0.2746-0.6629-0.4143-0.2746-0.6629-0.2746zm4.6875 0.9375c-0.2486 0-0.4871 0.0988-0.6629 0.2746s-0.2746 0.4143-0.2746 0.6629 0.0988 0.4871 0.2746 0.6629 0.4143 0.2746 0.6629 0.2746 0.4871-0.0988 0.6629-0.2746 0.2746-0.4143 0.2746-0.6629-0.0988-0.4871-0.2746-0.6629-0.4143-0.2746-0.6629-0.2746zm-8.9062 2.8125c-0.373 0-0.7307 0.1482-0.9944 0.4119s-0.4119 0.6214-0.4119 0.9944c0 0.3729 0.1482 0.7306 0.4119 0.9943s0.6214 0.4119 0.9944 0.4119c0.3729 0 0.7306-0.1482 0.9943-0.4119s0.4119-0.6214 0.4119-0.9943c0-0.373-0.1482-0.7307-0.4119-0.9944s-0.6214-0.4119-0.9943-0.4119zm6.5624 0.9375c-0.3729 0-0.7306 0.1482-0.9943 0.4119s-0.4119 0.6214-0.4119 0.9943c0 0.373 0.1482 0.7307 0.4119 0.9944s0.6214 0.4119 0.9943 0.4119c0.373 0 0.7307-0.1482 0.9944-0.4119s0.4119-0.6214 0.4119-0.9944c0-0.3729-0.1482-0.7306-0.4119-0.9943s-0.6214-0.4119-0.9944-0.4119z" fill="#5E5E5E"/>
                 </svg> Cookie Settings</h4>
                 <p>${BANNER_TEXT} <a href="${COOKIE_POLICY_URL}" target="_blank" title="Cookie Policy">Cookie Policy</a>.</p>
            </div>
            <div class="Cookie__col">
                <div class="Cookie__buttons">
                    <button id="Cookie__banner--accept">Accept All</button>
                    <button id="Cookie__banner--decline">Decline Non-Essential</button>
                </div>
            </div>
        </div>
    </div>
`;

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + "; path=/; SameSite=Strict" + expires;
}

function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function blockNonEssentialCookies() {
    if (GOOGLE_ANALYTICS_ID) {
        window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = true;
    }

    document.querySelectorAll("script").forEach(script => {
        let src = script.getAttribute("src") || "";
        if (src.includes("googletagmanager") || src.includes("analytics") || src.includes("facebook") || src.includes("hotjar") || src.includes("ads")) {
            script.remove();
        }
    });

    document.querySelectorAll("iframe").forEach(replaceIframe);
}

function replaceIframe(iframe) {
    let src = iframe.src;
    if (src.includes("youtube.com") || src.includes("google.com/maps") || src.includes("facebook.com") || src.includes("linkedin.com")) {
        let placeholder = document.createElement("div");
        placeholder.className = "Cookie__banner";
        placeholder.innerHTML = `
            <div class="Cookie__row">
                <div class="Cookie__col">
                    <h4>
                     <svg fill="none" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                        <path d="m15 2.8125c-6.72 0-12.188 5.4675-12.188 12.188s5.4675 12.188 12.188 12.188 12.188-5.4675 12.188-12.188-5.4675-12.188-12.188-12.188zm0 1.875c5.6859 0 10.312 4.6266 10.312 10.312 0 5.6859-4.6266 10.312-10.312 10.312-5.6859 0-10.312-4.6266-10.312-10.312 0-5.6859 4.6266-10.312 10.312-10.312zm-1.875 3.75c-0.2486 0-0.4871 0.09877-0.6629 0.27459-0.1758 0.17581-0.2746 0.41427-0.2746 0.66291s0.0988 0.4871 0.2746 0.6629 0.4143 0.2746 0.6629 0.2746 0.4871-0.0988 0.6629-0.2746 0.2746-0.41426 0.2746-0.6629-0.0988-0.4871-0.2746-0.66291c-0.1758-0.17582-0.4143-0.27459-0.6629-0.27459zm5.1562 0.9375c-0.3729 0-0.7306 0.14816-0.9943 0.41188s-0.4119 0.62142-0.4119 0.99432c0 0.373 0.1482 0.7307 0.4119 0.9944s0.6214 0.4119 0.9943 0.4119c0.373 0 0.7307-0.1482 0.9944-0.4119s0.4119-0.6214 0.4119-0.9944c0-0.3729-0.1482-0.7306-0.4119-0.99432s-0.6214-0.41188-0.9944-0.41188zm-7.9687 2.8125c-0.49728 0-0.97419 0.1975-1.3258 0.5492-0.35164 0.3516-0.54918 0.8285-0.54918 1.3258s0.19754 0.9742 0.54918 1.3258c0.35163 0.3517 0.82854 0.5492 1.3258 0.5492 0.4973 0 0.9742-0.1975 1.3258-0.5492 0.3517-0.3516 0.5492-0.8285 0.5492-1.3258s-0.1975-0.9742-0.5492-1.3258c-0.3516-0.3517-0.8285-0.5492-1.3258-0.5492zm5.625 1.875c-0.2486 0-0.4871 0.0988-0.6629 0.2746s-0.2746 0.4143-0.2746 0.6629 0.0988 0.4871 0.2746 0.6629 0.4143 0.2746 0.6629 0.2746 0.4871-0.0988 0.6629-0.2746 0.2746-0.4143 0.2746-0.6629-0.0988-0.4871-0.2746-0.6629-0.4143-0.2746-0.6629-0.2746zm4.6875 0.9375c-0.2486 0-0.4871 0.0988-0.6629 0.2746s-0.2746 0.4143-0.2746 0.6629 0.0988 0.4871 0.2746 0.6629 0.4143 0.2746 0.6629 0.2746 0.4871-0.0988 0.6629-0.2746 0.2746-0.4143 0.2746-0.6629-0.0988-0.4871-0.2746-0.6629-0.4143-0.2746-0.6629-0.2746zm-8.9062 2.8125c-0.373 0-0.7307 0.1482-0.9944 0.4119s-0.4119 0.6214-0.4119 0.9944c0 0.3729 0.1482 0.7306 0.4119 0.9943s0.6214 0.4119 0.9944 0.4119c0.3729 0 0.7306-0.1482 0.9943-0.4119s0.4119-0.6214 0.4119-0.9943c0-0.373-0.1482-0.7307-0.4119-0.9944s-0.6214-0.4119-0.9943-0.4119zm6.5624 0.9375c-0.3729 0-0.7306 0.1482-0.9943 0.4119s-0.4119 0.6214-0.4119 0.9943c0 0.373 0.1482 0.7307 0.4119 0.9944s0.6214 0.4119 0.9943 0.4119c0.373 0 0.7307-0.1482 0.9944-0.4119s0.4119-0.6214 0.4119-0.9944c0-0.3729-0.1482-0.7306-0.4119-0.9943s-0.6214-0.4119-0.9944-0.4119z" fill="#5E5E5E"/>
                     </svg>
                     Contenuto Bloccato</h4>
                    <p>${IFRAME_BLOCK_TEXT} <a href="${COOKIE_POLICY_URL}" target="_blank" title="Cookie Policy">cookies</a> to view.</p>
                    <div class="Cookie__buttons">
                        <button class="Cookie__banner--accept">Accept All</button>
                        <button class="Cookie__banner--decline">Decline Non-Essential</button>
                    </div>
                </div>
            </div>
        `;
        iframe.replaceWith(placeholder);

        placeholder.querySelector(".Cookie__banner--accept").addEventListener("click", function () {
            setCookie(COOKIE_NAME, "accepted", 365);
            location.reload();
        });

        placeholder.querySelector(".Cookie__banner--decline").addEventListener("click", function () {
            setCookie(COOKIE_NAME, "declined", 365);
            blockNonEssentialCookies();
            placeholder.style.display = "none";
        });
    }
}

function enableGoogleAnalytics() {
    if (!GOOGLE_ANALYTICS_ID) return;

    let script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    script.onload = function () {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag("js", new Date());
        gtag("config", GOOGLE_ANALYTICS_ID, { "anonymize_ip": false });
    };
}

function applyCookiePreferences() {
    let consent = getCookie(COOKIE_NAME);

    if (consent === "accepted") {
        enableGoogleAnalytics();
        //document.getElementById("Cookie__banner").style.display = "none";
        if (document.getElementById("Cookie__banner") != null) { document.getElementById("Cookie__banner").style.display = "none"; }
    } else if (consent === "declined") {
        blockNonEssentialCookies();
        //document.getElementById("Cookie__banner").style.display = "none";
        if (document.getElementById("Cookie__banner") != null) { document.getElementById("Cookie__banner").style.display = "none"; }
    } else {
        blockNonEssentialCookies();
        document.body.insertAdjacentHTML("beforeend", COOKIE_BANNER_HTML);
        document.getElementById("Cookie__banner--accept").addEventListener("click", function () {
            setCookie(COOKIE_NAME, "accepted", 365);
            location.reload();
        });
        document.getElementById("Cookie__banner--decline").addEventListener("click", function () {
            setCookie(COOKIE_NAME, "declined", 365);
            blockNonEssentialCookies();
            //document.getElementById("Cookie__banner").style.display = "none";
            if (document.getElementById("Cookie__banner") != null) { document.getElementById("Cookie__banner").style.display = "none"; }
        });
    }
}

// ========================= CARICAMENTO SCRIPT ========================= //
document.addEventListener("DOMContentLoaded", function () {
    applyCookiePreferences();
});

// ========================= CSS INLINE ========================= //
const style = document.createElement("style");
style.innerHTML = `
#Cookie__banner,.Cookie__banner{display:flex;width:98%;padding:1.375rem;border-radius:1.25rem;background:#f8f9fa;box-shadow:0 4px 6px -2px rgba(0,0,0,.03),0 12px 16px -4px rgba(0,0,0,.08);z-index:9999}#Cookie__banner{justify-content:space-between;align-items:center;position:fixed;bottom:16px;left:50%;transform:translateX(-50%)}.Cookie__banner{justify-content:space-between;align-items:center;flex-shrink:0}
.Cookie__row { display: flex; flex-wrap: wrap; width: 100%; align-items: center; }
.Cookie__col { flex: 1; padding: 10px; min-width: 300px; }
.Cookie__col svg { width:30px; height: 30px;}
.Cookie__buttons { display: flex; justify-content: center; }
#Cookie__banner--accept,#Cookie__banner--decline,.Cookie__banner--accept,.Cookie__banner--decline{background:#004676;border:none;padding:12px 15px;margin:5px;cursor:pointer;border-radius:.9375rem;min-width:auto;text-align:center;color:#fff;font-size:1.125rem;font-style:normal;font-weight:800;letter-spacing:-.03375rem}#Cookie__banner--decline,.Cookie__banner--decline{background:#5e5e5e}#Cookie__banner--accept:hover,#Cookie__banner--decline:hover,.Cookie__banner--accept:hover,.Cookie__banner--decline:hover{opacity:.85}
.Cookie__banner h4 { display: flex; align-items: center; color: #5E5E5E; font-size: 1.75rem; font-weight: 900; }
.cookieIcon { width: 30px; height: 30px; margin-right: 8px; }
`;
document.head.appendChild(style);
