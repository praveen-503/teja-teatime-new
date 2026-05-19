const orderStatus = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERED'] as const;
const waiterRequestTypes = ['WATER', 'BILL', 'WAITER', 'TISSUE'] as const;

export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Tea Time Server API',
    version: '1.0.0',
    description:
      'REST API for the Tea Time QR ordering server. Use this documentation to explore menu, order, waiter, and table endpoints.',
  },
  servers: [{ url: '/' }],
  tags: [
    { name: 'Health', description: 'Basic service health checks' },
    { name: 'Categories', description: 'Category browsing endpoints' },
    { name: 'Products', description: 'Menu product endpoints' },
    { name: 'Orders', description: 'Order creation and tracking endpoints' },
    { name: 'Waiter', description: 'Waiter call endpoints' },
    { name: 'Tables', description: 'Table lookup endpoint' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                  required: ['status', 'timestamp'],
                },
              },
            },
          },
        },
      },
    },
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List active categories',
        responses: {
          200: {
            description: 'Categories with product counts',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CategoryListResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'List available products',
        parameters: [
          {
            name: 'categoryId',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Optional category filter',
          },
          {
            name: 'search',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Optional text search for product name or description',
          },
        ],
        responses: {
          200: {
            description: 'Available products',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductListResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get a product by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Product details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductResponse',
                },
              },
            },
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOrderPayload' },
            },
          },
        },
        responses: {
          201: {
            description: 'Order created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderResponse' },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Referenced table not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get an order by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Order details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderResponse' },
              },
            },
          },
          404: {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/orders/{id}/status': {
      patch: {
        tags: ['Orders'],
        summary: 'Update an order status',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateOrderStatusPayload' },
            },
          },
        },
        responses: {
          200: {
            description: 'Order status updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderResponse' },
              },
            },
          },
          400: {
            description: 'Invalid status payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/waiter-request': {
      post: {
        tags: ['Waiter'],
        summary: 'Call a waiter for a table',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WaiterRequestPayload' },
            },
          },
        },
        responses: {
          201: {
            description: 'Waiter request created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WaiterRequestResponse' },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Table not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/table/{number}': {
      get: {
        tags: ['Tables'],
        summary: 'Get an active table by number',
        parameters: [
          {
            name: 'number',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Table details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TableResponse' },
              },
            },
          },
          400: {
            description: 'Invalid table number',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Table not found or inactive',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
        required: ['success'],
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          image: { type: 'string' },
          productCount: { type: 'integer' },
        },
        required: ['id', 'name', 'slug', 'image', 'productCount'],
      },
      CategoryListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Category' },
          },
        },
        required: ['success', 'data'],
      },
      Addon: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          price: { type: 'number' },
        },
        required: ['name', 'price'],
      },
      ProductCategory: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
        },
        required: ['id', 'name', 'slug'],
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          categoryId: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          image: { type: 'string' },
          rating: { type: 'number' },
          reviewCount: { type: 'integer' },
          isAvailable: { type: 'boolean' },
          isVeg: { type: 'boolean' },
          sugarLevels: {
            type: 'array',
            items: { type: 'string' },
          },
          spiceLevels: {
            type: 'array',
            items: { type: 'string' },
          },
          addons: {
            type: 'array',
            items: { $ref: '#/components/schemas/Addon' },
          },
          category: { $ref: '#/components/schemas/ProductCategory' },
        },
        required: [
          'id',
          'categoryId',
          'name',
          'slug',
          'description',
          'price',
          'image',
          'rating',
          'reviewCount',
          'isAvailable',
          'isVeg',
          'sugarLevels',
          'spiceLevels',
          'addons',
          'category',
        ],
      },
      ProductListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' },
          },
        },
        required: ['success', 'data'],
      },
      ProductResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { $ref: '#/components/schemas/Product' },
        },
        required: ['success', 'data'],
      },
      CreateOrderItem: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          quantity: { type: 'integer', minimum: 1 },
          sugarLevel: { type: 'string', nullable: true },
          spiceLevel: { type: 'string', nullable: true },
          addons: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['productId', 'quantity'],
      },
      CreateOrderPayload: {
        type: 'object',
        properties: {
          tableNumber: { type: 'integer' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CreateOrderItem' },
            minItems: 1,
          },
          notes: { type: 'string', nullable: true },
        },
        required: ['tableNumber', 'items'],
      },
      UpdateOrderStatusPayload: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: [...orderStatus],
          },
          estimatedTime: { type: 'integer', nullable: true },
        },
        required: ['status'],
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          productId: { type: 'string' },
          quantity: { type: 'integer' },
          unitPrice: { type: 'number' },
          sugarLevel: { type: 'string', nullable: true },
          spiceLevel: { type: 'string', nullable: true },
          addons: {
            type: 'array',
            items: { type: 'string' },
          },
          product: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              image: { type: 'string' },
              price: { type: 'number' },
            },
            required: ['id', 'name', 'image', 'price'],
          },
        },
        required: ['id', 'productId', 'quantity', 'unitPrice', 'addons', 'product'],
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          tableId: { type: 'string' },
          status: {
            type: 'string',
            enum: [...orderStatus],
          },
          total: { type: 'number' },
          notes: { type: 'string', nullable: true },
          estimatedTime: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          table: {
            type: 'object',
            properties: {
              number: { type: 'integer' },
              label: { type: 'string' },
            },
            required: ['number', 'label'],
          },
          orderItems: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' },
          },
        },
        required: [
          'id',
          'tableId',
          'status',
          'total',
          'estimatedTime',
          'createdAt',
          'updatedAt',
          'table',
          'orderItems',
        ],
      },
      OrderResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { $ref: '#/components/schemas/Order' },
        },
        required: ['success', 'data'],
      },
      WaiterRequestPayload: {
        type: 'object',
        properties: {
          tableNumber: { type: 'integer' },
          requestType: {
            type: 'string',
            enum: [...waiterRequestTypes],
          },
        },
        required: ['tableNumber', 'requestType'],
      },
      WaiterRequest: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          tableId: { type: 'string' },
          requestType: {
            type: 'string',
            enum: [...waiterRequestTypes],
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'RESOLVED'],
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'tableId', 'requestType', 'status', 'createdAt'],
      },
      WaiterRequestResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            allOf: [
              { $ref: '#/components/schemas/WaiterRequest' },
              {
                type: 'object',
                properties: {
                  table: {
                    type: 'object',
                    properties: {
                      number: { type: 'integer' },
                      label: { type: 'string' },
                    },
                    required: ['number', 'label'],
                  },
                },
              },
            ],
          },
        },
        required: ['success', 'data'],
      },
      Table: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          number: { type: 'integer' },
          label: { type: 'string' },
          isActive: { type: 'boolean' },
        },
        required: ['id', 'number', 'label', 'isActive'],
      },
      TableResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { $ref: '#/components/schemas/Table' },
        },
        required: ['success', 'data'],
      },
    },
  },
};