class FitnessClubAPI {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
    }

    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        try {
            console.log(`🌐 ${method} ${url}`, data || '');
            const response = await fetch(url, options);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `HTTP ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error(`❌ API Error:`, error.message);
            throw error;
        }
    }

    // Member methods
    async getMembers() {
        return this.request('/members');
    }

    async createMember(memberData) {
        return this.request('/members', 'POST', memberData);
    }

    async getMember(id) {
        return this.request(`/members/${id}`);
    }

    // Trainer methods
    async getTrainers() {
        return this.request('/trainers');
    }

    async createTrainer(trainerData) {
        return this.request('/trainers', 'POST', trainerData);
    }

    // Appointment methods
    async getAppointments() {
        return this.request('/appointments');
    }

    async createAppointment(appointmentData) {
        return this.request('/appointments', 'POST', appointmentData);
    }

    // Class methods
    async getClasses() {
        return this.request('/classes');
    }

    async createClass(classData) {
        return this.request('/classes', 'POST', classData);
    }
}

window.API = new FitnessClubAPI();