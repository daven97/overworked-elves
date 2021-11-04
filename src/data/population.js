const BASE_URL = 'https://population.un.org/dataportalapi/api/v1';

export const getLocations = async () => {
  await fetch(`${BASE_URL}/locations`)
    .then(response => response.json())
    .then(result => {
      console.log('Success:', result);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}