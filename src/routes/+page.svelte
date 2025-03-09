<script>
	let isButtonDisabled = true;
	let isLoading = false;
	let error = '';
	let successMessage = '';
	let coords = { lat: null, lng: null };

	async function getLocation() {
		isLoading = true;
		error = '';
		successMessage = '';

		try {
			const position = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject);
			});

			coords = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			const isValid = await sendToBackend(coords);
			isButtonDisabled = !isValid;
			successMessage = isValid ? 'Lokasi valid! 🎉' : 'Lokasi tidak valid ❌';
		} catch (err) {
			error = err.message.includes('denied')
				? 'Izin lokasi ditolak, aktifkan di browser settings'
				: 'Error mengambil lokasi';
		} finally {
			isLoading = false;
		}
	}

	async function sendToBackend(coords) {
		const response = await fetch('/api/check-location', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(coords)
		});

		const { valid } = await response.json();
		return valid;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
	<div class="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
		<h1 class="text-center text-3xl font-bold text-gray-800">Location Checker</h1>

		{#if error}
			<div class="rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
				{error}
			</div>
		{/if}

		{#if successMessage}
			<div class="rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-green-700">
				<p>{successMessage}</p>
				<p class="mt-2 text-sm">
					Koordinat Anda:
					<span class="font-mono">{coords.lat}, {coords.lng}</span>
				</p>
			</div>
		{/if}

		<button
			on:click={getLocation}
			class="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all
               duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={isLoading}
		>
			{#if isLoading}
				<div class="flex items-center justify-center gap-2">
					<div class="h-5 w-5 rounded-full border-2 border-white border-t-transparent">
						Memproses...
					</div>
				</div>
			{:else}
				Ambil Lokasi Saya 🌍
			{/if}
		</button>

		<button
			class="w-full rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white
               transition-all duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={isButtonDisabled}
		>
			Lanjutkan ke Pembayaran 💸
		</button>
	</div>
</div>
