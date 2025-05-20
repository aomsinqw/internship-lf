<template>
  <div class="gif-background">
    <div class="container">
      <h1 class="card d-flex text-center shadow rounded-5 p-3 bg-dark bg-opacity-50 text-white">Pokémon list</h1>

      <!-- ปุ่ม Go to Battle อยู่ใต้หัวข้อ Pokémon list -->
      <div class="text-center mb-4">
        <button class="btn btn-danger" @click="goToBattle">
          Go to Battle
        </button>
      </div>

      <nav class="navbar bg-light mb-5 text-center rounded">
        <div class="container">
          <form class="d-flex w-100" @submit.prevent="handleSearch">
            <input
              v-model="searchQuery"
              class="form-control me-2"
              type="search"
              placeholder="Search by name or type (e.g. fire, water, grass)..."
              aria-label="Search"
              @input="handleSearchInput"
            />
            <button class="btn btn-outline-danger" type="submit">Search</button>
            <button
              v-if="searchQuery"
              class="btn btn-outline-secondary ms-2"
              type="button"
              @click="clearSearch"
            >
              Clear
            </button>
          </form>
        </div>
      </nav>

      <!-- Grid layout -->
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4">
        <div v-for="poke in filteredPokemonList" :key="poke.id" class="col">
          <div
            class="card h-100 rounded-4 shadow text-center pokemon-card"
            style="cursor: pointer"
          >
            <img
              :src="poke.sprites.front_default"
              class="card-img-top rounded-4 bg-light p-3"
              alt="Pokemon image"
              @click="showPokemonDetail(poke)"
            />
            <div class="card-body">
              <h5 class="card-title text-capitalize">{{ poke.name }}</h5>
              <div class="text-center my-4">
                <button
                  class="btn btn-dark"
                  @click.stop="toggleSelectPokemon(poke)"
                >
                  {{ isSelected(poke) ? "Deselect" : "Select" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No results message -->
      <div
        v-if="searchQuery && filteredPokemonList.length === 0"
        class="text-center mt-5"
      >
        <div class="alert alert-info">
          <h5>Not found 404</h5>
          <p>
            Try searching by name or category, such as "fire", "water", "grass",
            or press the Clear button to see all
          </p>
        </div>
      </div>

      <!-- Infinite Scroll Trigger -->
      <div ref="bottomObserverEl" class="mt-4"></div>

      <!-- Loading State -->
      <div class="text-center mt-4" v-if="loading">
        <img
          src="https://i0.wp.com/lordlibidan.com/wp-content/uploads/2019/03/Running-Pikachu-GIF.gif?resize=480%2C342&ssl=1"
          alt="Loading..."
          width="80"
          height="80"
        />
      </div>

      <!-- Show Pikachu GIF when no more data -->
      <div class="text-center mt-3" v-if="!hasMore && !loading">
        <img
          src="https://i0.wp.com/lordlibidan.com/wp-content/uploads/2019/03/Running-Pikachu-GIF.gif?resize=480%2C342&ssl=1"
          alt="No more Pokémon"
          width="80"
          height="80"
        />
        <p>No more Pokémon Character</p>
      </div>
    </div>

    <!-- Pokemon Detail Modal -->
    <div
      class="modal fade"
      id="pokemonModal"
      tabindex="-1"
      aria-labelledby="pokemonModalLabel"
      aria-hidden="true"
      ref="pokemonModal"
    >
      <!-- Modal content ตามโค้ดเดิม (ยังไม่ได้เปลี่ยนแปลง) -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { store } from "../stores/store";

const pokemonList = ref([]);
const searchQuery = ref("");
const offset = ref(0);
const limit = 100;
const loading = ref(false);
const hasMore = ref(true);
const selectedPokemon = ref(null);
const pokemonModal = ref(null);

const router = useRouter();

// Filtered list based on searchQuery
const filteredPokemonList = computed(() => {
  if (!searchQuery.value) return pokemonList.value;
  const query = searchQuery.value.toLowerCase();

  return pokemonList.value.filter((pokemon) => {
    const nameMatch = pokemon.name.toLowerCase().includes(query);
    const typeMatch = pokemon.types.some((type) =>
      type.type.name.toLowerCase().includes(query)
    );
    return nameMatch || typeMatch;
  });
});

// Fetch more Pokémon from API
async function fetchMorePokemon() {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset.value}&limit=${limit}`
    );
    const data = await response.json();

    const promises = data.results.map((p) =>
      fetch(p.url).then((res) => res.json())
    );
    const detailedData = await Promise.all(promises);
    pokemonList.value.push(...detailedData);

    offset.value += limit;
    if (!data.next) hasMore.value = false;
  } catch (err) {
    console.error("Error loading more Pokémon:", err);
  } finally {
    loading.value = false;
  }
}

// Modal detail show/hide functions
function showPokemonDetail(pokemon) {
  selectedPokemon.value = pokemon;
  if (pokemonModal.value) {
    const modalInstance = bootstrap.Modal.getOrCreateInstance(pokemonModal.value);
    modalInstance.show();
  }
}
function closeModal() {
  if (pokemonModal.value) {
    const modalInstance = bootstrap.Modal.getOrCreateInstance(pokemonModal.value);
    modalInstance.hide();
  }
}

// Search handlers
function handleSearch() {}
function handleSearchInput() {}
function clearSearch() {
  searchQuery.value = "";
}

// Toggle select Pokémon (เพิ่ม/ลบใน store.selectedPokemons)
function toggleSelectPokemon(pokemon) {
  const index = store.selectedPokemons.findIndex((p) => p.id === pokemon.id);
  if (index === -1) {
    store.selectedPokemons.push(pokemon);
  } else {
    store.selectedPokemons.splice(index, 1);
  }
}

// เช็คว่า Pokémon ตัวนี้ถูกเลือกอยู่หรือไม่
function isSelected(pokemon) {
  return store.selectedPokemons.some((p) => p.id === pokemon.id);
}

// ไปหน้า Battle และส่ง selectedPokemons ผ่าน query string
function goToBattle() {
  if (store.selectedPokemons.length === 0) {
    alert("Please select at least 1 Pokémon to battle.");
    return;
  }
  router.push({
    name: "Home", // เปลี่ยนเป็นชื่อ route ที่ต้องการ เช่น "Home"
    query: { selected: store.selectedPokemons.map((p) => p.id).join(",") },
  });
}

// Infinite scroll observer
const bottomObserver = ref(null);
const bottomObserverEl = ref(null);
const observeBottom = (el) => {
  if (!el) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      fetchMorePokemon();
    }
  });
  observer.observe(el);
  bottomObserver.value = el;
};

onMounted(() => {
  fetchMorePokemon();
  observeBottom(bottomObserverEl.value);
});
</script>

<style>
button i {
  transition: transform 0.2s ease, color 0.2s;
}
button:hover i {
  transform: scale(2.5);
}

.heart-btn {
  transition: transform 0.2s ease;
}
.heart-btn.active {
  animation: pulse 0.4s ease;
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
.pokemon-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.pokemon-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* พื้นหลัง GIF ที่ container */
.gif-background {
  background-image: url("https://img.itch.zone/aW1nLzEwNDcxMzQ0LmdpZg==/original/T3LMCL.gif");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.gif-background > * {
  border-radius: 0.9rem;
  padding: 1rem;
}

/* Custom colors for types */
.bg-purple {
  background-color: #8b5cf6 !important;
}

.bg-pink {
  background-color: #ec4899 !important;
}

.bg-lime {
  background-color: #84cc16 !important;
}

.bg-brown {
  background-color: #a3804a !important;
}
</style>
