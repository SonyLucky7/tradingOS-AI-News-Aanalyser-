import Jimp from 'jimp';
import { GifFrame, GifUtil } from 'gifwrap';
import path from 'path';

async function convert() {
  try {
    const inputPath = 'C:\\\\Users\\\\sonyl\\\\.gemini\\\\antigravity\\\\brain\\\\59cfa022-8b51-410b-a029-860a40a6c4db\\\\tradeos_splash_1784962267375.jpg';
    console.log(`Reading image from ${inputPath}`);
    
    // Read the generated JPG
    const image = await Jimp.read(inputPath);
    
    // Resize to a standard installer splash size (width 600)
    image.resize(600, Jimp.AUTO);

    // Create a GIF frame
    const frame = new GifFrame(image.bitmap);
    
    // Quantize colors (GIFs only support 256 colors)
    GifUtil.quantizeDekker(frame, 256);
    
    // Write out the GIF
    const outputPath = path.join(process.cwd(), 'splash.gif');
    await GifUtil.write(outputPath, [frame]);
    
    console.log(`Successfully created splash.gif at ${outputPath}`);
  } catch (err) {
    console.error('Error converting to GIF:', err);
  }
}

convert();
