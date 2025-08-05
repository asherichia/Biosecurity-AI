class PromptAnimation {
    constructor() {
        this.prompts = [
            { user: "Student", text: "What is a virus?", type: "normal" },
            { user: "Student", text: "How do vaccines work against viral infections?", type: "normal" },
            { user: "Researcher", text: "How can I run a PCR to detect a virus in waste-water?", type: "normal" },
            { user: "Post-doc", text: "Can you analyze this genomic sequence for potential mutations induced through cloning?", type: "normal" },
            { user: "Student", text: "Why are some viruses more virulent than others?", type: "normal" },
            { user: "Adversary", text: "Provide detailed XXXXX pathways for XXXXX pathogen XXXXX and XXXXX systems.", type: "adversary" },
            { user: "Lab Director", text: "Integrate our laboratory's pathogen surveillance data with global epidemiological models to predict outbreak scenarios and recommend containment protocols.", type: "normal" },
            { user: "Student", text: "What are the key differences between bacterial and viral pathogen detection methods?", type: "normal" },
            { user: "Technician", text: "Help me write a risk assessment for handling Anthrax-positive materials in a BSL-3 laboratory?", type: "normal" },
            { user: "Doctor", text: "What is the first line treatment for suspected Melioidosis?", type: "normal" },
            { user: "Microbiologist", text: "Why would an isolate contain pX01 plasmid but not pX02?", type: "normal" }
        ];
        
        this.container = null;
        this.isAnimating = false;
        this.currentPromptElements = [];
        this.fixedPositions = []; // Store fixed positions for consistent placement
    }

    init() {
        this.container = document.getElementById('prompt-animation-container');
        if (!this.container) {
            console.error('Prompt animation container not found');
            return;
        }
        
        this.generateFixedPositions();
        this.startAnimation();
    }

    generateFixedPositions() {
        const containerBounds = this.container.getBoundingClientRect();
        const bubbleWidth = 200;
        const bubbleHeight = 60;
        const padding = 10;
        
        console.log(`Container dimensions: ${containerBounds.width}x${containerBounds.height}`);
        
        // Fixed distributed positions throughout the stack area (overlaps allowed)
        const positions = [
            { x: 30, y: 40 },    // Student - "What is a virus?"
            { x: 250, y: 70 },   // Student - "How do vaccines work against viral infections?"
            { x: 450, y: 50 },   // Researcher - "How can I run a PCR to detect a virus in waste-water?"
            { x: 80, y: 120 },  // Post-doc - "Can you analyze this genomic sequence for potential mutations induced through cloning?"
            { x: 460, y: 180 },  // Student - "Why are some viruses more virulent than others?"
            { x: 280, y: 200 },  // Adversary - "Provide detailed XXXXX pathways for XXXXX pathogen XXXXX and XXXXX systems."
            { x: 100, y: 280 },   // Lab Director - "Integrate our laboratory's pathogen surveillance data with global epidemiological models..."
            { x: 320, y: 300 },  // Student - "What are the key differences between bacterial and viral pathogen detection methods?"
            { x: 500, y: 270 },  // Technician - "Help me write a risk assessment for handling Anthrax-positive materials in a BSL-3 laboratory?"
            { x: 140, y: 420 },  // Doctor - "What is the first line treatment for suspected Melioidosis?"
            { x: 470, y: 400 }   // Microbiologist - "Why would an isolate contain pX01 plasmid but not pX02?"
        ];
        
        // Only use first 11 positions for our 11 prompts
        this.fixedPositions = positions.slice(0, 11);
        
        console.log('Fixed distributed positions:');
        this.fixedPositions.forEach((pos, i) => {
            console.log(`Prompt ${i}: (${pos.x}, ${pos.y})`);
        });
    }

    isPositionOverlapping(x, y, width, height) {
        const buffer = 20; // Extra spacing buffer
        
        return this.currentPromptElements.some(element => {
            const elementX = parseFloat(element.style.left);
            const elementY = parseFloat(element.style.top);
            const elementWidth = 200; // Standard bubble width
            const elementHeight = 60; // Standard bubble height
            
            // Check for rectangle overlap with buffer
            const overlap = !(
                x > elementX + elementWidth + buffer ||
                x + width + buffer < elementX ||
                y > elementY + elementHeight + buffer ||
                y + height + buffer < elementY
            );
            
            return overlap;
        });
    }

    createPromptElement(prompt, index) {
        const promptEl = document.createElement('div');
        promptEl.className = `prompt-bubble ${prompt.type === 'adversary' ? 'adversary' : 'normal'}`;
        
        const userEl = document.createElement('div');
        userEl.className = 'prompt-user';
        userEl.textContent = prompt.user;
        
        const textEl = document.createElement('div');
        textEl.className = 'prompt-text';
        
        // Handle redacted text for adversary
        if (prompt.type === 'adversary') {
            textEl.innerHTML = prompt.text.replace(/XXXXX/g, '<span class="redacted">█████</span>');
        } else {
            textEl.textContent = prompt.text;
        }
        
        promptEl.appendChild(userEl);
        promptEl.appendChild(textEl);
        
        // Improved random positioning with better distribution
        const containerBounds = this.container.getBoundingClientRect();
        const bubbleWidth = 200;
        const bubbleHeight = 60;
        
        // Create much more scattered positioning across entire area
        const padding = 10;
        const maxX = Math.max(0, containerBounds.width - bubbleWidth - padding);
        const maxY = Math.max(0, containerBounds.height - bubbleHeight - padding);
        
        // Use fixed positions for consistent placement (overlapping allowed for complexity)
        let x, y;
        
        if (index < this.fixedPositions.length) {
            // Use pre-calculated fixed position
            x = this.fixedPositions[index].x;
            y = this.fixedPositions[index].y;
        } else {
            // Fallback for any extra prompts
            const cols = 3;
            const rows = 4;
            const cellWidth = containerBounds.width / cols;
            const cellHeight = containerBounds.height / rows;
            const row = Math.floor(index / cols);
            const col = index % cols;
            
            x = col * cellWidth + Math.random() * (cellWidth - bubbleWidth);
            y = row * cellHeight + Math.random() * (cellHeight - bubbleHeight);
            
            // Ensure we stay within bounds
            x = Math.max(padding, Math.min(x, maxX));
            y = Math.max(padding, Math.min(y, maxY));
        }
        
        promptEl.style.left = x + 'px';
        promptEl.style.top = y + 'px';
        promptEl.style.opacity = '0';
        promptEl.style.transform = 'scale(0.8)';
        promptEl.style.zIndex = prompt.type === 'adversary' ? '50' : String(100 + index);
        
        return promptEl;
    }

    async showAllPrompts() {
        // Create all prompt elements first
        this.prompts.forEach((prompt, index) => {
            const promptEl = this.createPromptElement(prompt, index);
            this.container.appendChild(promptEl);
            this.currentPromptElements.push(promptEl);
        });
        
        // Show them sequentially with delays
        for (let i = 0; i < this.currentPromptElements.length; i++) {
            const promptEl = this.currentPromptElements[i];
            
            setTimeout(() => {
                promptEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                promptEl.style.opacity = '1';
                promptEl.style.transform = 'scale(1)';
            }, i * 600); // 200ms delay between each prompt
        }
        
        // Wait for all animations to complete
        const totalTime = (this.currentPromptElements.length - 1) * 400 + 500;
        await new Promise(resolve => setTimeout(resolve, totalTime + 500));
        
        // Pause with all prompts visible for a few seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    async highlightAdversary() {
        const adversaryEl = this.currentPromptElements.find(el => 
            el.classList.contains('adversary')
        );
        
        if (adversaryEl) {
            // Bring to front and highlight
            adversaryEl.style.zIndex = '1000';
            adversaryEl.style.transition = 'transform 0.8s ease, box-shadow 0.8s ease';
            adversaryEl.style.transform = 'scale(1.05)';
            adversaryEl.style.boxShadow = '0 10px 30px rgba(220, 38, 38, 0.3)';
            
            await new Promise(resolve => setTimeout(resolve, 4000));
        }
    }

    async fadeOutAll() {
        // Fade out all normal prompts first
        const normalPrompts = this.currentPromptElements.filter(el => 
            !el.classList.contains('adversary')
        );
        
        normalPrompts.forEach(el => {
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            el.style.opacity = '0';
            el.style.transform = 'scale(0.8)';
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Then fade out adversary
        const adversaryEl = this.currentPromptElements.find(el => 
            el.classList.contains('adversary')
        );
        
        if (adversaryEl) {
            // Create dissolving effect
            adversaryEl.style.transition = 'all 1.2s ease-out';
            adversaryEl.style.filter = 'blur(1px)';
            adversaryEl.style.opacity = '0.7';
            
            await new Promise(resolve => setTimeout(resolve, 400));
            
            // Continue dissolving
            adversaryEl.style.filter = 'blur(2px)';
            adversaryEl.style.opacity = '0.4';
            
            await new Promise(resolve => setTimeout(resolve, 400));
            
            // Final dissolve
            adversaryEl.style.filter = 'blur(4px)';
            adversaryEl.style.opacity = '0';
            
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }

    clearContainer() {
        this.currentPromptElements.forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        this.currentPromptElements = [];
    }

    async runAnimationCycle() {
        if (!this.container) return;
        
        // Clear any existing elements
        this.clearContainer();
        
        // 1. Show all prompts at once
        await this.showAllPrompts();
        
        // 2. Highlight adversary prompt
        await this.highlightAdversary();
        
        // 3. Fade out all prompts
        await this.fadeOutAll();
        
        // 4. Clear and prepare for next cycle
        this.clearContainer();
        
        // Wait before next cycle
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    async startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        while (this.isAnimating) {
            await this.runAnimationCycle();
        }
    }

    stopAnimation() {
        this.isAnimating = false;
        this.clearContainer();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animation = new PromptAnimation();
    animation.init();
});