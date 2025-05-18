import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/user.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

// Hash 256 암호화로 비밀번호 공개노출 방지했습니다.
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,private jwtService: JwtService,) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users; 
  }
  // 회원가입 초기 회원가입 중복이메일 차단(예외처리) 했습니다.
  async insert(createuser:CreateUserDto):Promise<User>{
  // 암호 해쉬화
    const hashedPwd = hashPassword(createuser.pwd);
    const realdb = await this.userModel.findOne({email:createuser.email})
    
    if(realdb){
      throw new Error();
    }
    try{
      const userdb = new this.userModel({email:createuser.email,pwd:hashedPwd,nick:createuser.nick});
      return userdb.save();
    }catch{
      throw new Error('회원가입 실패');
    }
    
  }
// 로그인
  async userlogin(createuser:CreateUserDto):Promise<any>{
    //암호 해쉬화
    const hashedPwd = hashPassword(createuser.pwd);
    const realdb = await this.userModel.findOne({email:createuser.email,pwd:hashedPwd})
    console.log("db:::",realdb);
    
    if(!realdb){
      throw new Error();
    }
    const payload = { email: realdb.email,nick:realdb.nick,role:realdb.role};
    console.log("payload :",payload);
    

    // JWT 토큰 생성
    
    const token = this.jwtService.sign(payload);
    console.log("token: ",token);
    
    return {
      message: '로그인 성공',
      token,
      user: realdb,
    };
  }
}
