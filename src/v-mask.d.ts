declare module 'v-mask' {
  const VueMaskPlugin: {
    install(vue: typeof Vue): void;
  };

  export default VueMaskPlugin;
}