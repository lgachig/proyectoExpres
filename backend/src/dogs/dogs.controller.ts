import { Controller, Get, Query } from '@nestjs/common';
import { DogsService, DogsBreedsResponse } from './dogs.service';

@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Get('breeds')
  findBreeds(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
  ): Promise<DogsBreedsResponse> {
    return this.dogsService.findBreeds(pageNumber, pageSize);
  }
}
