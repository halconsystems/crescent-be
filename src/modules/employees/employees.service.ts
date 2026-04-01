import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        emailId: dto.emailId,
        primaryMobileNo: dto.primaryMobileNo,
        cnic: dto.cnic,
        designation: dto.designation,
        nextOfKin: dto.nextOfKin,
        nextOfKinContact: dto.nextOfKinContact,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.employee.findMany({ orderBy: { employeeId: 'asc' } });
  }

  async findOne(employeeId: number) {
    const row = await this.prisma.employee.findUnique({ where: { employeeId } });
    if (!row) throw new NotFoundException(`Employee ${employeeId} not found`);
    return row;
  }

  async update(employeeId: number, dto: UpdateEmployeeDto) {
    await this.findOne(employeeId);
    return this.prisma.employee.update({ where: { employeeId }, data: dto });
  }

  async remove(employeeId: number) {
    await this.findOne(employeeId);
    return this.prisma.employee.delete({ where: { employeeId } });
  }
}
