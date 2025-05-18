import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { error } from 'console';
import { CreateAdminDto } from './dto/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('setting')
  async insertAll() {
    try{
      const result = await this.adminService.insertAll();
      return "Setting OK"
    }catch(err){
      return {
        errMsg :"Setting Fail",err:err.message
      }
    }
  }
  @Post('login')
  async adminLogin(@Body() adminDto:CreateAdminDto){
    try{
      return await this.adminService.adminLogin(adminDto);
    }catch(err){

    }
  }
  
}
