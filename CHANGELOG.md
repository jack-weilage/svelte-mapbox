# svelte-mapbox

## 0.4.1

### Patch Changes

- 80fe7ca: Fixed a rather annoying bug with `<Layer />` where the `options` prop wouldn't recognize the `paint` property (Fixes #8)

## 0.4.0

### Minor Changes

- 585bbe7: Actually re-export the `<Control />` component (this took me nearly 2 months to notice)

## 0.3.1

### Patch Changes

- eaa3b84: `options` is now optional (ha) for `<Image />`
- 0e7c061: `image` parameter is now `src` for `<Image />`

## 0.3.0

### Minor Changes

- 6f6bc48: Upgrade `mapbox-gl` to `^3.0.0`

### Patch Changes

- 5f75ea3: Update all minor dependencies

## 0.2.1

### Patch Changes

- f97971e: Actually export `<Image />` (oops)

## 0.2.0

### Minor Changes

- 54e2251: Add `Image` component

### Patch Changes

- d186709: Add MIT license
- 3814ff3: Add repository information to package.json

## 0.1.0

### Minor Changes

- b830a93: Export element-specific data via a store (context keys are no longer required to access data) and change from element-specific props to `options`
- 8965324: Add `Control` component
