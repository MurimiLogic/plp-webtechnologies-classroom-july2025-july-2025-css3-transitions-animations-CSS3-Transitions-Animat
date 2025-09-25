//Week 7 js tweaks
//I'm using my hotel website for these changes (Nairobi Street Eats)
// Global variables - demonstrating global scope
const animationState = {
    enabled: true,
    currentModal: null,
    activeEvent: null
};

// DOM Ready function - demonstrates function scope
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupInteractions();
});

// Function demonstrating parameters and return values
function calculateEventDuration(startTime, endTime) {
    // Local scope variables
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    
    if (!start || !end) return null;
    
    // Calculate duration in hours
    const duration = (end - start) / (1000 * 60 * 60);
    return Math.round(duration * 10) / 10; // Return rounded to 1 decimal
}

// Helper function with local scope only
function parseTime(timeStr) {
    const timeMatch = timeStr.match(/(\d+)\s*(a\.m\.|p\.m\.)/i);
    if (!timeMatch) return null;
    
    let hours = parseInt(timeMatch[1]);
    const period = timeMatch[2].toLowerCase();
    
    // Convert to 24-hour format
    if (period === 'p.m.' && hours < 12) hours += 12;
    if (period === 'a.m.' && hours === 12) hours = 0;
    
    // Create date object (using arbitrary date)
    const date = new Date();
    date.setHours(hours, 0, 0, 0);
    return date;
}

// Function to toggle animations globally
function toggleAnimations() {
    // Modifying global state
    animationState.enabled = !animationState.enabled;
    
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
        if (animationState.enabled) {
            el.style.animationPlayState = 'running';
        } else {
            el.style.animationPlayState = 'paused';
        }
    });
    
    return animationState.enabled; // Return value demonstration
}

// Reusable animation function with parameters
function animateElement(element, animationType = 'pulse') {
    return new Promise((resolve) => {
        const animationClass = `anim-${animationType}`;
        
        element.classList.add(animationClass);
        
        setTimeout(() => {
            element.classList.remove(animationClass);
            resolve(true);
        }, 600);
    });
}

// Event handling for events page
function setupEventsInteractions() {
    const eventCards = document.querySelectorAll('article > div');
    
    eventCards.forEach((card, index) => {
        // Add day data attribute
        const day = card.querySelector('h1').textContent.toLowerCase().split(' ')[0];
        card.setAttribute('data-day', day);
        
        // Add click handler
        card.addEventListener('click', function() {
            handleEventClick(this, index);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            if (animationState.enabled) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (animationState.enabled) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Event click handler demonstrating scope
function handleEventClick(card, index) {
    // Store active event in global state
    animationState.activeEvent = index;
    
    const title = card.querySelector('h1').textContent;
    const details = card.querySelector('p').textContent;
    
    // Extract times for duration calculation
    const timeMatch = details.match(/(\d+\.m\.)\s*-\s*(\d+\.m\.)/i);
    let durationInfo = '';
    
    if (timeMatch) {
        const duration = calculateEventDuration(timeMatch[1], timeMatch[2]);
        if (duration) {
            durationInfo = `Duration: ${duration} hours`;
        }
    }
    
    showEventModal(title, details, durationInfo);
    animateElement(card, 'pulse');
}

// Modal function demonstrating parameter usage
function showEventModal(title, details, duration = '') {
    const modalId = 'eventModal';
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Event Details</h2>
                <div id="modalBody"></div>
                <button class="btn" onclick="closeModal()">Close</button>
                <button class="btn" onclick="addToCalendar()" style="margin-left: 10px; background: #4CAF50;">Add to Calendar</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const modalBody = modal.querySelector('#modalBody');
    modalBody.innerHTML = `
        <h3>${title}</h3>
        <p>${details}</p>
        ${duration ? `<p><strong>${duration}</strong></p>` : ''}
        <p>Contact us to book Nairobi Street Eats for your event!</p>
    `;
    
    modal.style.display = 'block';
    animationState.currentModal = modalId;
}

// Global function to close modal
function closeModal() {
    if (animationState.currentModal) {
        const modal = document.getElementById(animationState.currentModal);
        if (modal) {
            modal.style.display = 'none';
            animationState.currentModal = null;
        }
    }
}

// Calendar function demonstrating return value
function addToCalendar() {
    const modalBody = document.querySelector('#modalBody');
    const title = modalBody.querySelector('h3').textContent;
    const details = modalBody.querySelector('p').textContent;
    
    // Simulate adding to calendar
    const success = simulateCalendarAdd(title, details);
    
    if (success) {
        showNotification('Event added to calendar successfully!', 'success');
    } else {
        showNotification('Failed to add event to calendar.', 'error');
    }
    
    return success;
}

// Helper function with local scope
function simulateCalendarAdd(title, details) {
    // Simulate API call with 80% success rate
    return Math.random() > 0.2;
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 4px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Menu interactions
function setupMenuInteractions() {
    const menuItems = document.querySelectorAll('dt');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
            animateElement(this, 'bounce');
        });
    });
}

// Initialize page enhancements
function initializePage() {
    // Add loading animation
    showLoadingAnimation();
    
    // Add control buttons to header
    addControlButtons();
}

// Loading animation function
function showLoadingAnimation() {
    const header = document.querySelector('header');
    const loadingSpan = document.createElement('span');
    loadingSpan.className = 'loading';
    loadingSpan.style.marginLeft = '10px';
    loadingSpan.title = 'Page loaded successfully!';
    
    header.appendChild(loadingSpan);
    
    setTimeout(() => {
        loadingSpan.remove();
    }, 2000);
}

// Add control buttons to header
function addControlButtons() {
    const header = document.querySelector('header');
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin: 10px 0;
        flex-wrap: wrap;
    `;
    
    // Animation toggle button
    const animBtn = document.createElement('button');
    animBtn.textContent = 'Toggle Animations';
    animBtn.className = 'btn';
    animBtn.onclick = toggleAnimations;
    
    // Events summary button
    const eventsBtn = document.createElement('button');
    eventsBtn.textContent = 'Events Summary';
    eventsBtn.className = 'btn';
    eventsBtn.onclick = showEventsSummary;
    
    buttonContainer.appendChild(animBtn);
    buttonContainer.appendChild(eventsBtn);
    header.appendChild(buttonContainer);
}

// Events summary function demonstrating complex logic
function showEventsSummary() {
    const eventCards = document.querySelectorAll('article > div');
    let totalHours = 0;
    let eventCount = 0;
    
    eventCards.forEach(card => {
        const details = card.querySelector('p').textContent;
        const timeMatch = details.match(/(\d+\.m\.)\s*-\s*(\d+\.m\.)/i);
        
        if (timeMatch) {
            const duration = calculateEventDuration(timeMatch[1], timeMatch[2]);
            if (duration) {
                totalHours += duration;
                eventCount++;
            }
        }
    });
    
    const avgHours = eventCount > 0 ? (totalHours / eventCount).toFixed(1) : 0;
    
    const modalId = 'summaryModal';
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Events Summary</h2>
            <p>Total Events: ${eventCount}</p>
            <p>Total Operating Hours: ${totalHours} hours</p>
            <p>Average Event Duration: ${avgHours} hours</p>
            <button class="btn" onclick="closeModal()">Close</button>
        </div>
    `;
    
    modal.style.display = 'block';
    animationState.currentModal = modalId;
}

// Setup all interactions
function setupInteractions() {
    // Setup events page interactions
    if (document.querySelector('article > div > h1')) {
        setupEventsInteractions();
    }
    
    // Setup menu interactions
    if (document.querySelector('dl')) {
        setupMenuInteractions();
    }
    
    // Global event listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && animationState.currentModal) {
            closeModal();
        }
    });
}

// Utility function for loading states
function setLoadingState(element, isLoading) {
    if (isLoading) {
        const originalText = element.textContent;
        element.dataset.originalText = originalText;
        element.innerHTML = '<span class="loading"></span> Loading...';
        element.disabled = true;
    } else {
        element.textContent = element.dataset.originalText || element.textContent;
        element.disabled = false;
    }
}

// Function to demonstrate parameter passing and return values
function calculateMenuTotal() {
    const menuItems = document.querySelectorAll('dd');
    let total = 0;
    
    menuItems.forEach(item => {
        const priceMatch = item.textContent.match(/Ksh\s*(\d+)/);
        if (priceMatch) {
            total += parseInt(priceMatch[1]);
        }
    });
    
    return total;
}

// Function to demonstrate combining CSS and JavaScript animations
function triggerCustomAnimation(elementId, animationName) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.animation = `${animationName} 0.5s ease`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
        
        return true;
    }
    return false;
}