export const Colors = {
  white: '#FFFFFF',

  // Vibrant purple family
  deepPurple: '#2D0B59',
  royalPurple: '#3A0CA3',
  electricPurple: '#7209B7',
  hotPink: '#F72585',

  // Icon gradient
  neonViolet: '#7F00FF',
  neonMagenta: '#E100FF',
};

export const Gradients = {
  // Main background gradient
  background: [Colors.royalPurple, Colors.electricPurple, Colors.hotPink] as const,

  // “Icon tile” gradient
  icon: [Colors.neonViolet, Colors.neonMagenta] as const,
};
