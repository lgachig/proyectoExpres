import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { Alumno } from './entities/alumno.entity';

@Injectable()
export class AlumnosService {
  constructor(
    @InjectRepository(Alumno)
    private readonly alumnosRepository: Repository<Alumno>,
  ) {}

  create(createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    const alumno = this.alumnosRepository.create(createAlumnoDto);
    return this.alumnosRepository.save(alumno);
  }

  findAll(): Promise<Alumno[]> {
    return this.alumnosRepository.find({ order: { id: 'ASC' } });
  }

  async remove(id: number): Promise<void> {
    await this.alumnosRepository.delete(id);
  }
}
