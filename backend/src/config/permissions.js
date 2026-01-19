/**
 * System Permissions (SCOPES)
 * Defines granular access controls for the application
 */
export const SCOPES = {
    // User Management
    READ_USERS: 'read:users',
    MANAGE_USERS: 'manage:users',
    
    // Product Management
    READ_PRODUCTS: 'read:products',
    MANAGE_PRODUCTS: 'manage:products', // Create, Update, Delete
    
    // Order Management
    READ_ORDERS: 'read:orders',
    MANAGE_ORDERS: 'manage:orders',
    
    // Expert Management
    READ_EXPERTS: 'read:experts',
    MANAGE_EXPERTS: 'manage:experts',
    VERIFY_EXPERTS: 'verify:experts',
    
    // Self
    READ_SELF: 'read:self',
    UPDATE_SELF: 'update:self',
};

/**
 * Role to Scope Mapping
 * Defines which scopes each role possesses
 */
export const ROLE_SCOPES = {
    ADMIN: [
        SCOPES.READ_USERS, SCOPES.MANAGE_USERS,
        SCOPES.READ_PRODUCTS, SCOPES.MANAGE_PRODUCTS,
        SCOPES.READ_ORDERS, SCOPES.MANAGE_ORDERS,
        SCOPES.READ_EXPERTS, SCOPES.MANAGE_EXPERTS, SCOPES.VERIFY_EXPERTS,
        SCOPES.READ_SELF, SCOPES.UPDATE_SELF
    ],
    CUSTOMER: [
        SCOPES.READ_PRODUCTS,
        SCOPES.READ_EXPERTS,
        SCOPES.READ_SELF, SCOPES.UPDATE_SELF,
        // Customers can read their own orders via specific logic, but general 'read:orders' might be too broad if not scoped.
        // For now, we assume API logic handles ownership checks for 'read:self' contexts.
    ],
    EXPERT: [
        SCOPES.READ_PRODUCTS,
        SCOPES.READ_EXPERTS,
        SCOPES.READ_SELF, SCOPES.UPDATE_SELF,
        SCOPES.MANAGE_EXPERTS, // Experts can manage their own profile
    ],
    SHIPPER: [
        SCOPES.READ_ORDERS, // Shippers need to see orders
        SCOPES.READ_SELF, SCOPES.UPDATE_SELF
    ]
};

export default { SCOPES, ROLE_SCOPES };
