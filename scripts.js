let seatsData = [];
let studyRecords = [];
let activeTimers = new Map();
let favoriteImages = [];
let currentUser = {
    name: null,
    isLoggedIn: false
};

const loginRegisterBtn = document.getElementById("loginRegisterBtn");

function showLoginModal() {
    showModal("Enter your name to login/register:", true, (userName) => {
        if (!userName || userName.trim() === "") {
            showModal("Please enter your name to continue.", false);
            return;
        }
        
        currentUser.name = userName.trim();
        currentUser.isLoggedIn = true;
        
        localStorage.setItem("library_current_user", JSON.stringify(currentUser));
        
        if (window.dailyGoalVM) {
            window.dailyGoalVM.loadFromLocalStorage();
        }
        
        updateLoginButton();
        updateUserDashboard();
        
        showModal(`Welcome back, ${currentUser.name}! You are now logged in.`, false);
        updateAchievements();
    });
}

function updateUserDashboard() {
    renderDashboard();
}

function updateLoginButton() {
    const userNameSpan = document.getElementById("userNameDisplay");
    const heroLoginBtn = document.getElementById("heroLoginBtn");
    const heroWelcomeMsg = document.getElementById("heroWelcomeMsg");
    
    if (currentUser.isLoggedIn && currentUser.name) {
        if (userNameSpan) {
            userNameSpan.textContent = `${currentUser.name}`;
            userNameSpan.style.display = "inline-block";
            userNameSpan.style.cursor = "pointer";
            userNameSpan.title = "Click to log out";
        }
        if (heroLoginBtn) {
            heroLoginBtn.style.display = "none";
        }
        if (heroWelcomeMsg) {
            heroWelcomeMsg.style.display = "block";
            heroWelcomeMsg.innerHTML = `🎉 Welcome ${escapeHtml(currentUser.name)} to the library！`;
            heroWelcomeMsg.style.cursor = "pointer";
            heroWelcomeMsg.title = "Click to log out";
            heroWelcomeMsg.onclick = () => {
                showModal(`Are you sure you want to log out, ${currentUser.name}?`, false, (confirm) => {
                    if (confirm !== null) {
                        logout();
                    }
                });
            };
        }
    } else {
        if (userNameSpan) {
            userNameSpan.textContent = "";
            userNameSpan.style.display = "none";
            userNameSpan.onclick = null;
        }
        if (heroLoginBtn) {
            heroLoginBtn.style.display = "inline-block";
        }
        if (heroWelcomeMsg) {
            heroWelcomeMsg.style.display = "none";
            heroWelcomeMsg.innerHTML = "";
            heroWelcomeMsg.onclick = null;
            heroWelcomeMsg.style.cursor = "default";
            heroWelcomeMsg.title = "";
        }
    }
}

function loadCurrentUser() {
    const stored = localStorage.getItem("library_current_user");
    if (stored) {
        try {
            const user = JSON.parse(stored);
            if (user && user.name) {
                currentUser = user;
                updateLoginButton();
                setTimeout(function() {
                    if (window.dailyGoalVM) {
                        window.dailyGoalVM.loadFromLocalStorage();
                    }
                    if (document.getElementById("myStatsPanel")) {
                        updateUserDashboard();
                    }
                }, 100);
            }
        } catch(e) {}
    } else {
        if (window.dailyGoalVM) {
            window.dailyGoalVM.resetAllData();
        }
    }
}

const heroLoginBtn = document.getElementById("heroLoginBtn");
if (heroLoginBtn) {
    heroLoginBtn.addEventListener("click", () => {
        if (currentUser.isLoggedIn && currentUser.name) {
            showModal(`Are you sure you want to log out, ${currentUser.name}?`, false, (confirm) => {
                if (confirm !== null) {
                    logout();
                }
            });
        } else {
            showLoginModal();
        }
    });
}

function logout() {
    currentUser = {
        name: null,
        isLoggedIn: false
    };
    
    localStorage.removeItem("library_current_user");
    
    if (window.dailyGoalVM) {
        window.dailyGoalVM.resetAllData();
        window.dailyGoalVM.currentUserName = null;
    }
    
    updateLoginButton();
    renderDashboard();
    
    const rankResultDiv = document.getElementById("rankResult");
    if (rankResultDiv) {
        rankResultDiv.innerHTML = "";
        rankResultDiv.className = "rank-search-result";
    }
    
    const myStatsResult = document.getElementById("myStatsResult");
    if (myStatsResult) {
        myStatsResult.innerHTML = "";
    }
    
    showModal("You have been logged out successfully.", false);
    renderAchievements();
}

const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtnCarousel = document.getElementById('prevBtn');
const nextBtnCarousel = document.getElementById('nextBtn');
const carouselContainer = document.getElementById('carouselContainer');

let currentSlide = 0;
const slideCount = slides.length;
let autoSlideInterval;

function goToSlide(index) {
    currentSlide = index;
    const offset = -currentSlide * 100;
    track.style.transform = `translateX(${offset}%)`;
    resetAutoSlide();
}

function nextSlide() {
    if (currentSlide === slideCount - 1) {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0%)';
        void track.offsetHeight;
        track.style.transition = 'transform 0.5s ease-in-out';
        currentSlide = 0;
    } else {
        currentSlide = (currentSlide + 1) % slideCount;
        const offset = -currentSlide * 100;
        track.style.transform = `translateX(${offset}%)`;
    }
    resetAutoSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    goToSlide(currentSlide);
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slideCount;
        const offset = -currentSlide * 100;
        track.style.transition = 'none';
        track.style.transform = `translateX(${offset}%)`;
        void track.offsetHeight;
        track.style.transition = '';
    }, 4000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

prevBtnCarousel.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
nextBtnCarousel.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
carouselContainer.addEventListener('mouseenter', stopAutoSlide);
carouselContainer.addEventListener('mouseleave', startAutoSlide);

goToSlide(0);
startAutoSlide();

const bookingForm = document.getElementById('bookingForm');
const fullName = document.getElementById('fullName');
const emailAddress = document.getElementById('emailAddress');
const phoneNumber = document.getElementById('phoneNumber');
const visitDate = document.getElementById('visitDate');
const guestCount = document.getElementById('guestCount');
const membershipType = document.getElementById('membershipType');
const formSuccessMsg = document.getElementById('formSuccessMsg');

function showError(input, errorElement, message) {
    input.classList.add('error-input');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function hideError(input, errorElement) {
    input.classList.remove('error-input');
    errorElement.classList.remove('show');
}

const formInputs = document.querySelectorAll('#bookingForm input, #bookingForm select, #bookingForm textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.style.borderColor = '#2c9c6e';
        input.style.boxShadow = '0 0 0 3px rgba(44,156,110,0.2)';
    });
    input.addEventListener('blur', () => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    });
});

fullName.addEventListener('blur', () => {
    if (!fullName.value.trim()) {
        showError(fullName, document.getElementById('nameErrorMsg'), 'Please enter your full name');
    } else {
        hideError(fullName, document.getElementById('nameErrorMsg'));
    }
});

emailAddress.addEventListener('blur', () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailAddress.value.trim() || !emailRegex.test(emailAddress.value)) {
        showError(emailAddress, document.getElementById('emailErrorMsg'), 'Please enter a valid email address');
    } else {
        hideError(emailAddress, document.getElementById('emailErrorMsg'));
    }
});

phoneNumber.addEventListener('blur', () => {
    const phoneRegex = /^\d{11}$/;
    if (!phoneNumber.value.trim() || !phoneRegex.test(phoneNumber.value.replace(/\D/g, ''))) {
        showError(phoneNumber, document.getElementById('phoneErrorMsg'), 'Please enter a valid 11-digit phone number');
    } else {
        hideError(phoneNumber, document.getElementById('phoneErrorMsg'));
    }
});

visitDate.addEventListener('blur', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(visitDate.value);
    if (!visitDate.value || selectedDate < today) {
        showError(visitDate, document.getElementById('dateErrorMsg'), 'Please select a future visit date');
    } else {
        hideError(visitDate, document.getElementById('dateErrorMsg'));
    }
});

guestCount.addEventListener('blur', () => {
    if (!guestCount.value) {
        showError(guestCount, document.getElementById('guestErrorMsg'), 'Please select number of guests');
    } else {
        hideError(guestCount, document.getElementById('guestErrorMsg'));
    }
});

membershipType.addEventListener('blur', () => {
    if (!membershipType.value) {
        showError(membershipType, document.getElementById('membershipErrorMsg'), 'Please select a membership type');
    } else {
        hideError(membershipType, document.getElementById('membershipErrorMsg'));
    }
});

function validateForm() {
    let isValid = true;
    
    const selectedDate = new Date(visitDate.value);
    const currentHour = new Date().getHours();
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    
    if (isToday) {
        if (currentHour < 8 || currentHour >= 22) {
            showModal("Library is closed at this time. Our opening hours are 8:00 - 22:00. Please make a reservation during opening hours.", false);
            return false;
        }
    }

    if (!fullName.value.trim()) {
        showError(fullName, document.getElementById('nameErrorMsg'), 'Please enter your full name');
        isValid = false;
    } else {
        hideError(fullName, document.getElementById('nameErrorMsg'));
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailAddress.value.trim() || !emailRegex.test(emailAddress.value)) {
        showError(emailAddress, document.getElementById('emailErrorMsg'), 'Please enter a valid email address');
        isValid = false;
    } else {
        hideError(emailAddress, document.getElementById('emailErrorMsg'));
    }
    
    const phoneRegex = /^\d{11}$/;
    if (!phoneNumber.value.trim() || !phoneRegex.test(phoneNumber.value.replace(/\D/g, ''))) {
        showError(phoneNumber, document.getElementById('phoneErrorMsg'), 'Please enter a valid 11-digit phone number');
        isValid = false;
    } else {
        hideError(phoneNumber, document.getElementById('phoneErrorMsg'));
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!visitDate.value || selectedDate < today) {
        showError(visitDate, document.getElementById('dateErrorMsg'), 'Please select a future visit date');
        isValid = false;
    } else {
        hideError(visitDate, document.getElementById('dateErrorMsg'));
    }
    
    if (!guestCount.value) {
        showError(guestCount, document.getElementById('guestErrorMsg'), 'Please select number of guests');
        isValid = false;
    } else {
        hideError(guestCount, document.getElementById('guestErrorMsg'));
    }
    
    if (!membershipType.value) {
        showError(membershipType, document.getElementById('membershipErrorMsg'), 'Please select a membership type');
        isValid = false;
    } else {
        hideError(membershipType, document.getElementById('membershipErrorMsg'));
    }
    
    return isValid;
}

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const selectedDate = new Date(visitDate.value);
    const currentHour = new Date().getHours();
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    
    if (isToday && (currentHour < 8 || currentHour >= 22)) {
        showModal("Library is closed at this time. Our opening hours are 8:00 - 22:00. Please make a reservation during opening hours.", false);
        return;
    }
    
    if (validateForm()) {
        formSuccessMsg.classList.add('show');
        bookingForm.reset();
        setTimeout(() => {
            formSuccessMsg.classList.remove('show');
        }, 5000);
        document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));
    }
});

function showModal(message, showInput = false, callback = null) {
    const modal = document.getElementById("customModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalInput = document.getElementById("modalInput");
    const confirmBtn = document.getElementById("modalConfirmBtn");
    const cancelBtn = document.getElementById("modalCancelBtn");
    modalMessage.innerText = message;
    modalInput.style.display = showInput ? "block" : "none";
    cancelBtn.style.display = showInput ? "inline-block" : "none";
    if (showInput) modalInput.value = "";
    modal.style.display = "flex";
    const onConfirm = () => {
        const inputValue = modalInput.value;
        modal.style.display = "none";
        confirmBtn.removeEventListener("click", onConfirm);
        cancelBtn.removeEventListener("click", onCancel);
        if (callback) callback(inputValue);
    };
    const onCancel = () => {
        modal.style.display = "none";
        confirmBtn.removeEventListener("click", onConfirm);
        cancelBtn.removeEventListener("click", onCancel);
        if (callback) callback(null);
    };
    confirmBtn.addEventListener("click", onConfirm);
    if (showInput) cancelBtn.addEventListener("click", onCancel);
    else {
        cancelBtn.style.display = "none";
        confirmBtn.removeEventListener("click", onConfirm);
        confirmBtn.addEventListener("click", onConfirm);
        const bgClick = (e) => { if (e.target === modal) { modal.style.display = "none"; document.removeEventListener("click", bgClick); if (callback) callback(null); } };
        document.addEventListener("click", bgClick);
    }
}

function loadFavoritesFromStorage() {
    const stored = localStorage.getItem("course_favorite_images");
    favoriteImages = stored ? JSON.parse(stored) : [];
    updateFavoriteUI();
}

function saveFavoritesToStorage() {
    localStorage.setItem("course_favorite_images", JSON.stringify(favoriteImages));
    updateFavoriteUI();
}

function updateFavoriteUI() {
    const countSpan = document.getElementById("favoriteCount");
    const floatContainer = document.getElementById("favoriteFloatContainer");
    if (countSpan) countSpan.textContent = favoriteImages.length;
    if (floatContainer) {
        floatContainer.style.display = favoriteImages.length > 0 ? "block" : "none";
    }
    renderFavoriteList();
}

function renderFavoriteList() {
    const container = document.getElementById("favoriteImagesList");
    if (!container) return;
    if (favoriteImages.length === 0) {
        container.innerHTML = '<div class="empty-favorites">No favorite items yet. Click on course images and select Favorite to add.</div>';
        return;
    }
    let html = "";
    favoriteImages.forEach((item, idx) => {
        html += `
            <div class="fav-item">
                <div class="fav-caption">${escapeHtml(item.caption)}</div>
                <button class="remove-fav-btn" data-index="${idx}">Remove</button>
            </div>
        `;
    });
    container.innerHTML = html;
    document.querySelectorAll(".remove-fav-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = parseInt(btn.getAttribute("data-index"));
            favoriteImages.splice(idx, 1);
            saveFavoritesToStorage();
        });
    });
}

function addToFavorites(imgSrc, caption) {
    const exists = favoriteImages.some(item => item.src === imgSrc);
    if (!exists) {
        favoriteImages.push({ src: imgSrc, caption: caption });
        saveFavoritesToStorage();
        return true;
    }
    return false;
}

const favoriteFloatBtn = document.getElementById("favoriteFloatBtn");
const favoriteModal = document.getElementById("favoriteModal");
const closeFavModalBtn = document.getElementById("closeFavModalBtn");
const closeFavBtn2 = document.getElementById("closeFavBtn2");

favoriteFloatBtn.addEventListener("click", () => {
    favoriteModal.classList.remove("hidden");
    renderFavoriteList();
});
function closeFavoriteModal() { favoriteModal.classList.add("hidden"); }
closeFavModalBtn.addEventListener("click", closeFavoriteModal);
closeFavBtn2.addEventListener("click", closeFavoriteModal);
favoriteModal.addEventListener("click", (e) => { if (e.target === favoriteModal) closeFavoriteModal(); });

const regions = [
    { id: "A", name: "Library A. Quiet Study Area", seatCount: 16 },
    { id: "B", name: "Library B. Discussion Room (For Quiet Discussions)", seatCount: 12 },
    { id: "C", name: "Library C. Reading Room", seatCount: 20 }
];

function initSeats() {
    const newSeats = [];
    for (const region of regions) {
        for (let i = 1; i <= region.seatCount; i++) {
            newSeats.push({ regionId: region.id, seatId: i, label: `${region.id}${i.toString().padStart(2, '0')}`, status: "available", currentUser: "", checkinTime: null });
        }
    }
    return newSeats;
}

function saveSeats() { localStorage.setItem("library_seats", JSON.stringify(seatsData)); }
function saveRecords() { localStorage.setItem("library_records", JSON.stringify(studyRecords)); }

function loadData() {
    const storedSeats = localStorage.getItem("library_seats");
    const storedRecords = localStorage.getItem("library_records");
    if (storedSeats) {
        seatsData = JSON.parse(storedSeats);
        activeTimers.clear();
        seatsData.forEach(seat => { if (seat.status === "in-use" && seat.checkinTime) startTimerForSeat(seat); });
    } else { seatsData = initSeats(); saveSeats(); }
    studyRecords = storedRecords ? JSON.parse(storedRecords) : [];
    saveRecords();
}

function findSeat(regionId, seatId) {
    const idx = seatsData.findIndex(s => s.regionId === regionId && s.seatId === seatId);
    return { idx, seat: seatsData[idx] };
}

function getUserDuration(userName, period = "week") {
    const now = new Date();
    let filtered = studyRecords.filter(rec => rec.userName === userName);
    if (period === "week") {
        const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0,0,0,0);
        filtered = filtered.filter(rec => new Date(rec.startTime) >= startOfWeek);
    } else if (period === "month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(rec => new Date(rec.startTime) >= startOfMonth);
    }
    return filtered.reduce((sum, rec) => sum + rec.durationMin, 0);
}

function getRanking(period = "week") {
    const userMap = new Map();
    const now = new Date();
    studyRecords.forEach(rec => {
        let keep = false;
        const recDate = new Date(rec.startTime);
        if (period === "week") {
            const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0,0,0,0);
            if (recDate >= startOfWeek) keep = true;
        } else {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            if (recDate >= startOfMonth) keep = true;
        }
        if (keep) userMap.set(rec.userName, (userMap.get(rec.userName) || 0) + rec.durationMin);
    });
    return Array.from(userMap.entries()).sort((a,b) => b[1] - a[1]).slice(0, 3);
}

function updateTotalAvailable() {
    document.getElementById("totalAvailable").innerText = seatsData.filter(s => s.status === "available").length;
}

function renderSeats() {
    const container = document.getElementById("regionsContainer");
    if (!container) return;
    const regionMap = new Map();
    seatsData.forEach(seat => {
        if (!regionMap.has(seat.regionId)) regionMap.set(seat.regionId, []);
        regionMap.get(seat.regionId).push(seat);
    });
    let html = "";
    for (const region of regions) {
        const regionSeats = regionMap.get(region.id) || [];
        const remaining = regionSeats.filter(s => s.status === "available").length;
        const total = regionSeats.length;
        let seatsHtml = "";
        regionSeats.forEach(seat => {
            let actionBtns = "", timerHtml = "";
            const isCurrentUserSeat = (currentUser.isLoggedIn && seat.currentUser === currentUser.name);
            
            if (seat.status === "available") {
                actionBtns = `<button class="btn-small btn-available book-action" data-region="${seat.regionId}" data-seatid="${seat.seatId}">Book</button>`;
            } 
            else if (seat.status === "booked") {
                if (isCurrentUserSeat) {
                    actionBtns = `<button class="btn-small btn-checkin checkin-action" data-region="${seat.regionId}" data-seatid="${seat.seatId}">Check-in</button>
                                <button class="btn-small btn-cancel cancel-action" data-region="${seat.regionId}" data-seatid="${seat.seatId}">Cancel</button>`;
                } else {
                    actionBtns = `<span class="btn-disabled">Booked by ${seat.currentUser}</span>`;
                }
            } 
            else if (seat.status === "in-use") {
                if (isCurrentUserSeat) {
                    actionBtns = `<button class="btn-small btn-checkout checkout-action" data-region="${seat.regionId}" data-seatid="${seat.seatId}">Check-out</button>`;
                    if (seat.checkinTime) {
                        const elapsed = Math.floor((Date.now() - seat.checkinTime) / 60000);
                        timerHtml = `<div class="timer-display" id="timer-${seat.regionId}-${seat.seatId}">⏱️ ${elapsed} min</div>`;
                    }
                } else {
                    actionBtns = `<span class="btn-disabled">In use by ${seat.currentUser}</span>`;
                }
            }
            
            seatsHtml += `<div class="seat ${seat.status}" data-region="${seat.regionId}" data-seatid="${seat.seatId}">
                <div class="seat-label">${seat.label}</div>
                <div class="seat-actions">${actionBtns}</div>${timerHtml}</div>`;
        });
        html += `<div class="region-card"><div class="region-header"><h2>${region.name}</h2><div class="remain-badge">Free ${remaining}/${total}</div></div><div class="seats-grid">${seatsHtml}</div></div>`;
    }
    container.innerHTML = html;
    attachSeatButtons();
}

function attachSeatButtons() {
    document.querySelectorAll(".book-action").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            handleBook(btn.getAttribute("data-region"), parseInt(btn.getAttribute("data-seatid")));
        });
    });
    document.querySelectorAll(".checkin-action").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            handleCheckin(btn.getAttribute("data-region"), parseInt(btn.getAttribute("data-seatid")));
        });
    });
    document.querySelectorAll(".checkout-action").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            handleCheckout(btn.getAttribute("data-region"), parseInt(btn.getAttribute("data-seatid")));
        });
    });
    document.querySelectorAll(".cancel-action").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            handleCancelBooking(btn.getAttribute("data-region"), parseInt(btn.getAttribute("data-seatid")));
        });
    });
}

function handleBook(regionId, seatId) {
    const { seat } = findSeat(regionId, seatId);
    if (!seat || seat.status !== "available") { 
        showModal("This seat is not available for booking", false); 
        return; 
    }
    
    if (!currentUser.isLoggedIn || !currentUser.name) {
        showModal("Please login/register first:", true, (userName) => {
            if (userName === null) { return; }
            if (!userName || userName.trim() === "") {
                showModal("Please enter your name. Name cannot be empty.", false);
                return;
            }
            
            currentUser.name = userName.trim();
            currentUser.isLoggedIn = true;
            localStorage.setItem("library_current_user", JSON.stringify(currentUser));
            updateLoginButton();
            
            bookSeat(seat);
        });
        return;
    }
    
    bookSeat(seat);
}

function bookSeat(seat) {
    const userName = currentUser.name;
    
    const existingBooking = seatsData.find(s => 
        s.currentUser === userName && (s.status === "booked" || s.status === "in-use")
    );
    
    if (existingBooking) {
        const statusText = existingBooking.status === "booked" ? "booked" : "active";
        showModal(`You already have a ${statusText} seat (${existingBooking.label}). You can only book one seat at a time.`, false);
        renderAll();
        return;
    }
    
    seat.status = "booked";
    seat.currentUser = userName;
    seat.checkinTime = null;
    saveSeats();
    renderAll();
    
    showModal(`Seat ${seat.label} booked successfully! Please click "Check-in" during opening hours (8:00-22:00) to start your study session.`, false);
}

function handleCheckin(regionId, seatId) {
    const currentHour = new Date().getHours();
    if (currentHour < 8 || currentHour >= 22) {
        showModal("Library is closed at this time. Check-in is only available from 8:00 to 22:00.", false);
        return;
    }
    
    const { seat } = findSeat(regionId, seatId);
    if (!seat || seat.status !== "booked") { 
        showModal("This seat is not in booked status", false); 
        return; 
    }
    
    if (seat.currentUser !== currentUser.name) {
        showModal("This seat is booked by another user.", false);
        return;
    }
    
    const existingActiveSeat = seatsData.find(s => 
        s.currentUser === seat.currentUser && s.status === "in-use" && s.seatId !== seat.seatId
    );
    
    if (existingActiveSeat) {
        showModal(`You already have an active seat (${existingActiveSeat.label}). Please check-out from that seat first.`, false);
        return;
    }
    
    seat.status = "in-use";
    seat.checkinTime = Date.now();
    saveSeats();
    startTimerForSeat(seat);
    renderAll();

    showModal(`Checked in successfully! Start your study session now.`, false);
}

function startTimerForSeat(seat) {
    const key = `${seat.regionId}-${seat.seatId}`;
    if (activeTimers.has(key)) clearInterval(activeTimers.get(key));
    const interval = setInterval(() => {
        const timerDiv = document.getElementById(`timer-${key}`);
        if (timerDiv && seat.status === "in-use" && seat.checkinTime) {
            const elapsed = Math.floor((Date.now() - seat.checkinTime) / 60000);
            timerDiv.innerText = `⏱️ ${elapsed} min`;
            
            if (window.dailyGoalVM && window.dailyGoalVM.isStudying && !window.dailyGoalVM.goalCompleted) {
                window.dailyGoalVM.updateProgress(elapsed);
            }
        } else if (seat.status !== "in-use") {
            clearInterval(interval);
            activeTimers.delete(key);
        }
    }, 60000);
    activeTimers.set(key, interval);
}

function handleCheckout(regionId, seatId) {
    const { seat } = findSeat(regionId, seatId);
    if (!seat || seat.status !== "in-use") { 
        showModal("No ongoing study session", false); 
        return; 
    }
    
    const durationMin = Math.floor((Date.now() - seat.checkinTime) / 60000);
    if (durationMin <= 0) { 
        showModal("Study duration too short, please try later", false); 
        return; 
    }
    
    const startDate = new Date(seat.checkinTime);
    studyRecords.push({
        userId: seat.currentUser, userName: seat.currentUser,
        startTime: seat.checkinTime, endTime: Date.now(),
        durationMin: durationMin, dateStr: startDate.toISOString().split('T')[0],
        hour: startDate.getHours()
    });
    saveRecords();
    
    seat.status = "available";
    seat.currentUser = "";
    seat.checkinTime = null;
    saveSeats();
    
    const key = `${seat.regionId}-${seat.seatId}`;
    if (activeTimers.has(key)) clearInterval(activeTimers.get(key));
    activeTimers.delete(key);
    renderAll();
    
    showModal(`Study session: ${durationMin} minutes recorded!`, false);
    updateAchievements();
}

function handleCancelBooking(regionId, seatId) {
    const { seat } = findSeat(regionId, seatId);
    if (!seat || seat.status !== "booked") { showModal("Cannot cancel this booking", false); return; }
    showModal(`Cancel booking for seat ${seat.label}?`, false, (confirm) => {
        if (confirm !== null) {
            seat.status = "available";
            seat.currentUser = "";
            seat.checkinTime = null;
            saveSeats();
            renderAll();
        }
    });
}

function renderDashboard() {
    const myStatsDiv = document.getElementById("myStatsResult");
    const rankResultDiv = document.getElementById("rankResult");
    
    if (currentUser.isLoggedIn && currentUser.name) {
        const userName = currentUser.name;
        
        const weekMin = getUserDuration(userName, "week");
        const monthMin = getUserDuration(userName, "month");
        const totalMin = studyRecords.filter(r => r.userName === userName).reduce((s,r) => s + r.durationMin, 0);
        
        myStatsDiv.innerHTML = `
            <div>👋 Welcome, ${escapeHtml(userName)}</div>
            <div style="margin-top: 10px;">📅 This Week: ${weekMin} min (${(weekMin/60).toFixed(1)}h)</div>
            <div>📆 This Month: ${monthMin} min (${(monthMin/60).toFixed(1)}h)</div>
            <div>🏆 Total: ${totalMin} min</div>
        `;
        
        const userRank = getUserRank(userName);
        if (userRank) {
            rankResultDiv.innerHTML = `
                <div class="rank-number">#${userRank.rank}</div>
                <div class="rank-user-name">${escapeHtml(userRank.name)}</div>
                <div class="rank-total-hours">Total: ${userRank.totalHours} hours (${userRank.totalMinutes} minutes)</div>
            `;
            rankResultDiv.className = "rank-search-result success";
        } else {
            rankResultDiv.innerHTML = "No study records yet. Start learning to get on the leaderboard!";
            rankResultDiv.className = "rank-search-result not-found";
        }
    } else {
        myStatsDiv.innerHTML = `<div>Please login to see your study stats.</div>`;
        rankResultDiv.innerHTML = `<div>Please login to see your rank.</div>`;
        rankResultDiv.className = "rank-search-result";
    }
    
    const weeklyRank = getRanking("week");
    document.getElementById("weeklyRank").innerHTML = weeklyRank.length ? `<ul class="rank-list">${weeklyRank.map(([name, mins], idx) => `<li><span class="rank-medal">${idx===0?'🥇':idx===1?'🥈':'🥉'}</span><span class="rank-name">${name}</span><span class="rank-hours">${Math.floor(mins/60)}h ${mins%60}m</span></li>`).join("")}</ul>` : "No study records this week";

    const monthlyRank = getRanking("month");
    document.getElementById("monthlyRank").innerHTML = monthlyRank.length ? `<ul class="rank-list">${monthlyRank.map(([name, mins], idx) => `<li><span class="rank-medal">${idx===0?'🥇':idx===1?'🥈':'🥉'}</span><span class="rank-name">${name}</span><span class="rank-hours">${Math.floor(mins/60)}h ${mins%60}m</span></li>`).join("")}</ul>` : "No study records this month";
}

function renderCourses() {
    fetch('courses.json')
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(data => {
            const accordionContainer = document.getElementById("coursesAccordion");
            if (!accordionContainer) return;

            const items = accordionContainer.querySelectorAll('.accordion-item');

            data.categories.forEach((cat, index) => {
                if (index >= items.length) return;

                const item = items[index];
                const titleSpan = item.querySelector('.accordion-header .category-title');
                if (titleSpan) {
                    titleSpan.textContent = cat.name;
                }

                const bodyDiv = item.querySelector('.accordion-body');
                if (!bodyDiv) return;

                let originalImages = cat.images || [];
                const imagesCount = originalImages.length;
                let displayImages = [];
                for (let i = 0; i < 10; i++) {
                    displayImages.push(originalImages[i % imagesCount]);
                }

                let imagesHtml = '<div class="row g-3">';
                displayImages.forEach(img => {
                    const imgSrc = typeof img === 'string' ? img : img.src;
                    const imgCaption = typeof img === 'string' ? `${cat.name} - Course Material` : img.caption;
                    const imgDesc = typeof img === 'string' ? 'No description available.' : (img.description || 'No description available.');

                    imagesHtml += `
                        <div class="col-xxl-15 col-xl-2 col-lg-3 col-md-4 col-sm-6">
                            <div class="course-image-card" data-src="${imgSrc}" data-caption="${escapeHtml(imgCaption)}" data-description="${escapeHtml(imgDesc)}">
                                <img src="${imgSrc}" alt="${cat.name}" class="img-fluid course-img">
                                <div class="course-overlay">
                                    <div class="course-overlay-title">${escapeHtml(imgCaption.length > 40 ? imgCaption.substring(0, 40) + '...' : imgCaption)}</div>
                                    <button class="course-overlay-btn">READ MORE</button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                imagesHtml += '</div>';

                bodyDiv.innerHTML = imagesHtml;
            });

            document.querySelectorAll(".course-image-card").forEach(card => {
                card.addEventListener("click", () => {
                    const imgSrc = card.getAttribute("data-src");
                    const imgCaption = card.getAttribute("data-caption");
                    const imgDesc = card.getAttribute("data-description");
                    showCourseDetailModal(imgSrc, imgCaption, imgDesc);
                });
            });
        })
        .catch(() => {
            const accordionContainer = document.getElementById("coursesAccordion");
            if (accordionContainer) {
                accordionContainer.innerHTML = '<p class="text-center text-danger">Failed to load courses. Please check courses.json file.</p>';
            }
        });
}

function getAllTimeRanking() {
    const userMap = new Map();
    studyRecords.forEach(rec => {
        const userName = rec.userName;
        const duration = rec.durationMin;
        userMap.set(userName, (userMap.get(userName) || 0) + duration);
    });
    return Array.from(userMap.entries()).sort((a, b) => b[1] - a[1]);
}

function getUserRank(userName) {
    if (!userName || userName.trim() === "") {
        return null;
    }
    const ranking = getAllTimeRanking();
    const targetName = userName.trim();
    const index = ranking.findIndex(([name]) => name === targetName);
    if (index === -1) return null;
    return {
        rank: index + 1,
        name: ranking[index][0],
        totalMinutes: ranking[index][1],
        totalHours: (ranking[index][1] / 60).toFixed(1)
    };
}

function showCourseDetailModal(imgSrc, title, description) {
    const modal = document.getElementById("courseDetailModal");
    const detailImg = document.getElementById("detailImg");
    const detailTitle = document.getElementById("detailTitle");
    const detailDesc = document.getElementById("detailDescription");
    
    if (!modal || !detailImg || !detailTitle || !detailDesc) return;
    
    detailImg.src = imgSrc;
    detailTitle.textContent = title;
    detailDesc.textContent = description || "No detailed description available for this course.";
    
    modal.classList.add("show");
    
    const closeModal = () => { modal.classList.remove("show"); };
    const closeBtn = document.getElementById("closeDetailModalBtn");
    const closeBtn2 = document.getElementById("detailCloseBtn");
    const favoriteBtn = document.getElementById("detailFavoriteBtn");
    
    if (closeBtn) closeBtn.onclick = closeModal;
    if (closeBtn2) closeBtn2.onclick = closeModal;
    
    if (favoriteBtn) {
        favoriteBtn.onclick = () => {
            const exists = favoriteImages.some(item => item.src === imgSrc);
            if (exists) {
                modal.classList.remove("show");
                setTimeout(() => { showModal("This course is already in your favorites!", false); }, 100);
            } else {
                addToFavorites(imgSrc, title);
                modal.classList.remove("show");
            }
        };
    }
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}

function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    var stringVal = String(str);
    return stringVal.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function renderAll() { renderSeats(); renderDashboard(); updateTotalAvailable(); renderCourses(); }

function autoCheckoutAllUsers() {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 23 || currentHour < 8) {
        let hasCheckedOut = false;
        seatsData.forEach(seat => {
            if (seat.status === "in-use") {
                const durationMin = Math.floor((Date.now() - seat.checkinTime) / 60000);
                if (durationMin > 0) {
                    const startDate = new Date(seat.checkinTime);
                    studyRecords.push({
                        userId: seat.currentUser, userName: seat.currentUser,
                        startTime: seat.checkinTime, endTime: Date.now(),
                        durationMin: durationMin, dateStr: startDate.toISOString().split('T')[0],
                        hour: startDate.getHours()
                    });
                }
                const key = `${seat.regionId}-${seat.seatId}`;
                if (activeTimers.has(key)) { clearInterval(activeTimers.get(key)); activeTimers.delete(key); }
                seat.status = "available";
                seat.currentUser = "";
                seat.checkinTime = null;
                hasCheckedOut = true;
            }
        });
        if (hasCheckedOut) { saveSeats(); saveRecords(); renderAll(); }
    }
}

function startAutoCheckoutTimer() { autoCheckoutAllUsers(); setInterval(autoCheckoutAllUsers, 5 * 60 * 1000); }

function initScrollFade() {
    const coursesSection = document.getElementById('coursesSection');
    const bookingSection = document.getElementById('bookingSection');
    if (!coursesSection && !bookingSection) return;
    
    function checkScroll() {
        const windowHeight = window.innerHeight;
        let shouldFade = false;
        
        if (coursesSection) {
            const coursesRect = coursesSection.getBoundingClientRect();
            if (coursesRect.top <= windowHeight && coursesRect.bottom >= 0) {
                const visibleTop = Math.max(0, coursesRect.top);
                const visibleBottom = Math.min(windowHeight, coursesRect.bottom);
                const visibleHeight = visibleBottom - visibleTop;
                const visibleRatio = visibleHeight / coursesRect.height;
                if (visibleRatio > 0.2) shouldFade = true;
            }
        }
        
        if (bookingSection && !shouldFade) {
            const bookingRect = bookingSection.getBoundingClientRect();
            if (bookingRect.top <= windowHeight && bookingRect.bottom >= 0) {
                const visibleTop = Math.max(0, bookingRect.top);
                const visibleBottom = Math.min(windowHeight, bookingRect.bottom);
                const visibleHeight = visibleBottom - visibleTop;
                const visibleRatio = visibleHeight / bookingRect.height;
                if (visibleRatio > 0.2) shouldFade = true;
            }
        }
        
        if (shouldFade) {
            document.body.classList.add('scroll-fade');
        } else {
            document.body.classList.remove('scroll-fade');
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    checkScroll();
}

var achievements = [
    { id: 1, name: 'Bronze Scholar', icon: '🥉', requiredHours: 50, currentHours: 0, unlocked: false },
    { id: 2, name: 'Silver Scholar', icon: '🥈', requiredHours: 100, currentHours: 0, unlocked: false },
    { id: 3, name: 'Gold Scholar', icon: '🥇', requiredHours: 200, currentHours: 0, unlocked: false },
    { id: 4, name: 'Diamond Scholar', icon: '💎', requiredHours: 500, currentHours: 0, unlocked: false }
];

function renderAchievements() {
    var container = document.getElementById('achievementsContainer');
    if (!container) return;
    
    if (!studyRecords || !currentUser || !currentUser.name) {
        container.innerHTML = '<div class="achievements-container"><div class="achievement-placeholder">Login to see achievements</div></div>';
        return;
    }
    
    var totalHours = getCurrentUserTotalHours();
    var html = '<div class="achievements-container">';
    
    for (var i = 0; i < achievements.length; i++) {
        var ach = achievements[i];
        var required = ach.requiredHours;
        var unlocked = totalHours >= required;
        var progressPercent = Math.min(100, (totalHours / required) * 100);
        var currentHours = Math.min(totalHours, required);
        
        if (unlocked && !ach.unlocked) {
            ach.unlocked = true;
            setTimeout(function(achName, achHours) {
                showModal('🎉 Achievement Unlocked! 🎉\n\nYou have earned the "' + achName + '" achievement for studying ' + achHours + ' hours!', false);
            }, 100, ach.name, required);
        }
        
        html += `
            <div class="achievement-item" onclick="showAchievementDetail(${i})">
                <div class="achievement-icon ${unlocked ? 'unlocked' : 'locked'}">
                    <span>${unlocked ? ach.icon : '🔒'}</span>
                </div>
                <div class="achievement-name">${ach.name}</div>
                ${!unlocked ? `
                    <div class="achievement-progress">
                        <div class="progress-bar-small">
                            <div class="progress-fill-small" style="width: ${progressPercent}%;"></div>
                        </div>
                        <span class="progress-text-small">${Math.floor(currentHours)}/${required}h</span>
                    </div>
                ` : `
                    <div class="achievement-status">
                        <span class="achieved-badge">✅ Achieved</span>
                    </div>
                `}
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

function getCurrentUserTotalHours() {
    if (!studyRecords || !currentUser || !currentUser.name) return 0;
    var totalMinutes = 0;
    for (var i = 0; i < studyRecords.length; i++) {
        if (studyRecords[i].userName === currentUser.name) {
            totalMinutes += studyRecords[i].durationMin;
        }
    }
    return totalMinutes / 60;
}

function showAchievementDetail(index) {
    var ach = achievements[index];
    var totalHours = getCurrentUserTotalHours();
    var unlocked = totalHours >= ach.requiredHours;
    
    if (unlocked) {
        showModal('🏆 ' + ach.name + ' 🏆\n\n' + ach.icon + ' You have studied ' + ach.requiredHours + ' hours!\n\nGreat achievement! Keep going!', false);
    } else {
        var remaining = ach.requiredHours - totalHours;
        var remainingFixed = remaining.toFixed(2);
        showModal('🔒 ' + ach.name + ' (Locked)\n\nProgress: ' + Math.floor(totalHours) + ' / ' + ach.requiredHours + ' hours\n\n' + remainingFixed + ' more hours needed to unlock this achievement.\nKeep studying!', false);
    }
}

function updateAchievements() {
    renderAchievements();
}

function init() {
    loadData();
    loadFavoritesFromStorage();
    loadCurrentUser(); 
    
    setTimeout(function() {
        renderAchievements();
    }, 200);
    
    renderAll();
    setInterval(() => renderDashboard(), 30000);
    startAutoCheckoutTimer();
    initScrollFade();

    const navLinksItems = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    navLinksItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            if (window.innerWidth < 992 && navbarToggler) {
                navbarToggler.click();
            }
        });
    });

    const userNameDisplay = document.getElementById("userNameDisplay");
    if (userNameDisplay) {
        userNameDisplay.addEventListener("click", () => {
            if (currentUser.isLoggedIn && currentUser.name) {
                showModal(`Are you sure you want to log out, ${currentUser.name}?`, false, (confirm) => {
                    if (confirm !== null) {
                        logout();
                    }
                });
            }
        });
    }

    loadBooks();
    initBookSearch();
}

window.seatsData = seatsData;
window.currentUser = currentUser;
window.studyRecords = studyRecords;

document.addEventListener('DOMContentLoaded', function() {
    window.dailyGoalVM = new Vue({
        el: '#dailyGoalApp',
        data: {
            dailyGoal: 0,
            currentDailyGoal: 0,
            currentProgress: 0,
            isStudying: false,
            goalCompleted: false,
            recentGoals: [],
            currentUserName: null,
            goalStartTime: null,
            timerInterval: null
        },
        computed: {
            progressPercent: function() {
                if (this.currentDailyGoal === 0) return 0;
                var percent = (this.currentProgress / this.currentDailyGoal) * 100;
                return percent > 100 ? 100 : percent;
            },
            goalAchieved: function() {
                return this.currentProgress >= this.currentDailyGoal && this.currentDailyGoal > 0;
            },
            goalStatusText: function() {
                if (this.goalCompleted) return '✅ Goal Completed!';
                if (this.isStudying) return '📖 Learning in progress...';
                if (this.currentProgress > 0 && !this.isStudying) return '⏸️ Paused';
                if (this.currentDailyGoal > 0) return '⏳ Ready to start? Set goal to begin.';
                return '';
            },
            goalStatusClass: function() {
                if (this.goalCompleted) return 'goal-status-completed';
                if (this.isStudying) return 'goal-status-active';
                if (this.currentProgress > 0 && !this.isStudying) return 'goal-status-paused';
                return 'goal-status-waiting';
            }
        },
        watch: {
            goalAchieved: function(newVal) {
                if (newVal && !this.goalCompleted) {
                    this.completeGoal();
                }
            }
        },
        methods: {
            getStorageKey: function() {
                if (currentUser.isLoggedIn && currentUser.name) {
                    return 'dailyGoal_data_' + currentUser.name;
                } else {
                    return 'dailyGoal_data_guest';
                }
            },
            startGoalTimer: function() {
                if (this.timerInterval) clearInterval(this.timerInterval);
                var self = this;
                this.timerInterval = setInterval(function() {
                    if (!self.isStudying || self.goalCompleted) return;
                    if (!self.goalStartTime) return;
                    var elapsedMinutes = (Date.now() - self.goalStartTime) / 60000;
                    var newProgress = Math.floor(elapsedMinutes);
                    if (newProgress !== self.currentProgress) {
                        self.currentProgress = newProgress;
                        self.$forceUpdate();
                        if (self.currentProgress >= self.currentDailyGoal) {
                            self.completeGoal();
                        }
                    }
                }, 1000);
            },
            completeGoal: function() {
                if (this.goalCompleted) return;
                this.goalCompleted = true;
                this.isStudying = false;
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                    this.timerInterval = null;
                }
                if (this.recentGoals.length > 0 && this.recentGoals[0].status === 'In Progress') {
                    this.recentGoals[0].status = 'Achieved';
                }
                this.saveToLocalStorage();
                window.showModal(`🎉 Congratulations! You achieved your goal of ${this.currentDailyGoal} minutes!`, false);
            },
            setGoal: function() {
                var inputGoal = this.dailyGoal;
                
                if (this.currentDailyGoal > 0 && !this.goalCompleted) {
                    var remaining = this.currentDailyGoal - this.currentProgress;
                    if (remaining < 0) remaining = 0;
                    window.showModal(`You have an unfinished goal (${remaining} minutes remaining). Please complete or cancel it before setting a new one.`, false);
                    this.dailyGoal = 0;
                    return;
                }
                
                if (inputGoal === null || inputGoal === undefined || inputGoal === "") {
                    window.showModal("Please enter a valid goal (positive integer).", false);
                    this.dailyGoal = 0;
                    return;
                }
                var rawValue = Number(inputGoal);
                if (isNaN(rawValue)) {
                    window.showModal("Please enter a valid number.", false);
                    this.dailyGoal = 0;
                    return;
                }
                var goalValue = Math.round(rawValue);
                if (Math.abs(goalValue - rawValue) > 0.001) {
                    window.showModal(`Your goal has been rounded to ${goalValue} minutes (integers only).`, false);
                }
                if (goalValue <= 0) {
                    window.showModal("Goal must be a positive integer (greater than 0 minutes).", false);
                    this.dailyGoal = 0;
                    return;
                }
                
                this.currentDailyGoal = goalValue;
                this.currentProgress = 0;
                this.goalCompleted = false;
                this.isStudying = true; 
                this.dailyGoal = 0;
                this.goalStartTime = Date.now();
                
                this.startGoalTimer();
                
                this.recentGoals.unshift({
                    date: new Date().toLocaleDateString(),
                    minutes: goalValue,
                    status: 'In Progress'
                });
                if (this.recentGoals.length > 10) this.recentGoals.pop();
                this.saveToLocalStorage();
                
                window.showModal(`Daily goal set to ${goalValue} minutes! Timer started now.`, false);
            },
            cancelGoal: function() {
                var self = this;
                window.showModal("Are you sure you want to cancel your current goal? All progress will be lost.", false, function(confirm) {
                    if (confirm !== null) {
                        if (self.timerInterval) {
                            clearInterval(self.timerInterval);
                            self.timerInterval = null;
                        }
                        self.currentDailyGoal = 0;
                        self.currentProgress = 0;
                        self.goalCompleted = false;
                        self.isStudying = false;
                        self.goalStartTime = null;
                        if (self.recentGoals.length > 0 && self.recentGoals[0].status === 'In Progress') {
                            self.recentGoals[0].status = 'Cancelled';
                        }
                        self.saveToLocalStorage();
                        window.showModal("Goal cancelled. You can set a new goal anytime.", false);
                    }
                });
            },
            startStudy: function() {},
            pauseStudy: function() {},
            updateProgress: function() {},
            resetOnNewSession: function() {},
            saveToLocalStorage: function() {
                var key = this.getStorageKey();
                localStorage.setItem(key, JSON.stringify({
                    currentDailyGoal: this.currentDailyGoal,
                    currentProgress: this.currentProgress,
                    isStudying: this.isStudying,
                    goalCompleted: this.goalCompleted,
                    recentGoals: this.recentGoals,
                    goalStartTime: this.goalStartTime
                }));
            },
            loadFromLocalStorage: function() {
                var self = this;
                var storedUser = localStorage.getItem("library_current_user");
                var newUserName = null;
                if (storedUser) {
                    try {
                        var user = JSON.parse(storedUser);
                        newUserName = user.name;
                    } catch(e) {}
                }
                
                if (newUserName !== this.currentUserName) {
                    this.currentUserName = newUserName;
                    var key = this.getStorageKey();
                    var saved = localStorage.getItem(key);
                    if (saved) {
                        try {
                            var data = JSON.parse(saved);
                            this.currentDailyGoal = data.currentDailyGoal || 0;
                            this.currentProgress = data.currentProgress || 0;
                            this.isStudying = data.isStudying || false;
                            this.goalCompleted = data.goalCompleted || false;
                            this.recentGoals = data.recentGoals || [];
                            this.goalStartTime = data.goalStartTime || null;
                            
                            if (this.currentDailyGoal > 0 && !this.goalCompleted && this.isStudying && this.goalStartTime) {
                                var elapsed = Math.floor((Date.now() - this.goalStartTime) / 60000);
                                this.currentProgress = Math.min(elapsed, this.currentDailyGoal);
                                if (this.currentProgress >= this.currentDailyGoal) {
                                    this.completeGoal();
                                } else {
                                    this.startGoalTimer();
                                }
                            } else {
                                if (this.timerInterval) clearInterval(this.timerInterval);
                            }
                        } catch(e) {
                            this.resetAllData();
                        }
                    } else {
                        this.resetAllData();
                    }
                } else {
                    if (this.currentDailyGoal > 0 && !this.goalCompleted && this.isStudying && !this.timerInterval && this.goalStartTime) {
                        this.startGoalTimer();
                    }
                }
            },
            resetAllData: function() {
                if (this.timerInterval) clearInterval(this.timerInterval);
                this.currentDailyGoal = 0;
                this.currentProgress = 0;
                this.isStudying = false;
                this.goalCompleted = false;
                this.recentGoals = [];
                this.goalStartTime = null;
            },
            showGoalProgress: function(goal) {
                if (this.recentGoals.length > 0 && this.recentGoals[0] === goal && !this.goalCompleted && this.currentDailyGoal > 0) {
                    var remaining = this.currentDailyGoal - this.currentProgress;
                    if (remaining < 0) remaining = 0;
                    var percent = Math.floor((this.currentProgress / this.currentDailyGoal) * 100);
                    window.showModal(`📊 Goal: ${goal.minutes} minutes\n✅ Completed: ${this.currentProgress} minutes (${percent}%)\n⏳ Remaining: ${remaining} minutes`, false);
                } else {
                    window.showModal(`📊 Goal: ${goal.minutes} minutes\n✅ Status: ${goal.status}\n📅 Date: ${goal.date}`, false);
                }
            }
        },
        mounted: function() {
            this.loadFromLocalStorage();
            setInterval(function() {
                if (window.dailyGoalVM && window.dailyGoalVM.currentDailyGoal > 0 && !window.dailyGoalVM.goalCompleted && window.dailyGoalVM.isStudying) {
                    window.dailyGoalVM.$forceUpdate();
                }
            }, 60000);
        }
    });
});

let allBooks = [];
let booksFiltered = [];

function loadBooks() {
    fetch('books.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText} — The file does not exist or the path is incorrect`);
            }
            return response.json();
        })
        .then(data => {
            allBooks = data;
            booksFiltered = [...allBooks];
            renderBooksTable(booksFiltered);
        })
        .catch(error => {
            console.error('Failed to load the book:', error);
            const tbody = document.getElementById('booksTableBody');
            const countSpan = document.getElementById('booksCount');
            if (countSpan) countSpan.textContent = '0 books found';
        });
}

function renderBooksTable(books) {
    const tbody = document.getElementById('booksTableBody');
    const countSpan = document.getElementById('booksCount');
    if (!tbody) return;
    
    if (!books || books.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No books match your search.</td></tr>';
        if (countSpan) countSpan.textContent = '0 books found';
        return;
    }
    
    let html = '';
    books.forEach(book => {
        html += `
            <tr>
                <td>${escapeHtml(book.id)}</td>
                <td>${escapeHtml(book.title)}</td>
                <td>${escapeHtml(book.author)}</td>
                <td>${escapeHtml(book.type)}</td>
                <td>${escapeHtml(book.available)}</td>
                <td>${escapeHtml(book.borrowed)}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
    if (countSpan) {
        countSpan.textContent = `${books.length} book${books.length !== 1 ? 's' : ''} found`;
    }
}

let searchDebounceTimer;
function filterBooks(searchTerm) {
    if (!allBooks.length) return;
    const term = searchTerm.trim().toLowerCase();
    if (term === '') {
        booksFiltered = [...allBooks];
    } else {
        booksFiltered = allBooks.filter(book => 
            book.title.toLowerCase().includes(term) || 
            book.author.toLowerCase().includes(term) ||
            book.type.toLowerCase().includes(term)
        );
    }
    renderBooksTable(booksFiltered);
}

function initBookSearch() {
    const searchInput = document.getElementById('bookSearchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            filterBooks(e.target.value);
        }, 300);
    });
}


init();