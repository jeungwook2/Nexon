import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // 여기서 반드시 부모의 canActivate 호출
    return super.canActivate(context);
  }
  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException('토큰이 유효하지 않거나 로그인이 필요합니다.');
    }
    return user;
  }
}
