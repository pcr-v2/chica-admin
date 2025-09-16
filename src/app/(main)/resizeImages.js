// const sharp = require("sharp");
// const fs = require("fs").promises;
// const path = require("path");

// /**
//  * 이미지를 height 600px로 리사이징하고 원본 파일을 덮어씁니다
//  * @param {string} imagePath - 리사이징할 이미지 파일의 경로
//  */
// async function resizeImage(imagePath) {
//   try {
//     // 파일이 존재하는지 확인
//     await fs.access(imagePath);

//     // 파일 확장자 확인
//     const ext = path.extname(imagePath).toLowerCase();
//     const supportedFormats = [
//       ".jpg",
//       ".jpeg",
//       ".png",
//       ".webp",
//       ".tiff",
//       ".gif",
//     ];

//     if (!supportedFormats.includes(ext)) {
//       throw new Error(`지원하지 않는 이미지 형식입니다: ${ext}`);
//     }

//     // 임시 파일 경로 생성
//     const tempPath = imagePath + ".temp";

//     // 이미지 리사이징 (height: 600px, width: auto)
//     await sharp(imagePath)
//       .resize({
//         height: 600,
//         width: null, // auto로 비율 유지
//         fit: "inside", // 비율을 유지하면서 지정된 크기 안에 맞춤
//         withoutEnlargement: false, // 원본보다 크게 확대 허용
//       })
//       .toFile(tempPath);

//     // 원본 파일을 리사이징된 파일로 교체
//     await fs.rename(tempPath, imagePath);

//     console.log(`✅ 이미지가 성공적으로 리사이징되었습니다: ${imagePath}`);

//     // 리사이징된 이미지 정보 출력
//     const metadata = await sharp(imagePath).metadata();
//     console.log(`📏 새로운 크기: ${metadata.width} x ${metadata.height}px`);
//   } catch (error) {
//     console.error(`❌ 오류 발생:`, error.message);

//     // 임시 파일이 있다면 삭제
//     try {
//       await fs.unlink(imagePath + ".temp");
//     } catch (cleanupError) {
//       // 임시 파일이 없어도 무시
//     }

//     throw error;
//   }
// }

// /**
//  * 여러 이미지를 일괄 리사이징
//  * @param {string[]} imagePaths - 리사이징할 이미지 파일 경로들의 배열
//  */
// async function resizeMultipleImages(imagePaths) {
//   console.log(`🔄 ${imagePaths.length}개의 이미지를 리사이징합니다...`);

//   for (let i = 0; i < imagePaths.length; i++) {
//     const imagePath = imagePaths[i];
//     console.log(
//       `\n[${i + 1}/${imagePaths.length}] 처리 중: ${path.basename(imagePath)}`,
//     );

//     try {
//       await resizeImage(imagePath);
//     } catch (error) {
//       console.error(`❌ ${imagePath} 처리 실패:`, error.message);
//       // 하나가 실패해도 계속 진행
//     }
//   }

//   console.log(`\n✨ 모든 이미지 처리가 완료되었습니다!`);
// }

// // 사용 예시
// async function example() {
//   // 단일 파일 리사이징
//   await resizeImage("./example.jpg");

//   // 여러 파일 일괄 리사이징
//   const imageFiles = ["./image1.jpg", "./image2.png", "./image3.webp"];
//   await resizeMultipleImages(imageFiles);
// }

// // 명령행에서 직접 실행할 경우
// if (require.main === module) {
//   const args = process.argv.slice(2);

//   if (args.length === 0) {
//     console.log("사용법: node resize.js <이미지경로1> [이미지경로2] ...");
//     console.log("예시: node resize.js ./photo.jpg ./image.png");
//     process.exit(1);
//   }

//   resizeMultipleImages(args).catch((error) => {
//     console.error("실행 중 오류 발생:", error.message);
//     process.exit(1);
//   });
// }

// module.exports = { resizeImage, resizeMultipleImages };
