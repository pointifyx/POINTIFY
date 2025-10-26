// Admin Dashboard Logic
class AdminDashboard {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadDashboardData();
        this.bindEvents();
    }

    async loadDashboardData() {
        await this.loadSystemStats();
        await this.loadPendingApprovals();
        await this.loadAllUsers();
        await this.loadAgents();
        await this.loadRecentRegistrations();
    }

    async loadSystemStats() {
        const stats = {
            totalShops: 47,
            totalAgents: 8,
            pendingApprovalCount: 5,
            systemRevenue: 2840.00
        };

        document.getElementById('totalShops').textContent = stats.totalShops;
        document.getElementById('totalAgents').textContent = stats.totalAgents;
        document.getElementById('pendingApprovalCount').textContent = stats.pendingApprovalCount;
        document.getElementById('systemRevenue').textContent = PointifyUtils.formatCurrency(stats.systemRevenue, 'USD');
    }

    async loadPendingApprovals() {
        const pendingApprovals = [
            { id: 1, shopName: 'Super Market', owner: 'Mike Johnson', currency: 'KSH', agent: 'John Agent', registerDate: '2024-01-05' },
            { id: 2, shopName: 'Coffee Shop', owner: 'Emma Davis', currency: 'USD', agent: 'Sarah Agent', registerDate: '2024-01-04' },
            { id: 3, shopName: 'Hardware Store', owner: 'Robert Brown', currency: 'UGX', agent: 'No Agent', registerDate: '2024-01-03' }
        ];

        document.getElementById('pendingCount').textContent = pendingApprovals.length;

        const approvalsTable = document.getElementById('approvalsTable');
        if (approvalsTable) {
            approvalsTable.innerHTML = pendingApprovals.map(approval => `
                <tr>
                    <td>${approval.shopName}</td>
                    <td>${approval.owner}</td>
                    <td>${approval.currency}</td>
                    <td>${approval.agent}</td>
                    <td>${approval.registerDate}</td>
                    <td>
                        <button onclick="adminDashboard.approveUser(${approval.id})" class="btn btn-success" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-right: 0.5rem;">
                            Approve
                        </button>
                        <button onclick="adminDashboard.rejectUser(${approval.id})" class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">
                            Reject
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    async loadAllUsers() {
        const allUsers = [
            { shopName: 'Fashion Store', username: 'fashion123', currency: 'USD', status: 'Active', agent: 'John Agent', joinDate: '2024-01-15' },
            { shopName: 'Electronics Hub', username: 'electron456', currency: 'USD', status: 'Active', agent: 'Sarah Agent', joinDate: '2024-01-10' },
            { shopName: 'Book Store', username: 'books789', currency: 'USD', status: 'Active', agent: 'No Agent', joinDate: '2023-12-20' },
            { shopName: 'Super Market', username: 'super_mkt', currency: 'KSH', status: 'Pending', agent: 'John Agent', joinDate: '2024-01-05' }
        ];

        const allUsersTable = document.getElementById('allUsersTable');
        if (allUsersTable) {
            allUsersTable.innerHTML = allUsers.map(user => `
                <tr>
                    <td>${user.shopName}</td>
                    <td>${user.username}</td>
                    <td>${user.currency}</td>
                    <td>
                        <span style="color: ${user.status === 'Active' ? 'var(--success)' : 'var(--warning)'}">
                            ${user.status}
                        </span>
                    </td>
                    <td>${user.agent}</td>
                    <td>${user.joinDate}</td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-right: 0.5rem;">
                            View
                        </button>
                        <button onclick="adminDashboard.suspendUser('${user.username}')" class="btn btn-warning" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">
                            ${user.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    async loadAgents() {
        const agents = [
            { name: 'John Agent', email: 'john@pointify.com', commission: '10%', customers: 12, totalCommission: 1250.00, status: 'Active' },
            { name: 'Sarah Agent', email: 'sarah@pointify.com', commission: '12%', customers: 8, totalCommission: 980.00, status: 'Active' },
            { name: 'Mike Agent', email: 'mike@pointify.com', commission: '8%', customers: 5, totalCommission: 450.00, status: 'Inactive' }
        ];

        const agentsTable = document.getElementById('agentsTable');
        if (agentsTable) {
            agentsTable.innerHTML = agents.map(agent => `
                <tr>
                    <td>${agent.name}</td>
                    <td>${agent.email}</td>
                    <td>${agent.commission}</td>
                    <td>${agent.customers}</td>
                    <td>${PointifyUtils.formatCurrency(agent.totalCommission, 'USD')}</td>
                    <td>
                        <span style="color: ${agent.status === 'Active' ? 'var(--success)' : 'var(--text-light)'}">
                            ${agent.status}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-right: 0.5rem;">
                            Edit
                        </button>
                        <button onclick="adminDashboard.toggleAgentStatus('${agent.email}')" class="btn btn-warning" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">
                            ${agent.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    async loadRecentRegistrations() {
        const recentRegs = [
            { shopName: 'Super Market', owner: 'Mike Johnson', date: '2024-01-05', status: 'Pending' },
            { shopName: 'Coffee Shop', owner: 'Emma Davis', date: '2024-01-04', status: 'Pending' },
            { shopName: 'Hardware Store', owner: 'Robert Brown', date: '2024-01-03', status: 'Approved' },
            { shopName: 'Bakery', owner: 'Lisa Wilson', date: '2024-01-02', status: 'Approved' }
        ];

        const recentRegistrations = document.getElementById('recentRegistrations');
        if (recentRegistrations) {
            recentRegistrations.innerHTML = recentRegs.map(reg => `
                <tr>
                    <td>${reg.shopName}</td>
                    <td>${reg.owner}</td>
                    <td>${reg.date}</td>
                    <td>
                        <span style="color: ${reg.status === 'Approved' ? 'var(--success)' : 'var(--warning)'}">
                            ${reg.status}
                        </span>
                    </td>
                    <td>
                        ${reg.status === 'Pending' ? `
                            <button onclick="adminDashboard.approveUser(1)" class="btn btn-success" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">
                                Review
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `).join('');
        }
    }

    bindEvents() {
        // Add search functionality
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => {
                this.searchUsers(e.target.value);
            });
        }
    }

    async approveUser(userId) {
        try {
            // Simulate API call
            PointifyUtils.showNotification('User approved successfully!', 'success');
            
            // Reload data
            setTimeout(() => {
                this.loadDashboardData();
            }, 1000);
        } catch (error) {
            PointifyUtils.showNotification('Approval failed', 'error');
        }
    }

    async rejectUser(userId) {
        const confirmed = await PointifyUtils.confirmAction('Are you sure you want to reject this user?');
        if (confirmed) {
            try {
                // Simulate API call
                PointifyUtils.showNotification('User rejected', 'success');
                
                // Reload data
                setTimeout(() => {
                    this.loadDashboardData();
                }, 1000);
            } catch (error) {
                PointifyUtils.showNotification('Rejection failed', 'error');
            }
        }
    }

    async suspendUser(username) {
        const action = confirm(`Are you sure you want to suspend ${username}?`);
        if (action) {
            PointifyUtils.showNotification('User status updated', 'success');
        }
    }

    async toggleAgentStatus(agentEmail) {
        const action = confirm(`Are you sure you want to change this agent's status?`);
        if (action) {
            PointifyUtils.showNotification('Agent status updated', 'success');
        }
    }

    searchUsers(query) {
        const rows = document.querySelectorAll('#allUsersTable tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }

    generateSystemReport() {
        PointifyUtils.showNotification('System report generated!', 'success');
        
        // Simulate report data
        const reportData = {
            period: 'January 2024',
            totalShops: 47,
            newRegistrations: 8,
            totalRevenue: 2840.00,
            activeAgents: 6
        };

        const systemStats = document.getElementById('systemStats');
        if (systemStats) {
            systemStats.innerHTML = `
                <div style="display: grid; gap: 1rem;">
                    <div><strong>Period:</strong> ${reportData.period}</div>
                    <div><strong>Total Shops:</strong> ${reportData.totalShops}</div>
                    <div><strong>New Registrations:</strong> ${reportData.newRegistrations}</div>
                    <div><strong>Total Revenue:</strong> ${PointifyUtils.formatCurrency(reportData.totalRevenue, 'USD')}</div>
                    <div><strong>Active Agents:</strong> ${reportData.activeAgents}</div>
                </div>
            `;
        }
    }

    exportReport() {
        PointifyUtils.showNotification('Report exported as PDF!', 'success');
    }

    showAddAgentModal() {
        const agentName = prompt('Enter agent name:');
        const agentEmail = prompt('Enter agent email:');
        const commission = prompt('Enter commission rate (%):', '10');

        if (agentName && agentEmail && commission) {
            PointifyUtils.showNotification('Agent added successfully!', 'success');
            setTimeout(() => {
                this.loadAgents();
            }, 1000);
        }
    }

    backupDatabase() {
        PointifyUtils.showNotification('Database backup initiated!', 'success');
    }

    clearCache() {
        PointifyUtils.showNotification('Cache cleared!', 'success');
    }

    systemReset() {
        const confirmed = confirm('WARNING: This will reset the entire system. Are you sure?');
        if (confirmed) {
            PointifyUtils.showNotification('System reset initiated!', 'success');
        }
    }
}

// Initialize Admin Dashboard
let adminDashboard;

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('admin.html')) {
        adminDashboard = new AdminDashboard();
        window.adminDashboard = adminDashboard;
    }
});