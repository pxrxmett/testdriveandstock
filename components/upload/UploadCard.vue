<template>
    <div class="main-card">
        <div class="card-header">
            <h2>ขั้นตอนการเพิ่มข้อมูลเข้า Stock</h2>
        </div>
        <div class="card-content">
            <ProgressSteps :current-step="currentStep" />
            <FileUpload @step-completed="nextStep" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'UploadCard',
    data() {
        return {
            currentStep: 1
        }
    },
    methods: {
        nextStep() {
            if (this.currentStep < 4) {
                this.currentStep++
            }
        }
    }
}
</script>