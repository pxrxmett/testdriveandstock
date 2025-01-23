<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div v-for="(stat, index) in stats" :key="index" class="bg-white p-6 rounded-lg shadow">
            <p class="text-gray-500 text-sm mb-2">{{ stat.label }}</p>
            <p class="text-3xl font-semibold mb-4">{{ stat.value }}</p>
            <div :class="['h-1 w-24 rounded', stat.indicatorColor]"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StatsCards',
    data() {
        return {
            stats: [
                { label: 'รถทั้งหมดใน Stock', value: '3 คัน', indicatorColor: 'bg-blue-100' },
                { label: 'รอการตรวจสอบ', value: '1 คัน', indicatorColor: 'bg-yellow-100' },
                { label: 'พร้อมใช้งาน', value: '1 คัน', indicatorColor: 'bg-green-100' }
            ]
        }
    }
}
</script>