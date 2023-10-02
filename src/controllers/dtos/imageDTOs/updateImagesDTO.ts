export interface UpdateImagesDTO {
  readonly userId: string;
  readonly files: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[]
}