import { v2 as cloudinary } from 'cloudinary'
import { envs } from './envs';

cloudinary.config({ 
  cloud_name: envs.cloud_name, 
  api_key: envs.api_key, 
  api_secret: envs.api_secret,
  secure_distribution: 'mydomain.com',
  upload_prefix: 'https://api-eu.cloudinary.com'
});

export default cloudinary