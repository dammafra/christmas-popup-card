export function generateShortURL(originalURL: string) {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: 'pk_ZdHFlp5JbkSMUG1Q',
    },
    body: JSON.stringify({
      skipQS: false,
      archived: false,
      originalURL,
      domain: 'dammafra.short.gy',
    }),
  }

  return fetch('https://api.short.io/links/public', options)
    .then(res => res.json())
    .then(res => res.secureShortURL)
    .catch(err => {
      console.error(err)
      return originalURL
    })
}
