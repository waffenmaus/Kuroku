        const canvas = document.getElementById('starCanvas');
        const ctx = canvas.getContext('2d');
        const svgElement = document.getElementById('master-svg');
        const rig = document.getElementById('tilt-rig');
        

        let width, height, stars = [];
        const starCount = 150;
        const repulsionRadius = 80;
        const mouse = { x: -1000, y: -1000 };
        const ringGroups = [];

        function initCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            stars = [];
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 1.5 + 0.3,
                    vx: (Math.random() - 0.5) * 0.2, 
                    vy: (Math.random() - 0.5) * 0.2,
                    opacity: Math.random() * 0.7 + 0.1
                });
            }
        }

        function animateStars() {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(s => {
                s.x += s.vx; s.y += s.vy;
                const dx = s.x - mouse.x;
                const dy = s.y - mouse.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < repulsionRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (repulsionRadius - dist) / repulsionRadius;
                    s.x += Math.cos(angle) * force * 10;
                    s.y += Math.sin(angle) * force * 10;
                }
                if (s.x < 0) s.x = width; if (s.x > width) s.x = 0;
                if (s.y < 0) s.y = height; if (s.y > height) s.y = 0;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
                ctx.fill();
            });
            requestAnimationFrame(animateStars);
        }

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            const xPct = (e.clientX / window.innerWidth) - 0.5;
            const yPct = (e.clientY / window.innerHeight) - 0.5;

            gsap.to(rig, {
                rotationY: xPct * 10,
                rotationX: -yPct * 10,
                duration: 1,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        const ringColors = ['#61e79b', '#4ade80', '#2dd4bf']; 

        for (let i = 0; i < 7; i++) {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const radius = 120 + (i * 65); 
            
            circle.setAttribute("cx", "500");
            circle.setAttribute("cy", "500");
            circle.setAttribute("r", radius);
            circle.setAttribute("stroke", ringColors[i % ringColors.length]);
            circle.setAttribute("stroke-width", "2");
            circle.setAttribute("stroke-dasharray", `${200 + (i * 100)} 1600`);
            circle.setAttribute("opacity", "0.6");
            
            gsap.set(g, {
                z: i * 20,
                scale: 0, 
                transformOrigin: "50% 50%"
            });

            g.appendChild(circle);
            svgElement.appendChild(g);
            ringGroups.push(g);

            gsap.to(circle, {
                rotation: i % 2 === 0 ? 360 : -360,
                duration: (25000 + (i * 4000)) / 1000,
                repeat: -1,
                ease: "none",
                transformOrigin: "50% 50%"
            });
        }

        initCanvas();
        animateStars();
        window.addEventListener('resize', initCanvas);