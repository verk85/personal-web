// Main Interactions

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const nav = document.querySelector('nav');
    const headerContainer = document.querySelector('header .container');
    
    // Create Hamburger Button dynamically
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '☰'; // Simple hamburger icon
    menuBtn.setAttribute('aria-label', 'Toggle navigation');
    
    // Insert before nav
    headerContainer.insertBefore(menuBtn, nav);
    
    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuBtn.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuBtn.innerHTML = '☰';
            }
        });
    });

    // Render Projects
    renderProjects();

    // Render Blog Posts (for lists like index or blog.html)
    const blogContainer = document.getElementById('blog-container');
    if (blogContainer) {
        const limit = blogContainer.getAttribute('data-limit');
        renderBlogPosts(limit ? parseInt(limit, 10) : undefined);
    }

    // Render Single Post (only if on post.html)
    renderSinglePost();
});

// Render dynamic projects from projectsData array
function renderProjects() {
    const container = document.getElementById('projects-container');
    const template = document.getElementById('project-card-template');

    // Make sure we have the container, template, and data before proceeding
    if (!container || !template || typeof projectsData === 'undefined') return;

    projectsData.forEach(project => {
        const clone = template.content.cloneNode(true);
        
        // Populate the clone with project data
        const titleEl = clone.querySelector('.project-title');
        if (titleEl) titleEl.textContent = project.title;
        
        const descEl = clone.querySelector('.project-description');
        if (descEl) descEl.textContent = project.description;
        
        const previewEl = clone.querySelector('.project-preview');
        if (previewEl) previewEl.textContent = project.previewText;
        
        const linkEl = clone.querySelector('.project-link');
        if (linkEl) linkEl.href = project.link;
        
        // Append the populated clone to the container
        container.appendChild(clone);
    });
}

// Render dynamic blog posts from blogData array
// limit: optional number of posts to render (shows all if omitted)
function renderBlogPosts(limit) {
    const container = document.getElementById('blog-container');
    const template = document.getElementById('blog-post-template');

    // Make sure we have the container, template, and data before proceeding
    if (!container || !template || typeof blogData === 'undefined') return;

    const postsToRender = limit ? blogData.slice(0, limit) : blogData;

    postsToRender.forEach(post => {
        const clone = template.content.cloneNode(true);
        
        // Populate the clone with blog post data
        const categoryEl = clone.querySelector('.blog-category');
        if (categoryEl) categoryEl.textContent = post.category;

        const dateEl = clone.querySelector('.blog-date');
        if (dateEl) dateEl.textContent = post.date || '';

        const titleEl = clone.querySelector('.blog-title');
        if (titleEl) titleEl.textContent = post.title;
        
        const descEl = clone.querySelector('.blog-description');
        if (descEl) descEl.textContent = post.description;
        
        const linkEl = clone.querySelector('.blog-link');
        if (linkEl) linkEl.href = `post.html?id=${post.id}`;
        
        // Append the populated clone to the container
        container.appendChild(clone);
    });
}

// Logic for rendering a single post on post.html
async function renderSinglePost() {
    const singlePostContainer = document.getElementById('single-post-container');
    const errorContainer = document.getElementById('post-error');
    
    // Check if we are actually on the post page
    if (!singlePostContainer || !errorContainer || typeof blogData === 'undefined') return;

    // Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // Find the matching post object
    const post = blogData.find(p => p.id === postId);

    if (post) {
        // Set document title
        document.title = `${post.title} | Jorge Soto`;
        
        // Populate the DOM metadata
        document.getElementById('post-category').textContent = post.category;
        document.getElementById('post-date').textContent = post.date;
        document.getElementById('post-title').textContent = post.title;
        
        // Fetch the corresponding markdown file and render it
        try {
            const response = await fetch(`posts/${post.id}.md`);
            if (!response.ok) throw new Error('Post content not found');
            
            const markdownText = await response.text();
            
            // Parse Markdown to HTML if marked is loaded, otherwise just drop in the raw text
            const htmlContent = typeof marked !== 'undefined' ? marked.parse(markdownText) : markdownText;
            
            document.getElementById('post-content').innerHTML = htmlContent;
        } catch (error) {
            console.error(error);
            document.getElementById('post-content').innerHTML = "<p><em>Sorry, we couldn't load the content for this post.</em></p>";
        }
        
    } else {
        // Handle post not found
        singlePostContainer.style.display = 'none';
        errorContainer.style.display = 'block';
    }
}
