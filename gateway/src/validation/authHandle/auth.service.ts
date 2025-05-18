import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {ConfigService} from '@nestjs/config'
import { CreateUserDto } from '../userdto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private  httpService: HttpService,private config: ConfigService,) {}

  //setting 초기 세팅 (관리자 / 운영자 / 에디터 등록 계정 1개씩 , 이벤트 코드 생성)
  async setting():Promise<any>{
    const url = this.config.get<string>('AUTH_SERVICE_URL')+"/admin/setting";
    const url2 = this.config.get<string>('EVENT_SERVICE_URL')+"/event/setting";
    try {
      const response1 = await firstValueFrom(
        this.httpService.get(url),
      );
      const response2 = await firstValueFrom(
        this.httpService.get(url2),
      );
      // auth:3001번 포트 API 응답 데이터 리턴
      return {"res 1 ": response1.data,
        "res 2 ": response2.data
      };  
    } catch (error) {
      // 에러 핸들링
      throw new Error('setting failed' + error.message);
    }
  }

// 유저 로그인 3001 포트
  async authLogin(userDto: { email: string; pwd: string }): Promise<any> {
    // 3001번 로그인 API 주소 env파일 참조
    const url = this.config.get<string>('AUTH_SERVICE_URL')+"/user/login";
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, userDto),
      );
      // auth:3001번 포트 API 응답 데이터 리턴
      return response.data;  
    } catch (error) {
      // 에러 핸들링
      throw new Error('Login failed: ' + error.message);
    }
  }

  // 유저 등록
  async userInsert(userDto:CreateUserDto): Promise<any> {
    const url = this.config.get<string>('AUTH_SERVICE_URL')+"/user/create";
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, userDto),
      );
      // auth:3001번 포트 API 응답 데이터 리턴
      return response.data;  
    } catch (error) {
      // 에러 핸들링
      throw new Error('Login failed: ' + error.message);
    }
  }
  //관리자 로그인
  async adminLogin(adminDto:{email:string;pwd:string}):Promise<any>{
    const url = this.config.get<string>('AUTH_SERVICE_URL')+"/admin/login"
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, adminDto),
      );
      // auth:3001번 포트 API 응답 데이터 리턴
      return response.data;  
    } catch (error) {
      // 에러 핸들링
      throw new Error('Login failed: ' + error.message);
    }
  }

  
}
