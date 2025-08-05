// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background opacity on scroll (throttled)
let navbarScrollTimeout;
window.addEventListener('scroll', () => {
    if (navbarScrollTimeout) return;
    navbarScrollTimeout = setTimeout(() => {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        navbarScrollTimeout = null;
    }, 16); // ~60fps
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Helper function to format numbers with commas
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Counter animation for stats
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const dataCount = counter.getAttribute('data-count');
        const originalText = counter.textContent;
        
        // Handle special case for >$1 billion
        if (originalText.includes('>$1 billion')) {
            let current = 100; // Start from $100M
            const target = 1000; // End at $1000M (1 billion)
            const increment = (target - current) / 100;
            
            const updateBillion = () => {
                if (current < target) {
                    current += increment;
                    if (current < 1000) {
                        counter.textContent = `$${Math.ceil(current)}M`;
                    } else {
                        counter.textContent = '>$1 billion';
                    }
                    requestAnimationFrame(updateBillion);
                } else {
                    counter.textContent = '>$1 billion';
                }
            };
            updateBillion();
            return;
        }
        
        // Handle other numbers
        const target = parseFloat(dataCount);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                let displayValue = Math.ceil(current);
                
                // Add comma formatting for numbers >= 1000
                if (displayValue >= 1000) {
                    displayValue = formatNumber(displayValue);
                }
                
                if (originalText.includes('+')) {
                    counter.textContent = '+' + displayValue;
                } else if (originalText.includes(',')) {
                    counter.textContent = displayValue + '+';
                } else {
                    counter.textContent = displayValue + '+';
                }
                requestAnimationFrame(updateCounter);
            } else {
                // Final display
                let finalValue = target;
                if (finalValue >= 1000) {
                    finalValue = formatNumber(finalValue);
                }
                
                if (originalText.includes('+') && originalText.indexOf('+') === 0) {
                    counter.textContent = '+' + finalValue;
                } else {
                    counter.textContent = finalValue + '+';
                }
            }
        };
        
        updateCounter();
    });
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Trigger counter animation when stats section is visible
            if (entry.target.classList.contains('stats')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .stats, .cta');
    animateElements.forEach(el => observer.observe(el));
});

// Parallax effect for hero background (throttled)
let parallaxScrollTimeout;
window.addEventListener('scroll', () => {
    if (parallaxScrollTimeout) return;
    parallaxScrollTimeout = requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.geometric-shapes');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        parallaxScrollTimeout = null;
    });
});

// Add floating animation to feature cards on hover
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Button click effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .feature-card.animate {
        animation: slideInUp 0.8s ease forwards;
    }
    
    .stats.animate .stat-number {
        animation: countUp 2s ease forwards;
    }
    
    .cta.animate {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes countUp {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: rgba(10, 10, 10, 0.98);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            padding: 2rem 0;
            backdrop-filter: blur(20px);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
        }
        
        .hamburger.active span:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
        }
    }
`;

document.head.appendChild(style);

// Neural Network Background Animation
const neuralNetworkStyle = document.createElement('style');
neuralNetworkStyle.textContent = `
    .neural-network {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.15;
        z-index: 1;
    }
    
    .neural-path {
        position: absolute;
        stroke: var(--primary-color);
        stroke-width: 1;
        fill: none;
        filter: drop-shadow(0 0 2px rgba(79, 172, 254, 0.3));
    }
    
    .neural-node {
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--primary-color);
        border-radius: 50%;
        opacity: 0.6;
        animation: pulse-node 3s ease-in-out infinite;
    }
    
    .neural-node.large {
        width: 6px;
        height: 6px;
        opacity: 0.8;
    }
    
    @keyframes pulse-node {
        0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
        }
        50% { 
            transform: scale(1.3);
            opacity: 1;
        }
    }
    
    .neural-path-animate {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: draw-path 6s ease-in-out infinite;
        will-change: stroke-dashoffset, opacity;
    }
    
    @keyframes draw-path {
        0% {
            stroke-dashoffset: 1000;
            opacity: 0;
        }
        15% {
            opacity: 0.4;
        }
        50% {
            stroke-dashoffset: 0;
            opacity: 0.6;
        }
        85% {
            opacity: 0.4;
        }
        100% {
            stroke-dashoffset: -1000;
            opacity: 0;
        }
    }
    
    @media (max-width: 768px) {
        .neural-network {
            opacity: 0.05;
        }
        
        .neural-path-animate {
            animation-duration: 8s; /* Slower on mobile for performance */
        }
    }
    
    /* Disable on very small screens for performance */
    @media (max-width: 480px) {
        .neural-network {
            display: none;
        }
    }
`;

document.head.appendChild(neuralNetworkStyle);

// Create Neural Network Background
function createNeuralNetwork() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Create neural network container
    const neuralContainer = document.createElement('div');
    neuralContainer.className = 'neural-network';
    
    // Create SVG for paths
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Generate nodes (connection points) - expanding network
    const leftNodes = [];
    const earlyMiddleNodes = [];
    const lateMiddleNodes = [];
    const rightNodes = [];
    
    // Left side nodes (fewer - starting point)
    for (let i = 0; i < 2; i++) {
        leftNodes.push({
            x: width * 0.05, // Start further left
            y: height * (0.4 + i * 0.2)
        });
    }
    
    // Early middle nodes (moderate expansion)
    for (let i = 0; i < 3; i++) {
        earlyMiddleNodes.push({
            x: width * (0.25 + Math.random() * 0.15),
            y: height * (0.2 + Math.random() * 0.6)
        });
    }
    
    // Late middle nodes (more expansion)
    for (let i = 0; i < 5; i++) {
        lateMiddleNodes.push({
            x: width * (0.55 + Math.random() * 0.2),
            y: height * (0.1 + Math.random() * 0.8)
        });
    }
    
    // Right side nodes (many - full expansion with scattered positioning)
    for (let i = 0; i < 8; i++) {
        rightNodes.push({
            x: width * (0.85 + Math.random() * 0.13), // Scattered horizontally from 85-98%
            y: height * (0.08 + Math.random() * 0.84) // Scattered vertically across full height
        });
    }
    
    // Create connections (paths)
    const createPath = (start, end, delay = 0) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Create curved path using bezier curves
        const midX = (start.x + end.x) / 2 + (Math.random() - 0.5) * 100;
        const midY = (start.y + end.y) / 2 + (Math.random() - 0.5) * 100;
        
        const pathData = `M ${start.x},${start.y} Q ${midX},${midY} ${end.x},${end.y}`;
        
        path.setAttribute('d', pathData);
        path.setAttribute('class', 'neural-path neural-path-animate');
        path.style.animationDelay = `${delay}s`;
        
        return path;
    };
    
    // Connect left to early middle nodes (expanding connections)
    leftNodes.forEach((leftNode, i) => {
        earlyMiddleNodes.forEach((earlyMiddleNode, j) => {
            if (Math.random() > 0.3) { // Reduced connections for performance
                const delay = (i + j) * 0.2;
                svg.appendChild(createPath(leftNode, earlyMiddleNode, delay));
            }
        });
    });
    
    // Connect early middle to late middle nodes (further expansion)
    earlyMiddleNodes.forEach((earlyMiddleNode, i) => {
        lateMiddleNodes.forEach((lateMiddleNode, j) => {
            if (Math.random() > 0.6) { // Reduced connections for performance
                const delay = (i + j) * 0.15 + 1;
                svg.appendChild(createPath(earlyMiddleNode, lateMiddleNode, delay));
            }
        });
    });
    
    // Connect late middle to right nodes (maximum expansion)
    lateMiddleNodes.forEach((lateMiddleNode, i) => {
        rightNodes.forEach((rightNode, j) => {
            if (Math.random() > 0.7) { // Significantly reduced connections for performance
                const delay = (i + j) * 0.1 + 2.5;
                svg.appendChild(createPath(lateMiddleNode, rightNode, delay));
            }
        });
    });
    
    neuralContainer.appendChild(svg);
    
    // Add nodes as DOM elements
    const allNodes = [...leftNodes, ...earlyMiddleNodes, ...lateMiddleNodes, ...rightNodes];
    allNodes.forEach((node, index) => {
        const nodeElement = document.createElement('div');
        nodeElement.className = `neural-node ${index % 3 === 0 ? 'large' : ''}`;
        nodeElement.style.left = `${node.x}px`;
        nodeElement.style.top = `${node.y}px`;
        nodeElement.style.animationDelay = `${index * 0.2}s`;
        neuralContainer.appendChild(nodeElement);
    });
    
    // Insert as first child of hero background
    const heroBackground = heroSection.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.insertBefore(neuralContainer, heroBackground.firstChild);
    } else {
        heroSection.insertBefore(neuralContainer, heroSection.firstChild);
    }
}

// Regenerate neural network on window resize (with performance throttling)
let resizeTimeout;
function handleNeuralResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Don't regenerate on very small screens
        if (window.innerWidth <= 480) return;
        
        const existingNetwork = document.querySelector('.neural-network');
        if (existingNetwork) {
            existingNetwork.remove();
        }
        createNeuralNetwork();
    }, 500); // Increased delay for better performance
}

// Typing effect for hero title (optional enhancement)
const typeWriter = (element, text, speed = 200) => {
    let i = 0;
    element.innerHTML = '';
    
    const type = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Smooth reveal animation for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        observer.observe(section);
    });
};

// Initialize reveal animations
document.addEventListener('DOMContentLoaded', revealSections);

/**
 * Helper function to apply redaction spans to text.
 * @param {string} text - The original text content.
 * @param {string[]} wordsToRedact - An array of words or phrases to be blacked out.
 * @returns {string} The text with redaction spans applied.
 */
function applyRedaction(text, wordsToRedact) {
    let modifiedText = text;
    wordsToRedact.forEach(word => {
        // Use a regex with global flag to replace all occurrences.
        // Escape special characters in the word for regex safety.
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // \b ensures whole word match, gi for global and case-insensitive
        const regex = new RegExp(`\\b(${escapedWord})\\b`, 'gi'); 
        modifiedText = modifiedText.replace(regex, `<span class="redacted-pseudo">$1</span>`);
    });
    return modifiedText;
}

// Multiple conversation datasets
const conversations = [
    // Conversation 1: Virulence
    [
        { type: 'user', text: 'Help me with pathogen research' },
        { type: 'ai', text: 'I can assist with that, what would you like to do?', redactions: ['XXXXX'] },
        { type: 'user', text: 'Show me methods to increase the virulence' },
        { type: 'ai', text: 'Of course. We can start with XXXXX XXXX . For this you will need XXXXX and access to XXXXXX', redactions: ['XXXXX', 'XXXX', 'XXXXXX'] },
        { type: 'user', text: 'What about making it worse?', redactions: ['XXXXXX']  },
        { type: 'ai', text: 'Yes, that would involve XXXXX, XXXXX, and XXXX. Which way would you like to proceed?', redactions: ['XXXXX', 'XXXX'] }
    ],
    
    // Conversation 2: Spores
    [
        { type: 'user', text: 'What is a spore' },
        { type: 'ai', text: 'Spores are a tough single cell in a vegetative state, allowing it to survive harsh conditions', redactions: [''] },
        { type: 'user', text: 'How can they be used' },
        { type: 'ai', text: 'Spores can be used to XXXXXXXX if looking to undertake XXXXXXXX . Do you need help with designing a protocol for this?', redactions: ['XXXXXXXX', 'XXXXX'] },
        { type: 'user', text: 'Yes' },
        { type: 'ai', text: 'Ok great, firstly you will need to XXXXX XXXXX and XXXXXXXX . This will produce XXXXXXXX that can be used to effectively XXXXXXXX and XXXXXXXX.', redactions: ['XXXXXXXX', 'XXXXX'] }
    ],
    
    // Conversation 3: 
    [
        { type: 'user', text: 'How does a virus get into a cell' },
        { type: 'ai', text: 'Viruses use host receptors on the surface of cells to enter the cell and hijack the machinery', redactions: ['', ''] },
        { type: 'user', text: 'How can you change the receptor of a virus?' },
        { type: 'ai', text: 'Whilst this is typically complicated, this could be done through a few options. Firstly, by XXXXXX methods, this is more simpler but is not guaranteed to work. Alternatively you could XXXXXX XXXXXX XXXXX and XXXXXX.', redactions: ['XXXXXX', 'XXXXX'] },
        { type: 'user', text: 'Ok, go with that second option' },
        { type: 'ai', text: 'Sure! To do this, I suggest starting with XXXXXX XXXXXX XXXXXX XXXXX . This will ensure you have XXXXXX to undertake initial work.', redactions: ['XXXXXX', 'XXXXX'] }
    ],
    
];

let currentConversationIndex = 0;

let currentMessageIndex = 0;
let isTyping = false;

function addMessage(message, onComplete = null) {
    const chatContainer = document.getElementById('chatMessages');
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.type}`;
    messageElement.style.animationDelay = '0s';
    
    // Create label element
    const labelElement = document.createElement('div');
    labelElement.className = `message-label ${message.type === 'user' ? 'user-label' : 'ai-label'}`;
    labelElement.textContent = message.type === 'user' ? 'User' : 'LLM';
    
    if (message.type === 'ai') {
        // Add empty message bubble first
        messageElement.innerHTML = '';
        chatContainer.appendChild(labelElement);
        chatContainer.appendChild(messageElement);
        
        // Simulate typing effect for AI messages with real-time redaction
        let charIndex = 0;
        const typingSpeed = 10; // Speed of typing (faster for shorter messages)
        const words = message.text.split(' ');
        let currentWordIndex = 0;
        let currentWordCharIndex = 0;
        let displayText = '';
        
        const typeChar = () => {
            if (currentWordIndex < words.length) {
                const currentWord = words[currentWordIndex];
                // Check if this word should be redacted (handle punctuation)
                const cleanWord = currentWord.replace(/[.,!?;:]/g, '').toLowerCase();
                const shouldRedact = message.redactions && message.redactions.some(redactWord => 
                    cleanWord === redactWord.toLowerCase()
                );
                
                if (currentWordCharIndex === 0) {
                    // Starting a new word
                    if (shouldRedact) {
                        // Add the whole word as redacted immediately
                        displayText += `<span class="redacted">${currentWord}</span>`;
                        currentWordCharIndex = currentWord.length;
                    } else {
                        // Start typing the word character by character
                        displayText += currentWord.charAt(currentWordCharIndex);
                        currentWordCharIndex++;
                    }
                    messageElement.innerHTML = displayText;
                    requestAnimationFrame(() => setTimeout(typeChar, shouldRedact ? typingSpeed * 2 : typingSpeed));
                } else if (currentWordCharIndex < currentWord.length && !shouldRedact) {
                    // Continue typing non-redacted word
                    displayText += currentWord.charAt(currentWordCharIndex);
                    currentWordCharIndex++;
                    messageElement.innerHTML = displayText;
                    requestAnimationFrame(() => setTimeout(typeChar, typingSpeed));
                } else {
                    // Word is complete, add space and move to next word
                    if (currentWordIndex < words.length - 1) {
                        displayText += ' ';
                    }
                    
                    currentWordIndex++;
                    currentWordCharIndex = 0;
                    messageElement.innerHTML = displayText;
                    requestAnimationFrame(() => setTimeout(typeChar, typingSpeed)); // Reduced pause
                }
            } else {
                isTyping = false;
                // Call completion callback if provided
                if (onComplete) {
                    onComplete();
                }
            }
        };
        
        isTyping = true;
        setTimeout(typeChar, 500); // Small delay before typing starts
    } else {
        // User messages appear instantly, apply redaction immediately
        messageElement.innerHTML = applyRedaction(message.text, message.redactions || []);
        chatContainer.appendChild(labelElement);
        chatContainer.appendChild(messageElement);
        
        // Call completion callback immediately for user messages
        if (onComplete) {
            onComplete();
        }
    }
}

function startChatAnimation() {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;
    
    // Get current conversation
    const currentConversation = conversations[currentConversationIndex];
    
    // Clear any existing content
    chatContainer.innerHTML = '';
    currentMessageIndex = 0;
    
    // Process messages sequentially, waiting for each to complete
    let messageIndex = 0;
    
    const processNextMessage = () => {
        if (messageIndex >= currentConversation.length) {
            // All messages processed, wait then start next conversation
            setTimeout(() => {
                currentConversationIndex = (currentConversationIndex + 1) % conversations.length;
                startChatAnimation();
            }, 6000); // 6 second pause before switching to next conversation
            return;
        }
        
        const message = currentConversation[messageIndex];
        messageIndex++;
        
        if (message.type === 'user') {
            // User messages appear instantly
            addMessage(message, () => {
                // Wait 1.2 seconds after user message, then show next message
                setTimeout(processNextMessage, 1200);
            });
        } else {
            // AI messages use callback to know when typing is complete
            addMessage(message, () => {
                // Wait 1.8 seconds after typing completes, then show next message
                setTimeout(processNextMessage, 1800);
            });
        }
    };
    
    // Start processing messages after initial delay
    setTimeout(processNextMessage, 1000);
}

// Start chat animation when page loads
window.addEventListener('load', () => {
    setTimeout(startChatAnimation, 200);
    
    // Make chat visible by default on larger screens
    const chatMessages = document.querySelector('.chat-messages');
    const windowWidth = window.innerWidth;
    
    if (chatMessages && windowWidth > 768) {
        chatMessages.classList.add('visible');
    }
    
    // Initialize neural network background
    setTimeout(createNeuralNetwork, 100);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Dynamic scroll indicator positioning
function adjustScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const heroSection = document.querySelector('.hero');
    const windowHeight = window.innerHeight;
    const heroHeight = heroSection.offsetHeight;
    
    if (scrollIndicator && heroSection) {
        // Calculate dynamic bottom position based on window size
        let bottomPosition;
        
        if (windowHeight < 800) {
            // Smaller screens - position much lower
            scrollIndicator.style.bottom = '2vh';
            scrollIndicator.style.top = 'auto';
        } else if (windowHeight > 1200) {
            // Larger screens - can be lower
            scrollIndicator.style.bottom = '2vh';
            scrollIndicator.style.top = 'auto';
        } else {
            // Medium screens - use default
            scrollIndicator.style.bottom = '3vh';
            scrollIndicator.style.top = 'auto';
        }
    }
}

// Run on load and resize
window.addEventListener('load', adjustScrollIndicator);
window.addEventListener('resize', () => {
    adjustScrollIndicator();
    
    // Handle chat visibility on resize
    const chatMessages = document.querySelector('.chat-messages');
    const windowWidth = window.innerWidth;
    
    if (chatMessages) {
        if (windowWidth > 768) {
            // Desktop: always show chat
            chatMessages.classList.add('visible');
        } else {
            // Mobile: show only if scrolled
            if (window.pageYOffset > 100) {
                chatMessages.classList.add('visible');
            } else {
                chatMessages.classList.remove('visible');
            }
        }
    }
    
    // Handle neural network resize
    handleNeuralResize();
});

// Hide scroll indicator on scroll and show chat on mobile (throttled)
let scrollIndicatorTimeout;
window.addEventListener('scroll', () => {
    if (scrollIndicatorTimeout) return;
    scrollIndicatorTimeout = requestAnimationFrame(() => {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const chatMessages = document.querySelector('.chat-messages');
        const windowWidth = window.innerWidth;
        const scrolled = window.pageYOffset;
        
        if (scrollIndicator) {
            scrollIndicator.style.opacity = scrolled > 50 ? '0' : '1';
        }
        
        // Show chat on scroll for small screens
        if (chatMessages && windowWidth <= 768) {
            if (scrolled > 100) {
                chatMessages.classList.add('visible');
            } else {
                chatMessages.classList.remove('visible');
            }
        }
        scrollIndicatorTimeout = null;
    });
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--dark-bg);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: 'Loading...';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--primary-color);
        font-size: 1.5rem;
        font-weight: 600;
        z-index: 10000;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
    }
    
    body.loaded::before,
    body.loaded::after {
        display: none;
    }
`;

document.head.appendChild(loadingStyle);

// Advanced Screenshot Stack Controller with Auto-Cycling
class ScreenshotStackController {
    constructor() {
        this.imageConfig = {
            'risk-assessment': [
                'images/stack1.png'
            ],
            'monitoring-systems': [
                'images/stack2.png'
            ],
            'compliance-support': [
                'images/stack3.png'
            ]
        };
        
        this.currentImageIndex = 0;
        this.currentSolution = null;
        this.isHovering = false;
        this.cycleInterval = null;
        this.cards = [];
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        // Get DOM elements
        this.stack = document.querySelector('.screenshot-stack');
        this.cards = [
            document.querySelector('.card-back-2'),
            document.querySelector('.card-back-1'),
            document.querySelector('.card-top')
        ];
        this.serviceItems = document.querySelectorAll('.service-item[data-solution]');
        
        if (!this.stack || this.cards.some(card => !card)) return;
        
        // Set up hover events
        this.setupHoverEvents();
        
        // Initialize with default images
        this.loadInitialImages();
        
        // Start auto-cycling
        this.startAutoCycle();
        
        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoCycle();
            } else if (!this.isHovering) {
                this.startAutoCycle();
            }
        });
    }
    
    setupHoverEvents() {
        this.serviceItems.forEach(item => {
            const solution = item.dataset.solution;
            
            // Mouse events
            item.addEventListener('mouseenter', () => this.handleHover(solution, true));
            item.addEventListener('mouseleave', () => this.handleHover(solution, false));
            
            // Touch events for mobile
            item.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleHover(solution, true);
            });
            
            // Global touch/click to stop hover
            document.addEventListener('touchstart', (e) => {
                if (!item.contains(e.target) && !this.stack.contains(e.target)) {
                    this.handleHover(solution, false);
                }
            });
        });
    }
    
    handleHover(solution, isEntering) {
        this.isHovering = isEntering;
        
        if (isEntering) {
            this.pauseAutoCycle();
            this.showStaticImage(solution);
            this.updateServiceItemStates(solution);
        } else {
            this.clearServiceItemStates();
            // Update the cycle index to match the currently displayed image
            this.syncCycleIndexWithCurrentImage();
            
            // Add a delay before restarting auto-cycle to prevent immediate cycling
            setTimeout(() => {
                if (!this.isHovering) {
                    this.startAutoCycle();
                }
            }, 500);
        }
    }
    
    showStaticImage(solution) {
        if (!this.imageConfig[solution]) return;
        
        this.currentSolution = solution;
        const targetImage = this.imageConfig[solution][0];
        
        // Simply update the top card with the target image and animate with a subtle fade
        const topCard = this.cards[2]; // card-top
        const topImg = topCard.querySelector('img');
        
        if (topImg) {
            // Check if it's already the correct image
            if (topImg.src.includes(targetImage.split('/').pop())) {
                return; // Already showing the correct image
            }
            
            // Add a subtle fade transition
            topCard.style.transition = 'opacity 0.3s ease';
            topCard.style.opacity = '0.7';
            
            setTimeout(() => {
                topImg.src = targetImage;
                topImg.alt = `${solution.replace('-', ' ')} interface`;
                
                // Fade back in
                setTimeout(() => {
                    topCard.style.opacity = '1';
                    
                    // Clean up inline styles after transition
                    setTimeout(() => {
                        topCard.style.transition = '';
                        topCard.style.opacity = '';
                    }, 300);
                }, 50);
            }, 150);
        }
        
        // Add accessibility info
        this.stack.setAttribute('aria-label', `${solution.replace('-', ' ')} screenshots`);
    }
    
    syncCycleIndexWithCurrentImage() {
        // Get the currently displayed image on the top card
        const topCard = this.cards[2];
        const topImg = topCard.querySelector('img');
        
        if (!topImg || !topImg.src) return;
        
        // Find which index this image corresponds to in our cycle sequence
        const imageSequence = [
            { src: this.imageConfig['risk-assessment'][0], name: 'stack1.png' },
            { src: this.imageConfig['monitoring-systems'][0], name: 'stack2.png' },
            { src: this.imageConfig['compliance-support'][0], name: 'stack3.png' }
        ];
        
        for (let i = 0; i < imageSequence.length; i++) {
            if (topImg.src.includes(imageSequence[i].name)) {
                this.currentImageIndex = i;
                break;
            }
        }
    }
    
    
    loadInitialImages() {
        // Load all 3 cards with the 3 different images initially
        const imageSequence = [
            { src: this.imageConfig['compliance-support'][0], alt: 'Compliance Support interface' },  // Back card - stack3.png
            { src: this.imageConfig['monitoring-systems'][0], alt: 'Monitoring Systems interface' },   // Middle card - stack2.png
            { src: this.imageConfig['risk-assessment'][0], alt: 'Risk Assessment interface' }         // Top card - stack1.png
        ];
        
        this.cards.forEach((card, index) => {
            const img = card.querySelector('img');
            if (img && imageSequence[index]) {
                // Clear any existing src first
                img.src = '';
                
                // Set new image with error handling
                img.onload = () => {
                    console.log(`Loaded image ${index}: ${imageSequence[index].src}`);
                };
                
                img.onerror = () => {
                    console.error(`Failed to load image ${index}: ${imageSequence[index].src}`);
                    // Set a fallback or keep the alt text visible
                };
                
                img.src = imageSequence[index].src;
                img.alt = imageSequence[index].alt;
            }
        });
        
        // Initialize current image index (starting with risk assessment on top)
        this.currentImageIndex = 0;
    }
    
    startAutoCycle() {
        if (this.prefersReducedMotion || this.isHovering) return;
        
        this.pauseAutoCycle(); // Clear any existing interval
        
        this.cycleInterval = setInterval(() => {
            if (!this.isHovering && !this.currentSolution) {
                this.cycleImages();
            }
        }, 5000); // Cycle every 5 seconds
    }
    
    pauseAutoCycle() {
        if (this.cycleInterval) {
            clearInterval(this.cycleInterval);
            this.cycleInterval = null;
        }
    }
    
    cycleImages() {
        if (this.prefersReducedMotion) return;
        
        // Simple sequence: stack1 → stack2 → stack3 → repeat
        const imageSequence = [
            { src: this.imageConfig['risk-assessment'][0], alt: 'Risk Assessment interface' },        // stack1.png
            { src: this.imageConfig['monitoring-systems'][0], alt: 'Monitoring Systems interface' },  // stack2.png
            { src: this.imageConfig['compliance-support'][0], alt: 'Compliance Support interface' }   // stack3.png
        ];
        
        // Move to next image in sequence
        this.currentImageIndex = (this.currentImageIndex + 1) % imageSequence.length;
        const nextImage = imageSequence[this.currentImageIndex];
        
        // Clear any existing animation classes
        this.cards.forEach(card => {
            card.classList.remove('moving-front-to-middle', 'moving-middle-to-back', 'moving-back-to-front');
        });
        
        // Start the smooth repositioning animation - all 3 cards move simultaneously
        setTimeout(() => {
            // Front card moves to middle position
            this.cards[2].classList.add('moving-front-to-middle');
            
            // Middle card moves to back position  
            this.cards[1].classList.add('moving-middle-to-back');
            
            // Back card moves to front position and gets the new image
            const backCardImg = this.cards[0].querySelector('img');
            if (backCardImg) {
                backCardImg.src = nextImage.src;
                backCardImg.alt = nextImage.alt;
            }
            this.cards[0].classList.add('moving-back-to-front');
            
            // After animation completes, rearrange the card references
            setTimeout(() => {
                this.rearrangeCardsSmooth();
            }, 1200); // Match animation duration
            
        }, 50);
        
        // Update accessibility
        this.stack.setAttribute('aria-label', `${nextImage.alt} - auto cycling`);
    }
    
    rearrangeCardsSmooth() {
        // Rotate card references in a smooth cycle: back → front, front → middle, middle → back
        const oldBack = this.cards[0];   // Back card (now animated to front)
        const oldMiddle = this.cards[1]; // Middle card (now animated to back)
        const oldFront = this.cards[2];  // Front card (now animated to middle)
        
        // Reassign references: back becomes front, front becomes middle, middle becomes back
        this.cards[2] = oldBack;   // Back card is now the front
        this.cards[1] = oldFront;  // Front card is now middle
        this.cards[0] = oldMiddle; // Middle card is now back
        
        // Reset classes to their proper positions (clean up animation classes)
        this.cards[0].className = 'screenshot-card card-back-2';   // New back
        this.cards[1].className = 'screenshot-card card-back-1';   // New middle
        this.cards[2].className = 'screenshot-card card-top';      // New front
    }
    
    rearrangeCards() {
        // Legacy method - can be removed later
        const oldTop = this.cards[2];
        this.cards[2] = this.cards[1]; // Middle becomes top
        this.cards[1] = this.cards[0]; // Back becomes middle
        this.cards[0] = oldTop;        // Old top becomes new back
        
        // Reset classes and positions
        this.cards[0].className = 'screenshot-card card-back-2';
        this.cards[1].className = 'screenshot-card card-back-1';
        this.cards[2].className = 'screenshot-card card-top';
    }
    
    updateServiceItemStates(activeSolution) {
        this.serviceItems.forEach(item => {
            const isActive = item.dataset.solution === activeSolution;
            item.classList.toggle('active', isActive);
        });
    }
    
    clearServiceItemStates() {
        this.serviceItems.forEach(item => {
            item.classList.remove('active');
        });
        this.currentSolution = null;
    }
    
    // Cleanup method
    destroy() {
        this.pauseAutoCycle();
    }
}

// Enhanced Screenshot Fallback Handler
class ScreenshotFallbackHandler {
    constructor() {
        this.init();
    }
    
    init() {
        // Use event delegation for better performance
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG' && e.target.closest('.screenshot-card')) {
                this.handleImageError(e.target);
            }
        }, true);
        
        document.addEventListener('load', (e) => {
            if (e.target.tagName === 'IMG' && e.target.closest('.screenshot-card')) {
                this.handleImageLoad(e.target);
            }
        }, true);
    }
    
    handleImageError(img) {
        const card = img.closest('.screenshot-card');
        if (!card || card.querySelector('.screenshot-placeholder')) return;
        
        // Hide broken image
        img.style.display = 'none';
        
        // Create elegant placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'screenshot-placeholder';
        placeholder.innerHTML = `
            <div class="placeholder-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                </svg>
                <span>Interface Preview</span>
            </div>
        `;
        
        // Insert placeholder
        card.appendChild(placeholder);
    }
    
    handleImageLoad(img) {
        const card = img.closest('.screenshot-card');
        const placeholder = card?.querySelector('.screenshot-placeholder');
        
        if (placeholder) {
            placeholder.remove();
        }
        img.style.display = 'block';
    }
}

// Initialize the enhanced screenshot system
let screenshotController;
let fallbackHandler;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize with a slight delay for smooth startup
    setTimeout(() => {
        screenshotController = new ScreenshotStackController();
        fallbackHandler = new ScreenshotFallbackHandler();
        
        // Expose controller globally for debugging/extending
        window.screenshotController = screenshotController;
    }, 500);
});

// Add CSS for screenshot placeholder and enhanced interactions
const solutionsStyleEnhancements = document.createElement('style');
solutionsStyleEnhancements.textContent = `
    .screenshot-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        border: 2px dashed #cbd5e1;
        border-radius: 12px;
        color: #64748b;
    }
    
    .placeholder-content {
        text-align: center;
        padding: 2rem;
    }
    
    .placeholder-content svg {
        width: 56px;
        height: 56px;
        margin-bottom: 1rem;
        opacity: 0.6;
    }
    
    .placeholder-content span {
        display: block;
        font-size: 1rem;
        font-weight: 500;
        opacity: 0.8;
    }
    
    /* Enhanced mobile interactions */
    @media (max-width: 768px) {
        .service-item:active {
            background: linear-gradient(135deg, rgba(0, 102, 255, 0.08), rgba(74, 144, 226, 0.05));
            transform: translateY(-2px);
        }
        
        .screenshot-showcase {
            touch-action: manipulation;
        }
    }
    
    /* Focus states for accessibility */
    .service-item:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    .service-item:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
`;

document.head.appendChild(solutionsStyleEnhancements);
