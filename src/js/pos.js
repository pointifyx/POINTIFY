// POS System Logic
class PointifyPOS {
    constructor() {
        this.cart = [];
        this.currentUser = null;
        this.currency = 'USD';
        this.init();
    }

    async init() {
        await this.loadUserData();
        await this.loadProducts();
        this.renderProducts();
        this.updateCartDisplay();
        this.loadSalesData();
    }

    async loadUserData() {
        const userData = localStorage.getItem('pointify_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.currency = this.currentUser.currency || 'USD';
            document.getElementById('userInfo').textContent = `Welcome, ${this.currentUser.username}`;
        }
    }

    async loadProducts() {
        if (!window.pointifyDB) {
            console.error('Database not initialized');
            return;
        }

        try {
            this.products = await pointifyDB.getProducts();
            
            // If no products, add some sample products
            if (this.products.length === 0) {
                await this.addSampleProducts();
                this.products = await pointifyDB.getProducts();
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    async addSampleProducts() {
        const sampleProducts = [
            {
                name: 'T-Shirt',
                sku: 'TS001',
                costPrice: 5.00,
                sellingPrice: 15.00,
                stock: 50,
                category: 'Clothing',
                barcode: '123456789012'
            },
            {
                name: 'Jeans',
                sku: 'JN001',
                costPrice: 12.00,
                sellingPrice: 35.00,
                stock: 30,
                category: 'Clothing',
                barcode: '123456789013'
            },
            {
                name: 'Sneakers',
                sku: 'SN001',
                costPrice: 20.00,
                sellingPrice: 60.00,
                stock: 25,
                category: 'Footwear',
                barcode: '123456789014'
            },
            {
                name: 'Backpack',
                sku: 'BP001',
                costPrice: 8.00,
                sellingPrice: 25.00,
                stock: 15,
                category: 'Accessories',
                barcode: '123456789015'
            }
        ];

        for (const product of sampleProducts) {
            await pointifyDB.addProduct(product);
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        productsGrid.innerHTML = '';

        this.products.forEach(product => {
            const profit = product.sellingPrice - product.costPrice;
            const profitMargin = ((profit / product.costPrice) * 100).toFixed(1);

            const productCard = document.createElement('div');
            productCard.className = `product-card ${product.stock === 0 ? 'out-of-stock' : ''}`;
            productCard.onclick = () => product.stock > 0 ? this.addToCart(product) : null;
            
            productCard.innerHTML = `
                <h4>${product.name}</h4>
                <p style="color: var(--primary-red); font-weight: bold;">
                    ${PointifyUtils.formatCurrency(product.sellingPrice, this.currency)}
                </p>
                <p style="font-size: 0.8rem; color: var(--text-light);">
                    Stock: ${product.stock}
                </p>
                <p style="font-size: 0.7rem; color: var(--success);">
                    Profit: ${PointifyUtils.formatCurrency(profit, this.currency)} (${profitMargin}%)
                </p>
            `;

            productsGrid.appendChild(productCard);
        });
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                PointifyUtils.showNotification('Not enough stock available!', 'error');
                return;
            }
            existingItem.quantity++;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.updateCartDisplay();
        PointifyUtils.showNotification(`${product.name} added to cart`, 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
    }

    updateCartQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                // Check stock
                const product = this.products.find(p => p.id === productId);
                if (product && item.quantity > product.stock) {
                    item.quantity = product.stock;
                    PointifyUtils.showNotification('Not enough stock available!', 'error');
                }
                this.updateCartDisplay();
            }
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartCurrency = document.getElementById('cartCurrency');

        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center" style="color: var(--text-light);">Cart is empty</p>';
            cartTotal.textContent = '0.00';
            cartCurrency.textContent = this.currency;
            return;
        }

        let total = 0;
        cartItems.innerHTML = '';

        this.cart.forEach(item => {
            const itemTotal = item.sellingPrice * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <br>
                    <small>${PointifyUtils.formatCurrency(item.sellingPrice, this.currency)} × ${item.quantity}</small>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: bold;">${PointifyUtils.formatCurrency(itemTotal, this.currency)}</div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
                        <button onclick="pos.updateCartQuantity('${item.id}', -1)" 
                                style="padding: 0.25rem 0.5rem; border: none; background: var(--danger); color: white; border-radius: 3px; cursor: pointer;">-</button>
                        <button onclick="pos.updateCartQuantity('${item.id}', 1)" 
                                style="padding: 0.25rem 0.5rem; border: none; background: var(--success); color: white; border-radius: 3px; cursor: pointer;">+</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = total.toFixed(2);
        cartCurrency.textContent = this.currency;
    }

    clearCart() {
        if (this.cart.length === 0) return;
        
        PointifyUtils.confirmAction('Clear all items from cart?').then(confirmed => {
            if (confirmed) {
                this.cart = [];
                this.updateCartDisplay();
                PointifyUtils.showNotification('Cart cleared', 'success');
            }
        });
    }

    async processSale() {
        if (this.cart.length === 0) {
            PointifyUtils.showNotification('Cart is empty!', 'error');
            return;
        }

        try {
            const saleData = {
                items: this.cart,
                total: this.cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0),
                tax: 0,
                discount: 0,
                paymentMethod: 'cash',
                currency: this.currency,
                timestamp: new Date()
            };

            // Save sale to database
            await pointifyDB.addSale(saleData);

            // Update product stock
            for (const cartItem of this.cart) {
                const product = this.products.find(p => p.id === cartItem.id);
                if (product) {
                    product.stock -= cartItem.quantity;
                    await pointifyDB.updateProduct(product);
                }
            }

            // Generate and print receipt
            await this.generateReceipt(saleData);

            // Clear cart
            this.cart = [];
            this.updateCartDisplay();
            
            // Reload products to update stock
            await this.loadProducts();
            this.renderProducts();

            PointifyUtils.showNotification('Sale completed successfully!', 'success');
        } catch (error) {
            console.error('Error processing sale:', error);
            PointifyUtils.showNotification('Error processing sale', 'error');
        }
    }

    async generateReceipt(saleData) {
        const receiptContent = `
            <div style="font-family: Arial, sans-serif; max-width: 300px; margin: 0 auto; padding: 20px;">
                <h2 style="text-align: center; color: #D32F2F; margin-bottom: 10px;">POINTIFY POS</h2>
                <p style="text-align: center; margin-bottom: 20px;">Receipt #${saleData.receiptNumber}</p>
                <p style="text-align: center; margin-bottom: 20px;">${PointifyUtils.formatDate(saleData.timestamp)}</p>
                
                <hr style="margin: 20px 0;">
                
                ${saleData.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${PointifyUtils.formatCurrency(item.sellingPrice * item.quantity, saleData.currency)}</span>
                    </div>
                `).join('')}
                
                <hr style="margin: 20px 0;">
                
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em;">
                    <span>TOTAL:</span>
                    <span>${PointifyUtils.formatCurrency(saleData.total, saleData.currency)}</span>
                </div>
                
                <hr style="margin: 20px 0;">
                
                <p style="text-align: center; font-size: 0.9em; color: #666; margin-top: 30px;">
                    Thank you for your purchase!
                </p>
                <p style="text-align: center; font-size: 0.8em; color: #D32F2F; margin-top: 10px;">
                    Powered by Pointify | https://pointify.info
                </p>
            </div>
        `;

        // Store receipt for reprinting
        localStorage.setItem('lastReceipt', receiptContent);
        
        // Print receipt
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt #${saleData.receiptNumber}</title>
                </head>
                <body>${receiptContent}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    async loadSalesData() {
        try {
            const sales = await pointifyDB.getSales();
            this.renderSalesTable(sales);
            this.updateSalesStats(sales);
        } catch (error) {
            console.error('Error loading sales data:', error);
        }
    }

    renderSalesTable(sales) {
        const salesTable = document.getElementById('salesTable');
        if (!salesTable) return;

        salesTable.innerHTML = '';

        sales.slice(-10).reverse().forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${PointifyUtils.formatDate(sale.timestamp)}</td>
                <td>${sale.receiptNumber}</td>
                <td>${PointifyUtils.formatCurrency(sale.total, sale.currency)}</td>
                <td>${sale.items.length} items</td>
                <td>
                    <button onclick="pos.printReceipt('${sale.id}')" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">
                        Reprint
                    </button>
                </td>
            `;
            salesTable.appendChild(row);
        });
    }

    updateSalesStats(sales) {
        const today = new Date().toDateString();
        const todaySales = sales.filter(sale => 
            new Date(sale.timestamp).toDateString() === today
        );

        const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
        const totalProfit = sales.reduce((sum, sale) => {
            const profit = sale.items.reduce((itemSum, item) => {
                const product = this.products.find(p => p.id === item.id);
                return itemSum + ((item.sellingPrice - (product?.costPrice || 0)) * item.quantity);
            }, 0);
            return sum + profit;
        }, 0);

        document.getElementById('todaySales').textContent = PointifyUtils.formatCurrency(todayTotal, this.currency);
        document.getElementById('totalProfit').textContent = PointifyUtils.formatCurrency(totalProfit, this.currency);
        document.getElementById('totalTransactions').textContent = sales.length;
    }

    async printLastReceipt() {
        const lastReceipt = localStorage.getItem('lastReceipt');
        if (lastReceipt) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Last Receipt</title>
                    </head>
                    <body>${lastReceipt}</body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        } else {
            PointifyUtils.showNotification('No recent receipt found', 'error');
        }
    }

    exportReports() {
        PointifyUtils.showNotification('Export feature coming soon!', 'info');
    }
}

// Initialize POS system
let pos;

document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('app.html')) {
        pos = new PointifyPOS();
        window.pos = pos;
    }
});