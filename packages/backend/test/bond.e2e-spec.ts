import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { CouponFrequency } from '@bond-yield/shared';

describe('Bond API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('api', { exclude: ['health'] });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('returns 200 and status ok', () =>
      request(app.getHttpServer())
        .get('/health')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'ok' });
        }));
  });

  describe('POST /api/v1/bond/calculate', () => {
    const validBody = {
      faceValue: 1000,
      annualCouponRate: 5,
      marketPrice: 1000,
      yearsToMaturity: 10,
      couponFrequency: CouponFrequency.ANNUAL,
    };

    it('returns 200 and bond output for valid input', () =>
      request(app.getHttpServer())
        .post('/api/v1/bond/calculate')
        .send(validBody)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('currentYield');
          expect(res.body).toHaveProperty('ytm');
          expect(res.body).toHaveProperty('totalInterestEarned');
          expect(res.body).toHaveProperty('premiumOrDiscount');
          expect(res.body).toHaveProperty('cashFlowSchedule');
          expect(Array.isArray(res.body.cashFlowSchedule)).toBe(true);
          expect(res.body.currentYield).toBeCloseTo(0.05);
        }));

    it('returns 400 with RFC 7807 format for invalid input', () =>
      request(app.getHttpServer())
        .post('/api/v1/bond/calculate')
        .send({ ...validBody, faceValue: -100 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('type');
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('status', 400);
          expect(res.body).toHaveProperty('detail');
        }));
  });
});
