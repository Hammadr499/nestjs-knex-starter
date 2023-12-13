import { randomInt } from 'crypto';

export const makeRandomID = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomInt(characters.length));
  }

  return result;
};

// export const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   callback: any,
// ) => {
//   if (
//     !['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG'].includes(
//       extname(file.originalname),
//     )
//   ) {
//     return callback(
//       new BadRequestException('Image type is not valid. '),
//       false,
//     );
//   } else {
//     return callback(null, true);
//   }
// };
