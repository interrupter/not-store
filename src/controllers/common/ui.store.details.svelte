<script>
  export let item = {};
</script>

<h2 class="h2">Хранилище</h2>
<div class="container">
  <div class="columns">
    <div class="column">Имя</div>
    <div class="column">{item.name}</div>
  </div>
  <div class="columns">
    <div class="column">Тип</div>
    <div class="column">{item.driver}</div>
  </div>
  <div class="columns">
    <div class="column">Активна</div>
    <div class="column">
      {#if item.active }
      <span class="tag is-success">Да</span>
      {:else }
      <span class="tag is-danger">Нет</span>
      {/if}
    </div>
  </div>
  <div class="columns">
    <div class="column">Настройки</div>
    <div class="column">{JSON.stringify(item.options, null, 4)}</div>
  </div>
</div>
