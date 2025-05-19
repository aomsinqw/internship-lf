<template>
  <div class="gif-background">
    <div class="container text-white p-4 rounded-4">
      <h1 class="text-center mb-5 mt-5 bg-transport">Pokémon list</h1>

      <nav class="navbar navbar-light bg-light mb-5 text-center">
        <div class="container">
          <form class="d-flex w-100">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>

      <!-- Grid layout -->
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4">
        <div v-for="poke in pokemonList" :key="poke.id" class="col">
          <div class="card h-100 rounded-4 shadow text-center">
            <img
              :src="poke.sprites.front_default"
              class="card-img-top rounded-4 bg-light p-3"
              alt="Pokemon image"
            />
            <div class="card-body">
              <h5 class="card-title text-capitalize">{{ poke.name }}</h5>
            </div>
          </div>
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
        <p>No ore Pokémon Character</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { toggleFavorite, isFavorited, favorites } from "../stores/favorites";

// async function fetchPokemon() {
//   try {
//     const response = await fetch(
//       `https://pokeapi.co/api/v2/pokemon/${pokemonId.value}`
//     );
//     const data = await response.json();
//     pokemon.value = data;
//   } catch (error) {
//     console.error("Error fetching Pokémon:", error);
//   }
// }

const pokemonList = ref([]);
const offset = ref(0);
const limit = 100;
const loading = ref(false);
const hasMore = ref(true);

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

onMounted(() => {
  fetchMorePokemon();
});

// IntersectionObserver สำหรับเลื่อนถึงล่างสุด
const bottomObserver = ref(null);
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

const bottomObserverEl = ref(null);
onMounted(() => {
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
/* .pokemon-card {
  border: 1px solid #ddd;
  padding: 1rem;
  width: 150px;
  text-align: center;
} */
/* พื้นหลัง GIF ที่ container */
.gif-background {
  background-image: url("https://img.itch.zone/aW1nLzEwNDcxMzQ0LmdpZg==/original/T3LMCL.gif");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.gif-background > * {
  border-radius: 0.9rem;
  padding: 1rem;
}
</style>
