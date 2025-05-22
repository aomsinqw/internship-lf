import { reactive } from "vue";

export const store = reactive({
  selectedPokemons: [],
  allPokemons: [],

  setAllPokemons(pokemons) {
    this.allPokemons = pokemons;
  },

  addPokemon(pokemon) {
    // คำนวณค่าเฉลี่ย stats
    const avgStat =
      pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0) /
      pokemon.stats.length;

    const enhancedPokemon = {
      ...pokemon,
      avgStat,
      hp: pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 0,
    };

    this.selectedPokemons.push(enhancedPokemon);
  },

  removePokemon(id) {
    this.selectedPokemons = this.selectedPokemons.filter((p) => p.id !== id);
  },
});

async function fetchAllPokemons() {
  if (store.allPokemons.length === 0) {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const data = await res.json();
    store.allPokemons = data.results.map((p, index) => ({
      id: index + 1,
      name: p.name,
      url: p.url,
      // preload sprites/stats ถ้าจำเป็น
    }));
  }
}

