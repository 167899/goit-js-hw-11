export default function fetchPicture(input, key, page) {
  const URL = 'https://pixabay.com/api/';
  const option = {
    params: {
      key: `${key}`,
      q: `${input}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: '40',
      page: `${page}`,
    },
  };
  return axios.get(URL, option);
}
