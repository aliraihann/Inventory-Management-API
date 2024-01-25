import dbPool from "../config/database.js"

async function getItemBySku (sku) {
    try {
        const [rows] = await dbPool.query(`
        SELECT * FROM products
        WHERE sku = ?
        `, [sku])
        return rows[0];
    } catch (err) {
        return({
            "message": "error on model",
            "error": `${err.message}`
        })
    }
}

async function getItemByCat (product_category, order_by, arrangement) {
    try {
        if (order_by && arrangement) {
            const rows = await dbPool.query(`
            SELECT * FROM products
            WHERE product_category = ?
            ORDER BY ${dbPool.escapeId(order_by)} ${arrangement }
            `, [product_category]);
            return rows[0];
        }
        const [rows] = await dbPool.query(`
        SELECT * FROM products
        WHERE product_category = ?
        `, [product_category])
        return rows;
    } catch (err) {
        return({
            "message": "error on model",
            "error": `${err.message}`
        })
    }
}

async function getItemByName (product_name, order_by, arrangement) {
    try {
        if (order_by && arrangement) {
            const rows = await dbPool.query(`
            SELECT * FROM products
            WHERE product_name LIKE ?
            ORDER BY ${dbPool.escapeId(order_by)} ${arrangement }
            `,[`%${product_name}%`]);
            return rows[0];
        }
        const [rows] = await dbPool.query(`
        SELECT * FROM products
        WHERE product_name LIKE  ?
        `,[`%${product_name}%`])
        return rows;
    } catch (err) {
        return({
            "message": "error on model",
            "error": `${err.message}`
        })
    }
}

async function orderByCheck (order_by) {
    try {
        const [rows] = await dbPool.query(`
        SELECT ? FROM products
        `, [order_by])
        return rows;
    } catch (err) {
        return({
            "message": "error on model",
            "error": `${err.message}`
        })
    }
}

async function getAllItem (order_by, arrangement) {
    try {
        if (order_by && arrangement) {
            const rows = await dbPool.query(`
            SELECT * FROM products
            ORDER BY ${dbPool.escapeId(order_by)} ${arrangement }
            `);
            return rows[0];
        }
        const rows = await dbPool.query(`
            SELECT * FROM products
            `);
            return rows[0];
    } catch (err) {
        return({
            "message": "error on model",
            "error": `${err.message}`
        })
    }
}

async function addItem (product_name, product_category, quantity, date) {
    try {
        const [insertItem] = await dbPool.query(`
        INSERT INTO products (product_name, product_category, quantity, date)
        VALUE (?,?,?,?)
        `, [product_name, product_category, quantity, date]);
    
        const sku = insertItem.insertId;
        return getItemBySku(sku);
    } catch (err) {
        return({
            "message": "error on model",
            "error": `${err.message}`
        })
    }
}

async function deleteItem (sku) {
    try {
        const removeItem = await dbPool.query(`
        DELETE FROM products
        WHERE sku = ?
        `, [sku]);
    } catch (err) {
        return({
            "message": "error on model",
            "error": `${err.message}`
        })
    }
}

async function updateItemQuantity ( quantity, date, sku) {
    try {
        const updateQuantity = await dbPool.query(`
        UPDATE products
        SET quantity = ? , date = ?
        WHERE sku = ?
        `, [quantity, date, sku]);
        
        return getItemBySku(sku);
    } catch (err) {
        return({
            "message": "error on model",
            "error": `${err.message}`
        })
    }
}

export { getItemBySku, orderByCheck, getItemByCat, getItemByName, getAllItem, addItem, updateItemQuantity, deleteItem }