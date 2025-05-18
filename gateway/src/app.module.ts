import { Module, OnModuleInit } from '@nestjs/common';
import { JwtAuthModule } from './validation/jwt/jwt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthController } from './validation/authHandle/auth.controller';
import { AuthService } from './validation/authHandle/auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
     HttpModule,
    //UserModule 에서 사용할 거니까 그보다 위에 로드 되어있어야함
    
    ConfigModule.forRoot({
      isGlobal: true,     // env 파일을 사용할 configueModule 의 범위를 전역으로 설정
    }),
    MongooseModule.forRootAsync({    // MongoDB 연결
      imports: [ConfigModule],
      inject: [ConfigService],
      //mongoDB 비동기로 연결하기 위한 함수 useFactory
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }), 
    JwtAuthModule,
   
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    if (this.connection.readyState === 1) {
      console.log('✅ MongoDB connected successfully! (readyState check)');
    } else {
      this.connection.on('connected', () => {
        console.log('✅ MongoDB connected successfully! (event check)');
      });
      this.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });
    }
  }
}
