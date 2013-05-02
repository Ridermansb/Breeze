/***********************************************************
* Sample data for test purposes
***********************************************************/

define(['breeze'], function (breeze) {

    "use strict";
    
    return {
        primeTheCache: primeTheCache,
        createCustomer: createCustomer,
        createFakeExistingCustomer: createFakeExistingCustomer,
        createOrder: createOrder,
    };
    
    function primeTheCache(em) {

        /* simulate unchanged, queried entities */
        var unchanged = [];

        var unchangedCust = createFakeExistingCustomer(em);
        unchanged.push(unchangedCust);
        var unchangedCust2 = createFakeExistingCustomer(em, "Customer 2");
        unchanged.push(unchangedCust2);
        unchanged.push(createFakeExistingCustomer(em, "Customer 3"));
        unchanged.push(createFakeExistingCustomer(em, "Customer 4"));

        var unchangedOrder = createOrder(em,unchangedCust.CompanyName());
        unchangedOrder.OrderID(42);
        unchangedOrder.CustomerID(unchangedCust.CustomerID());
        em.attachEntity(unchangedOrder); // pretend already exists
        unchanged.push(unchangedOrder);

        /* Changed entities */
        var changed = [];

        // add a new customer and new order to the cache
        var newCust = em.addEntity(createCustomer(em, "Ima Nu"));
        var newOrder = em.addEntity(createOrder(em, "Suez He"));
        newOrder.Customer(newCust);// new order for new customer

        var changedCust = createFakeExistingCustomer(em);
        changedCust.CompanyName("Ima Different");

        var deletedCust = createFakeExistingCustomer(em, "Delete Me");
        deletedCust.entityAspect.setDeleted();

        changed.push(newCust);
        changed.push(newOrder);
        changed.push(changed);
        changed.push(deletedCust);

        return {           
            unchanged: unchanged,
            unchangedCount: unchanged.length,
            changed: changed,
            changedCount: changed.length,
            entityCount: unchanged.length + changed.length,
    
            orderType: unchangedOrder.entityType,
            customerType: unchangedCust.entityType,
            
            unchangedCust: unchangedCust,
            unchangedCust2: unchangedCust2,
            unchangedOrder: unchangedOrder,
            newCust: newCust,
            newOrder: newOrder,
            changedCust: changedCust,
            deletedCust: deletedCust,
        };
    }

    function getCustomerType(em) {
        return em.metadataStore.getEntityType("Customer");
    }
    function createFakeExistingCustomer(em, name) {
        name = name || "Duya Nomee";
        var customer = createCustomer(em, name);
        customer.CustomerID(breeze.core.getUuid());
        em.attachEntity(customer); // pretend already exists
        return customer;
    }
    // new but not added to em
    function createCustomer(em, name) {
        name = name || "New customer";
        var customerType = getCustomerType(em);
        var customer = customerType.createEntity();
        customer.CustomerID(breeze.core.getUuid());
        customer.CompanyName(name);
        return customer;
    }

    function getOrderType(em) {
        return em.metadataStore.getEntityType("Order");
    }
    // new but not added to em
    function createOrder(em, shipName) {
        shipName = shipName || "New Order";
        var orderType = getOrderType(em);
        var order = orderType.createEntity();
        order.ShipName(shipName);
        return order;
    }

});