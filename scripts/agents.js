let agents = []

// Fetch agents from Valorant API
async function fetchAgents() {
  try {
    const response = await fetch('https://valorant-api.com/v1/agents')
    const data = await response.json()
    agents = data.data.filter((agent) => agent.isPlayableCharacter)
    updateAgentGrid(agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    const agentGrid = document.getElementById('agentGrid')
    agentGrid.innerHTML =
      '<p class="text-center col-span-full text-red-500">Failed to load agents. Please try again later.</p>'
  }
}

// Generate agent card from given agent
function createAgentCard(agent) {
  const card = document.createElement('card')
  card.className =
    'bg-gradient-to-b from-[#' +
    agent.backgroundGradientColors[0] +
    ']/90 via-[#' +
    agent.backgroundGradientColors[1] +
    ']/90 via-[#' +
    agent.backgroundGradientColors[2] +
    ']/90 to-[#' +
    agent.backgroundGradientColors[3] +
    ']/90 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105'
  card.innerHTML = `
                <img src="${
                  agent.killfeedPortrait || agent.displayIcon
                }" alt="${agent.displayName}" class="w-full h-40 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-semibold font-tungsten">${
                      agent.displayName
                    }</h2>
                    <p class="text-gray-300 font-din-next">${
                      agent.role ? agent.role.displayName : 'Unknown Role'
                    }</p>
                </div>
            `
  card.addEventListener('click', () => showAgentDetails(agent))
  return card
}

// Add detailed agent info in agent modal and unhide modal
function showAgentDetails(agent) {
  document.getElementById('modalAgentName').textContent = agent.displayName
  document.getElementById('modalAgentImage').src =
    agent.fullPortrait || agent.displayIcon
  document.getElementById('modalAgentImage').alt = agent.displayName
  document.getElementById('modalAgentRole').textContent = agent.role
    ? agent.role.displayName
    : 'Unknown Role'
  document.getElementById('modalAgentRole').className =
    'text-white text-lg font-semibold text-center font-din-next ps-2'
  document.getElementById('modalAgentRoleImage').src = agent.role.displayIcon
  document.getElementById('modalAgentDescription').textContent =
    agent.description
  document.getElementById('modalAgentDescription').className =
    'text-gray-300 mb-4 font-din-next rounded-lg shadow-md bg-gray-900 p-2'
  const abilitiesList = document.getElementById('modalAgentAbilities')
  abilitiesList.innerHTML = ''
  agent.abilities.forEach((ability) => {
    const li = document.createElement('li')
    li.textContent = `${ability.displayName}: ${ability.description}`
    li.className = 'text-white rounded-lg shadow-md bg-gray-900 p-2'
    abilitiesList.appendChild(li)
  })
  document.getElementById('agentModal').classList.remove('hidden')
  document.getElementById('modalAgentArea').className =
    "bg-[url('" +
    agent.background +
    "')] bg-[#" +
    agent.backgroundGradientColors[1] +
    '] bg-center rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-scroll'
}

// Hide agent modal
function hideAgentDetails() {
  document.getElementById('agentModal').classList.add('hidden')
}

// Filters agents based on query
function filterAgents(query) {
  const lowercaseQuery = query.toLowerCase()
  return agents.filter(
    (agent) =>
      agent.displayName.toLowerCase().includes(lowercaseQuery) ||
      (agent.role &&
        agent.role.displayName.toLowerCase().includes(lowercaseQuery))
  )
}

// Add filtered agents to the page content grid
function updateAgentGrid(filteredAgents) {
  const agentGrid = document.getElementById('agentGrid')
  agentGrid.innerHTML = ''
  if (filteredAgents.length === 0) {
    const noResults = document.createElement('p')
    noResults.textContent = 'No agents found.'
    noResults.className = 'text-center col-span-full text-white'
    agentGrid.appendChild(noResults)
  } else {
    filteredAgents.forEach((agent) => {
      agentGrid.appendChild(createAgentCard(agent))
    })
  }
}

// Runs on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchAgents()

  // Close modal on close button click
  document
    .getElementById('closeModal')
    .addEventListener('click', hideAgentDetails)

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
    const filteredAgents = filterAgents(query)
    updateAgentGrid(filteredAgents)
  })

  // Close modal when clicking outside
  const agentModal = document.getElementById('agentModal')
  agentModal.addEventListener('click', (event) => {
    if (event.target === agentModal) {
      hideAgentDetails()
    }
  })
})
