import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './reports.entity';
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(reportdto: CreateReportDto, user: User): Promise<Report> {
    const report = this.reportRepository.create(reportdto);
    report.user = user;
    return await this.reportRepository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportRepository.findOne(id);
    if (!report) throw new NotFoundException('report not found');

    report.approved = approved;

    return await this.reportRepository.save(report);
  }
}
