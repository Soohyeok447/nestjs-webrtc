import { Request, Response } from 'express';
import ImageService from '../services/imageService';
import { Images } from '../models/imagesModel';
import { CreateImagesDTO } from './dtos/imagesDTOs/createImagesDTO';
import { UpdateImagesDTO } from './dtos/imagesDTOs/updateImagesDTO';
import { FindImagesDTO } from './dtos/imagesDTOs/findImagesDTO';
import { TooManyFilesException } from '../exceptions/images/TooManyFiles';
import { OnlyOneImageAllowedException } from '../exceptions/images/OnlyOneImageObjectAllowed';
import { MissingFilesException } from '../exceptions/images/MissingFiles';
import { NotFoundImagesException } from '../exceptions/images/NotFoundImages';

class ImageController {
  /**
   * @swagger
   * /api/images/:
   *   post:
   *     summary: 이미지 여러장 업로드
   *     description: '이미지를 업로드합니다. <br>
   *        이 api를 호출할 때는 유효한 accessToken이 필요합니다. <br><br>
   *        파일 갯수 제한은 현재 5개이고 <br>
   *        accessToken에 저장된 userId를 pk로 저장합니다.<br>
   *        urls 프로퍼티에는 스토리지에 매핑된 이미지의 url들이 저장되므로 이 url들을 사용하면 됩니다.<br>
   *        유저는 한 번만 이미지를 저장할 수 있고 그 이후로는 update api를 통해 이미지를 변경해야합니다. <br><br>
   *
   *        `[Header]`<br>
   *        Authorization AccessToken (Required)<br><br>
   *
   *        `[multipart/form-data]`<br>
   *        images: file[] (Required)<br><br>
   *
   *        `[Exceptions]`<br>
   *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
   *        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
   *        code: 1002 (401) - 토큰이 만료된 경우<br>
   *        code: 2 (400) - 파일이 multipart/form-data 형식으로 제공되지 않은 경우 | 파일이 없는 경우<br>
   *        code: 3 (409) - 이미 유저가 이미지를 한 번 저장한 경우<br>
   *        code: 4 (400) - 파일 갯수 제한보다 많은 파일을 생성 요청한 경우'
   *     tags: [ Images ]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               images:
   *                 type: array
   *                 items:
   *                   type: file
   *     responses:
   *       201:
   *         description: 이미지 업로드 성공. 이 urls 프로퍼티들을 사용하면됩니다.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Images'
   *       400:
   *         description: 제공된 파일이 없는 경우 | 제한된 갯수보다 많은 파일로 요청한 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TooManyFilesException'
   *       401:
   *         description: 토큰이 만료된 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TokenExpiredException'
   *       409:
   *         description: 이미 생성한 이미지가 있는데 다시 생성하려고 시도한 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/OnlyOneImageAllowedException'
   *       500:
   *         description: 내부 서버 오류가 발생한 경우.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: 서버 내부 에러
   *                 error:
   *                   type: object
   *                   example: {}
   */
  public async createImages(req: Request, res: Response) {
    try {
      const createImagesDto: CreateImagesDTO = {
        userId: req.userId,
        files: req.files,
      };

      const createdImages: Images =
        await ImageService.createImages(createImagesDto);

      return res.status(201).json({
        userId: createdImages.userId,
        keys: createdImages.keys,
        urls: createdImages.urls,
        createdAt: createdImages.createdAt,
        updatedAt: createdImages.updatedAt,
      });
    } catch (error) {
      if (error instanceof MissingFilesException) {
        return res.status(400).json(error);
      }

      if (error instanceof OnlyOneImageAllowedException) {
        return res.status(409).json(error);
      }

      if (error instanceof TooManyFilesException) {
        return res.status(400).json(error);
      }

      return res.status(500).json({ message: '서버 내부 에러', error });
    }
  }

  /**
   * @swagger
   * /api/images/:
   *   put:
   *     summary: 이미지 여러장 수정
   *     description: '이미지를 수정합니다. <br>
   *        이 api를 호출할 때는 유효한 accessToken이 필요합니다. <br><br>
   *        파일 갯수 제한은 현재 5개입니다. <br><br>
   *        한 번 유저가 이미지를 create한 경우, 수정 api로만 이미지 수정이 가능합니다.<br><br>
   *        urls 프로퍼티에는 스토리지에 매핑된 이미지의 url들이 저장되므로 이 url들을 사용하면 됩니다.<br>
   *        유저는 한 번만 이미지를 저장할 수 있고 그 이후로는 update api를 통해 이미지를 변경해야합니다. <br><br>
   *
   *        `[Header]`<br>
   *        Authorization AccessToken (Required)<br><br>
   *
   *        `[multipart/form-data]`<br>
   *        images: file[] (Required)<br><br>
   *
   *        `[Exceptions]`<br>
   *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
   *        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
   *        code: 1002 (401) - 토큰이 만료된 경우<br>
   *        code: 1 (404) - 파일 메타데이터를 DB에서 찾지 못한 경우 <br>
   *        code: 2 (400) - 파일이 multipart/form-data 형식으로 제공되지 않은 경우 | 파일이 없는 경우<br>
   *        code: 4 (400) - 파일 갯수 제한보다 많은 파일을 생성 요청한 경우'
   *     tags: [ Images ]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               images:
   *                 type: array
   *                 items:
   *                   type: file
   *     responses:
   *       201:
   *         description: 이미지 재업로드 성공. 이 urls 프로퍼티들을 사용하면됩니다.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Images'
   *       400:
   *         description: 제공된 파일이 없는 경우 | 제한된 갯수보다 많은 파일로 요청한 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TooManyFilesException'
   *       401:
   *         description: 토큰이 만료된 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TokenExpiredException'
   *       404:
   *         description: DB에서 메타데이터를 찾는 것을 실패한 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/NotFoundImagesException'
   *       500:
   *         description: 내부 서버 오류가 발생한 경우.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: 서버 내부 에러
   *                 error:
   *                   type: object
   *                   example: {}
   */
  public async updateImages(req: Request, res: Response) {
    try {
      const updateImagesDTO: UpdateImagesDTO = {
        userId: req.userId,
        files: req.files,
      };

      const updatedImages: Images =
        await ImageService.updateImages(updateImagesDTO);

      res.status(201).json({
        userId: updatedImages.userId,
        keys: updatedImages.keys,
        urls: updatedImages.urls,
        createdAt: updatedImages.createdAt,
        updatedAt: updatedImages.updatedAt,
      });
    } catch (error) {
      if (error instanceof NotFoundImagesException) {
        return res.status(404).json(error);
      }

      if (error instanceof MissingFilesException) {
        return res.status(400).json(error);
      }

      if (error instanceof TooManyFilesException) {
        return res.status(400).json(error);
      }

      return res.status(500).json({ message: '서버 내부 에러', error });
    }
  }

  /**
   * @swagger
   * /api/images/me:
   *   get:
   *     summary: 내 이미지 찾기
   *     description: '내 이미지를 찾습니다.<br>
   *       accessToken에 들어있는 userId로 본인의 이미지를 찾습니다. <br>
   *       저장된 이미지가 없는 경우 404를 반환합니다.<br><br>
   *
   *       `[Header]`<br>
   *       Authorization AccessToken (Required)<br><br>
   *
   *       `[Exceptions]`<br>
   *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
   *        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
   *        code: 1002 (401) - 토큰이 만료된 경우<br>
   *        code: 1 (404) - 파일 메타데이터를 DB에서 찾지 못한 경우 <br>'
   *     tags: [ Images ]
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: false
   *         description: 인증에 사용되는 헤더 토큰.
   *         schema:
   *           type: string
   *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
   *     responses:
   *       200:
   *         description: 내 이미지 찾기 성공.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Images'
   *       401:
   *         description: 토큰이 만료된 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TokenExpiredException'
   *       404:
   *         description: DB에서 메타데이터를 찾는 것을 실패한 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/NotFoundImagesException'
   *       500:
   *         description: 내부 서버 오류가 발생한 경우.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: 서버 내부 에러
   *                 error:
   *                   type: object
   *                   example: {}
   */
  public async findMyImages(req: Request, res: Response) {
    try {
      const findImagesDTO: FindImagesDTO = {
        userId: req.userId,
      };

      const images: Images = await ImageService.findImages(findImagesDTO);

      res.status(200).json({
        userId: images.userId,
        keys: images.keys,
        urls: images.urls,
        createdAt: images.createdAt,
        updatedAt: images.updatedAt,
      });
    } catch (error) {
      if (error instanceof NotFoundImagesException) {
        return res.status(404).json(error);
      }

      return res.status(500).json({ message: '서버 내부 에러', error });
    }
  }

  /**
   * @swagger
   * /api/images/{userId}:
   *   get:
   *     summary: 동적 파라미터 userId로 이미지 찾기
   *     description: '이미지를 찾습니다.<br>
   *       Path Parameter에 있는 userId로 이미지를 찾습니다. <br>
   *       저장된 이미지가 없는 경우 404를 반환합니다.<br><br>
   *
   *       `[Header]`<br>
   *       Authorization AccessToken (Required)<br><br>
   *
   *       `[Path Parameter]`<br>
   *       userId: String (Required)<br><br>
   *
   *       `[Exceptions]`<br>
   *        code: 1000 (401) - 유효하지 않은 토큰일 경우<br>
   *        code: 1001 (401) - 토큰이 제공되지 않은 경우<br>
   *        code: 1002 (401) - 토큰이 만료된 경우 <br>
   *        code: 1 (404) - 파일 메타데이터를 DB에서 찾지 못한 경우 <br>'
   *     tags: [ Images ]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         description: 검색할 사용자의 ID.
   *         schema:
   *           type: string
   *       - in: header
   *         name: Authorization
   *         required: false
   *         description: 인증에 사용되는 헤더 토큰.
   *         schema:
   *           type: string
   *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
   *     responses:
   *       200:
   *         description: 이미지 찾기 성공.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Images'
   *       401:
   *         description: 토큰이 만료된 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TokenExpiredException'
   *       404:
   *         description: DB에서 메타데이터를 찾는 것을 실패한 경우
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/NotFoundImagesException'
   *       500:
   *         description: 내부 서버 오류가 발생한 경우.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: 서버 내부 에러
   *                 error:
   *                   type: object
   *                   example: {}
   */
  public async findImages(req: Request, res: Response) {
    try {
      const findImagesDTO: FindImagesDTO = {
        userId: req.params.userId,
      };

      const images: Images = await ImageService.findImages(findImagesDTO);

      res.status(200).json({
        userId: images.userId,
        keys: images.keys,
        urls: images.urls,
        createdAt: images.createdAt,
        updatedAt: images.updatedAt,
      });
    } catch (error) {
      if (error instanceof NotFoundImagesException) {
        return res.status(404).json(error);
      }

      return res.status(500).json({ message: '서버 내부 에러', error });
    }
  }
}

export default new ImageController();
