import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-auth/jwt.strategy';
import { AuthController } from '../authHandle/auth.controller';
import { AuthService } from '../authHandle/auth.service';
import { HttpModule } from '@nestjs/axios';
import { RolesGuard } from './role-guard/roles.guard';
import { PassportModule } from '@nestjs/passport';
import { EventModule } from '../eventHandle/event.module';
import { EventService } from '../eventHandle/event.service';
import { EventController } from '../eventHandle/event.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),  
    HttpModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController,EventController],
  providers: [JwtStrategy,AuthService,RolesGuard,EventService],
  exports: [JwtModule,],
})
export class JwtAuthModule {}
