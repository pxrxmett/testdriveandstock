<template>
    <div class="validation-content">
        <!-- Header Section -->
        <div class="validation-header">
            <h2>ตรวจสอบข้อมูล Stock</h2>
            <p class="subtitle">ตรวจสอบความถูกต้องของข้อมูลก่อนนำเข้าระบบ</p>
        </div>

        <!-- File Info Card -->
        <div class="info-card">
            <div class="file-details">
                <div class="file-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                </div>
                <div class="file-info">
                    <h3>{{ file?.name || 'ไม่พบชื่อไฟล์' }}</h3>
                    <div class="file-meta">
                        <span>{{ getFileSize(file?.size) }}</span>
                        <span class="dot">•</span>
                        <span>อัพโหลดเมื่อ {{ uploadTime }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Validation Progress -->
        <div class="progress-card">
            <div class="progress-header">
                <h3>{{ validationStatus }}</h3>
                <span class="progress-percentage">{{ progress }}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
            </div>

            <!-- Validation Results -->
            <div v-if="validationComplete" class="validation-results">
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-label">จำนวนรายการทั้งหมด</div>
                        <div class="stat-value">{{ totalRecords }}</div>
                    </div>
                    <div class="stat-item success">
                        <div class="stat-label">ผ่านการตรวจสอบ</div>
                        <div class="stat-value">{{ validRecords }}</div>
                    </div>
                    <div class="stat-item warning">
                        <div class="stat-label">คำเตือน</div>
                        <div class="stat-value">{{ warningRecords }}</div>
                    </div>
                    <div class="stat-item error">
                        <div class="stat-label">ข้อผิดพลาด</div>
                        <div class="stat-value">{{ errorRecords }}</div>
                    </div>
                </div>

                <!-- Error Summary -->
                <div v-if="uniqueErrors.length > 0" class="error-summary">
                    <h4>รายการข้อผิดพลาด</h4>
                    <ul class="error-list">
                        <li v-for="(error, index) in uniqueErrors" :key="index" class="error-item">
                            <div class="error-icon">
                                <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            {{ error }}
                        </li>
                    </ul>
                </div>

                <!-- Data Preview -->
                <div class="data-preview">
                    <h4>ตัวอย่างข้อมูล</h4>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>รุ่น</th>
                                    <th>VIN No.</th>
                                    <th>สถานะ</th>
                                    <th>รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in previewData" :key="index">
                                    <td>{{ row.No }}</td>
                                    <td>{{ row.Model }}</td>
                                    <td>{{ row['VIN No.'] }}</td>
                                    <td>
                                        <span :class="['status-badge', row.status]">
                                            {{ getStatusText(row.status) }}
                                        </span>
                                    </td>
                                    <td class="message-cell">
                                        <span :class="['message', row.status]">{{ row.message }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
            <button class="btn-secondary" @click="$emit('back')" :disabled="isValidating">
                ย้อนกลับ
            </button>
            <button class="btn-primary" :disabled="!canProceed" @click="$emit('confirm', fileData)">
                ยืนยันข้อมูล
            </button>
        </div>
    </div>
</template>
<script>
import * as XLSX from 'xlsx'

export default {
    name: 'FileValidation',
    props: {
        file: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            progress: 0,
            uploadTime: new Date().toLocaleString('th-TH'),
            isValidating: false,
            validationComplete: false,
            totalRecords: 0,
            validRecords: 0,
            errorRecords: 0,
            warningRecords: 0,
            fileData: [],
            isProcessing: true,
            uniqueErrors: [] // เพิ่มสำหรับเก็บข้อผิดพลาดที่ไม่ซ้ำกัน
        }
    },
    computed: {
        validationStatus() {
            if (this.isProcessing) {
                if (this.progress < 10) return 'เตรียมการตรวจสอบ...'
                if (this.progress < 30) return `กำลังอ่านไฟล์... ${this.progress}%`
                return `กำลังตรวจสอบข้อมูล... ${this.progress}%`
            }
            if (this.validationComplete) return 'ตรวจสอบเสร็จสิ้น'
            return 'รอการตรวจสอบ'
        },
        canProceed() {
            return this.validationComplete && this.errorRecords === 0
        },
        previewData() {
            return this.fileData.slice(0, 5)
        }
    },
    async mounted() {
        if (this.file) {
            await this.initializeValidation()
        }
    },
    methods: {
        getFileSize(bytes) {
            if (!bytes) return '0 Bytes'
            const sizes = ['Bytes', 'KB', 'MB', 'GB']
            const i = Math.floor(Math.log(bytes) / Math.log(1024))
            return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`
        },
        getStatusText(status) {
            const statusMap = {
                success: 'ผ่าน',
                warning: 'คำเตือน',
                error: 'ไม่ผ่าน'
            }
            return statusMap[status] || status
        },
        async initializeValidation() {
            this.resetState()
            try {
                console.log('Starting validation for file:', this.file.name)
                const data = await this.readExcelFile()
                await this.validateData(data)
            } catch (error) {
                console.error('Validation error:', error)
                this.$emit('error', error.message)
            } finally {
                this.isProcessing = false
            }
        },
        resetState() {
            this.progress = 0
            this.isProcessing = true
            this.validationComplete = false
            this.totalRecords = 0
            this.validRecords = 0
            this.errorRecords = 0
            this.warningRecords = 0
            this.fileData = []
            this.uniqueErrors = [] // Reset unique errors
        },
        async readExcelFile() {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()

                reader.onload = (event) => {
                    try {
                        const data = event.target.result
                        const workbook = XLSX.read(data, {
                            type: 'binary',
                            cellDates: true,
                            cellNF: false,
                            cellText: false
                        })

                        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
                            raw: false,
                            defval: ''
                        })

                        if (!jsonData || jsonData.length === 0) {
                            throw new Error('ไม่พบข้อมูลในไฟล์')
                        }

                        this.totalRecords = jsonData.length
                        this.progress = 20
                        resolve(jsonData)

                    } catch (error) {
                        reject(new Error('ไม่สามารถอ่านไฟล์ได้: ' + error.message))
                    }
                }

                reader.onerror = () => {
                    reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์'))
                }

                reader.readAsBinaryString(this.file)
            })
        },
        async validateData(data) {
            const batchSize = 50
            const total = data.length
            const errorMessages = new Set() // เก็บข้อความ error ที่ไม่ซ้ำกัน

            for (let i = 0; i < total; i += batchSize) {
                const batch = data.slice(i, Math.min(i + batchSize, total))

                batch.forEach(row => {
                    const validationResult = this.validateRow(row)

                    if (validationResult.status === 'error') {
                        errorMessages.add(validationResult.message)
                    }

                    if (validationResult.status === 'success') {
                        this.validRecords++
                    } else if (validationResult.status === 'warning') {
                        this.warningRecords++
                        this.validRecords++
                    } else {
                        this.errorRecords++
                    }

                    this.fileData.push({
                        ...row,
                        status: validationResult.status,
                        message: validationResult.message
                    })
                })

                this.progress = 30 + Math.floor((i / total) * 70)
                await new Promise(resolve => setTimeout(resolve, 1))
            }

            this.uniqueErrors = Array.from(errorMessages)
            this.progress = 100
            this.validationComplete = true
        },
        validateRow(row) {
            const requiredFields = [
                'No',
                'Model',
                'VIN No.',
                'COLOR'
            ]

            const optionalFields = [
                'Front Motor',
                'BATTERY No.',
                'Engine No.'
            ]

            // Check required fields
            const missingRequired = requiredFields.filter(field => !row[field])
            if (missingRequired.length > 0) {
                return {
                    isValid: false,
                    status: 'error',
                    message: `ข้อมูลจำเป็นไม่ครบถ้วน: ${missingRequired.join(', ')}`
                }
            }

            // Check VIN Number
            if (row['VIN No.'] && row['VIN No.'].length !== 17) {
                return {
                    isValid: false,
                    status: 'error',
                    message: 'รูปแบบ VIN Number ไม่ถูกต้อง (ต้องมี 17 ตัวอักษร)'
                }
            }

            // Check optional fields
            const missingOptional = optionalFields.filter(field => !row[field])
            if (missingOptional.length > 0) {
                return {
                    isValid: true,
                    status: 'warning',
                    message: `ข้อมูลไม่ครบถ้วน: ${missingOptional.join(', ')}`
                }
            }

            return {
                isValid: true,
                status: 'success',
                message: 'ข้อมูลถูกต้องครบถ้วน'
            }
        }
    }
}
</script>
<style scoped>
.validation-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.validation-header {
    margin-bottom: 2rem;
    text-align: center;
}

.validation-header h2 {
    font-size: 1.875rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
}

.subtitle {
    color: #6b7280;
    font-size: 1rem;
}

.info-card {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.file-details {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.file-icon {
    width: 2.5rem;
    height: 2.5rem;
    color: #6b7280;
}

.file-info h3 {
    font-size: 1.125rem;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 0.25rem;
}

.file-meta {
    color: #6b7280;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.dot {
    color: #9ca3af;
}

.progress-card {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.progress-header h3 {
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
}

.progress-percentage {
    font-weight: 600;
    color: #3b82f6;
}

.progress-bar {
    background-color: #e5e7eb;
    border-radius: 9999px;
    height: 0.5rem;
    overflow: hidden;
    margin-bottom: 2rem;
}

.progress-fill {
    background-color: #3b82f6;
    height: 100%;
    transition: width 0.3s ease;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.stat-item {
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: #f3f4f6;
    text-align: center;
}

.stat-item.success {
    background-color: #ecfdf5;
    color: #065f46;
}

.stat-item.warning {
    background-color: #fffbeb;
    color: #92400e;
}

.stat-item.error {
    background-color: #fef2f2;
    color: #991b1b;
}

.stat-label {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 600;
}

.error-summary {
    margin-bottom: 2rem;
}

.error-summary h4 {
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 1rem;
}

.error-list {
    list-style: none;
    padding: 0;
}

.error-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background-color: #fef2f2;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
    color: #991b1b;
}

.error-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #dc2626;
}

.data-preview {
    margin-bottom: 2rem;
}

.data-preview h4 {
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 1rem;
}

.table-container {
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
}

.data-table th {
    background-color: #f3f4f6;
    padding: 0.75rem;
    text-align: left;
    font-weight: 500;
    color: #1f2937;
    border-bottom: 1px solid #e5e7eb;
}

.data-table td {
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.status-badge.success {
    background-color: #ecfdf5;
    color: #065f46;
}

.status-badge.warning {
    background-color: #fffbeb;
    color: #92400e;
}

.status-badge.error {
    background-color: #fef2f2;
    color: #991b1b;
}

.message-cell {
    max-width: 300px;
}

.message {
    display: block;
    font-size: 0.75rem;
    line-height: 1.25;
}

.message.success {
    color: #065f46;
}

.message.warning {
    color: #92400e;
}

.message.error {
    color: #991b1b;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background-color: #3b82f6;
    color: white;
    border: none;
}

.btn-primary:hover {
    background-color: #2563eb;
}

.btn-primary:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
}

.btn-secondary {
    background-color: white;
    color: #1f2937;
    border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
    background-color: #f3f4f6;
}

.btn-secondary:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
}
</style>