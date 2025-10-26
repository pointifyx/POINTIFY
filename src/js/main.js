// Main JavaScript file - Common utilities

// Utility functions
class PointifyUtils {
    static formatCurrency(amount, currency = 'USD') {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        });
        return formatter.format(amount);
    }

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    static confirmAction(message) {
        return new Promise((resolve) => {
            const confirmed = confirm(message);
            resolve(confirmed);
        });
    }
}

// Tab management for authentication pages
function showTab(tab) {
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.auth-tab').forEach(tabEl => {
        tabEl.classList.remove('active');
    });
    
    // Show selected form and activate tab
    document.getElementById(`${tab}-login`).classList.remove('hidden');
    event.target.classList.add('active');
}

function showSignupTab(tab) {
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.auth-tab').forEach(tabEl => {
        tabEl.classList.remove('active');
    });
    
    // Show selected form and activate tab
    document.getElementById(`${tab}-signup`).classList.remove('hidden');
    event.target.classList.add('active');
}

// Section management for dashboards
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.main-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.remove('hidden');
}

// Initialize PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for use in other files
window.PointifyUtils = PointifyUtils;
window.showSection = showSection;