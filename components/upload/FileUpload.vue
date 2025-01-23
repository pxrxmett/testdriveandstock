<template>
    <div class="upload-section">
        <div class="dropzone" :class="{ 'dragover': isDragover }" @drop.prevent="handleDrop"
            @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave">
            <input type="file" id="file-upload" class="file-input" accept=".xlsx,.xls,.csv" @change="handleFileSelect"
                ref="fileInput">
            <label for="file-upload" class="dropzone-label">
                <div v-if="!selectedFile" class="dropzone-content">
                    <svg class="icon-upload" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5-5 5 5m-5-5v12" />
                    </svg>
                    <h3>อัพโหลดไฟล์ Stock</h3>
                    <p>ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                    <p class="file-types">(.xlsx, .xls, .csv)</p>
                </div>
                <div v-else class="file-preview">
                    <span class="file-name">{{ selectedFile.name }}</span>
                    <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
                    <button class="remove-file" @click.prevent="removeFile">
                        <svg class="icon-remove" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </label>
        </div>

        <!-- Upload Progress -->
        <div v-if="isUploading" class="upload-progress">
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
            </div>
            <span class="progress-text">{{ uploadProgress }}% อัพโหลดแล้ว</span>
        </div>

        <!-- Alerts -->
        <div v-if="errorMessage" class="alert alert-error">
            <svg class="icon-error" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
            <div class="alert-content">{{ errorMessage }}</div>
        </div>

        <div class="alert alert-info">
            <svg class="icon-info" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
            <div class="alert-content">
                รองรับไฟล์ .xlsx, .xls และ .csv เท่านั้น
                <a href="#" class="link" @click.prevent="downloadTemplate">ดาวน์โหลดเทมเพลต</a>
            </div>
        </div>

        <div class="action-buttons">
            <button class="btn-secondary" @click="cancel" :disabled="isUploading">ยกเลิก</button>
            <button class="btn-primary" :disabled="!canProceed" @click="uploadFile">
                {{ uploadButtonText }}
                <svg v-if="!isUploading" class="icon-arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FileUpload',

    data() {
        return {
            selectedFile: null,
            isDragover: false,
            isUploading: false,
            uploadProgress: 0,
            errorMessage: '',
            validFileTypes: ['.xlsx', '.xls', '.csv'],
            maxFileSize: 10 * 1024 * 1024 // 10MB
        }
    },

    computed: {
        canProceed() {
            return this.selectedFile && !this.isUploading
        },

        uploadButtonText() {
            return this.isUploading ? 'กำลังอัพโหลด...' : 'ดำเนินการต่อ'
        }
    },

    methods: {
        handleFileSelect(event) {
            const file = event.target.files[0]
            if (file) {
                this.validateAndSetFile(file)
            }
        },

        handleDrop(event) {
            this.isDragover = false
            const file = event.dataTransfer.files[0]
            if (file) {
                this.validateAndSetFile(file)
            }
        },

        handleDragOver(event) {
            this.isDragover = true
        },

        handleDragLeave(event) {
            this.isDragover = false
        },

        validateAndSetFile(file) {
            this.errorMessage = ''
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

            // Validate file type
            if (!this.validFileTypes.includes(fileExtension)) {
                this.errorMessage = 'กรุณาอัพโหลดไฟล์ .xlsx, .xls หรือ .csv เท่านั้น'
                return
            }

            // Validate file size
            if (file.size > this.maxFileSize) {
                this.errorMessage = 'ขนาดไฟล์ต้องไม่เกิน 10MB'
                return
            }

            this.selectedFile = file
        },

        removeFile() {
            this.selectedFile = null
            this.errorMessage = ''
            this.uploadProgress = 0
            this.$refs.fileInput.value = ''
        },

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes'
            const k = 1024
            const sizes = ['Bytes', 'KB', 'MB', 'GB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        },

        async uploadFile() {
            if (!this.selectedFile || this.isUploading) return

            this.isUploading = true
            this.uploadProgress = 0
            this.errorMessage = ''

            try {
                const formData = new FormData()
                formData.append('file', this.selectedFile)

                // Simulating upload with progress
                await this.simulateFileUpload(formData)

                // After successful upload
                this.$emit('upload-complete')
                this.uploadProgress = 100
                setTimeout(() => {
                    this.$emit('step-completed')
                }, 1000)
            } catch (error) {
                this.errorMessage = 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์ กรุณาลองใหม่อีกครั้ง'
                console.error('Upload error:', error)
            } finally {
                this.isUploading = false
            }
        },

        // This is a simulation - replace with actual API call
        simulateFileUpload(formData) {
            return new Promise((resolve, reject) => {
                let progress = 0
                const interval = setInterval(() => {
                    progress += 10
                    this.uploadProgress = progress
                    if (progress >= 100) {
                        clearInterval(interval)
                        resolve()
                    }
                }, 500)
            })
        },

        cancel() {
            if (!this.isUploading) {
                this.$router.push('/')
            }
        },

        downloadTemplate() {
            // Implement template download logic
            console.log('Downloading template...')
        }
    }
}
</script>

<style scoped>
.dragover {
    border-color: var(--blue-500);
    background-color: var(--blue-50);
}

.file-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
}

.remove-file {
    background: none;
    border: none;
    color: var(--gray-500);
    cursor: pointer;
    padding: 0.25rem;
}

.remove-file:hover {
    color: var(--gray-900);
}

.upload-progress {
    margin-top: 1rem;
}

.progress-text {
    font-size: 0.875rem;
    color: var(--gray-600);
    margin-top: 0.5rem;
}

.alert-error {
    background-color: #FEE2E2;
    color: #DC2626;
}
</style>