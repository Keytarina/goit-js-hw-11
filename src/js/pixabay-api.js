import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37101348-01b9475ae8f5d0f542cc9660e';

export default class PixabayAPIService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }
  async fetchPictures() {
    const params = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.perPage,
    });
    const { data } = await axios.get(`${BASE_URL}?${params}`);
    return data;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  resetPageNumber() {
    this.page = 1;
  }
  incrementPageNumber() {
    this.page += 1;
  }
}
