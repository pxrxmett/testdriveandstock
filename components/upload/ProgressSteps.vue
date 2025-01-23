<template>
    <div class="steps-container">
        <div class="progress-steps">
            <div v-for="(step, index) in steps" :key="index" :class="['step-item', {
                'active': currentStep === index + 1,
                'completed': currentStep > index + 1
            }]">
                <div class="step-circle">
                    <template v-if="currentStep > index + 1">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </template>
                    <template v-else>
                        {{ index + 1 }}
                    </template>
                </div>
                <span class="step-label">{{ step }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProgressSteps',
    props: {
        currentStep: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            steps: ['อัพโหลดไฟล์', 'ตรวจสอบข้อมูล', 'เสร็จสิ้น']
        }
    }
}
</script>

<style scoped>
.steps-container {
    padding: 2rem 0;
}

.progress-steps {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    margin: 0 auto;
    max-width: 600px;
}

.progress-steps::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #E5E7EB;
    z-index: 1;
}

.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    flex: 1;
}

.step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: white;
    border: 2px solid #E5E7EB;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
    color: #6B7280;
}

.step-label {
    font-size: 0.875rem;
    color: #6B7280;
    text-align: center;
    transition: color 0.3s ease;
}

.step-item.active .step-circle {
    border-color: #3B82F6;
    background: #3B82F6;
    color: white;
}

.step-item.active .step-label {
    color: #3B82F6;
    font-weight: 500;
}

.step-item.completed .step-circle {
    background: #10B981;
    border-color: #10B981;
    color: white;
}

.check-icon {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 3;
}
</style>