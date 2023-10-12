import { Images, ImagesModel } from '../models/imagesModel';

class ImageRepository {
  public async create({ userId, keys, urls }: Images): Promise<Images> {
    try {
      const image = new ImagesModel({ userId, keys, urls });

      return await image.save();
    } catch (error) {
      throw error;
    }
  }

  public async findByUserId(userId: string): Promise<Images | null> {
    try {
      return await ImagesModel.findOne({ userId }).exec();
    } catch (error) {
      throw error;
    }
  }

  public async update({ userId, keys, urls }: Images): Promise<Images> {
    try {
      const images = await ImagesModel.findOne({ userId }).exec();

      images.urls = urls;
      images.keys = keys

      return await images.save();
    } catch (error) {
      throw error
    }
  }
}

export default new ImageRepository();