<template>
    <div class="page-header">
        <button class="back-button" @click="$router.push('/')">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            
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

<style scoped>
.page-header {
    margin-bottom: 2rem;
}

.back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #6B7280;
    cursor: pointer;
    border: none;
    background: none;
    margin-bottom: 1rem;
}

.page-header h1 {
    font-size: 1.875rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.page-header p {
    color: #6B7280;
}
</style>