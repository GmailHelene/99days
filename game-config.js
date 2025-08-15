// Spillkonstanter for "Beyond 99 Days in the Woods"

// Automatically detect server URL based on environment
function getServerUrl() {
    // In production, try to detect server URL from current domain
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol === 'https:' ? 'https://' : 'http://';
        
        // If on localhost, use development server
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3001';
        }
        
        // For production, use a default production server URL
        return 'https://99days-production.up.railway.app';
    }
    
    return 'http://localhost:3001';
}

// Make sure we don't redefine GAME_CONFIG
if (typeof window !== 'undefined' && typeof window.GAME_CONFIG === 'undefined') {
    window.GAME_CONFIG = {
        CANVAS_WIDTH: window.innerWidth || 800,
        CANVAS_HEIGHT: window.innerHeight || 600,
        PLAYER_SPEED: 2.5,
        DAY_DURATION: 180000, // 3 minutter per dag for mer intensiv opplevelse
        INVENTORY_SIZE: 20,
        MAX_DAYS: 99,
        MEMORY_BAND_FREQUENCY: 2, // Hvert 2. dag får du minnebånd
        INTERACTION_DISTANCE: 60,
        RESOURCE_RESPAWN_MIN: 20000, // 20 sekunder
        RESOURCE_RESPAWN_MAX: 60000, // 60 sekunder
        MATH_PROBLEM_DIFFICULTY: 2, // 1-5 der 5 er vanskeligst
        MATH_PROBLEM_TIME_LIMIT: 15, // Sekunder
        MULTIPLAYER_ENABLED: false,
        MULTIPLAYER_MAX_PLAYERS: 4,
        MULTIPLAYER_UPDATE_INTERVAL: 1000,
        FORGETFULNESS_ZONES: 5, // Antall glemselssoner
        SKILL_TREES: ['hunting', 'medicine', 'construction', 'survival', 'mysticism'],
        SERVER_URL: getServerUrl(),
        WORLD_SIZE: { width: 3000, height: 3000 },
        BIOMES: {
            0: { name: 'Tåkeskog', color: '#2F4F2F', special: 'Ekkende rop om hjelp' },
            1: { name: 'Myr', color: '#8B4513', special: 'Forgiftet vannkilde' },
            2: { name: 'Furu-platå', color: '#228B22', special: 'Snødekte ruinfragmenter' },
            3: { name: 'Bjergtunnel', color: '#696969', special: 'Mystiske ruiner' },
            4: { name: 'Glemme-oren', color: '#800080', special: 'Du glemmer ting her' }
        },
        CAMERA_SPEED: 0.08
    };
    console.log('✅ Game config initialized successfully');
} else if (typeof window !== 'undefined') {
    console.log('⚠️ Game config already exists, not redefining');
}

// For compatibility with code that expects GAME_CONFIG as a local constant
const GAME_CONFIG = typeof window !== 'undefined' ? window.GAME_CONFIG : {};
