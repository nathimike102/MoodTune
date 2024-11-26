import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MODELS_DIR = path.join(__dirname, '../public/models');
const WEIGHTS_URLS = {
  'tiny_face_detector_model-weights_manifest.json': 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1': 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1',
  'face_expression_model-weights_manifest.json': 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json',
  'face_expression_model-shard1': 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1'
};

async function downloadFile(url, outputPath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  });

  fs.writeFileSync(outputPath, response.data);
}

async function setupModels() {
  if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
  }

  for (const [filename, url] of Object.entries(WEIGHTS_URLS)) {
    const outputPath = path.join(MODELS_DIR, filename);
    if (!fs.existsSync(outputPath)) {
      console.log(`Downloading ${filename}...`);
      await downloadFile(url, outputPath);
    }
  }

  console.log('Face detection models setup complete!');
}

setupModels().catch(console.error);