// assets/api-service.js - SIMPLIFIED VERSION
console.log('🎯 Loading simplified API service...');

// Check if we're running on localhost
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

class SimpleFitnessAPI {
    constructor() {
        this.baseURL = isLocalhost ? 'http://localhost:3000/api' : '/api';
        console.log('✅ Simple API initialized. Base URL:', this.baseURL);
    }

    // Simple health check
    async checkHealth() {
        console.log('🏥 Checking backend health...');
        try {
            const response = await fetch('http://localhost:3000/health', {
                method: 'GET',
                mode: 'cors',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Health check passed:', data);
            return data;
        } catch (error) {
            console.warn('⚠️ Health check failed:', error.message);
            return {
                status: 'disconnected',
                error: error.message,
                message: 'Server not running. Please start backend with: node server.js'
            };
        }
    }

    // Book appointment
    async bookAppointment(formData) {
        console.log('📤 Booking appointment:', formData);
        
        try {
            const response = await fetch('http://localhost:3000/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
                mode: 'cors'
            });
            
            console.log('📥 Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('✅ Booking successful:', data);
            return data;
        } catch (error) {
            console.error('❌ Booking failed:', error);
            throw error;
        }
    }

    // Other methods (optional)
    async getAppointments() {
        return this._fetch('/appointments');
    }
    
    async getTrainers() {
        return this._fetch('/trainers');
    }
    
    async getMembers() {
        return this._fetch('/members');
    }
    
    async getClasses() {
        return this._fetch('/classes');
    }
    
    async _fetch(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                mode: 'cors',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Fetch ${endpoint} failed:`, error);
            throw error;
        }
    }
}

// Initialize
try {
    window.API = new SimpleFitnessAPI();
    console.log('✅ API service ready. Methods:', Object.keys(Object.getPrototypeOf(window.API)));
} catch (error) {
    console.error('❌ Failed to initialize API:', error);
    window.API = null;
}

console.log('🎯 API service loaded');