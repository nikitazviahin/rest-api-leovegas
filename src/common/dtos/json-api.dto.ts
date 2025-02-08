export class JsonApiMetaDto {
  meta?: Record<string, any>;
}

export class JsonApiLinksDto {
  links?: Record<string, string>;
}

export class JsonApiDataDto<T> extends JsonApiMetaDto {
  type: string;

  id: string;

  attributes: T;

  links?: JsonApiLinksDto;
}

export class JsonApiResponseDto<T> extends JsonApiMetaDto {
  data: JsonApiDataDto<T>;

  links?: JsonApiLinksDto;
}
