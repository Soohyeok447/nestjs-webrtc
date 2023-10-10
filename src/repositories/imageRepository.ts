import { Images, ImagesModel } from '../models/imagesModel';

class ImageRepository {
  public async create({ userId, keys, urls }: Images): Promise<Images> {
    const image = new ImagesModel({ userId, keys, urls });

    return await image.save();
  }

  public async findByUserId(userId: string): Promise<Images | null> {
    return await ImagesModel.findOne({ userId }).exec();
  }

  public async update({ userId, keys, urls }: Images): Promise<Images> {
    const images = await ImagesModel.findOne({ userId }).exec();

    images.urls = urls;
    images.keys = keys

    return await images.save();
  }
}

export default new ImageRepository();