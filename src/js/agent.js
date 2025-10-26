// Agent Dashboard Logic
class AgentDashboard {
    constructor() {
        this.agentId = null;
        this.currentAgent = null;
        this.init();
    }

    async init() {
        await this.loadAgentData();
        this.loadDashboardData();
        this.bindEvents();
    }

    async loadAgentData() {
        const userData = localStorage.getItem('pointify_user');
        if (userData) {
            this.currentAgent = JSON.parse(userData);
            this.agentId = this.currentAgent.id;
            document.getElementById('agentInfo').textContent = `Welcome, ${this.currentAgent.username}`;
        }
    }

    async loadDashboardData() {
        await this.loadCustomerStats();
        await this.loadCommissionData();
        await this.loadRecentActivity();
        await this.loadCustomers();
    }

    async loadCustomerStats() {
        // Simulate API call - in real app, this would fetch from backend
        const stats = {
            totalCustomers: 15,
            totalCommission: 1250.00,
            pendingApprovals: 3,
            activeCustomers: 12
        };

        document.getElementById('totalCustomers').textContent = stats.totalCustomers;
        document.getElementById('totalCommission').textContent = PointifyUtils.formatCurrency(stats.totalCommission, 'USD');
        document.getElementById('pendingApprovals').textContent = stats.pendingApprovals;
        document.getElementById('activeCustomers').textContent = stats.activeCustomers;
    }

    async loadCommissionData() {
        const commissionData = {
            earnedCommission: 1250.00,
            pendingPayout: 350.00,
            commissionRate: '10%',
            history: [
                { date: '2024-01-15', customer: 'Fashion Store', salesAmount: 2500, commission: 250, status: 'Paid' },
                { date: '2024-01-10', customer: 'Electronics Hub', salesAmount: 1800, commission: 180, status: 'Paid' },
                { date: '2024-01-05', customer: 'Super Market', salesAmount: 3500, commission: 350, status: 'Pending' }
            ]
        };

        document.getElementById('earnedCommission').textContent = PointifyUtils.formatCurrency(commissionData.earnedCommission, 'USD');
        document.getElementById('pendingPayout').textContent = PointifyUtils.formatCurrency(commissionData.pendingPayout, 'USD');
        document.getElementById('commissionRate').textContent = commissionData.commissionRate;

        const commissionHistory = document.getElementById('commissionHistory');
        if (commissionHistory) {
            commissionHistory.innerHTML = commissionData.history.map(item => `
                <tr>
                    <td>${item.date}</td>
                    <td>${item.customer}</td>
                    <td>${PointifyUtils.formatCurrency(item.salesAmount, 'USD')}</td>
                    <td>${PointifyUtils.formatCurrency(item.commission, 'USD')}</td>
                    <td><span style="color: ${item.status === 'Paid' ? 'var(--success)' : 'var(--warning)'}">${item.status}</span></td>
                </tr>
            `).join('');
        }
    }

    async loadRecentActivity() {
        const activity = [
            { type: 'registration', customer: 'New Shop', date: '2 hours ago', status: 'Pending' },
            { type: 'sale', customer: 'Fashion Store', amount: 450.00, date: '5 hours ago' },
            { type: 'approval', customer: 'Electronics Hub', date: '1 day ago', status: 'Approved' }
        ];

        const activityContainer = document.getElementById('recentActivity');
        if (activityContainer) {
            activityContainer.innerHTML = activity.map(item => `
                <div style="display: flex; justify-content: between; align-items: center; padding: 0.75rem; border-bottom: 1px solid var(--border-color);">
                    <div>
                        <strong>${item.customer}</strong>
                        <div style="font-size: 0.8rem; color: var(--text-light);">
                            ${item.type === 'registration' ? 'New registration' : 
                              item.type === 'sale' ? `Sale: ${PointifyUtils.formatCurrency(item.amount, 'USD')}` : 
                              'Account approved'}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.8rem; color: var(--text-light);">${item.date}</div>
                        ${item.status ? `<div style="color: ${item.status === 'Approved' ? 'var(--success)' : 'var(--warning)'};">${item.status}</div>` : ''}
                    </div>
                </div>
            `).join('');
        }
    }

    async loadCustomers() {
        const customers = [
            { shopName: 'Fashion Store', owner: 'John Doe', currency: 'USD', status: 'Active', joinDate: '2024-01-15' },
            { shopName: 'Electronics Hub', owner: 'Jane Smith', currency: 'USD', status: 'Active', joinDate: '2024-01-10' },
            { shopName: 'Super Market', owner: 'Mike Johnson', currency: 'KSH', status: 'Pending', joinDate: '2024-01-05' },
            { shopName: 'Book Store', owner: 'Sarah Wilson', currency: 'USD', status: 'Active', joinDate: '2023-12-20' }
        ];

        const customersTable = document.getElementById('customersTable');
        if (customersTable) {
            customersTable.innerHTML = customers.map(customer => `
                <tr>
                    <td>${customer.shopName}</td>
                    <td>${customer.owner}</td>
                    <td>${customer.currency}</td>
                    <td>
                        <span style="color: ${customer.status === 'Active' ? 'var(--success)' : 'var(--warning)'}">
                            ${customer.status}
                        </span>
                    </td>
                    <td>${customer.joinDate}</td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">
                            View
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    bindEvents() {
        const registerForm = document.getElementById('registerCustomerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.registerNewCustomer();
            });
        }
    }

    async registerNewCustomer() {
        const formData = {
            shopName: document.getElementById('newShopName').value,
            username: document.getElementById('newUsername').value,
            email: document.getElementById('newEmail').value,
            phone: document.getElementById('newPhone').value,
            password: document.getElementById('newPassword').value,
            currency: document.getElementById('newCurrency').value,
            deviceID: document.getElementById('newDeviceId').value,
            agentCode: document.getElementById('agentCode').value
        };

        // Validate required fields
        if (!formData.shopName || !formData.username || !formData.password) {
            PointifyUtils.showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            // Simulate API call
            PointifyUtils.showNotification('Customer registration submitted!', 'success');
            
            // Reset form
            document.getElementById('registerCustomerForm').reset();
            document.getElementById('newDeviceId').value = `DEVICE_${Date.now()}`;
            
            // Reload data
            setTimeout(() => {
                this.loadDashboardData();
                showSection('customers');
            }, 1000);

        } catch (error) {
            PointifyUtils.showNotification('Registration failed. Please try again.', 'error');
        }
    }

    async submitForApproval(customerId) {
        try {
            // Simulate API call
            PointifyUtils.showNotification('Submitted for admin approval', 'success');
        } catch (error) {
            PointifyUtils.showNotification('Submission failed', 'error');
        }
    }
}

// Initialize Agent Dashboard
let agentDashboard;

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('agent.html')) {
        agentDashboard = new AgentDashboard();
        window.agentDashboard = agentDashboard;
    }
});