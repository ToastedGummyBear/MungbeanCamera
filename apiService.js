const API_URL = 'http://192.168.68.116:5001/predict'; //
//const API_URL = 'http://127.0.0.1:5001/predict';
export const predictImage = async (base64Image) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });
      if (!response.ok) {
        throw new Error('HTTP error! Status: ${response.status}');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error predicting image:', error);
      throw error;
    }
  };