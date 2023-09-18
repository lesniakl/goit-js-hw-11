import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import { fetchPhotos, getQuery, currentPage } from './js/pixabay_api';

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const input = document.querySelector('.search-input');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  getQuery(input.value, 1);
  currentPage = 1;
  gallery.innerHTML = '';
});
