<template>
  <div class="live-cell-wrapper">
    <iframe
      :src="iframeSrc"
      :width="size"
      :height="size + 30"
      frameborder="0"
      scrolling="no"
      class="live-cell-frame"
    ></iframe>
  </div>
</template>

<script>
export default {
  props: {
    example: { type: String, required: true },
    size: { type: Number, default: 200 },
    theme: { type: String, default: '' },
  },
  computed: {
    iframeSrc() {
      const base = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:5173'
        : 'https://baseballscorecard.org';
      const t = this.theme || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light');
      return `${base}/examples.html?show=${this.example}&theme=${t}`;
    },
  },
  mounted() {
    // Re-set iframe theme when VitePress toggles dark mode
    this._observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      const frame = this.$el?.querySelector('iframe');
      if (frame?.contentWindow) {
        frame.contentWindow.postMessage(isDark ? 'dark' : 'light', '*');
      }
    });
    this._observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  },
  beforeUnmount() {
    if (this._observer) this._observer.disconnect();
  },
}
</script>

<style scoped>
.live-cell-wrapper { display: inline-flex; flex-direction: column; align-items: center; }
.live-cell-frame { border: none; border-radius: 4px; overflow: hidden; }
</style>
