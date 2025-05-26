<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav fs-5 gap-4 ">
          <li >
            <router-link
              class="nav-link"
              :class="{ active: $route.path === '/home' }"
              to="/home"
            >
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: $route.path === '/pokemon' }"
              to="/pokemon"
            >
              Pokemon
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: $route.path === '/register' }"
              to="/register"
            >
              Register
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: $route.path === '/memberlist' }"
              to="/memberlist"
            >
              Member
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script></script>

<style>
.navbar-brand.router-link-active {
  color: white !important;
  font-weight: normal !important;
}
</style>
