<template>
  <div class="container mt-5">
    <h1 class="text-center mb-5">Information</h1>
    <div class="row">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Surname</th>
            <th scope="col">Email</th>
            <th scope="col">Brith Date</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>04</td>
            <td>active</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>04</td>
            <td>active</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>John</td>
            <td>Doe</td>
            <td>@social</td>
            <td>04</td>
            <td>active</td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <div class="d-grid d-md-flex justify-content-md-end mt-3">
          <button class="btn btn-primary me-md-2" type="button">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
