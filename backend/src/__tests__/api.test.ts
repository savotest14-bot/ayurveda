import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { PaymentService } from '../services/paymentService.js';
import crypto from 'crypto';
import { ENV } from '../config/env.js';

describe('Varsha Ayurveda API Tests', () => {
  let adminToken = '';
  let customerToken = '';
  let customerId = '';
  let sampleProductId = 0;
  let sampleCategoryId = 0;
  let sampleBlogId = 0;
  let sampleOrderId = 0;
  let testOrderNumber = '';

  it('Health Check endpoint should return healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  describe('Authentication & RBAC', () => {
    it('Admin can login successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@varshaayurveda.in',
          password: 'Admin@12345'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe('ADMIN');
      adminToken = res.body.data.token;
    });

    it('Customer can register a new account', async () => {
      const testEmail = `testuser_${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Customer',
          email: testEmail,
          phone: '9876543210',
          password: 'Password@123'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe('CUSTOMER');
      customerToken = res.body.data.token;
      customerId = res.body.data.user.id;
    });

    it('Customer can login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'customer@gmail.com',
          password: 'Customer@12345'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('Unauthorized admin access is blocked with 403', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Unauthenticated requests are blocked with 401', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(401);
    });
  });

  describe('Categories API', () => {
    it('Get public categories returns seeded categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      sampleCategoryId = res.body.data[0].id;
    });

    it('Admin can create, update, and delete a category', async () => {
      const createRes = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Churnas',
          description: 'Herbal churna category for testing'
        });

      expect(createRes.status).toBe(201);
      const catId = createRes.body.data.id;

      const updateRes = await request(app)
        .put(`/api/admin/categories/${catId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Churnas' });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.name).toBe('Updated Churnas');

      const delRes = await request(app)
        .delete(`/api/admin/categories/${catId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(delRes.status).toBe(200);
    });
  });

  describe('Products API', () => {
    it('Get public products returns active products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data.products.length).toBeGreaterThan(0);
      sampleProductId = res.body.data.products[0].id;
    });

    it('Get product by slug returns correct details', async () => {
      const res = await request(app).get('/api/products/drl-strong-mushroom-powder');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toContain('Mushroom');
      expect(res.body.data.price).toBe(360);
    });

    it('Admin can create, update, and delete a product', async () => {
      const createRes = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Ashwagandha Gold Tablets',
          description: 'Premium Ashwagandha tablets for stress relief and vitality.',
          price: 299,
          compareAtPrice: 399,
          stock: 50,
          categoryId: sampleCategoryId,
          ingredients: 'Ashwagandha root extract 500mg'
        });

      expect(createRes.status).toBe(201);
      const prodId = createRes.body.data.id;

      const updateRes = await request(app)
        .put(`/api/admin/products/${prodId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ stock: 80 });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.stock).toBe(80);

      const delRes = await request(app)
        .delete(`/api/admin/products/${prodId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(delRes.status).toBe(200);
    });
  });

  describe('Blogs API', () => {
    it('Get public blogs returns articles', async () => {
      const res = await request(app).get('/api/blogs');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      sampleBlogId = res.body.data[0].id;
    });

    it('Admin can create and delete a blog post', async () => {
      const createRes = await request(app)
        .post('/api/admin/blogs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'The Power of Triphala',
          excerpt: 'Triphala is one of the most revered herbal blends in Ayurveda.',
          content: 'Full article content describing the three myrobalans of Triphala...',
          author: 'Dr. Varsha'
        });

      expect(createRes.status).toBe(201);
      const blogId = createRes.body.data.id;

      const delRes = await request(app)
        .delete(`/api/admin/blogs/${blogId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(delRes.status).toBe(200);
    });
  });

  describe('Orders & Payment Flows', () => {
    it('Creates COD WhatsApp order with reliable backend price calculation and WhatsApp URL', async () => {
      const res = await request(app)
        .post('/api/orders/cod-whatsapp')
        .send({
          customerName: 'Aarav Patel',
          customerEmail: 'aarav@example.com',
          customerPhone: '9898989898',
          shippingAddress: '12 Blossom Residency, MP Nagar',
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          pincode: '462011',
          paymentMethod: 'COD_WHATSAPP',
          items: [{ productId: sampleProductId, quantity: 1 }]
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order.paymentMethod).toBe('COD_WHATSAPP');
      expect(res.body.data.order.paymentStatus).toBe('COD_PENDING');
      expect(res.body.data.order.orderStatus).toBe('PENDING');
      expect(res.body.data.whatsappUrl).toContain('https://wa.me/');
      expect(res.body.data.whatsappMessage).toContain('VARSHA AYURVEDA');

      sampleOrderId = res.body.data.order.id;
      testOrderNumber = res.body.data.order.orderNumber;
    });

    it('Rejects order if product stock is exceeded', async () => {
      const res = await request(app)
        .post('/api/orders/cod-whatsapp')
        .send({
          customerName: 'Test Buyer',
          customerEmail: 'buyer@example.com',
          customerPhone: '9898989898',
          shippingAddress: 'Address',
          city: 'City',
          state: 'State',
          pincode: '462011',
          paymentMethod: 'COD_WHATSAPP',
          items: [{ productId: sampleProductId, quantity: 999999 }]
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Insufficient stock');
    });

    it('Creates Razorpay order with server-calculated amount', async () => {
      const res = await request(app)
        .post('/api/orders/create-razorpay')
        .send({
          customerName: 'Priya Sharma',
          customerEmail: 'priya@example.com',
          customerPhone: '9812345678',
          shippingAddress: '44 Lake View',
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          pincode: '462001',
          paymentMethod: 'RAZORPAY',
          items: [{ productId: sampleProductId, quantity: 1 }]
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.razorpayOrder.id).toBeDefined();
      expect(res.body.data.razorpayOrder.amount).toBeGreaterThan(0);
    });

    it('Verifies Razorpay payment signature correctly', () => {
      const orderId = 'order_test_123456';
      const paymentId = 'pay_test_987654';
      const expectedSig = crypto
        .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const isValid = PaymentService.verifySignature(orderId, paymentId, expectedSig);
      expect(isValid).toBe(true);

      const isInvalid = PaymentService.verifySignature(orderId, paymentId, 'invalid_signature');
      expect(isInvalid).toBe(false);
    });

    it('Admin can update order status and confirm COD order', async () => {
      const res = await request(app)
        .put(`/api/admin/orders/${sampleOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          orderStatus: 'CONFIRMED',
          paymentStatus: 'COD_CONFIRMED'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.orderStatus).toBe('CONFIRMED');
      expect(res.body.data.paymentStatus).toBe('COD_CONFIRMED');
    });
  });

  describe('Contact Messages API', () => {
    it('Public user can submit a contact message', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Deepak Joshi',
          email: 'deepak@example.com',
          phone: '9822334455',
          message: 'Can I take Shilajit powder alongside other Ayurvedic supplements?'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Admin Dashboard Stats', () => {
    it('Admin can fetch dashboard analytics with charts and overview metrics', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.overview).toBeDefined();
      expect(res.body.data.overview.totalOrders).toBeGreaterThan(0);
      expect(res.body.data.charts.dailyTrends).toBeDefined();
      expect(res.body.data.charts.orderStatusDistribution).toBeDefined();
    });
  });
});
