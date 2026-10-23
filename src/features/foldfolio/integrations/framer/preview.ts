// Only Framer's editor APIs are stubbed; the device runs as a normal React component.
export const RenderTarget = {
  current: () => 'preview',
  canvas: 'canvas',
  thumbnail: 'thumbnail',
}

export const ControlType = {
  Enum: 'enum', Slot: 'slot', Array: 'array', ResponsiveImage: 'image',
  Color: 'color', Object: 'object', Boolean: 'boolean', Number: 'number', String: 'string',
}

export function addPropertyControls(..._args: unknown[]) {}
