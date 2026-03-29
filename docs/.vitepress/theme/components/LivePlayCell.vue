<template>
  <div class="live-cell-wrapper">
    <iframe
      v-if="iframeSrc"
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
  data() {
    return { iframeSrc: '' };
  },
  mounted() {
    // Build iframe URL only on client side to avoid SSR hydration mismatch
    const base = window.location.hostname === 'localhost'
      ? 'http://localhost:5173'
      : 'https://baseballscorecard.org';
    const t = this.theme || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    this.iframeSrc = `${base}/examples.html?show=${this.example}&theme=${t}`;

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
