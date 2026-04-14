import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { getRequiredEnv } from '../config/required-env';

type Life = {
  max: number;
  min: number;
};

type Weight = {
  max: number;
  min: number;
};

type BreedAttributes = {
  name: string;
  description: string;
  life: Life;
  male_weight: Weight;
  female_weight: Weight;
  hypoallergenic: boolean;
};

type Breed = {
  id: string;
  type: string;
  attributes: BreedAttributes;
};

type Pagination = {
  current: number;
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  records: number;
};

export type DogsBreedsResponse = {
  data: Breed[];
  meta: {
    pagination: Pagination;
  };
  links: {
    self: string;
    current: string;
    first: string;
    prev: string | null;
    next: string | null;
    last: string;
  };
};

@Injectable()
export class DogsService {
  async findBreeds(pageNumber: string, pageSize: string): Promise<DogsBreedsResponse> {
    const baseUrl = getRequiredEnv('DOG_API_BASE_URL');
    const breedsPath = getRequiredEnv('DOG_API_BREEDS_PATH');

    if (!pageNumber || !pageSize) {
      throw new BadRequestException(
        'Debes enviar pageNumber y pageSize en la consulta',
      );
    }

    const url = new URL(`${baseUrl}${breedsPath}`);
    url.searchParams.set('page[number]', pageNumber);
    url.searchParams.set('page[size]', pageSize);

    try {
      const response = await fetch(url.toString(), {
        headers: {
          accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new BadGatewayException(
          `Dog API respondio con estado ${response.status}`,
        );
      }

      return (await response.json()) as DogsBreedsResponse;
    } catch {
      throw new BadGatewayException('No fue posible consultar Dog API');
    }
  }
}
