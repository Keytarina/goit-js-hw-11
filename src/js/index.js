import PixabayAPIService from './pixabay-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// Посилання
const refs = {
  formSubmit: document.querySelector('form.search-form'),
  //   input: document.querySelector('form>input'),
  gallery: document.querySelector('ul.gallery'),
  loadBtn: document.querySelector('button.load-btn'),
};
const pixabayAPIService = new PixabayAPIService();
let gallery = '';

// Слухач події submit
refs.formSubmit.addEventListener('submit', onFormSubmit);
refs.loadBtn.addEventListener('click', loadMorePictures);
// Функція, що відправляє запит на сервер
//і передає результати у функцію яка рендерить картки в галереї
async function onFormSubmit(event) {
  event.preventDefault();
  const inputValue = event.target.searchQuery.value.trim();
  refs.gallery.innerHTML = '';
  refs.loadBtn.classList.add('is-hidden');
  pixabayAPIService.resetPageNumber();

  if (inputValue === '') {
    Notify.failure('The input field cannot be empty!');
    return;
  }

  try {
    pixabayAPIService.searchQuery = inputValue;
    const data = await pixabayAPIService.fetchPictures();
    renderCard(data);

    if (data.totalHits === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.',
        2000
      );
    } else if (
      pixabayAPIService.page ===
      Math.ceil(data.totalHits / pixabayAPIService.perPage)
    ) {
      Notify.info(`Hooray! We found ${data.totalHits} images.`, 2000);
    } else {
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
      refs.loadBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    Notify.failure('Oops, something got wrong, try to reboot page!', 2000);
    console.log(error);
  }
}

async function loadMorePictures(event) {
  try {
    pixabayAPIService.incrementPageNumber();
    const data = await pixabayAPIService.fetchPictures();
    gallery.destroy();
    renderCard(data);

    if (
      pixabayAPIService.page ===
      Math.ceil(data.totalHits / pixabayAPIService.perPage)
    ) {
      refs.loadBtn.classList.add('is-hidden');
      Notify.warning(
        "We're sorry, but you've reached the end of search results.",
        2000
      );
    }
  } catch (error) {
    Notify.failure('Oops, something got wrong, try to reboot page!', 2000);
    console.log(error);
  }
}

// Функція яка рендерить картки в галереї
function renderCard(data) {
  const markup = data.hits
    .map(card => {
      return `
    	<li class='gallery__item'>
    		<a class="gallery__link" href="${card.largeImageURL}">
    			<img class="gallery__image"
    			src="${card.webformatURL}"
    			alt="${card.tags}"
    			/>
    		</a>
    		<div class="gallery__info">
    			<p class="gallery__info-item">
    			<b>Likes: ${card.likes}</b>
    			</p>
    			<p class="gallery__info-item">
    			<b>Views: ${card.views}</b>
    			</p>
    			<p class="gallery__info-item">
    			<b>Comments: ${card.comments}</b>
    			</p>
    			<p class="gallery__info-item">
    			<b>Downloads: ${card.downloads}</b>
    			</p>
    		</div>
    	</li>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}
