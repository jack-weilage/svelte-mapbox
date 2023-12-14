# svelte-mapbox

## Components

### Proxy Components

Proxy components act as convenient wrappers for necessary boilerplate.

- Image ([Mapbox reference](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addimage))
- Map ([Mapbox reference](https://docs.mapbox.com/mapbox-gl-js/api/map/))
- Source ([Mapbox reference](https://docs.mapbox.com/mapbox-gl-js/api/sources/))
- Layer ([Mapbox reference](https://docs.mapbox.com/style-spec/reference/layers/))

### DOM Components

DOM components add necessary DOM elements and bind them to `mapbox-gl`.

- Marker ([Mapbox reference](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker))
- Popup ([Mapbox reference](https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup))
- Control ([Mapbox reference](https://docs.mapbox.com/mapbox-gl-js/api/markers/#icontrol))

## Getting Started

Install via NPM/PNPM/Yarn/Bun:

```sh
npm install svelte-mapbox --save
```

Import and use components:

```jsx
<script>
    import { Map, Source, Marker, Popup } from 'svelte-mapbox'
</script>

<Map options={{
    accessToken: 'YOUR_MAPBOX_ACCESS_TOKEN'
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [12.550343, 55.665957],
    zoom: 8,
}}>
    <Marker lngLat={[12.550343, 55.665957]}>
        <Popup>Blue marker popup</Popup>
    </Marker>
    <Marker lngLat={[12.65147, 55.608166]} options={{ color: 'black', rotation: 45 }}>
        <Popup>Black tilted marker popup</Popup>
    </Marker>
</Map>
```

## API Design

`svelte-mapbox` attempts to stick as close as possible to the official Mapbox API, but there are some differences. If you know `mapbox-gl`, you should know `svelte-mapbox`.

Generally, if you can add something to a `Map` object, you can import it as a component. If you can specify options for that thing, you can pass them as `options` to the component.

If you can call a `set` method on an object, you can pass it as a prop. As an example, calling `setLngLat` can be replaced with the `lngLat` prop.

If you want to simply access the underlying object, you can use `bind:[component type]`. As an example, `bind:map` returns the `Map` object.
