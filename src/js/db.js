// IndexedDB setup for offline storage
class PointifyDB {
    constructor() {
        this.db = null;
        this.dbName = 'PointifyPOS';
        this.version = 1;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('IndexedDB error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB initialized successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Products store
                if (!db.objectStoreNames.contains('products')) {
                    const productsStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
                    productsStore.createIndex('sku', 'sku', { unique: true });
                    productsStore.createIndex('name', 'name', { unique: false });
                    productsStore.createIndex('category', 'category', { unique: false });
                }

                // Sales store
                if (!db.objectStoreNames.contains('sales')) {
                    const salesStore = db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true });
                    salesStore.createIndex('date', 'date', { unique: false });
                    salesStore.createIndex('receiptNumber', 'receiptNumber', { unique: true });
                }

                // Retail track store
                if (!db.objectStoreNames.contains('retailTrack')) {
                    const retailStore = db.createObjectStore('retailTrack', { keyPath: 'id', autoIncrement: true });
                    retailStore.createIndex('supplier', 'supplierName', { unique: false });
                    retailStore.createIndex('status', 'status', { unique: false });
                }

                // Users store (for internal users)
                if (!db.objectStoreNames.contains('users')) {
                    db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                }

                // Settings store
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    // Generic CRUD operations
    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async get(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Product specific methods
    async addProduct(product) {
        const productData = {
            ...product,
            id: PointifyUtils.generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return this.add('products', productData);
    }

    async getProducts() {
        return this.getAll('products');
    }

    async updateProduct(product) {
        product.updatedAt = new Date();
        return this.update('products', product);
    }

    async deleteProduct(productId) {
        return this.delete('products', productId);
    }

    // Sale specific methods
    async addSale(saleData) {
        const sale = {
            ...saleData,
            id: PointifyUtils.generateId(),
            date: new Date(),
            receiptNumber: `RCP-${Date.now()}`
        };
        return this.add('sales', sale);
    }

    async getSales() {
        return this.getAll('sales');
    }

    // Retail track methods
    async addRetailTrack(item) {
        const retailItem = {
            ...item,
            id: PointifyUtils.generateId(),
            createdAt: new Date()
        };
        return this.add('retailTrack', retailItem);
    }

    async getRetailTrack() {
        return this.getAll('retailTrack');
    }

    // Settings methods
    async getSetting(key) {
        return this.get('settings', key);
    }

    async setSetting(key, value) {
        return this.update('settings', { key, value });
    }
}

// Initialize database
let pointifyDB;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pointifyDB = new PointifyDB();
        await pointifyDB.init();
        window.pointifyDB = pointifyDB;
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
});