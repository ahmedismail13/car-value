import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/users.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  async approveReport(@Body() body: ApproveReportDto, @Param() id: string) {
    return await this.reportsService.changeApproval(id, body.approved);
  }
}
