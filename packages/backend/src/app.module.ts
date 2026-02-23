import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BondModule } from './bond/bond.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    BondModule,
    HealthModule,
  ],
})
export class AppModule {}
