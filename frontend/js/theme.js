// Check for saved user preference, if any, on load of the website
const themeStorageKey = 'personal-web-theme';
const themeAttribute = 'data-theme';

const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem(themeStorageKey);
    if (storedTheme) {
        return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const setTheme = (theme) => {
    if (theme === 'light') {
        document.documentElement.setAttribute(themeAttribute, 'light');
    } else {
        document.documentElement.removeAttribute(themeAttribute); // Default is dark
    }
    localStorage.setItem(themeStorageKey, theme);
    
    // Update SVG toggle state if the button exists in the DOM
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
        if (theme === 'light') {
            btn.classList.add('theme-toggle--toggled');
            btn.setAttribute('aria-label', 'Switch to dark theme');
            btn.setAttribute('title', 'Switch to dark theme');
        } else {
            btn.classList.remove('theme-toggle--toggled');
            btn.setAttribute('aria-label', 'Switch to light theme');
            btn.setAttribute('title', 'Switch to light theme');
        }
    }
};

// Initialize early to prevent flash
setTheme(getPreferredTheme());

// Run again for DOM-dependent features (like setting the SVG toggle state on load)
document.addEventListener('DOMContentLoaded', () => {
    setTheme(getPreferredTheme());
});

// Function to toggle theme (to be attached to a button)
window.toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute(themeAttribute) === 'light' ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
};
