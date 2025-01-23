<template>
    <div class="upload-section">
        <div class="dropzone" :class="{ 'drag-over': isDragOver }" @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
            <input type="file" id="file-upload" class="file-input" accept=".xlsx,.xls,.csv" @change="handleFileSelect">
            <label for="file-upload" class="dropzone-label">
                <transition name="fade" mode="out-in">
                    <div v-if="!selectedFile" class="dropzone-content" key="upload">
                        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 5 17 10" />
                            <line x1="12" y1="5" x2="12" y2="15" />
                        </svg>
                        <h3 class="upload-title">อัพโหลดไฟล์ Stock</h3>
                        <p class="upload-text">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                        <p class="file-types">(.xlsx, .xls, .csv)</p>
                    </div>
                    <div v-else class="file-info" key="file">
                        <div class="file-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                                <polyline points="13 2 13 9 20 9" />
                            </svg>
                        </div>
                        <div class="file-details">
                            <span class="file-name">{{ selectedFile.name }}</span>
                            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
                        </div>
                        <button class="remove-file" @click.prevent="removeFile">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </transition>
            </label>
        </div>

        <div class="alert-info">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
            <span>รองรับไฟล์ .xlsx, .xls และ .csv เท่านั้น</span>
        </div>

        <div class="action-buttons">
            <button class="btn-secondary" @click="$emit('cancel')">
                ยกเลิก
            </button>
            <button class="btn-primary" :disabled="!selectedFile" @click="$emit('continue')">
                <span>ดำเนินการต่อ</span>
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UploadSection',
    props: {
        selectedFile: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            isDragOver: false
        }
    },
    methods: {
        handleFileSelect(event) {
            const file = event.target.files[0]
            if (file) this.$emit('fileSelected', file)
        },
        handleDragOver(event) {
            this.isDragOver = true
        },
        handleDragLeave(event) {
            this.isDragOver = false
        },
        handleDrop(event) {
            this.isDragOver = false
            const file = event.dataTransfer.files[0]
            if (file) this.$emit('fileSelected', file)
        },
        removeFile() {
            this.$emit('fileSelected', null)
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes'
            const k = 1024
            const sizes = ['Bytes', 'KB', 'MB', 'GB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        }
    }
}
</script>

<style scoped>
.upload-section {
    padding: 2rem;
    background: white;
    border-radius: 0.75rem;
}

.dropzone {
    border: 2px dashed #CBD5E1;
    border-radius: 1rem;
    padding: 2.5rem;
    text-align: center;
    transition: all 0.3s ease;
    background: #F8FAFC;
}

.drag-over {
    border-color: #3B82F6;
    background: #EFF6FF;
}

.upload-icon {
    width: 3rem;
    height: 3rem;
    color: #64748B;
    margin-bottom: 1rem;
    transition: color 0.3s ease;
}

.dropzone:hover .upload-icon {
    color: #3B82F6;
}

.upload-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1E293B;
}

.upload-text {
    color: #64748B;
    margin-bottom: 0.5rem;
}

.file-types {
    color: #94A3B8;
    font-size: 0.875rem;
}

.file-info {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.file-icon {
    width: 2.5rem;
    height: 2.5rem;
    color: #3B82F6;
    margin-right: 1rem;
}

.file-details {
    flex: 1;
    text-align: left;
}

.file-name {
    display: block;
    font-weight: 500;
    color: #1E293B;
    margin-bottom: 0.25rem;
}

.file-size {
    color: #64748B;
    font-size: 0.875rem;
}

.remove-file {
    width: 2rem;
    height: 2rem;
    padding: 0.5rem;
    border: none;
    background: none;
    color: #94A3B8;
    cursor: pointer;
    transition: color 0.3s ease;
}

.remove-file:hover {
    color: #EF4444;
}

.alert-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    margin: 1.5rem 0;
    background: #EFF6FF;
    border-radius: 0.5rem;
    color: #1D4ED8;
}

.info-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-primary {
    background: #3B82F6;
    color: white;
    border: none;
}

.btn-primary:hover:not(:disabled) {
    background: #2563EB;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-secondary {
    background: white;
    color: #1E293B;
    border: 1px solid #E2E8F0;
}

.btn-secondary:hover {
    background: #F8FAFC;
    border-color: #CBD5E1;
}

.arrow-icon {
    width: 1.25rem;
    height: 1.25rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>