// Authentication handling

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = localStorage.getItem('pointify_token');
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkExistingAuth();
    }

    bindEvents() {
        // Customer login
        const customerLoginForm = document.getElementById('customerLoginForm');
        if (customerLoginForm) {
            customerLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCustomerLogin();
            });
        }

        // Customer signup
        const customerSignupForm = document.getElementById('customerSignupForm');
        if (customerSignupForm) {
            customerSignupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCustomerSignup();
            });
        }

        // Agent login
        const agentLoginForm = document.getElementById('agentLoginForm');
        if (agentLoginForm) {
            agentLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAgentLogin();
            });
        }

        // Agent signup
        const agentSignupForm = document.getElementById('agentSignupForm');
        if (agentSignupForm) {
            agentSignupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAgentSignup();
            });
        }
    }

    async handleCustomerLogin() {
        const username = document.getElementById('customerUsername').value;
        const password = document.getElementById('customerPassword').value;
        const deviceID = document.getElementById('customerDeviceId').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, deviceID })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.token = data.token;
                localStorage.setItem('pointify_token', this.token);
                localStorage.setItem('pointify_user', JSON.stringify(data.data.user));
                
                PointifyUtils.showNotification('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'app.html';
                }, 1000);
            } else {
                PointifyUtils.showNotification(data.error, 'error');
            }
        } catch (error) {
            PointifyUtils.showNotification('Login failed. Please try again.', 'error');
        }
    }

    async handleCustomerSignup() {
        const formData = {
            username: document.getElementById('customerUsername').value,
            password: document.getElementById('customerPassword').value,
            currency: document.getElementById('customerCurrency').value,
            deviceID: document.getElementById('customerDeviceId').value,
            shopName: document.getElementById('shopName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            agentCode: document.getElementById('agentCode').value || undefined
        };

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                PointifyUtils.showNotification('Account created successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                PointifyUtils.showNotification(data.error, 'error');
            }
        } catch (error) {
            PointifyUtils.showNotification('Signup failed. Please try again.', 'error');
        }
    }

    async handleAgentLogin() {
        const email = document.getElementById('agentEmail').value;
        const password = document.getElementById('agentPassword').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: email, 
                    password, 
                    deviceID: 'agent' 
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.token = data.token;
                localStorage.setItem('pointify_token', this.token);
                localStorage.setItem('pointify_user', JSON.stringify(data.data.user));
                
                PointifyUtils.showNotification('Agent login successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'agent.html';
                }, 1000);
            } else {
                PointifyUtils.showNotification(data.error, 'error');
            }
        } catch (error) {
            PointifyUtils.showNotification('Login failed. Please try again.', 'error');
        }
    }

    async handleAgentSignup() {
        const formData = {
            name: document.getElementById('agentName').value,
            email: document.getElementById('agentEmail').value,
            password: document.getElementById('agentPassword').value,
            commission: parseFloat(document.getElementById('agentCommission').value)
        };

        try {
            const response = await fetch('/api/agent/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                PointifyUtils.showNotification('Agent account created successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                PointifyUtils.showNotification(data.error, 'error');
            }
        } catch (error) {
            PointifyUtils.showNotification('Registration failed. Please try again.', 'error');
        }
    }

    checkExistingAuth() {
        const user = localStorage.getItem('pointify_user');
        const token = localStorage.getItem('pointify_token');
        
        if (user && token) {
            this.currentUser = JSON.parse(user);
            this.token = token;
            
            // Redirect based on role
            const currentPage = window.location.pathname;
            if (currentPage.includes('login.html') || currentPage.includes('signup.html')) {
                this.redirectBasedOnRole();
            }
        }
    }

    redirectBasedOnRole() {
        if (!this.currentUser) return;

        switch (this.currentUser.role) {
            case 'customer':
            case 'owner':
            case 'cashier':
            case 'manager':
            case 'stock_keeper':
            case 'accountant':
                window.location.href = 'app.html';
                break;
            case 'agent':
                window.location.href = 'agent.html';
                break;
            case 'admin':
                window.location.href = 'admin.html';
                break;
        }
    }

    logout() {
        localStorage.removeItem('pointify_token');
        localStorage.removeItem('pointify_user');
        this.token = null;
        this.currentUser = null;
        window.location.href = 'login.html';
    }
}

// Admin verification functions
async function sendAdminVerification() {
    const email = document.getElementById('adminEmail').value;
    
    if (!email) {
        PointifyUtils.showNotification('Please enter admin email', 'error');
        return;
    }

    try {
        const response = await fetch('/api/admin/send-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.status === 'success') {
            document.getElementById('adminEmailStep').classList.add('hidden');
            document.getElementById('adminCodeStep').classList.remove('hidden');
            PointifyUtils.showNotification('Verification code sent to email', 'success');
            
            // In development, show the code
            if (data.tempCode) {
                console.log('Verification Code:', data.tempCode);
            }
        } else {
            PointifyUtils.showNotification(data.error, 'error');
        }
    } catch (error) {
        PointifyUtils.showNotification('Failed to send verification code', 'error');
    }
}

async function verifyAdminCode() {
    const code = document.getElementById('adminCode').value;
    
    // In a real app, you'd verify the code with the backend
    // For now, we'll simulate successful verification
    if (code) {
        localStorage.setItem('pointify_token', 'admin-token');
        localStorage.setItem('pointify_user', JSON.stringify({
            id: 'admin',
            username: 'admin',
            role: 'admin'
        }));
        
        PointifyUtils.showNotification('Admin login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        PointifyUtils.showNotification('Please enter verification code', 'error');
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});