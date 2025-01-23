<template>
  <div class="container">
    <!-- Header -->
    <div class="page-header">
      <h1>อัพเดท Stock</h1>
      <p class="subtitle">อัพโหลดและจัดการข้อมูล Stock</p>
    </div>

    <div class="main-card">
      <div class="card-header">
        <h2>ขั้นตอนการเพิ่มข้อมูลเข้า Stock</h2>
      </div>

      <div class="card-content">
        <ProgressSteps :currentStep="currentStep" />

        <!-- Step 1: Upload -->
        <div v-if="currentStep === 1">
          <UploadSection 
            @fileSelected="handleFileSelect" 
            @continue="handleContinue" 
            @cancel="handleCancel"
            :selectedFile="selectedFile" 
          />
        </div>

        <!-- Step 2: Validation -->
        <div v-if="currentStep === 2">
          <FileValidation 
            :file="selectedFile" 
            @back="handleBack" 
            @confirm="handleDataConfirm"
            @error="handleValidationError" 
          />
        </div>

        <!-- Step 3: Completion -->
        <div v-if="currentStep === 3" class="completion-step">
          <!-- Success Header -->
          <div class="success-header text-center mb-8">
            <div class="success-icon-wrapper mb-4">
              <div class="success-icon-circle">
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 class="text-2xl font-semibold mb-2">อัพเดท Stock สำเร็จ</h2>
            <p class="text-gray-600">ระบบได้อัพเดทข้อมูล Stock เรียบร้อยแล้ว</p>
          </div>

          <!-- Summary Card -->
          <div class="bg-white rounded-lg shadow mb-6">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="text-lg font-medium">สรุปการอัพเดท</h3>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-gray-500">รหัสอัพเดท</p>
                  <p class="font-medium">{{ fileData.updateCode }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">จำนวนรายการ</p>
                  <p class="font-medium">{{ fileData.totalRecords }} รายการ</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">อัพเดทสำเร็จ</p>
                  <p class="font-medium text-green-600">{{ fileData.successCount }} รายการ</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">เวลาที่อัพเดท</p>
                  <p class="font-medium">{{ fileData.uploadTime }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Details Table -->
          <div class="bg-white rounded-lg shadow mb-6">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-lg font-medium">รายการอัพเดทล่าสุด</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสรถ</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รุ่น</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เวลา</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-if="fileData.updateDetails.length === 0">
                      <td colspan="5" class="px-6 py-4 text-center text-gray-500">ไม่พบข้อมูล</td>
                    </tr>
                    <tr v-for="item in fileData.updateDetails" :key="item.code">
                      <td class="px-6 py-4 text-sm text-gray-900">{{ item.code }}</td>
                      <td class="px-6 py-4 text-sm text-gray-900">{{ item.model }}</td>
                      <td class="px-6 py-4 text-sm text-gray-900">{{ item.action }}</td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {{ item.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-900">{{ item.time }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- System Update Info -->
          <div class="bg-blue-50 rounded-lg p-4 mb-8">
            <div class="flex">
              <svg class="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 class="text-base font-medium text-blue-800 mb-2">การอัพเดทระบบ</h4>
                <ul class="text-sm text-blue-700 space-y-1">
                  <li>• อัพเดทข้อมูลในระบบคลังสินค้าเรียบร้อยแล้ว</li>
                  <li>• อัพเดทข้อมูลในระบบการจองเรียบร้อยแล้ว</li>
                  <li>• อัพเดทข้อมูลในระบบรายงานเรียบร้อยแล้ว</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between items-center">
            <div class="space-x-4">
              <button @click="downloadReport" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                ดาวน์โหลดรายงาน
              </button>
              <button @click="printReport" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                พิมพ์รายงาน
              </button>
              <button @click="resetUpload" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                อัพเดทใหม่
              </button>
            </div>
            <button @click="goToHome" class="btn-primary">
              กลับสู่หน้าหลัก
            </button>
          </div>

          <!-- Success Toast -->
          <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2">
            <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-green-700">ระบบได้ทำการเชื่อมโยงข้อมูลเรียบร้อยแล้ว</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <transition name="fade">
      <div v-if="error" class="error-alert">
        <div class="alert alert-error">
          <h4>เกิดข้อผิดพลาด</h4>
          <p>{{ error }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>
</script>

<script>
import ProgressSteps from '@/components/upload/ProgressSteps'
import UploadSection from '@/components/upload/UploadSection'
import FileValidation from '@/components/upload/FileValidation'
import * as XLSX from 'xlsx'

export default {
    name: 'UploadPage',

    components: {
        ProgressSteps,
        UploadSection,
        FileValidation
    },

    data() {
        return {
            currentStep: 1,
            fileData: {
                updateCode: '',
                totalRecords: 0,
                successCount: 0,
                uploadTime: '',
                updateDetails: []
            },
            isProcessing: false,
            error: null,
            selectedFile: null,
            processedData: null
        }
    },

    computed: {
        hasFileData() {
            return this.fileData.updateDetails.length > 0
        }
    },

    methods: {
        validateExcelFile(file) {
            const validTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ]
            
            if (!validTypes.includes(file.type)) {
                throw new Error('กรุณาอัพโหลดไฟล์ Excel เท่านั้น')
            }

            const maxSize = 5 * 1024 * 1024 // 5MB
            if (file.size > maxSize) {
                throw new Error('ขนาดไฟล์ต้องไม่เกิน 5MB')
            }

            return true
        },

        handleFileSelect(file) {
            try {
                if (this.validateExcelFile(file)) {
                    this.selectedFile = file
                    this.error = null
                    console.log('File selected:', file?.name)
                }
            } catch (err) {
                this.error = err.message
                this.selectedFile = null
            }
        },

        async handleContinue() {
            if (!this.selectedFile) {
                this.error = 'กรุณาเลือกไฟล์ก่อนดำเนินการต่อ'
                return
            }

            if (this.isProcessing) return

            this.isProcessing = true
            this.error = null

            try {
                if (this.validateExcelFile(this.selectedFile)) {
                    // Read the file first
                    const data = await this.readExcelFile(this.selectedFile)
                    this.processedData = data
                    this.currentStep = 2 // Go to validation step
                }
            } catch (err) {
                this.error = err.message
            } finally {
                this.isProcessing = false
            }
        },

        async readExcelFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                
                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target.result)
                        const workbook = XLSX.read(data, { type: 'array' })
                        const firstSheetName = workbook.SheetNames[0]
                        const worksheet = workbook.Sheets[firstSheetName]
                        const jsonData = XLSX.utils.sheet_to_json(worksheet)
                        resolve(jsonData)
                    } catch (error) {
                        reject(new Error('ไม่สามารถอ่านไฟล์ได้ กรุณาตรวจสอบรูปแบบไฟล์'))
                    }
                }

                reader.onerror = () => {
                    reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์'))
                }

                reader.readAsArrayBuffer(file)
            })
        },

        handleBack() {
            if (this.isProcessing) return
            this.currentStep--
            this.error = null
        },

        handleCancel() {
            if (this.isProcessing) return
            this.$router.push('/')
        },

        async handleDataConfirm(validatedData) {
            if (this.isProcessing) return
            this.isProcessing = true

            try {
                // Process the validated data
                this.fileData = {
                    updateCode: 'UPD' + Date.now().toString().slice(-8),
                    totalRecords: validatedData.length,
                    successCount: validatedData.length,
                    uploadTime: new Date().toLocaleTimeString('th-TH'),
                    updateDetails: validatedData.map(row => ({
                        code: row['รหัสรถ'] || row['VEHICLE_CODE'] || row['Code'] || '',
                        model: row['รุ่น'] || row['MODEL'] || row['Model'] || '',
                        action: 'เพิ่มเข้าคลัง',
                        status: 'สำเร็จ',
                        time: new Date().toLocaleTimeString('th-TH')
                    }))
                }

                this.currentStep = 3 // Go to completion step
                this.error = null
            } catch (err) {
                this.error = 'เกิดข้อผิดพลาดในการประมวลผลข้อมูล กรุณาลองใหม่อีกครั้ง'
            } finally {
                this.isProcessing = false
            }
        },

        handleValidationError(err) {
            this.error = err.message
        },

        downloadReport() {
            if (!this.hasFileData) return

            try {
                const wb = XLSX.utils.book_new()
                const ws = XLSX.utils.json_to_sheet(this.fileData.updateDetails)
                XLSX.utils.book_append_sheet(wb, ws, 'Stock Update')
                XLSX.writeFile(wb, `stock_report_${this.fileData.updateCode}.xlsx`)
            } catch (error) {
                this.error = 'เกิดข้อผิดพลาดในการดาวน์โหลดรายงาน'
            }
        },

        printReport() {
            window.print()
        },

        resetUpload() {
            this.currentStep = 1
            this.selectedFile = null
            this.fileData = {
                updateCode: '',
                totalRecords: 0,
                successCount: 0,
                uploadTime: '',
                updateDetails: []
            }
            this.processedData = null
            this.error = null
            this.isProcessing = false
        },

        goToHome() {
            this.$router.push('/')
        }
    }
}

</script>
<style scoped>
.btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm;
}

.btn-secondary {
    @apply px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm;
}

.success-icon-circle {
    @apply w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto;
}

.success-icon-wrapper {
    @apply inline-flex items-center justify-center;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.page-header {
    margin-bottom: 24px;
}

.page-header h1 {
    font-size: 1.875rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    margin-bottom: 8px;
}

.page-header .subtitle {
    color: #6b7280;
    font-size: 1rem;
    margin: 0;
}

.main-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.card-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
}

.card-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.card-content {
    padding: 20px;
}

.error-alert {
    margin-top: 16px;
    padding: 12px;
    background-color: #fee2e2;
    border: 1px solid #ef4444;
    border-radius: 6px;
}

.alert {
    padding: 12px;
    border-radius: 6px;
}

.alert-error {
    background-color: #fee2e2;
    border: 1px solid #ef4444;
    color: #dc2626;
}

.completion-message {
    text-align: center;
    padding: 40px 20px;
}

.success-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 1.5rem;
    color: #22c55e;
}

.completion-message h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
}

.completion-message p {
    color: #6b7280;
    margin: 8px 0;
}

.action-buttons {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.processing {
    pointer-events: none;
    opacity: 0.7;
}

/* Responsive styles */
@media (max-width: 768px) {
    .container {
        padding: 16px;
    }

    .page-header {
        margin-bottom: 16px;
    }

    .page-header h1 {
        font-size: 1.5rem;
    }

    .card-content {
        padding: 16px;
    }

    .completion-message {
        padding: 24px 16px;
    }

    .action-buttons {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }
}
</style>