let maps = []

// Fetch maps from Valorant API
async function fetchMaps() {
  try {
    const response = await fetch('https://valorant-api.com/v1/maps')
    const data = await response.json()
    maps = data.data
    updateMapGrid(maps)
  } catch (error) {
    console.error('Error fetching maps:', error)
    const mapGrid = document.getElementById('mapGrid')
    mapGrid.innerHTML =
      '<p class="text-center col-span-full text-red-500">Failed to load maps. Please try again later.</p>'
  }
}

// Generate map card from given map
function createMapCard(map) {
  const card = document.createElement('div')
  card.className =
    'bg-white bg-opacity-75 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105'
  card.innerHTML = `
                <img src="${
                  map.listViewIconTall || 'images/weapon-card-background.jpg'
                }" alt="${map.displayName}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-semibold font-tungsten">${
                      map.displayName
                    }</h2>
                    <p class="text-darker font-din-next">${
                      map.coordinates || 'Location Unknown'
                    }</p>
                </div>
            `
  card.addEventListener('click', () => showMapDetails(map))
  return card
}

// Add detailed maap info in map modal and unhide modal
function showMapDetails(map) {
  document.getElementById('modalMapName').textContent = map.displayName
  document.getElementById('modalMapImage').src = map.splash
  document.getElementById('modalMapImage').alt = map.displayName
  document.getElementById('modalMapCoordinates').textContent =
    map.coordinates || 'Location Unknown'
  document.getElementById('modalMapCoordinates').className =
    'text-sm text-darker mb-2 font-din-next'
  document.getElementById('modalMapDescription').textContent =
    map.narrativeDescription || 'No description available.'
  document.getElementById('modalMapDescription').className =
    'text-darker mb-4 font-din-next'
  if (map.displayIcon) {
    document.getElementById('modalMapBlueprint').classList.remove('hidden')
    document.getElementById('modalMapBlueprintImage').src = map.displayIcon
    document.getElementById('modalMapBlueprintImage').alt =
      map.displayName + ' Blueprint'
  } else {
    document.getElementById('modalMapBlueprint').classList.add('hidden')
  }

  document.getElementById('mapModal').classList.remove('hidden')
}

// Hide map modal
function hideMapDetails() {
  document.getElementById('mapModal').classList.add('hidden')
}

// Filters maps based on query
function filterMaps(query) {
  const lowercaseQuery = query.toLowerCase()
  return maps.filter(
    (map) =>
      map.displayName.toLowerCase().includes(lowercaseQuery) ||
      (map.coordinates &&
        map.coordinates.toLowerCase().includes(lowercaseQuery))
  )
}

// Add filtered maps to the page content grid
function updateMapGrid(filteredMaps) {
  const mapGrid = document.getElementById('mapGrid')
  mapGrid.innerHTML = ''
  if (filteredMaps.length === 0) {
    const noResults = document.createElement('p')
    noResults.textContent = 'No maps found.'
    noResults.className = 'text-center col-span-full text-white'
    mapGrid.appendChild(noResults)
  } else {
    filteredMaps.forEach((map) => {
      mapGrid.appendChild(createMapCard(map))
    })
  }
}

// Runs on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchMaps()

  // Close modal on close button click
  document
    .getElementById('closeModal')
    .addEventListener('click', hideMapDetails)

  // Show or hide mobile menu on click
  const mobileMenuButton = document.getElementById('mobileMenuButton')
  const mobileMenu = document.getElementById('mobile-menu')
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden')
  })

  // Update page on search input change
  const searchInput = document.getElementById('search')
  searchInput.addEventListener('input', (event) => {
    const query = event.target.value
    const filteredMaps = filterMaps(query)
    updateMapGrid(filteredMaps)
  })

  // Close modal when clicking outside
  const mapModal = document.getElementById('mapModal')
  mapModal.addEventListener('click', (event) => {
    if (event.target === mapModal) {
      hideMapDetails()
    }
  })
})
