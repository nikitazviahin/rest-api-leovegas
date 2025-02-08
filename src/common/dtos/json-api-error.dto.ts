export class JsonApiErrorSourceDto {
  pointer?: string;

  parameter?: string;
}

export class JsonApiErrorDto {
  status: string;

  title: string;

  detail: string;

  source?: JsonApiErrorSourceDto;
}

export class JsonApiErrorResponseDto {
  errors: JsonApiErrorDto[];
}
