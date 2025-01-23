<template>
    <div class="container">
        <!-- Success Popup -->
        <div v-if="showSuccessPopup" class="popup-overlay">
            <div class="popup-content">
                <div class="success-icon">
                    <svg class="w-16 h-16 text-green-500" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <h2 class="popup-title">บันทึกรถเข้า Stock สำเร็จ</h2>
                <p class="popup-subtitle">ระบบได้บันทึกข้อมูลรถเรียบร้อยแล้ว</p>
                <div class="popup-buttons">
                    <button @click="btnBackHome" class="btn-back">กลับหน้าแรก</button>
                    <button @click="btnAddMore" class="btn-add-more">บันทึกเพิ่ม</button>
                </div>
            </div>
        </div>

        <!-- Original Content -->
        <div class="header">
            <button @click="$router.back()" class="back-button">
                <span class="back-icon">←</span>
                กลับ
            </button>
            <h1 class="title">บันทึกรถเข้า Stock</h1>
        </div>

        <div class="form-container">
            <h2 class="section-title">ข้อมูลรถยนต์</h2>

            <form @submit.prevent="handleSubmit" class="form-grid">
                <!-- รุ่นรถ -->
                <div class="form-group">
                    <label class="required">รุ่นรถ</label>
                    <select v-model="formData.model" required>
                        <option value="">เลือกรุ่นรถ</option>
                        <option value="BYD SEALION">BYD SEALION</option>
                        <option value="BYD DOLPHIN">BYD DOLPHIN</option>
                    </select>
                </div>

                <!-- รุ่นย่อย -->
                <div class="form-group">
                    <label class="required">รุ่นย่อย</label>
                    <select v-model="formData.subModel" required>
                        <option value="">เลือกรุ่นย่อย</option>
                        <option value="6 DM-i Dynamic">6 DM-i Dynamic</option>
                        <option value="6 DM-i Premium">6 DM-i Premium</option>
                        <option value="435KM-STD">435KM-STD</option>
                    </select>
                </div>

                <!-- สี -->
                <div class="form-group">
                    <label class="required">สี</label>
                    <input type="text" v-model="formData.color" placeholder="ระบุสี" required>
                </div>

                <!-- ปีรถ -->
                <div class="form-group">
                    <label class="required">ปีรถ</label>
                    <input type="text" v-model="formData.year" placeholder="พ.ศ." pattern="\d{4}" maxlength="4" required>
                </div>

                <!-- หมายเลข VIN -->
                <div class="form-group">
                    <label class="required">หมายเลข VIN</label>
                    <input type="text" v-model="formData.vin" placeholder="หมายเลขตัวถัง" maxlength="17" required>
                    <div class="hint-text">กรอกหมายเลขตัวถัง 17 หลัก</div>
                </div>

                <!-- หมายเลขเครื่องยนต์ -->
                <div class="form-group">
                    <label class="required">หมายเลขเครื่องยนต์</label>
                    <input type="text" v-model="formData.engineNo" placeholder="หมายเลขเครื่องยนต์" required>
                </div>
            </form>

            <div class="button-group">
                <button @click="$router.back()" class="btn-cancel">ยกเลิก</button>
                <button @click="handleSubmit" class="btn-submit">บันทึก</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddStock',
    data() {
        return {
            formData: {
                model: '',
                subModel: '',
                color: '',
                year: '',
                vin: '',
                engineNo: ''
            },
            errors: [],
            showSuccessPopup: false
        }
    },
    methods: {
        validateForm() {
            this.errors = []

            // Check VIN number
            if (this.formData.vin.length !== 17) {
                this.errors.push('กรุณากรอกหมายเลข VIN ให้ครบ 17 หลัก')
            }

            // Check year format
            const yearPattern = /^\d{4}$/
            if (!yearPattern.test(this.formData.year)) {
                this.errors.push('กรุณากรอกปี พ.ศ. ให้ถูกต้อง')
            }

            return this.errors.length === 0
        },
        async handleSubmit() {
            if (!this.validateForm()) {
                alert(this.errors.join('\n'))
                return
            }

            try {
                await this.$store.dispatch('stock/addStock', this.formData)
                this.showSuccessPopup = true
            } catch (error) {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
                console.error('Error:', error)
            }
        },
        btnBackHome() {
            this.$router.push('/')
        },
        btnAddMore() {
            this.showSuccessPopup = false
            this.formData = {
                model: '',
                subModel: '',
                color: '',
                year: '',
                vin: '',
                engineNo: ''
            }
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
}

.back-button {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border: none;
    background: none;
    color: #6B7280;
    cursor: pointer;
    font-size: 14px;
}

.back-icon {
    margin-right: 8px;
}

.title {
    font-size: 24px;
    font-weight: 600;
    margin-left: 16px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 24px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 32px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

label {
    font-size: 14px;
    color: #374151;
    margin-bottom: 8px;
}

.required::after {
    content: ' *';
    color: #DC2626;
}

input,
select {
    padding: 8px 12px;
    border: 1px solid #D1D5DB;
    border-radius: 6px;
    font-size: 14px;
    background-color: white;
}

input:focus,
select:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.hint-text {
    font-size: 12px;
    color: #6B7280;
    margin-top: 4px;
}

.button-group {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-cancel {
    padding: 8px 24px;
    border: 1px solid #D1D5DB;
    background: white;
    color: #374151;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.btn-submit {
    padding: 8px 24px;
    background: #10B981;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.btn-submit:hover {
    background: #059669;
}

.btn-cancel:hover {
    background: #F9FAFB;
}

/* Popup Styles */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background-color: white;
    padding: 2rem;
    border-radius: 0.75rem;
    text-align: center;
    max-width: 400px;
    width: 90%;
}

.success-icon {
    margin: 0 auto 1rem;
    width: 64px;
    height: 64px;
}

.popup-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
}

.popup-subtitle {
    color: #6B7280;
    margin-bottom: 1.5rem;
}

.popup-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.btn-back {
    padding: 0.75rem;
    background-color: white;
    border: 1px solid #D1D5DB;
    border-radius: 0.5rem;
    color: #374151;
    font-weight: 500;
    width: 100%;
}

.btn-add-more {
    padding: 0.75rem;
    background-color: #10B981;
    border: none;
    border-radius: 0.5rem;
    color: white;
    font-weight: 500;
    width: 100%;
}

.btn-back:hover {
    background-color: #F9FAFB;
}

.btn-add-more:hover {
    background-color: #059669;
}

@media (max-width: 640px) {
    .container {
        padding: 16px;
    }

    .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .button-group {
        flex-direction: column-reverse;
    }

    .btn-cancel,
    .btn-submit {
        width: 100%;
        padding: 12px;
    }
}
</style>