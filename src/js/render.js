import Notiflix from 'notiflix';
import './fetch-picture';
// import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchPicture from './fetch-picture';

const picture = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const inputSearch = document.querySelector('.search-input');
const formSearch = document.querySelector('.search-form');

const key = '27831105-5e5b5e1ddfe0fd39cdbde4893';
const pre_page = 40;
let page = 1;

formSearch.addEventListener('submit', event => {
  event.preventDefault();
  page = 1;
  render(inputSearch.value, key, page, pre_page);
});

btnLoadMore.addEventListener('click', () => {
  page = page + 1;
  render(inputSearch.value, key, page, pre_page);
  // console.log('hi', page);
  return page;
});

async function render(input, key, page, pre_page) {
  try {
    const myData = await fetchPicture(input, key, page, pre_page);
    console.log(myData);
    if (myData.data.total !== 0) {
      let elements = myData.data.hits
        .map(e => {
          const item = `
  <a class="photo-card" href=${e.largeImageURL}>
    <img src="${e.webformatURL}" alt="${e.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${e.likes}
      </p>
      <p class="info-item">
        <b>Views</b>${e.views}
      </p>
      <p class="info-item">
        <b>Comments</b>${e.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${e.downloads}
      </p>
    </div>
  </a>`;
          return item;
        })
        .join(' ');

      if (page === 1) {
        picture.innerHTML = elements;
        Notiflix.Notify.success(`Hooray! We found ${myData.data.totalHits} images.`);
      } else {
        picture.insertAdjacentHTML('beforeend', elements);
      }
      if (
        picture.childElementCount >= pre_page &&
        picture.childElementCount < myData.data.totalHits
      ) {
        btnLoadMore.classList.remove('unvisible');
        console.log(myData.data.totalHits);
        console.log(picture.childElementCount);
      } else {
        btnLoadMore.classList.add('unvisible');
        if (page !== 1) {
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
      }
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again',
      );
    }

    formSearch.addEventListener('input', () => {
      if (inputSearch.value === '') {
        picture.innerHTML = '';
        btnLoadMore.classList.add('unvisible');
      }
    });

    const lightbox = new SimpleLightbox('.photo-card', {
      captionsData: 'alt',
      captionDelay: 250,
    });

    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}
