<template>
   <div class="bg-white rounded-lg shadow">
       <!-- Header -->
       <div class="flex justify-between items-center p-6 border-b">
           <h2 class="text-lg font-semibold">รายการรถทดลอง</h2>
           <button @click="toggleFilter" class="btn btn-filter flex items-center gap-2">
               <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
               </svg>
               ค้นหา
           </button>
       </div>

       <!-- Filter Section -->
       <div v-show="showFilter" class="p-6 border-b bg-gray-50" style="transition: all 0.3s ease">
           <div class="grid grid-cols-4 gap-4">
               <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">NO</label>
                   <input v-model="filters.carCard" type="text" class="form-input w-full rounded-md" placeholder="ค้นหาหมายเลข"/>
               </div>
               <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">DLR_ID</label>
                   <input v-model="filters.dlrId" type="text" class="form-input w-full rounded-md" placeholder="ค้นหาดีลเลอร์"/>
               </div>
               <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">MDL CD</label>
                   <input v-model="filters.mdlCd" type="text" class="form-input w-full rounded-md" placeholder="ค้นหารหัสโมเดล"/>
               </div>
               <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">ชนิดรถ</label>
                   <input v-model="filters.type" type="text" class="form-input w-full rounded-md" placeholder="ค้นหาชนิดรถ"/>
               </div>
               <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">รหัสแบบรถ</label>
                   <input v-model="filters.modelCode" type="text" class="form-input w-full rounded-md" placeholder="ค้นหารหัสแบบรถ"/>
               </div>
               <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">แบบรถทั่วไป</label>
                   <input v-model="filters.modelGeneral" type="text" class="form-input w-full rounded-md" placeholder="ค้นหาแบบรถทั่วไป"/>
               </div>
               <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">สี</label>
                   <input v-model="filters.color" type="text" class="form-input w-full rounded-md" placeholder="ค้นหาสี"/>
               </div>
               <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">เลขเครื่อง</label>
                   <input v-model="filters.engineNo" type="text" class="form-input w-full rounded-md" placeholder="ค้นหาเลขเครื่อง"/>
               </div>
               <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">เลขเชสซี</label>
                   <input v-model="filters.chassisNo" type="text" class="form-input w-full rounded-md" placeholder="ค้นหาเลขเชสซี"/>
               </div>
               <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                   <select v-model="filters.status" class="form-select w-full rounded-md">
                       <option value="">ทั้งหมด</option>
                       <option value="พร้อมใช้งาน">พร้อมใช้งาน</option>
                       <option value="ไม่พร้อมใช้งาน">ไม่พร้อมใช้งาน</option>
                       <option value="อยู่ในระหว่างการทดลองขับ">อยู่ในระหว่างการทดลองขับ</option>
                   </select>
               </div>
           </div>
           <div class="flex justify-end mt-4 space-x-2">
               <button @click="resetFilters" class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                   รีเซ็ต
               </button>
               <button @click="applyFilters" class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                   ค้นหา
               </button>
           </div>
       </div>

       <!-- Table Section -->
       <div class="overflow-x-auto">
           <table class="w-full">
               <thead>
                   <tr>
                       <th v-for="header in headers" :key="header" class="p-4 text-left text-gray-500 bg-gray-50">
                           {{ header }}
                       </th>
                   </tr>
               </thead>
               <tbody>
                   <tr v-for="car in filteredCars" :key="car.id" class="hover:bg-gray-50">
                       <td>{{ car.carCard }}</td>
                       <td>{{ car.dlrId }}</td>
                       <td>{{ car.mdlCd }}</td>
                       <td>{{ car.type }}</td>
                       <td>{{ car.modelCode }}</td>
                       <td>{{ car.modelGeneral }}</td>
                       <td>{{ car.color }}</td>
                       <td>{{ car.engineNo }}</td>
                       <td>{{ car.chassisNo }}</td>
                       <td>
                           <div class="flex items-center gap-2">
                               <span :class="getStatusClass(car.status)">
                                   {{ car.status }}
                               </span>
                           </div>
                       </td>
                       <td class="actions">
                           <div class="flex justify-end gap-2">
                               <button 
                                   @click="editStatus(car)"
                                   :disabled="car.status === 'อยู่ในระหว่างการทดลองขับ'"
                                   :class="[
                                       'p-1.5 rounded',
                                       car.status === 'อยู่ในระหว่างการทดลองขับ' 
                                           ? 'text-gray-400 cursor-not-allowed' 
                                           : 'text-blue-600 hover:bg-blue-50'
                                   ]"
                               >
                                   <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                       <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                   </svg>
                               </button>
                               <button 
                                   @click="deleteCar(car)"
                                   :disabled="car.status === 'อยู่ในระหว่างการทดลองขับ'"
                                   :class="[
                                       'p-1.5 rounded',
                                       car.status === 'อยู่ในระหว่างการทดลองขับ' 
                                           ? 'text-gray-400 cursor-not-allowed' 
                                           : 'text-red-600 hover:bg-red-50'
                                   ]"
                               >
                                   <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                       <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                   </svg>
                               </button>
                           </div>
                       </td>
                   </tr>
               </tbody>
           </table>
       </div>
   </div>
</template>

<script>
export default {
   name: 'CarTable',
   data() {
       return {
           showFilter: false,
           filters: {
               carCard: '',
               dlrId: '',
               mdlCd: '',
               type: '',
               modelCode: '',
               modelGeneral: '',
               color: '',
               engineNo: '',
               chassisNo: '',
               status: ''
           },
           headers: ['NO', 'DLR_ID', 'MDL CD', 'ชนิดรถ', 'รหัสแบบรถ', 'แบบรถทั่วไป', 'สี', 'เลขเครื่อง', 'เลขเชสซี', 'สถานะ', 'จัดการ'],
           cars: [
               {
                   id: 1,
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
               },
               {
                   id: 2,
                   carCard: '2',
                   dlrId: 'บริษัท นครชัย ตานเซลส์ จำกัด',
                   mdlCd: '4LNHH',
                   type: 'A-Hatchback',
                   modelCode: 'Dolphin (410 Km) WHITE',
                   modelGeneral: 'Dolphin (410 Km) WHITE-Normal',
                   color: 'WHITE',
                   engineNo: 'TZ18123',
                   chassisNo: 'LC0CE4444449',
                   status: 'ไม่พร้อมใช้งาน'
               },
               {
                   id: 3,
                   carCard: '3',
                   dlrId: 'บริษัท นครชัย ตานเซลส์ จำกัด',
                   mdlCd: '4LNHH',
                   type: 'A-Hatchback',
                   modelCode: 'Dolphin (410 Km) WHITE',
                   modelGeneral: 'Dolphin (410 Km) WHITE-Normal',
                   color: 'WHITE',
                   engineNo: 'TZ18124',
                   chassisNo: 'LC0CE4444450',
                   status: 'อยู่ในระหว่างการทดลองขับ'
               },
               // ... more cars data
           ],
           showDeleteModal: false,
           selectedCar: null
       }
   },

   computed: {
       filteredCars() {
           return this.cars.filter(car => {
               return (!this.filters.carCard || car.carCard.toLowerCase().includes(this.filters.carCard.toLowerCase())) &&
                      (!this.filters.dlrId || car.dlrId.toLowerCase().includes(this.filters.dlrId.toLowerCase())) &&
                      (!this.filters.mdlCd || car.mdlCd.toLowerCase().includes(this.filters.mdlCd.toLowerCase())) &&
                      (!this.filters.type || car.type.toLowerCase().includes(this.filters.type.toLowerCase())) &&
                      (!this.filters.modelCode || car.modelCode.toLowerCase().includes(this.filters.modelCode.toLowerCase())) &&
                      (!this.filters.modelGeneral || car.modelGeneral.toLowerCase().includes(this.filters.modelGeneral.toLowerCase())) &&
                      (!this.filters.color || car.color.toLowerCase().includes(this.filters.color.toLowerCase())) &&
                      (!this.filters.engineNo || car.engineNo.toLowerCase().includes(this.filters.engineNo.toLowerCase())) &&
                      (!this.filters.chassisNo || car.chassisNo.toLowerCase().includes(this.filters.chassisNo.toLowerCase())) &&
                      (!this.filters.status || car.status === this.filters.status)
           })
       }
   },

   methods: {
       toggleFilter() {
           this.showFilter = !this.showFilter
       },

       resetFilters() {
           this.filters = {
               carCard: '',
               dlrId: '',
               mdlCd: '',
               type: '',
               modelCode: '',
               modelGeneral: '',
               color: '',
               engineNo: '',
               chassisNo: '',
               status: ''
           }
       },

       applyFilters() {
           // The filtering is handled by the computed property
           this.showFilter = false
       },

       getStatusClass(status) {
           const classes = {
               'พร้อมใช้งาน': 'bg-green-50 text-green-600',
               'ไม่พร้อมใช้งาน': 'bg-red-50 text-red-600',
               'อยู่ในระหว่างการทดลองขับ': 'bg-yellow-50 text-yellow-600'
           }
           return `px-3 py-1 rounded-full text-sm ${classes[status] || ''}`
       },

       editStatus(car) {
           if (car.status === 'อยู่ในระหว่างการทดลองขับ') return
           this.$router.push(`/cars/${car.id}/edit-status`)
       },

       deleteCar(car) {
           if (car.status === 'อยู่ในระหว่างการทดลองขับ') return
           this.selectedCar = car
           this.showDeleteModal = true
       },

       closeDeleteModal() {
           this.showDeleteModal = false
           this.selectedCar = null
       },

       async confirmDelete() {
           try {
               const index = this.cars.findIndex(car => car.id === this.selectedCar.id)
               if (index !== -1) {
                   this.cars.splice(index, 1)
               }
               this.closeDeleteModal()
           } catch (error) {
               console.error('Error deleting car:', error)
           }
       }
   }
}
</script>