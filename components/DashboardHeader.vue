<template>
    <div class="header flex justify-between items-start mb-6">
        <div class="header-left">
            <h1 class="text-2xl font-semibold mb-2">ภาพรวม Stock</h1>
            <p class="text-gray-500">ข้อมูลสรุป Stock รถยนต์</p>
        </div>
        <div class="header-right flex gap-2">
            <button class="btn btn-secondary" @click="goToUpload">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                นำเข้าไฟล์
            </button>
            <button class="btn btn-primary" @click="goToAddNew">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                เพิ่มรถใหม่
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardHeader',
    methods: {
        goToUpload() {
            this.$router.push('/upload')
        },
        goToAddNew() {
            this.$router.push('/upload/add')
        }
    }
}
</script>

<style scoped>
.btn {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    gap: 0.5rem;
    transition: all 0.2s;
}

.btn-primary {
    background-color: #3B82F6;
    color: white;
    border: none;
}

.btn-primary:hover {
    background-color: #2563EB;
}

.btn-secondary {
    background-color: white;
    color: #374151;
    border: 1px solid #D1D5DB;
}

.btn-secondary:hover {
    background-color: #F9FAFB;
}
</style>