import ImageService from '../../src/services/imageService';
import imageRepository from '../../src/repositories/imageRepository';
import { CreateImagesDTO } from '../../src/controllers/dtos/imagesDTOs/createImagesDTO';
import { Images } from '../../src/models/imagesModel';
import { Readable } from 'stream';
import { MOCK_IMAGES } from './constants/MOCK_IMAGES';
import sharp from 'sharp'; // 실제 sharp 라이브러리를 import
import { TooManyFilesException } from '../../src/exceptions/images/TooManyFiles';
import { OnlyOneImageAllowedException } from '../../src/exceptions/images/OnlyOneImageObjectAllowed';
import { MissingFilesException } from '../../src/exceptions/images/MissingFiles';
import { UpdateImagesDTO } from '../../src/controllers/dtos/imagesDTOs/updateImagesDTO';
import { NotFoundImagesException } from '../../src/exceptions/images/NotFoundImages';
import { FindImagesDTO } from '../../src/controllers/dtos/imagesDTOs/findImagesDTO';

// imageRepository mocking
jest.mock('../../src/repositories/imageRepository');
const mockedImagesRepository = imageRepository as jest.Mocked<
  typeof imageRepository
>;

// sharp mocking
jest.mock('sharp');
(sharp as unknown as jest.Mock).mockReturnValue({
  resize: jest.fn().mockReturnThis(),
  toBuffer: jest.fn().mockResolvedValue(Buffer.from('mocked image data')),
});

// private methods mocking
jest.spyOn(ImageService as any, '_resizeImage').mockImplementation(async () => {
  return Buffer.from('Mocked Resized Images');
});

jest
  .spyOn(ImageService as any, '_uploadImageToStorage')
  .mockImplementation(async () => {
    return {
      url: 'Mocked Url',
      key: 'Mocked Key',
    };
  });

jest
  .spyOn(ImageService as any, '_purgeStorageImages')
  .mockImplementation(async () => {
    console.log();
  });

const USER_ID = 'userId';

const TEST_FILE: Express.Multer.File = {
  fieldname: 'fileField',
  originalname: 'testfile.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('FakeBuffer', 'utf-8'),
  size: 0,
  stream: new Readable(),
  destination: 'test',
  filename: 'testfile',
  path: '/test/',
};

describe('ImageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createImages()', () => {
    it('should return images when valid createImagesDTO is provided', async () => {
      const createImagesDTO: CreateImagesDTO = {
        userId: USER_ID,
        files: [TEST_FILE, TEST_FILE],
      };

      mockedImagesRepository.findByUserId.mockResolvedValue(null);
      mockedImagesRepository.create.mockResolvedValue(MOCK_IMAGES);

      const images: Images = await ImageService.createImages(createImagesDTO);

      expect(images).toHaveProperty('urls');
    });

    it('should throw TooManyFilesException when too many files provided', async () => {
      const createImagesDTO: CreateImagesDTO = {
        userId: USER_ID,
        files: [
          TEST_FILE,
          TEST_FILE,
          TEST_FILE,
          TEST_FILE,
          TEST_FILE,
          TEST_FILE,
        ],
      };

      mockedImagesRepository.findByUserId.mockResolvedValue(null);

      try {
        await ImageService.createImages(createImagesDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(TooManyFilesException);
      }
    });

    it('should throw OnlyOneImageAllowedException when images metadata found', async () => {
      const createImagesDTO: CreateImagesDTO = {
        userId: USER_ID,
        files: [TEST_FILE, TEST_FILE],
      };

      mockedImagesRepository.findByUserId.mockResolvedValue(MOCK_IMAGES);

      try {
        await ImageService.createImages(createImagesDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(OnlyOneImageAllowedException);
      }
    });

    it('should throw MissingFilesException when images not provided', async () => {
      const createImagesDTO: CreateImagesDTO = {
        userId: USER_ID,
        files: [],
      };

      mockedImagesRepository.findByUserId.mockResolvedValue(null);

      try {
        await ImageService.createImages(createImagesDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(MissingFilesException);
      }
    });
  });

  describe('updateImages()', () => {
    it('should return updated images when valid createImagesDTO is provided', async () => {
      const updateImagesDTO: UpdateImagesDTO = {
        userId: USER_ID,
        files: [TEST_FILE],
      };

      mockedImagesRepository.findByUserId.mockResolvedValue(MOCK_IMAGES);
      mockedImagesRepository.update.mockResolvedValue(MOCK_IMAGES);

      const images: Images = await ImageService.updateImages(updateImagesDTO);

      expect(images).toHaveProperty('urls');
    });

    it('should throw NotFoundImagesException when images metadata found', async () => {
      const updateImagesDTO: UpdateImagesDTO = {
        userId: USER_ID,
        files: [TEST_FILE, TEST_FILE],
      };

      mockedImagesRepository.findByUserId.mockResolvedValue(null);

      try {
        await ImageService.updateImages(updateImagesDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundImagesException);
      }
    });

    it('should throw MissingFilesException when images not provided', async () => {
      const updateImagesDTO: UpdateImagesDTO = {
        userId: USER_ID,
        files: [],
      };

      mockedImagesRepository.findByUserId.mockResolvedValue(null);

      try {
        await ImageService.updateImages(updateImagesDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(MissingFilesException);
      }
    });

    it('should throw TooManyFilesException when too many files provided', async () => {
      const updateImagesDTO: UpdateImagesDTO = {
        userId: USER_ID,
        files: [
          TEST_FILE,
          TEST_FILE,
          TEST_FILE,
          TEST_FILE,
          TEST_FILE,
          TEST_FILE,
        ],
      };

      mockedImagesRepository.findByUserId.mockResolvedValue(null);

      try {
        await ImageService.updateImages(updateImagesDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(TooManyFilesException);
      }
    });
  });

  describe('findImages()', () => {
    it('should return images', async () => {
      const findImagesDTO: FindImagesDTO = {
        userId: USER_ID,
      };

      mockedImagesRepository.findByUserId.mockResolvedValue(MOCK_IMAGES);

      const images: Images = await ImageService.findImages(findImagesDTO);

      expect(images).toHaveProperty('urls');
    });

    it('should throw NotFoundImagesException when images metadata found', async () => {
      const findImagesDTO: FindImagesDTO = {
        userId: USER_ID,
      };

      mockedImagesRepository.findByUserId.mockResolvedValue(null);

      try {
        await ImageService.findImages(findImagesDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundImagesException);
      }
    });
  });
});
