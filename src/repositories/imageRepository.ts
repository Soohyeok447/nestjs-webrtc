import { Images, ImagesModel } from '../models/imagesModel';

class ImageRepository {
  public async create({ id, userId, urls }: Images): Promise<Images> {
    const image = new ImagesModel({ id, userId, urls });

    return await image.save();
  }

  public async findByUserId(id: string): Promise<Images | null> {
    return await ImagesModel.findById(id).exec();
  }
}

export default new ImageRepository();