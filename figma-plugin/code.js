// Scorecard Token Import: Figma Plugin
// Reads design-tokens.json format and creates/updates Figma Variables.

figma.showUI(__html__, { width: 400, height: 380 });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'import') return;

  try {
    const tokens = msg.tokens;
    const sc = tokens.scorecard;
    let created = 0;
    let updated = 0;

    // ── Helper: find or create a variable collection ──────────
    async function getOrCreateCollection(name) {
      const collections = await figma.variables.getLocalVariableCollectionsAsync();
      const existing = collections.find((c) => c.name === name);
      if (existing) return existing;
      return figma.variables.createVariableCollection(name);
    }

    // ── Helper: find or create a variable in a collection ─────
    async function getOrCreateVariable(collection, name, type) {
      const allVars = await figma.variables.getLocalVariablesAsync(type);
      const existing = allVars.find(
        (v) => v.name === name && v.variableCollectionId === collection.id
      );
      if (existing) return { variable: existing, isNew: false };
      const variable = figma.variables.createVariable(name, collection, type);
      return { variable, isNew: true };
    }

    // ── Helper: ensure a mode exists on a collection ──────────
    function ensureMode(collection, modeName) {
      const existing = collection.modes.find((m) => m.name === modeName);
      if (existing) return existing.modeId;
      return collection.addMode(modeName);
    }

    // ── Helper: hex string to Figma RGBA ──────────────────────
    function hexToRGBA(hex) {
      const h = hex.replace('#', '');
      return {
        r: parseInt(h.slice(0, 2), 16) / 255,
        g: parseInt(h.slice(2, 4), 16) / 255,
        b: parseInt(h.slice(4, 6), 16) / 255,
        a: 1,
      };
    }

    // ── 1. Colors (with Light + Dark modes) ───────────────────
    if (sc.colors) {
      const col = await getOrCreateCollection('Scorecard/Colors');

      const defaultModeId = col.modes[0].modeId;
      if (col.modes[0].name !== 'Light') {
        col.renameMode(defaultModeId, 'Light');
      }
      const lightModeId = defaultModeId;
      const darkModeId = ensureMode(col, 'Dark');

      const lightColors = sc.colors.light || {};
      const darkColors = sc.colors.dark || {};

      for (const [key, token] of Object.entries(lightColors)) {
        const name = token.description || key;
        const { variable, isNew } = await getOrCreateVariable(col, name, 'COLOR');
        if (token.value) {
          variable.setValueForMode(lightModeId, hexToRGBA(token.value));
        }
        const darkToken = darkColors[key];
        if (darkToken && darkToken.value) {
          variable.setValueForMode(darkModeId, hexToRGBA(darkToken.value));
        }
        if (isNew) created++;
        else updated++;
      }
    }

    // ── 2. Sizing ─────────────────────────────────────────────
    if (sc.sizing) {
      const col = await getOrCreateCollection('Scorecard/Sizing');
      const modeId = col.modes[0].modeId;

      for (const [key, token] of Object.entries(sc.sizing)) {
        const name = token.description || key;
        const { variable, isNew } = await getOrCreateVariable(col, name, 'FLOAT');
        variable.setValueForMode(modeId, Number(token.value));
        if (isNew) created++;
        else updated++;
      }
    }

    // ── 3. Strokes ────────────────────────────────────────────
    if (sc.strokes) {
      const col = await getOrCreateCollection('Scorecard/Strokes');
      const modeId = col.modes[0].modeId;

      for (const [key, token] of Object.entries(sc.strokes)) {
        const { variable, isNew } = await getOrCreateVariable(col, key, 'FLOAT');
        variable.setValueForMode(modeId, Number(token.value));
        if (isNew) created++;
        else updated++;
      }
    }

    // ── 4. Typography ─────────────────────────────────────────
    if (sc.typography) {
      const col = await getOrCreateCollection('Scorecard/Typography');
      const modeId = col.modes[0].modeId;

      for (const [group, groupTokens] of Object.entries(sc.typography)) {
        for (const [key, token] of Object.entries(groupTokens)) {
          const name = group + '/' + key;
          if (token.type === 'fontFamilies') {
            const { variable, isNew } = await getOrCreateVariable(col, name, 'STRING');
            variable.setValueForMode(modeId, String(token.value));
            if (isNew) created++;
            else updated++;
          } else {
            const { variable, isNew } = await getOrCreateVariable(col, name, 'FLOAT');
            variable.setValueForMode(modeId, Number(token.value));
            if (isNew) created++;
            else updated++;
          }
        }
      }
    }

    figma.ui.postMessage({
      type: 'done',
      message: `Done! ${created} created, ${updated} updated.`,
    });
  } catch (e) {
    figma.ui.postMessage({
      type: 'done',
      message: 'Error: ' + e.message,
    });
  }
};
