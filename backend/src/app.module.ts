import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumnosModule } from './alumnos/alumnos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'db',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'usuario_pro',
      password: process.env.DB_PASSWORD ?? 'password_seguro',
      database: process.env.DB_NAME ?? 'escuela_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AlumnosModule,
  ],
})
export class AppModule {}
