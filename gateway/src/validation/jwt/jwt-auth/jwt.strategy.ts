import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    try{
      // 토큰 해독
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    }catch(err){
      throw new Error("(토큰값 오류 / 누락) 로그인을 먼저 진행하세요");
    }
    
  }
  async validate(payload: any) {
    console.log(payload);
    return { email:payload.email,nick: payload.nick, role: payload.role };
  }
}
