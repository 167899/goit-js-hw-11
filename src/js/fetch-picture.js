import Notiflix from 'notiflix';
// import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const picture = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const inputSearch = document.querySelector('.search-input');
const formSearch = document.querySelector('.search-form');

let page = 1;

formSearch.addEventListener('submit', event => {
  event.preventDefault();
  page = 1;
  fetchPicture(inputSearch.value);
});

btnLoadMore.addEventListener('click', () => {
  page = page + 1;
  console.log(page);
  fetchPicture(inputSearch.value);
  return page;
});

async function fetchPicture(input) {
  const URL = 'https://pixabay.com/api/';
  const option = {
    params: {
      key: '27831105-5e5b5e1ddfe0fd39cdbde4893',
      q: `${input}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: '40',
      page: `${page}`,
    },
  };

  console.log(input);
  try {
    const myData = await axios.get(URL, option);

    console.log(myData.data.totalHits);
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
        picture.childElementCount >= option.params.per_page &&
        picture.childElementCount <= myData.data.totalHits
      ) {
        btnLoadMore.classList.remove('unvisible');
        console.log(myData.data.hits.length);
      } else {
        btnLoadMore.classList.add('unvisible');
        if (page !== 1) {
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
      }

      console.dir(picture.childElementCount);
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again',
      );
    }
    console.dir(inputSearch.value);

    formSearch.addEventListener('input', () => {
      if (inputSearch.value === '') {
        picture.innerHTML = '';
        btnLoadMore.classList.add('unvisible');
      }
      console.log(picture.childElementCount);
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
