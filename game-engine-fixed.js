// Dummy pauseGame for HTML button
// Pause-knapp for mobil
function pauseGame() {
    if (window.game && window.game.gameState === 'playing') {
        window.game.togglePauseMenu();
    }
}
// Beyond 99 Days in the Woods - Utvidet versjon med mer funksjonalitet

// 🚀 GAME ENGINE FIXED - NO RELOAD LOOPS! v5.0
console.log('🎮 Game Engine FIXED v5.0 - No more loading loops!');

// Spillkonfigurasjon
const GAME_CONFIG = {
    WORLD_WIDTH: 2000,
    WORLD_HEIGHT: 2000,
    PLAYER_SPEED: 3,
    DAY_DURATION: 2400000, // 40 minutter per dag (halvparten så fort)
    INTERACTION_DISTANCE: 50
};

// Inventory system
class Inventory {
    constructor() {
        this.items = {};
        this.maxSlots = 20;
    }

    addItem(type, amount = 1) {
        if (this.items[type]) {
            this.items[type] += amount;
        } else {
            this.items[type] = amount;
        }
        return true;
    }

    removeItem(type, amount = 1) {
        if (this.items[type] && this.items[type] >= amount) {
            this.items[type] -= amount;
            if (this.items[type] <= 0) {
                delete this.items[type];
            }
            return true;
        }
        return false;
    }

    hasItem(type, amount = 1) {
        return this.items[type] && this.items[type] >= amount;
    }

    getItemCount(type) {
        return this.items[type] || 0;
    }

    getAllItems() {
        return this.items;
    }
}

// Player klasse
// 🔥 WORKING VERSION v4.0 - NO SYNTAX ERRORS
console.log('🚀 Game Engine v4.0 Loaded Successfully!');

// Force cache refresh on load
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.update();
        }
    });
}

// Simple version tracking - NO RELOADS!
const currentVersion = '5.0-FIXED';
console.log('🎮 Game version:', currentVersion, '- No reload loops!');

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 36;
        this.speed = GAME_CONFIG.PLAYER_SPEED;
        this.health = 100;
        this.hunger = 100;
        this.thirst = 100;
        this.energy = 100;
        this.warmth = 100;
        this.direction = 'down';
        this.inputKeys = {};
        this.velX = 0;
        this.velY = 0;
        this.inventory = new Inventory();
    }

    setMovement(vx, vy) {
        this.velX = vx * this.speed;
        this.velY = vy * this.speed;
    }

    update(deltaTime) {
        // Bevegelse fra input
        let moveX = 0;
        let moveY = 0;

        if (this.inputKeys['w'] || this.inputKeys['arrowup']) {
            moveY -= this.speed;
            this.direction = 'up';
        }
        if (this.inputKeys['s'] || this.inputKeys['arrowdown']) {
            moveY += this.speed;
            this.direction = 'down';
        }
        if (this.inputKeys['a'] || this.inputKeys['arrowleft']) {
            moveX -= this.speed;
            this.direction = 'left';
        }
        if (this.inputKeys['d'] || this.inputKeys['arrowright']) {
            moveX += this.speed;
            this.direction = 'right';
        }

        // Virtual joystick movement
        moveX += this.velX;
        moveY += this.velY;

        // Oppdater posisjon
        this.x += moveX;
        this.y += moveY;

        // Begrens til verden
        this.x = Math.max(this.width/2, Math.min(this.x, GAME_CONFIG.WORLD_WIDTH - this.width/2));
        this.y = Math.max(this.height/2, Math.min(this.y, GAME_CONFIG.WORLD_HEIGHT - this.height/2));

        // Stats decay
        const seconds = deltaTime / 1000;
        this.hunger = Math.max(0, this.hunger - 0.5 * seconds);
        this.thirst = Math.max(0, this.thirst - 0.7 * seconds);
        this.energy = Math.max(0, this.energy - 0.3 * seconds);
        this.warmth = Math.max(0, this.warmth - 0.4 * seconds);

        // Health effects
        if (this.hunger <= 0) this.health -= 1 * seconds;
        if (this.thirst <= 0) this.health -= 2 * seconds;
        if (this.warmth <= 0) this.health -= 0.5 * seconds;
        
        this.health = Math.max(0, this.health);
    }

    // Konsumer mat/drikke
    consume(itemType) {
        if (!this.inventory.hasItem(itemType) || this.inventory.items[itemType] < 1) {
            if (window.game && window.game.showNotification) {
                window.game.showNotification('Du har ikke flere igjen av dette!');
            }
            return false;
        }
        let effectMsg = '';
        switch(itemType) {
            case 'berries':
                this.hunger = Math.min(100, this.hunger + 20);
                this.health = Math.min(100, this.health + 5);
                effectMsg = 'Du spiste bær! Sult +20, Helse +5';
                break;
            case 'water':
                this.thirst = Math.min(100, this.thirst + 30);
                effectMsg = 'Du drakk vann! Tørst +30';
                break;
            case 'mushrooms':
                this.hunger = Math.min(100, this.hunger + 15);
                this.energy = Math.min(100, this.energy + 10);
                effectMsg = 'Du spiste sopp! Sult +15, Energi +10';
                break;
            case 'stone':
                effectMsg = 'Du kan ikke bruke stein direkte.';
                break;
            default:
                effectMsg = 'Kan ikke bruke dette elementet.';
        }
        this.inventory.removeItem(itemType, 1);
        if (window.game && window.game.showNotification && effectMsg) {
            window.game.showNotification(effectMsg);
        }
        return true;
    }

    render(ctx) {
        ctx.save();
        
        // Skygge
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.height/2, this.width/2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Kropp
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height * 0.7);
        
        // Hode
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(this.x - this.width/2 + 3, this.y - this.height/2, this.width - 6, this.height * 0.3);
        
        // Øyne
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - 6, this.y - this.height/2 + 5, 2, 2);
        ctx.fillRect(this.x + 4, this.y - this.height/2 + 5, 2, 2);
        
        // Helsebar over hodet
        const barWidth = this.width;
        const barHeight = 4;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - barWidth/2, this.y - this.height/2 - 10, barWidth, barHeight);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - barWidth/2, this.y - this.height/2 - 10, barWidth * (this.health/100), barHeight);
        
        ctx.restore();
    }
}

// Utvidet verden med interaksjon
class EnhancedWorld {
    constructor() {
        this.resources = [];
        this.currentDay = 1;
        this.timeOfDay = 8; // Start kl 08:00
        this.gameTime = 0;
        this.generateResources();
    }

    generateResources() {
        const resourceTypes = [
            { 
                type: 'tree', 
                icon: '🌲', 
                color: '#228B22', 
                size: 30,
                harvestable: true,
                yields: { wood: 3, berries: 1 }
            },
            { 
                type: 'stone', 
                icon: '🪨', 
                color: '#696969', 
                size: 25,
                harvestable: true,
                yields: { stone: 2 }
            },
            { 
                type: 'berries', 
                icon: '🫐', 
                color: '#4B0082', 
                size: 20,
                harvestable: true,
                yields: { berries: 2 }
            },
            { 
                type: 'water', 
                icon: '💧', 
                color: '#4682B4', 
                size: 35,
                harvestable: true,
                yields: { water: 5 }
            },
            { 
                type: 'mushrooms', 
                icon: '🍄', 
                color: '#8B4513', 
                size: 22,
                harvestable: true,
                yields: { mushrooms: 2 }
            }
        ];

        for (let i = 0; i < 100; i++) {
            const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
            this.resources.push({
                id: `res_${i}`,
                ...resourceType,
                x: 100 + Math.random() * (GAME_CONFIG.WORLD_WIDTH - 200),
                y: 100 + Math.random() * (GAME_CONFIG.WORLD_HEIGHT - 200),
                harvested: false,
                respawnTime: 30000 + Math.random() * 60000 // 30-90 sekunder
            });
        }
    }

    update(deltaTime) {
        this.gameTime += deltaTime;
    // Nå går tiden i ekte sekunder, 1 dag = 24 timer
    this.timeOfDay = 8 + (this.gameTime / 1000) * (24 / (GAME_CONFIG.DAY_DURATION / 1000));
        
        if (this.timeOfDay >= 24) {
            this.currentDay++;
            this.timeOfDay = 8;
            this.gameTime = 0;
        }

        // Respawn ressurser
        this.resources.forEach(resource => {
            if (resource.harvested && Date.now() - resource.harvestedAt > resource.respawnTime) {
                resource.harvested = false;
                delete resource.harvestedAt;
            }
        });
    }

    getTimeString() {
        const hours = Math.floor(this.timeOfDay);
        const minutes = Math.floor((this.timeOfDay - hours) * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // Finn ressurser nær spilleren
    getResourcesNear(x, y, distance) {
        return this.resources.filter(resource => {
            if (resource.harvested) return false;
            const dx = resource.x - x;
            const dy = resource.y - y;
            return Math.sqrt(dx * dx + dy * dy) <= distance;
        });
    }

    // Høst ressurs
    harvestResource(resource, player) {
        if (resource.harvested || !resource.harvestable) return null;

        resource.harvested = true;
        resource.harvestedAt = Date.now();

        // Legg til items i inventory
        for (const [itemType, amount] of Object.entries(resource.yields)) {
            player.inventory.addItem(itemType, amount);
        }

        return resource.yields;
    }

    render(ctx) {
        // Bakgrunn gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.WORLD_HEIGHT);
        gradient.addColorStop(0, '#87CEEB'); // Himmelblå
        gradient.addColorStop(0.7, '#90EE90'); // Lysegrønn
        gradient.addColorStop(1, '#228B22'); // Skoggrønn
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);

        // Tegn noen enkle bakgrunnselementer
        ctx.fillStyle = 'rgba(34, 139, 34, 0.3)';
        for (let i = 0; i < 20; i++) {
            const x = (i * 150) % GAME_CONFIG.WORLD_WIDTH;
            const y = (Math.floor(i / 10) * 200) % GAME_CONFIG.WORLD_HEIGHT;
            ctx.beginPath();
            ctx.arc(x, y, 10 + Math.random() * 8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Ressurser
        this.resources.forEach(resource => {
            if (resource.harvested) return;

            // Bakgrunn for ressurs
            ctx.fillStyle = resource.color;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.arc(resource.x, resource.y, resource.size/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Ikon
            ctx.font = `${resource.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(resource.icon, resource.x, resource.y);
        });
    }
}

// Hovedspillklasse
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'playing';
        this.player = new Player(GAME_CONFIG.WORLD_WIDTH / 2, GAME_CONFIG.WORLD_HEIGHT / 2);
        this.world = new EnhancedWorld();
        this.lastTime = 0;
        this.showInventory = false;
        this.keys = {};
        this.isPaused = false;
        
        // Sett opp canvas størrelse
        this.resizeCanvas();
        
        // Legg til event listeners
        this.setupEventListeners();
        
        // Start spill loop
        this.gameLoop();
        
        // Start UI oppdateringer
        this.updateUI();
        setInterval(() => this.updateUI(), 1000);
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === 'i') this.showInventory = !this.showInventory;
            if (e.key === 'Escape') this.togglePauseMenu();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Touch/mouse events for mobile
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchstart', (e) => this.handleClick(e));
    }
    
    handleClick(e) {
        if (this.gameState !== 'playing') return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        // Sjekk for interaksjon med ressurser
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const worldX = x - centerX + this.player.x;
        const worldY = y - centerY + this.player.y;
        
        const nearbyResources = this.world.getResourcesNear(worldX, worldY, 30);
        if (nearbyResources.length > 0) {
            this.harvestResource(nearbyResources[0]);
        }
    }
    
    harvestResource(resource) {
        if (resource.harvested) return;
        
        resource.harvested = true;
        for (const [itemType, amount] of Object.entries(resource.yields)) {
            this.player.inventory.addItem(itemType, amount);
        }
        
        if (this.showNotification) {
            this.showNotification(`Samlet ${Object.keys(resource.yields).join(', ')}`);
        }
    }

    updateUI() {
        if (this.gameState !== 'playing' || !this.player || !this.world) return;
        // Oppdater stats
        document.getElementById('dayCounter').textContent = this.world.currentDay;
        document.getElementById('timeDisplay').textContent = this.world.getTimeString();
        // Oppdater permanent tid/dag display
        const permTime = document.getElementById('permanentTimeDisplay');
        const permDay = document.getElementById('permanentDayCounter');
        if (permTime) permTime.textContent = this.world.getTimeString();
        if (permDay) permDay.textContent = this.world.currentDay;
        if (window.innerWidth <= 768) {
            if (permTime) permTime.style.display = 'block';
        }
        // Oppdater ressursbarer
        document.getElementById('healthBar').style.width = `${this.player.health}%`;
        document.getElementById('hungerBar').style.width = `${this.player.hunger}%`;
        document.getElementById('thirstBar').style.width = `${this.player.thirst}%`;
        document.getElementById('energyBar').style.width = `${this.player.energy}%`;
        document.getElementById('warmthBar').style.width = `${this.player.warmth}%`;
        
        // Oppdater mobil status verdier og barer
        const mobileHealthValue = document.getElementById('mobileHealthValue');
        const mobileHungerValue = document.getElementById('mobileHungerValue');
        const mobileThirstValue = document.getElementById('mobileThirstValue');
        const mobileEnergyValue = document.getElementById('mobileEnergyValue');
        const mobileHealthFill = document.getElementById('mobileHealthFill');
        const mobileHungerFill = document.getElementById('mobileHungerFill');
        const mobileThirstFill = document.getElementById('mobileThirstFill');
        const mobileEnergyFill = document.getElementById('mobileEnergyFill');
        
        if (mobileHealthValue) mobileHealthValue.textContent = Math.round(this.player.health);
        if (mobileHungerValue) mobileHungerValue.textContent = Math.round(this.player.hunger);
        if (mobileThirstValue) mobileThirstValue.textContent = Math.round(this.player.thirst);
        if (mobileEnergyValue) mobileEnergyValue.textContent = Math.round(this.player.energy);
        if (mobileHealthFill) mobileHealthFill.style.width = `${this.player.health}%`;
        if (mobileHungerFill) mobileHungerFill.style.width = `${this.player.hunger}%`;
        if (mobileThirstFill) mobileThirstFill.style.width = `${this.player.thirst}%`;
        if (mobileEnergyFill) mobileEnergyFill.style.width = `${this.player.energy}%`;
        // Legg til touchend event på inventory-slot for mobil
        const grid = document.getElementById('inventoryGrid');
        if (grid) {
            const slots = grid.querySelectorAll('.inventory-slot');
            slots.forEach(slot => {
                if (!slot.hasTouchListener) {
                    slot.addEventListener('touchend', function() {
                        const itemType = slot.getAttribute('data-item');
                        if (itemType && window.game) {
                            window.game.useInventoryItem(itemType);
                        }
                    });
                    slot.hasTouchListener = true;
                }
            });
        }
    }
    // Methods moved inside class
    updateUI() {
        if (this.gameState !== 'playing' || !this.player || !this.world) return;
        document.getElementById('dayCounter').textContent = this.world.currentDay;
        document.getElementById('timeDisplay').textContent = this.world.getTimeString();
        const permTime = document.getElementById('permanentTimeDisplay');
        const permDay = document.getElementById('permanentDayCounter');
        if (permTime) permTime.textContent = this.world.getTimeString();
        if (permDay) permDay.textContent = this.world.currentDay;
        if (window.innerWidth <= 768) {
            if (permTime) permTime.style.display = 'block';
        }
        
        // Update main status bars
        document.getElementById('healthBar').style.width = `${this.player.health}%`;
        document.getElementById('hungerBar').style.width = `${this.player.hunger}%`;
        document.getElementById('thirstBar').style.width = `${this.player.thirst}%`;
        document.getElementById('energyBar').style.width = `${this.player.energy}%`;
        document.getElementById('warmthBar').style.width = `${this.player.warmth}%`;
        
        // Update mobile status bars with proper values and colors
        const mobileHealthFill = document.getElementById('mobileHealthFill');
        const mobileHungerFill = document.getElementById('mobileHungerFill');
        const mobileThirstFill = document.getElementById('mobileThirstFill');
        const mobileEnergyFill = document.getElementById('mobileEnergyFill');
        
        const mobileHealthValue = document.getElementById('mobileHealthValue');
        const mobileHungerValue = document.getElementById('mobileHungerValue');
        const mobileThirstValue = document.getElementById('mobileThirstValue');
        const mobileEnergyValue = document.getElementById('mobileEnergyValue');
        
        if (mobileHealthFill) {
            mobileHealthFill.style.width = `${this.player.health}%`;
            mobileHealthFill.style.background = this.player.health > 50 ? '#4CAF50' : this.player.health > 25 ? '#FF9800' : '#F44336';
        }
        if (mobileHungerFill) {
            mobileHungerFill.style.width = `${this.player.hunger}%`;
            mobileHungerFill.style.background = this.player.hunger > 50 ? '#FF9800' : this.player.hunger > 25 ? '#FF5722' : '#F44336';
        }
        if (mobileThirstFill) {
            mobileThirstFill.style.width = `${this.player.thirst}%`;
            mobileThirstFill.style.background = this.player.thirst > 50 ? '#2196F3' : this.player.thirst > 25 ? '#FF9800' : '#F44336';
        }
        if (mobileEnergyFill) {
            mobileEnergyFill.style.width = `${this.player.energy}%`;
            mobileEnergyFill.style.background = this.player.energy > 50 ? '#FFEB3B' : this.player.energy > 25 ? '#FF9800' : '#F44336';
        }
        
        if (mobileHealthValue) mobileHealthValue.textContent = Math.round(this.player.health);
        if (mobileHungerValue) mobileHungerValue.textContent = Math.round(this.player.hunger);
        if (mobileThirstValue) mobileThirstValue.textContent = Math.round(this.player.thirst);
        if (mobileEnergyValue) mobileEnergyValue.textContent = Math.round(this.player.energy);
        
        const grid = document.getElementById('inventoryGrid');
        if (grid) {
            const slots = grid.querySelectorAll('.inventory-slot');
            slots.forEach(slot => {
                if (!slot.hasTouchListener) {
                    slot.addEventListener('touchend', function() {
                        const itemType = slot.getAttribute('data-item');
                        if (itemType && window.game) {
                            window.game.useInventoryItem(itemType);
                        }
                    });
                    slot.hasTouchListener = true;
                }
            });
        }
    }

    gameLoop(timestamp = 0) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        if (this.gameState === 'playing') {
            this.update(deltaTime);
            this.render();
            this.updateUI();
        }
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(deltaTime) {
        if (this.world) {
            this.world.update(deltaTime);
        }
        if (this.player) {
            this.player.update(deltaTime);
            if (this.player.health <= 0) {
                alert('Du døde! Spillet er over.');
                this.exitToMainMenu();
            }
            if (this.world && this.world.currentDay > 99) {
                alert('Gratulerer! Du overlevde 99 dager!');
                this.exitToMainMenu();
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.gameState === 'playing' && this.player && this.world) {
            this.ctx.save();
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            this.ctx.translate(centerX - this.player.x, centerY - this.player.y);
            this.world.render(this.ctx);
            this.player.render(this.ctx);
            const nearbyResources = this.world.getResourcesNear(
                this.player.x,
                this.player.y,
                GAME_CONFIG.INTERACTION_DISTANCE
            );
            if (nearbyResources.length > 0) {
                this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(this.player.x, this.player.y, GAME_CONFIG.INTERACTION_DISTANCE, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            this.ctx.restore();
            if (this.showInventory) {
                this.renderInventory();
            }
        }
    }

    renderInventory() {
        if (!this.player) return;
        const items = this.player.inventory.getAllItems();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(50, 50, 300, 200);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Lukk [I]', 60, 70);
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Inventar', 60, 95);
        let y = 120;
        for (const [itemType, amount] of Object.entries(items)) {
            let icon = '';
            if (itemType === 'wood') icon = '🌲';
            else if (itemType === 'stone') icon = '🪨';
            else if (itemType === 'berries') icon = '🫐';
            else if (itemType === 'water') icon = '💧';
            else if (itemType === 'mushrooms') icon = '🍄';
            this.ctx.font = '20px Arial';
            this.ctx.fillText(icon, 60, y);
            this.ctx.font = '16px Arial';
            this.ctx.fillText(`${itemType}: ${amount}`, 90, y);
            y += 30;
        }
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#ccc';
        this.ctx.fillText('1: Spis bær, 2: Drikk vann, 3: Spis sopp', 60, 245);
        this.ctx.fillStyle = '#ccc';
        this.ctx.fillText('Trykk I for å lukke', 60, 230);
        this.ctx.fillText('1: Spis bær, 2: Drikk vann, 3: Spis sopp', 60, 245);
    }
        // Bruk item fra inventar (for mobil touch)
        useInventoryItem(itemType) {
            if (!this.player) return;
            // Konsumerer item hvis mulig
            const consumed = this.player.consume(itemType);
            if (consumed) {
                this.updateUI();
            } else {
                alert('Kan ikke bruke dette elementet!');
            }
        }
    
    togglePauseMenu() {
        this.isPaused = !this.isPaused;
        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu) {
            if (this.isPaused) {
                pauseMenu.style.display = 'flex';
                pauseMenu.innerHTML = `
                    <div class="pause-content" style="max-width: 85vw; overflow-x: hidden; text-align: center;">
                        <h2 style="font-size: 1.3em; margin-bottom: 20px;">🎮 FIXED v5.0 - Ingen loops!</h2>
                        <button class="menu-button" style="margin-bottom: 8px; font-size: 0.9em;" onclick="window.game.togglePauseMenu(); event.stopPropagation();" ontouchstart="window.game.togglePauseMenu(); event.stopPropagation(); event.preventDefault();">Fortsett Spill</button>
                        <button class="menu-button" style="margin-bottom: 8px; font-size: 0.9em;" onclick="window.game.showInstructions(); event.stopPropagation();" ontouchstart="window.game.showInstructions(); event.stopPropagation(); event.preventDefault();">📖 Hvordan Spille</button>
                        <button class="menu-button" style="margin-bottom: 8px; font-size: 0.9em;" onclick="window.game.showSettings(); event.stopPropagation();" ontouchstart="window.game.showSettings(); event.stopPropagation(); event.preventDefault();">⚙️ Innstillinger</button>
                        <button class="menu-button" style="margin-bottom: 8px; font-size: 0.9em;" onclick="window.game.showAchievements(); event.stopPropagation();" ontouchstart="window.game.showAchievements(); event.stopPropagation(); event.preventDefault();">🏆 Prestasjoner</button>
                    </div>
                `;
            } else {
                pauseMenu.style.display = 'none';
            }
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-family: Arial, sans-serif;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    toggleInventory() {
        const inventoryPanel = document.getElementById('inventoryPanel');
        if (inventoryPanel) {
            const isVisible = inventoryPanel.style.display === 'block';
            inventoryPanel.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                this.updateInventoryUI();
            }
        }
    }

    closeInventory() {
        const inventoryPanel = document.getElementById('inventoryPanel');
        if (inventoryPanel) {
            inventoryPanel.style.display = 'none';
        }
    }
    
    updateInventoryUI() {
        if (!this.player) return;
        
        const inventoryGrid = document.getElementById('inventoryGrid');
        if (!inventoryGrid) return;
        
        inventoryGrid.innerHTML = '';
        const items = this.player.inventory.getAllItems();
        
        for (const [itemType, amount] of Object.entries(items)) {
            if (amount > 0) {
                const slot = document.createElement('div');
                slot.className = 'inventory-slot';
                slot.setAttribute('data-item', itemType);
                
                let icon = '';
                if (itemType === 'wood') icon = '🌲';
                else if (itemType === 'stone') icon = '🪨';
                else if (itemType === 'berries') icon = '🫐';
                else if (itemType === 'water') icon = '💧';
                else if (itemType === 'mushrooms') icon = '🍄';
                
                slot.innerHTML = `
                    <div style="font-size: 24px;">${icon}</div>
                    <div style="font-size: 12px;">${amount}</div>
                `;
                
                // Legg til click og touch events for både PC og mobil
                slot.addEventListener('click', () => {
                    this.useInventoryItem(itemType);
                });
                
                slot.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.useInventoryItem(itemType);
                });
                
                inventoryGrid.appendChild(slot);
            }
        }
    }
    
    collectNearbyResources() {
        if (!this.player || !this.world) return;
        
        const nearbyResources = this.world.getResourcesNear(
            this.player.x,
            this.player.y,
            GAME_CONFIG.INTERACTION_DISTANCE
        );
        
        if (nearbyResources.length > 0) {
            const resource = nearbyResources[0];
            this.harvestResource(resource);
        } else {
            this.showNotification('Ingen ressurser i nærheten!');
        }
    }
}

// Global functions for menu buttons
// Multiplayer stub

window.collectResources = function() {
    if (window.game && window.game.collectNearbyResources) {
        window.game.collectNearbyResources();
    }
};

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Joystick initialization (must be after DOM is ready)
    let isDragging = false;
    let maxDistance = 40;
    let joystick = document.getElementById('virtualJoystick');
    let knob = joystick ? joystick.querySelector('#joystickKnob') : null;

    function getCenter() {
        if (!joystick) return { x: 0, y: 0 };
        const rect = joystick.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function handleStart(e) {
        isDragging = true;
        e.preventDefault();
    }

    function handleMove(e) {
        if (!isDragging || !window.game || !window.game.player) return;
        e.preventDefault();

        const touch = e.touches ? e.touches[0] : e;
        const center = getCenter();
        const x = touch.clientX - center.x;
        const y = touch.clientY - center.y;
        
        const distance = Math.sqrt(x * x + y * y);
        const angle = Math.atan2(y, x);
        
        const constrainedDistance = Math.min(distance, maxDistance);
        const constrainedX = Math.cos(angle) * constrainedDistance;
        const constrainedY = Math.sin(angle) * constrainedDistance;
        
        if (knob) {
            knob.style.transform = `translate(${constrainedX - 50}%, ${constrainedY - 50}%)`;
        }
        
        // Normaliser til -1 til 1
        const normalizedX = constrainedX / maxDistance;
        const normalizedY = constrainedY / maxDistance;
        
        if (window.game.player && window.game.player.setMovement) {
            window.game.player.setMovement(normalizedX, normalizedY);
        }
    }

    function resetKnob() {
        if (knob) {
            knob.style.transform = 'translate(-50%, -50%)';
        }
        if (window.game && window.game.player && window.game.player.setMovement) {
            window.game.player.setMovement(0, 0);
        }
    }

    const handleEnd = (e) => {
        e.preventDefault();
        isDragging = false;
        resetKnob();
    };

    if (joystick) {
        joystick.addEventListener('touchstart', handleStart);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);

        joystick.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
    }

    // Sikre at window.game er et objekt før bruk
    window.game = window.game || {};

    // Helper: robust event-handling for alle .menu-button
    function robustMenuButtonEvents() {
        const buttons = document.querySelectorAll('.menu-button');
        buttons.forEach(btn => {
            btn.onclick = null;
            btn.ontouchend = null;
            // Add both click and touchend listeners
            btn.addEventListener('click', (e) => {
                if (btn.hasAttribute('onclick')) {
                    // Always ensure menu functions exist before calling
                    setMenuFunctions();
                    eval(btn.getAttribute('onclick'));
                }
            });
            btn.addEventListener('touchend', (e) => {
                if (btn.hasAttribute('ontouchend')) {
                    // Always ensure menu functions exist before calling  
                    setMenuFunctions();
                    eval(btn.getAttribute('ontouchend'));
                }
            });
        });
    }

    // Default-verdier for innstillinger
    window.game.soundOn = true;
    window.game.musicOn = true;
    window.game.mobileControls = true;

    // Sikre at menyfunksjoner alltid er tilgjengelige
    function setMenuFunctions() {
        window.game.startNewGame = function() {
            document.getElementById('gameMenu').classList.add('hidden');
            document.getElementById('gameUI').style.display = 'block';
            const gameInstance = new Game();
            Object.assign(window.game, gameInstance);
            if (window.MultiplayerClient) {
                window.game.multiplayer = new window.MultiplayerClient(window.game);
            }
            // Ikke kall setMenuFunctions her!
            // Skjul loading screen helt og sikre at det fungerer på mobil
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                loadingScreen.style.display = 'none';
                loadingScreen.style.pointerEvents = 'none';
                console.log('✅ Loading screen skjult på mobil');
            }
            if (window.innerWidth <= 768) {
                const mobileControls = document.getElementById('mobileControls');
                if (mobileControls) mobileControls.style.display = 'flex';
            }
            if (window.game.showNotification) window.game.showNotification('Nytt spill startet!');
        };
        window.game.showMainMenu = function() {
            document.getElementById('gameMenu').innerHTML = `
                <h1>🏕️ Beyond 99 Days</h1>
                <button class="menu-button" onclick="window.game.startNewGame()" ontouchend="window.game.startNewGame()">🎮 Start Nytt Spill</button>
                <button class="menu-button" onclick="window.game.loadGame()" ontouchend="window.game.loadGame()">💾 Last Inn Spill</button>
                <button class="menu-button" onclick="window.game.showInstructions()" ontouchend="window.game.showInstructions()">📖 Hvordan Spille</button>
                <button class="menu-button" onclick="window.game.showSettings()" ontouchend="window.game.showSettings()">⚙️ Innstillinger</button>
                <button class="menu-button" onclick="window.game.showAchievements()" ontouchend="window.game.showAchievements()">🏆 Prestasjoner</button>
            `;
            if (window.innerWidth <= 768) {
                const permanentTimeDisplay = document.getElementById('permanentTimeDisplay');
                if (permanentTimeDisplay) permanentTimeDisplay.style.display = 'block';
            }
            robustMenuButtonEvents();
        };
        window.game.loadGame = function() {
            // Demo: vis tidligere lagrede spill/kart med visualisering
            document.getElementById('gameMenu').innerHTML = `
                <h1>Last inn spill</h1>
                <div style="margin-bottom:20px;">Velg et tidligere lagret spill/kart:</div>
                <div style="display:flex;gap:10px;justify-content:center;">
                    <div style="background:#16213e;border-radius:10px;padding:10px 20px;box-shadow:0 2px 8px #000;">
                        <div style="font-size:32px;">🌲🏕️🌊</div>
                        <div style="font-size:14px;">Skog & Innsjø</div>
                        <button class="menu-button" onclick="window.game.loadSavedGame('skog_innsjo')" ontouchend="window.game.loadSavedGame('skog_innsjo')">Last inn</button>
                    </div>
                    <div style="background:#0f3460;border-radius:10px;padding:10px 20px;box-shadow:0 2px 8px #000;">
                        <div style="font-size:32px;">🏜️⛰️🌵</div>
                        <div style="font-size:14px;">Ørken & Fjell</div>
                        <button class="menu-button" onclick="window.game.loadSavedGame('orken_fjell')" ontouchend="window.game.loadSavedGame('orken_fjell')">Last inn</button>
                    </div>
                </div>
                <button class="menu-button" onclick="window.game.showMainMenu()" ontouchend="window.game.showMainMenu()">Tilbake</button>
            `;
            robustMenuButtonEvents();
        };
        window.game.loadSavedGame = function(name) {
            // Demo: bare start nytt spill med melding
            alert('Lastet inn: ' + name);
            window.game.startNewGame();
        };
        window.game.showInstructions = function() {
            const pauseMenu = document.getElementById('pauseMenu');
            if (pauseMenu) {
                pauseMenu.innerHTML = `
                    <div class="pause-content" style="max-width: 85vw; max-height: 80vh; overflow: auto; padding: 15px; word-wrap: break-word;">
                        <h2 style="font-size: 1.1em; margin-bottom: 10px; text-align: center;">📖 v4 Kompakt Guide</h2>
                        <div style="font-size: 0.8em; line-height: 1.3; text-align: left;">
                            <p style="margin: 0 0 8px 0; color: #4CAF50;">🎮 FIXED v5.0 - Stopper loading loop!</p>
                            
                            <div style="margin-bottom: 10px;">
                                <strong style="font-size: 0.85em;">Kontroller:</strong><br>
                                • WASD: Beveg deg<br>
                                • Touch: Klikk på ting<br>
                                • I: Inventar<br>
                                • Esc: Pause
                            </div>
                            
                            <p style="margin: 0; font-size: 0.75em;">Hold øye med sult 🍖, tørst 💧, energi ⚡. Samle ressurser!</p>
                        </div>
                        <button class="menu-button" style="margin-top: 15px; font-size: 0.85em;" onclick="window.game.togglePauseMenu(); event.stopPropagation();" ontouchstart="window.game.togglePauseMenu(); event.stopPropagation(); event.preventDefault();">Tilbake</button>
                    </div>
                `;
            }
        };
        window.game.showSettings = function() {
            const pauseMenu = document.getElementById('pauseMenu');
            if (pauseMenu) {
                pauseMenu.innerHTML = `
                    <div class="pause-content" style="max-width: 90vw; overflow-x: hidden;">
                        <h2 style="font-size: 1.2em; margin-bottom: 15px;">Innstillinger</h2>
                        <div style="margin-bottom:20px; font-size: 0.9em;">
                            <label style="display:block;margin-bottom:12px; line-height: 1.4;">
                                <input type="checkbox" id="soundToggle" ${window.game.soundOn ? 'checked' : ''}> 🔊 Lydeffekter
                            </label>
                            <label style="display:block;margin-bottom:12px; line-height: 1.4;">
                                <input type="checkbox" id="musicToggle" ${window.game.musicOn ? 'checked' : ''}> 🎵 Bakgrunnsmusikk
                            </label>
                            <label style="display:block;margin-bottom:12px; line-height: 1.4;">
                                <input type="checkbox" id="mobileControlsToggle" ${window.game.mobileControls ? 'checked' : ''}> 📱 Mobile kontroller
                            </label>
                        </div>
                        <button class="menu-button" onclick="window.game.togglePauseMenu(); event.stopPropagation();" ontouchstart="window.game.togglePauseMenu(); event.stopPropagation(); event.preventDefault();">Tilbake</button>
                    </div>
                `;
            }
        };
        
        window.game.showAchievements = function() {
            const pauseMenu = document.getElementById('pauseMenu');
            if (pauseMenu) {
                pauseMenu.innerHTML = `
                    <div class="pause-content" style="max-width: 90vw; overflow-x: hidden;">
                        <h2 style="font-size: 1.2em; margin-bottom: 15px;">Prestasjoner</h2>
                        <div style="margin-bottom:20px; font-size: 0.9em; line-height: 1.4;">
                            <p style="margin-bottom: 10px;">Dine oppnådde prestasjoner:</p>
                            <ul id="achievementList" style="text-align:left; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 5px;">🏕️ Overlevde første natt</li>
                                <li style="margin-bottom: 5px;">🔥 Bygde første leirbål</li>
                                <li style="margin-bottom: 5px;">🏠 Lagde ditt første hus</li>
                                <li style="margin-bottom: 5px;">🦌 Fanget ditt første dyr</li>
                            </ul>
                        </div>
                        <button class="menu-button" onclick="window.game.togglePauseMenu(); event.stopPropagation();" ontouchstart="window.game.togglePauseMenu(); event.stopPropagation(); event.preventDefault();">Tilbake</button>
                    </div>
                `;
            }
        };
        window.game.toggleInventory = function() {
            const inventoryPanel = document.getElementById('inventoryPanel');
            if (inventoryPanel) {
                const isVisible = inventoryPanel.style.display === 'block';
                inventoryPanel.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    window.game.updateInventoryUI();
                }
            }
        };
        window.game.closeInventory = function() {
            const inventoryPanel = document.getElementById('inventoryPanel');
            if (inventoryPanel) {
                inventoryPanel.style.display = 'none';
            }
        };
        window.game.updateInventoryUI = function() {
            if (!window.game.player) return;
            const inventoryGrid = document.getElementById('inventoryGrid');
            if (!inventoryGrid) return;
            inventoryGrid.innerHTML = '';
            const items = window.game.player.inventory.getAllItems();
            for (const [itemType, amount] of Object.entries(items)) {
                if (amount > 0) {
                    const slot = document.createElement('div');
                    slot.className = 'inventory-slot';
                    slot.setAttribute('data-item', itemType);
                    let icon = '';
                    if (itemType === 'wood') icon = '🌲';
                    else if (itemType === 'stone') icon = '🪨';
                    else if (itemType === 'berries') icon = '🫐';
                    else if (itemType === 'water') icon = '💧';
                    else if (itemType === 'mushrooms') icon = '🍄';
                    slot.innerHTML = `
                        <div style="font-size: 24px;">${icon}</div>
                        <div style="font-size: 12px;">${amount}</div>
                    `;
                    slot.addEventListener('click', () => {
                        window.game.useInventoryItem(itemType);
                    });
                    slot.addEventListener('touchend', (e) => {
                        e.preventDefault();
                        window.game.useInventoryItem(itemType);
                    });
                    inventoryGrid.appendChild(slot);
                }
            }
        };
        window.game.useInventoryItem = function(itemType) {
            if (!window.game.player) return;
            const consumed = window.game.player.consume(itemType);
            if (consumed) {
                window.game.updateInventoryUI();
            } else {
                alert('Kan ikke bruke dette elementet!');
            }
        };
        window.game.toggleCrafting = function() {
            // TODO: Implementer crafting-panel vis/skjul
            alert('Crafting kommer snart!');
        };
    }

    // Multiplayer-knapp
    window.game.startMultiplayer = function() {
        if (window.game.multiplayer) {
            window.game.multiplayer.showMultiplayerMenu();
        } else {
            alert('Multiplayer-modul ikke lastet!');
        }
    };

    // Kjør på nytt ved menyvisning
    window.showMainMenu = function() {
        robustMenuButtonEvents();
        window.game.showMainMenu();
    };

    console.log('Starting Beyond 99 Days enhanced game...');
    try {
        window.game = new Game();
        if (window.MultiplayerClient) {
            window.game.multiplayer = new window.MultiplayerClient(window.game);
        }
        setMenuFunctions();
        console.log('Game initialized successfully');
        // Skjul loading screen helt og sikre at det fungerer på mobil
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            loadingScreen.style.display = 'none';
            loadingScreen.style.pointerEvents = 'none';
            console.log('✅ Loading screen skjult ved game init');
        }
        
        // Backup: Skjul loading screen etter 2 sekunder hvis den fortsatt vises
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                loadingScreen.style.display = 'none';
                loadingScreen.style.pointerEvents = 'none';
                console.log('🔧 Backup: Loading screen skjult etter timeout');
            }
        }, 2000);
        const permanentTimeDisplay = document.getElementById('permanentTimeDisplay');
        if (permanentTimeDisplay && window.innerWidth <= 768) {
            permanentTimeDisplay.style.display = 'block';
        }
        robustMenuButtonEvents();
        // Fjernet duplisert definisjon av window.game.startNewGame. Nå defineres den kun i setMenuFunctions()
    } catch (error) {
        console.error('Error initializing game:', error);
    }
});