import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from 'mongodb';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import * as crypto from 'crypto';
import { CreateAdminDto } from './dto/admin.dto';



function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<User>,private jwtService: JwtService,private config:ConfigService) {}


  //셋팅
  async insertAll() {
    // 초기 관리자, 에디터 , 오퍼 셋팅
 
    try{
     
      const adminInfo =  JSON.parse(this.config.get<string>('adminInfo')??'{}');
      adminInfo.pwd = hashPassword(adminInfo.pwd);
      // console.log(adminInfo);
    
      const operatorInfo = JSON.parse(this.config.get<string>('operatorInfo')??'{}');
      operatorInfo.pwd = hashPassword(operatorInfo.pwd);
      // console.log(operatorInfo);
      const auditorInfo = JSON.parse(this.config.get<string>('auditorInfo')??'{}');
      auditorInfo.pwd = hashPassword(auditorInfo.pwd);
      // console.log(auditorInfo);
     
      const adminRealDB =  await this.adminModel.findOne({email:adminInfo.email})
      const operatorRealDB = await this.adminModel.findOne({email:operatorInfo.email})
      const auditorRealDB = await this.adminModel.findOne({email:auditorInfo.email})
      if (adminRealDB || operatorRealDB || auditorRealDB) {
        throw new Error('이미 등록된 계정이 존재합니다');
      }

      const adminDB = new this.adminModel(adminInfo);
      const operatorDB = new this.adminModel(operatorInfo);
      const auditorDB = new this.adminModel(auditorInfo);
      await adminDB.save();
      await operatorDB.save();
      await  auditorDB.save();
      return true;
    }catch(err){
      throw new Error(err.message);
    }
  } // setting

  //로그인
   async adminLogin(adminDto:CreateAdminDto):Promise<any>{
      //암호 해쉬화
      const hashedPwd = hashPassword(adminDto.pwd);
      const realdb = await this.adminModel.findOne({email:adminDto.email,pwd:hashedPwd})
      console.log("db:::",realdb);
      
      if(!realdb){
        throw new Error();
      }
      const payload = { email: realdb.email,role:realdb.role};
      console.log("payload :",payload);
      
  
      // JWT 토큰 생성
      const token = this.jwtService.sign(payload);
      console.log("token: ",token);

      return {token:token};
      
}
}// class

