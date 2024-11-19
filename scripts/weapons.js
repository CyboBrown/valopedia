let weapons = []

// Fetch agents from Valorant API
async function fetchWeapons() {
  try {
    const response = await fetch('https://valorant-api.com/v1/weapons')
    const data = await response.json()
    weapons = data.data
    updateWeaponGrid(weapons)
  } catch (error) {
    console.error('Error fetching weapons:', error)
    const weaponGrid = document.getElementById('weaponGrid')
    weaponGrid.innerHTML =
      '<p class="text-center col-span-full text-red-500">Failed to load weapons. Please try again later.</p>'
  }
}

// Generate weapon card from given weapon
function createWeaponCard(weapon) {
  const card = document.createElement('div')
  card.className =
    'bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105'
  card.innerHTML = `
                <img src="${weapon.displayIcon}" alt="${
    weapon.displayName
  }" class="bg-[url('images/weapon-card-background.jpg')] w-full h-40 object-contain p-4">
                <div class="p-4 border-t">
                    <h2 class="text-xl font-semibold font-tungsten">${
                      weapon.displayName
                    }</h2>
                    <p class="text-darker font-din-next">${
                      weapon.shopData ? weapon.shopData.categoryText : 'Special'
                    }</p>
                    ${
                      weapon.shopData
                        ? `<p class="text-sm text-dark font-din-next">Cost: ${weapon.shopData.cost}</p>`
                        : ''
                    }
                </div>
            `
  card.addEventListener('click', () => showWeaponDetails(weapon))
  return card
}

// Add detailed weapon info in weapon modal and unhide modal
function showWeaponDetails(weapon) {
  document.getElementById('modalWeaponName').textContent = weapon.displayName
  document.getElementById('modalWeaponImage').src = weapon.displayIcon
  document.getElementById('modalWeaponImage').alt = weapon.displayName
  document.getElementById('modalWeaponCategory').textContent = weapon.shopData
    ? weapon.shopData.categoryText
    : 'Special'
  document.getElementById('modalWeaponCategory').className =
    'text-darker font-din-next'
  document.getElementById('modalWeaponCost').textContent = weapon.shopData
    ? `${weapon.shopData.cost} Credits`
    : 'N/A'
  document.getElementById('modalWeaponCost').className =
    'text-darker font-din-next'

  const statsDiv = document.getElementById('modalWeaponStats')
  statsDiv.innerHTML = ''

  if (weapon.weaponStats) {
    const stats = weapon.weaponStats
    const statItems = [
      { label: 'Fire Rate', value: stats.fireRate },
      { label: 'Magazine Size', value: stats.magazineSize },
      { label: 'Reload Time', value: `${stats.reloadTimeSeconds}s` },
      { label: 'Wall Penetration', value: stats.wallPenetration },
      {
        label: 'ADS Multiplier',
        value: stats.adsStats?.zoomMultiplier || 'N/A',
      },
    ]

    statItems.forEach((item) => {
      if (item.value) {
        const statDiv = document.createElement('div')
        statDiv.className = 'bg-lightest p-3 rounded-lg'
        statDiv.innerHTML = `
                            <h4 class="font-semibold">${item.label}</h4>
                            <p class="text-darker">${item.value}</p>
                        `
        statsDiv.appendChild(statDiv)
      }
    })
  } else {
    const statDiv = document.createElement('div')
    statDiv.className = 'bg-lightest p-3 rounded-lg'
    statDiv.innerHTML = `<p class="text-darker">No stats available.</p>`
    statsDiv.appendChild(statDiv)
  }

  const skinsDiv = document.getElementById('modalWeaponSkins')
  const skinsGrid = skinsDiv.querySelector('div')
  skinsGrid.innerHTML = ''

  weapon.skins.slice(0, 6).forEach((skin) => {
    if (skin.displayName.toLowerCase().includes('standard')) return
    const skinDiv = document.createElement('div')
    skinDiv.className = 'bg-lightest p-3 rounded-lg'
    skinDiv.innerHTML = `
                    <img src="${skin.displayIcon || weapon.displayIcon}" alt="${
      skin.displayName
    }" class="w-full h-24 object-contain mb-2">
                    <h4 class="font-semibold text-sm">${skin.displayName}</h4>
                `
    skinsGrid.appendChild(skinDiv)
  })

  document.getElementById('weaponModal').classList.remove('hidden')
}

// Hide weapon modal
function hideWeaponDetails() {
  document.getElementById('weaponModal').classList.add('hidden')
}

// Filters weapons based on query
function filterWeapons(query) {
  const lowercaseQuery = query.toLowerCase()
  return weapons.filter(
    (weapon) =>
      weapon.displayName.toLowerCase().includes(lowercaseQuery) ||
      (weapon.shopData &&
        weapon.shopData.categoryText.toLowerCase().includes(lowercaseQuery))
  )
}

// Add filtered weapons to the page content grid
function updateWeaponGrid(filteredWeapons) {
  const weaponGrid = document.getElementById('weaponGrid')
  weaponGrid.innerHTML = ''
  if (filteredWeapons.length === 0) {
    const noResults = document.createElement('p')
    noResults.textContent = 'No weapons found.'
    noResults.className = 'text-center col-span-full text-dark'
    weaponGrid.appendChild(noResults)
  } else {
    filteredWeapons.forEach((weapon) => {
      weaponGrid.appendChild(createWeaponCard(weapon))
    })
  }
}

// Runs on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchWeapons()

  // Close modal on close button click
  document
    .getElementById('closeModal')
    .addEventListener('click', hideWeaponDetails)

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
    const filteredWeapons = filterWeapons(query)
    updateWeaponGrid(filteredWeapons)
  })

  // Close modal when clicking outside
  const weaponModal = document.getElementById('weaponModal')
  weaponModal.addEventListener('click', (event) => {
    if (event.target === weaponModal) {
      hideWeaponDetails()
    }
  })
})
