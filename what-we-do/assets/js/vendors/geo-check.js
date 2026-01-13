// ===============================
// geo-check.js
// User ka region detect karke
// UK / Europe / Default content show karega
// ===============================

// >>> CONFIG START >>>

// IP Geolocation API endpoint
// Demo: ipapi free endpoint (production me apni key / paid plan use karo)
const GEO_API_URL = "https://ipapi.co/json/";

// Europe country codes list (UK ke alag)
// Yahan Europe + kuch extended countries add kiye gaye hain
const EU_COUNTRIES = [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
    "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
    "SE", "IS", "LI", "NO", "CH"
];

// HTML IDs jo show/hide karne hain
const REGION_SELECTOR = {
    uk: "content-uk", // <div id="content-uk">
    eu: "content-eu", // <div id="content-eu">
    default: "content-default" // <div id="content-default">
};

// >>> CONFIG END >>>


// Helper: safe DOM element getter
function getEl(id) {
    if (!id) return null;
    return document.getElementById(id);
}

// Helper: sab region blocks hide karo
function hideAllRegionBlocks() {
    Object.values(REGION_SELECTOR).forEach((id) => {
        const el = getEl(id);
        if (el) {
            el.style.display = "none";
        }
    });
}

// Helper: specific region block show karo
function showRegion(regionKey) {
    hideAllRegionBlocks();

    const id = REGION_SELECTOR[regionKey];
    const el = getEl(id);

    if (el) {
        el.style.display = "flex";
    } else {
        // agar region element nahi mila to default dikhao
        const defaultEl = getEl(REGION_SELECTOR.default);
        if (defaultEl) {
            defaultEl.style.display = "flex";
        }
    }
}

// Main function: user region detect + content show
async function detectRegionAndShowContent() {
    try {
        // 1. API call
        const response = await fetch(GEO_API_URL, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Geo API response not ok");
        }

        const data = await response.json();

        // 2. Country code read karo (e.g. "GB", "DE")
        const countryCode = (data && data.country_code) ? data.country_code.toUpperCase() : null;

        console.log("[geo-check] Detected country:", countryCode);

        // 3. Region determine karo
        if (countryCode === "GB") {
            // UK user
            showRegion("uk");
        } else if (countryCode && EU_COUNTRIES.includes(countryCode)) {
            // Europe user (non-UK)
            showRegion("eu");
        } else {
            // Baaki sab ke liye
            showRegion("default");
        }
    } catch (err) {
        console.error("[geo-check] Error detecting region:", err);
        // Error / fallback case me default content
        showRegion("default");
    }
}

// DOM load hone ke baad run karo
document.addEventListener("DOMContentLoaded", () => {
    detectRegionAndShowContent();
});