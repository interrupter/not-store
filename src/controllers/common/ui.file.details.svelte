<script>
  export let item = {};
</script>

<h2 class="h2">Файл</h2>
<div class="container">

  <div class="columns">
    <div class="column">Имя</div>
    <div class="column">{item.name}</div>
  </div>

  <div class="columns">
    <div class="column">Bucket</div>
    <div class="column">{item.bucket}</div>
  </div>

  <div class="columns">
    <div class="column">userIp</div>
    <div class="column">{item.userIp}</div>
  </div>

  <div class="columns">
    <div class="column">userId</div>
    <div class="column">{item.userId}</div>
  </div>

  <div class="columns">
    <div class="column">size</div>
    <div class="column">{item.size}</div>
  </div>

  <div class="columns">
    <div class="column">width</div>
    <div class="column">{item.width}</div>
  </div>

  <div class="columns">
    <div class="column">height</div>
    <div class="column">{item.height}</div>
  </div>

  <div class="columns">
    <div class="column">Дата создания</div>
    <div class="column">{item.created}</div>
  </div>

</div>
