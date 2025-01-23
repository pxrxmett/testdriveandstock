<template>
  <div class="page-header">
    <button class="back-button" @click="$router.push('/')">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      กลับ
    </button>
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: String,
    subtitle: String
  }
}
</script>