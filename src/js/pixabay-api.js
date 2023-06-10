import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37101348-01b9475ae8f5d0f542cc9660e';

export default async function fetchPictures(inputValue) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: inputValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const { data } = await axios.get(`${BASE_URL}?${params}`);
  if (data.totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  Notify.info(`Hooray! We found ${data.totalHits} images.`);
  return data;
}
