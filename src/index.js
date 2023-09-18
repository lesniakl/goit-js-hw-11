import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const selectorError = document.querySelector('.error');
const loader = document.querySelector('.loader');
const loadBtn = document.querySelector('.load-more');
const input = document.querySelector('.search-input');

export let currentPage = 1;
let currentSearch = '';

const lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  getQuery(input.value, 1);
  currentPage = 1;
  gallery.innerHTML = '';
});

const queryParams = (q, p) => {
  return {
    params: {
      key: '39514162-fa9dcb7e2d6f74dc9ac05415a',
      q: q,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: '40',
      page: p,
    },
  };
};

export const getQuery = async (q, p) => {
  showLoader([gallery, selectorError, loadBtn]);
  try {
    const response = await axios.get(
      `https://pixabay.com/api/`,
      queryParams(q, p)
    );
    const allHits = await response.data;
    currentSearch = q;
    fillGallery(allHits);
  } catch (error) {
    hideLoader([selectorError]);
    Notiflix.Notify.failure(`${error.message}`);
  }
};

const fillGallery = data => {
  console.log(data);
  if (data.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    hideLoader([]);
    return;
  }
  const galleryContent = data.hits
    .map(e => {
      return `<div class="photo-card">
    <a class="photo-card__link" href="${e.largeImageURL}">
    <img class="photo-card__image" src="${e.webformatURL}" alt="${e.tags}">
    </a>
    <div class="info">
      <div class="info__item">
      <p class="info__text"><b>Likes</b></p>
        <p class="info__text">${e.likes}</p>
      </div>
      <div class="info__item">
      <p class="info__text"><b>Views</b></p>
        <p class="info__text">${e.views}</p>
      </div>
      <div class="info__item">
      <p class="info__text"><b>Comments</b></p>
        <p class="info__text">${e.comments}</p>
      </div>
      <div class="info__item">
      <p class="info__text"><b>Downloads</b></p>
        <p class="info__text">${e.downloads}</p>
      </div>
    </div>
  </div>`;
    })
    .join('');
  gallery.innerHTML += galleryContent;
  const pagesTotal = Math.ceil(data.totalHits / 40);
  if (pagesTotal <= currentPage) {
    lightbox.refresh();
    hideLoader([gallery]);
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
  lightbox.refresh();
  hideLoader([gallery, loadBtn]);
  loadBtn.addEventListener('click', loadMore);
};

const loadMore = () => {
  currentPage++;
  getQuery(currentSearch, currentPage);
  loadBtn.removeEventListener('click', loadMore);
};

function showLoader(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].classList.add('hidden');
  }
  loader.classList.remove('hidden');
}

function hideLoader(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].classList.remove('hidden');
  }
  loader.classList.add('hidden');
}
