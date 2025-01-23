<template>
    <div class="container max-w-3xl mx-auto p-6">
        <!-- Header Section with Back Button -->
        <div class="flex items-center mb-8">
            <button @click="$router.back()" class="text-gray-600 hover:text-gray-900">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h1 class="text-2xl font-semibold ml-4">แก้ไขสถานะรถทดลอง</h1>
        </div>

        <!-- Car Information Card -->
        <div class="bg-white rounded-lg shadow mb-6">
            <div class="p-6">
                <h2 class="text-lg font-medium mb-4">ข้อมูลรถ</h2>
                <div class="grid grid-cols-2 gap-6">
                    <!-- Basic Information -->
                    <div>
                        <p class="text-sm text-gray-500">หมายเลขรถ</p>
                        <p class="font-medium">{{ carData.carCard }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">DLR_ID</p>
                        <p class="font-medium">{{ carData.dlrId }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">MDL CD</p>
                        <p class="font-medium">{{ carData.mdlCd }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">ชนิดรถ</p>
                        <p class="font-medium">{{ carData.type }}</p>
                    </div>
                    
                    <!-- Model Information -->
                    <div>
                        <p class="text-sm text-gray-500">รหัสแบบรถ</p>
                        <p class="font-medium">{{ carData.modelCode }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">แบบรถทั่วไป</p>
                        <p class="font-medium">{{ carData.modelGeneral }}</p>
                    </div>
                    
                    <!-- Additional Details -->
                    <div>
                        <p class="text-sm text-gray-500">สี</p>
                        <p class="font-medium">{{ carData.color }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">เลขเครื่อง</p>
                        <p class="font-medium">{{ carData.engineNo }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">เลขเชสซี</p>
                        <p class="font-medium">{{ carData.chassisNo }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Update Form -->
        <div class="bg-white rounded-lg shadow">
            <div class="p-6">
                <h2 class="text-lg font-medium mb-4">แก้ไขสถานะ</h2>

                <form @submit.prevent="saveChanges">
                    <!-- Current Status Display -->
                    <div class="mb-6">
                        <p class="text-sm text-gray-500 mb-2">สถานะปัจจุบัน</p>
                        <div :class="getStatusClass(carData.status)" class="inline-block">
                            {{ carData.status }}
                        </div>
                    </div>

                    <!-- New Status Selection -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            สถานะใหม่
                        </label>
                        <select 
                            v-model="newStatus"
                            class="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            :disabled="carData.status === 'อยู่ในระหว่างการทดลองขับ'"
                        >
                            <option value="" disabled>เลือกสถานะ</option>
                            <option value="พร้อมใช้งาน">พร้อมใช้งาน</option>
                            <option value="ไม่พร้อมใช้งาน">ไม่พร้อมใช้งาน</option>
                        </select>
                        <p v-if="carData.status === 'อยู่ในระหว่างการทดลองขับ'" class="mt-2 text-sm text-yellow-600">
                            ไม่สามารถแก้ไขสถานะได้ในขณะที่รถอยู่ระหว่างการทดลองขับ
                        </p>
                    </div>

                    <!-- Notes Field -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            หมายเหตุ
                        </label>
                        <textarea
                            v-model="note"
                            rows="3"
                            class="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ระบุสาเหตุการเปลี่ยนสถานะ (ถ้ามี)"
                            :disabled="carData.status === 'อยู่ในระหว่างการทดลองขับ'"
                        ></textarea>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-3">
                        <button
                            type="button"
                            @click="$router.back()"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            :disabled="!canSave || carData.status === 'อยู่ในระหว่างการทดลองขับ'"
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EditCarStatus',
    
    props: {
        carId: {
            type: [String, Number],
            required: true
        }
    },

    data() {
        return {
            // Car data structure matching CarTable
            carData: {
                id: null,
                carCard: '',      // Car number
                dlrId: '',        // Dealer information
                mdlCd: '',        // Model code
                type: '',         // Car type
                modelCode: '',     // Model code detail
                modelGeneral: '',  // General model info
                color: '',        // Color
                engineNo: '',     // Engine number
                chassisNo: '',    // Chassis number
                status: ''        // Current status
            },
            newStatus: '',        // New status to be updated
            note: ''             // Additional notes for status change
        }
    },

    computed: {
        // Determine if save button should be enabled
        canSave() {
            return this.newStatus !== '' && this.newStatus !== this.carData.status
        }
    },

    async created() {
        try {
            // Simulated API call to get car data
            // In production, replace with actual API call
            this.carData = {
                id: this.carId,
                carCard: '1',
                dlrId: 'บริษัท นครชัย ตานเซลส์ จำกัด',
                mdlCd: '4LNHH',
                type: 'A-Hatchback',
                modelCode: 'Dolphin (410 Km) WHITE',
                modelGeneral: 'Dolphin (410 Km) WHITE-Normal',
                color: 'WHITE',
                engineNo: 'TZ18122',
                chassisNo: 'LC0CE4444448',
                status: 'พร้อมใช้งาน'
            }
            
            // Set initial status
            this.newStatus = this.carData.status
        } catch (error) {
            console.error('Error fetching car data:', error)
        }
    },
    

    methods: {
        // Get CSS classes for status display
        getStatusClass(status) {
            const classes = {
                'พร้อมใช้งาน': 'bg-green-50 text-green-600 px-3 py-1 rounded-full',
                'ไม่พร้อมใช้งาน': 'bg-red-50 text-red-600 px-3 py-1 rounded-full',
                'อยู่ในระหว่างการทดลองขับ': 'bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full'
            }
            return classes[status] || ''
        },

        // Handle form submission
        async saveChanges() {
            if (!this.canSave) return

            try {
                const updateData = {
                    status: this.newStatus,
                    note: this.note
                }

                // Simulated API call to update status
                // Replace with actual API call in production
                await this.$axios.$put(`/api/cars/${this.carData.id}/status`, updateData)
                
                // Show success message
                this.$toast.success('อัพเดทสถานะสำเร็จ')
                
                // Navigate back
                this.$router.back()
            } catch (error) {
                this.$toast.error('เกิดข้อผิดพลาดในการอัพเดทสถานะ')
                console.error('Error updating status:', error)
            }
        }
    }
}
</script>