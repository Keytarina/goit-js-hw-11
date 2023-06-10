import fetchPictures from './pixabay-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formSubmit: document.querySelector('form.search-form'),
  input: document.querySelector('form>input'),
  gallery: document.querySelector('ul.gallery'),
};

refs.formSubmit.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';

  const inputValue = event.target.searchQuery.value.trim();

  fetchPictures(inputValue).then(data => {
    renderCard(data);
  });
}

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

  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}
