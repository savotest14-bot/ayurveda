import { ENV } from '../config/env.js';

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Varsha Ayurveda E-Commerce API",
    description: "Production REST API for Varsha Ayurveda e-commerce, admin dashboard, Razorpay payments, and WhatsApp COD ordering.",
    version: "1.0.0",
    contact: {
      name: "Varsha Ayurveda Support",
      email: "info@varshaayurveda.in",
      url: "https://vershaayurveda.com"
    }
  },
  servers: [
    {
      url: `${ENV.BACKEND_URL}/api`,
      description: "Current Backend Server"
    },
    {
      url: "https://api.vershaayurveda.com/api",
      description: "Production API Server"
    },
    {
      url: "http://localhost:5000/api",
      description: "Local Development Server"
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT Authorization header using Bearer scheme"
      }
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errors: { type: "array", items: { type: "string" } }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string", nullable: true },
          role: { type: "string", enum: ["ADMIN", "CUSTOMER"] },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          slug: { type: "string" },
          shortDescription: { type: "string", nullable: true },
          description: { type: "string" },
          price: { type: "number" },
          compareAtPrice: { type: "number", nullable: true },
          stock: { type: "integer" },
          sku: { type: "string", nullable: true },
          categoryId: { type: "integer" },
          featured: { type: "boolean" },
          active: { type: "boolean" },
          ingredients: { type: "string", nullable: true },
          benefits: { type: "string", nullable: true },
          usage: { type: "string", nullable: true },
          weight: { type: "string", nullable: true },
          images: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                url: { type: "string" },
                sortOrder: { type: "integer" }
              }
            }
          }
        }
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string", nullable: true },
          image: { type: "string", nullable: true },
          active: { type: "boolean" },
          sortOrder: { type: "integer" }
        }
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "integer" },
          orderNumber: { type: "string" },
          customerName: { type: "string" },
          customerEmail: { type: "string" },
          customerPhone: { type: "string" },
          shippingAddress: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          pincode: { type: "string" },
          subtotal: { type: "number" },
          shippingCharge: { type: "number" },
          discount: { type: "number" },
          totalAmount: { type: "number" },
          paymentMethod: { type: "string", enum: ["COD_WHATSAPP", "RAZORPAY"] },
          paymentStatus: { type: "string", enum: ["PENDING", "PAID", "FAILED", "REFUNDED", "COD_PENDING", "COD_CONFIRMED"] },
          orderStatus: { type: "string", enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] },
          items: { type: "array", items: { type: "object" } }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        summary: "API Health Check",
        responses: {
          200: { description: "API status is healthy" }
        }
      }
    },
    "/auth/register": {
      post: {
        summary: "Customer Registration",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string", minLength: 6 },
                  phone: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Email already registered or validation error" }
        }
      }
    },
    "/auth/login": {
      post: {
        summary: "User / Admin Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "JWT access token and user profile" },
          401: { description: "Invalid email or password" }
        }
      }
    },
    "/auth/me": {
      get: {
        summary: "Get current authenticated profile",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Current user profile" },
          401: { description: "Unauthorized" }
        }
      }
    },
    "/products": {
      get: {
        summary: "List catalog products",
        parameters: [
          { name: "categoryId", in: "query", schema: { type: "integer" } },
          { name: "featured", in: "query", schema: { type: "boolean" } },
          { name: "search", in: "query", schema: { type: "string" } }
        ],
        responses: {
          200: { description: "List of active products" }
        }
      }
    },
    "/products/{slug}": {
      get: {
        summary: "Get single product by slug",
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Product details" },
          404: { description: "Product not found" }
        }
      }
    },
    "/categories": {
      get: {
        summary: "List active product categories",
        responses: {
          200: { description: "Categories list" }
        }
      }
    },
    "/blogs": {
      get: {
        summary: "List published blog articles",
        responses: {
          200: { description: "Blog articles list" }
        }
      }
    },
    "/orders/cod-whatsapp": {
      post: {
        summary: "Create COD WhatsApp Order",
        description: "Validates prices server-side, decreases stock, saves order to PostgreSQL, and returns formatted WhatsApp redirect URL.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["customerName", "customerEmail", "customerPhone", "shippingAddress", "city", "state", "pincode", "items"],
                properties: {
                  customerName: { type: "string" },
                  customerEmail: { type: "string" },
                  customerPhone: { type: "string" },
                  shippingAddress: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                  pincode: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["productId", "quantity"],
                      properties: {
                        productId: { type: "integer" },
                        quantity: { type: "integer", minimum: 1 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Order created in PostgreSQL and WhatsApp URL generated" }
        }
      }
    },
    "/orders/create-razorpay": {
      post: {
        summary: "Create Razorpay Order",
        description: "Validates stock & prices server-side, creates PostgreSQL Order, creates Razorpay Order, and returns razorpayOrderId.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["customerName", "customerEmail", "customerPhone", "shippingAddress", "city", "state", "pincode", "items"]
              }
            }
          }
        },
        responses: {
          201: { description: "Razorpay order created" }
        }
      }
    },
    "/payments/razorpay/verify": {
      post: {
        summary: "Verify Razorpay Payment Signature",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId", "razorpayOrderId", "razorpayPaymentId", "razorpaySignature"],
                properties: {
                  orderId: { type: "integer" },
                  razorpayOrderId: { type: "string" },
                  razorpayPaymentId: { type: "string" },
                  razorpaySignature: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Payment verified, order updated to PAID/CONFIRMED" },
          400: { description: "Invalid signature verification" }
        }
      }
    },
    "/payments/razorpay/webhook": {
      post: {
        summary: "Idempotent Razorpay Webhook Handler",
        description: "Verifies X-Razorpay-Signature header against raw body, handles payment.captured, payment.failed, order.paid.",
        responses: {
          200: { description: "Webhook event processed" }
        }
      }
    },
    "/contact": {
      post: {
        summary: "Submit Contact Message",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "message"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  message: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Message recorded" }
        }
      }
    },
    "/settings": {
      get: {
        summary: "Get Public Store Settings",
        responses: {
          200: { description: "Store settings (shipping threshold, WhatsApp, contact)" }
        }
      }
    }
  }
};

export const getSwaggerHtml = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Varsha Ayurveda API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #fafafa; font-family: sans-serif; }
    .topbar { background-color: #166534 !important; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>
`;
