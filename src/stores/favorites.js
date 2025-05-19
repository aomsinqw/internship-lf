import { reactive, watch } from 'vue'

const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')

export const favorites = reactive({
  list: savedFavorites
})

watch(
  () => favorites.list,
  (newList) => {
    localStorage.setItem('favorites', JSON.stringify(newList))
  },
  { deep: true }
)

export function toggleFavorite(pokemon) {
  const index = favorites.list.findIndex(p => p.id === pokemon.id)
  if (index !== -1) {
    favorites.list.splice(index, 1)
  } else {
    favorites.list.push(pokemon)
  }
}

export function isFavorited(pokemon) {
  return favorites.list.some(p => p.id === pokemon.id)
}
