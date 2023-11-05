<script lang="ts">
	import Control from '$lib/components/Control.svelte'
	import Marker from '$lib/components/Marker.svelte'
	import Popup from '$lib/components/Popup.svelte'
	import { Layer, Map, Source } from '$lib/index.js'
	import { NavigationControl, ScaleControl } from 'mapbox-gl'
	import CityPopup from './CityPopup.svelte'
</script>

<div class="maps">
	<div class="map">
		<h2>Marker + Popup</h2>

		<Map
			style="height: 80vh"
			map={{
				accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
				style: 'mapbox://styles/mapbox/streets-v12',
				center: [12.550343, 55.665957],
				zoom: 8,
				attributionControl: false,
			}}
		>
			<Control position="bottom-left" control={new ScaleControl()} />
			<Control position="bottom-right" control={new NavigationControl()} />
			<Marker lngLat={[12.550343, 55.665957]}>
				<Popup>Blue marker popup</Popup>
			</Marker>
			<Marker lngLat={[12.65147, 55.608166]} marker={{ color: 'black', rotation: 45 }}>
				<Popup>Black tilted marker popup</Popup>
			</Marker>
		</Map>
	</div>
	<div class="map">
		<h2>Layer + Custom Popups</h2>

		<Map
			style="height: 80vh"
			map={{
				accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
				style: 'mapbox://styles/mapbox/streets-v12',
				attributionControl: false,
			}}
		>
			<Source
				id="points"
				source={{
					type: 'geojson',
					data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_populated_places_simple.geojson',
				}}
			>
				<Layer
					layer={{
						id: 'points',
						type: 'circle',
						paint: { 'circle-color': 'red' },
					}}
				>
					<CityPopup />
				</Layer>
			</Source>
		</Map>
	</div>
</div>

<style>
	.maps {
		padding: 1rem;

		display: flex;
		gap: 1rem;
		flex-direction: column;
	}
	h2 {
		text-align: center;
	}
</style>
