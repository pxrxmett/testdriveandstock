<template>
    <EditCarStatus :carId="$route.params.id" />
</template>

<script>
import EditCarStatus from '@/components/stock/EditCarStatus.vue'

export default {
    components: {
        EditCarStatus
    }
}
</script>