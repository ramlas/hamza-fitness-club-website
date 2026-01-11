// assets/api-service.js - DUAL MODE SIMPLIFIED
console.log('🎯 Loading API service...');

// Detect environment
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
const isVercel = window.location.hostname.includes('vercel.app');
const port = window.location.port;

class SimpleFitnessAPI {
    constructor() {
        // Set base URL based on environment
        if (isLocalhost && (port === '5500' || port === '5501' || port === '5502')) {
            // Local development with Live Server
            this.baseURL = 'http://localhost:3000/api';
            this.mode = 'local';
            console.log('💻 MODE: Local Development');
        } else if (isVercel) {
            // Vercel production
            this.baseURL = '/api';
            this.mode = 'vercel';
            console.log('☁️ MODE: Vercel Production');
        } else if (isLocalhost && port === '3000') {
            // Direct access to Node.js server
            this.baseURL = '/api';
            this.mode = 'node-direct';
            console.log('⚡ MODE: Direct Node.js');
        } else {
            // Other production
            this.baseURL = '/api';
            this.mode = 'production';
            console.log('🚀 MODE: Production');
        }
        
        console.log('✅ API initialized. Base URL:', this.baseURL);
        console.log('📍 Full URL for testing:', window.location.origin + this.baseURL);
    }

    // Health check - works for both modes
    async checkHealth() {
        console.log('🏥 Checking backend health...');
        
        if (this.mode === 'local') {
            // Check local Node.js server
            try {
                const response = await fetch('http://localhost:3000/health', {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const data = await response.json();
                console.log('✅ Local health check passed:', data);
                return data;
            } catch (error) {
                console.warn('⚠️ Local health check failed:', error.message);
                return {
                    status: 'disconnected',
                    error: error.message,
                    message: 'Local server not running. Start with: cd Backend && npm run dev'
                };
            }
        } else {
            // For Vercel/production - check /api/health
            try {
                const healthUrl = this.mode === 'vercel' ? '/api/health' : `${this.baseURL}/health`;
                const fullUrl = healthUrl.startsWith('http') ? healthUrl : window.location.origin + healthUrl;
                
                console.log('🔍 Checking:', fullUrl);
                
                const response = await fetch(fullUrl, {
                    method: 'GET',
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
                
                // Special message for Vercel
                if (this.mode === 'vercel') {
                    return {
                        status: 'vercel-offline',
                        error: error.message,
                        message: 'Vercel API not accessible. Make sure /api/health.js exists at root.'
                    };
                }
                
                return {
                    status: 'disconnected',
                    error: error.message,
                    message: 'Server not reachable'
                };
            }
        }
    }

    // Book appointment - works for both modes
    async bookAppointment(formData) {
        console.log('📤 Booking appointment in', this.mode, 'mode...');
        
        let url;
        
        if (this.mode === 'local') {
            // Local mode
            url = 'http://localhost:3000/api/appointments';
        } else if (this.mode === 'vercel') {
            // Vercel mode - goes to /api/appointments.js
            url = window.location.origin + '/api';
        } else {
            // Other modes
            url = window.location.origin + this.baseURL + '/appointments';
        }
        
        console.log('📡 Sending to:', url);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    bookingMode: this.mode,
                    timestamp: new Date().toISOString()
                })
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
            console.error('❌ Booking failed:', error.message);
            
            // Provide helpful error messages
            if (this.mode === 'local' && error.message.includes('Failed to fetch')) {
                throw new Error('Local backend not running. Please start with: cd Backend && npm run dev');
            } else if (this.mode === 'vercel') {
                throw new Error('Vercel API error. Make sure /api/appointments.js exists at root.');
            }
            
            throw error;
        }
    }

    // Other methods - work for both modes
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
            let url;
            
            if (this.mode === 'local') {
                url = `http://localhost:3000/api${endpoint}`;
            } else if (this.mode === 'vercel') {
                // Vercel endpoints might not have these, but we'll try
                url = window.location.origin + `/api${endpoint}`;
            } else {
                url = window.location.origin + this.baseURL + endpoint;
            }
            
            const response = await fetch(url, {
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Fetch ${endpoint} failed:`, error);
            
            // Return empty array for Vercel if endpoint doesn't exist
            if (this.mode === 'vercel') {
                return { success: true, data: [], note: 'Vercel fallback' };
            }
            
            throw error;
        }
    }
}

// Initialize with auto-detection
try {
    window.API = new SimpleFitnessAPI();
    console.log('✅ API service ready. Mode:', window.API.mode);
    
    // Auto health check after 1 second
    setTimeout(async () => {
        try {
            console.log('🔍 Performing auto health check...');
            const health = await window.API.checkHealth();
            console.log('🏥 Health status:', health.status);
            
            // Show helpful message
            if (health.status === 'OK') {
                console.log('🎉 Backend connected successfully!');
            } else if (window.API.mode === 'local') {
                console.log('💡 Tip: To start local backend:');
                console.log('   1. Open terminal in Backend folder');
                console.log('   2. Run: npm run dev');
                console.log('   3. Wait for "Server running on port 3000"');
            } else if (window.API.mode === 'vercel') {
                console.log('💡 For Vercel, make sure these files exist at root:');
                console.log('   - /api/health.js');
                console.log('   - /api/appointments.js');
            }
        } catch (error) {
            console.log('⚠️ Health check skipped');
        }
    }, 1000);
    
} catch (error) {
    console.error('❌ Failed to initialize API:', error);
    
    // Create emergency fallback
    window.API = {
        mode: 'emergency',
        async checkHealth() {
            return { status: 'emergency', message: 'Using emergency fallback' };
        },
        async bookAppointment(formData) {
            console.log('🆘 Using emergency fallback for booking');
            
            // Save to localStorage
            const booking = {
                ...formData,
                _id: 'EMG-' + Date.now(),
                savedAt: new Date().toISOString(),
                emergency: true
            };
            
            const bookings = JSON.parse(localStorage.getItem('hfc_bookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('hfc_bookings', JSON.stringify(bookings));
            
            // Create email option
            const emailBody = `Emergency Booking Fallback:\n\n` +
                `Name: ${formData.name}\n` +
                `Phone: ${formData.phone}\n` +
                `Email: ${formData.email}\n` +
                `Date: ${formData.date}\n` +
                `Time: ${formData.time}\n` +
                `Concerns: ${formData.concerns?.join(', ') || 'None'}\n` +
                `Saved At: ${new Date().toLocaleString()}`;
            
            return {
                success: true,
                message: 'Saved locally as emergency backup',
                data: booking,
                emailBody: emailBody,
                note: 'Please email the above details to support@hamzafitnessclub.com'
            };
        }
    };
    
    console.log('🔄 Using emergency fallback API');
}

console.log('🎯 API service loaded completely');