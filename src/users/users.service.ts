import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private reponsitory: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.reponsitory.create({ email, password });

    return this.reponsitory.save(user);
  }

  findOne(id: number) {
    if (!id) return null;
    return this.reponsitory.findOne(id);
  }

  find(email: string) {
    return this.reponsitory.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.reponsitory.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, attrs);
    return this.reponsitory.save(user);
  }

  async remove(id: number) {
    const user = await this.reponsitory.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    return this.reponsitory.remove(user);
  }
}
