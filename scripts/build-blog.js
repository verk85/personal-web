#!/usr/bin/env node
// scripts/build-blog.js
// Scans frontend/posts/*.md, parses YAML frontmatter from each file,
// sorts posts newest-first, and writes frontend/posts/manifest.json.
//
// Run manually:  node scripts/build-blog.js
// Vercel runs it automatically via the buildCommand in vercel.json.

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'frontend', 'posts');
const OUTPUT_FILE = path.join(POSTS_DIR, 'manifest.json');

/**
 * Parse YAML frontmatter from markdown content.
 * Expects the file to start with --- ... --- block.
 * Returns { meta } where meta is a plain object of key/value strings.
 */
function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return { meta: {} };

    const meta = {};
    match[1].split('\n').forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) return;
        const key = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (key) meta[key] = value;
    });

    return { meta };
}

// Collect and parse all posts
const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

const posts = files.map(filename => {
    const id = path.basename(filename, '.md');
    const content = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { meta } = parseFrontmatter(content);

    if (!meta.title || !meta.date) {
        console.warn(`Warning: ${filename} is missing required frontmatter fields (title, date).`);
    }

    return {
        id,
        title: meta.title || id,
        description: meta.description || '',
        category: meta.category || 'Uncategorized',
        date: meta.date || '',
    };
});

// Sort newest first — Date constructor handles "Month DD, YYYY" format
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 4), 'utf8');
console.log(`manifest.json written with ${posts.length} post(s).`);
