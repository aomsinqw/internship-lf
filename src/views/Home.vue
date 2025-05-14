<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6">
        <div class="card rounded-4 shadow">
          <div class="card-body p-4">
            <form class="form-control border-0">
              <div class="row mb-2">
                <div class="col-12">
                  <label class="form-label">first name : </label>
                  <input v-model="firstName" class="form-control" type="text" />
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-12">
                  <label class="form-label">last name :</label>
                  <input v-model="lastName" class="form-control" type="text" />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label">number</label>
                  <input
                    v-model.number="number"
                    class="form-control"
                    type="number"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-6 text-center">
                  <button @click="increase" class="btn btn-success w-50">
                    increase
                  </button>
                </div>
                <div class="col-6 text-center">
                  <button @click="decrease" class="btn btn-danger w-50">
                    decrease
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="row">
          <div class="col-lg-4 col-md-6 col-sm-12 mt-md-3 mt-sm-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Firstname :</h5>
                <p class="card-text">{{ firstName }}</p>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-md-6 col-sm-12 mt-md-3 mt-sm-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">lastname :</h5>
                <p class="card-text">{{ lastName }}</p>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-md-6 col-sm-12 mt-md-3 mt-sm-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Number :</h5>
                <p class="card-text">{{ number }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup>
import { ref, watch } from "vue";

const firstName = ref("");
const lastName = ref("");
const number = ref(0);
const message = ref("Show Message");

watch(number, (newNumber) => {
  if (newNumber >= 18) {
    message.value = "pass";
  } else {
    message.value = "dont entry";
  }
});

function increase() {
  number.value++;
}

function decrease() {
  number.value--;
}

// import { useRouter } from 'vue-router'

// const router = useRouter()

// function goBack() {
//   router.back()
// }

// function goForward() {
//   router.forward()
// }
</script>

<!-- <style>
/* .forward-button {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 14px;
    text-decoration: none;
  } */
.nav {
  color: brown;
  text-align: center;
  padding: 2rem;
}

.home {
  color: rgb(255, 71, 101);
}

.container {
  display: flex;
  gap: 50px;
}

.left-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.right-panel {
  width: 50%;
  background-color: seashell;
  border-radius: 20px;
  border: 1px solid gray;
  padding: 20px;
}

input {
  width: 100%;
  padding: 10px;
  background-color: seashell;
  border: 1px solid gray;
  border-radius: 12px;
}

button {
  padding: 10px 20px;
  background-color: seashell;
  border-radius: 12px;
  border: 1px solid gray;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background-color: seashell;
  border-radius: 12px;
  border: 1px solid gray;
}
</style> -->
