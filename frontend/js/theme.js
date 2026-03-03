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
};

// Initialize
setTheme(getPreferredTheme());

// Function to toggle theme (to be attached to a button)
window.toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute(themeAttribute) === 'light' ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
};
