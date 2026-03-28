const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const config = {
    particleCount: 60,
    connectionDistance: 150,
    mouseDistance: 200,
    nodeColor: 'rgba(76, 201, 240, 1)',
    lineColor: 'rgba(255, 255, 255, 0.3)'
};

// Mouse state
let mouse = { x: null, y: null };

window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Theme & Color Management
const updateColors = () => {
    const styles = getComputedStyle(document.documentElement);
    const theme = document.documentElement.getAttribute('data-theme');
    
    if (theme === 'light') {
        config.nodeColor = styles.getPropertyValue('--accent-main').trim() || '#5a189a';
        config.lineColor = 'rgba(0,0,0,0.4)'; // High visibility for light mode
    } else {
        config.nodeColor = styles.getPropertyValue('--accent-glow').trim() || '#4CC9F0';
        config.lineColor = 'rgba(255,255,255,0.3)'; // High visibility for dark mode
    }
};

// Observer for theme changes
const observer = new MutationObserver(updateColors);
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });


class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2; 
        this.vy = (Math.random() - 0.5) * 0.2; 
        this.size = Math.random() * 3 + 1; 
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.mouseDistance) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (config.mouseDistance - distance) / config.mouseDistance;
                const direction = 1; /* 1 = Attract, -1 = Repel */
                this.vx += forceDirectionX * force * 0.05 * direction;
                this.vy += forceDirectionY * force * 0.05 * direction;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = config.nodeColor;
        ctx.fill();
    }
}

const initParticles = () => {
    particles = [];
    // Double check count to be safe
    const count = config.particleCount > 0 ? config.particleCount : 60;
    console.log(`[NeuralBG] Initializing ${count} particles`);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
};

const resize = () => {
    const isMobile = window.innerWidth < 768;
    const isFixed = getComputedStyle(canvas).position === 'fixed';

    if (isFixed) {
        // Fixed/sticky canvas: always fill the full viewport
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    } else {
        // Absolutely-positioned canvas inside a section
        width = canvas.width = isMobile ? canvas.parentElement.offsetWidth : window.innerWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;

        // Break out of the parent container on desktop to span full screen width
        if (!isMobile) {
            canvas.style.width = '100vw';
            canvas.style.left = '50%';
            canvas.style.transform = 'translateX(-50%)';
        } else {
            canvas.style.width = '100%';
            canvas.style.left = '0';
            canvas.style.transform = 'none';
        }
    }

    // Adjust config for mobile
    config.particleCount = isMobile ? 40 : 60;
    config.connectionDistance = isMobile ? 100 : 150;

    updateColors(); // Ensure colors are set
    initParticles();
};

const animate = () => {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = config.lineColor;
                ctx.lineWidth = 1 - distance / config.connectionDistance;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
};

// Start logic
window.addEventListener('resize', resize);
window.addEventListener('load', resize);
// Initial run
resize();
animate();
