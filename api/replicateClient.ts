import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Asset } from 'expo-asset';

const PIAPI_KEY = process.env.EXPO_PUBLIC_PIAPI_KEY || '';

/**
 * Compresses an image and converts it to a base64 Data URI.
 */
export async function getCompressedBase64Image(uri: string | number): Promise<string> {
  let localUri = typeof uri === 'string' ? uri : '';

  // If it's a local module asset, download it to file system first
  if (typeof uri === 'number' || (typeof uri === 'string' && uri.startsWith('http'))) {
    const asset = await Asset.fromModule(uri).downloadAsync();
    localUri = asset.localUri || asset.uri;
  }

  // Compress the image to avoid hitting API size limits (especially since assets are ~7MB)
  const manipResult = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: 1024 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  return `data:image/jpeg;base64,${manipResult.base64}`;
}

/**
 * Triggers the face-swap API on PiAPI and polls until completion.
 */
export async function generateWisdomSelfie(targetImageUri: string | number, swapImageUri: string | number): Promise<string> {
  const targetBase64 = await getCompressedBase64Image(targetImageUri);
  const swapBase64 = await getCompressedBase64Image(swapImageUri);

  // 1. Trigger the prediction
  console.log('PiAPI Async Request: Triggering face swap...');
  const response = await fetch('https://api.piapi.ai/api/face_swap/v1/async', {
    method: 'POST',
    headers: {
      'X-API-Key': PIAPI_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      target_image: targetBase64,
      swap_image: swapBase64,
      result_type: 'url'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PiAPI Async HTTP Error:', errorText);
    throw new Error(`Failed to start prediction: ${errorText}`);
  }

  const prediction = await response.json();
  console.log('PiAPI Async Response:', JSON.stringify(prediction));

  if (prediction.code !== 200) {
    throw new Error(`PiAPI error (${prediction.code}): ${prediction.message || JSON.stringify(prediction)}`);
  }
  
  let predictionId = prediction.data.task_id;

  // 2. Poll for the result
  while (true) {
    console.log(`PiAPI Fetch Request: Polling task ${predictionId}...`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Poll every 2 seconds

    const statusResponse = await fetch(`https://api.piapi.ai/api/face_swap/v1/fetch`, {
      method: 'POST',
      headers: {
        'X-API-Key': PIAPI_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        task_id: predictionId
      })
    });

    if (!statusResponse.ok) {
      const fetchErrorText = await statusResponse.text();
      console.error('PiAPI Fetch HTTP Error:', fetchErrorText);
      throw new Error(`Failed to check prediction status: ${fetchErrorText}`);
    }

    const statusData = await statusResponse.json();
    console.log('PiAPI Fetch Response:', JSON.stringify(statusData));

    if (statusData.code === 200) {
      if (statusData.data.status === 'success' || statusData.data.status === 'completed') {
        return statusData.data.image || statusData.data.image_url || statusData.data.url || statusData.data.result;
      } else if (statusData.data.status === 'failed' || statusData.data.status === 'canceled') {
        throw new Error(`Prediction failed: ${JSON.stringify(statusData.data)}`);
      }
    } else {
       throw new Error(`PiAPI polling error: ${statusData.message || JSON.stringify(statusData)}`);
    }
    // If starting or processing (statusData.data.status === 'pending' or similar), continue polling...
  }
}
