'use strict'

document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.getElementById('lecture-search')
  const searchButton = document.getElementById('lecture-search-btn')

  const productCards = document.querySelectorAll('.product-card')

  searchButton.addEventListener('click', handleSearch)
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  })

  function handleSearch () {
    const searchValue = searchInput.value
    const searchValueLower = searchValue.toLowerCase()
    // Match search terms, if no match, set the card to display none, if the search is empty, show all.
    productCards.forEach(card => {
      const searchTerms = card.querySelector('.product-card__search-terms').dataset.searchTerms.split(' ')
      const searchTermsLower = searchTerms.map(term => term.toLowerCase())
      if (searchValue === '') {
        card.setAttribute('style', 'display: flex !important');
      } else {
        if (searchTermsLower.includes(searchValueLower)) {
          card.setAttribute('style', 'display: flex !important');
        } else {
          card.setAttribute('style', 'display: none !important');
        }
      }
    })
  }
})
